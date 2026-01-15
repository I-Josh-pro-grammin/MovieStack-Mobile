import { createUser } from '@/services/appwrite';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await createUser(email, username, password);
      console.log('Account created and logged in successfully', email, username);
      Alert.alert('Success', 'Account created successfully!');
      router.push('/(tabs)');
    } catch (error: any) {
      console.log('Signup Error', error.message || 'Something went wrong');
      Alert.alert('Signup Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className='flex-1 bg-primary'>
      <View className='flex-1 items-center mx-10 flex-col justify-center'>
        <Text className='text-white text-2xl font-bold'>Sign Up</Text>
        <View>
          <View className='mt-20 flex-col justify-start items-start w-[20rem]'>
            <Text className='text-white mt-5'>Email :</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder='Enter you email' className="border border-white w-full  rounded-full px-5 py-3 mt-5 text-white placeholder:text-white/70" />
          </View>
          <View className='mt-5 flex-col justify-start items-start w-[20rem]'>
            <Text className='text-white mt-5'>Username :</Text>
            <TextInput value={username} onChangeText={setUsername} placeholder='Enter you username' className="border border-white w-full  rounded-full px-5 py-3 mt-5 text-white placeholder:text-white/70" />
          </View>
          <View className='mt-5 flex-col justify-start items-start w-[20rem]'>
            <Text className='text-white mt-5'>Password :</Text>
            <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder='Enter you password' className="border border-white w-full  rounded-full px-5 py-3 mt-5 text-white placeholder:text-white/70" />
          </View>
        </View>
        <View className='flex flex-col justify-end mt-10'>
          <Text className='text-white'>
            Are you new here?
            <Text onPress={() => router.push('/(auth)/login')} className='text-accent'>  Login</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className={`w-full mt-5 h-12 bg-accent rounded-full items-center justify-center ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className='text-white'>Signup</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default signup