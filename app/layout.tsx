import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { ConsentBootstrap } from "@/components/analytics/consent-bootstrap";
import { SiteIntegrations } from "@/components/analytics/site-integrations";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { normalizeSearchConsoleVerification } from "@/lib/google";
import { CONSENT_COOKIE_NAME } from "@/lib/consent";
import { absoluteUrl } from "@/lib/utils";
import { getSiteOrigin } from "@/lib/site-url";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(getSiteOrigin()),
    title: {
      default: `${settings.siteName} | Vagas e dicas para o primeiro emprego`,
      template: `%s | ${settings.siteName}`
    },
    description: settings.shortDescription || siteConfig.description,
    applicationName: settings.siteName,
    icons: {
      icon: [settings.faviconUrl],
      shortcut: [settings.faviconUrl],
      apple: [settings.logoCompactUrl]
    },
    other: {
      "theme-color": "#1A2B4C"
    },
    verification: settings.google.searchConsoleVerification
      ? {
          google: normalizeSearchConsoleVerification(settings.google.searchConsoleVerification)
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: absoluteUrl("/"),
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.shortDescription || siteConfig.description,
      images: [
        {
          url: absoluteUrl(settings.defaultSocialImageUrl),
          width: 1200,
          height: 630,
          alt: settings.defaultOgAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.shortDescription || siteConfig.description,
      images: [absoluteUrl(settings.defaultSocialImageUrl)]
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const section = (await headers()).get("x-app-section");
  const isAdminSection = section === "admin";
  const settings = await getSiteSettings();
  const initialConsentValue = (await cookies()).get(CONSENT_COOKIE_NAME)?.value ?? null;

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden">
        <ConsentBootstrap />
        <JsonLd data={buildOrganizationJsonLd({ name: settings.legalName || settings.siteName, logoUrl: settings.logoUrl })} />
        <JsonLd data={buildWebsiteJsonLd({ name: settings.siteName })} />
        {isAdminSection ? null : <SiteHeader />}
        <main>{children}</main>
        {isAdminSection ? null : <SiteFooter />}
        {isAdminSection ? null : <SiteIntegrations consentBanner={settings.consentBanner} google={settings.google} initialConsentValue={initialConsentValue} />}
      </body>
    </html>
  );
}
