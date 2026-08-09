import { createDatabase, indexingEvents } from "@es/db";
import { count, eq, sql } from "drizzle-orm";
import { indexingIntegrationStatus } from "./indexing";
import { diagnoseStorage } from "@es/storage";
import { getSiteIntegrations, normalizeAdsenseClientId } from "./site-integrations";

export type IntegrationState = "healthy" | "degraded" | "not_configured" | "unavailable" | "unknown";

function stateFrom(checks: { configured?: boolean; enabled?: boolean; ok?: boolean }): IntegrationState {
  if (checks.ok === false) return "unavailable";
  if (!checks.configured) return "not_configured";
  if (checks.enabled === false) return "degraded";
  return "healthy";
}

export async function getOperationalHealth() {
  const checks: Record<string, IntegrationState> = { web: "healthy", worker: "unknown" };
  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      await connection.db.execute(sql`select 1`);
      checks.postgresql = "healthy";
      const [pending] = await connection.db.select({ value: count() }).from(indexingEvents).where(eq(indexingEvents.status, "PENDING"));
      checks.indexing = (pending?.value ?? 0) > 100 ? "degraded" : "healthy";
    } catch {
      checks.postgresql = "unavailable";
    } finally {
      await connection.close();
    }
  } else {
    checks.postgresql = "not_configured";
  }

  try {
    const { createImportQueue } = await import("./queue");
    const queue = createImportQueue();
    try {
      await queue.getJobCounts("waiting");
      checks.redis = "healthy";
    } finally {
      await queue.close();
    }
  } catch {
    checks.redis = "unavailable";
  }

  const indexing = indexingIntegrationStatus();
  checks.google = stateFrom({ configured: indexing.google.configured, enabled: indexing.google.enabled });
  checks.indexNow = stateFrom({ configured: indexing.indexNow.configured, enabled: true });
  checks.meta = stateFrom({ configured: indexing.meta.configured, enabled: true });
  checks.resend = stateFrom({ configured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM), enabled: true });
  const storage = await diagnoseStorage();
  checks.storage = storage.exists && storage.read && storage.write && storage.delete ? "healthy" : "unavailable";
  checks.sentry = stateFrom({ configured: Boolean(process.env.SENTRY_DSN), enabled: true });
  const siteIntegrations = await getSiteIntegrations();
  const adsenseClientId = normalizeAdsenseClientId(siteIntegrations.adsensePublisherId) ||
    normalizeAdsenseClientId(String(process.env.PUBLIC_ADSENSE_CLIENT_ID ?? ""));
  const adsenseEnabled = siteIntegrations.persisted
    ? siteIntegrations.adsenseEnabled
    : siteIntegrations.adsenseEnabled || process.env.PUBLIC_ADSENSE_ENABLED === "true";
  checks.adsense = stateFrom({ configured: Boolean(adsenseClientId), enabled: adsenseEnabled });

  return checks;
}
