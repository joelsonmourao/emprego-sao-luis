import { buildEmptyUrlSetXml, buildUrlSetXml, createXmlResponse, findSitemapFile, getSitemapManifest } from "@/lib/sitemaps";
import { sendDebugLog } from "@/lib/perf/debug-log";

export const revalidate = 3600;

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const startedAt = Date.now();
  try {
    const { slug } = await context.params;
    const manifest = await getSitemapManifest();
    const sitemap = findSitemapFile(slug, manifest.files);

    if (!sitemap) {
      return new Response("Sitemap not found", { status: 404 });
    }

    // #region agent log
    sendDebugLog({
      runId: "perf-audit",
      hypothesisId: "H13",
      location: "app/sitemaps/[slug]/route.ts",
      message: "sitemap chunk served",
      data: { slug, elapsedMs: Date.now() - startedAt, urlCount: sitemap.urlCount }
    });
    // #endregion

    return createXmlResponse(buildUrlSetXml(sitemap.entries));
  } catch {
    return createXmlResponse(buildEmptyUrlSetXml());
  }
}
