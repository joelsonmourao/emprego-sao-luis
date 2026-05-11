import { buildEmptyUrlSetXml, buildUrlSetXml, createXmlResponse, findSitemapFile, getSitemapManifest } from "@/lib/sitemaps";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const manifest = await getSitemapManifest();
    const sitemap = findSitemapFile(slug, manifest.files);

    if (!sitemap) {
      return new Response("Sitemap not found", { status: 404 });
    }

    return createXmlResponse(buildUrlSetXml(sitemap.entries));
  } catch {
    return createXmlResponse(buildEmptyUrlSetXml());
  }
}
