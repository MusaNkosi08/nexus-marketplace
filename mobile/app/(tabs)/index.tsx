import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/context/store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
type Product = { id: number; brand: string; name: string; priceZar: string; stock: number; imageUrl: string };

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useStore();
  const router = useRouter();
  useEffect(() => { fetch(`${API_URL}/items`).then(r => r.json()).then(data => setProducts(data.items ?? [])).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);
  return <ScreenContainer className="flex-1 bg-[#EEE9DF] px-5 pt-8" edges={["top", "left", "right"]}><Text className="text-xs tracking-[3px] text-[#A35139]">NEXUS / MOBILE EDIT</Text><Text className="mt-3 text-5xl font-semibold leading-[54px] text-[#1B2632]">Technology,{"\n"}<Text className="italic">intelligently</Text>{"\n"}curated.</Text><Text className="mt-4 text-base leading-6 text-[#2C3B4D]">The same considered catalogue, now in your pocket.</Text>{loading ? <ActivityIndicator className="mt-8" color="#A35139" /> : <FlatList data={products} keyExtractor={item => String(item.id)} contentContainerStyle={{ paddingVertical: 28, gap: 12 }} renderItem={({ item }) => <Pressable onPress={() => router.push(`/product/${item.id}`)} className="rounded-lg bg-[#1B2632] p-4"><Image source={{ uri: item.imageUrl }} className="h-40 w-full rounded-md bg-[#EEE9DF]" resizeMode="contain" /><Text className="mt-4 text-xs tracking-[2px] text-[#FFB162]">{item.brand.toUpperCase()}</Text><Text className="mt-2 text-lg font-semibold text-[#EEE9DF]">{item.name}</Text><View className="mt-3 flex-row items-center justify-between"><Text className="text-base text-[#EEE9DF]">R {Number(item.priceZar).toLocaleString("en-ZA")}</Text><Pressable onPress={() => add(item)} disabled={item.stock <= 0} className="rounded bg-[#FFB162] px-3 py-2"><Text className="text-xs font-semibold tracking-[1px] text-[#1B2632]">{item.stock > 0 ? "ADD +" : "SOLD OUT"}</Text></Pressable></View><Text className="mt-2 text-xs text-[#C9C1B1]">{item.stock} LEFT</Text></Pressable>} ListEmptyComponent={<Text className="mt-8 text-[#2C3B4D]">Catalogue loading or unavailable.</Text>} />}</ScreenContainer>;
}
