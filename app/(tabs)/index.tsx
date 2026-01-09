import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from '../../React Native Movie App (assets)/constants/images'
import { icons } from '../../React Native Movie App (assets)/constants/icons'
import SearchBar from '../../components/SearchBar'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import MoviesCard from '@/components/MoviesCard'

const Index = () => {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError 
  } = useFetch(() => fetchMovies({
    query: 'demon'
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
              ) : moviesError ? (
                <Text>Error {moviesError.message}</Text>
              ) : (
                <View className='flex-1 ml-5'>
                  <SearchBar 
                    onPress={() => router.push('/search')}
                    placeholder="Search for movie"
                  />

                  <>
                    <Text className='text-lg text-white font-bold mt-5 mb-3'>Latest Movies</Text>

                    <FlatList 
                      data={movies}
                      renderItem={({item}) => (
                        <MoviesCard
                          {...item}
                        />
                      )}
                      keyExtractor={(item) => (item.id)}
                      numColumns={3}
                      columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        gap:20,
                        paddingRight: 5,
                        marginBottom: 10,

                      }}
                      className='mt-2 pb-32'
                      scrollEnabled={false}
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