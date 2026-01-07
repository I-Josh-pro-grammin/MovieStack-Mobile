import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const MoviesCard = ({id, poster_path, title, overview, vote_average, release_date}: Movie) => {
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className='w-[30%]'>
        <Image 
          source={{ uri: poster_path ? 
            `https://image.tmdb.org/t/p/w500${poster_path}` :
            `https://placehold.co/600x400/303030/ffffff.png`
          }}
          className='w-full h-52 rounded-lg'
          resizeMode='cover'
         />

         <Text className='text-white text-sm font-bold'>{title}</Text>
      </TouchableOpacity>
    </Link>
  )
}

export default MoviesCard

const styles = StyleSheet.create({})