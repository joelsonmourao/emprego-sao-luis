import type { APIRoute } from "astro";
import { buildSitemapIndex } from "@es/seo";
import { listSitemapManifest } from "../lib/sitemaps";

export const GET: APIRoute = async () => {
  const files = await listSitemapManifest();
  const body = buildSitemapIndex(files.map((file) => (file.lastmod ? { loc: file.loc, lastmod: file.lastmod } : { loc: file.loc })));
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300" } });
};
