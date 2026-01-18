import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const db = SQLite.openDatabaseSync('downloads.db');

export interface DownloadedMovie {
  id: string;
  title: string;
  poster_path: string;
  local_uri: string;
  download_date: string;
}

export interface ActiveDownload {
  id: string;
  title: string;
  poster_path: string;
  progress: number;
}

// Global state for active downloads
const activeDownloads = new Map<string, ActiveDownload>();
const listeners = new Set<(active: ActiveDownload[]) => void>();

const notifyListeners = () => {
  const activeList = Array.from(activeDownloads.values());
  listeners.forEach(listener => listener(activeList));
};

export const subscribeToDownloads = (listener: (active: ActiveDownload[]) => void) => {
  listeners.add(listener);
  listener(Array.from(activeDownloads.values()));
  return () => listeners.delete(listener);
};

export const getActiveDownloads = () => Array.from(activeDownloads.values());

// Initialize database
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS downloads (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      local_uri TEXT NOT NULL,
      download_date TEXT NOT NULL
    );
  `);
};

export const startDownload = async (
  movie: any,
  onProgress?: (progress: number) => void
) => {
  const movieId = movie.id.toString();

  if (activeDownloads.has(movieId)) {
    Alert.alert('Download In Progress', 'This movie is already being downloaded.');
    return;
  }

  // Request media library permissions first
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'We need permission to save movies to your gallery.');
    return;
  }

  try {
    // For demo purposes, we use a sample video URL
    // In a real app, you would fetch a direct file URL from your backend or a provider
    const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    const fileExtension = videoUrl.split('.').pop();
    const fileName = `${movie.id}.${fileExtension}`;
    const localUri = `${FileSystem.documentDirectory}downloads/${fileName}`;

    // Initialize active download status
    activeDownloads.set(movieId, {
      id: movieId,
      title: movie.title,
      poster_path: movie.poster_path,
      progress: 0
    });
    notifyListeners();

    // Ensure the folder exists
    const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}downloads`);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}downloads`, { intermediates: true });
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      localUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;

        // Update global state
        const active = activeDownloads.get(movieId);
        if (active) {
          active.progress = progress;
          notifyListeners();
        }

        if (onProgress) onProgress(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (result) {
      // 1. Save to Gallery (for user visibility in BlueStacks)
      try {
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        const album = await MediaLibrary.getAlbumAsync('Movies');
        if (album === null) {
          await MediaLibrary.createAlbumAsync('Movies', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (e) {
        console.warn('Gallery save failed, but internal download succeeded:', e);
      }

      // 2. Save INTERNAL path to SQLite (always works for playback)
      db.runSync(
        'INSERT OR REPLACE INTO downloads (id, title, poster_path, local_uri, download_date) VALUES (?, ?, ?, ?, ?)',
        [movieId, movie.title, movie.poster_path, result.uri, new Date().toISOString()]
      );

      activeDownloads.delete(movieId);
      notifyListeners();
      return result.uri;
    }
  } catch (error) {
    activeDownloads.delete(movieId);
    notifyListeners();
    console.error('Download error:', error);
    Alert.alert('Download Failed', 'Could not download the movie.');
    throw error;
  }
};

export const getDownloads = (): DownloadedMovie[] => {
  return db.getAllSync('SELECT * FROM downloads ORDER BY download_date DESC') as DownloadedMovie[];
};

export const deleteDownload = async (id: string, localUri: string) => {
  try {
    // Note: If localUri is a MediaLibrary URI, standard FileSystem delete might not work.
    // However, usually deleting the cache file is enough if we want to remove it from our app.
    // To truly delete from gallery, we'd need MediaLibrary.deleteAssetsAsync.
    // For now we just remove from DB.
    db.runSync('DELETE FROM downloads WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

export const isMovieDownloaded = (id: string): boolean => {
  const result = db.getFirstSync('SELECT id FROM downloads WHERE id = ?', [id.toString()]);
  return !!result;
};

export const getDownloadedMovie = (id: string): DownloadedMovie | null => {
  return db.getFirstSync('SELECT * FROM downloads WHERE id = ?', [id.toString()]) as DownloadedMovie | null;
};
