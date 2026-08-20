import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { BrandFooter } from "@/components/brand-footer";
import { useStore } from "@/context/store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
type Product = { id: number; brand: string; name: string; priceZar: string; stock: number; imageUrl: string };

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useStore();
  const router = useRouter();
  useEffect(() => { fetch(`${API_URL}/items`).then(r => r.json()).then(data => setProducts(data.items ?? [])).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);
  return <ScreenContainer className="flex-1 bg-[#F5EFC6] px-5 pt-8" edges={["top", "left", "right"]}><Text className="text-xs tracking-[3px] text-[#4D0E12]">NEXUS / MOBILE EDIT</Text><Text className="mt-3 text-5xl font-semibold leading-[54px] text-[#231815]">Technology,{"\n"}<Text className="italic">intelligently</Text>{"\n"}curated.</Text><Text className="mt-4 text-base leading-6 text-[#A5BCD6]">The same considered catalogue, now in your pocket.</Text>{loading ? <ActivityIndicator className="mt-8" color="#4D0E12" /> : <FlatList data={products} keyExtractor={item => String(item.id)} contentContainerStyle={{ paddingVertical: 28, gap: 12 }} ListFooterComponent={<BrandFooter />} renderItem={({ item }) => <Pressable onPress={() => router.push(`/product/${item.id}`)} className="rounded-lg bg-[#231815] p-4"><Image source={{ uri: item.imageUrl }} className="h-40 w-full rounded-md bg-[#F5EFC6]" resizeMode="contain" /><Text className="mt-4 text-xs tracking-[2px] text-[#F5EFC6]">{item.brand.toUpperCase()}</Text><Text className="mt-2 text-lg font-semibold text-[#F5EFC6]">{item.name}</Text><View className="mt-3 flex-row items-center justify-between"><Text className="text-base text-[#F5EFC6]">R {Number(item.priceZar).toLocaleString("en-ZA")}</Text><Pressable onPress={() => add(item)} disabled={item.stock <= 0} className="rounded bg-[#F5EFC6] px-3 py-2"><Text className="text-xs font-semibold tracking-[1px] text-[#231815]">{item.stock > 0 ? "ADD +" : "SOLD OUT"}</Text></Pressable></View><Text className="mt-2 text-xs text-[#4A2E27]">{item.stock} LEFT</Text></Pressable>} ListEmptyComponent={<Text className="mt-8 text-[#A5BCD6]">Catalogue loading or unavailable.</Text>} />}</ScreenContainer>;
}
