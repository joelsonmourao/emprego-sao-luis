import type { APIRoute } from "astro";
import { escapeXml } from "@es/seo";
import { articlePublicPath, listPublishedArticles } from "../lib/articles";

export const GET: APIRoute = async ({ site }) => {
  const items = await listPublishedArticles(50);
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Empregos São Luís</title><link>${site}</link><description>Notícias, guias e oportunidades no Maranhão.</description><language>pt-BR</language>${items
    .map(({ article }) => {
      const publicUrl = new URL(articlePublicPath(article.type, article.slug), site).toString();
      return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(publicUrl)}</link><guid>${escapeXml(publicUrl)}</guid><pubDate>${article.publishedAt?.toUTCString()}</pubDate><description>${escapeXml(article.excerpt)}</description></item>`;
    })
    .join("")}</channel></rss>`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
};
