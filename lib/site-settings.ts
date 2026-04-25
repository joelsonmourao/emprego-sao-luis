import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { deepMergeDefaults } from "@/lib/merge-defaults";
import { PUBLIC_SITE_SETTINGS_CACHE_TAG } from "@/lib/public-revalidate";
import { defaultSiteSettings, siteSettingsSchema, type SiteSettings } from "@/lib/schemas/site-admin";
import { normalizeOrigin } from "@/lib/site-url";

export { defaultSiteSettings, siteSettingsSchema };
export type { SiteSettings };

async function fetchSiteSettings(): Promise<SiteSettings> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "site_settings" }
  });

  if (!setting) {
    return defaultSiteSettings;
  }

  const parsed = siteSettingsSchema.safeParse(deepMergeDefaults(defaultSiteSettings, setting.value));
  if (!parsed.success) {
    return defaultSiteSettings;
  }

  const searchConsolePropertyUrl = normalizeOrigin(parsed.data.google.searchConsolePropertyUrl);

  return {
    ...parsed.data,
    google: {
      ...parsed.data.google,
      searchConsolePropertyUrl: searchConsolePropertyUrl ?? parsed.data.google.searchConsolePropertyUrl
    }
  };
}

export const getSiteSettings = unstable_cache(fetchSiteSettings, ["site-settings-v1"], {
  revalidate: 3600,
  tags: [PUBLIC_SITE_SETTINGS_CACHE_TAG]
});
