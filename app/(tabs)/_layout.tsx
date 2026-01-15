import { icons } from '@/React Native Movie App (assets)/constants/icons'
import { images } from '@/React Native Movie App (assets)/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'

const TabBarIcon = ({ focused, icon, text }: any) => {
  if (focused) {
    return (
      <ImageBackground source={images.highlight}
        className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
      >
        <Image source={icon} className='size-5' tintColor='#151312' />
        <Text className='text-primary text-base ml-1 font-medium'>{text}</Text>
      </ImageBackground>
    )
  }

  return (
    <View className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'>
      <Image source={icon} className='size-5' tintColor='#fff' />
      {/* <Text className='text-primary text-white text-light-200 ml-2 font-medium'>{text}</Text> */}
    </View>
  )
}

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        },
        tabBarStyle: {
          backgroundColor: '#0f0d23',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#151312'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.home} text="Home" />
          )
        }}

      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.search} text="Search" />
          )
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.save} text="Saved" />
          )
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: "Downloads",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.star} text="Downloads" />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.person} text="Profile" />
          )
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})