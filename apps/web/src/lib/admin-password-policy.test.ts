import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_PASSWORD_MIN_LENGTH, ADMIN_PASSWORD_MIN_MESSAGE } from "@es/shared";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("política de senha administrativa", () => {
  it("centraliza mínimo de 9 caracteres em @es/shared", () => {
    expect(ADMIN_PASSWORD_MIN_LENGTH).toBe(9);
    expect(ADMIN_PASSWORD_MIN_MESSAGE).toBe("A senha deve ter pelo menos 9 caracteres.");
  });

  it("aplica constante no login, criação e recuperação de senha", () => {
    expect(read("apps/web/src/pages/admin/login.astro")).toContain("ADMIN_PASSWORD_MIN_LENGTH");
    expect(read("apps/web/src/pages/redefinir-admin.astro")).toContain("ADMIN_PASSWORD_MIN_LENGTH");
    expect(read("apps/web/src/pages/admin/administradores.astro")).toContain("ADMIN_PASSWORD_MIN_LENGTH");
    expect(read("apps/web/src/pages/api/admin/login.ts")).toContain("adminPasswordSchema");
    expect(read("apps/web/src/pages/api/admin/admins/index.ts")).toContain("adminPasswordSchema");
    expect(read("apps/web/src/pages/api/auth/admin-password/reset.ts")).toContain("adminPasswordSchema");
    expect(read("packages/db/scripts/seed-rbac-admin.ts")).toContain("assertAdminPasswordLength");
  });

  it("não mantém mínimos antigos de 10 ou 14 nos fluxos administrativos", () => {
    expect(read("apps/web/src/pages/admin/login.astro")).not.toContain('minlength="10"');
    expect(read("apps/web/src/pages/redefinir-admin.astro")).not.toContain('minlength="14"');
    expect(read("apps/web/src/pages/api/admin/login.ts")).not.toContain(".min(10)");
    expect(read("apps/web/src/pages/api/admin/admins/index.ts")).not.toContain(".min(14)");
    expect(read("apps/web/src/pages/api/auth/admin-password/reset.ts")).not.toContain(".min(14)");
    expect(read("packages/db/scripts/seed-rbac-admin.ts")).not.toContain("14 caracteres");
  });
});
