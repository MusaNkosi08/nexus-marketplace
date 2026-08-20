import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({ getDb: vi.fn() }));

import { getDb } from "./db";
import { createLocalToken, registerRestApi } from "./restApi";

const updateSpy = vi.fn();

const fakeItem = {
  id: 9001,
  brand: "Test Brand",
  name: "Test Item",
  slug: "test-item",
  description: "Safe mocked item",
  priceZar: "100.00",
  imageUrl: "/manus-storage/macbook-air_169c651b.jpg",
  collectionId: 1,
  categoryId: 1,
  stock: 2,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createMockApp() {
  const app = express();
  app.use(express.json());
  registerRestApi(app);
  return app;
}

describe("admin REST mutation success path", () => {
  beforeEach(() => {
    updateSpy.mockClear();
    vi.mocked(getDb).mockResolvedValue({
      insert: () => ({ values: async () => [{ insertId: fakeItem.id }] }),
      select: () => ({ from: () => ({ where: () => ({ limit: async () => [fakeItem] }) }) }),
      update: () => ({ set: (payload: unknown) => ({ where: async () => updateSpy(payload) }) }),
    } as never);
  });

  it("allows an authenticated user to create a stock-aware order", async () => {
    const token = createLocalToken({ id: 7, role: "user", email: "buyer@nexus.local" });
    const response = await request(createMockApp()).post("/api/orders").set("Authorization", `Bearer ${token}`).send({ items: [{ productId: fakeItem.id, quantity: 1 }] });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ status: "confirmed", totalZar: "100.00" });
    expect(updateSpy).toHaveBeenCalledWith({ stock: 1, isAvailable: true });
  });

  it("rejects an authenticated order when requested quantity exceeds stock", async () => {
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({ from: () => ({ where: () => ({ limit: async () => [{ ...fakeItem, stock: 0 }] }) }) }),
    } as never);
    const token = createLocalToken({ id: 7, role: "user", email: "buyer@nexus.local" });
    const response = await request(createMockApp()).post("/api/orders").set("Authorization", `Bearer ${token}`).send({ items: [{ productId: fakeItem.id, quantity: 1 }] });
    expect(response.status).toBe(409);
    expect(response.body.error).toContain("not available");
  });

  it("allows an admin bearer token to reach POST /api/items", async () => {
    const token = createLocalToken({ id: 1, role: "admin", email: "admin@nexus.local" });
    const response = await request(createMockApp())
      .post("/api/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ brand: "Test Brand", name: "Test Item", slug: "test-item", description: "Safe mocked item", priceZar: 100, imageUrl: fakeItem.imageUrl, collectionId: 1, categoryId: 1, stock: 2 });
    expect(response.status).toBe(201);
    expect(response.body.item).toMatchObject({ id: fakeItem.id, name: "Test Item" });
  });
});
