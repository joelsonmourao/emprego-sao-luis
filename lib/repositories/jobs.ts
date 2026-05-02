import { unstable_cache } from "next/cache";
import type { EmploymentType, Prisma } from "@prisma/client";

import { markExpiredJobsInactive } from "@/lib/jobs/job-expiry";
import { prisma } from "@/lib/db";
import { pagination } from "@/lib/constants";
import { PUBLIC_JOBS_CACHE_TAG } from "@/lib/public-revalidate";

/** Full job graph for detalhe da vaga, JSON-LD e admin. */
const jobDetailInclude = {
  city: true,
  state: true,
  company: true
} satisfies Prisma.JobInclude;

/**
 * Campos enxutos para cards e listagens (evita descriptionHtml, requirements, benefits, etc.).
 */
export const jobListingSelect = {
  id: true,
  slug: true,
  title: true,
  companyName: true,
  companyLogoUrl: true,
  summary: true,
  publishedAt: true,
  applyUrl: true,
  locationType: true,
  featured: true,
  employmentType: true,
  salaryMin: true,
  salaryMax: true,
  city: { select: { name: true, slug: true } },
  state: { select: { code: true, slug: true, name: true } },
  company: { select: { slug: true, name: true } }
} satisfies Prisma.JobSelect;

export type JobListingPayload = Prisma.JobGetPayload<{ select: typeof jobListingSelect }>;

const companyHubListSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  websiteUrl: true,
  summary: true,
  socialImageUrl: true,
  seoTitle: true,
  seoDescription: true,
  featured: true,
  city: { select: { name: true, slug: true } },
  state: { select: { name: true, code: true, slug: true } },
  _count: {
    select: {
      jobs: {
        where: { isActive: true }
      }
    }
  }
} satisfies Prisma.CompanySelect;

async function fetchFeaturedJobs() {
  await markExpiredJobsInactive();
  return prisma.job.findMany({
    where: { isActive: true, featured: true },
    select: jobListingSelect,
    orderBy: [{ publishedAt: "desc" }],
    take: 6
  });
}

