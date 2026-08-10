import { describe, expect, it } from "vitest";
import { getAdsenseReviewDirective, sitemapCategoryAllowedInReview, staticPathAllowedInReview } from "./adsense-review-mode";

describe("AdSense review mode", () => {
  it("mantém home, editoriais e institucionais indexáveis", () => {
    for (const path of ["/", "/blog", "/blog/guia-local", "/noticias/fato-local", "/sobre", "/privacidade", "/politica-editorial"])
      expect(getAdsenseReviewDirective(new URL(path, "https://example.com"), true).noindex).toBe(false);
  });

  it("aplica noindex,follow a vagas, entidades, buscas, filtros e paginação fraca", () => {
    for (const path of ["/vagas", "/vagas/auxiliar", "/empresas/acme", "/categorias/administrativo", "/cidades/sao-luis", "/busca?q=x", "/blog?pagina=2"])
      expect(getAdsenseReviewDirective(new URL(path, "https://example.com"), true).noindex).toBe(true);
  });

  it("não altera indexação quando está desativado e limita o sitemap no modo ativo", () => {
    expect(getAdsenseReviewDirective(new URL("/vagas?q=teste", "https://example.com"), false).noindex).toBe(false);
    expect(sitemapCategoryAllowedInReview("jobs")).toBe(false);
    expect(sitemapCategoryAllowedInReview("blog")).toBe(true);
    expect(sitemapCategoryAllowedInReview("companies")).toBe(true);
    expect(staticPathAllowedInReview("/seguranca-candidatos")).toBe(true);
    expect(staticPathAllowedInReview("/vagas")).toBe(false);
  });

  it("mantém rotas desconhecidas fora do índice e aceita exceção de entidade forte", () => {
    expect(getAdsenseReviewDirective(new URL("/instagram", "https://example.com"), true).noindex).toBe(true);
    expect(getAdsenseReviewDirective(new URL("/empresas/acme", "https://example.com"), true, true).noindex).toBe(false);
    expect(getAdsenseReviewDirective(new URL("/empresas/acme?pagina=2", "https://example.com"), true, true).noindex).toBe(true);
  });
});
