import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";

const db = {
  insert: vi.fn(() => ({ values: vi.fn(async () => [{ insertId: 9 }]) })),
  update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(async () => []) })) })),
  delete: vi.fn(() => ({ where: vi.fn(async () => []) })),
};
const mocks = vi.hoisted(() => ({
  getDb: vi.fn(async () => db),
  listProducts: vi.fn(async (input: unknown) => [{ id: 1, input }]),
  getProduct: vi.fn(async () => ({ id: 1 })),
  listCollections: vi.fn(async () => []),
  listCategories: vi.fn(async () => []),
  getOrCreateCart: vi.fn(async (...args: unknown[]) => args),
  upsertCartItem: vi.fn(async (...args: unknown[]) => args),
  removeCartItem: vi.fn(async (...args: unknown[]) => args),
  listOrders: vi.fn(async () => []),
  listUsers: vi.fn(async () => []),
  createOrder: vi.fn(async (...args: unknown[]) => ({ orderId: 7, args })),
}));
vi.mock("./db", () => mocks);

type TestUser = { id: number; openId: string; role: "user" | "admin"; name: string | null; email: string | null; loginMethod: string | null; createdAt: Date; updatedAt: Date; lastSignedIn: Date };
const user = (role: "user" | "admin"): TestUser => ({ id: 42, openId: "test", role, name: "Test", email: "test@example.com", loginMethod: "test", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() });
const ctx = (role: "user" | "admin") => ({ user: user(role), req: { protocol: "https", headers: {} } as never, res: { clearCookie: vi.fn() } as never });

describe("NEXUS procedures", () => {
  beforeEach(() => vi.clearAllMocks());
  it("forwards catalogue search, filter, and sort inputs", async () => {
    await appRouter.createCaller(ctx("user")).catalogue.products({ search: "Sony", collectionId: 4, categoryId: 1, minPrice: 1000, maxPrice: 9000, sort: "price-low" });
    expect(mocks.listProducts).toHaveBeenCalledWith(expect.objectContaining({ search: "Sony", collectionId: 4, categoryId: 1, minPrice: 1000, maxPrice: 9000, sort: "price-low" }));
  });
  it("forwards authenticated cart retrieval, set, and remove mutations", async () => {
    const caller = appRouter.createCaller(ctx("user"));
    await caller.cart.get();
    await caller.cart.setItem({ productId: 3, quantity: 2 });
    await caller.cart.removeItem({ productId: 3 });
    expect(mocks.getOrCreateCart).toHaveBeenCalledWith(42);
    expect(mocks.upsertCartItem).toHaveBeenCalledWith(42, 3, 2);
    expect(mocks.removeCartItem).toHaveBeenCalledWith(42, 3);
  });
  it("creates an authenticated order contract", async () => {
    const result = await appRouter.createCaller(ctx("user")).orders.create({ items: [{ productId: 3, quantity: 2 }] });
    expect(result.orderId).toBe(7);
    expect(mocks.createOrder).toHaveBeenCalledWith(42, [{ productId: 3, quantity: 2 }]);
  });
  it("rejects admin mutations for non-admin users", async () => {
    const caller = appRouter.createCaller(ctx("user"));
    await expect(caller.admin.products()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.deleteProduct({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
  it("allows admin product create, update, delete, and list procedures", async () => {
    const caller = appRouter.createCaller(ctx("admin"));
    await caller.admin.products();
    await caller.admin.createProduct({ brand: "Apple", name: "iPad Air 11-inch", slug: "ipad-air-test", description: "Test", priceZar: 11999, imageUrl: "/manus-storage/ipad-air_c779f4bc.jpg", collectionId: 5, categoryId: 6, stock: 4, isAvailable: true });
    await caller.admin.updateProduct({ id: 1, data: { stock: 3 } });
    await caller.admin.deleteProduct({ id: 1 });
    expect(mocks.listProducts).toHaveBeenCalledWith({ sort: "newest" });
    expect(db.insert).toHaveBeenCalled();
    expect(db.update).toHaveBeenCalled();
    expect(db.delete).toHaveBeenCalled();
  });
});
