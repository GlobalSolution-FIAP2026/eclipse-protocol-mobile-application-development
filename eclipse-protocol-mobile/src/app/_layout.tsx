import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "react-native";
import { clearAuthData } from "../services/api";

export default function RootLayout() {
  useEffect(() => {
    clearAuthData().then(() => {
      router.replace("/login");
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}