import { describe, expect, it } from "vitest";
import { canAssignRole, canManageAdmin, canRemoveSuperAdmin, isPortalUser, sanitizeAuditPayload } from "./users-admin";

describe("users-admin RBAC", () => {
  it("impede escalada para SUPER_ADMIN", () => {
    expect(canAssignRole(["ADMIN"], "SUPER_ADMIN")).toBe(false);
    expect(canAssignRole(["SUPER_ADMIN"], "SUPER_ADMIN")).toBe(true);
  });

  it("permite ADMIN gerenciar papéis inferiores", () => {
    expect(canAssignRole(["ADMIN"], "EDITOR")).toBe(true);
    expect(canAssignRole(["EDITOR"], "ADMIN")).toBe(false);
  });

  it("impede gerenciar administrador de nível igual ou superior", () => {
    expect(canManageAdmin(["ADMIN"], ["EDITOR"])).toBe(true);
    expect(canManageAdmin(["EDITOR"], ["ADMIN"])).toBe(false);
    expect(canManageAdmin(["ADMIN"], ["ADMIN"])).toBe(false);
  });

  it("protege o último SUPER_ADMIN", () => {
    expect(canRemoveSuperAdmin(["SUPER_ADMIN"], 1)).toBe(false);
    expect(canRemoveSuperAdmin(["SUPER_ADMIN"], 2)).toBe(true);
  });

  it("identifica usuários do portal sem papéis administrativos", () => {
    expect(isPortalUser([])).toBe(true);
    expect(isPortalUser(["COMPANY_USER"])).toBe(true);
    expect(isPortalUser(["EDITOR"])).toBe(false);
  });

  it("oculta campos sensíveis na exportação de auditoria", () => {
    const sanitized = sanitizeAuditPayload({ email: "a@b.com", passwordHash: "x", nested: { token: "abc" } });
    expect(sanitized).toEqual({ email: "a@b.com", passwordHash: "[oculto]", nested: { token: "[oculto]" } });
  });
});
