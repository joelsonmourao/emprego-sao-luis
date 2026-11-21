import type { SeoSettings } from "./settings.js";

export function buildOrganizationSchema(settings: SeoSettings, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.organization.name,
    url: settings.organization.url || siteUrl,
    ...(settings.organization.logo
      ? {
          logo: {
            "@type": "ImageObject",
            url: settings.organization.logo,
            caption: settings.organization.logoAlt
          }
        }
      : {}),
    ...(settings.publicContacts.email || settings.publicContacts.phone
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              ...(settings.publicContacts.email ? { email: settings.publicContacts.email } : {}),
              ...(settings.publicContacts.phone ? { telephone: settings.publicContacts.phone } : {}),
              contactType: "customer support",
              availableLanguage: ["pt-BR"]
            }
          ]
        }
      : {}),
    ...(settings.organization.sameAs.length ? { sameAs: settings.organization.sameAs } : {})
  };
}

export function buildWebSiteSchema(settings: SeoSettings, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.defaultTitle,
    url: siteUrl,
    publisher: { "@type": "Organization", name: settings.organization.name }
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildOpenGraphTags(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}) {
  return {
    "og:title": input.title,
    "og:description": input.description,
    "og:url": input.url,
    "og:type": input.type ?? "website",
    "og:site_name": input.siteName ?? "Empregos São Luís",
    "og:locale": input.locale ?? "pt_BR",
    ...(input.image ? { "og:image": input.image } : {})
  };
}

export function buildTwitterTags(input: {
  title: string;
  description: string;
  card?: string;
  site?: string;
  creator?: string;
  image?: string;
}) {
  return {
    "twitter:card": input.card ?? "summary_large_image",
    "twitter:title": input.title,
    "twitter:description": input.description,
    ...(input.site ? { "twitter:site": input.site } : {}),
    ...(input.creator ? { "twitter:creator": input.creator } : {}),
    ...(input.image ? { "twitter:image": input.image } : {})
  };
}
