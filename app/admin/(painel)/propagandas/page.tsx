import { requireRole } from "@/lib/authz";
import { buildAdComplianceReport } from "@/lib/ads/compliance";
import { AdsManagerClient } from "@/components/admin/ads-manager-client";
import { getAdSettings, listAdSlots } from "@/lib/repositories/ad-system";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminPropagandasPage() {
  await requireRole("ADMIN");

  const [settings, slots, siteSettings] = await Promise.all([getAdSettings(), listAdSlots(), getSiteSettings()]);
  const compliance = buildAdComplianceReport(slots);
  const autoAdsEnabled = siteSettings.google.adsenseAutoAds;
  const adMode = autoAdsEnabled ? (settings.globalEnabled ? "hibrido" : "automatico") : "manual";

  return (
    <AdsManagerClient
      initialGlobalEnabled={settings.globalEnabled}
      initialAutoAdsEnabled={autoAdsEnabled}
      initialAdMode={adMode}
      initialSlots={slots}
      initialCompliance={{
        score: compliance.score,
        activeSlotCount: compliance.activeSlotCount,
        issues: compliance.issues,
        suggestions: compliance.suggestions,
        byPageKey: compliance.byPageKey
      }}
    />
  );
}
