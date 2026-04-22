import { CompanyJobsListing } from "@/components/vagas/company-jobs-listing";
import { resolveCompanyJobsPageMetadata } from "@/lib/seo/company-jobs-metadata";

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  return resolveCompanyJobsPageMetadata({
    companySlug: slug,
    searchParams: await searchParams,
    variant: "legacy"
  });
}

export default async function CompanyJobsPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  return <CompanyJobsListing companySlug={slug} searchParams={await searchParams} variant="legacy" />;
}
