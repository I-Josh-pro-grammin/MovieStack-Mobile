import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from '../../React Native Movie App (assets)/constants/images'
import { icons } from '../../React Native Movie App (assets)/constants/icons'
import SearchBar from '../../components/SearchBar'
import { useRouter } from 'expo-router'

const Index = () => {
  const router = useRouter();

  return (
    <View className='flex-1 bg-primary'>
         <Image source={images.bg} className='absolute w-full' />
         <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: 10,
         }}>
            <Image source={icons.logo} className='w-24 h-24 mt-10 mx-auto mb-10' />
            <View className='flex-1 ml-5'>
              <SearchBar 
                onPress={() => router.push('/search')}
                placeholder="Search for movie"
              />
            </View>
         </ScrollView>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({})