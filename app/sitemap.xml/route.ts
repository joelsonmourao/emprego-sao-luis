import { buildEmptySitemapIndexXml, buildSitemapIndexXml, createXmlResponse, getSitemapManifest } from "@/lib/sitemaps";
import { sendDebugLog } from "@/lib/perf/debug-log";

export const revalidate = 3600;

export async function GET() {
  const startedAt = Date.now();
  try {
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "sitemap-debug-1",
        hypothesisId: "H2",
        location: "app/sitemap.xml/route.ts:GET:try-enter",
        message: "sitemap route start",
        data: { nodeEnv: process.env.NODE_ENV ?? "unknown" },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
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
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "sitemap-debug-1",
        hypothesisId: "H2",
        location: "app/sitemap.xml/route.ts:GET:catch",
        message: "sitemap route failed, trying empty fallback",
        data: {
          errorName: error instanceof Error ? error.name : "unknown",
          errorMessage: error instanceof Error ? error.message : String(error)
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    const emptyXml = buildEmptySitemapIndexXml();
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "sitemap-debug-1",
        hypothesisId: "H3",
        location: "app/sitemap.xml/route.ts:GET:catch-after-fallback",
        message: "empty sitemap fallback generated",
        data: { xmlLength: emptyXml.length },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return createXmlResponse(emptyXml);
  }
}
