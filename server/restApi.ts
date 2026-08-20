import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { categories, collections, products, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

const jwtSecret = () => ENV.cookieSecret || process.env.JWT_SECRET || "nexus-local-development-secret";

type AuthPayload = { sub: string; role: "user" | "admin"; email: string };
type AuthenticatedRequest = Request & { authUser?: AuthPayload };

export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, passwordHash: string) { return bcrypt.compare(password, passwordHash); }
export function createLocalToken(user: { id: number; role: "user" | "admin"; email: string }) { return jwt.sign({ sub: String(user.id), role: user.role, email: user.email }, jwtSecret(), { expiresIn: "7d" }); }

function issueToken(user: { id: number; role: "user" | "admin"; email: string | null }) {
  if (!user.email) throw new Error("A verified email address is required for local authentication");
  return jwt.sign({ sub: String(user.id), role: user.role, email: user.email }, jwtSecret(), { expiresIn: "7d" });
}

function requireJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Bearer token required" });
  try {
    req.authUser = jwt.verify(token, jwtSecret()) as AuthPayload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function canManageItems(role: "user" | "admin" | undefined) { return role === "admin"; }

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!canManageItems(req.authUser?.role)) return res.status(403).json({ error: "Admin access required" });
  return next();
}

function publicUser(user: typeof users.$inferSelect) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, loginMethod: user.loginMethod };
}

export function registerRestApi(app: Express) {
  const router = express.Router();

  router.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (typeof email !== "string" || !email.includes("@") || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "A valid email and password of at least 8 characters are required" });
    }
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });
    const normalizedEmail = email.trim().toLowerCase();
    const existing = (await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1))[0];
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });
    const passwordHash = await hashPassword(password);
    const result = await db.insert(users).values({
      openId: `local_${nanoid(24)}`,
      name: typeof name === "string" ? name.trim() : null,
      email: normalizedEmail,
      passwordHash,
      loginMethod: "local-jwt",
      role: "user",
      lastSignedIn: new Date(),
    });
    const user = (await db.select().from(users).where(eq(users.id, Number(result[0].insertId))).limit(1))[0];
    if (!user) return res.status(500).json({ error: "Unable to create user" });
    return res.status(201).json({ user: publicUser(user), token: issueToken(user) });
  });

  router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string") return res.status(400).json({ error: "Email and password are required" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });
    const user = (await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1))[0];
    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) return res.status(401).json({ error: "Invalid email or password" });
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
    return res.json({ user: publicUser(user), token: issueToken(user) });
  });

  router.get("/auth/me", requireJwt, async (req: AuthenticatedRequest, res) => {
    const db = await getDb();
    const id = Number(req.authUser?.sub);
    const user = db ? (await db.select().from(users).where(eq(users.id, id)).limit(1))[0] : undefined;
    return user ? res.json({ user: publicUser(user) }) : res.status(404).json({ error: "User not found" });
  });

  router.get("/items", async (_req, res) => {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });
    const items = await db.select().from(products).orderBy(products.id);
    return res.json({ items });
  });

  router.get("/items/:id", async (req, res) => {
    const db = await getDb();
    const id = Number(req.params.id);
    if (!db || !Number.isInteger(id)) return res.status(400).json({ error: "Valid item id required" });
    const item = (await db.select().from(products).where(eq(products.id, id)).limit(1))[0];
    return item ? res.json({ item }) : res.status(404).json({ error: "Item not found" });
  });

  router.post("/items", requireJwt, requireAdmin, async (req, res) => {
    const { brand, name, slug, description, priceZar, imageUrl, collectionId, categoryId, stock } = req.body ?? {};
    if (!brand || !name || !slug || !description || !imageUrl || !collectionId || !categoryId || Number(priceZar) < 0) return res.status(400).json({ error: "Missing or invalid item fields" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });
    const result = await db.insert(products).values({ brand, name, slug, description, priceZar: Number(priceZar).toFixed(2), imageUrl, collectionId: Number(collectionId), categoryId: Number(categoryId), stock: Number(stock ?? 0), isAvailable: true });
    const item = (await db.select().from(products).where(eq(products.id, Number(result[0].insertId))).limit(1))[0];
    return res.status(201).json({ item });
  });

  router.put("/items/:id", requireJwt, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const db = await getDb();
    if (!db || !Number.isInteger(id)) return res.status(400).json({ error: "Valid item id required" });
    const update = { ...req.body } as Record<string, unknown>;
    if (update.priceZar !== undefined) update.priceZar = Number(update.priceZar).toFixed(2);
    if (update.collectionId !== undefined) update.collectionId = Number(update.collectionId);
    if (update.categoryId !== undefined) update.categoryId = Number(update.categoryId);
    if (update.stock !== undefined) update.stock = Number(update.stock);
    await db.update(products).set(update).where(eq(products.id, id));
    const item = (await db.select().from(products).where(eq(products.id, id)).limit(1))[0];
    return item ? res.json({ item }) : res.status(404).json({ error: "Item not found" });
  });

  router.delete("/items/:id", requireJwt, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const db = await getDb();
    if (!db || !Number.isInteger(id)) return res.status(400).json({ error: "Valid item id required" });
    await db.delete(products).where(eq(products.id, id));
    return res.status(204).send();
  });

  router.get("/catalogue/meta", async (_req, res) => {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database unavailable" });
    const [collectionRows, categoryRows] = await Promise.all([
      db.select().from(collections).orderBy(collections.sortOrder),
      db.select().from(categories).orderBy(categories.name),
    ]);
    return res.json({ collections: collectionRows, categories: categoryRows });
  });

  app.use("/api", router);
}
