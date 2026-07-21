import { eq } from "drizzle-orm";
import { z } from "zod";
import { createDatabase, settings } from "@es/db";
import { logServerError } from "./server-error";

const KEY = "site_integrations";

export const siteIntegrationsSchema = z.object({
  consentModeEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  ga4MeasurementId: z.string(),
  gtmContainerId: z.string(),
  searchConsoleVerification: z.string(),
  searchConsolePropertyUrl: z.string(),
  searchConsoleReportsUrl: z.string(),
  bingVerification: z.string(),
  adsenseEnabled: z.boolean(),
  adsensePublisherId: z.string(),
  adsenseAutoAds: z.boolean(),
  adsTxtContent: z.string(),
  metaPixelId: z.string(),
  lookerStudioUrl: z.string(),
  ga4ReportsUrl: z.string()
});

export type SiteIntegrations = z.infer<typeof siteIntegrationsSchema>;

export const defaultSiteIntegrations: SiteIntegrations = {
  consentModeEnabled: true,
  analyticsEnabled: false,
  ga4MeasurementId: "",
  gtmContainerId: "",
  searchConsoleVerification: "",
  searchConsolePropertyUrl: "",
  searchConsoleReportsUrl: "",
  bingVerification: "",
  adsenseEnabled: false,
  adsensePublisherId: "",
  adsenseAutoAds: false,
  adsTxtContent: "",
  metaPixelId: "",
  lookerStudioUrl: "",
  ga4ReportsUrl: ""
};

export function mergeSiteIntegrations(raw: unknown): SiteIntegrations {
  const parsed = siteIntegrationsSchema.partial().safeParse(raw && typeof raw === "object" ? raw : {});
  return { ...defaultSiteIntegrations, ...(parsed.success ? parsed.data : {}) } as SiteIntegrations;
}

/** Aceita ca-pub-… ou pub-… e devolve ca-pub-… */
export function normalizeAdsenseClientId(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^ca-pub-\d+$/i.test(value)) return value.toLowerCase();
  if (/^pub-\d+$/i.test(value)) return `ca-${value.toLowerCase()}`;
  return value;
}

export function normalizePubIdForAdsTxt(clientId: string): string {
  const normalized = normalizeAdsenseClientId(clientId);
  return normalized.replace(/^ca-/i, "");
}

export function normalizeSearchConsoleToken(raw: string): string {
  return raw
    .trim()
    .replace(/^google-site-verification=/i, "")
    .replace(/^content=/i, "")
    .replace(/^["']|["']$/g, "");
}

export async function getSiteIntegrations(): Promise<SiteIntegrations & { persisted: boolean }> {
  if (!process.env.DATABASE_URL) return { ...defaultSiteIntegrations, persisted: false };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, KEY));
    const merged = mergeSiteIntegrations(row?.value);
    const hasOwnRow = Boolean(row);

    // Reaproveita tokens SEO e publisher AdSense já salvos em outras telas.
    const [seoRow] = await connection.db.select().from(settings).where(eq(settings.key, "seo_settings"));
    const [adsRow] = await connection.db.select().from(settings).where(eq(settings.key, "ad_settings"));
    const seoValue = seoRow?.value && typeof seoRow.value === "object" ? (seoRow.value as Record<string, unknown>) : {};
    const adsValue = adsRow?.value && typeof adsRow.value === "object" ? (adsRow.value as Record<string, unknown>) : {};
    const verifications =
      seoValue.verifications && typeof seoValue.verifications === "object"
        ? (seoValue.verifications as Record<string, unknown>)
        : {};

    return {
      ...merged,
      searchConsoleVerification:
        merged.searchConsoleVerification.trim() ||
        normalizeSearchConsoleToken(String(verifications.google ?? "")),
      bingVerification: merged.bingVerification.trim() || String(verifications.bing ?? "").trim(),
      adsensePublisherId:
        normalizeAdsenseClientId(merged.adsensePublisherId) ||
        normalizeAdsenseClientId(String(adsValue.adsenseClientId ?? "")),
      adsenseEnabled: hasOwnRow ? merged.adsenseEnabled : Boolean(adsValue.adsenseEnabled),
      persisted: hasOwnRow
    };
  } catch (error) {
    logServerError("site-integrations:load", error);
    return { ...defaultSiteIntegrations, persisted: false };
  } finally {
    await connection.close();
  }
}

export async function saveSiteIntegrations(value: SiteIntegrations) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db
      .insert(settings)
      .values({ key: KEY, value, public: true })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
  } finally {
    await connection.close();
  }
}
