import type { EmploymentType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { pagination } from "@/lib/constants";
import { slugify } from "@/lib/utils";

const jobInclude = {
  city: true,
  state: true,
  company: true
} satisfies Prisma.JobInclude;

export async function getFeaturedJobs() {
  return prisma.job.findMany({
    where: { isActive: true, featured: true },
    include: jobInclude,
    orderBy: [{ publishedAt: "desc" }],
    take: 6
  });
}

export async function getJobsBySlugs(slugs: string[]) {
  if (!slugs.length) return [];

  const items = await prisma.job.findMany({
    where: {
      isActive: true,
      slug: { in: slugs }
    },
    include: jobInclude
  });

  const map = new Map(items.map((item) => [item.slug, item]));
  return slugs.map((slug) => map.get(slug)).filter((item): item is (typeof items)[number] => Boolean(item));
}

export async function getRecentJobs() {
  return prisma.job.findMany({
    where: { isActive: true },
    include: jobInclude,
    orderBy: [{ publishedAt: "desc" }],
    take: 12
  });
}

export async function getJobBySlug(slug: string) {
  return prisma.job.findUnique({
    where: { slug },
    include: jobInclude
  });
}

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
      include: jobInclude,
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
}

export async function getFeaturedCompanies() {
  return prisma.company.findMany({
    where: { isActive: true },
    include: {
      city: true,
      state: true,
      _count: {
        select: {
          jobs: {
            where: {
              isActive: true
            }
          }
        }
      }
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: 8
  });
}

export async function getFeaturedCompaniesBySlugs(slugs: string[]) {
  if (!slugs.length) return [];

  const companies = await prisma.company.findMany({
    where: {
      isActive: true,
      slug: { in: slugs }
    },
    include: {
      city: true,
      state: true,
      _count: {
        select: {
          jobs: {
            where: {
              isActive: true
            }
          }
        }
      }
    }
  });

  const map = new Map(companies.map((company) => [company.slug, company]));
  return slugs.map((slug) => map.get(slug)).filter((item): item is (typeof companies)[number] => Boolean(item));
}

export async function getRelatedJobs(params: {
  excludeSlug?: string;
  citySlug?: string;
  stateSlug?: string;
  companySlug?: string;
  limit?: number;
}) {
  const related = await prisma.job.findMany({
    where: {
      isActive: true,
      ...(params.excludeSlug ? { slug: { not: params.excludeSlug } } : {}),
      OR: [
        ...(params.citySlug ? [{ city: { slug: params.citySlug } }] : []),
        ...(params.stateSlug ? [{ state: { slug: params.stateSlug } }] : []),
        ...(params.companySlug ? [{ company: { slug: params.companySlug } }] : [])
      ]
    },
    include: jobInclude,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: params.limit ?? 6
  });

  return related;
}

export async function getCompanyHubs() {
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    include: {
      city: true,
      state: true,
      _count: {
        select: {
          jobs: {
            where: { isActive: true }
          }
        }
      }
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    websiteUrl: company.websiteUrl,
    summary: company.summary,
    descriptionHtml: company.descriptionHtml,
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

export async function getCompanyHubBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      city: true,
      state: true,
      _count: {
        select: {
          jobs: {
            where: { isActive: true }
          }
        }
      }
    }
  });
}

export async function getCompanyEntries() {
  return prisma.company.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true
    },
    orderBy: [{ updatedAt: "desc" }]
  });
}

export async function getAllActiveJobEntries() {
  return prisma.job.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      title: true,
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
}

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
