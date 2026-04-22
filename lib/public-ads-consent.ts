import { parseConsentValue } from "@/lib/consent";
import { normalizeAdsensePublisherId } from "@/lib/google";
import type { SiteSettings } from "@/lib/site-settings";

type PublicAdsSettings = Pick<SiteSettings, "consentBanner" | "google">;

/** Espelha a logica de `SiteIntegrations` para consentimento de publicidade (AdSense). */
export function computePublicAdsenseHeadContext(settings: PublicAdsSettings, consentCookieValue: string | null) {
  const hasOptionalIntegrations = settings.google.analyticsEnabled || settings.google.adsenseEnabled;
  const consentRequired =
    settings.google.consentModeEnabled && settings.consentBanner.bannerEnabled && hasOptionalIntegrations;

  const parsed = parseConsentValue(consentCookieValue);
  const publisherId = normalizeAdsensePublisherId(settings.google.adsensePublisherId);

  return {
    consentRequired,
    /** Valor inicial do cookie no SSR (publicidade). */
    initialAdvertisingGranted: Boolean(parsed?.advertising),
    publisherId,
    adsenseEnabled: settings.google.adsenseEnabled
  };
}
