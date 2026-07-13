import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("contraste de formulários em painéis claros", () => {
  const css = read("apps/web/src/styles/global.css");

  it("define painel de busca com cores explícitas", () => {
    expect(css).toContain(".hero-search-panel");
    expect(css).toContain("color: #1a1a1a");
    expect(css).toContain("background: #ffffff");
    expect(css).toContain("color-scheme: light");
  });

  it("força contraste em labels, inputs, selects e placeholders", () => {
    expect(css).toMatch(/\.hero-search-panel label[\s\S]*color: #1a1a1a !important/);
    expect(css).toMatch(/\.hero-search-panel input[\s\S]*color: #1a1a1a !important/);
    expect(css).toMatch(/\.hero-search-panel select[\s\S]*color: #1a1a1a !important/);
    expect(css).toMatch(/\.hero-search-panel input::placeholder[\s\S]*color: #6b7280 !important/);
    expect(css).toMatch(/\.hero-search-panel select option[\s\S]*color: #1a1a1a/);
  });

  it("corrige autofill e mantém botão submit com texto branco", () => {
    expect(css).toMatch(/\.hero-search-panel input:-webkit-autofill[\s\S]*-webkit-text-fill-color: #1a1a1a !important/);
    expect(css).toMatch(/\.hero-search-panel button\[type="submit"\][\s\S]*color: #ffffff !important/);
  });

  it("reutiliza painel claro em filtros e formulários auditados", () => {
    expect(css).toContain(".es-light-form-panel");
    expect(read("apps/web/src/pages/index.astro")).toContain("hero-search-panel");
    expect(read("apps/web/src/pages/vagas/index.astro")).toContain("es-light-form-panel");
    expect(read("apps/web/src/pages/alertas.astro")).toContain("es-light-form-panel");
    expect(read("apps/web/src/components/InstitutionalPage.astro")).toContain("es-light-form-panel");
    expect(read("apps/web/src/pages/publicar-vaga/plano/[slug].astro")).toContain("es-light-form-panel");
    expect(read("apps/web/src/pages/empresa/login.astro")).toContain("es-light-form-panel");
  });

  it("isola text-white do hero para não afetar o slot de busca", () => {
    const hero = read("apps/web/src/components/ui/PageHero.astro");
    expect(hero).not.toMatch(/hero-pattern text-white/);
    expect(hero).toContain('class={pattern ? "text-white" : ""}');
  });

  it("define tokens legados de cor para evitar variáveis indefinidas", () => {
    expect(css).toContain("--es-ink:");
    expect(css).toContain("--es-muted:");
    expect(css).toContain("--es-border:");
  });
});
