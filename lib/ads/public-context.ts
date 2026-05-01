import { cache } from "react";
import { cookies, headers } from "next/headers";

import { ADMIN_AUTH_COOKIE, verifyAdminSessionToken } from "@/lib/auth-token";
import { getAdSettings, listAdSlots } from "@/lib/repositories/ad-system";
import { getSiteSettings } from "@/lib/site-settings";
import { normalizeAdsensePublisherId } from "@/lib/google";

export type ResolvedAdSlot = {
  slug: string;
  isActive: boolean;
  code: string;
  adsenseSlotId: string | null;
  position: string;
};

export type PublicAdContext = {
  /** Visitante autenticado no admin (EDITOR ou ADMIN): nao exibir anuncios no site publico */
  suppressForAdmin: boolean;
  globalEnabled: boolean;
  integrationsAdsenseReady: boolean;
  publisherId: string | null;
  slotsBySlug: Map<string, ResolvedAdSlot>;
};

function buildSlotsMap(
  rows: Awaited<ReturnType<typeof listAdSlots>>
): Map<string, ResolvedAdSlot> {
  return new Map(
    rows.map((row) => [
      row.slug,
      {
        slug: row.slug,
        isActive: row.isActive,
        code: row.code,
        adsenseSlotId: row.adsenseSlotId,
        position: row.position
      }
    ])
  );
}

export const getPublicAdContext = cache(async (): Promise<PublicAdContext> => {
  const headerStore = await headers();
  const suppressHeader = headerStore.get("x-suppress-public-ads") === "1";

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;
  const suppressForAdmin = suppressHeader || Boolean(session);

  const [adSettings, slots, siteSettings] = await Promise.all([getAdSettings(), listAdSlots(), getSiteSettings()]);

  const publisherId = normalizeAdsensePublisherId(siteSettings.google.adsensePublisherId);
  const integrationsAdsenseReady = Boolean(siteSettings.google.adsenseEnabled && publisherId);

  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "ads-debug",
      hypothesisId: "H1_ADS_DISABLED_OR_SUPPRESSED",
      location: "lib/ads/public-context.ts:getPublicAdContext",
      message: "Contexto de anuncios publico resolvido",
      data: {
        suppressForAdmin,
        globalEnabled: adSettings.globalEnabled,
        adsenseEnabled: siteSettings.google.adsenseEnabled,
        hasPublisherId: Boolean(publisherId),
        integrationsAdsenseReady,
        slotsCount: slots.length,
        activeSlotsCount: slots.filter((slot) => slot.isActive).length
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  return {
    suppressForAdmin,
    globalEnabled: adSettings.globalEnabled,
    integrationsAdsenseReady,
    publisherId,
    slotsBySlug: buildSlotsMap(slots)
  };
});

export function shouldRenderPaidAds(ctx: PublicAdContext) {
  return ctx.integrationsAdsenseReady && ctx.globalEnabled && !ctx.suppressForAdmin;
}
