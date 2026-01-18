import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  title: string;
  onClose: () => void;
}

const VideoPlayer = ({ uri, title, onClose }: VideoPlayerProps) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFile = async () => {
      console.log('🧐 Checking video file at:', uri);
      try {
        // If it's a content:// or ph:// URI, getInfoAsync might not work directly
        // but for file:/// it will.
        if (uri.startsWith('file:///')) {
          const info = await FileSystem.getInfoAsync(uri);
          if (!info.exists) {
            console.error('❌ File does not exist at path:', uri);
            setError('The video file could not be found. Please try re-downloading.');
            setLoading(false);
            return;
          }
          console.log('✅ File found! Size:', (info as any).size, 'bytes');
        }
      } catch (e) {
        console.warn('⚠️ Could not verify file existence:', e);
      }
    };

    checkFile();
  }, [uri]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>

      <View style={styles.videoContainer}>
        {loading && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#eb8c33" />
            <Text style={{ color: 'white', marginTop: 10 }}>Loading movie...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="alert-circle" size={64} color="#ef4444" />
            <Text style={{ color: 'white', textAlign: 'center', marginHorizontal: 40, marginTop: 10 }}>{error}</Text>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 20, backgroundColor: '#eb8c33', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Video
            ref={video}
            style={styles.video}
            source={{ uri }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={status => {
              setStatus(() => status);
              if (status.isLoaded) {
                setLoading(false);
              }
            }}
            shouldPlay
            onError={(err) => {
              console.error('🎬 Video Player Error:', err);
              setError('Failed to play video. The format might be unsupported or the file is corrupted.');
              setLoading(false);
            }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.filename}>{uri}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
    paddingBottom: 15,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    // justifyContent: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 9) / 16, // 16:9 aspect ratio
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filename: {
    color: '#666',
    fontSize: 10,
  }
});

export default VideoPlayer;
