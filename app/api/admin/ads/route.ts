import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { buildAdComplianceReport } from "@/lib/ads/compliance";
import { getAdSettings, listAdSlots } from "@/lib/repositories/ad-system";

export async function GET() {
  await requireApiRole("ADMIN");

  const [settings, slots] = await Promise.all([getAdSettings(), listAdSlots()]);
  const compliance = buildAdComplianceReport(slots);

  return NextResponse.json({
    settings: { globalEnabled: settings.globalEnabled, updatedAt: settings.updatedAt.toISOString() },
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
