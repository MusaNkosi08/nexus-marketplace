import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { BrandFooter } from "@/components/brand-footer";
import { useStore } from "@/context/store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
type Product = { id: number; name: string; stock: number };
type Order = { id: number; userId: number; status: string; totalZar: string; createdAt: string };

export default function ProfileScreen() {
  const { userToken, userRole, signIn, signOut } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockDrafts, setStockDrafts] = useState<Record<number, number>>({});

  const submit = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/${registering ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registering ? { name, email, password } : { email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Authentication failed");
      await signIn(data.token, data.user.role);
      Alert.alert("Welcome to NEXUS", "You can now continue to purchase from your bag.");
    } catch (error) {
      Alert.alert("Could not sign in", error instanceof Error ? error.message : "Please try again.");
    }
  };

  useEffect(() => {
    if (!userToken || userRole !== "admin") return;
    const headers = { Authorization: `Bearer ${userToken}` };
    Promise.all([
      fetch(`${API_URL}/items`).then(response => response.json()),
      fetch(`${API_URL}/orders`, { headers }).then(response => response.json()),
    ]).then(([itemsData, ordersData]) => {
      setAdminProducts(itemsData.items ?? []);
      setOrders(ordersData.orders ?? []);
    }).catch(() => Alert.alert("Admin data unavailable", "Check the API URL and connection."));
  }, [userRole, userToken]);

  const confirmStock = async (product: Product) => {
    const stock = Math.max(0, Number(stockDrafts[product.id] ?? product.stock));
    const response = await fetch(`${API_URL}/items/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) return Alert.alert("Stock not saved", "The database rejected this update.");
    setAdminProducts(current => current.map(item => item.id === product.id ? { ...item, stock } : item));
    setStockDrafts(current => ({ ...current, [product.id]: stock }));
    Alert.alert("Stock confirmed", `${product.name} now has ${stock} units in the database.`);
  };

  return <ScreenContainer className="flex-1 bg-[#F5EFC6] px-5 pt-8" edges={["top", "left", "right"]}>
    <Text className="text-xs tracking-[3px] text-[#4D0E12]">NEXUS ACCOUNT</Text>
    <Text className="mt-3 text-4xl font-semibold text-[#231815]">Your edit.</Text>
    {userToken ? <>
      <View className="mt-8 rounded-lg bg-[#231815] p-6">
        <Text className="text-lg font-semibold text-[#F5EFC6]">You are signed in.</Text>
        <Text className="mt-2 leading-5 text-[#A5BCD6]">Your purchase access is unlocked for this session.</Text>
        <Pressable onPress={signOut} className="mt-6 rounded bg-[#F5EFC6] p-4"><Text className="text-center text-sm font-semibold tracking-[2px] text-[#231815]">SIGN OUT</Text></Pressable>
      </View>
      {userRole === "admin" && <View className="mt-5">
        <Text className="text-xs tracking-[3px] text-[#4D0E12]">ADMIN / STOCK CONTROL</Text>
        <Text className="mt-2 text-2xl font-semibold text-[#231815]">Set remaining units.</Text>
        <FlatList className="mt-4" data={adminProducts} keyExtractor={item => String(item.id)} scrollEnabled={false} contentContainerStyle={{ gap: 10 }} renderItem={({ item }) => <View className="rounded-lg bg-[#A5BCD6] p-4">
          <Text className="font-semibold text-[#231815]">{item.name}</Text>
          <TextInput keyboardType="number-pad" value={String(stockDrafts[item.id] ?? item.stock)} onChangeText={value => setStockDrafts(current => ({ ...current, [item.id]: Number(value.replace(/[^0-9]/g, "")) || 0 }))} className="mt-3 rounded bg-[#F5EFC6] px-4 py-3 text-[#231815]" />
          <Pressable onPress={() => confirmStock(item)} className="mt-3 rounded bg-[#231815] p-3"><Text className="text-center text-xs font-semibold tracking-[2px] text-[#F5EFC6]">CONFIRM STOCK</Text></Pressable>
        </View>} />
        <Text className="mt-8 text-xs tracking-[3px] text-[#4D0E12]">RECENT ORDERS</Text>
        {orders.length === 0 ? <Text className="mt-3 text-[#4A2E27]">No recent orders.</Text> : orders.map(order => <View key={order.id} className="mt-3 rounded-lg bg-[#231815] p-4"><View className="flex-row justify-between"><Text className="font-semibold text-[#F5EFC6]">#{String(order.id).padStart(4, "0")}</Text><Text className="text-xs tracking-[1px] text-[#A5BCD6]">{order.status.toUpperCase()}</Text></View><Text className="mt-2 text-[#F5EFC6]">R {Number(order.totalZar).toLocaleString("en-ZA")}</Text><Text className="mt-1 text-xs text-[#A5BCD6]">{new Date(order.createdAt).toLocaleString()}</Text></View>)}
      </View>}
    </> : <View className="mt-8 rounded-lg bg-[#231815] p-6">
      <Text className="text-lg font-semibold text-[#F5EFC6]">{registering ? "Create your NEXUS account." : "Sign in to purchase."}</Text>
      {registering && <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#4A2E27" className="mt-5 rounded bg-[#A5BCD6] px-4 py-3 text-[#231815]" />}
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#4A2E27" className="mt-3 rounded bg-[#A5BCD6] px-4 py-3 text-[#231815]" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry placeholderTextColor="#4A2E27" className="mt-3 rounded bg-[#A5BCD6] px-4 py-3 text-[#231815]" />
      <Pressable onPress={submit} className="mt-5 rounded bg-[#F5EFC6] p-4"><Text className="text-center text-sm font-semibold tracking-[2px] text-[#231815]">{registering ? "REGISTER" : "SIGN IN"}</Text></Pressable>
      <Pressable onPress={() => setRegistering(value => !value)} className="mt-4"><Text className="text-center text-[#A5BCD6]">{registering ? "Already have an account? Sign in" : "New to NEXUS? Create an account"}</Text></Pressable>
    </View>}
    <BrandFooter />
  </ScreenContainer>;
}
