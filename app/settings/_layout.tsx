import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs 
    screenOptions={{
        tabBarStyle:{
          display: 'none'
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})