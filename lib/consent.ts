export const CONSENT_COOKIE_NAME = "jav_consent_v1";
export const CONSENT_EVENT_NAME = "jav-consent-updated";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
};

export const defaultConsentPreferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
  advertising: false,
  updatedAt: ""
};

export function parseConsentValue(value?: string | null): ConsentPreferences | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentPreferences>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      updatedAt: parsed.updatedAt || ""
    };
  } catch {
    return null;
  }
}

export function serializeConsentValue(value: ConsentPreferences) {
  return encodeURIComponent(JSON.stringify(value));
}

export function buildConsentPreferences(input: Pick<ConsentPreferences, "analytics" | "advertising">): ConsentPreferences {
  return {
    necessary: true,
    analytics: Boolean(input.analytics),
    advertising: Boolean(input.advertising),
    updatedAt: new Date().toISOString()
  };
}

export function getGoogleConsentState(value: ConsentPreferences | null) {
  const analyticsGranted = Boolean(value?.analytics);
  const adsGranted = Boolean(value?.advertising);

  return {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: adsGranted ? "granted" : "denied",
    ad_user_data: adsGranted ? "granted" : "denied",
    ad_personalization: adsGranted ? "granted" : "denied"
  } as const;
}

