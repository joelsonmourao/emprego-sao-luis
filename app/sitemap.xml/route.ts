import { buildEmptySitemapIndexXml, buildSitemapIndexXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";
import { sendDebugLog } from "@/lib/perf/debug-log";

export const revalidate = 3600;

export async function GET() {
  const startedAt = Date.now();
  try {
    const manifest = await getSitemapManifest();
    // #region agent log
    sendDebugLog({
      runId: "perf-audit",
      hypothesisId: "H13",
      location: "app/sitemap.xml/route.ts",
      message: "sitemap index generated",
      data: { elapsedMs: Date.now() - startedAt, files: manifest.files.length }
    });
    // #endregion
    return createXmlResponse(buildSitemapIndexXml(manifest.files));
  } catch {
    return createXmlResponse(buildEmptySitemapIndexXml());
  }
}