export const getFeaturedJobs = unstable_cache(fetchFeaturedJobs, ["featured-jobs-v1"], {
  revalidate: 600,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

const getJobsBySlugsCached = unstable_cache(async (slugKey: string) => {
  await markExpiredJobsInactive();
  const slugs = JSON.parse(slugKey) as string[];
  if (!slugs.length) return [];

  const items = await prisma.job.findMany({
    where: {
      isActive: true,
      slug: { in: slugs }
    },
    select: jobListingSelect
  });

  const map = new Map(items.map((item) => [item.slug, item]));
  return slugs.map((slug) => map.get(slug)).filter((item): item is JobListingPayload => Boolean(item));
}, ["jobs-by-slugs-v1"], {
  revalidate: 1800,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getJobsBySlugs(slugs: string[]) {
  if (!slugs.length) return [];
  return getJobsBySlugsCached(JSON.stringify(slugs));
}

async function fetchRecentJobs() {
  await markExpiredJobsInactive();
  return prisma.job.findMany({
    where: { isActive: true },
    select: jobListingSelect,
    orderBy: [{ publishedAt: "desc" }],
    take: 12
  });
}

export const getRecentJobs = unstable_cache(fetchRecentJobs, ["recent-jobs-v1"], {
  revalidate: 600,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export const getJobBySlug = unstable_cache(async (slug: string) => {
  return prisma.job.findUnique({
    where: { slug },
    include: jobDetailInclude
  });
}, ["job-by-slug-v1"], {
  revalidate: 2700,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

function jobsListCacheKey(params: {
  query?: string;
  stateSlug?: string;
  citySlug?: string;
  companySlug?: string;
  companyName?: string;
  employmentType?: EmploymentType;
  order?: "relevance" | "date";
  page?: number;
}) {
  return JSON.stringify({
    query: params.query ?? null,
    stateSlug: params.stateSlug ?? null,
    citySlug: params.citySlug ?? null,
    companySlug: params.companySlug ?? null,
    companyName: params.companyName ?? null,
    employmentType: params.employmentType ?? null,
    order: params.order ?? "relevance",
    page: params.page ?? 1
  });
}

const getJobsListCached = unstable_cache(async (key: string) => {
  await markExpiredJobsInactive();
  const params = JSON.parse(key) as {
    query?: string;
    stateSlug?: string;
    citySlug?: string;
    companySlug?: string;
    companyName?: string;
    employmentType?: EmploymentType;
    order?: "relevance" | "date";
    page?: number;
  };

  const page = params.page ?? 1;
  const order = params.order ?? "relevance";

  const where: Prisma.JobWhereInput = {
    isActive: true,
    ...(params.query
      ? {
          OR: [
            { title: { contains: params.query, mode: "insensitive" } },
            { companyName: { contains: params.query, mode: "insensitive" } },
            { summary: { contains: params.query, mode: "insensitive" } },
            { city: { name: { contains: params.query, mode: "insensitive" } } },
            { state: { name: { contains: params.query, mode: "insensitive" } } }
          ]
        }
      : {}),
    ...(params.stateSlug ? { state: { slug: params.stateSlug } } : {}),
    ...(params.citySlug ? { city: { slug: params.citySlug } } : {}),
    ...(params.companySlug ? { company: { slug: params.companySlug } } : {}),
    ...(params.companyName
      ? {
          company: {
            name: {
              equals: params.companyName,
              mode: "insensitive"
            }
          }
        }
      : {}),
    ...(params.employmentType ? { employmentType: params.employmentType } : {})
  };

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: jobListingSelect,
      orderBy: order === "relevance" ? [{ featured: "desc" }, { publishedAt: "desc" }] : [{ publishedAt: "desc" }],
      take: pagination.jobsPerPage,
      skip: (page - 1) * pagination.jobsPerPage
    }),
    prisma.job.count({ where })
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pagination.jobsPerPage))
  };
}, ["jobs-list-v1"], {
  revalidate: 600,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

const getJobsListCachedWithPerf = unstable_cache(async (key: string) => {
  const result = await getJobsListCached(key);
  return result;
}, ["jobs-list-perf-v1"], {
  revalidate: 600,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getJobsList(params: {
  query?: string;
  stateSlug?: string;
  citySlug?: string;
  companySlug?: string;
  companyName?: string;
  employmentType?: EmploymentType;
  order?: "relevance" | "date";
  page?: number;
}) {
  return getJobsListCachedWithPerf(jobsListCacheKey(params));
}

async function fetchFeaturedCompanies() {
  return prisma.company.findMany({
    where: { isActive: true },
    select: companyHubListSelect,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: 8
  });
}

export const getFeaturedCompanies = unstable_cache(fetchFeaturedCompanies, ["featured-companies-v1"], {
  revalidate: 1200,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

const getFeaturedCompaniesBySlugsCached = unstable_cache(async (slugKey: string) => {
  const slugs = JSON.parse(slugKey) as string[];
  if (!slugs.length) return [];

  const companies = await prisma.company.findMany({
    where: {
      isActive: true,
      slug: { in: slugs }
    },
    select: companyHubListSelect
  });

  const map = new Map(companies.map((company) => [company.slug, company]));
  return slugs.map((slug) => map.get(slug)).filter((item): item is (typeof companies)[number] => Boolean(item));
}, ["featured-companies-by-slugs-v1"], {
  revalidate: 1800,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getFeaturedCompaniesBySlugs(slugs: string[]) {
  if (!slugs.length) return [];
  return getFeaturedCompaniesBySlugsCached(JSON.stringify(slugs));
}

const getRelatedJobsCached = unstable_cache(async (key: string) => {
  await markExpiredJobsInactive();
  const params = JSON.parse(key) as {
    excludeSlug?: string;
    citySlug?: string;
    stateSlug?: string;
    companySlug?: string;
    limit?: number;
  };

  const orFilters: Prisma.JobWhereInput[] = [];
  if (params.citySlug) orFilters.push({ city: { slug: params.citySlug } });
  if (params.stateSlug) orFilters.push({ state: { slug: params.stateSlug } });
  if (params.companySlug) orFilters.push({ company: { slug: params.companySlug } });

  if (!orFilters.length) {
    return [];
  }

  const related = await prisma.job.findMany({
    where: {
      isActive: true,
      ...(params.excludeSlug ? { slug: { not: params.excludeSlug } } : {}),
      OR: orFilters
    },
    select: jobListingSelect,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: params.limit ?? 6
  });

  return related;
}, ["related-jobs-v1"], {
  revalidate: 1800,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getRelatedJobs(params: {
  excludeSlug?: string;
  citySlug?: string;
  stateSlug?: string;
  companySlug?: string;
  limit?: number;
}) {
  return getRelatedJobsCached(
    JSON.stringify({
      excludeSlug: params.excludeSlug ?? null,
      citySlug: params.citySlug ?? null,
      stateSlug: params.stateSlug ?? null,
      companySlug: params.companySlug ?? null,
      limit: params.limit ?? 6
    })
  );
}

async function fetchCompanyHubsMapped() {
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    select: companyHubListSelect,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    websiteUrl: company.websiteUrl,
    summary: company.summary,
    socialImageUrl: company.socialImageUrl,
    seoTitle: company.seoTitle,
    seoDescription: company.seoDescription,
    cityName: company.city.name,
    citySlug: company.city.slug,
    stateName: company.state.name,
    stateCode: company.state.code,
    stateSlug: company.state.slug,
    count: company._count.jobs,
    featured: company.featured
  }));
}

export const getCompanyHubs = unstable_cache(fetchCompanyHubsMapped, ["company-hubs-v1"], {
  revalidate: 1200,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

const getCompanyHubsByStateCached = unstable_cache(async (stateSlug: string, limit: number) => {
  const companies = await prisma.company.findMany({
    where: { isActive: true, state: { slug: stateSlug } },
    select: companyHubListSelect,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: limit
  });

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    websiteUrl: company.websiteUrl,
    summary: company.summary,
    socialImageUrl: company.socialImageUrl,
    seoTitle: company.seoTitle,
    seoDescription: company.seoDescription,
    cityName: company.city.name,
    citySlug: company.city.slug,
    stateName: company.state.name,
    stateCode: company.state.code,
    stateSlug: company.state.slug,
    count: company._count.jobs,
    featured: company.featured
  }));
}, ["company-hubs-state-v1"], {
  revalidate: 1800,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getCompanyHubsByState(stateSlug: string, limit = 8) {
  return getCompanyHubsByStateCached(stateSlug, limit);
}

const getCompanyHubsByCityCached = unstable_cache(async (citySlug: string, limit: number) => {
  const companies = await prisma.company.findMany({
    where: { isActive: true, city: { slug: citySlug } },
    select: companyHubListSelect,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: limit
  });

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    websiteUrl: company.websiteUrl,
    summary: company.summary,
    socialImageUrl: company.socialImageUrl,
    seoTitle: company.seoTitle,
    seoDescription: company.seoDescription,
    cityName: company.city.name,
    citySlug: company.city.slug,
    stateName: company.state.name,
    stateCode: company.state.code,
    stateSlug: company.state.slug,
    count: company._count.jobs,
    featured: company.featured
  }));
}, ["company-hubs-city-v1"], {
  revalidate: 1800,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getCompanyHubsByCity(citySlug: string, limit = 8) {
  return getCompanyHubsByCityCached(citySlug, limit);
}

const getCompanyHubBySlugCached = unstable_cache(async (slug: string) => {
  return prisma.company.findUnique({
    where: { slug },
    select: companyHubListSelect
  });
}, ["company-hub-by-slug-v1"], {
  revalidate: 1200,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getCompanyHubBySlug(slug: string) {
  return getCompanyHubBySlugCached(slug);
}

export const getCompanyEntries = unstable_cache(async () => {
  return prisma.company.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true
    },
    orderBy: [{ updatedAt: "desc" }]
  });
}, ["company-sitemap-entries-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export const getAllActiveJobEntries = unstable_cache(async () => {
  await markExpiredJobsInactive();
  return prisma.job.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      employmentType: true,
      city: {
        select: {
          slug: true,
          name: true
        }
      },
      state: {
        select: {
          slug: true,
          name: true,
          code: true
        }
      }
    },
    orderBy: [{ updatedAt: "desc" }]
  });
}, ["active-job-sitemap-entries-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_JOBS_CACHE_TAG]
});

export async function getCompanyAdminOptions() {
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      city: { select: { name: true, slug: true } },
      state: { select: { code: true, slug: true } }
    },
    orderBy: [{ name: "asc" }]
  });

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    label: `${company.name} - ${company.city.name}, ${company.state.code}`,
    stateSlug: company.state.slug,
    citySlug: company.city.slug
  }));
}
