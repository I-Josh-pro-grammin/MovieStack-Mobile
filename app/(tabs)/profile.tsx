import { icons } from '@/React Native Movie App (assets)/constants/icons'
import { getCurrentUser, logoutUser } from '@/services/appwrite'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/(auth)/login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View className='flex-1 bg-primary justify-center items-center'>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }} 
        className='flex-1 flex-col gap-10 bg-primary px-10'>
      <View
        className='flex mt-[10rem] mx-[2rem] justify-center gap-5'>
        <View className='flex items-center mx-[2rem] flex-col gap-5'>
          <Image source={icons.person} className='size-10 rounded-full' />
          <Text className='text-white text-2xl font-bold'>Profile</Text>
        </View>
        <View className='flex mt-[4rem] flex-row justify-between items-center'>
          <Text className='text-white'>Username :</Text>
          <Text className='text-white'>{user?.name || 'N/A'}</Text>
        </View>
        <View className='flex flex-row justify-between items-center'>
          <Text className='text-white'>Email :</Text>
          <Text className='text-white'>{user?.email || 'N/A'}</Text>
        </View>
        <View className='flex flex-row justify-between items-center'>
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
            onPress={handleLogout}
            className='border mt-10 border-red-500 items-center justify-start px-10 py-3 rounded-lg'
          >
            <Text className='text-red-500'>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => router.back()} className='flex bg-accent flex-row gap-3 absolute top-10 left-5 items-center px-10 py-3 rounded-lg'>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className='text-white'>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({})
