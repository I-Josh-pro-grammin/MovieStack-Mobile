import { loginUser } from '@/services/appwrite'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submitHandler = async () => {
    if (!email.trim() || !password.trim()) {
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
      await loginUser(email, password);
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary justify-center">
      <View className="mx-20">
        <Text className="text-white text-2xl font-bold text-center">Login</Text>

        <View className="mt-10">
          <Text className="text-white mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-white rounded-full px-5 py-3 text-white placeholder:text-white/70"
          />

          <Text className="text-white mt-6 mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            className="border border-white rounded-full px-5 py-3 text-white placeholder:text-white/70"
          />
        </View>

        <TouchableOpacity
          onPress={submitHandler}
          disabled={loading}
          className={`mt-10 h-12 bg-accent rounded-full items-center justify-center ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Login</Text>
          )}
        </TouchableOpacity>

        <Text className="text-white text-center mt-5">
          Are you new here?
          <Text
            onPress={() => router.push('/(auth)/signup')}
            className="text-accent"
          >
            {' '}Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});