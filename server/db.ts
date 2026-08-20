import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, collections, categories, carts, cartItems, orders, orderItems } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); } } return _db; }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId }; const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; } else { values.lastSignedIn = new Date(); updateSet.lastSignedIn = new Date(); }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

export async function listProducts(input: { search?: string; collectionId?: number; categoryId?: number; minPrice?: number; maxPrice?: number; sort?: "recommended" | "newest" | "price-low" | "price-high" }) {
  const db = await getDb(); if (!db) return [];
  const filters = [];
  if (input.collectionId) filters.push(eq(products.collectionId, input.collectionId));
  if (input.categoryId) filters.push(eq(products.categoryId, input.categoryId));
  if (input.minPrice !== undefined) filters.push(sqlPriceGte(input.minPrice));
  if (input.maxPrice !== undefined) filters.push(sqlPriceLte(input.maxPrice));
  if (input.search) { const q = `%${input.search}%`; filters.push(or(like(products.name, q), like(products.brand, q), like(products.description, q))); }
  const order = input.sort === "price-low" ? asc(products.priceZar) : input.sort === "price-high" ? desc(products.priceZar) : desc(products.createdAt);
  return db.select().from(products).where(filters.length ? and(...filters) : undefined).orderBy(order);
}
const sqlPriceGte = (value: number) => sql`${products.priceZar} >= ${value}`;
const sqlPriceLte = (value: number) => sql`${products.priceZar} <= ${value}`;
export async function getProduct(id: number) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(products).where(eq(products.id, id)).limit(1); return result[0]; }
export async function listCollections() { const db = await getDb(); if (!db) return []; return db.select().from(collections).orderBy(asc(collections.sortOrder)); }
export async function listCategories() { const db = await getDb(); if (!db) return []; return db.select().from(categories).orderBy(asc(categories.name)); }

export async function getOrCreateCart(userId: number) { const db = await getDb(); if (!db) return []; let cart = (await db.select().from(carts).where(eq(carts.userId, userId)).limit(1))[0]; if (!cart) { const result = await db.insert(carts).values({ userId }); const id = Number(result[0].insertId); cart = { id, userId, updatedAt: new Date() }; } return db.select().from(cartItems).where(eq(cartItems.cartId, cart.id)); }
export async function upsertCartItem(userId: number, productId: number, quantity: number) { const db = await getDb(); if (!db) return []; let cart = (await db.select().from(carts).where(eq(carts.userId, userId)).limit(1))[0]; if (!cart) { const result = await db.insert(carts).values({ userId }); cart = { id: Number(result[0].insertId), userId, updatedAt: new Date() }; } const existing = (await db.select().from(cartItems).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))).limit(1))[0]; if (existing) await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, existing.id)); else await db.insert(cartItems).values({ cartId: cart.id, productId, quantity }); return db.select().from(cartItems).where(eq(cartItems.cartId, cart.id)); }
export async function removeCartItem(userId: number, productId: number) { const db = await getDb(); if (!db) return []; const cart = (await db.select().from(carts).where(eq(carts.userId, userId)).limit(1))[0]; if (cart) await db.delete(cartItems).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))); return cart ? db.select().from(cartItems).where(eq(cartItems.cartId, cart.id)) : []; }

export async function listOrders(userId?: number) { const db = await getDb(); if (!db) return []; return db.select().from(orders).where(userId ? eq(orders.userId, userId) : undefined).orderBy(desc(orders.createdAt)); }
export async function listUsers() { const db = await getDb(); if (!db) return []; return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)); }
export async function createOrder(userId: number, items: Array<{ productId: number; quantity: number }>) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const ids = items.map(i => i.productId); const rows = await db.select().from(products).where(or(...ids.map(id => eq(products.id, id)))); const total = items.reduce((sum, item) => { const p = rows.find(row => row.id === item.productId); return sum + Number(p?.priceZar ?? 0) * item.quantity; }, 0); const result = await db.insert(orders).values({ userId, totalZar: total.toFixed(2), status: "confirmed" }); const orderId = Number(result[0].insertId); for (const item of items) { const p = rows.find(row => row.id === item.productId); if (p) { await db.insert(orderItems).values({ orderId, productId: p.id, productName: p.name, unitPriceZar: String(p.priceZar), quantity: item.quantity }); await db.update(products).set({ stock: Math.max(0, p.stock - item.quantity) }).where(eq(products.id, p.id)); } } return { orderId, totalZar: total }; }
