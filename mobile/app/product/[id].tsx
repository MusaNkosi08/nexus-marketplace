import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/context/store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
type Product = { id: number; brand: string; name: string; description: string; priceZar: string; stock: number; imageUrl: string };

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { add } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => { if (id) fetch(`${API_URL}/items/${id}`).then(response => response.json()).then(data => setProduct(data.item ?? null)); }, [id]);
  if (!product) return <ScreenContainer className="flex-1 bg-[#EEE9DF] px-5 pt-8"><Text className="text-[#2C3B4D]">Loading product detail…</Text></ScreenContainer>;
  return <ScreenContainer className="flex-1 bg-[#EEE9DF] px-5 pt-8" edges={["top", "left", "right"]}><Pressable onPress={() => router.back()}><Text className="text-xs tracking-[2px] text-[#A35139]">← BACK TO EDIT</Text></Pressable><Image source={{ uri: product.imageUrl }} className="mt-6 h-72 w-full rounded-lg bg-white" resizeMode="contain" /><Text className="mt-7 text-xs tracking-[3px] text-[#A35139]">{product.brand.toUpperCase()}</Text><Text className="mt-2 text-3xl font-semibold text-[#1B2632]">{product.name}</Text><Text className="mt-3 leading-6 text-[#2C3B4D]">{product.description}</Text><View className="mt-6 flex-row items-center justify-between"><Text className="text-2xl font-semibold text-[#1B2632]">R {Number(product.priceZar).toLocaleString("en-ZA")}</Text><Text className="text-xs tracking-[1px] text-[#A35139]">{product.stock} LEFT</Text></View><Pressable disabled={product.stock <= 0} onPress={() => add(product)} className="mt-7 rounded bg-[#1B2632] p-4"><Text className="text-center text-sm font-semibold tracking-[2px] text-[#EEE9DF]">{product.stock > 0 ? "ADD TO BAG" : "SOLD OUT"}</Text></Pressable></ScreenContainer>;
}
