"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CookieConsentBanner } from "@/components/consent/cookie-consent-banner";
import { trackPortalEvent } from "@/lib/analytics/client";
import { CONSENT_COOKIE_NAME, CONSENT_EVENT_NAME, buildConsentPreferences, parseConsentValue, serializeConsentValue } from "@/lib/consent";
import { normalizeAdsensePublisherId } from "@/lib/google";

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
    .find((entry) => entry.startsWith("jav_consent_v1="))
    ?.split("=")
    .slice(1)
    .join("=");

  return parseConsentValue(cookie ?? null);
}

export function SiteIntegrations({ consentBanner, google }: SiteIntegrationsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef("");
  const [consent, setConsent] = useState<StoredConsent | null>(null);

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
      document.cookie = `${CONSENT_COOKIE_NAME}=${serializeConsentValue(fallbackConsent)}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`;
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
  const consentRequired = google.consentModeEnabled && consentBanner.bannerEnabled && hasOptionalIntegrations;
  const analyticsAllowed = google.analyticsEnabled && (consentRequired ? Boolean(consent?.analytics) : true);
  const advertisingAllowed = google.adsenseEnabled && (consentRequired ? Boolean(consent?.advertising) : true);

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
            : pathname.startsWith("/empresas/")
              ? "company"
              : "page"
    });
  }, [analyticsAllowed, pathname, searchParams]);

  const shouldLoadGa = analyticsAllowed && Boolean(google.ga4MeasurementId);
  const shouldLoadGtm = analyticsAllowed && Boolean(google.gtmContainerId);
  const normalizedPublisherId = normalizeAdsensePublisherId(google.adsensePublisherId);
  const shouldLoadAdsense = advertisingAllowed && google.adsenseAutoAds && Boolean(normalizedPublisherId);

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

      {shouldLoadAdsense ? (
        <Script
          id="adsense-auto-ads"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedPublisherId}`}
        />
      ) : null}

      {consentRequired ? <CookieConsentBanner config={consentBanner} /> : null}
    </>
  );
}
