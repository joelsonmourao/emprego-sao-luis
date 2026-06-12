import { buildEmptyUrlSetXml, buildUrlSetXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";

export const dynamic = "force-dynamic";

const FRESH_CATEGORIES = new Set(["jobs", "blog"]);

export async function GET() {
  try {
    const manifest = await getSitemapManifest();
    const freshEntries = manifest.files
      .filter((file) => FRESH_CATEGORIES.has(file.category))
      .flatMap((file) => file.entries);

    return createXmlResponse(buildUrlSetXml(freshEntries));
  } catch {
    return createXmlResponse(buildEmptyUrlSetXml());
  }
}
