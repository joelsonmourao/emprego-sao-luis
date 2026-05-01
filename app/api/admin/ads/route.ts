import { NextResponse } from "next/server";

import { buildAdComplianceReport } from "@/lib/ads/compliance";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "ads-route-debug-1",
        hypothesisId: "H1",
        location: "app/api/admin/ads/route.ts:GET:entry",
        message: "admin ads route invoked",
        data: { nodeEnv: process.env.NODE_ENV ?? "unknown" },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    const [{ requireApiRole }, { getAdSettings, listAdSlots }, { getSiteSettings }] = await Promise.all([
      import("@/lib/authz"),
      import("@/lib/repositories/ad-system"),
      import("@/lib/site-settings")
    ]);

    await requireApiRole("ADMIN");

    const [settings, slots, siteSettings] = await Promise.all([getAdSettings(), listAdSlots(), getSiteSettings()]);
    const compliance = buildAdComplianceReport(slots);
    const autoAdsEnabled = siteSettings.google.adsenseAutoAds;
    const adMode = autoAdsEnabled ? (settings.globalEnabled ? "hibrido" : "automatico") : "manual";

    return NextResponse.json({
      settings: {
        globalEnabled: settings.globalEnabled,
        autoAdsEnabled,
        adMode,
        updatedAt: settings.updatedAt.toISOString()
      },
      slots,
      compliance: {
        score: compliance.score,
        activeSlotCount: compliance.activeSlotCount,
        issues: compliance.issues,
        suggestions: compliance.suggestions,
        byPageKey: compliance.byPageKey
      }
    });
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "ads-route-debug-1",
        hypothesisId: "H2",
        location: "app/api/admin/ads/route.ts:GET:catch",
        message: "admin ads route failed",
        data: { errorName: error instanceof Error ? error.name : "unknown", errorMessage: error instanceof Error ? error.message : String(error) },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    const message = error instanceof Error ? error.message : "Falha ao carregar configuracoes de anuncios.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
