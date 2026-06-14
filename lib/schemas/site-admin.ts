import { z } from "zod";

import { empregoSaoLuisSiteContent } from "@/lib/emprego-sao-luis-site-content";

const navItemSchema = z.object({
  href: z.string(),
  label: z.string()
});

const contentCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconKey: z.string()
});

const actionCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  href: z.string(),
  iconKey: z.string()
});

const ctaSchema = z.object({
  label: z.string(),
  href: z.string()
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const hubCopySchema = z.object({
  introTemplate: z.string(),
  faqTitle: z.string(),
  faqDescription: z.string(),
  faq: z.array(faqSchema)
});

const featuredCollectionSchema = z.object({
  stateSlugs: z.array(z.string()),
  citySlugs: z.array(z.string()),
  companySlugs: z.array(z.string()),
  postSlugs: z.array(z.string()),
  jobSlugs: z.array(z.string())
});

const blockToggleSchema = z.object({
  quickAccess: z.boolean(),
  featuredJobs: z.boolean(),
  blog: z.boolean(),
  howItWorks: z.boolean(),
  citiesAndBenefits: z.boolean(),
  careerCtas: z.boolean(),
  companies: z.boolean(),
  faq: z.boolean(),
  finalCta: z.boolean()
});

export const homeBlockKeys = [
  "quickAccess",
  "featuredJobs",
  "blog",
  "howItWorks",
  "citiesAndBenefits",
  "careerCtas",
  "companies",
  "faq",
  "finalCta"
] as const;

const homeBlockOrderSchema = z.array(z.enum(homeBlockKeys));

const pageContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  contentHtml: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string()
});

const consentBannerSchema = z.object({
  bannerEnabled: z.boolean(),
  title: z.string(),
  description: z.string(),
  policyHref: z.string(),
  acceptLabel: z.string(),
  rejectLabel: z.string(),
  manageLabel: z.string(),
  analyticsLabel: z.string(),
  advertisingLabel: z.string()
});

const googleIntegrationsSchema = z.object({
  consentModeEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  ga4MeasurementId: z.string(),
  gtmContainerId: z.string(),
  searchConsoleVerification: z.string(),
  searchConsolePropertyUrl: z.string(),
  adsenseEnabled: z.boolean(),
  adsensePublisherId: z.string(),
  adsenseAutoAds: z.boolean(),
  adsTxtContent: z.string(),
  lookerStudioUrl: z.string(),
  ga4ReportsUrl: z.string(),
  searchConsoleReportsUrl: z.string()
});

export const siteContentSchema = z.object({
  navigation: z.object({
    topBarText: z.string(),
    topBarLinkLabel: z.string(),
    topBarLinkHref: z.string(),
    headerCtaLabel: z.string(),
    headerCtaHref: z.string(),
    main: z.array(navItemSchema)
  }),
  home: z.object({
    heroBadge: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    searchHelperText: z.string(),
    primaryButton: ctaSchema,
    secondaryButton: ctaSchema,
    quickJobsEyebrow: z.string(),
    quickJobsTitle: z.string(),
    quickJobsDescription: z.string(),
    quickBlogEyebrow: z.string(),
    quickBlogTitle: z.string(),
    quickBlogDescription: z.string(),
    heroHighlights: z.array(actionCardSchema),
    featuredTitle: z.string(),
    featuredDescription: z.string(),
    blogTitle: z.string(),
    blogDescription: z.string(),
    citiesTitle: z.string(),
    citiesDescription: z.string(),
    benefitsTitle: z.string(),
    benefitsDescription: z.string(),
    companiesTitle: z.string(),
    companiesDescription: z.string(),
    faqTitle: z.string(),
    faqDescription: z.string(),
    finalCtaEyebrow: z.string(),
    finalCtaTitle: z.string(),
    finalCtaDescription: z.string(),
    blocks: blockToggleSchema,
    blockOrder: homeBlockOrderSchema,
    featured: featuredCollectionSchema,
    howItWorksSteps: z.array(contentCardSchema),
    benefits: z.array(contentCardSchema),
    careerCtas: z.array(actionCardSchema)
  }),
  faq: z.object({
    home: z.array(faqSchema)
  }),
  hubContent: z.object({
    state: hubCopySchema,
    city: hubCopySchema,
    company: hubCopySchema
  }),
  pages: z.object({
    about: pageContentSchema,
    contact: pageContentSchema,
    privacy: pageContentSchema,
    cookies: pageContentSchema,
    terms: pageContentSchema
  }),
  footer: z.object({
    navigationTitle: z.string(),
    informationTitle: z.string(),
    shortcutsTitle: z.string(),
    description: z.string(),
    copyrightText: z.string(),
    shortcuts: z.array(contentCardSchema)
  })
});

const socialLinksSchema = z.object({
  instagram: z.string(),
  facebook: z.string(),
  linkedin: z.string(),
  youtube: z.string(),
  tiktok: z.string()
});

export const siteSettingsSchema = z.object({
  siteName: z.string(),
  legalName: z.string(),
  shortDescription: z.string(),
  logoUrl: z.string(),
  logoCompactUrl: z.string(),
  faviconUrl: z.string(),
  defaultSocialImageUrl: z.string(),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  socialLinks: socialLinksSchema,
  defaultOgAlt: z.string(),
  supportText: z.string(),
  consentBanner: consentBannerSchema,
  google: googleIntegrationsSchema
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteFaqEntry = z.infer<typeof faqSchema>;

export const defaultSiteContent: SiteContent = empregoSaoLuisSiteContent;

export const defaultSiteSettings: SiteSettings = {
  siteName: "Emprego São Luís",
  legalName: "Emprego São Luís",
  shortDescription:
    "Encontre vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão. Oportunidades atualizadas para diversas áreas.",
  logoUrl: "/logo-horizontal.png",
  logoCompactUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  defaultSocialImageUrl: "/og-image.jpg",
  email: "contato@empregossaoluis.com.br",
  phone: "",
  whatsapp: "",
  socialLinks: {
    instagram: "https://instagram.com/empregosaoluis",
    facebook: "",
    linkedin: "",
    youtube: "",
    tiktok: ""
  },
  defaultOgAlt: "Emprego São Luís - Vagas em São Luís e Maranhão",
  supportText: "Use os canais desta página para relatar erros, pedir atualização de informações ou falar com a equipe do Emprego São Luís.",
  consentBanner: {
    bannerEnabled: true,
    title: "Este site utiliza cookies",
    description:
      "Usamos cookies necessários para o portal funcionar e, quando você autoriza, recursos de medição e publicidade para entender o desempenho das páginas.",
    policyHref: "/cookies",
    acceptLabel: "Aceitar",
    rejectLabel: "Recusar",
    manageLabel: "Gerenciar preferencias",
    analyticsLabel: "Cookies analiticos",
    advertisingLabel: "Cookies de marketing"
  },
  google: {
    consentModeEnabled: true,
    analyticsEnabled: false,
    ga4MeasurementId: "",
    gtmContainerId: "",
    searchConsoleVerification: "",
    searchConsolePropertyUrl: "",
    adsenseEnabled: false,
    adsensePublisherId: "",
    adsenseAutoAds: false,
    adsTxtContent: "",
    lookerStudioUrl: "",
    ga4ReportsUrl: "",
    searchConsoleReportsUrl: ""
  }
};
