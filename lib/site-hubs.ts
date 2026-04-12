import { cache } from "react";
import { z } from "zod";

import { prisma } from "@/lib/db";

const companyProfileSchema = z.object({
  slug: z.string(),
  name: z.string(),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  intro: z.string().default(""),
  socialImageUrl: z.string().default(""),
  noIndex: z.boolean().default(false)
});

const companyProfilesSchema = z.record(z.string(), companyProfileSchema);

export type CompanyProfile = z.infer<typeof companyProfileSchema>;

export const getCompanyProfiles = cache(async (): Promise<Record<string, CompanyProfile>> => {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "company_profiles" }
  });

  if (!setting) {
    return {};
  }

  const parsed = companyProfilesSchema.safeParse(setting.value);
  return parsed.success ? parsed.data : {};
});

export const companyProfilesInputSchema = companyProfilesSchema;
