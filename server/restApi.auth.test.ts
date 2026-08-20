import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { createLocalToken, hashPassword, verifyPassword } from "./restApi";
import { ENV } from "./_core/env";

describe("local JWT/bcrypt authentication", () => {
  it("hashes passwords and verifies only the original password", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    expect(hash).not.toContain("correct-horse");
    await expect(verifyPassword("correct-horse-battery-staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });

  it("issues a verifiable role-aware JWT", () => {
    const token = createLocalToken({ id: 42, role: "admin", email: "admin@nexus.local" });
    const payload = jwt.verify(token, ENV.cookieSecret || process.env.JWT_SECRET || "nexus-local-development-secret") as jwt.JwtPayload;
    expect(payload.sub).toBe("42");
    expect(payload.role).toBe("admin");
    expect(payload.email).toBe("admin@nexus.local");
  });
});
