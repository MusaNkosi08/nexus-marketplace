import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";

type Product = { id: number; brand: string; name: string; priceZar: string; stock: number; imageUrl?: string };
type CartLine = Product & { quantity: number };
type Store = { bag: CartLine[]; userToken: string | null; userRole: "user" | "admin" | null; add: (product: Product) => void; decrement: (id: number) => void; remove: (id: number) => void; signIn: (token: string, role: "user" | "admin") => Promise<void>; signOut: () => Promise<void>; subtotal: number };
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: PropsWithChildren) {
  const [bag, setBag] = useState<CartLine[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  useEffect(() => { Promise.all([SecureStore.getItemAsync("nexus-jwt"), SecureStore.getItemAsync("nexus-role")]).then(([token, role]) => { if (token) setUserToken(token); if (role === "user" || role === "admin") setUserRole(role); }); }, []);
  const add = (product: Product) => setBag(current => { const line = current.find(item => item.id === product.id); if (line) return line.quantity < product.stock ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : current; return product.stock > 0 ? [...current, { ...product, quantity: 1 }] : current; });
  const decrement = (id: number) => setBag(current => current.flatMap(item => item.id !== id ? [item] : item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []));
  const remove = (id: number) => setBag(current => current.filter(item => item.id !== id));
  const signIn = async (token: string, role: "user" | "admin") => { setUserToken(token); setUserRole(role); await SecureStore.setItemAsync("nexus-jwt", token); await SecureStore.setItemAsync("nexus-role", role); };
  const signOut = async () => { setUserToken(null); setUserRole(null); await SecureStore.deleteItemAsync("nexus-jwt"); await SecureStore.deleteItemAsync("nexus-role"); };
  const subtotal = useMemo(() => bag.reduce((sum, item) => sum + Number(item.priceZar) * item.quantity, 0), [bag]);
  return <StoreContext.Provider value={{ bag, userToken, userRole, add, decrement, remove, signIn, signOut, subtotal }}>{children}</StoreContext.Provider>;
}
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("StoreProvider missing"); return value; }
