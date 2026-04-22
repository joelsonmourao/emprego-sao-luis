"use client";

import { useEffect, useRef } from "react";

import { CONSENT_COOKIE_NAME, CONSENT_EVENT_NAME, parseConsentValue } from "@/lib/consent";

type AdsenseHeadInjectorProps = {
  publisherId: string;
  adsenseEnabled: boolean;
  consentRequired: boolean;
  initialAdvertisingGranted: boolean;
  suppressPublicAds: boolean;
};

function readConsentAdvertising() {
  if (typeof document === "undefined") {
    return false;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return Boolean(parseConsentValue(cookie ?? null)?.advertising);
}

export function AdsenseHeadInjector({
  publisherId,
  adsenseEnabled,
  consentRequired,
  initialAdvertisingGranted,
  suppressPublicAds
}: AdsenseHeadInjectorProps) {
  const injectedRef = useRef(false);

  useEffect(() => {
    function agentLog(hypothesisId: string, message: string, data: Record<string, unknown>) {
      // #region agent log
      void fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
        body: JSON.stringify({
          sessionId: "eb6787",
          hypothesisId,
          location: "adsense-head-injector.tsx",
          message,
          data,
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    }

    function tryInject(trigger: string) {
      const eligible = adsenseEnabled && Boolean(publisherId) && !suppressPublicAds;
      const advertisingOk =
        !consentRequired || initialAdvertisingGranted || readConsentAdvertising();

      if (injectedRef.current) {
        agentLog("H3", "inject_skipped_already", { trigger, eligible, advertisingOk });
        return;
      }

      if (!eligible) {
        agentLog("H1", "inject_blocked_ineligible", {
          trigger,
          adsenseEnabled,
          hasPublisher: Boolean(publisherId),
          suppressPublicAds
        });
        return;
      }

      if (!advertisingOk) {
        agentLog("H2", "inject_waiting_consent", {
          trigger,
          consentRequired,
          initialAdvertisingGranted,
          cookieAdvertising: readConsentAdvertising()
        });
        return;
      }

      queueMicrotask(() => {
        if (injectedRef.current) {
          return;
        }

        if (document.querySelector('script[data-jav-adsense="1"]')) {
          injectedRef.current = true;
          agentLog("H3", "inject_skipped_dom_exists", { trigger });
          return;
        }

        const script = document.createElement("script");
        script.async = true;
        script.crossOrigin = "anonymous";
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
        script.setAttribute("data-jav-adsense", "1");
        document.head.appendChild(script);
        injectedRef.current = true;
        agentLog("H3", "inject_success_head", { trigger, clientParam: publisherId });
      });
    }

    queueMicrotask(() => tryInject("mount"));

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<{ analytics?: boolean; advertising?: boolean } | null>).detail;
      const ok = !consentRequired || Boolean(detail?.advertising);
      if (ok) {
        tryInject("consent-event");
      } else {
        agentLog("H2", "consent_event_no_ads", { advertising: detail?.advertising ?? null });
      }
    }

    window.addEventListener(CONSENT_EVENT_NAME, onConsent as EventListener);
    return () => window.removeEventListener(CONSENT_EVENT_NAME, onConsent as EventListener);
  }, [
    adsenseEnabled,
    publisherId,
    consentRequired,
    initialAdvertisingGranted,
    suppressPublicAds
  ]);

  return null;
}
