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
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!publisherId || !slot || initializedRef.current || !insRef.current) return;
    let cancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    function logAdRuntime(hypothesisId: string, message: string, data: Record<string, unknown>) {
      // #region agent log
      void fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
        body: JSON.stringify({
          sessionId: "eb6787",
          runId: "retry-adsbygoogle-ready",
          hypothesisId,
          location: "components/ads/ad-slot-client.tsx",
          message,
          data,
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    }

    logAdRuntime("H1", "slot_effect_started_retry", {
      slot,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : null,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      hasAdsbygoogleGlobal: Boolean(window.adsbygoogle)
    });

    function schedulePush(trigger: string, attempt: number) {
      if (initializedRef.current || cancelled) {
        return;
      }

      try {
        if (!window.adsbygoogle) {
          logAdRuntime("H1", "push_waiting_global", {
            slot,
            viewportWidth: window.innerWidth,
            trigger,
            attempt
          });
          if (attempt < 8) {
            retryTimeout = setTimeout(() => schedulePush(trigger, attempt + 1), 300);
          }
          return;
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initializedRef.current = true;
        logAdRuntime("H2", "push_success", {
          slot,
          viewportWidth: window.innerWidth,
          trigger,
          attempt,
          format,
          fullWidthResponsive
        });
      } catch {
        initializedRef.current = false;
        logAdRuntime("H3", "push_error", {
          slot,
          viewportWidth: window.innerWidth,
          trigger,
          attempt
        });
      }
    }
    globalThis.requestAnimationFrame(() => schedulePush("raf-immediate", 0));
    return () => {
      cancelled = true;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [publisherId, slot, format, fullWidthResponsive]);

  if (!publisherId || !slot) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-[color:rgba(26,43,76,0.08)] bg-white/90 p-2 shadow-[0_22px_70px_-46px_rgba(26,43,76,0.18)]",
        className
      )}
    >
      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">Publicidade</div>
      <ins
        ref={insRef}
        className="adsbygoogle block min-h-[250px] w-full"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

/** Codigo colado no admin (HTML do anunciante). Executado uma vez no cliente. */
export function AdSlotSnippetClient({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !html.trim()) return;
    el.innerHTML = html;
    const scripts = el.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const s = document.createElement("script");
      [...oldScript.attributes].forEach((attr) => s.setAttribute(attr.name, attr.value));
      s.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(s, oldScript);
    });
  }, [html]);

  if (!html.trim()) return null;

  return <div ref={ref} className={cn("ad-snippet-root min-h-[120px] w-full", className)} />;
}
