"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Cookie, Settings2 } from "lucide-react";

import {
  CONSENT_COOKIE_NAME,
  CONSENT_EVENT_NAME,
  buildConsentPreferences,
  buildConsentCookieString,
  defaultConsentPreferences,
  parseConsentValue
} from "@/lib/consent";
import { Button } from "@/components/ui/button";

type ConsentBannerConfig = {
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

function readConsentCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const item = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));

  return parseConsentValue(item?.split("=").slice(1).join("=") ?? null);
}

function persistConsent(analytics: boolean, advertising: boolean) {
  const nextConsent = buildConsentPreferences({ analytics, advertising });
  document.cookie = buildConsentCookieString(nextConsent, {
    hostname: typeof window !== "undefined" ? window.location.hostname : undefined,
    secure: typeof window !== "undefined" && window.location.protocol === "https:"
  });
  window.__javUpdateConsent?.({ analytics, advertising });
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: nextConsent }));
  return nextConsent;
}

export function CookieConsentBanner({ config, initialConsentValue = null }: { config: ConsentBannerConfig; initialConsentValue?: string | null }) {
  const [storedConsent, setStoredConsent] = useState<ReturnType<typeof readConsentCookie>>(() => parseConsentValue(initialConsentValue));
  const [showPreferences, setShowPreferences] = useState(false);
  const initialDraft = useMemo(() => storedConsent ?? defaultConsentPreferences, [storedConsent]);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(initialDraft.analytics);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(initialDraft.advertising);

  useEffect(() => {
    const nextConsent = readConsentCookie() ?? parseConsentValue(initialConsentValue);
    setStoredConsent(nextConsent);
    setAnalyticsEnabled(nextConsent?.analytics ?? false);
    setAdvertisingEnabled(nextConsent?.advertising ?? false);
    if (nextConsent) {
      window.__javUpdateConsent?.({ analytics: nextConsent.analytics, advertising: nextConsent.advertising });
    }
  }, [initialConsentValue]);

  useEffect(() => {
    function handleUpdate(event: Event) {
      const customEvent = event as CustomEvent<ReturnType<typeof readConsentCookie>>;
      const nextConsent = customEvent.detail;
      setStoredConsent(nextConsent);
      setAnalyticsEnabled(nextConsent?.analytics ?? false);
      setAdvertisingEnabled(nextConsent?.advertising ?? false);
    }

    window.addEventListener(CONSENT_EVENT_NAME, handleUpdate as EventListener);
    return () => window.removeEventListener(CONSENT_EVENT_NAME, handleUpdate as EventListener);
  }, []);

  if (!config.bannerEnabled) {
    return null;
  }

  const hasConsent = Boolean(storedConsent);

  return (
    <>
      {!hasConsent ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/96 px-4 py-4 shadow-[0_-20px_50px_-35px_rgba(15,23,42,0.28)] backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-2">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-brick)]">
                <Cookie className="h-4 w-4" />
                Cookies e privacidade
              </p>
              <h2 className="text-xl font-black text-slate-950">{config.title}</h2>
              <p className="text-sm leading-7 text-slate-600">
                {config.description}{" "}
                <Link href={config.policyHref as never} className="font-semibold text-[var(--brand-brick)] underline-offset-4 hover:text-[#65231f] hover:underline">
            Ver política de cookies
                </Link>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={() => setShowPreferences((value) => !value)}>
                {config.manageLabel}
              </Button>
              <Button type="button" variant="outline" onClick={() => setStoredConsent(persistConsent(false, false))}>
                {config.rejectLabel}
              </Button>
              <Button type="button" onClick={() => setStoredConsent(persistConsent(true, true))}>
                {config.acceptLabel}
              </Button>
            </div>
          </div>

          {showPreferences ? (
            <div className="mx-auto mt-4 max-w-7xl rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Essenciais</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Necessarios para seguranca, login e funcionamento do portal.</p>
                  <p className="mt-3 text-xs font-semibold text-emerald-600">Sempre ativos</p>
                </div>
                <label className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{config.analyticsLabel}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Ajuda a entender paginas mais acessadas, buscas usadas e pontos que podem ser melhorados no portal.</p>
                    </div>
                    <input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--brand-brick)]" />
                  </div>
                </label>
                <label className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{config.advertisingLabel}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Permite recursos de publicidade quando o portal estiver com anuncios ativos e com essa categoria habilitada.</p>
                    </div>
                    <input type="checkbox" checked={advertisingEnabled} onChange={(event) => setAdvertisingEnabled(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--brand-brick)]" />
                  </div>
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" onClick={() => setStoredConsent(persistConsent(analyticsEnabled, advertisingEnabled))}>
                  Salvar preferencias
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowPreferences(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPreferences((value) => !value)}
          className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-text-secondary)] shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] transition hover:text-[var(--brand-brick)]"
        >
          <Settings2 className="h-4 w-4" />
          {config.manageLabel}
        </button>
      )}

      {hasConsent && showPreferences ? (
        <div className="fixed bottom-20 left-4 z-40 w-[min(420px,calc(100vw-2rem))] rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.32)]">
          <h3 className="text-lg font-black text-slate-950">{config.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{config.description}</p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-900">{config.analyticsLabel}</span>
              <input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} className="h-4 w-4 accent-[var(--brand-brick)]" />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-900">{config.advertisingLabel}</span>
              <input type="checkbox" checked={advertisingEnabled} onChange={(event) => setAdvertisingEnabled(event.target.checked)} className="h-4 w-4 accent-[var(--brand-brick)]" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => setStoredConsent(persistConsent(analyticsEnabled, advertisingEnabled))}>
              Salvar preferencias
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowPreferences(false)}>
              Fechar
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
