import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("portal UI redesign", () => {
  it("usa fetch same-origin no banner de cookies", () => {
    const source = readFileSync(resolve("apps/web/src/components/CookieConsent.astro"), "utf8");
    expect(source).toContain('fetch("/api/consent"');
    expect(source).toContain("application/json");
    expect(source).toContain('credentials: "same-origin"');
  });

  it("API de consentimento aceita JSON", () => {
    const source = readFileSync(resolve("apps/web/src/pages/api/consent.ts"), "utf8");
    expect(source).toContain("application/json");
    expect(source).toContain("Response.json");
  });

  it("menu mobile expõe aria-expanded", () => {
    const source = readFileSync(resolve("apps/web/src/components/MobileNav.astro"), "utf8");
    expect(source).toContain("aria-expanded");
    expect(source).toContain("aria-controls");
  });

  it("cabeçalho destaca publicar vaga", () => {
    const source = readFileSync(resolve("apps/web/src/components/SiteHeader.astro"), "utf8");
    expect(source).toContain("/publicar-vaga");
    expect(source).toContain("Publicar vaga");
    expect(source).toContain("aria-current");
    expect(source).toContain("BrandLogo");
    expect(source).toContain("LOGO_MAIN");
  });

  it("home inclui seção Instagram e busca", () => {
    const source = readFileSync(resolve("apps/web/src/pages/index.astro"), "utf8");
    expect(source).toContain("InstagramFollow");
    expect(source).toContain('name="q"');
    expect(source).toContain('name="cidade"');
  });
  it("contagem de vagas publicadas hoje usa o dia de São Paulo e não o tamanho da lista", () => {
    const source = readFileSync(resolve("apps/web/src/pages/index.astro"), "utf8");
    expect(source).toContain("America/Sao_Paulo");
    expect(source).toContain("gte(jobs.publishedAt, todayStart)");
    expect(source).toContain("lt(jobs.publishedAt, todayEnd)");
    expect(source).toContain("publishedToday > 0");
    expect(source).not.toContain("recent.length} adicionadas hoje");
  });

  it("listagem de vagas possui filtros laterais e chips", () => {
    const source = readFileSync(resolve("apps/web/src/pages/vagas/index.astro"), "utf8");
    expect(source).toContain("chip-active");
    expect(source).toContain("Filtros");
    expect(source).toContain("JobCard");
  });
});
