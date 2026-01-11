import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { icons } from '@/React Native Movie App (assets)/constants/icons'

const saved = () => {
  return (
    <View className='flex-1 bg-primary px-10'>
          <View className='flex justify-center items-center flex-1 flex-col gap-5'>
            <Image source={icons.save} className='size-10 rounded-full' />
            <Text className='text-white text-2xl font-bold'>Saved</Text>
          </View>
        </View>
  )
}

export default saved

const styles = StyleSheet.create({})