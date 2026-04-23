import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { buildAdComplianceReport } from "@/lib/ads/compliance";
import { getAdSettings, listAdSlots } from "@/lib/repositories/ad-system";
import { getSiteSettings } from "@/lib/site-settings";

export async function GET() {
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
}
