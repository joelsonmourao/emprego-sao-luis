"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdSlotProps = {
  publisherId?: string;
  slot?: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  fullWidthResponsive?: boolean;
};

export function AdSlot({
  publisherId,
  slot,
  className,
  format = "auto",
  fullWidthResponsive = true
}: AdSlotProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!publisherId || !slot || initializedRef.current) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch {
      initializedRef.current = false;
    }
  }, [publisherId, slot]);

  if (!publisherId || !slot) {
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-[color:rgba(26,43,76,0.08)] bg-white/90 p-2 shadow-[0_22px_70px_-46px_rgba(26,43,76,0.18)]",
        className
      )}
    >
      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">Publicidade</div>
      <ins
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
