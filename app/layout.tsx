import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { ConsentBootstrap } from "@/components/analytics/consent-bootstrap";
import { SiteIntegrations } from "@/components/analytics/site-integrations";
import { buildJobPostingJsonLd, buildOrganizationJsonLd, buildWebsiteJsonLd, stringifyJsonLdSafe } from "@/lib/seo/json-ld";
import { getPublicJobSlugFromPathname } from "@/lib/seo/vagas-job-path";
import { getJobBySlug } from "@/lib/repositories/jobs";
import { siteConfig } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import { normalizeAdsensePublisherId, normalizeSearchConsoleVerification } from "@/lib/google";
import { CONSENT_COOKIE_NAME } from "@/lib/consent";
import { absoluteUrl } from "@/lib/utils";
import { getSiteOrigin } from "@/lib/site-url";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
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
  const headersList = await headers();
  const section = headersList.get("x-app-section");
  const isAdminSection = section === "admin";
  const pathname = headersList.get("x-pathname");
  const settings = await getSiteSettings();
  const adsensePublisherId = normalizeAdsensePublisherId(settings.google.adsensePublisherId) ?? "ca-pub-4279201625870524";
  const initialConsentValue = (await cookies()).get(CONSENT_COOKIE_NAME)?.value ?? null;

  let jobPostingJsonLd: string | null = null;
  if (!isAdminSection && pathname) {
    const jobSlug = getPublicJobSlugFromPathname(pathname);
    if (jobSlug) {
      const job = await getJobBySlug(jobSlug);
      if (job?.isActive) {
        const requirements = Array.isArray(job.requirements) ? job.requirements : [];
        const benefits = Array.isArray(job.benefits) ? job.benefits : [];
        jobPostingJsonLd = stringifyJsonLdSafe(
          await buildJobPostingJsonLd({
            id: job.id,
            externalId: job.externalId,
            seoTitle: job.seoTitle,
            title: job.title,
            summary: job.summary,
            descriptionHtml: job.descriptionHtml,
            slug: job.slug,
            companyName: job.companyName,
            companyLogoUrl: job.company?.logoUrl ?? job.companyLogoUrl,
            companyWebsiteUrl: job.company?.websiteUrl ?? job.companyWebsiteUrl,
            companySlug: job.company?.slug ?? undefined,
            cityName: job.city.name,
            citySlug: job.city.slug,
            stateCode: job.state.code,
            stateName: job.state.name,
            locationType: job.locationType,
            publishedAt: job.publishedAt.toISOString(),
            expiresAt: job.expiresAt?.toISOString() ?? null,
            validThrough: job.validThrough?.toISOString() ?? null,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            requirements,
            benefits,
            countryCode: "BR"
          })
        );
      }
    }
  }

  return (
    <html lang="pt-BR">
      <head>
        {jobPostingJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingJsonLd }} /> : null}
        {isAdminSection ? null : (
          <>
            <meta name="google-adsense-account" content={adsensePublisherId} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
        {isAdminSection ? null : (
          <script
            id="adsense-auto-ads-bootstrap"
            dangerouslySetInnerHTML={{
              __html: `(window.adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: "${adsensePublisherId}", enable_page_level_ads: true });`
            }}
          />
        )}
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden">
        <ConsentBootstrap />
        <JsonLd data={buildOrganizationJsonLd({ name: settings.legalName || settings.siteName, logoUrl: settings.logoUrl })} />
        <JsonLd data={buildWebsiteJsonLd({ name: settings.siteName })} />
        {isAdminSection ? null : <SiteHeader />}
        <main>{children}</main>
        {isAdminSection ? null : <SiteFooter />}
        {isAdminSection ? null : (
          <SiteIntegrations consentBanner={settings.consentBanner} google={settings.google} initialConsentValue={initialConsentValue} />
        )}
      </body>
    </html>
  );
}
