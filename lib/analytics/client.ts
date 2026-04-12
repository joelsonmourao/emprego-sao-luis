"use client";

import { CONSENT_COOKIE_NAME, parseConsentValue } from "@/lib/consent";

type PortalEventPayload = {
  eventName: string;
  path?: string;
  title?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  entityType?: string;
  entityId?: string;
  entitySlug?: string;
  metadata?: Record<string, unknown>;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __javUpdateConsent?: (payload: { analytics: boolean; advertising: boolean }) => void;
  }
}

function getCurrentUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URL(window.location.href);
}

function hasAnalyticsConsent() {
  if (typeof document === "undefined") {
    return false;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const parsed = parseConsentValue(cookie ?? null);
  return Boolean(parsed?.analytics);
}

export function readUtmParams() {
  const currentUrl = getCurrentUrl();

  if (!currentUrl) {
    return {
      source: "",
      medium: "",
      campaign: ""
    };
  }

  return {
    source: currentUrl.searchParams.get("utm_source") ?? "",
    medium: currentUrl.searchParams.get("utm_medium") ?? "",
    campaign: currentUrl.searchParams.get("utm_campaign") ?? ""
  };
}

export async function trackPortalEvent(payload: PortalEventPayload) {
  if (typeof window === "undefined") {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  const currentUrl = getCurrentUrl();
  const utm = readUtmParams();
  const data = {
    path: currentUrl ? `${currentUrl.pathname}${currentUrl.search}` : payload.path ?? "/",
    title: document.title,
    referrer: document.referrer,
    source: payload.source ?? utm.source,
    medium: payload.medium ?? utm.medium,
    campaign: payload.campaign ?? utm.campaign,
    ...payload
  };

  if (typeof window.gtag === "function") {
    const eventParams = {
      page_location: currentUrl?.href,
      page_path: data.path,
      page_title: data.title,
      entity_type: data.entityType,
      entity_slug: data.entitySlug,
      source: data.source || undefined,
      medium: data.medium || undefined,
      campaign: data.campaign || undefined,
      ...(data.metadata ?? {})
    };

    if (payload.eventName === "page_view") {
      window.gtag("event", "page_view", eventParams);
    } else {
      window.gtag("event", payload.eventName, eventParams);
    }
  }

  try {
    await fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true
    });
  } catch {
    // Tracking should never block navigation.
  }
}
