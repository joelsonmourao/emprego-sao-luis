import { notFound } from "next/navigation";

import { CompanyJobsListing } from "@/components/vagas/company-jobs-listing";
import { JobDetailView } from "@/components/vagas/job-detail-view";
import { resolveCompanyJobsPageMetadata } from "@/lib/seo/company-jobs-metadata";
import { buildJobPublisherName } from "@/lib/seo/job-publisher";
import { buildJobDetailSeo } from "@/lib/seo/jobs-pages";
import { buildBreadcrumbJsonLd, buildJobPostingJsonLd, stringifyJobPostingJsonLd, stringifyJsonLdSafe } from "@/lib/seo/json-ld";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getJobBySlug } from "@/lib/repositories/jobs";
import { JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS } from "@/lib/seo/vagas-job-path";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 1;

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug: segments } = await params;
  const rawSearch = await searchParams;

  if (!segments?.length) {
    return buildSiteMetadata({
      title: "Vagas",
      description: "Listagem de vagas.",
      pathname: "/vagas",
      noIndex: true
    });
  }

  if (segments.length === 1 && JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    return buildSiteMetadata({
      title: "Página não encontrada",
      description: "Use os links do menu para estado, cidade ou empresa.",
      pathname: `/vagas/${segments[0]}`,
      noIndex: true
    });
  }

  if (segments.length === 1) {
    const jobSlug = segments[0];
    const job = await getJobBySlug(jobSlug);

    if (!job) {
      return buildSiteMetadata({
        title: "Vaga não encontrada",
        description: "A vaga solicitada não foi encontrada.",
        pathname: `/vagas/${jobSlug}`,
        noIndex: true
      });
    }

    const seo = buildJobDetailSeo({
      title: job.title,
      companyName: job.companyName,
      cityName: job.city.name,
      stateCode: job.state.code,
      slug: job.slug
    });
    const publisherDisplayName = buildJobPublisherName(job.city?.name, job.state?.code);
    const metadata = await buildSiteMetadata({
      title: job.seoTitle ?? seo.title,
      description: job.seoDescription ?? seo.description,
      pathname: `/vagas/${job.slug}`,
      canonicalUrl: seo.canonicalPath,
      noIndex: !job.isActive,
      socialImageUrl: job.heroImageUrl || job.company?.socialImageUrl || job.companyLogoUrl || undefined
    });

    metadata.publisher = publisherDisplayName;
    metadata.applicationName = publisherDisplayName;
    if (metadata.openGraph) {
      metadata.openGraph.siteName = publisherDisplayName;
    }

    return metadata;
  }

  if (segments[0] === "empresa" && segments.length === 2) {
    return resolveCompanyJobsPageMetadata({
      companySlug: segments[1],
      searchParams: rawSearch,
      variant: "vagas-hub"
    });
  }

  return buildSiteMetadata({
    title: "Página não encontrada",
    description: "O caminho solicitado não existe.",
    pathname: `/vagas/${segments.join("/")}`,
    noIndex: true
  });
}

export default async function VagasCatchAllPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug: segments } = await params;
  const rawSearch = await searchParams;

  if (!segments?.length) {
    notFound();
  }

  if (segments.length === 1 && JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    notFound();
  }

  if (segments.length === 1) {
    const job = await getJobBySlug(segments[0]);
    if (!job) {
      notFound();
    }

    const requirements = Array.isArray(job.requirements) ? job.requirements : [];
    const benefits = Array.isArray(job.benefits) ? job.benefits : [];
    const publisherDisplayName = buildJobPublisherName(job.city?.name, job.state?.code);

    let jobPostingScript: string | null = null;
    try {
      const jobPostingLd = await buildJobPostingJsonLd({
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
        countryCode: "BR",
        applyUrl: job.applyUrl,
        publisherDisplayName
      });

      jobPostingScript = stringifyJobPostingJsonLd(jobPostingLd);
    } catch (error) {
      void error;
      jobPostingScript = stringifyJsonLdSafe({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        datePosted: job.publishedAt.toISOString(),
        validThrough: (job.validThrough ?? job.expiresAt ?? job.publishedAt).toISOString(),
        employmentType: ["PART_TIME"],
        hiringOrganization: {
          "@type": "Organization",
          name: job.companyName
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city.name,
            addressRegion: job.state.code,
            addressCountry: "BR"
          }
        },
        url: absoluteUrl(`/vagas/${job.slug}`),
        directApply: false
      });
    }

    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Vagas", path: "/vagas" },
      { name: job.title, path: `/vagas/${job.slug}` }
    ]);
    let breadcrumbScript: string;
    try {
      breadcrumbScript = stringifyJsonLdSafe(breadcrumbLd);
    } catch {
      breadcrumbScript = stringifyJsonLdSafe({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Vagas", item: absoluteUrl("/vagas") },
          { "@type": "ListItem", position: 3, name: job.title, item: absoluteUrl(`/vagas/${job.slug}`) }
        ]
      });
    }

    return (
      <>
        {jobPostingScript ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingScript }} /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbScript }} />
        <JobDetailView job={job} />
      </>
    );
  }

  if (segments[0] === "empresa" && segments.length === 2) {
    return <CompanyJobsListing companySlug={segments[1]} searchParams={rawSearch} variant="vagas-hub" />;
  }

  notFound();
}
