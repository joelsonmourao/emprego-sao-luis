import { buildSitemapIndexXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const revalidate = 3600;

export async function GET() {
  const manifest = await getSitemapManifest();
  return createXmlResponse(buildSitemapIndexXml(manifest.files));
}
