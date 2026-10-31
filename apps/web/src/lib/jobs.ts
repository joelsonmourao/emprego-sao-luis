import { and, desc, eq, gt, ilike, inArray, ne, notInArray, sql } from "drizzle-orm";
import { categories, cities, companies, createDatabase, jobs, neighborhoods, states } from "@es/db";

export async function listPublishedJobs(limit = 24) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return await connection.db
      .select()
      .from(jobs)
      .where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date())))
      .orderBy(desc(jobs.publishedAt))
      .limit(limit);
  } finally {
    await connection.close();
  }
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
        companyWebsiteUrl: sql<
          string | null
        >`case when ${jobs.confidentialCompany} then null else ${companies.websiteUrl} end`,
        companyLogoUrl: sql<
          string | null
        >`case when ${jobs.confidentialCompany} then null else ${companies.logoUrl} end`,
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
      .where(
        and(
          eq(jobs.slug, slug),
          inArray(jobs.publicationStatus, ["PUBLISHED", "PAUSED", "EXPIRED", "CLOSED"])
        )
      )
      .limit(1);
    return job ?? null;
  } finally {
    await connection.close();
  }
}

function titleKeyword(title: string | null | undefined) {
  const token = String(title ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .find((part) => part.length >= 4);
  return token || null;
}

type RelatedJob = {
  id: string;
  title: string;
  slug: string;
  company: string;
  city: string;
  state: string;
  workplace: string;
  contract: string | null;
  publishedAt: Date | null;
  logoUrl: string | null;
};

export async function listRelatedJobs(input: {
  jobId: string;
  companyId: string;
  categoryId: string | null;
  cityId: string;
  title?: string | null;
  limit?: number;
}): Promise<RelatedJob[]> {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  const limit = input.limit ?? 4;
  try {
    const active = and(
      eq(jobs.publicationStatus, "PUBLISHED"),
      gt(jobs.expiresAt, new Date()),
      ne(jobs.id, input.jobId)
    );
    const fields = {
      id: jobs.id,
      title: jobs.normalizedTitle,
      slug: jobs.slug,
      company: sql<string>`case when ${jobs.confidentialCompany} then 'Empresa confidencial' else coalesce(${companies.publicName}, ${companies.name}) end`,
      city: cities.name,
      state: states.code,
      workplace: jobs.workplaceType,
      contract: jobs.employmentType,
      publishedAt: jobs.publishedAt,
      logoUrl: sql<string | null>`case when ${jobs.confidentialCompany} then null else ${companies.logoUrl} end`
    };

    const selectRelated = () =>
      connection.db
        .select(fields)
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(cities, eq(jobs.cityId, cities.id))
        .innerJoin(states, eq(jobs.stateId, states.id));

    const collected: RelatedJob[] = [];
    const pushUnique = (rows: RelatedJob[]) => {
      for (const row of rows) {
        if (collected.some((item) => item.id === row.id)) continue;
        collected.push(row);
        if (collected.length >= limit) break;
      }
    };

    // 1) Mesma cidade
    pushUnique(
      await selectRelated()
        .where(and(active, eq(jobs.cityId, input.cityId)))
        .orderBy(desc(jobs.publishedAt))
        .limit(limit)
    );
    if (collected.length >= limit) return collected.slice(0, limit);

    const remaining = () => limit - collected.length;

    // 2) Mesma função/categoria
    if (input.categoryId) {
      const exclude = [input.jobId, ...collected.map((row) => row.id)];
      pushUnique(
        await selectRelated()
          .where(and(active, eq(jobs.categoryId, input.categoryId), notInArray(jobs.id, exclude)))
          .orderBy(desc(jobs.publishedAt))
          .limit(remaining())
      );
    }
    if (collected.length >= limit) return collected.slice(0, limit);

    // 3) Função aproximada pelo título
    const keyword = titleKeyword(input.title);
    if (keyword) {
      const exclude = [input.jobId, ...collected.map((row) => row.id)];
      pushUnique(
        await selectRelated()
          .where(and(active, ilike(jobs.normalizedTitle, `%${keyword}%`), notInArray(jobs.id, exclude)))
          .orderBy(desc(jobs.publishedAt))
          .limit(remaining())
      );
    }

    return collected.slice(0, limit);
  } finally {
    await connection.close();
  }
}
