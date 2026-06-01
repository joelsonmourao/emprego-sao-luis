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
  const m = html.match(/data-ad-slot=["'](\d+)["']/i);
  return m?.[1] ?? null;
}

function hasForbiddenAdsenseBootstrap(html: string): boolean {
  return /enable_page_level_ads|google_ad_client|adsbygoogle\.js|pagead2\.googlesyndication\.com|googlesyndication/i.test(html);
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
  const hasForbiddenBootstrap = hasForbiddenAdsenseBootstrap(trimmedCode);
  if (trimmedCode.includes("<") && (trimmedCode.includes("ins") || trimmedCode.includes("script")) && !hasForbiddenBootstrap) {
    return <AdSlotSnippetClient html={trimmedCode} className={cn(minHeightClass, className)} />;
  }

  if (!dataSlot) {
    return <div className={cn("w-full", minHeightClass)} aria-hidden data-ad-slot-missing-id={slotSlug} />;
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
