import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({ getDb: vi.fn() }));

import { getDb } from "./db";
import { createLocalToken, registerRestApi } from "./restApi";

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
    vi.mocked(getDb).mockResolvedValue({
      insert: () => ({ values: async () => [{ insertId: fakeItem.id }] }),
      select: () => ({ from: () => ({ where: () => ({ limit: async () => [fakeItem] }) }) }),
    } as never);
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
