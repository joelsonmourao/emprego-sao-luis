import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(p), "utf8");

describe("reforma estrutural do portal — revista editorial", () => {
  it("home usa capa fotográfica e hierarquia realmente diferente, não quatro grades idênticas", () => {
    const html = read("apps/web/src/pages/index.astro");
    const css = read("apps/web/src/styles/global.css");
    expect(html).toContain('class="es-magazine-cover-grid"');
    expect(html).toContain('class="es-magazine-cover-image"');
    expect(html).toContain('class="es-magazine-news-grid"');
    expect(html).toContain('class="es-magazine-news-feature"');
    expect(html).toContain('class="es-magazine-news-list"');
    expect(html).toContain('class="es-magazine-guides-grid"');
    expect(html).toContain('class="es-magazine-toolband"');
    expect(html).toContain('class="es-magazine-topic-grid"');
    expect(html).toContain('class="es-magazine-resource-grid"');
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/guias/emprego-sine-maranhao"');
    expect(html).toContain('href="/redacao"');
    expect(html).not.toContain('<section class="es-editorial-hero es-section"');
    expect(css).toContain(".es-magazine-cover-grid");
    expect(css).toContain(".es-magazine-news-grid");
    expect(css).toContain(".es-magazine-guides-grid");
    expect(css).toContain("@media (max-width: 960px)");
    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("nao destaca guias com baixa qualidade nem notícias pendentes", () => {
    const html = read("apps/web/src/pages/index.astro");
    expect(html).toContain("isEditorialReviewPending");
    expect(html).toContain("getEditorialContentOverride");
    expect(html).toContain("getNewsEditorialOverride");
    expect(html).toContain("verifiedNewsArticles");
    expect(html).toContain("Boolean(getEditorialContentOverride(item.article.slug))");
  });

  it("imagens reais têm texto alternativo e fallback sem criar fotos falsas", () => {
    const html = read("apps/web/src/pages/index.astro");
    expect(html).toContain("coverImageUrl");
    expect(html).toContain("coverImageAlt ??");
    expect(html).toContain('decoding="async"');
    expect(html).toContain("es-magazine-cover-fallback");
    expect(html).not.toContain("images.unsplash.com");
  });

  it("arquivo do blog tem destaque próprio com imagem e mantém paginação e canônico", () => {
    const html = read("apps/web/src/pages/blog/index.astro");
    expect(html).toContain("es-blog-editorial-feature");
    expect(html).toContain("featuredGuide");
    expect(html).toContain("listingGuides");
    expect(html).toContain("<Pagination");
    expect(html).toContain("canonical={canonical}");
    expect(html).toContain("noindex={items.length === 0");
  });
});
