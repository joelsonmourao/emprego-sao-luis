import { z } from "zod";

const contentTypeSeoSchema = z.object({
  titleSuffix: z.string().default(""),
  descriptionTemplate: z.string().default(""),
  robots: z.string().default("index,follow")
});

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().min(1).default("Empregos São Luís"),
  defaultDescription: z.string().min(1).default("Vagas verificadas em São Luís e no Maranhão."),
  robotsDefault: z.string().default("index,follow"),
  og: z.object({
    siteName: z.string().default("Empregos São Luís"),
    type: z.string().default("website"),
    image: z.string().default(""),
    locale: z.string().default("pt_BR")
  }),
  twitter: z.object({
    card: z.string().default("summary_large_image"),
    site: z.string().default(""),
    creator: z.string().default("")
  }),
  organization: z.object({
    name: z.string().default("Empregos São Luís"),
    url: z.string().default(""),
    logo: z.string().default(""),
    sameAs: z.array(z.string()).default([])
  }),
  contentTypes: z.object({
    jobs: contentTypeSeoSchema,
    news: contentTypeSeoSchema,
    blog: contentTypeSeoSchema,
    companies: contentTypeSeoSchema,
    cities: contentTypeSeoSchema,
    categories: contentTypeSeoSchema
  }),
  instagram: z.object({
    profileUrl: z.string().default("https://www.instagram.com/empregosaoluis/"),
    bioLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([
      { label: "Todas as vagas", href: "/vagas" },
      { label: "Notícias e guias", href: "/blog" },
      { label: "Publicar vaga", href: "/publicar-vaga" }
    ])
  })
});

export type SeoSettings = z.infer<typeof seoSettingsSchema>;

export const defaultSeoSettings: SeoSettings = {
  defaultTitle: "Empregos São Luís",
  defaultDescription: "Vagas verificadas em São Luís e no Maranhão.",
  robotsDefault: "index,follow",
  og: { siteName: "Empregos São Luís", type: "website", image: "", locale: "pt_BR" },
  twitter: { card: "summary_large_image", site: "", creator: "" },
  organization: { name: "Empregos São Luís", url: "", logo: "", sameAs: [] },
  contentTypes: {
    jobs: { titleSuffix: "", descriptionTemplate: "", robots: "index,follow" },
    news: { titleSuffix: "", descriptionTemplate: "", robots: "index,follow" },
    blog: { titleSuffix: "", descriptionTemplate: "", robots: "index,follow" },
    companies: { titleSuffix: "", descriptionTemplate: "", robots: "index,follow" },
    cities: { titleSuffix: "", descriptionTemplate: "", robots: "index,follow" },
    categories: { titleSuffix: "", descriptionTemplate: "", robots: "index,follow" }
  },
  instagram: {
    profileUrl: "https://www.instagram.com/empregosaoluis/",
    bioLinks: [
      { label: "Todas as vagas", href: "/vagas" },
      { label: "Notícias e guias", href: "/blog" },
      { label: "Publicar vaga", href: "/publicar-vaga" }
    ]
  }
};

export function mergeSeoSettings(input: unknown): SeoSettings {
  const base = defaultSeoSettings;
  if (!input || typeof input !== "object") return base;
  return seoSettingsSchema.parse({ ...base, ...input, og: { ...base.og, ...(input as SeoSettings).og }, twitter: { ...base.twitter, ...(input as SeoSettings).twitter }, organization: { ...base.organization, ...(input as SeoSettings).organization }, contentTypes: { ...base.contentTypes, ...(input as SeoSettings).contentTypes }, instagram: { ...base.instagram, ...(input as SeoSettings).instagram } });
}
