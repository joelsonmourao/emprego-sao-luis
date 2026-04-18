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

function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  );
}

export function getConsentCookieDomain(hostname?: string | null) {
  const normalized = hostname?.trim().toLowerCase();

  if (!normalized || isLocalHostname(normalized) || !normalized.includes(".")) {
    return null;
  }

  if (normalized.endsWith(".com.br")) {
    const parts = normalized.split(".");
    return parts.slice(-3).join(".");
  }

  const parts = normalized.split(".");
  return parts.slice(-2).join(".");
}

export function buildConsentCookieString(value: ConsentPreferences, options?: { hostname?: string | null; secure?: boolean }) {
  const domain = getConsentCookieDomain(options?.hostname);
  const secureFlag = options?.secure ? "; Secure" : "";
  const domainFlag = domain ? `; Domain=${domain}` : "";

  return `${CONSENT_COOKIE_NAME}=${serializeConsentValue(value)}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax${domainFlag}${secureFlag}`;
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
