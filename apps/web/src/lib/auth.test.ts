import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { can, decryptSecret, encryptSecret, verifyAdminCredentials, type AdminIdentity } from "./auth";
const base: AdminIdentity = { id: "1", email: "admin@example.com", name: "Admin", roles: [], permissions: [] };
describe("RBAC", () => {
  it("allows explicit permission", () => expect(can({ ...base, permissions: ["jobs.publish"] }, "jobs.publish")).toBe(true));
  it("denies missing permission", () => expect(can(base, "jobs.publish")).toBe(false));
  it("allows super admin", () => expect(can({ ...base, roles: ["SUPER_ADMIN"] }, "users.manage")).toBe(true));
});
describe("MFA secret encryption", () => {
  it("round-trips without storing plaintext", () => { process.env.AUTH_SECRET = "test-secret-with-at-least-thirty-two-characters"; const encrypted = encryptSecret("BASE32SECRET"); expect(encrypted).not.toContain("BASE32SECRET"); expect(decryptSecret(encrypted)).toBe("BASE32SECRET"); });
});
describe("admin credentials", () => {
  it("aceita a senha correta", async () => {
    const passwordHash = await bcrypt.hash("123456789", 4);
    await expect(verifyAdminCredentials({ passwordHash }, "123456789")).resolves.toBe(true);
  });
  it("rejeita a senha incorreta", async () => {
    const passwordHash = await bcrypt.hash("123456789", 4);
    await expect(verifyAdminCredentials({ passwordHash }, "incorreta9")).resolves.toBe(false);
  });
  it("rejeita administrador inexistente sem revelar sua ausência", async () => {
    await expect(verifyAdminCredentials(null, "123456789")).resolves.toBe(false);
  });
});
