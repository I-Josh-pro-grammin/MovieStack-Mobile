import VideoPlayer from '@/components/VideoPlayer';
import { ActiveDownload, deleteDownload, DownloadedMovie, getDownloads, subscribeToDownloads } from '@/services/download';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const DownloadsScreen = () => {
  const [downloads, setDownloads] = useState<DownloadedMovie[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<ActiveDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<{ uri: string; title: string } | null>(null);
  const router = useRouter();
  console.log(playingVideo);

  const fetchDownloads = () => {
    try {
      const data = getDownloads();
      setDownloads(data);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();

    // Subscribe to active downloads
    const unsubscribe = subscribeToDownloads((active) => {
      setActiveDownloads(active);
      // If a download finished, refresh the local list
      if (active.length === 0) {
        fetchDownloads();
      }
    });

    return () => { unsubscribe(); };
  }, []);

  const handleDelete = async (id: string, localUri: string) => {
    const success = await deleteDownload(id, localUri);
    if (success) {
      fetchDownloads();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const renderActiveDownload = ({ item }: { item: ActiveDownload }) => (
    <View className="bg-accent/10 rounded-xl overflow-hidden mb-4 p-3 border border-accent/20">
      <View className="flex-row items-center">
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          className="w-16 h-24 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-center">
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-accent text-xs mt-1 font-bold">
            Downloading... {Math.round(item.progress * 100)}%
          </Text>

          <View className="w-full h-2 bg-dark-300 rounded-full mt-3 overflow-hidden">
            <View
              className="h-full bg-accent"
              style={{ width: `${item.progress * 100}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderDownloadedMovie = ({ item }: { item: DownloadedMovie }) => (
    <View className="bg-dark-200 rounded-xl overflow-hidden mb-4 flex-row items-center p-3 border border-dark-100">
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        className="w-20 h-28 rounded-lg"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-white text-lg font-bold" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-gray-400 text-xs mt-1">
          Downloaded on {new Date(item.download_date).toLocaleDateString()}
        </Text>

        <View className="flex-row mt-3 gap-x-3">
          <TouchableOpacity
            className="bg-accent px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => {
              setPlayingVideo({ uri: item.local_uri, title: item.title });
            }}
          >
            <Ionicons name="play" size={16} color="white" />
            <Text className="text-white text-xs font-bold ml-1">Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500/20 px-4 py-2 rounded-lg flex-row items-center border border-red-500/30"
            onPress={() => handleDelete(item.id, item.local_uri)}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
            <Text className="text-red-500 text-xs font-bold ml-1">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-primary px-5 pt-10">
      <Text className="text-white text-2xl font-bold mb-5">My Downloads</Text>

      {activeDownloads.length === 0 && downloads.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="download-outline" size={64} color="gray" />
          <Text className="text-gray-400 mt-4 text-lg">No downloads yet.</Text>
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="mt-5 bg-accent px-6 py-2 rounded-full"
          >
            <Text className="text-white font-bold">Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          {activeDownloads.length > 0 && (
            <View className="mb-6">
              <Text className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Active Downloads</Text>
              {activeDownloads.map(item => (
                <View key={item.id}>
                  {renderActiveDownload({ item })}
                </View>
              ))}
            </View>
          )}

          <FlatList
            data={downloads}
            keyExtractor={(item) => item.id}
            renderItem={renderDownloadedMovie}
            ListHeaderComponent={downloads.length > 0 ? (
              <Text className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Completed</Text>
            ) : null}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      )}

      {playingVideo && (
        <VideoPlayer
          uri={playingVideo.uri}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </View>
  );
};

export default DownloadsScreen;
