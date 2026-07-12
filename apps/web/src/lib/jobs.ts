import { and, desc, eq, gt } from "drizzle-orm";
import { cities, companies, createDatabase, jobs, states } from "@es/db";

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
    const [job] = await connection.db.select({ job: jobs, companyName: companies.name, companyWebsiteUrl: companies.websiteUrl, cityName: cities.name, stateCode: states.code }).from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id)).innerJoin(cities, eq(jobs.cityId, cities.id)).innerJoin(states, eq(jobs.stateId, states.id)).where(and(eq(jobs.slug, slug), eq(jobs.publicationStatus, "PUBLISHED"))).limit(1);
    return job ?? null;
  } finally { await connection.close(); }
}
