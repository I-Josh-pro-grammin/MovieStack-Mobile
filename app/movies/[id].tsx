import { icons } from '@/React Native Movie App (assets)/constants/icons';
import MoviePlayer from '@/components/MoviePlayer';
import VideoPlayer from '@/components/VideoPlayer';
import { fetchMovieDetails } from '@/services/api';
import { isMovieSaved as appwriteCheckSaved, saveMovie as appwriteSave, unsaveMovie as appwriteUnsave, getCurrentUser } from '@/services/appwrite';
import { ActiveDownload, getDownloadedMovie, isMovieDownloaded, startDownload, subscribeToDownloads } from '@/services/download';
import useFetch from '@/services/useFetch';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className='flex-col items-start mt-5'>
      <Text className='text-white text-sm'>{label}</Text>
      <Text className='text-white text-sm mt-2 font-bold'>{value || 'N/A'}</Text>
    </View>
  )
}

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [togglingSave, setTogglingSave] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<{ uri: string; title: string } | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string))

  useEffect(() => {
    const checkStatus = async () => {
      if (movie) {
        setDownloaded(isMovieDownloaded(movie.id.toString()));
        const savedDoc = await appwriteCheckSaved(movie.id.toString());
        if (savedDoc) {
          setIsSaved(true);
          setSavedDocId(savedDoc.$id);
        }
      }
    };

    checkStatus();

    // Subscribe to global progress to stay in sync
    const unsubscribe = subscribeToDownloads((active: ActiveDownload[]) => {
      const currentDownload = active.find((d: ActiveDownload) => d.id === (id as string));
      if (currentDownload) {
        setDownloading(true);
        setProgress(currentDownload.progress);
      } else {
        // If it was downloading but now it's gone, check if it's finished
        if (downloading) {
          setDownloading(false);
          setDownloaded(isMovieDownloaded(id as string));
        }
      }
    });

    return () => { unsubscribe(); };
  }, [movie, id, downloading]);

  const handleDownload = async () => {
    if (downloaded) {
      // If downloaded, play instead
      handlePlay();
      return;
    }

    setDownloading(true);
    try {
      console.log('Download started for movie:', movie);
      await startDownload(movie, (p: number) => setProgress(p));
      setDownloaded(true);
      Alert.alert('Success', 'Movie downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', 'There was an error downloading the movie.');
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const handlePlay = () => {
    const downloadedMovie = getDownloadedMovie(id as string);
    if (downloadedMovie) {
      setPlayingVideo({ uri: downloadedMovie.local_uri, title: downloadedMovie.title });
    } else {
      Alert.alert('Error', 'Could not find downloaded movie file.');
    }
  };

  const handleSaveToggle = async () => {
    if (!movie) return;
    setTogglingSave(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Login Required', 'Please login to save movies to your library.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/login') }
        ]);
        return;
      }

      if (isSaved && savedDocId) {
        await appwriteUnsave(savedDocId);
        setIsSaved(false);
        setSavedDocId(null);
      } else {
        const res = await appwriteSave(movie);
        setIsSaved(true);
        if (res) {
          setSavedDocId(res.$id);
        }
        Alert.alert('Success', 'Movie saved to your library!');
      }
    } catch (error) {
      console.error('Save toggle error:', error);
      Alert.alert('Error', 'Failed to update saved status.');
    } finally {
      setTogglingSave(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#eb8c33" />
      </View>
    );
  }

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: 250
      }}>
        <View>
          <Image source={{ uri: movie?.poster_path ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}` : 'https://placehold.co/600x400/303030/ffffff.png' }} className='w-full h-[550px]' resizeMode='stretch' />
        </View>
        <View className='flex-col items-start justify-center mt-5 px-5'>
          <View className='flex-row justify-between items-center w-full'>
            <View className='flex-1'>
              <Text className='text-white text-xl font-bold'>{movie?.title}</Text>
            </View>

            <View className='flex-row gap-x-4 items-center'>
              <TouchableOpacity
                onPress={handleSaveToggle}
                disabled={togglingSave}
                className={`p-3 rounded-full ${isSaved ? 'bg-accent/20' : 'bg-dark-100'}`}
              >
                {togglingSave ? (
                  <ActivityIndicator size="small" color="#eb8c33" />
                ) : (
                  <Ionicons
                    name={isSaved ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color="#eb8c33"
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownload}
                disabled={downloading}
                className={`p-3 rounded-full ${downloaded ? 'bg-green-500/20' : 'bg-accent/20'}`}
              >
                {downloading ? (
                  <View className='items-center justify-center'>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className='text-white text-[8px] mt-1'>{Math.round(progress * 100)}%</Text>
                  </View>
                ) : (
                  <Ionicons
                    name={downloaded ? "play-circle" : "download-outline"}
                    size={24}
                    color={downloaded ? "#22c55e" : "#eb8c33"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className='flex-row items-center gap-x-1 mt-2 '>
            <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
          </View>

          <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
            <Image source={icons.star} className='size-4' />
            <Text className='text-white text-sm'>{Math.round(movie?.vote_average || 0)} / 10</Text>
            <Text className='text-light-200 text-sm'>{movie?.vote_count} votes</Text>
          </View>

          <MovieInfo label='Overview' value={movie?.overview} />
          <MovieInfo label='Genre' value={movie?.genres?.map((g: any) => g.name).join(' - ') || 'N/A'} />

          <View className='flex flex-row justify-between w-full'>
            {
              movie?.budget ? (
                <MovieInfo label='Budget' value={`$${Math.round(movie?.budget / 1000000)}M`} />
              ) : null
            }
            {
              movie?.revenue ? (
                <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue / 1000000)}M`} />
              ) : null
            }
          </View>

          <MovieInfo label='Production Companies' value={movie?.production_companies?.map((g: any) => g.name).join(' - ') || 'N/A'} />
        </View>
      </ScrollView>

      <View className='absolute bottom-10 bg-opacity-20 left-0 right-0 p-5 bg-primary/95 border-t border-dark-100 flex-col gap-y-3'>
        <TouchableOpacity
          className='bg-accent rounded-lg py-4 flex flex-row items-center justify-center'
          onPress={() => setIsStreaming(true)}
        >
          <Ionicons name="play" size={20} color="white" />
          <Text className='text-white text-base font-bold ml-2'>Watch Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-dark-100 rounded-lg py-3 flex flex-row items-center justify-center'
          onPress={() => router.back()}
        >
          <Image source={icons.arrow} className='size-4 rotate-180' tintColor='gray' />
          <Text className='text-gray-400 text-sm font-medium ml-2'>Go Back</Text>
        </TouchableOpacity>
      </View>

      {playingVideo && (
        <VideoPlayer
          uri={playingVideo.uri}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      {isStreaming && movie && (
        <MoviePlayer
          tmdbId={movie.id.toString()}
          title={movie.title}
          onClose={() => setIsStreaming(false)}
        />
      )}
    </View>
  )
}

export default MovieDetails

const styles = StyleSheet.create({})
