import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { INSTITUTIONAL_DEFAULTS_HTML } from "./institutional-defaults";
import { INSTITUTIONAL_SLUGS } from "./site-pages";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("transparência pública das imagens editoriais", () => {
  it("publica uma política específica, útil e sem equiparar ilustração a vaga real", () => {
    const html = INSTITUTIONAL_DEFAULTS_HTML["politica-imagens"];
    expect(INSTITUTIONAL_SLUGS).toContain("politica-imagens");
    expect(html).toContain("Ilustração não é prova de uma vaga");
    expect(html).toContain("não comprova que existe uma contratação aberta");
    expect(html).toContain("manifesto interno");
    expect(html).toContain('href="/politica-correcoes"');
    expect(html).toContain('href="/contato"');
  });

  it("expõe a política por rota e navegação institucionais", () => {
    expect(existsSync(resolve("apps/web/src/pages/politica-imagens.astro"))).toBe(true);
    expect(read("apps/web/src/components/SiteFooter.astro")).toContain(
      'href="/politica-imagens">Política de imagens'
    );
  });

  it("inclui a página no sitemap e na superfície indexável de revisão", () => {
    expect(read("apps/web/src/lib/sitemaps.ts")).toContain('"/politica-imagens"');
    expect(read("apps/web/src/lib/adsense-review-mode.ts")).toContain('"/politica-imagens"');
  });

  it("mantém a atribuição pública condicionada aos dois manifestos auditados", () => {
    const resolver = read("apps/web/src/lib/editorial-cover-metadata.ts");
    expect(resolver).toContain("sl-local/credits.json");
    expect(resolver).toContain("adsense-quality/credits.json");
    expect(resolver).toContain('credit.source !== "original"');
    expect(resolver).toContain('credit.licenseStatus !== "owned"');
    expect(resolver).toContain("pathname !== expectedPath");
  });
});
