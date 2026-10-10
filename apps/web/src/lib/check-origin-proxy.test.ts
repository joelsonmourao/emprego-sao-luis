import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { requiresJsonContentType } from "./json-api";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("json-api", () => {
  it("exige Content-Type application/json", () => {
    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "email=a"
    });
    expect(requiresJsonContentType(request)).toBe(false);
  });

  it("aceita application/json com charset", () => {
    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
    expect(requiresJsonContentType(request)).toBe(true);
  });
});

describe("checkOrigin e proxy Coolify", () => {
  it("astro.config declara domínios canônicos sem abrir para qualquer host", () => {
    const config = read("apps/web/astro.config.mjs");
    expect(config).toContain("checkOrigin: true");
    expect(config).toContain('hostname: "empregossaoluis.com.br"');
    expect(config).toContain('hostname: "www.empregossaoluis.com.br"');
    expect(config).not.toContain("allowedDomains: [{}]");
  });

  it("login administrativo envia JSON same-origin", () => {
    const login = read("apps/web/src/pages/admin/login.astro");
    expect(login).not.toContain('action="/api/admin/login"');
    expect(login).not.toContain("formaction");
    expect(login).not.toContain("new FormData");
    expect(login).not.toContain("URLSearchParams");
    expect(login).not.toContain("application/x-www-form-urlencoded");
    expect(login).toContain("event.preventDefault()");
    expect(login).toContain('"Content-Type": "application/json"');
    expect(login).toContain('mode: "same-origin"');
    expect(login).toContain("JSON.stringify({");
    expect(login).toContain("mfaCode");
  });

  it("API de login aceita somente JSON", () => {
    const api = read("apps/web/src/pages/api/admin/login.ts");
    expect(api).toContain("parseJsonBody");
    expect(api).toContain("parsed.status");
    expect(api).toContain("mfaCode");
    expect(api).not.toContain("request.formData");
  });

  it("recuperação de senha usa fetch JSON same-origin", () => {
    const forgot = read("apps/web/src/pages/admin/esqueci-senha.astro");
    const resetPage = read("apps/web/src/pages/admin/redefinir-senha.astro");
    const requestApi = read("apps/web/src/pages/api/auth/admin-password/request.ts");
    const resetApi = read("apps/web/src/pages/api/auth/admin-password/reset.ts");

    expect(forgot).toContain('mode: "same-origin"');
    expect(forgot).toContain("JSON.stringify({ email })");
    expect(resetPage).toContain('mode: "same-origin"');
    expect(requestApi).toContain("parseJsonBody");
    expect(requestApi).toContain("parsed.status");
    expect(resetApi).toContain("parseJsonBody");
    expect(resetApi).toContain("parsed.status");
  });
});
