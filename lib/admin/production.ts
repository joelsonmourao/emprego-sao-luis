import { env } from "@/lib/env";
import { getEditableSiteSettings } from "@/lib/admin/site";
import { normalizeAdsensePublisherId, normalizeSearchConsoleVerification } from "@/lib/google";

export async function getProductionReadiness() {
  const settings = await getEditableSiteSettings();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const isLocal = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
  const isHttps = siteUrl.startsWith("https://");
  const gaConfigured = Boolean(settings.google.ga4MeasurementId.trim());
  const gtmConfigured = Boolean(settings.google.gtmContainerId.trim());
  const searchConsoleConfigured = Boolean(normalizeSearchConsoleVerification(settings.google.searchConsoleVerification));
  const adsenseConfigured = Boolean(normalizeAdsensePublisherId(settings.google.adsensePublisherId));
  const adsTxtConfigured = Boolean(settings.google.adsTxtContent.trim() || adsenseConfigured);

  return {
    siteUrl,
    isLocal,
    isHttps,
    hasStrongAuthSecret: env.AUTH_SECRET.length >= 24 && !env.AUTH_SECRET.includes("dev-only"),
    consentEnabled: settings.consentBanner.bannerEnabled,
    googleConsentMode: settings.google.consentModeEnabled,
    gaConfigured,
    gtmConfigured,
    searchConsoleConfigured,
    adsenseConfigured,
    adsTxtConfigured,
    autoAdsEnabled: settings.google.adsenseAutoAds,
    reportsConfigured: Boolean(
      settings.google.ga4ReportsUrl.trim() ||
        settings.google.searchConsoleReportsUrl.trim() ||
        settings.google.lookerStudioUrl.trim()
    ),
    settings
  };
}

