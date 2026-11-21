import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { getAdReportSummary } from "../../../../lib/ads";

export const GET: APIRoute = async ({ locals, request }) => {
  if (!can(locals.auth!, "commercial.manage")) return new Response("Proibido", { status: 403 });
  const days = Number(new URL(request.url).searchParams.get("days") ?? "30");
  const report = await getAdReportSummary(Number.isFinite(days) ? days : 30);
  const lines = [
    "campaign,impressions,clicks,ctr",
    ...report.byCampaign.map((row) => `"${row.name ?? row.campaignId ?? "—"}",${row.impressions},${row.clicks},${row.impressions ? ((row.clicks / row.impressions) * 100).toFixed(2) : "0"}`),
    "",
    "slot,impressions,clicks",
    ...report.bySlot.map((row) => `"${row.slotKey}",${row.impressions},${row.clicks}`)
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=relatorio-publicidade.csv" } });
};
