import type { APIRoute } from "astro";
import { auditLogs, cities, createDatabase, states } from "@es/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../../lib/auth";
import { adminJsonError, adminJsonOk, adminMethodNotAllowed } from "../../../../../lib/admin-api-response";
import { slugify } from "../../../../../lib/slug";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  stateId: z.string().uuid()
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "settings.manage")) return adminJsonError("Sem permissão.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco indisponível.", 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJsonError("JSON inválido.", 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return adminJsonError("Dados inválidos.", 400);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [state] = await connection.db.select().from(states).where(eq(states.id, parsed.data.stateId)).limit(1);
    if (!state) return adminJsonError("UF inválida.", 409);

    const [duplicate] = await connection.db
      .select({ id: cities.id })
      .from(cities)
      .where(and(eq(cities.stateId, state.id), eq(cities.normalizedName, normalize(parsed.data.name))))
      .limit(1);
    if (duplicate) {
      return adminJsonOk({ id: duplicate.id, name: parsed.data.name, stateId: state.id, existing: true });
    }

    const baseSlug = slugify(parsed.data.name);
    let slug = baseSlug;
    let suffix = 2;
    while (true) {
      const [existing] = await connection.db
        .select({ id: cities.id })
        .from(cities)
        .where(and(eq(cities.stateId, state.id), eq(cities.slug, slug)))
        .limit(1);
      if (!existing) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const [city] = await connection.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(cities)
        .values({
          name: parsed.data.name,
          normalizedName: normalize(parsed.data.name),
          slug,
          stateId: state.id,
          active: true
        })
        .returning();
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "CREATE",
        entityType: "CITY",
        entityId: created!.id,
        after: created,
        origin: "ADMIN"
      });
      return [created];
    });

    if (!city) return adminJsonError("Não foi possível criar a cidade.", 500);
    return adminJsonOk({ id: city.id, name: city.name, stateId: state.id });
  } finally {
    await connection.close();
  }
};
