import { notFound } from "next/navigation";

import { CompanyJobsListing } from "@/components/vagas/company-jobs-listing";
import { JobDetailView } from "@/components/vagas/job-detail-view";
import { resolveCompanyJobsPageMetadata } from "@/lib/seo/company-jobs-metadata";
import { buildJobPublisherName } from "@/lib/seo/job-publisher";
import { buildJobDetailSeo } from "@/lib/seo/jobs-pages";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getJobBySlug } from "@/lib/repositories/jobs";
import { JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS } from "@/lib/seo/vagas-job-path";

export const revalidate = 2700;

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
    return <JobDetailView job={job} />;
  }

  if (segments[0] === "empresa" && segments.length === 2) {
    return <CompanyJobsListing companySlug={segments[1]} searchParams={rawSearch} variant="vagas-hub" />;
  }

  notFound();
}
