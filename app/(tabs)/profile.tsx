import { icons } from '@/React Native Movie App (assets)/constants/icons'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Profile = () => {

  const router = useRouter();

  return (
    <View className='flex-1 flex-col gap-10 bg-primary px-10'>
      <View className='flex  mt-[10rem] mx-[2rem] justify-center gap-5'>
        <View className='flex items-center mx-[2rem] flex-col gap-5'>
          <Image source={icons.person} className='size-10 rounded-full' />
          <Text className='text-white text-2xl font-bold'>Profile</Text>
        </View>
        <View className='flex mt-[4rem] mx-[2rem] flex-row justify-between items-center'>
          <Text className='text-white'>Username :</Text>
          <Text className='text-white'>Joshua</Text>
        </View>
        <View className='flex mx-[2rem] flex-row justify-between items-center'>
          <Text className='text-white'>Email :</Text>
          <Text className='text-white'>izerejoshua49@gmail.com</Text>
        </View>
        <View className='flex mx-[2rem] flex-row justify-between items-center'>
          <Text className='text-white'>Password :</Text>
          <Text className='text-white'>********</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} className='flex bg-accent flex-row gap-3 items-center px-10 py-3 rounded-lg'>
            <Text className='text-white'>Change</Text>
          </TouchableOpacity>
        </View>

        <View className='flex mt-10 flex-col gap-5'>
          <TouchableOpacity onPress={() => router.push('/(tabs)/saved')} className='border active:text-accent items-center border-white px-10 py-3 rounded-lg'>
            <Text className='text-white'>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')} className='border active:text-accent items-center border-white px-10 py-3 rounded-lg'>
            <Text className='text-white'>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const { logoutUser } = await import('@/services/appwrite');
              await logoutUser();
              router.replace('/(auth)/login');
            }}
            className='border border-red-500 items-center px-10 py-3 rounded-lg'
          >
            <Text className='text-red-500'>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')} className='bg-accent items-center px-10 py-3 rounded-lg'>
        <Text className='text-white'>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} className='flex bg-accent flex-row gap-3 absolute top-5 left-5 items-center px-10 py-3 rounded-lg'>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className='text-white'>Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})