"use client";

import { useEffect } from "react";

type AdUnitProps = {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdUnit({ slotId, format = "auto", className = "", label = "Anúncio" }: AdUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!clientId) return;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
    } catch {
      // Ignora falhas de carregamento do AdSense antes da aprovação.
    }
  }, [clientId]);

  if (!clientId) {
    return null;
  }

  return (
    <aside
      className={`my-6 flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-[color:rgba(26,26,26,0.08)] bg-white/60 px-4 py-3 ${className}`}
      aria-label={label}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId ?? ""}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
