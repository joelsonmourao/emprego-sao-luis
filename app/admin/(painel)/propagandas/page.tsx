import { requireRole } from "@/lib/authz";
import { buildAdComplianceReport } from "@/lib/ads/compliance";
import { AdsManagerClient } from "@/components/admin/ads-manager-client";
import { getAdSettings, listAdSlots } from "@/lib/repositories/ad-system";

export default async function AdminPropagandasPage() {
  await requireRole("ADMIN");

  const [settings, slots] = await Promise.all([getAdSettings(), listAdSlots()]);
  const compliance = buildAdComplianceReport(slots);

  return (
    <AdsManagerClient
      initialGlobalEnabled={settings.globalEnabled}
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
