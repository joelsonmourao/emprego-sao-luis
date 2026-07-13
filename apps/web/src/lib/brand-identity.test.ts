import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BRAND_ASSET_KEYS,
  BRAND_ASSET_LABELS,
  FALLBACK_PATHS,
  maxBytesForKey
} from "./brand/constants";
import { sanitizeSvg, detectMime, contrastRatio } from "./brand/image-processor";
import { buildBrandPublicUrl, getStorageInfo, siteBaseUrl } from "./brand/storage";
import { invalidateBrandCache } from "./brand/identity-service";

describe("brand constants", () => {
  it("define todas as chaves administráveis", () => {
    expect(Object.keys(BRAND_ASSET_LABELS).length).toBe(12);
    expect(BRAND_ASSET_KEYS.LOGO_MAIN).toBe("brand.logo.main");
    expect(FALLBACK_PATHS[BRAND_ASSET_KEYS.FAVICON]).toBe("/favicon.ico");
  });

  it("limites de upload por tipo", () => {
    expect(maxBytesForKey(BRAND_ASSET_KEYS.FAVICON)).toBe(1024 * 1024);
    expect(maxBytesForKey(BRAND_ASSET_KEYS.OG_DEFAULT)).toBe(8 * 1024 * 1024);
    expect(maxBytesForKey(BRAND_ASSET_KEYS.LOGO_MAIN)).toBe(5 * 1024 * 1024);
  });
});

describe("brand image processor", () => {
  it("rejeita SVG com script", () => {
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>')).toBeNull();
    expect(sanitizeSvg('<svg viewBox="0 0 1 1"><rect/></svg>')).toBeTruthy();
  });

  it("detectMime valida assinatura PNG", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]);
    expect(detectMime(png, "image/png", "logo.png")).toBe("image/png");
    expect(detectMime(png, "text/plain", "logo.png")).toBe("image/png");
  });

  it("contrastRatio calcula contraste mínimo", () => {
    expect(contrastRatio("#1A1A1A", "#FFFFFF")).toBeGreaterThan(10);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBe(1);
  });
});

describe("brand storage", () => {
  it("URL pública sem www", () => {
    const url = buildBrandPublicUrl("brand/logo/main/original.png", "abc123");
    expect(url).not.toContain("www.");
    expect(url).toContain("v=abc123");
  });

  it("siteBaseUrl remove www", () => {
    vi.stubEnv("SITE_URL", "https://www.empregossaoluis.com.br");
    expect(siteBaseUrl()).toBe("https://empregossaoluis.com.br");
    vi.unstubAllEnvs();
  });

  it("getStorageInfo retorna volume quando S3 ausente", () => {
    vi.stubEnv("S3_BUCKET", "");
    const info = getStorageInfo();
    expect(info.provider).toBe("volume");
    expect(info.ready).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe("brand cache", () => {
  it("invalidateBrandCache é exportado", () => {
    expect(() => invalidateBrandCache()).not.toThrow();
  });
});

describe("BrandLogo component", () => {
  it("existe e usa getBrandIdentity", () => {
    const source = readFileSync(resolve("apps/web/src/components/BrandLogo.astro"), "utf8");
    expect(source).toContain("getBrandIdentity");
    expect(source).toContain("assetKey");
  });
});

describe("layouts usam identidade dinâmica", () => {
  it("SiteHeader usa BrandLogo", () => {
    const source = readFileSync(resolve("apps/web/src/components/SiteHeader.astro"), "utf8");
    expect(source).toContain("BrandLogo");
    expect(source).not.toContain("logoHorizontalWebp");
  });

  it("BaseLayout usa manifest dinâmico", () => {
    const source = readFileSync(resolve("apps/web/src/layouts/BaseLayout.astro"), "utf8");
    expect(source).toContain("/api/brand-manifest.webmanifest");
    expect(source).toContain("getBrandIdentity");
  });

  it("admin identidade visual existe", () => {
    const source = readFileSync(resolve("apps/web/src/pages/admin/configuracoes/identidade-visual.astro"), "utf8");
    expect(source).toContain("settings.brand.view");
    expect(source).toContain("BRAND_ASSET_GROUPS");
  });
});

describe("form contrast CSS", () => {
  it("global.css define es-label e es-input visíveis", () => {
    const css = readFileSync(resolve("apps/web/src/styles/global.css"), "utf8");
    expect(css).toContain(".es-label");
    expect(css).toContain("color: var(--text-primary)");
    expect(css).toContain(".es-input::placeholder");
  });
});

describe("auth permissions", () => {
  it("can() reconhece settings.brand via settings.manage", () => {
    const source = readFileSync(resolve("apps/web/src/lib/auth.ts"), "utf8");
    expect(source).toContain("settings.brand.");
    expect(source).toContain("media.upload");
  });
});
