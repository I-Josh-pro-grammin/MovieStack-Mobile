import { icons } from '@/React Native Movie App (assets)/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import { ActiveDownload, isMovieDownloaded, startDownload, subscribeToDownloads } from '@/services/download';
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

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string))

  useEffect(() => {
    if (movie) {
      setDownloaded(isMovieDownloaded(movie.id.toString()));
    }

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
      Alert.alert('Already Downloaded', 'This movie is already in your downloads.');
      return;
    }

    setDownloading(true);
    try {
      await startDownload(movie, (p) => setProgress(p));
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

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: 150
      }}>
        <View>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}` }} className='w-full h-[550px]' resizeMode='stretch' />
        </View>
        <View className='flex-col items-start justify-center mt-5 px-5'>
          <View className='flex-row justify-between items-center w-full'>
            <View className='flex-1'>
              <Text className='text-white text-xl font-bold'>{movie?.title}</Text>
            </View>

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
                  name={downloaded ? "checkmark-circle" : "download-outline"}
                  size={24}
                  color={downloaded ? "#22c55e" : "#eb8c33"}
                />
              )}
            </TouchableOpacity>
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
          <MovieInfo label='Genre' value={movie?.genres?.map(g => g.name).join(' - ') || 'N/A'} />

          <View className='flex flex-row justify-between w-1/2'>
            {
              movie?.budget ? (
                <MovieInfo label='Budget' value={`$${movie?.budget / 1000000} millions`} />
              ) : <></>
            }
            {
              movie?.revenue ? (
                <MovieInfo label='Revenue' value={`$${movie?.revenue / 1000000} millions`} />
              ) : <></>
            }
          </View>

          <MovieInfo label='Product Companies' value={movie?.production_companies?.map(g => g.name).join(' - ') || 'N/A'} />
        </View>
      </ScrollView>

      <TouchableOpacity className='absolute bottom-5  left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50' onPress={router.back}>
        <Image source={icons.arrow} className='size-5 rotate-180' tintColor='white' />
        <Text className='text-white text-sm font-bold'>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails

const styles = StyleSheet.create({})
