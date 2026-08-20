import { describe, expect, it } from "vitest";
import { categories, collections, formatZAR, products } from "../shared/nexusData";

describe("NEXUS catalogue integrity", () => {
  it("keeps the required collection and category vocabulary", () => {
    expect(collections.map((item) => item.name)).toEqual(["STUDY", "CREATE", "BUILD", "FOCUS", "TRAVEL"]);
    expect(categories).toEqual(["AUDIO", "KEYBOARDS", "DISPLAYS", "STORAGE", "ACCESSORIES", "MOBILE", "WORKSTATIONS", "CAMERAS"]);
  });

  it("formats prices in South African Rand", () => {
    expect(formatZAR(1499).replace(/\u00a0/g, " ")).toBe("R1 499");
    expect(formatZAR(24999).replace(/\u00a0/g, " ")).toBe("R24 999");
  });

  it("has unique image paths for every seeded catalogue product", () => {
    expect(products).toHaveLength(10);
    expect(new Set(products.map((product) => product.image)).size).toBe(10);
    expect(products.every((product) => product.price > 0 && product.stock > 0)).toBe(true);
  });
});
