import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";


import { prisma } from "@/lib/db";
import { parseReferrerHost, parseRequestContext } from "@/lib/analytics/server";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const analyticsEventSchema = z.object({
  eventName: z.string().min(1).max(80),
  path: z.string().min(1).max(2048),
  title: z.string().max(240).optional(),
  referrer: z.string().max(2048).optional(),
  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  campaign: z.string().max(160).optional(),
  entityType: z.string().max(80).optional(),
  entityId: z.string().max(120).optional(),
  entitySlug: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export async function POST(request: Request) {
  try {
    if (process.env.INTERNAL_ANALYTICS_DB_ENABLED !== "true") {
      return NextResponse.json(
        { ok: true, skipped: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const payload = analyticsEventSchema.parse(await request.json());

    if (payload.path.startsWith("/admin")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    if (/bot|crawl|spider|slurp|bingpreview/i.test(userAgent)) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    const requestContext = parseRequestContext(userAgent);
    const referrer = payload.referrer || request.headers.get("referer") || "";
    const referrerHost = parseReferrerHost(referrer);

    await prisma.analyticsEvent.create({
      data: {
        eventName: payload.eventName,
        path: payload.path,
        title: payload.title || null,
        referrer: referrer || null,
        referrerHost: referrerHost || null,
        source: payload.source || (referrerHost ? referrerHost : "direct"),
        medium: payload.medium || (referrerHost ? "referral" : "none"),
        campaign: payload.campaign || null,
        deviceType: requestContext.deviceType,
        browser: requestContext.browser,
        os: requestContext.os,
        entityType: payload.entityType || null,
        entityId: payload.entityId || null,
        entitySlug: payload.entitySlug || null,
        metadata: payload.metadata ? (payload.metadata as Prisma.InputJsonValue) : undefined
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel registrar o evento.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
