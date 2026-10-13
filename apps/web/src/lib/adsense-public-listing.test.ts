import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { guidesPendingReview, newsPendingFactCheck } from "../data/editorial-review-pending";
import { getEditorialContentOverride } from "../data/editorial-content-overrides";
import { getNewsEditorialOverride } from "../data/news-editorial-content-overrides";
import { BRAND_ASSETS, BRAND_COLORS } from "./brand-assets";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("Vitrine pública durante a análise AdSense", () => {
  it("não confunde páginas publicadas com páginas já revisadas", () => {
    const source = read("apps/web/src/lib/articles.ts");
    expect(source).toContain("qualityReviewedOnly = false");
    expect(source).toContain("notInArray(articles.slug, pendingSlugs)");
    expect(source).toContain("getEditorialContentOverride(slug)");
    expect(source).toContain("getNewsEditorialOverride(slug)");
    expect(guidesPendingReview.size).toBe(0);
    expect([...newsPendingFactCheck].every((slug) => Boolean(getNewsEditorialOverride(slug)))).toBe(true);
  });

  it("blog e notícias apresentam totais e páginas consistentes com a seleção revisada", () => {
    const blog = read("apps/web/src/pages/blog/index.astro");
    const news = read("apps/web/src/pages/noticias/index.astro");
    expect(blog).toContain("  true // exibir somente guias");
    expect(news).toContain('listPublishedArticlesPage(page, pageSize, "NEWS", null, true)');
    expect(blog).toContain("automatic = listAutoEditorialArticles(3).filter");
    expect(blog).toContain("article.slug === item.slug");
    expect(blog).toContain("<Pagination");
    expect(news).toContain("<Pagination");
  });

  it("a marca do site permanece vermelha e o Instagram continua oficial", () => {
    expect(BRAND_COLORS.brandPrimary).toBe("#9B2D30");
    expect(BRAND_ASSETS.instagramHandle).toBe("@empregosaoluis");
    expect(BRAND_ASSETS.logoHorizontalWebp).toBe("/brand/logo-horizontal.webp");
  });
});
