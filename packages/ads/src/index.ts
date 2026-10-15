import { z } from "zod";

export const CANDIDATURE_BLOCKED_SLOT_KEYS = new Set([
  "job-after-application",
  "job-before-application",
  "job-apply-area",
  "job-between-title-and-apply"
]);

export const DEFAULT_AD_SLOTS = [
  { key: "home-top", name: "Topo da home", pageType: "home", position: "top", device: "all", sortOrder: 10, reservedHeight: 120 },
  { key: "home-between-sections", name: "Entre seções da home", pageType: "home", position: "between", device: "all", sortOrder: 20, reservedHeight: 280 },
  { key: "jobs-listing", name: "Listagem de vagas", pageType: "jobs", position: "listing", device: "all", sortOrder: 30, reservedHeight: 280 },
  { key: "job-sidebar", name: "Lateral da vaga", pageType: "job", position: "sidebar", device: "all", sortOrder: 40, reservedHeight: 280, exclusionRules: { blockNearCandidature: true } },
  { key: "job-content-mid", name: "Meio do conteúdo da vaga", pageType: "job", position: "content-mid", device: "all", sortOrder: 50, reservedHeight: 280, exclusionRules: { blockNearCandidature: true } },
  { key: "news-listing", name: "Listagem de notícias", pageType: "news", position: "listing", device: "all", sortOrder: 60, reservedHeight: 280 },
  { key: "blog-listing", name: "Listagem do blog", pageType: "blog", position: "listing", device: "all", sortOrder: 70, reservedHeight: 280 },
  { key: "footer", name: "Rodapé", pageType: "global", position: "footer", device: "all", sortOrder: 80, reservedHeight: 120 }
] as const;

export const adSettingsSchema = z.object({
  globalEnabled: z.boolean().default(true),
  adsenseEnabled: z.boolean().default(false),
  adsenseClientId: z.string().default(""),
  consentRequired: z.boolean().default(true),
  allowedPageTypes: z.array(z.string()).default(["home", "jobs", "job", "news", "blog", "global"]),
  blockedPageTypes: z.array(z.string()).default([]),
  blockedSlotKeys: z.array(z.string()).default(Array.from(CANDIDATURE_BLOCKED_SLOT_KEYS))
});

export type AdSettings = z.infer<typeof adSettingsSchema>;

export const defaultAdSettings: AdSettings = {
  globalEnabled: true,
  adsenseEnabled: false,
  adsenseClientId: "",
  consentRequired: true,
  allowedPageTypes: ["home", "jobs", "job", "news", "blog", "global"],
  blockedPageTypes: [],
  blockedSlotKeys: Array.from(CANDIDATURE_BLOCKED_SLOT_KEYS)
};

export function mergeAdSettings(input: unknown): AdSettings {
  if (!input || typeof input !== "object") return defaultAdSettings;
  return adSettingsSchema.parse({ ...defaultAdSettings, ...input });
}

export function isSlotAllowedOnJobPage(slotKey: string) {
  return !CANDIDATURE_BLOCKED_SLOT_KEYS.has(slotKey);
}

export function assertSlotNotNearCandidature(slotKey: string, pageType?: string) {
  if (pageType === "job" && CANDIDATURE_BLOCKED_SLOT_KEYS.has(slotKey)) {
    throw new Error(`O espaço ${slotKey} não pode ser usado em páginas de vaga perto da candidatura.`);
  }
}

export type AdTargeting = {
  citySlug?: string | null;
  categorySlug?: string | null;
  companySlug?: string | null;
  workplaceType?: string | null;
  device?: string | null;
};

export function matchesTargeting(targeting: AdTargeting, context: AdTargeting) {
  if (targeting.citySlug && targeting.citySlug !== context.citySlug) return false;
  if (targeting.categorySlug && targeting.categorySlug !== context.categorySlug) return false;
  if (targeting.companySlug && targeting.companySlug !== context.companySlug) return false;
  if (targeting.workplaceType && targeting.workplaceType !== context.workplaceType) return false;
  if (targeting.device && targeting.device !== "all" && context.device && targeting.device !== context.device) return false;
  return true;
}
