import { afterEach, describe, expect, it } from "vitest";
import { getRuntimeSiteUrl, resolveCanonicalUrl, resolvePublicHttpUrl } from "./canonical-url";

const site = new URL("https://empregossaoluis.com.br");
const originalSiteUrl = process.env.SITE_URL;

afterEach(() => {
  if (originalSiteUrl === undefined) delete process.env.SITE_URL;
  else process.env.SITE_URL = originalSiteUrl;
});

describe("resolveCanonicalUrl", () => {
  it("removes tracking parameters and trailing slash", () => {
    expect(resolveCanonicalUrl("/blog/guia/?utm_source=teste#topo", "/blog/guia", site))
      .toBe("https://empregossaoluis.com.br/blog/guia");
  });

  it("does not allow an external canonical for an owned page", () => {
    expect(resolveCanonicalUrl("https://example.com/copia", "/noticias/local", site))
      .toBe("https://empregossaoluis.com.br/noticias/local");
  });

  it("uses the requested path when the candidate is invalid", () => {
    expect(resolveCanonicalUrl("http://[", "/", site)).toBe("https://empregossaoluis.com.br/");
  });

  it("prefers SITE_URL from runtime over the value baked into Astro.site", () => {
    process.env.SITE_URL = "https://runtime.empregossaoluis.com.br";
    expect(getRuntimeSiteUrl(new URL("http://localhost:4321")).toString())
      .toBe("https://runtime.empregossaoluis.com.br/");
  });

  it("rejects localhost SITE_URL and Astro.site fallbacks", () => {
    delete process.env.SITE_URL;
    expect(getRuntimeSiteUrl(new URL("http://localhost:4321")).toString())
      .toBe("https://empregossaoluis.com.br/");
    process.env.SITE_URL = "http://127.0.0.1:4321";
    expect(getRuntimeSiteUrl().toString()).toBe("https://empregossaoluis.com.br/");
  });

  it("normalizes SITE_URL to its HTTP origin", () => {
    process.env.SITE_URL = "https://empregossaoluis.com.br/subpath?preview=1#fragment";
    expect(getRuntimeSiteUrl().toString()).toBe("https://empregossaoluis.com.br/");
    process.env.SITE_URL = "ftp://empregossaoluis.com.br";
    expect(getRuntimeSiteUrl().toString()).toBe("https://empregossaoluis.com.br/");
  });

  it("ignores stored canonical that points to a different owned path", () => {
    expect(resolveCanonicalUrl("/", "/blog/guia", site)).toBe("https://empregossaoluis.com.br/blog/guia");
    expect(resolveCanonicalUrl("https://empregossaoluis.com.br/", "/vagas/auxiliar", site))
      .toBe("https://empregossaoluis.com.br/vagas/auxiliar");
    expect(resolveCanonicalUrl("https://empregossaoluis.com.br/blog/outro", "/blog/guia", site))
      .toBe("https://empregossaoluis.com.br/blog/guia");
  });

  it("only resolves public HTTP assets", () => {
    expect(resolvePublicHttpUrl("/brand/capa.png", site)).toBe("https://empregossaoluis.com.br/brand/capa.png");
    expect(resolvePublicHttpUrl("javascript:alert(1)", site)).toBeUndefined();
    expect(resolvePublicHttpUrl("http://localhost:4321/brand/capa.png", site)).toBeUndefined();
  });
});
