import { and, desc, eq, gt, ne, sql } from "drizzle-orm";
import { categories, cities, companies, createDatabase, jobs, neighborhoods, states } from "@es/db";

export async function listPublishedJobs(limit = 24) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return await connection.db.select().from(jobs).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date()))).orderBy(desc(jobs.publishedAt)).limit(limit);
  } finally { await connection.close(); }
}

export async function findPublishedJob(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [job] = await connection.db
      .select({
        job: jobs,
        companyName: sql<string>`case when ${jobs.confidentialCompany} then 'Empresa confidencial' else coalesce(${companies.publicName}, ${companies.name}) end`,
        companySlug: sql<string>`case when ${jobs.confidentialCompany} then '' else ${companies.slug} end`,
        companyWebsiteUrl: sql<string | null>`case when ${jobs.confidentialCompany} then null else ${companies.websiteUrl} end`,
        companyLogoUrl: sql<string | null>`case when ${jobs.confidentialCompany} then null else ${companies.logoUrl} end`,
        cityName: cities.name,
        citySlug: cities.slug,
        stateCode: states.code,
        neighborhoodName: neighborhoods.name,
        categoryName: categories.name,
        categorySlug: categories.slug
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(cities, eq(jobs.cityId, cities.id))
      .innerJoin(states, eq(jobs.stateId, states.id))
      .leftJoin(neighborhoods, eq(jobs.neighborhoodId, neighborhoods.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(and(eq(jobs.slug, slug), eq(jobs.publicationStatus, "PUBLISHED")))
      .limit(1);
    return job ?? null;
  } finally { await connection.close(); }
}

export async function listRelatedJobs(input: { jobId: string; companyId: string; categoryId: string | null; cityId: string; limit?: number }) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const active = and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date()), ne(jobs.id, input.jobId));
    const fields = {
      id: jobs.id,
      title: jobs.normalizedTitle,
      slug: jobs.slug,
      code: jobs.publicCode,
      company: sql<string>`case when ${jobs.confidentialCompany} then 'Empresa confidencial' else coalesce(${companies.publicName}, ${companies.name}) end`,
      city: cities.name,
      state: states.code,
      workplace: jobs.workplaceType,
      contract: jobs.employmentType,
      publishedAt: jobs.publishedAt
    };
    const byCompany = await connection.db.select(fields).from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id)).innerJoin(cities, eq(jobs.cityId, cities.id)).innerJoin(states, eq(jobs.stateId, states.id)).where(and(active, eq(jobs.companyId, input.companyId))).orderBy(desc(jobs.publishedAt)).limit(input.limit ?? 4);
    if (byCompany.length >= (input.limit ?? 4)) return byCompany;
    const remaining = (input.limit ?? 4) - byCompany.length;
    const related = input.categoryId
      ? await connection.db.select(fields).from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id)).innerJoin(cities, eq(jobs.cityId, cities.id)).innerJoin(states, eq(jobs.stateId, states.id)).where(and(active, eq(jobs.categoryId, input.categoryId), eq(jobs.cityId, input.cityId))).orderBy(desc(jobs.publishedAt)).limit(remaining)
      : [];
    return [...byCompany, ...related].slice(0, input.limit ?? 4);
  } finally { await connection.close(); }
}
