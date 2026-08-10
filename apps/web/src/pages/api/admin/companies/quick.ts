import type { APIRoute } from "astro";
import { auditLogs, cities, companies, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zOptionalUrl } from "@es/shared";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonOk, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { slugify } from "../../../../lib/slug";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  publicName: z.string().trim().min(2).max(160).optional(),
  websiteUrl: zOptionalUrl(),
  logoUrl: zOptionalUrl(),
  cityId: z.string().uuid().optional(),
  stateId: z.string().uuid().optional(),
  verified: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true")
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "companies.manage")) return adminJsonError("Sem permissão.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco indisponível.", 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJsonError("JSON inválido.", 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return adminJsonError("Dados inválidos.", 400, { details: parsed.error.issues });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    let cityId = parsed.data.cityId ?? null;
    if (!cityId && parsed.data.stateId) {
      const [fallbackCity] = await connection.db
        .select({ id: cities.id })
        .from(cities)
        .where(eq(cities.stateId, parsed.data.stateId))
        .limit(1);
      cityId = fallbackCity?.id ?? null;
    }

    const displayName = parsed.data.publicName?.trim() || parsed.data.name.trim();
    const baseSlug = slugify(displayName);
    let slug = baseSlug;
    let suffix = 2;
    while (true) {
      const [existing] = await connection.db.select({ id: companies.id }).from(companies).where(eq(companies.slug, slug)).limit(1);
      if (!existing) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const [company] = await connection.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(companies)
        .values({
          name: parsed.data.name.trim(),
          publicName: displayName,
          normalizedName: slugify(parsed.data.name),
          slug,
          cityId,
          websiteUrl: parsed.data.websiteUrl ?? null,
          logoUrl: parsed.data.logoUrl ?? null,
          verifiedAt: parsed.data.verified ? new Date() : null
        })
        .returning();
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "CREATE",
        entityType: "COMPANY",
        entityId: created!.id,
        after: { record: created, ip: clientAddress, userAgent: request.headers.get("user-agent"), quick: true },
        origin: "ADMIN"
      });
      return [created];
    });

    if (!company) return adminJsonError("Não foi possível criar a empresa.", 500);

    return adminJsonOk({ id: company.id, name: company.publicName || company.name, slug: company.slug });
  } finally {
    await connection.close();
  }
};
