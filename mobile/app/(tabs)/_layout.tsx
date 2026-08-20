import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#F5EFC6", tabBarInactiveTintColor: "#4A2E27", tabBarStyle: { backgroundColor: "#231815", borderTopColor: "#A5BCD6" }, headerStyle: { backgroundColor: "#231815" }, headerTintColor: "#F5EFC6" }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="categories" options={{ title: "Categories", tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="cart" options={{ title: "Cart", tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
