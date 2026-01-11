import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { icons } from '@/React Native Movie App (assets)/constants/icons'

const profile = () => {
  return (
    <View className='flex-1 bg-primary px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image source={icons.person} className='size-10 rounded-full' />
        <Text className='text-white text-2xl font-bold'>Profile</Text>
      </View>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({})