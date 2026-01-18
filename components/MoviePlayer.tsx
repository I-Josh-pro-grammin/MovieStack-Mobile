import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MoviePlayerProps {
  tmdbId: string;
  title: string;
  onClose: () => void;
}

const MoviePlayer = ({ tmdbId, title, onClose }: MoviePlayerProps) => {
  const [loading, setLoading] = useState(true);

  // Vidsrc URL for the movie
  const streamUrl = `https://vidsrc.xyz/embed/movie/${tmdbId}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>

      <View style={styles.webviewContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#eb8c33" />
            <Text style={styles.loadingText}>Connecting to streaming provider...</Text>
          </View>
        )}

        <WebView
          source={{ uri: streamUrl }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          allowsFullscreenVideo
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          // Basic ad blocking/behavioral control
          allowsInlineMediaPlayback={true}
          onShouldStartLoadWithRequest={(request) => {
            // Block external navigation attempts (mostly ads)
            if (request.url.includes('vidsrc') || request.url.includes('google') || request.url.includes('about:blank')) {
              return true;
            }
            // Often ads try to open new domains
            return false;
          }}
        />
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
    zIndex: 2000,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
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
  webviewContainer: {
    height: '80%',
    width: '100%',
  },

  webview: {
    backgroundColor: '#000',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 14,
    opacity: 0.7,
  }
});

export default MoviePlayer;
