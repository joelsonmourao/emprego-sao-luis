import { NextResponse } from "next/server";

import { adSettingsPatchSchema } from "@/lib/schemas/ad-admin";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function PATCH(request: Request) {
  try {
    const [{ requireApiRole }, { getAdSettings, upsertAdSettings }, { getEditableSiteSettings, patchSiteSettings }] =
      await Promise.all([import("@/lib/authz"), import("@/lib/repositories/ad-system"), import("@/lib/admin/site")]);

    await requireApiRole("ADMIN");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "JSON invalido." }, { status: 400 });
    }

    const parsed = adSettingsPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Payload invalido." }, { status: 400 });
    }

    const [currentSiteSettings, currentAdSettings] = await Promise.all([getEditableSiteSettings(), getAdSettings()]);
    const currentAdMode = currentSiteSettings.google.adsenseAutoAds
      ? currentAdSettings.globalEnabled === false
        ? "automatico"
        : "hibrido"
      : "manual";
    const nextAdMode = parsed.data.adMode ?? currentAdMode;
    const nextGlobalEnabled = parsed.data.globalEnabled ?? (nextAdMode === "automatico" ? false : true);
    const nextAutoAdsEnabled = nextAdMode !== "manual";

    const row = await upsertAdSettings(nextGlobalEnabled);
    await patchSiteSettings({
      google: {
        adsenseAutoAds: nextAutoAdsEnabled
      }
    });

    return NextResponse.json({
      ok: true,
      settings: {
        globalEnabled: row.globalEnabled,
        adMode: nextAdMode,
        autoAdsEnabled: nextAutoAdsEnabled,
        updatedAt: row.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Erro na rota PATCH /api/admin/ads/settings:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Erro interno ao atualizar configuracoes de anuncios."
      },
      { status: 500 }
    );
  }
}
