import { z } from "zod";

const contentTypeSeoSchema = z.object({
  titleSuffix: z.string().default(""),
  descriptionTemplate: z.string().default(""),
  robots: z.string().default("index,follow")
});

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().min(1).default("Empregos São Luís"),
  defaultDescription: z.string().min(1).default("Vagas SLZ e empregos verificados em São Luís e no Maranhão."),
  canonicalDomain: z.string().default("https://empregossaoluis.com.br"),
  language: z.string().default("pt-BR"),
  titleSuffix: z.string().default("Empregos São Luís"),
  themeColor: z.string().default("#b42318"),
  defaultOgImageAlt: z.string().default("Empregos São Luís"),
  robotsDefault: z.string().default("index,follow"),
  verifications: z.object({ google: z.string().default(""), bing: z.string().default("") }),
  publicContacts: z.object({
    email: z.string().default(""),
    phone: z.string().default(""),
    whatsapp: z.string().default("")
  }),
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
    logoAlt: z.string().default("Logo do Empregos São Luís"),
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
  canonicalDomain: "https://empregossaoluis.com.br",
  language: "pt-BR",
  titleSuffix: "Empregos São Luís",
  themeColor: "#b42318",
  defaultOgImageAlt: "Empregos São Luís",
  robotsDefault: "index,follow",
  verifications: { google: "", bing: "" },
  publicContacts: { email: "", phone: "", whatsapp: "" },
  og: { siteName: "Empregos São Luís", type: "website", image: "", locale: "pt_BR" },
  twitter: { card: "summary_large_image", site: "", creator: "" },
  organization: {
    name: "Empregos São Luís",
    url: "",
    logo: "",
    logoAlt: "Logo do Empregos São Luís",
    sameAs: []
  },
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
  return seoSettingsSchema.parse({
    ...base,
    ...input,
    verifications: { ...base.verifications, ...(input as SeoSettings).verifications },
    publicContacts: { ...base.publicContacts, ...(input as SeoSettings).publicContacts },
    og: { ...base.og, ...(input as SeoSettings).og },
    twitter: { ...base.twitter, ...(input as SeoSettings).twitter },
    organization: { ...base.organization, ...(input as SeoSettings).organization },
    contentTypes: { ...base.contentTypes, ...(input as SeoSettings).contentTypes },
    instagram: { ...base.instagram, ...(input as SeoSettings).instagram }
  });
}
