import { describe, expect, it } from "vitest";
import { can, decryptSecret, encryptSecret, type AdminIdentity } from "./auth";
const base: AdminIdentity = { id: "1", email: "admin@example.com", name: "Admin", roles: [], permissions: [] };
describe("RBAC", () => {
  it("allows explicit permission", () => expect(can({ ...base, permissions: ["jobs.publish"] }, "jobs.publish")).toBe(true));
  it("denies missing permission", () => expect(can(base, "jobs.publish")).toBe(false));
  it("allows super admin", () => expect(can({ ...base, roles: ["SUPER_ADMIN"] }, "users.manage")).toBe(true));
});
describe("MFA secret encryption", () => {
  it("round-trips without storing plaintext", () => { process.env.AUTH_SECRET = "test-secret-with-at-least-thirty-two-characters"; const encrypted = encryptSecret("BASE32SECRET"); expect(encrypted).not.toContain("BASE32SECRET"); expect(decryptSecret(encrypted)).toBe("BASE32SECRET"); });
});
