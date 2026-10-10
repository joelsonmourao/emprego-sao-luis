import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("recuperação de senha administrativa", () => {
  it("login aponta para /admin/esqueci-senha", () => {
    const login = read("apps/web/src/pages/admin/login.astro");
    expect(login).toContain('href="/admin/esqueci-senha"');
    expect(login).not.toContain("/api/auth/admin-password/request");
    expect(login).not.toContain("/recuperar-admin");
  });

  it("página pública não envia formulário direto para API", () => {
    const page = read("apps/web/src/pages/admin/esqueci-senha.astro");
    expect(page).toContain("Recuperar senha");
    expect(page).toContain('fetch("/api/auth/admin-password/request"');
    expect(page).toContain('credentials: "same-origin"');
    expect(page).toContain("application/json");
    expect(page).not.toContain('action="/api/auth/admin-password/request"');
    expect(page).not.toContain('href="/api/auth/admin-password/request"');
  });

  it("API de solicitação rejeita GET e responde de forma neutra", () => {
    const api = read("apps/web/src/pages/api/auth/admin-password/request.ts");
    expect(api).toContain("status: 405");
    expect(api).toContain('Allow: "POST"');
    expect(api).toContain("ADMIN_PASSWORD_RESET_NEUTRAL_MESSAGE");
    expect(api).toContain("ADMIN_PASSWORD_RESET_EMAIL_UNAVAILABLE");
  });

  it("redefinição usa página pública e API JSON", () => {
    const page = read("apps/web/src/pages/admin/redefinir-senha.astro");
    const api = read("apps/web/src/pages/api/auth/admin-password/reset.ts");
    expect(page).toContain('fetch("/api/auth/admin-password/reset"');
    expect(page).toContain('minlength={ADMIN_PASSWORD_MIN_LENGTH}');
    expect(api).toContain("status: 405");
    expect(api).toContain('redirect: "/admin/login?status=senha-alterada"');
  });

  it("rotas legadas redirecionam para o novo fluxo", () => {
    expect(read("apps/web/src/pages/recuperar-admin.astro")).toContain("/admin/esqueci-senha");
    expect(read("apps/web/src/pages/redefinir-admin.astro")).toContain("/admin/redefinir-senha");
  });

  it("middleware libera páginas públicas de autenticação", () => {
    const middleware = read("apps/web/src/middleware.ts");
    expect(middleware).toContain("/admin/esqueci-senha");
    expect(middleware).toContain("/admin/redefinir-senha");
  });
});

describe("login administrativo", () => {
  it("API retorna JSON com redirect em sucesso", () => {
    const api = read("apps/web/src/pages/api/admin/login.ts");
    expect(api).toContain('Response.json({ ok: true, redirect:');
    expect(api).not.toContain("return redirect(");
  });

  it("frontend trata resposta JSON de sucesso", () => {
    const page = read("apps/web/src/pages/admin/login.astro");
    expect(page).toContain("payload.ok === true");
    expect(page).toContain("payload.redirect");
    expect(page).toContain("application/json");
    expect(page).toContain("mfaCode");
    expect(page).not.toContain("FormData");
  });

  it("authenticate diferencia falhas internamente", () => {
    const auth = read("apps/web/src/lib/auth.ts");
    expect(auth).toContain("user_not_found");
    expect(auth).toContain("password_invalid");
    expect(auth).toContain("no_admin_role");
    expect(auth).toContain("mfa_required");
    expect(auth).toContain("ADMIN_PANEL_ROLES");
  });

  it("login API retorna erro genérico para credenciais inválidas", () => {
    const api = read("apps/web/src/pages/api/admin/login.ts");
    expect(api).toContain('"Credenciais inválidas."');
  });
});
