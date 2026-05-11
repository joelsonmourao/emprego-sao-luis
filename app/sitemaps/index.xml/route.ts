import { buildEmptySitemapIndexXml, buildSitemapIndexXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const manifest = await getSitemapManifest();
    return createXmlResponse(buildSitemapIndexXml(manifest.files));
  } catch {
    return createXmlResponse(buildEmptySitemapIndexXml());
  }
}
