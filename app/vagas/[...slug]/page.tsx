import { notFound } from "next/navigation";

import { CompanyJobsListing } from "@/components/vagas/company-jobs-listing";
import { JobDetailView } from "@/components/vagas/job-detail-view";
import { JobUnavailableView } from "@/components/vagas/job-unavailable-view";
import { isJobPastPublicDeadline } from "@/lib/jobs/job-expiry";
import { resolvePublicJobTitle } from "@/lib/jobs/job-title";
import { resolveCompanyJobsPageMetadata } from "@/lib/seo/company-jobs-metadata";
import { buildJobPublisherName } from "@/lib/seo/job-publisher";
import { buildJobDetailSeo } from "@/lib/seo/jobs-pages";
import { buildBreadcrumbJsonLd, buildJobPostingJsonLd, stringifyJobPostingJsonLd, stringifyJsonLdSafe } from "@/lib/seo/json-ld";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { sendDebugLog } from "@/lib/perf/debug-log";
import { getJobBySlug } from "@/lib/repositories/jobs";
import { isRemovedJobSlug } from "@/lib/seo/removed-job-slugs";
import { JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS } from "@/lib/seo/vagas-job-path";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 1800;

function safeString(value: unknown, fallback: string) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const startedAt = Date.now();
  const { slug: segments } = await params;
  const rawSearch = await searchParams;

  if (!segments?.length) {
    // #region agent log
    sendDebugLog({
      runId: "perf-audit",
      hypothesisId: "H9",
      location: "app/vagas/[...slug]/page.tsx",
      message: "job metadata fallback path",
      data: { elapsedMs: Date.now() - startedAt }
    });
    // #endregion
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
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
        body: JSON.stringify({
          sessionId: "582712",
          runId: "metadata",
          hypothesisId: "H_META",
          location: "app/vagas/[...slug]/page.tsx",
          message: "metadata notFound slug inexistente",
          data: { slug: jobSlug },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      notFound();
    }

    if (!job.isActive || isJobPastPublicDeadline(job)) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
        body: JSON.stringify({
          sessionId: "582712",
          runId: "metadata",
          hypothesisId: "H_META",
          location: "app/vagas/[...slug]/page.tsx",
          message: "metadata notFound vaga inativa ou vencida",
          data: { slug: job.slug, isActive: job.isActive },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      notFound();
    }

    const displayTitle = resolvePublicJobTitle({
      title: job.title,
      seoTitle: job.seoTitle,
      cityName: job.city.name,
      stateCode: job.state.code
    });

    const seo = buildJobDetailSeo({
      title: displayTitle,
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
      noIndex: false,
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
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
        body: JSON.stringify({
          sessionId: "582712",
          runId: "page",
          hypothesisId: "H404",
          location: "app/vagas/[...slug]/page.tsx",
          message: "pagina vaga notFound slug inexistente",
          data: { slug: segments[0] },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      notFound();
    }

    if (!job.isActive || isJobPastPublicDeadline(job)) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
        body: JSON.stringify({
          sessionId: "582712",
          runId: "page",
          hypothesisId: "H410",
          location: "app/vagas/[...slug]/page.tsx",
          message: "pagina vaga notFound inativa ou vencida",
          data: { slug: job.slug, isActive: job.isActive },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      notFound();
    }

    const requirements = Array.isArray(job.requirements) ? job.requirements : [];
    const benefits = Array.isArray(job.benefits) ? job.benefits : [];
    const cityName = safeString(job.city?.name, "Brasil");
    const citySlug = safeString(job.city?.slug, "brasil");
    const stateCode = safeString(job.state?.code, "BR");
    const stateName = safeString(job.state?.name, "Brasil");
    const displayTitle = resolvePublicJobTitle({
      title: job.title,
      seoTitle: job.seoTitle,
      cityName: job.city?.name ?? cityName,
      stateCode: job.state?.code ?? stateCode
    });

    let jobPostingScript: string | null = null;
    try {
      const jobPostingLd = await buildJobPostingJsonLd({
        id: job.id,
        externalId: job.externalId,
        displayTitle,
        summary: job.summary,
        descriptionHtml: job.descriptionHtml,
        slug: job.slug,
        companyName: job.companyName,
        cityName: job.city?.name ?? cityName,
        citySlug,
        stateCode: job.state?.code ?? stateCode,
        stateName,
        locationType: job.locationType,
        publishedAt: job.publishedAt,
        expiresAt: job.expiresAt,
        validThrough: job.validThrough ?? null,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        requirements,
        benefits,
        workHours: job.workHours,
        countryCode: "BR",
        employmentType: job.employmentType,
        applyUrl: job.applyUrl
      });

      jobPostingScript = jobPostingLd ? stringifyJobPostingJsonLd(jobPostingLd) : null;
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
        body: JSON.stringify({
          sessionId: "582712",
          runId: "page",
          hypothesisId: "H_LD_ERR",
          location: "app/vagas/[...slug]/page.tsx",
          message: "falha ao montar JobPosting JSON-LD",
          data: { slug: job.slug, err: error instanceof Error ? error.message : "unknown" },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      jobPostingScript = null;
    }

    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Vagas", path: "/vagas" },
      { name: safeString(displayTitle, "Vaga"), path: `/vagas/${job.slug}` }
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
          { "@type": "ListItem", position: 3, name: safeString(displayTitle, "Vaga"), item: absoluteUrl(`/vagas/${job.slug}`) }
        ]
      });
    }

    return (
      <>
        {jobPostingScript ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingScript }} /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbScript }} />
        <JobDetailView job={job} displayTitle={displayTitle} />
      </>
    );
  }

  if (segments[0] === "empresa" && segments.length === 2) {
    return <CompanyJobsListing companySlug={segments[1]} searchParams={rawSearch} variant="vagas-hub" />;
  }

  notFound();
}
