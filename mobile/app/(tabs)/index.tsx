import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
type Product = { id: number; brand: string; name: string; priceZar: string; stock: number };

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API_URL}/items`).then(r => r.json()).then(data => setProducts(data.items ?? [])).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);
  return (
    <ScreenContainer className="bg-[#EEE9DF] px-5 pt-8" edges={["top", "left", "right"]}>
      <Text className="text-xs tracking-[3px] text-[#A35139]">NEXUS / MOBILE EDIT</Text>
      <Text className="mt-3 text-5xl font-semibold leading-[54px] text-[#1B2632]">Technology,{"\n"}<Text className="italic">intelligently</Text>{"\n"}curated.</Text>
      <Text className="mt-4 text-base leading-6 text-[#2C3B4D]">The essential tools for studying, creating, building, focusing and moving.</Text>
      {loading ? <ActivityIndicator className="mt-8" color="#A35139" /> : <FlatList data={products.slice(0, 8)} keyExtractor={item => String(item.id)} contentContainerStyle={{ paddingVertical: 28, gap: 12 }} renderItem={({ item }) => <Pressable style={({ pressed }) => [{ backgroundColor: "#1B2632", padding: 18, borderRadius: 8 }, pressed && { opacity: 0.8 }]}><Text className="text-xs tracking-[2px] text-[#FFB162]">{item.brand.toUpperCase()}</Text><Text className="mt-2 text-lg font-semibold text-[#EEE9DF]">{item.name}</Text><View className="mt-3 flex-row justify-between"><Text className="text-base text-[#EEE9DF]">R {Number(item.priceZar).toLocaleString("en-ZA")}</Text><Text className="text-xs text-[#C9C1B1]">{item.stock > 0 ? "IN STOCK" : "SOLD OUT"}</Text></View></Pressable>} />}
    </ScreenContainer>
  );
}
