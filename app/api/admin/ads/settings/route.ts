import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { adSettingsPatchSchema } from "@/lib/schemas/ad-admin";
import { getAdSettings, upsertAdSettings } from "@/lib/repositories/ad-system";
import { getEditableSiteSettings, patchSiteSettings } from "@/lib/admin/site";

export async function PATCH(request: Request) {
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
  const nextGlobalEnabled =
    parsed.data.globalEnabled ??
    (nextAdMode === "automatico"
      ? false
      : true);
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
}
