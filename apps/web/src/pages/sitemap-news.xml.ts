import type { APIRoute } from "astro";
import { escapeXml } from "@es/seo";
import { getAdsenseReviewMode } from "../lib/adsense-review-mode";
import { listPublishedArticles } from "../lib/articles";
import { getEditorialAuditReport } from "../lib/editorial-audit";
import { getRuntimeSiteUrl } from "../lib/canonical-url";

export const GET: APIRoute = async ({ site }) => {
  const [items, reviewMode] = await Promise.all([
    listPublishedArticles(1000, new Date(Date.now() - 2 * 86_400_000), "NEWS"),
    getAdsenseReviewMode()
  ]);
  const noindexIds = reviewMode.enabled
    ? new Set((await getEditorialAuditReport()).assessments.filter((item) => ["NOINDEX", "REVISAR MANUALMENTE"].includes(item.classification)).map((item) => item.article.id))
    : new Set<string>();
  const visible = items.filter(({ article }) => article.newsEligible && article.publishedAt && !noindexIds.has(article.id));
  const baseUrl = getRuntimeSiteUrl(site);
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${visible.map(({ article }) => `<url><loc>${escapeXml(new URL(`/noticias/${article.slug}`, baseUrl).toString())}</loc><news:news><news:publication><news:name>Empregos São Luís</news:name><news:language>pt</news:language></news:publication><news:publication_date>${article.publishedAt?.toISOString()}</news:publication_date><news:title>${escapeXml(article.title)}</news:title></news:news></url>`).join("")}</urlset>`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
