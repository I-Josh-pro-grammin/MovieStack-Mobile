import { icons } from '@/React Native Movie App (assets)/constants/icons'
import { Link } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const MoviesCard = ({ id, poster_path, title, overview, vote_average, release_date }: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className='w-[30%]'>
        <Image
          source={{
            uri: poster_path ?
              `https://image.tmdb.org/t/p/w500${poster_path}` :
              `https://placehold.co/600x400/303030/ffffff.png`
          }}
          className='w-full h-52 rounded-lg'
          resizeMode='cover'
        />

        <Text numberOfLines={1} className='text-white mt-2 text-sm font-bold'>{title}</Text>

        <View className='flex-row items-center justify-start gap-x-2'>
          <Image source={icons.star} className='size-4' />
          <Text className='text-white text-xs font-bold'>{Math.round(vote_average / 2)}</Text>
        </View>

        <View className='flex-row items-center justify-between'>
          <Text className='text-white text-xs font-bold mt-1'>{release_date.split('-')[0]}</Text>
          {/* <Text className='text-light-300 font-medium text-xs uppercase mt-1'>Movie</Text> */}
        </View>
      </TouchableOpacity>

    </Link>
  )
}

export default MoviesCard

const styles = StyleSheet.create({})