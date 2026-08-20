import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { canManageItems, createLocalToken, registerRestApi } from "./restApi";

function createTestApp() {
  const app = express();
  app.use(express.json());
  registerRestApi(app);
  return app;
}

describe("rubric REST item endpoints", () => {
  it("returns the seeded catalogue collection from GET /api/items", async () => {
    const response = await request(createTestApp()).get("/api/items");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.items[0]).toHaveProperty("name");
  });

  it("returns a seeded item from GET /api/items/:id", async () => {
    const response = await request(createTestApp()).get("/api/items/1");
    expect(response.status).toBe(200);
    expect(response.body.item).toHaveProperty("id", 1);
    expect(response.body.item).toHaveProperty("priceZar");
  });

  it("rejects malformed item detail ids", async () => {
    const response = await request(createTestApp()).get("/api/items/not-a-number");
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Valid item id");
  });

  it("protects mobile purchase creation behind a bearer token", async () => {
    const response = await request(createTestApp()).post("/api/orders").send({ items: [{ productId: 1, quantity: 1 }] });
    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Bearer token");
  });

  it("protects admin CRUD creation behind a bearer token", async () => {
    const response = await request(createTestApp()).post("/api/items").send({ name: "Unauthorized item" });
    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Bearer token");
  });

  it("recognizes an admin bearer role as authorized for item management", () => {
    expect(canManageItems("admin")).toBe(true);
    expect(canManageItems("user")).toBe(false);
    expect(canManageItems(undefined)).toBe(false);
  });

  it("rejects a signed non-admin token for update and delete mutations", async () => {
    const token = createLocalToken({ id: 999999, role: "user", email: "user@nexus.local" });
    const update = await request(createTestApp()).put("/api/items/1").set("Authorization", `Bearer ${token}`).send({ stock: 1 });
    const remove = await request(createTestApp()).delete("/api/items/1").set("Authorization", `Bearer ${token}`);
    expect(update.status).toBe(403);
    expect(remove.status).toBe(403);
    expect(update.body.error).toContain("Admin access");
  });
});
