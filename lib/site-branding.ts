import { cache } from "react";
import { z } from "zod";

import { prisma } from "@/lib/db";

const socialLinksSchema = z.object({
  instagram: z.string().default(""),
  linkedin: z.string().default(""),
  facebook: z.string().default(""),
  youtube: z.string().default("")
});

const siteBrandingSchema = z.object({
  siteName: z.string(),
  shortDescription: z.string(),
  logoUrl: z.string().default("/brand-logo.svg"),
  faviconUrl: z.string().default("/icon.svg"),
  defaultOgImageUrl: z.string().default("/brand-logo.svg"),
  email: z.string().default(""),
  phone: z.string().default(""),
  whatsapp: z.string().default(""),
  socialLinks: socialLinksSchema
});

export type SiteBranding = z.infer<typeof siteBrandingSchema>;

export const defaultSiteBranding: SiteBranding = {
  siteName: "Jovem Aprendiz Vagas",
  shortDescription: "Vagas e dicas para o primeiro emprego.",
  logoUrl: "/brand-logo.svg",
  faviconUrl: "/icon.svg",
  defaultOgImageUrl: "/brand-logo.svg",
  email: "",
  phone: "",
  whatsapp: "",
  socialLinks: {
    instagram: "",
    linkedin: "",
    facebook: "",
    youtube: ""
  }
};

export const getSiteBranding = cache(async (): Promise<SiteBranding> => {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "site_branding" }
  });

  if (!setting) {
    return defaultSiteBranding;
  }

  const parsed = siteBrandingSchema.safeParse(setting.value);
  return parsed.success ? parsed.data : defaultSiteBranding;
});

export const siteBrandingInputSchema = siteBrandingSchema;
