import { describe, expect, it } from "vitest";
import { can, type AdminIdentity } from "./auth";
const base: AdminIdentity = { id: "1", email: "admin@example.com", name: "Admin", roles: [], permissions: [] };
describe("RBAC", () => {
  it("allows explicit permission", () => expect(can({ ...base, permissions: ["jobs.publish"] }, "jobs.publish")).toBe(true));
  it("denies missing permission", () => expect(can(base, "jobs.publish")).toBe(false));
  it("allows super admin", () => expect(can({ ...base, roles: ["SUPER_ADMIN"] }, "users.manage")).toBe(true));
});
