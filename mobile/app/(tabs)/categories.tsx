import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
const fallback = ["AUDIO", "KEYBOARDS", "DISPLAYS", "STORAGE", "ACCESSORIES", "MOBILE", "WORKSTATIONS", "CAMERAS"];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API_URL}/catalogue/meta`).then(r => r.json()).then(data => setCategories((data.categories ?? []).map((item: { name: string }) => item.name))).catch(() => setCategories(fallback)).finally(() => setLoading(false)); }, []);
  return <ScreenContainer className="flex-1 bg-[#EEE9DF] px-5 pt-8" edges={["top", "left", "right"]}><Text className="text-xs tracking-[3px] text-[#A35139]">THE NEXUS CATEGORIES</Text><Text className="mt-3 text-4xl font-semibold text-[#1B2632]">Browse by intent.</Text>{loading ? <ActivityIndicator className="mt-8" color="#A35139" /> : <FlatList data={categories.length ? categories : fallback} keyExtractor={item => item} numColumns={2} contentContainerStyle={{ paddingVertical: 28, gap: 12 }} columnWrapperStyle={{ gap: 12 }} renderItem={({ item, index }) => <Pressable style={({ pressed }) => [{ flex: 1, minHeight: 140, padding: 18, justifyContent: "space-between", backgroundColor: index % 3 === 0 ? "#FFB162" : "#1B2632", borderRadius: 8 }, pressed && { opacity: 0.78 }]}><Text className="text-2xl font-semibold" style={{ color: index % 3 === 0 ? "#1B2632" : "#EEE9DF" }}>{item}</Text><Text className="text-xs tracking-[1px]" style={{ color: index % 3 === 0 ? "#2C3B4D" : "#C9C1B1" }}>EXPLORE EDIT →</Text></Pressable>} />}</ScreenContainer>;
}
