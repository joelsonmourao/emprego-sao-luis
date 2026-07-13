import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { maskDatabaseUrl } from "./postgres-error";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("rotas de autenticação separadas", () => {
  it("admin redireciona para /admin e empresa para /empresa/dashboard", () => {
    expect(read("apps/web/src/pages/admin/login.astro")).toContain('return Astro.redirect("/admin")');
    expect(read("apps/web/src/pages/empresa/login.astro")).toContain('return Astro.redirect("/empresa/dashboard")');
    expect(read("apps/web/src/pages/api/admin/login.ts")).toContain('parsed.data.next ?? "/admin"');
    expect(read("apps/web/src/pages/api/empresa/login.ts")).toContain('"/empresa/dashboard"');
  });

  it("middleware protege áreas distintas", () => {
    const middleware = read("apps/web/src/middleware.ts");
    expect(middleware).toContain("/admin/login");
    expect(middleware).toContain("/empresa/login");
    expect(middleware).toContain("redirect(`/admin/login");
    expect(middleware).toContain("redirect(`/empresa/login");
  });

  it("navegação pública aponta corretamente", () => {
    expect(read("apps/web/src/components/SiteHeader.astro")).toContain('href="/empresa/login"');
    expect(read("apps/web/src/components/SiteHeader.astro")).toContain("Área da empresa");
    expect(read("apps/web/src/components/SiteFooter.astro")).toContain('href="/admin/login"');
    expect(read("apps/web/src/components/SiteFooter.astro")).toContain("Administração");
    expect(read("apps/web/src/components/SiteFooter.astro")).not.toContain("Entrar no painel administrativo");
  });

  it("páginas de login deixam os papéis explícitos", () => {
    expect(read("apps/web/src/pages/admin/login.astro")).toContain("Painel administrativo");
    expect(read("apps/web/src/pages/admin/login.astro")).toContain("/empresa/login");
    expect(read("apps/web/src/pages/empresa/login.astro")).toContain("Área da empresa");
    expect(read("apps/web/src/pages/empresa/login.astro")).toContain("Não é o painel administrativo");
  });

  it("API admin restringe destino pós-login à área /admin", () => {
    expect(read("apps/web/src/pages/api/admin/login.ts")).toContain('value.startsWith("/admin")');
  });
});

describe("mascaramento de DATABASE_URL", () => {
  it("não expõe senha na URL", () => {
    const masked = maskDatabaseUrl("postgresql://admin:segredo@db.internal:5432/empregos");
    expect(masked).toMatchObject({ host: "db.internal", port: "5432", database: "empregos" });
    expect(JSON.stringify(masked)).not.toContain("segredo");
  });
});
