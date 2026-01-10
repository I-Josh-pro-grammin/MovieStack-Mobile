import MoviesCard from '@/components/MoviesCard'
import TrendingCard from '@/components/TrendingCard'
import { fetchMovies } from '@/services/api'
import { getTrendingMovies } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../React Native Movie App (assets)/constants/icons'
import { images } from '../../React Native Movie App (assets)/constants/images'
import SearchBar from '../../components/SearchBar'

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError
  } = useFetch(() => getTrendingMovies());

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }));

  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <Image source={images.bg} className='absolute w-full' />
      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 10,
      }}>
        <Image source={icons.logo} className='w-24 h-24 mt-10 mx-auto mb-10' />

        {
          moviesLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className='mt-10 self-center'
            />
          ) : moviesError || trendingMoviesError ? (
            <Text className='text-white font-bold text-center my-10'>Error: {moviesError?.message || trendingMoviesError?.message || 'Unknown error'}</Text>
          ) : (
            <View className='flex-1 ml-5'>
              <SearchBar
                onPress={() => router.push('/search')}
                placeholder="Search for movie"
              />

              <Text className='text-lg text-white font-bold mt-5 mb-3'>Trending Movies</Text>
              {
                trendingMovies && (
                  <View className='w-full'>
                    <FlatList
                      bounces={false}
                      className='mb-4 mt-3'
                      data={trendingMovies}
                      renderItem={({ item, index }) => (
                        <TrendingCard item={item} index={index} />
                      )}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View className='w-5' />}
                      keyExtractor={(item: TrendingMovie) => (item.movie_id.toString())}
                      contentContainerStyle={{
                        paddingRight: 20
                      }}
                      horizontal
                    />
                  </View>
                )
              }

              <>
                <Text className='text-lg text-white font-bold mt-5 mb-3'>Latest Movies</Text>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => (
                    <MoviesCard
                      {...item}
                    />
                  )}
                  keyExtractor={(item) => (item.id.toString())}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,

                  }}
                  className='mt-2 pb-32'
                  scrollEnabled={false}
                  ListEmptyComponent={() => (
                    <Text className='text-gray-100 text-center mt-10'>No movies found. Check logs.</Text>
                  )}
                />
              </>

            </View>

          )
        }


      </ScrollView>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({})