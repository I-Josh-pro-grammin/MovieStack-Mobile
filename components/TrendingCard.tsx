import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { images } from '@/React Native Movie App (assets)/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';


interface Props {
  item: TrendingMovie;
  index: number;
}

const TrendingCard = ({item: {movie_id, title, poster_url}, index}: Props) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity className='w-32 relative pl-5'>
        <Image source={{uri: poster_url}} className='w-32 h-48 rounded-lg' resizeMode='cover' />

        <View className='absolute bottom-3 -left-2.5 px-2 py-1 rounded-full'>
          <MaskedView maskElement={
            <Text className='text-white text-6xl font-bold'>{index + 1}</Text>}>
            <Image source={images.rankingGradient} className='size-14' resizeMode='cover' />
          </MaskedView>
        </View>
        <Text className='text-white' numberOfLines={1}>{title}</Text>
      </TouchableOpacity>
    </Link>
  )
}

export default TrendingCard

const styles = StyleSheet.create({})