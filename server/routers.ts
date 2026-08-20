import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createOrder, getProduct, getOrCreateCart, listCategories, listCollections, listOrders, listProducts, listUsers, removeCartItem, upsertCartItem } from "./db";

const productInput = z.object({ brand: z.string().min(1), name: z.string().min(1), slug: z.string().min(1), description: z.string().min(1), priceZar: z.number().nonnegative(), imageUrl: z.string().url().or(z.string().startsWith("/")), collectionId: z.number().int(), categoryId: z.number().int(), stock: z.number().int().nonnegative(), isAvailable: z.boolean().default(true) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  catalogue: router({
    products: publicProcedure.input(z.object({ search: z.string().optional(), collectionId: z.number().int().optional(), categoryId: z.number().int().optional(), minPrice: z.number().optional(), maxPrice: z.number().optional(), sort: z.enum(["recommended", "newest", "price-low", "price-high"]).default("recommended") }).default({ sort: "recommended" })).query(({ input }) => listProducts(input)),
    product: publicProcedure.input(z.object({ id: z.number().int() })).query(({ input }) => getProduct(input.id)),
    collections: publicProcedure.query(() => listCollections()),
    categories: publicProcedure.query(() => listCategories()),
  }),
  cart: router({
    get: protectedProcedure.query(({ ctx }) => getOrCreateCart(ctx.user.id)),
    setItem: protectedProcedure.input(z.object({ productId: z.number().int(), quantity: z.number().int().min(0) })).mutation(({ ctx, input }) => input.quantity === 0 ? removeCartItem(ctx.user.id, input.productId) : upsertCartItem(ctx.user.id, input.productId, input.quantity)),
    removeItem: protectedProcedure.input(z.object({ productId: z.number().int() })).mutation(({ ctx, input }) => removeCartItem(ctx.user.id, input.productId)),
  }),
  orders: router({
    mine: protectedProcedure.query(({ ctx }) => listOrders(ctx.user.id)),
    create: protectedProcedure.input(z.object({ items: z.array(z.object({ productId: z.number().int(), quantity: z.number().int().positive() })).min(1) })).mutation(({ ctx, input }) => createOrder(ctx.user.id, input.items)),
    adminList: adminProcedure.query(() => listOrders()),
  }),
  admin: router({
    users: adminProcedure.query(() => listUsers()),
    products: adminProcedure.query(() => listProducts({ sort: "newest" })),
    createProduct: adminProcedure.input(productInput).mutation(async ({ input }) => { const { getDb } = await import("./db"); const { products } = await import("../drizzle/schema"); const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(products).values({ ...input, priceZar: input.priceZar.toFixed(2) }); return { success: true }; }),
    updateProduct: adminProcedure.input(z.object({ id: z.number().int(), data: productInput.partial() })).mutation(async ({ input }) => { const { getDb } = await import("./db"); const { products } = await import("../drizzle/schema"); const { eq } = await import("drizzle-orm"); const db = await getDb(); if (!db) throw new Error("Database unavailable"); const data: Record<string, unknown> = { ...input.data, ...(input.data.priceZar === undefined ? {} : { priceZar: input.data.priceZar.toFixed(2) }) }; await db.update(products).set(data as never).where(eq(products.id, input.id)); return { success: true }; }),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int() })).mutation(async ({ input }) => { const { getDb } = await import("./db"); const { products } = await import("../drizzle/schema"); const { eq } = await import("drizzle-orm"); const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.delete(products).where(eq(products.id, input.id)); return { success: true }; }),
  }),
});
export type AppRouter = typeof appRouter;
