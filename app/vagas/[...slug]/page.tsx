import { notFound } from "next/navigation";

import { CompanyJobsListing } from "@/components/vagas/company-jobs-listing";
import { JobDetailView } from "@/components/vagas/job-detail-view";
import { JobUnavailableView } from "@/components/vagas/job-unavailable-view";
import { resolveCompanyJobsPageMetadata } from "@/lib/seo/company-jobs-metadata";
import { buildJobPublisherName } from "@/lib/seo/job-publisher";
import { buildJobDetailSeo } from "@/lib/seo/jobs-pages";
import { buildBreadcrumbJsonLd, buildJobPostingJsonLd, stringifyJobPostingJsonLd, stringifyJsonLdSafe } from "@/lib/seo/json-ld";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getJobBySlug, getRelatedJobs } from "@/lib/repositories/jobs";
import { isRemovedJobSlug } from "@/lib/seo/removed-job-slugs";
import { JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS } from "@/lib/seo/vagas-job-path";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 1;

function toValidDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIso(value: unknown, fallbackIso: string) {
  return toValidDate(value)?.toISOString() ?? fallbackIso;
}

function safeString(value: unknown, fallback: string) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function isJobExpired(job: Awaited<ReturnType<typeof getJobBySlug>>) {
  if (!job) return false;
  const refDate = job.validThrough ?? job.expiresAt;
  if (!refDate) return false;
  return new Date(refDate).getTime() < Date.now();
}

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
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "bb2dcd" },
        body: JSON.stringify({
          sessionId: "bb2dcd",
          runId: "post-fix",
          hypothesisId: "H8",
          location: "app/vagas/[...slug]/page.tsx",
          message: "metadata-level notFound for missing job slug",
          data: { slug: jobSlug },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      notFound();
    }

    if (!job.isActive) {
      const isExpired = isJobExpired(job);
      return buildSiteMetadata({
        title: isExpired ? "Vaga encerrada" : "Vaga indisponível",
        description: isExpired
          ? "Esta vaga foi encerrada, mas você pode continuar sua busca por vagas relacionadas."
          : "Esta vaga não está mais disponível. Confira oportunidades atualizadas.",
        pathname: `/vagas/${job.slug}`,
        canonicalUrl: `/vagas/${job.slug}`,
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
    const requestedSlug = segments[0];
    if (isRemovedJobSlug(requestedSlug)) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "bb2dcd" },
        body: JSON.stringify({
          sessionId: "bb2dcd",
          runId: "post-fix",
          hypothesisId: "H7",
          location: "app/vagas/[...slug]/page.tsx",
          message: "removed slug matched",
          data: { slug: requestedSlug },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      return (
        <JobUnavailableView
          title="Vaga removida definitivamente"
          description="Esta vaga foi removida em definitivo. Veja vagas atuais por cidade e estado."
          relatedJobs={[]}
        />
      );
    }

    const job = await getJobBySlug(segments[0]);
    if (!job) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "bb2dcd" },
        body: JSON.stringify({
          sessionId: "bb2dcd",
          runId: "pre-fix",
          hypothesisId: "H1",
          location: "app/vagas/[...slug]/page.tsx",
          message: "job slug not found path",
          data: { slug: segments[0] },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      notFound();
    }

    if (!job.isActive) {
      const relatedJobs = await getRelatedJobs({
        excludeSlug: job.slug,
        citySlug: job.city?.slug,
        stateSlug: job.state?.slug,
        companySlug: job.company?.slug,
        limit: 6
      });
      const expired = isJobExpired(job);

      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "bb2dcd" },
        body: JSON.stringify({
          sessionId: "bb2dcd",
          runId: "post-fix",
          hypothesisId: "H2",
          location: "app/vagas/[...slug]/page.tsx",
          message: "inactive job rendered as unavailable page",
          data: { slug: job.slug, expired, hasRelated: relatedJobs.length > 0 },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

      return (
        <JobUnavailableView
          title={expired ? "Vaga encerrada" : "Vaga indisponível"}
          description={
            expired
              ? "Esta vaga foi encerrada e não aceita mais candidaturas. Ainda assim, você pode aproveitar os links abaixo para encontrar vagas parecidas."
              : "Esta vaga não está mais disponível. Use as sugestões para encontrar oportunidades atualizadas."
          }
          citySlug={job.city?.slug}
          stateSlug={job.state?.slug}
          relatedJobs={relatedJobs}
        />
      );
    }

    const requirements = Array.isArray(job.requirements) ? job.requirements : [];
    const benefits = Array.isArray(job.benefits) ? job.benefits : [];
    const cityName = safeString(job.city?.name, "Brasil");
    const citySlug = safeString(job.city?.slug, "brasil");
    const stateCode = safeString(job.state?.code, "BR");
    const stateName = safeString(job.state?.name, "Brasil");
    const publisherDisplayName = buildJobPublisherName(cityName, stateCode);
    const nowIso = new Date().toISOString();
    const publishedAtIso = toIso(job.publishedAt, nowIso);
    const expiresAtIso = toValidDate(job.expiresAt)?.toISOString() ?? null;
    const validThroughIso = toValidDate(job.validThrough)?.toISOString() ?? null;
    const effectiveValidThroughIso = toIso(job.validThrough ?? job.expiresAt ?? job.publishedAt, publishedAtIso);

    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "bb2dcd" },
      body: JSON.stringify({
        sessionId: "bb2dcd",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "app/vagas/[...slug]/page.tsx",
        message: "job detail status snapshot",
        data: {
          slug: job.slug,
          isActive: job.isActive,
          publishedAtType: typeof job.publishedAt,
          hasPublishedAtIso: Boolean(publishedAtIso),
          expiresAtIso,
          validThroughIso,
          cityName,
          stateCode
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

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
        cityName,
        citySlug,
        stateCode,
        stateName,
        locationType: job.locationType,
        publishedAt: publishedAtIso,
        expiresAt: expiresAtIso,
        validThrough: validThroughIso,
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
        datePosted: publishedAtIso,
        validThrough: effectiveValidThroughIso,
        employmentType: ["PART_TIME"],
        hiringOrganization: {
          "@type": "Organization",
          name: job.companyName
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: cityName,
            addressRegion: stateCode,
            addressCountry: "BR"
          }
        },
        url: absoluteUrl(`/vagas/${job.slug}`)
      });
    }

    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Vagas", path: "/vagas" },
      { name: safeString(job.title, "Vaga"), path: `/vagas/${job.slug}` }
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
          { "@type": "ListItem", position: 3, name: safeString(job.title, "Vaga"), item: absoluteUrl(`/vagas/${job.slug}`) }
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
