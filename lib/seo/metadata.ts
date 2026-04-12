import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { absoluteUrl } from "@/lib/utils";

type BuildMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  socialImageUrl?: string;
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(input.canonicalUrl || input.pathname);
  const socialImage = absoluteUrl(input.socialImageUrl || "/brand-logo.svg");

  return {
    title: input.title,
    description: input.description,
    keywords: [...siteConfig.keywords],
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: input.title,
      description: input.description,
      locale: "pt_BR",
      siteName: siteConfig.name,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [socialImage]
    },
    robots: input.noIndex
      ? {
          index: false,
          follow: true
        }
      : {
          index: true,
          follow: true
        }
  };
}

export async function buildSiteMetadata(input: BuildMetadataInput): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || siteConfig.name;
  const canonical = absoluteUrl(input.canonicalUrl || input.pathname);
  const socialImage = absoluteUrl(input.socialImageUrl || settings.defaultSocialImageUrl || "/brand-logo.svg");

  return {
    title: input.title,
    description: input.description,
    keywords: [...siteConfig.keywords],
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: input.title,
      description: input.description,
      locale: "pt_BR",
      siteName,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: settings.defaultOgAlt || siteName
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [socialImage]
    },
    robots: input.noIndex
      ? {
          index: false,
          follow: true
        }
      : {
          index: true,
          follow: true
        },
    applicationName: siteName
  };
}
