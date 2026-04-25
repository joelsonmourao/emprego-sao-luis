import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicChrome } from "@/components/public-chrome";
import { JsonLd } from "@/components/json-ld";
import { ConsentBootstrap } from "@/components/analytics/consent-bootstrap";
import { SiteIntegrations } from "@/components/analytics/site-integrations";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { normalizeAdsensePublisherId, normalizeSearchConsoleVerification } from "@/lib/google";
import { absoluteUrl } from "@/lib/utils";
import { getSiteOrigin } from "@/lib/site-url";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

/** Evita pré-render estático no build (menos transferência Neon em cada deploy). */
export const revalidate = 3600;

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
  const settings = await getSiteSettings();
  const adsensePublisherId = normalizeAdsensePublisherId(settings.google.adsensePublisherId) ?? "ca-pub-4279201625870524";

  return (
    <html lang="pt-BR">
      <head>
        <meta name="google-adsense-account" content={adsensePublisherId} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
        />
        <script
          id="adsense-auto-ads-bootstrap"
          dangerouslySetInnerHTML={{
            __html: `(window.adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: "${adsensePublisherId}", enable_page_level_ads: true });`
          }}
        />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden">
        <ConsentBootstrap />
        <JsonLd data={buildOrganizationJsonLd({ name: settings.legalName || settings.siteName, logoUrl: settings.logoUrl })} />
        <JsonLd data={buildWebsiteJsonLd({ name: settings.siteName })} />
        <Suspense fallback={null}>
          <PublicChrome
            header={<SiteHeader />}
            footer={<SiteFooter />}
            integrations={<SiteIntegrations consentBanner={settings.consentBanner} google={settings.google} initialConsentValue={null} />}
          >
            {children}
          </PublicChrome>
        </Suspense>
      </body>
    </html>
  );
}
