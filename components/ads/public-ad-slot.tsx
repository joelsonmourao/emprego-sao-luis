import { AdminAdPlaceholder } from "@/components/ads/admin-ad-placeholder";
import { AdSlotClient, AdSlotSnippetClient } from "@/components/ads/ad-slot-client";
import { getPublicAdContext, shouldRenderPaidAds } from "@/lib/ads/public-context";
import { cn } from "@/lib/utils";

export type PublicAdSlotProps = {
  slotSlug: string;
  position?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  fullWidthResponsive?: boolean;
  className?: string;
  /** Altura minima quando desligado para nao colapsar layout */
  minHeightClass?: string;
};

function extractSlotFromHtml(html: string): string | null {
  const m = html.match(/data-ad-slot=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

export async function PublicAdSlot({
  slotSlug,
  format = "auto",
  fullWidthResponsive = true,
  className,
  minHeightClass = "min-h-[250px]"
}: PublicAdSlotProps) {
  const ctx = await getPublicAdContext();
  const slot = ctx.slotsBySlug.get(slotSlug);

  if (ctx.suppressForAdmin) {
    return <AdminAdPlaceholder slotId={slotSlug} />;
  }

  if (!shouldRenderPaidAds(ctx) || !slot || !slot.isActive) {
    return <div className={cn("w-full", minHeightClass)} aria-hidden data-ad-slot-empty={slotSlug} />;
  }

  const publisherId = ctx.publisherId;
  if (!publisherId) {
    return <div className={cn("w-full", minHeightClass)} aria-hidden />;
  }

  const trimmedCode = slot.code.trim();
  const dataSlot = slot.adsenseSlotId?.trim() || extractSlotFromHtml(trimmedCode) || "";
  if (trimmedCode.includes("<") && (trimmedCode.includes("ins") || trimmedCode.includes("script"))) {
    if (!dataSlot) {
      console.warn(`[ads] Slot sem data-ad-slot valido: ${slotSlug}`);
      return null;
    }
    return (
      <AdSlotSnippetClient
        html={trimmedCode}
        className={cn(minHeightClass, className)}
        publisherId={publisherId}
        fallbackSlot={dataSlot}
      />
    );
  }

  if (!dataSlot) {
    console.warn(`[ads] Slot sem data-ad-slot valido: ${slotSlug}`);
    return null;
  }

  return (
    <AdSlotClient
      publisherId={publisherId}
      slot={dataSlot}
      format={format}
      fullWidthResponsive={fullWidthResponsive}
      className={className}
    />
  );
}
