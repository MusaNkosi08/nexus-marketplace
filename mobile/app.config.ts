import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "NEXUS Mobile",
  slug: "nexus-mobile",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "nexus",
  userInterfaceStyle: "light",
  plugins: ["expo-router"],
  experiments: { typedRoutes: true },
  extra: { apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api" },
};

export default config;
