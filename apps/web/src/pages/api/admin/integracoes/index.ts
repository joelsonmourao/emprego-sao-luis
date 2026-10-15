import type { APIRoute } from "astro";
import { auditLogs, createDatabase } from "@es/db";
import { can } from "../../../../lib/auth";
import {
  getSiteIntegrations,
  mergeSiteIntegrations,
  normalizeAdsenseClientId,
  normalizeSearchConsoleToken,
  saveSiteIntegrations,
  siteIntegrationsSchema
} from "../../../../lib/site-integrations";
import { getAdSettings, saveAdSettings } from "../../../../lib/ads";
import { getSeoSettings, saveSeoSettings } from "../../../../lib/seo-settings";

function bool(form: FormData, name: string) {
  return form.get(name) === "on" || form.get(name) === "true" || form.get(name) === "1";
}

export const GET: APIRoute = async ({ locals }) => {
  if (!can(locals.auth!, "seo.manage") && !can(locals.auth!, "settings.manage")) {
    return new Response("Proibido", { status: 403 });
  }
  return Response.json(await getSiteIntegrations());
};

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "seo.manage") && !can(auth, "settings.manage")) {
    return new Response("Proibido", { status: 403 });
  }
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });

  const form = await request.formData();
  const before = await getSiteIntegrations();
  const next = mergeSiteIntegrations({
    consentModeEnabled: bool(form, "consentModeEnabled"),
    analyticsEnabled: bool(form, "analyticsEnabled"),
    ga4MeasurementId: String(form.get("ga4MeasurementId") ?? "").trim(),
    gtmContainerId: String(form.get("gtmContainerId") ?? "").trim().toUpperCase(),
    searchConsoleVerification: normalizeSearchConsoleToken(String(form.get("searchConsoleVerification") ?? "")),
    searchConsolePropertyUrl: String(form.get("searchConsolePropertyUrl") ?? "").trim(),
    searchConsoleReportsUrl: String(form.get("searchConsoleReportsUrl") ?? "").trim(),
    bingVerification: String(form.get("bingVerification") ?? "").trim(),
    adsenseEnabled: bool(form, "adsenseEnabled"),
    adsensePublisherId: normalizeAdsenseClientId(String(form.get("adsensePublisherId") ?? "")),
    adsenseAutoAds: bool(form, "adsenseAutoAds"),
    adsTxtContent: String(form.get("adsTxtContent") ?? "").trim(),
    metaPixelId: String(form.get("metaPixelId") ?? "").trim(),
    lookerStudioUrl: String(form.get("lookerStudioUrl") ?? "").trim(),
    ga4ReportsUrl: String(form.get("ga4ReportsUrl") ?? "").trim()
  });

  const parsed = siteIntegrationsSchema.safeParse(next);
  if (!parsed.success) return new Response("Dados inválidos", { status: 400 });

  await saveSiteIntegrations(parsed.data);

  // Mantém SEO geral e publicidade alinhados com esta tela.
  const seo = await getSeoSettings();
  await saveSeoSettings({
    ...seo,
    verifications: {
      google: parsed.data.searchConsoleVerification,
      bing: parsed.data.bingVerification
    }
  });

  const ads = await getAdSettings();
  await saveAdSettings({
    ...ads,
    adsenseEnabled: parsed.data.adsenseEnabled,
    adsenseClientId: parsed.data.adsensePublisherId || ads.adsenseClientId
  });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(auditLogs).values({
      actorId: auth.id,
      action: "UPDATE",
      entityType: "SITE_INTEGRATIONS",
      entityId: "site_integrations",
      before,
      after: { ...parsed.data, ip: clientAddress },
      origin: "ADMIN"
    });
  } finally {
    await connection.close();
  }

  return redirect("/admin/integracoes?saved=1", 303);
};
