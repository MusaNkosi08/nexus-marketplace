import "../global.css";
import { Stack } from "expo-router";
import { StoreProvider } from "@/context/store";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return <SafeAreaProvider><StoreProvider><Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} /></StoreProvider></SafeAreaProvider>;
}
