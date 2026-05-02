import { notFound } from "next/navigation";

import { CompanyJobsListing } from "@/components/vagas/company-jobs-listing";
import { JobDetailView } from "@/components/vagas/job-detail-view";
import { JobUnavailableView } from "@/components/vagas/job-unavailable-view";
import { isJobPastPublicDeadline } from "@/lib/jobs/job-expiry";
import { resolvePublicJobTitle } from "@/lib/jobs/job-title";
import { resolveCompanyJobsPageMetadata } from "@/lib/seo/company-jobs-metadata";
import { JobBreadcrumbJsonLd } from "@/components/vagas/job-breadcrumb-json-ld";
import { JobPostingJsonLd } from "@/components/vagas/job-posting-json-ld";
import { buildJobDetailSeo } from "@/lib/seo/jobs-pages";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getJobBySlug } from "@/lib/repositories/jobs";
import { isRemovedJobSlug } from "@/lib/seo/removed-job-slugs";
import { JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS } from "@/lib/seo/vagas-job-path";
import { getSiteSettings } from "@/lib/site-settings";

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
      notFound();
    }

    if (!job.isActive || isJobPastPublicDeadline(job)) {
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
    const settings = await getSiteSettings();
    const siteBrandName = settings.siteName.trim();
    const metadata = await buildSiteMetadata({
      title: job.seoTitle ?? seo.title,
      description: job.seoDescription ?? seo.description,
      pathname: `/vagas/${job.slug}`,
      canonicalUrl: seo.canonicalPath,
      noIndex: false,
      socialImageUrl: job.heroImageUrl || job.company?.socialImageUrl || job.companyLogoUrl || undefined
    });

    metadata.publisher = siteBrandName;
    metadata.applicationName = siteBrandName;
    if (metadata.openGraph) {
      metadata.openGraph.siteName = siteBrandName;
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
      notFound();
    }

    if (!job.isActive || isJobPastPublicDeadline(job)) {
      notFound();
    }

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

    const jobPostingInput = {
      id: job.id,
      externalId: job.externalId,
      displayTitle,
      summary: job.summary,
      descriptionHtml: job.descriptionHtml,
      slug: job.slug,
      companyName: job.companyName,
      companyLogoUrl: job.company?.logoUrl ?? job.companyLogoUrl,
      companyWebsiteUrl: job.company?.websiteUrl ?? job.companyWebsiteUrl,
      sourceUrl: job.sourceUrl,
      cityName: job.city?.name ?? cityName,
      citySlug,
      stateCode: job.state?.code ?? stateCode,
      stateName,
      locationType: job.locationType,
      publishedAt: job.publishedAt,
      updatedAt: job.updatedAt,
      expiresAt: job.expiresAt,
      validThrough: job.validThrough ?? null,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      workHours: job.workHours,
      countryCode: "BR",
      employmentType: job.employmentType,
      applyUrl: job.applyUrl
    };

    const breadcrumbItems = [
      { name: "Home", path: "/" },
      { name: "Vagas", path: "/vagas" },
      { name: safeString(displayTitle, "Vaga"), path: `/vagas/${job.slug}` }
    ];

    return (
      <main id="conteudo-principal-vaga" className="min-w-0">
        <JobPostingJsonLd input={jobPostingInput} />
        <JobBreadcrumbJsonLd items={breadcrumbItems} />
        <JobDetailView job={job} displayTitle={displayTitle} />
      </main>
    );
  }

  if (segments[0] === "empresa" && segments.length === 2) {
    return <CompanyJobsListing companySlug={segments[1]} searchParams={rawSearch} variant="vagas-hub" />;
  }

  notFound();
}
