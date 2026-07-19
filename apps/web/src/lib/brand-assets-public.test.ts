import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const publicRoot = resolve("apps/web/public");
const read = (rel: string) => readFileSync(resolve(rel), "utf8");

describe("ativos de marca públicos", () => {
  const required = [
    "brand/icon.webp",
    "brand/icon-instagram.webp",
    "brand/logo-horizontal.webp",
    "brand/logo-horizontal.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon-48x48.png",
    "favicon.ico",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "site.webmanifest"
  ];

  it("arquivos referenciados existem e não estão vazios", () => {
    for (const file of required) {
      const full = resolve(publicRoot, file);
      expect(existsSync(full), file).toBe(true);
      expect(statSync(full).size, file).toBeGreaterThan(200);
    }
  });

  it("ícone Instagram e logo horizontal têm resolução mínima útil", () => {
    expect(statSync(resolve(publicRoot, "brand/icon.webp")).size).toBeGreaterThan(10_000);
    expect(statSync(resolve(publicRoot, "brand/icon-instagram.webp")).size).toBeGreaterThan(8_000);
    expect(statSync(resolve(publicRoot, "brand/logo-horizontal.webp")).size).toBeGreaterThan(10_000);
  });

  it("manifest aponta para ícones existentes", () => {
    const manifest = JSON.parse(read("apps/web/public/site.webmanifest")) as {
      icons: Array<{ src: string }>;
    };
    for (const icon of manifest.icons) {
      expect(existsSync(resolve(publicRoot, icon.src.replace(/^\//, ""))), icon.src).toBe(true);
    }
  });

  it("layout e componentes usam ativos públicos corretos", () => {
    const layout = read("apps/web/src/layouts/BaseLayout.astro");
    const instagram = read("apps/web/src/components/InstagramFollow.astro");
    const footer = read("apps/web/src/components/SiteFooter.astro");
    const header = read("apps/web/src/components/SiteHeader.astro");
    expect(layout).toContain("BRAND_ASSETS.favicon32");
    expect(layout).toContain("BRAND_ASSETS.favicon16");
    expect(layout).toContain('sizes="48x48"');
    expect(instagram).toContain("/brand/icon-instagram.webp");
    expect(instagram).toContain('width="192"');
    expect(instagram).toMatch(/rounded-2xl|object-contain/);
    expect(footer).toContain("LOGO_DARK");
    expect(header).toContain("LOGO_MAIN");
    expect(instagram).not.toMatch(/h-24 w-24/);
  });

  it("não referencia caminhos antigos removidos em componentes públicos", () => {
    const sources = [
      read("apps/web/src/components/InstagramFollow.astro"),
      read("apps/web/src/lib/brand/constants.ts"),
      read("apps/web/src/lib/brand-assets.ts")
    ].join("\n");
    expect(sources).not.toContain("/brand/icon.webp\" class=\"mx-auto h-24");
  });
});
