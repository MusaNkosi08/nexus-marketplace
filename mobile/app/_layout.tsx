import { Stack } from "expo-router";
import { StoreProvider } from "@/context/store";

export default function RootLayout() {
  return <StoreProvider><Stack screenOptions={{ headerShown: false }} /></StoreProvider>;
}
