import { getCompanyHubBySlug, getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";
import { buildCompanyListingSeo, getCompanyJobsPath, getVagasEmpresaPath } from "@/lib/seo/jobs-pages";
import { shouldIndexPage } from "@/lib/seo/indexing";
import { buildSiteMetadata } from "@/lib/seo/metadata";

export type CompanyJobsListingVariant = "legacy" | "vagas-hub";

export async function resolveCompanyJobsPageMetadata(input: {
  companySlug: string;
  searchParams: Record<string, string | string[] | undefined>;
  variant: CompanyJobsListingVariant;
}) {
  const raw = input.searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const company = await getCompanyHubBySlug(input.companySlug);
  const pathname =
    input.variant === "vagas-hub" ? getVagasEmpresaPath(input.companySlug) : getCompanyJobsPath(input.companySlug);

  if (!company) {
    return buildSiteMetadata({
      title: "Empresa nao encontrada",
      description: "A pagina de empresa solicitada nao foi encontrada.",
      pathname,
      noIndex: true
    });
  }

  const jobs = await getJobsList({
    companySlug: company.slug,
    order: parsed.order,
    page: parsed.page
  });

  const seo = buildCompanyListingSeo({
    companyName: company.name,
    companySlug: company.slug,
    totalJobs: jobs.total
  });

  const shouldIndex = shouldIndexPage({
    kind: "company-listing",
    totalJobs: jobs.total,
    hasSpecificMetadata: true,
    hasOwnContent: true,
    internalLinkCount: 5
  });

  return buildSiteMetadata({
    title: seo.title,
    description: seo.description,
    pathname: seo.canonicalPath,
    canonicalUrl: seo.canonicalPath,
    noIndex: parsed.page > 1 || (parsed.order ?? "relevance") !== "relevance" || !shouldIndex,
    socialImageUrl: company.socialImageUrl || company.logoUrl || undefined
  });
}
