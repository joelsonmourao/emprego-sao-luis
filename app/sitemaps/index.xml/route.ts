import { buildEmptySitemapIndexXml, buildSitemapIndexXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const revalidate = 3600;

export async function GET() {
  try {
    const manifest = await getSitemapManifest();
    return createXmlResponse(buildSitemapIndexXml(manifest.files));
  } catch {
    return createXmlResponse(buildEmptySitemapIndexXml());
  }
}
