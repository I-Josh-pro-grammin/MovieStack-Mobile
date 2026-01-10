import { icons } from '@/React Native Movie App (assets)/constants/icons'
import { images } from '@/React Native Movie App (assets)/constants/images'
import MoviesCard from '@/components/MoviesCard'
import SearchBar from '@/components/SearchBar'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'

const search = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
    reset
  } = useFetch(() => fetchMovies({
    query: searchTerm
  }), false);

  useEffect(() => {
    if (movies && movies.length > 0 && searchTerm) {
      updateSearchCount(searchTerm, movies[0]);
    }
  }, [movies]);

  useEffect(() => {
    const setTimeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        await refetchMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(setTimeoutId);
  }, [searchTerm]);

  return (
    <View className='flex-1 bg-primary'>
      <Image
        className='w-full absolute h-52'
        source={images.bg}
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MoviesCard {...item} />
        )
        }
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}

        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center'>
              <Image source={icons.logo} className='w-12 h-10' />
            </View>

            <View className='my-5'>
              <SearchBar
                placeholder='Search movies...'
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
              />
            </View>

            {
              moviesLoading && (
                <ActivityIndicator size="large" color="#0000ff" />
              )
            }

            {
              moviesError && (
                <Text className='text-red-500 px-5 my-3'>
                  {moviesError.message}
                </Text>
              )
            }

            {!moviesLoading && !moviesError && searchTerm.trim() && movies?.length > 0 && (
              <Text className='text-white text-xl px-5 my-3'>
                Search results for{' '}
                <Text className='text-accent font-medium'>{searchTerm}</Text>
              </Text>

            )}
          </>
        }

        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className='mt-10 px-5'>
              <Text className='text-center text-gray-500'>
                {searchTerm.trim() ? 'No movies found' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default search

const styles = StyleSheet.create({})