import { HubType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { deepMergeDefaults } from "@/lib/merge-defaults";
import { defaultSiteContent, siteContentSchema } from "@/lib/site-content";
import { defaultSiteSettings, siteSettingsSchema } from "@/lib/site-settings";
import { normalizeSlug, sanitizeHtml } from "@/lib/admin/content";

export async function saveSiteContent(input: unknown) {
  const parsed = siteContentSchema.parse(input);

  return prisma.siteSetting.upsert({
    where: { key: "site_content" },
    update: { value: parsed },
    create: { key: "site_content", value: parsed }
  });
}

export async function saveSiteSettings(input: unknown) {
  const parsed = siteSettingsSchema.parse(input);

  return prisma.siteSetting.upsert({
    where: { key: "site_settings" },
    update: { value: parsed },
    create: { key: "site_settings", value: parsed }
  });
}

export async function patchSiteSettings(input: unknown) {
  const current = await getEditableSiteSettings();
  const parsed = siteSettingsSchema.parse(deepMergeDefaults(current, input));

  return prisma.siteSetting.upsert({
    where: { key: "site_settings" },
    update: { value: parsed },
    create: { key: "site_settings", value: parsed }
  });
}

export async function getEditableSiteContent() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "site_content" }
  });

  const parsed = siteContentSchema.safeParse(deepMergeDefaults(defaultSiteContent, setting?.value));
  return parsed.success ? parsed.data : defaultSiteContent;
}

export async function getEditableSiteSettings() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "site_settings" }
  });

  const parsed = siteSettingsSchema.safeParse(deepMergeDefaults(defaultSiteSettings, setting?.value));
  return parsed.success ? parsed.data : defaultSiteSettings;
}

export async function upsertHubProfile(input: {
  type: HubType;
  slug: string;
  title?: string;
  intro?: string;
  contentHtml?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  socialImageUrl?: string;
  noIndex?: boolean;
}) {
  const slug = normalizeSlug(input.slug);

  return prisma.hubProfile.upsert({
    where: {
      type_slug: {
        type: input.type,
        slug
      }
    },
    update: {
      title: input.title?.trim() || null,
      intro: input.intro?.trim() || null,
      contentHtml: input.contentHtml ? sanitizeHtml(input.contentHtml) : null,
      seoTitle: input.seoTitle?.trim() || null,
      seoDescription: input.seoDescription?.trim() || null,
      canonicalUrl: input.canonicalUrl?.trim() || null,
      socialImageUrl: input.socialImageUrl?.trim() || null,
      noIndex: Boolean(input.noIndex)
    },
    create: {
      type: input.type,
      slug,
      title: input.title?.trim() || null,
      intro: input.intro?.trim() || null,
      contentHtml: input.contentHtml ? sanitizeHtml(input.contentHtml) : null,
      seoTitle: input.seoTitle?.trim() || null,
      seoDescription: input.seoDescription?.trim() || null,
      canonicalUrl: input.canonicalUrl?.trim() || null,
      socialImageUrl: input.socialImageUrl?.trim() || null,
      noIndex: Boolean(input.noIndex)
    }
  });
}
