import type { APIRoute } from "astro";
import { buildUrlSet, chunkEntries, SITEMAP_CHUNK_SIZE } from "@es/seo";
import { listSitemapEntries } from "../../lib/sitemaps";

const categories = ["static", "jobs", "companies", "cities", "categories", "blog"] as const;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug ?? "";
  const match = /^(static|jobs|companies|cities|categories|blog)(?:-(\d+))?\.xml$/.exec(slug);
  if (!match) return new Response("Sitemap não encontrado", { status: 404 });
  const category = match[1] as (typeof categories)[number];
  const page = match[2] ? Number(match[2]) : 1;
  if (!categories.includes(category) || !Number.isFinite(page) || page < 1) return new Response("Sitemap inválido", { status: 400 });
  const entries = await listSitemapEntries(category);
  const chunks = chunkEntries(entries, SITEMAP_CHUNK_SIZE);
  const chunk = chunks[page - 1];
  if (!chunk) return new Response("Página de sitemap inexistente", { status: 404 });
  return new Response(buildUrlSet(chunk), { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300" } });
};
