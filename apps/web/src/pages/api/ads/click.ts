import type { APIRoute } from "astro";
import { adCreatives, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { recordAdEvent, visitorHash } from "../../../lib/ads";

export const GET: APIRoute = async ({ url, clientAddress, request, redirect }) => {
  const creativeId = url.searchParams.get("creative");
  const slotKey = url.searchParams.get("slot") ?? "unknown";
  const path = url.searchParams.get("path") ?? "/";
  if (!creativeId || !process.env.DATABASE_URL) return redirect("/", 302);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [creative] = await connection.db.select().from(adCreatives).where(eq(adCreatives.id, creativeId)).limit(1);
    if (!creative) return redirect("/", 302);
    await recordAdEvent({ slotKey, event: "CLICK", path, creativeId, campaignId: creative.campaignId, visitorHash: visitorHash(clientAddress || "unknown", request.headers.get("user-agent") ?? "unknown") });
    return redirect(creative.destinationUrl, 302);
  } finally {
    await connection.close();
  }
};
