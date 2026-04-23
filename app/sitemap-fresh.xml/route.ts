import { buildUrlSetXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const revalidate = 1800;

export async function GET() {
  const manifest = await getSitemapManifest();
  const freshEntries = manifest.files
    .filter((file) => file.category === "fresh")
    .flatMap((file) => file.entries);

  return createXmlResponse(buildUrlSetXml(freshEntries));
}
