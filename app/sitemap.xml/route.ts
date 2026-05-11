import { buildEmptySitemapIndexXml, buildSitemapIndexXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const dynamic = "force-dynamic";

const FALLBACK_SITEMAP_INDEX_XML = buildEmptySitemapIndexXml();

export async function GET() {
  try {
    const manifest = await getSitemapManifest();
    return createXmlResponse(buildSitemapIndexXml(manifest.files));
  } catch {
    return createXmlResponse(FALLBACK_SITEMAP_INDEX_XML);
  }
}
