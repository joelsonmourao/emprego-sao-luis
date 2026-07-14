import type { APIRoute } from "astro";
import { articles, auditLogs, authors, createDatabase } from "@es/db";
import { and, count, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { adminJsonError, adminJsonRedirect } from "../../../../lib/admin-api-response";
import { can } from "../../../../lib/auth";
import { logServerError } from "../../../../lib/server-error";
import { slugify } from "../../../../lib/slug";

const schema = z.object({
  action: z.enum(["UPDATE", "DELETE"]),
  name: z.string().trim().min(2).max(120).optional(),
  slug: z.string().trim().max(140).optional(),
  bio: z.string().trim().max(2_000).optional(),
  avatarUrl: z.union([z.string().trim().url(), z.literal("")]).optional()
});

export const POST: APIRoute = async ({ params, request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return adminJsonError("Sem permissão para alterar autores.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Autor ou banco inválido.", 400);

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return adminJsonError("Dados do autor inválidos.", 422, { details: parsed.error.issues.map((issue) => issue.message) });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [before] = await connection.db.select().from(authors).where(eq(authors.id, params.id)).limit(1);
    if (!before) return adminJsonError("Autor não encontrado.", 404);

    if (parsed.data.action === "DELETE") {
      const [usage] = await connection.db.select({ value: count() }).from(articles).where(eq(articles.authorId, before.id));
      if ((usage?.value ?? 0) > 0) {
        return adminJsonError("O autor possui conteúdos vinculados e não pode ser excluído.", 409, {
          code: "AUTHOR_IN_USE",
          usage: usage?.value ?? 0
        });
      }
      await connection.db.transaction(async (tx) => {
        await tx.delete(authors).where(eq(authors.id, before.id));
        await tx.insert(auditLogs).values({ actorId: auth.id, action: "DELETE", entityType: "AUTHOR", entityId: before.id, before, origin: "ADMIN" });
      });
      return adminJsonRedirect("/admin/conteudo?author=deleted");
    }

    const name = parsed.data.name ?? before.name;
    const slug = slugify(parsed.data.slug || name);
    if (!slug) return adminJsonError("Slug do autor inválido.", 422);
    const [duplicate] = await connection.db.select({ id: authors.id }).from(authors).where(and(eq(authors.slug, slug), ne(authors.id, before.id))).limit(1);
    if (duplicate) return adminJsonError("Já existe outro autor com este slug.", 409, { code: "AUTHOR_SLUG_EXISTS" });

    const [after] = await connection.db.update(authors).set({
      name,
      slug,
      bio: parsed.data.bio ?? before.bio,
      avatarUrl: parsed.data.avatarUrl === undefined ? before.avatarUrl : parsed.data.avatarUrl || null,
      updatedAt: new Date()
    }).where(eq(authors.id, before.id)).returning();
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "UPDATE", entityType: "AUTHOR", entityId: before.id, before, after, origin: "ADMIN" });
    return adminJsonRedirect(`/admin/conteudo?author=${before.id}&updated=1`, { author: after });
  } catch (error) {
    logServerError("route:/api/admin/authors/:id", error, { userId: auth.id, entity: "AUTHOR" });
    return adminJsonError("Não foi possível alterar o autor.", 500);
  } finally {
    await connection.close();
  }
};
