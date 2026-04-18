import { buildUrlSetXml, createXmlResponse, findSitemapFile, getSitemapManifest } from "@/lib/sitemaps";

export const revalidate = 3600;

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const manifest = await getSitemapManifest();
  const sitemap = findSitemapFile(slug, manifest.files);

  if (!sitemap) {
    return new Response("Sitemap not found", { status: 404 });
  }

  return createXmlResponse(buildUrlSetXml(sitemap.entries));
}
