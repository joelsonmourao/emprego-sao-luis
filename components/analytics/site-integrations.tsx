"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CookieConsentBanner } from "@/components/consent/cookie-consent-banner";
import { trackPortalEvent } from "@/lib/analytics/client";
import { CONSENT_COOKIE_NAME, CONSENT_EVENT_NAME, buildConsentCookieString, buildConsentPreferences, parseConsentValue } from "@/lib/consent";

type SiteIntegrationsProps = {
  consentBanner: {
    bannerEnabled: boolean;
    title: string;
    description: string;
    policyHref: string;
    acceptLabel: string;
    rejectLabel: string;
    manageLabel: string;
    analyticsLabel: string;
    advertisingLabel: string;
  };
  google: {
    consentModeEnabled: boolean;
    analyticsEnabled: boolean;
    ga4MeasurementId: string;
    gtmContainerId: string;
    adsenseEnabled: boolean;
    adsensePublisherId: string;
    adsenseAutoAds: boolean;
  };
  initialConsentValue: string | null;
};

type StoredConsent = {
  analytics: boolean;
  advertising: boolean;
};

function readConsent() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return parseConsentValue(cookie ?? null);
}

export function SiteIntegrations({ consentBanner, google, initialConsentValue }: SiteIntegrationsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef("");
  const [consent, setConsent] = useState<StoredConsent | null>(() => {
    const parsed = parseConsentValue(initialConsentValue);
    return parsed ? { analytics: parsed.analytics, advertising: parsed.advertising } : null;
  });

  useEffect(() => {
    const nextConsent = readConsent();
    setConsent(nextConsent ? { analytics: nextConsent.analytics, advertising: nextConsent.advertising } : null);
    if (nextConsent) {
      window.__javUpdateConsent?.({
        analytics: nextConsent.analytics,
        advertising: nextConsent.advertising
      });
    }

    function handleConsent(event: Event) {
      const detail = (event as CustomEvent<StoredConsent | null>).detail;
      if (detail) {
        setConsent({
          analytics: Boolean(detail.analytics),
          advertising: Boolean(detail.advertising)
        });
        window.__javUpdateConsent?.({
          analytics: Boolean(detail.analytics),
          advertising: Boolean(detail.advertising)
        });
      }
    }

    window.addEventListener(CONSENT_EVENT_NAME, handleConsent as EventListener);
    return () => window.removeEventListener(CONSENT_EVENT_NAME, handleConsent as EventListener);
  }, []);

  useEffect(() => {
    if (!google.consentModeEnabled || !consentBanner.bannerEnabled) {
      const fallbackConsent = buildConsentPreferences({
        analytics: google.analyticsEnabled,
        advertising: google.adsenseEnabled
      });
      document.cookie = buildConsentCookieString(fallbackConsent, {
        hostname: typeof window !== "undefined" ? window.location.hostname : undefined,
        secure: typeof window !== "undefined" && window.location.protocol === "https:"
      });
      setConsent({
        analytics: fallbackConsent.analytics,
        advertising: fallbackConsent.advertising
      });
      window.__javUpdateConsent?.({
        analytics: google.analyticsEnabled,
        advertising: google.adsenseEnabled
      });
    }
  }, [consentBanner.bannerEnabled, google.adsenseEnabled, google.analyticsEnabled, google.consentModeEnabled]);

  const hasOptionalIntegrations = google.analyticsEnabled || google.adsenseEnabled;
  const shouldRenderConsentBanner = consentBanner.bannerEnabled;
  const consentRequired = google.consentModeEnabled && shouldRenderConsentBanner && hasOptionalIntegrations;
  const analyticsAllowed = google.analyticsEnabled && (consentRequired ? Boolean(consent?.analytics) : true);

  useEffect(() => {
    if (!analyticsAllowed) {
      return;
    }

    const search = searchParams.toString();
    const path = `${pathname}${search ? `?${search}` : ""}`;
    if (lastTrackedPathRef.current === path) {
      return;
    }

    lastTrackedPathRef.current = path;
    void trackPortalEvent({
      eventName: "page_view",
      path,
      entityType:
        pathname.startsWith("/vagas/") && pathname !== "/vagas"
          ? "job"
          : pathname.startsWith("/blog/") && pathname !== "/blog"
            ? "post"
            : pathname.startsWith("/empresas/") || pathname.startsWith("/empresa/")
              ? "company"
              : "page"
    });
  }, [analyticsAllowed, pathname, searchParams]);

  const shouldLoadGa = analyticsAllowed && Boolean(google.ga4MeasurementId);
  const shouldLoadGtm = analyticsAllowed && Boolean(google.gtmContainerId);

  return (
    <>
      {shouldLoadGa ? (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${google.ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              window.gtag = window.gtag || function(){window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments);};
              window.gtag('js', new Date());
              window.gtag('config', '${google.ga4MeasurementId}', { send_page_view: false, anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {shouldLoadGtm ? (
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${google.gtmContainerId}');
          `}
        </Script>
      ) : null}

      {shouldRenderConsentBanner ? <CookieConsentBanner config={consentBanner} initialConsentValue={initialConsentValue} /> : null}
    </>
  );
}
