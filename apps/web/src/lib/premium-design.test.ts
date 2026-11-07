import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("identidade premium editorial do Empregos São Luís", () => {
  it("troca o Instagram por painel editorial sem fundo preto e logo gigante", () => {
    const ig = read("apps/web/src/components/InstagramFollow.astro");
    const css = read("apps/web/src/styles/global.css");
    expect(ig).toContain("es-instagram-feature");
    expect(ig).toContain("es-instagram-profile-card");
    expect(ig).toContain("es-instagram-benefits");
    expect(ig).toContain('href={profileUrl}');
    expect(ig).toContain("BRAND_ASSETS.instagramHandle");
    expect(ig).not.toContain("bg-[var(--brand-secondary)]");
    expect(ig).not.toContain("h-48 lg:w-48");
    expect(css).toContain(".es-instagram-feature");
    expect(css).toContain("@media (max-width: 860px)");
    expect(css).toContain("@media (max-width: 639px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("padroniza header, footer, notícias, blog, cards e formulários sem alterar funções", () => {
    const css = read("apps/web/src/styles/global.css");
    const header = read("apps/web/src/components/SiteHeader.astro");
    const footer = read("apps/web/src/components/SiteFooter.astro");
    const news = read("apps/web/src/pages/noticias/index.astro");
    const blog = read("apps/web/src/pages/blog/index.astro");
    const jobs = read("apps/web/src/components/ui/JobCard.astro");
    const layout = read("apps/web/src/layouts/BaseLayout.astro");
    for (const klass of [".es-card", ".es-btn", ".es-site-header",
      ".es-premium-footer", ".es-premium-article-card", ".es-premium-job-card",
      "main article .es-prose", ".hero-search-panel"]) {
      expect(css).toContain(klass);
    }
    expect(header).toContain("es-site-header");
    expect(footer).toContain("es-premium-footer");
    expect(news).toContain("es-premium-article-card");
    expect(blog).toContain("es-premium-article-card");
    expect(jobs).toContain("es-premium-job-card");
    expect(layout).toContain("<CookieConsent");
    expect(layout).toContain("adsEnabled");
    expect(footer).toContain('href="/privacidade"');
    expect(footer).toContain('href="/politica-editorial"');
  });

  it("preserva CTA e rastreamento oficiais sem misturar SLZ Empregos com o site", () => {
    const component = read("apps/web/src/components/InstagramFollow.astro");
    expect(component).not.toContain("@slz_empregos");
    expect(component).toContain('data-track={trackEvent}');
    expect(component).toContain("navigator.sendBeacon");
    expect(component).toContain('rel="noopener noreferrer"');
    expect(component).toContain('href="/instagram"');
  });
});
