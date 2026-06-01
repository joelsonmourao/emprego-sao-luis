"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export type AdSlotClientProps = {
  publisherId: string;
  slot: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  fullWidthResponsive?: boolean;
};

/** Unidade AdSense padrao (ins + push). */
export function AdSlotClient({
  publisherId,
  slot,
  className,
  format = "auto",
  fullWidthResponsive = true
}: AdSlotClientProps) {
  const initializedRef = useRef(false);
  const slotRef = useRef<HTMLElement | null>(null);
  const normalizedSlot = slot.trim();
  const hasValidClient = publisherId.startsWith("ca-pub-");
  const hasValidSlot = /^\d+$/.test(normalizedSlot);
  const reserveHeightClass =
    format === "horizontal"
      ? "min-h-[120px]"
      : format === "fluid"
        ? "min-h-[180px]"
        : format === "rectangle"
          ? "min-h-[250px]"
          : "min-h-[200px]";

  useEffect(() => {
    const slotElement = slotRef.current;
    if (!hasValidClient || !hasValidSlot || initializedRef.current || !slotElement) return;
    if (slotElement.dataset.adInitialized === "true") return;

    try {
      // Push immediately; adsbygoogle queue is safe before script fully initializes.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedRef.current = true;
      slotElement.dataset.adInitialized = "true";
    } catch {
      initializedRef.current = false;
      slotElement.dataset.adInitialized = "false";
    }
  }, [hasValidClient, hasValidSlot, format, fullWidthResponsive]);

  if (!hasValidClient || !hasValidSlot) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-[color:rgba(26,43,76,0.08)] bg-white/90 p-2 shadow-[0_22px_70px_-46px_rgba(26,43,76,0.18)]",
        className
      )}
    >
      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">Publicidade</div>
      <ins
        ref={(node) => {
          slotRef.current = node;
        }}
        className={`adsbygoogle block w-full ${reserveHeightClass}`}
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={normalizedSlot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

/** Codigo colado no admin (HTML do anunciante). Executado uma vez no cliente. */
export function AdSlotSnippetClient({
  html,
  className,
  publisherId,
  fallbackSlot
}: {
  html: string;
  className?: string;
  publisherId: string;
  fallbackSlot: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !html.trim() || !publisherId.startsWith("ca-pub-")) return;
    el.innerHTML = html;
    const scripts = el.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const src = oldScript.getAttribute("src") ?? "";
      const body = oldScript.textContent ?? "";
      const isAdsenseBootstrapScript = /adsbygoogle\.js|pagead2\.googlesyndication\.com|googlesyndication/i.test(src);
      const isLegacyPageLevelBootstrap = /enable_page_level_ads|google_ad_client/i.test(body);
      const isAdsenseScript = isAdsenseBootstrapScript || isLegacyPageLevelBootstrap;
      if (isAdsenseScript) {
        oldScript.remove();
      }
    });

    const adElements = Array.from(el.querySelectorAll<HTMLElement>("ins"));

    adElements.forEach((adElement) => {
      const existingClass = adElement.getAttribute("class") ?? "";
      if (!existingClass.includes("adsbygoogle")) {
        adElement.setAttribute("class", `${existingClass} adsbygoogle`.trim());
      }
      if (!adElement.getAttribute("data-ad-client")) {
        adElement.setAttribute("data-ad-client", publisherId);
      }
      if (!adElement.getAttribute("data-ad-slot")) {
        adElement.setAttribute("data-ad-slot", fallbackSlot);
      }
      if (!adElement.getAttribute("style")) {
        adElement.setAttribute("style", "display:block");
      }
    });

    adElements.forEach((adElement) => {
      const slot = adElement.getAttribute("data-ad-slot")?.trim() ?? "";
      const client = adElement.getAttribute("data-ad-client")?.trim() ?? "";
      if (!slot || !/^\d+$/.test(slot) || !client.startsWith("ca-pub-")) {
        adElement.dataset.adInitialized = "invalid";
        return;
      }
      if (adElement.dataset.adInitialized === "true") return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adElement.dataset.adInitialized = "true";
      } catch {
        adElement.dataset.adInitialized = "false";
      }
    });
  }, [fallbackSlot, html, publisherId]);

  if (!html.trim()) return null;

  return <div ref={ref} className={cn("ad-snippet-root min-h-[250px] w-full overflow-hidden", className)} />;
}
