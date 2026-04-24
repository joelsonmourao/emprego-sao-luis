import { buildEmptyUrlSetXml, buildUrlSetXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const manifest = await getSitemapManifest();
    const freshEntries = manifest.files
      .filter((file) => file.category === "fresh")
      .flatMap((file) => file.entries);

    return createXmlResponse(buildUrlSetXml(freshEntries));
  } catch {
    return createXmlResponse(buildEmptyUrlSetXml());
  }
}
