import type { APIRoute } from "astro";
import { adCreatives, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { recordAdEvent, visitorHash } from "../../../lib/ads";

export const GET: APIRoute = async ({ url, clientAddress, request }) => {
  const creativeId = url.searchParams.get("creative");
  const slotKey = url.searchParams.get("slot") ?? "unknown";
  const path = url.searchParams.get("path") ?? "/";
  if (!creativeId || !process.env.DATABASE_URL) return new Response(null, { status: 204 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [creative] = await connection.db.select({ campaignId: adCreatives.campaignId }).from(adCreatives).where(eq(adCreatives.id, creativeId)).limit(1);
    const payload: Parameters<typeof recordAdEvent>[0] = { slotKey, event: "IMPRESSION", path, creativeId, visitorHash: visitorHash(clientAddress || "unknown", request.headers.get("user-agent") ?? "unknown") };
    if (creative?.campaignId) payload.campaignId = creative.campaignId;
    await recordAdEvent(payload);
  } finally {
    await connection.close();
  }
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
};
