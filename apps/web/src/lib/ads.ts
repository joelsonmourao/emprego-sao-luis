import { createHash } from "node:crypto";
import { and, count, desc, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { adCreatives, adEvents, adSlots, campaigns, createDatabase, settings } from "@es/db";
import { assertSlotNotNearCandidature, CANDIDATURE_BLOCKED_SLOT_KEYS, DEFAULT_AD_SLOTS, mergeAdSettings, type AdSettings, type AdTargeting } from "@es/ads";

const SETTINGS_KEY = "ad_settings";

export async function getAdSettings(): Promise<AdSettings> {
  if (!process.env.DATABASE_URL) return mergeAdSettings(null);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, SETTINGS_KEY));
    return mergeAdSettings(row?.value);
  } finally {
    await connection.close();
  }
}

export async function saveAdSettings(value: AdSettings) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(settings).values({ key: SETTINGS_KEY, value, public: false }).onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
  } finally {
    await connection.close();
  }
}

export async function ensureDefaultAdSlots() {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    for (const slot of DEFAULT_AD_SLOTS) {
      await connection.db.insert(adSlots).values({ ...slot, active: false }).onConflictDoNothing({ target: adSlots.key });
    }
  } finally {
    await connection.close();
  }
}

export interface AdContext extends AdTargeting {
  path: string;
  pageType: string;
  device?: string;
  entityType?: string;
  entityId?: string;
}

export async function resolveAdForSlot(slotKey: string, context: AdContext) {
  if (CANDIDATURE_BLOCKED_SLOT_KEYS.has(slotKey)) return null;
  assertSlotNotNearCandidature(slotKey, context.pageType);
  const settings = await getAdSettings();
  if (!settings.globalEnabled || settings.blockedSlotKeys.includes(slotKey)) return null;
  if (settings.blockedPageTypes.includes(context.pageType)) return null;
  if (!settings.allowedPageTypes.includes(context.pageType) && context.pageType !== "global") return null;
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    const [slot] = await connection.db.select().from(adSlots).where(and(eq(adSlots.key, slotKey), eq(adSlots.active, true))).limit(1);
    if (!slot) return null;
    if (slot.device !== "all" && context.device && slot.device !== context.device) return null;
    const rows = await connection.db
      .select({ creative: adCreatives, campaign: campaigns, slot: adSlots })
      .from(adCreatives)
      .innerJoin(campaigns, eq(adCreatives.campaignId, campaigns.id))
      .innerJoin(adSlots, eq(adCreatives.slotId, adSlots.id))
      .where(and(eq(adCreatives.slotId, slot.id), eq(adCreatives.active, true), eq(adCreatives.status, "ACTIVE"), eq(campaigns.status, "ACTIVE"), or(isNull(campaigns.startsAt), lte(campaigns.startsAt, now)), or(isNull(campaigns.endsAt), gte(campaigns.endsAt, now))))
      .orderBy(desc(adCreatives.priority), desc(campaigns.priority));
    for (const row of rows) {
      const targeting = (row.campaign.targeting ?? {}) as AdTargeting;
      if (!matchesTargeting(targeting, context)) continue;
      if (row.campaign.impressionLimit) {
        const [impressions] = await connection.db.select({ value: count() }).from(adEvents).where(and(eq(adEvents.campaignId, row.campaign.id), eq(adEvents.event, "IMPRESSION")));
        if ((impressions?.value ?? 0) >= row.campaign.impressionLimit) continue;
      }
      return { type: "direct" as const, creative: row.creative, campaign: row.campaign, slot: row.slot, disclosure: row.campaign.disclosure };
    }
    if (slot.allowAdsense && settings.adsenseEnabled && settings.adsenseClientId && slot.adsenseSlotId) {
      return { type: "adsense" as const, slot, clientId: settings.adsenseClientId };
    }
    return null;
  } finally {
    await connection.close();
  }
}

function matchesTargeting(targeting: AdTargeting, context: AdTargeting) {
  if (targeting.citySlug && targeting.citySlug !== context.citySlug) return false;
  if (targeting.categorySlug && targeting.categorySlug !== context.categorySlug) return false;
  if (targeting.companySlug && targeting.companySlug !== context.companySlug) return false;
  if (targeting.workplaceType && targeting.workplaceType !== context.workplaceType) return false;
  if (targeting.device && targeting.device !== "all" && context.device && targeting.device !== context.device) return false;
  return true;
}

export async function recordAdEvent(input: {
  slotKey: string;
  event: "IMPRESSION" | "CLICK";
  path: string;
  creativeId?: string;
  campaignId?: string;
  visitorHash?: string;
  context?: Partial<AdContext>;
}) {
  if (CANDIDATURE_BLOCKED_SLOT_KEYS.has(input.slotKey)) return;
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(adEvents).values({
      slotKey: input.slotKey,
      event: input.event,
      path: input.path,
      creativeId: input.creativeId,
      ...(input.campaignId ? { campaignId: input.campaignId } : {}),
      visitorHash: input.visitorHash,
      ...(input.context?.device ? { device: input.context.device } : {}),
      ...(input.context?.citySlug ? { citySlug: input.context.citySlug } : {}),
      ...(input.context?.categorySlug ? { categorySlug: input.context.categorySlug } : {}),
      ...(input.context?.entityType ? { entityType: input.context.entityType } : {}),
      ...(input.context?.entityId ? { entityId: input.context.entityId } : {})
    });
  } finally {
    await connection.close();
  }
}

export async function getAdReportSummary(days = 30) {
  if (!process.env.DATABASE_URL) return { impressions: 0, clicks: 0, ctr: 0, byCampaign: [], bySlot: [] };
  const connection = createDatabase(process.env.DATABASE_URL);
  const since = new Date(Date.now() - days * 86400000);
  try {
    const [impressions] = await connection.db.select({ value: count() }).from(adEvents).where(and(eq(adEvents.event, "IMPRESSION"), gte(adEvents.createdAt, since)));
    const [clicks] = await connection.db.select({ value: count() }).from(adEvents).where(and(eq(adEvents.event, "CLICK"), gte(adEvents.createdAt, since)));
    const byCampaign = await connection.db
      .select({ campaignId: adEvents.campaignId, name: campaigns.name, impressions: sql<number>`count(*) filter (where ${adEvents.event} = 'IMPRESSION')::int`, clicks: sql<number>`count(*) filter (where ${adEvents.event} = 'CLICK')::int` })
      .from(adEvents)
      .leftJoin(campaigns, eq(adEvents.campaignId, campaigns.id))
      .where(gte(adEvents.createdAt, since))
      .groupBy(adEvents.campaignId, campaigns.name)
      .orderBy(desc(sql`count(*)`));
    const bySlot = await connection.db
      .select({ slotKey: adEvents.slotKey, impressions: sql<number>`count(*) filter (where ${adEvents.event} = 'IMPRESSION')::int`, clicks: sql<number>`count(*) filter (where ${adEvents.event} = 'CLICK')::int` })
      .from(adEvents)
      .where(gte(adEvents.createdAt, since))
      .groupBy(adEvents.slotKey)
      .orderBy(desc(sql`count(*)`));
    const imp = impressions?.value ?? 0;
    const clk = clicks?.value ?? 0;
    return { impressions: imp, clicks: clk, ctr: imp ? Number(((clk / imp) * 100).toFixed(2)) : 0, byCampaign, bySlot };
  } finally {
    await connection.close();
  }
}

export function visitorHash(ip: string, userAgent: string) {
  return createHash("sha256").update(`${ip}:${userAgent}`).digest("hex").slice(0, 16);
}
