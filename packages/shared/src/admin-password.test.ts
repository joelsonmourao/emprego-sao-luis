import { describe, expect, it } from "vitest";
import {
  ADMIN_PASSWORD_MIN_LENGTH,
  ADMIN_PASSWORD_MIN_MESSAGE,
  adminPasswordSchema,
  assertAdminPasswordLength,
  isAdminPasswordLongEnough
} from "./admin-password.js";

describe("admin password policy", () => {
  it("define mínimo de 9 caracteres", () => {
    expect(ADMIN_PASSWORD_MIN_LENGTH).toBe(9);
    expect(ADMIN_PASSWORD_MIN_MESSAGE).toBe("A senha deve ter pelo menos 9 caracteres.");
  });

  it("aceita senhas com 9 ou mais caracteres", () => {
    expect(isAdminPasswordLongEnough("123456789")).toBe(true);
    expect(isAdminPasswordLongEnough("abcdefgh")).toBe(false);
    expect(adminPasswordSchema().safeParse("123456789").success).toBe(true);
    expect(adminPasswordSchema().safeParse("12345678").success).toBe(false);
  });

  it("retorna mensagem padronizada no schema Zod", () => {
    const parsed = adminPasswordSchema().safeParse("curta");
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(ADMIN_PASSWORD_MIN_MESSAGE);
    }
  });

  it("lança erro padronizado na validação imperativa", () => {
    expect(() => assertAdminPasswordLength("ok")).toThrow(ADMIN_PASSWORD_MIN_MESSAGE);
    expect(() => assertAdminPasswordLength("123456789")).not.toThrow();
  });
});
