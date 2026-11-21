import type { APIRoute } from "astro";
import { cities, createDatabase, jobs, states } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonOk, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { resolveUniqueJobSlug } from "../../../../lib/job-slug";

const querySchema = z.object({
  title: z.string().trim().min(3).max(160),
  cityId: z.string().uuid().optional(),
  stateId: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(180)
    .optional()
});

export const POST: APIRoute = () => adminMethodNotAllowed("GET");

export const GET: APIRoute = async ({ url, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "jobs.create")) return adminJsonError("Sem permissão.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco indisponível.", 503);

  const parsed = querySchema.safeParse({
    title: url.searchParams.get("title") ?? "",
    cityId: url.searchParams.get("cityId") ?? undefined,
    stateId: url.searchParams.get("stateId") ?? undefined,
    slug: url.searchParams.get("slug") ?? undefined
  });
  if (!parsed.success) return adminJsonError("Parâmetros inválidos.", 400);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    let cityName: string | undefined;
    let stateCode: string | undefined;

    if (parsed.data.cityId) {
      const [city] = await connection.db.select({ name: cities.name }).from(cities).where(eq(cities.id, parsed.data.cityId)).limit(1);
      cityName = city?.name;
    }
    if (parsed.data.stateId) {
      const [state] = await connection.db.select({ code: states.code }).from(states).where(eq(states.id, parsed.data.stateId)).limit(1);
      stateCode = state?.code;
    }

    const suggested = await resolveUniqueJobSlug(
      connection.db,
      parsed.data.title,
      cityName,
      stateCode
    );

    const customSlug = parsed.data.slug;
    let available = true;
    if (customSlug) {
      const [existing] = await connection.db
        .select({ id: jobs.id })
        .from(jobs)
        .where(eq(jobs.slug, customSlug))
        .limit(1);
      available = !existing;
    }

    return adminJsonOk({
      suggested,
      available: customSlug ? available : true,
      previewUrl: `/vagas/${customSlug && available ? customSlug : suggested}`
    });
  } finally {
    await connection.close();
  }
};
