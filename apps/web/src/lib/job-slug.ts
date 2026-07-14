import { and, eq, ne } from "drizzle-orm";
import type { createDatabase } from "@es/db";
import { jobs } from "@es/db";
import { slugify, suggestJobSlug } from "./slug";

type Db = ReturnType<typeof createDatabase>["db"];

export async function resolveUniqueJobSlug(
  db: Db,
  title: string,
  cityName?: string,
  stateCode?: string,
  excludeJobId?: string
) {
  const base = suggestJobSlug(title, cityName, stateCode);
  let candidate = base;
  let suffix = 2;

  while (await slugTaken(db, candidate, excludeJobId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function resolveRequestedJobSlug(
  db: Db,
  requestedSlug: string,
  title: string,
  cityName?: string,
  stateCode?: string,
  excludeJobId?: string
) {
  const base = slugify(requestedSlug) || suggestJobSlug(title, cityName, stateCode);
  let candidate = base;
  let suffix = 2;
  while (await slugTaken(db, candidate, excludeJobId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function slugTaken(db: Db, slug: string, excludeJobId?: string) {
  const condition = excludeJobId ? and(eq(jobs.slug, slug), ne(jobs.id, excludeJobId)) : eq(jobs.slug, slug);
  const [row] = await db.select({ id: jobs.id }).from(jobs).where(condition).limit(1);
  return Boolean(row);
}

export { slugify, suggestJobSlug };
