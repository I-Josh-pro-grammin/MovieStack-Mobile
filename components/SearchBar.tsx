import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { icons } from '../React Native Movie App (assets)/constants/icons'

interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void
}

const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  return (
    <View className='flex mx-auto flex-row items-center bg-dark-200 rounded-full px-5 py-4 justify-between'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor='#ab8bff'/>
      <TextInput 
        onPress={onPress}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor='#a8b5db'
        className='flex-1 ml-2 text-white'
      />
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({})