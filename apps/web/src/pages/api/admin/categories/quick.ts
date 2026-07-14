import type { APIRoute } from "astro";
import { auditLogs, categories, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonOk, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { slugify } from "../../../../lib/slug";

const schema = z.object({
  name: z.string().trim().min(2).max(120)
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return adminJsonError("Sem permissão.", 403);
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
    const baseSlug = slugify(parsed.data.name);
    let slug = baseSlug;
    let suffix = 2;
    while (true) {
      const [existing] = await connection.db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
      if (!existing) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const [category] = await connection.db.transaction(async (tx) => {
      const [created] = await tx.insert(categories).values({ name: parsed.data.name, slug, active: true }).returning();
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "CREATE",
        entityType: "CATEGORY",
        entityId: created!.id,
        after: { record: created, ip: clientAddress, quick: true },
        origin: "ADMIN"
      });
      return [created];
    });

    if (!category) return adminJsonError("Não foi possível criar a categoria.", 500);
    return adminJsonOk({ id: category.id, name: category.name, slug: category.slug });
  } finally {
    await connection.close();
  }
};
