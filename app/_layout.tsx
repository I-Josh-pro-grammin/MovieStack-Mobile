import { initDB } from "@/services/download";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import './globals.css';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return <>
    <StatusBar hidden={true} />
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  </>;
}
