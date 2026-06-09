import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "react-native";
import { getStoredToken } from "../services/api";

export default function RootLayout() {
  useEffect(() => {
    async function checkAuth() {
      const token = await getStoredToken();
      if (token) {
        router.replace("/dashboard");
      }
    }
    checkAuth();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}