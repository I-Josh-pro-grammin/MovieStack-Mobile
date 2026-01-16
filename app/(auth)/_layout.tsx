import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs 
      screenOptions={{
        tabBarStyle: {
          display: 'none'
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="signup" />
      <Tabs.Screen name="login" />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})