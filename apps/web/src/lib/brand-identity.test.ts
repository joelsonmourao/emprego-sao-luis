import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { BRAND_ASSETS, BRAND_COLORS, brandCssVariables } from "./brand-assets";

describe("brand identity", () => {
  it("documenta identidade em docs/BRAND_IDENTITY.md", () => {
    const doc = readFileSync(resolve("docs/BRAND_IDENTITY.md"), "utf8");
    expect(doc).toContain("logo-horizontal.webp");
    expect(doc).toContain("#9B2D30");
    expect(doc).toContain("abandonadas do redesign");
  });

  it("expõe assets da pasta Logo em public/brand", () => {
    for (const file of ["logo-horizontal.png", "logo-horizontal.webp", "icon.webp"]) {
      expect(existsSync(resolve(`apps/web/public/brand/${file}`))).toBe(true);
    }
  });

  it("configura favicon e manifest", () => {
    for (const file of ["favicon.ico", "favicon.svg", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "site.webmanifest"]) {
      expect(existsSync(resolve(`apps/web/public/${file}`))).toBe(true);
    }
    const manifest = readFileSync(resolve("apps/web/public/site.webmanifest"), "utf8");
    expect(manifest).toContain(BRAND_ASSETS.themeColor);
  });

  it("usa paleta derivada da marca, não vinho/creme/verde do redesign", () => {
    expect(BRAND_COLORS.brandPrimary).toBe("#9B2D30");
    expect(brandCssVariables()).toContain("--brand-primary");
    expect(brandCssVariables()).not.toContain("--es-wine");
    const css = readFileSync(resolve("apps/web/src/styles/global.css"), "utf8");
    expect(css).toContain("--brand-primary: #9B2D30");
    expect(css).not.toContain("--es-green");
  });

  it("cabeçalho usa logo real e publicar-vaga", () => {
    const header = readFileSync(resolve("apps/web/src/components/SiteHeader.astro"), "utf8");
    expect(header).toContain("logoHorizontalWebp");
    expect(header).toContain("<picture>");
    expect(header).toContain("/publicar-vaga");
    expect(header).toContain("BRAND_ASSETS.logoAlt");
  });

  it("registra eventos de clique no Instagram", () => {
    const api = readFileSync(resolve("apps/web/src/pages/api/events/instagram.ts"), "utf8");
    expect(api).toContain("INSTAGRAM_TRACK_EVENTS");
  });

  it("redireciona www para domínio canônico sem www", () => {
    const mw = readFileSync(resolve("apps/web/src/middleware.ts"), "utf8");
    expect(mw).toContain("CANONICAL_HOST");
    expect(mw).toContain("www.${CANONICAL_HOST}");
    expect(mw).toContain("301");
  });

  it("fluxo comercial não libera vaga antes do pagamento", () => {
    const draft = readFileSync(resolve("apps/web/src/pages/api/commercial/job-draft.ts"), "utf8");
    expect(draft).toContain('order.status !== "PAID"');
    const gateway = readFileSync(resolve("apps/web/src/lib/payments/gateway.ts"), "utf8");
    expect(gateway).toContain("unavailable");
  });
});
