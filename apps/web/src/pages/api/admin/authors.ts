import type { APIRoute } from "astro";
import { auditLogs, authors, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminJsonError, adminJsonOk, adminJsonRedirect } from "../../../lib/admin-api-response";
import { can } from "../../../lib/auth";
import { logServerError } from "../../../lib/server-error";
import { slugify } from "../../../lib/slug";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(140).optional(),
  bio: z.string().trim().max(2_000).optional(),
  avatarUrl: z.union([z.string().trim().url(), z.literal("")]).optional(),
  returnTo: z.enum(["content", "json"]).default("content")
});

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return adminJsonError("Sem permissão para cadastrar autores.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco de dados indisponível.", 503);

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) {
    return adminJsonError("Dados do autor inválidos.", 422, { details: parsed.error.issues.map((issue) => issue.message) });
  }
  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) return adminJsonError("Não foi possível gerar um slug para o autor.", 422);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [duplicate] = await connection.db.select({ id: authors.id }).from(authors).where(eq(authors.slug, slug)).limit(1);
    if (duplicate) return adminJsonError("Já existe um autor com este slug.", 409, { code: "AUTHOR_SLUG_EXISTS" });

    const author = await connection.db.transaction(async (tx) => {
      const [created] = await tx.insert(authors).values({
        name: parsed.data.name,
        slug,
        bio: parsed.data.bio || null,
        avatarUrl: parsed.data.avatarUrl || null
      }).returning();
      if (!created) throw new Error("Falha ao criar autor.");
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "CREATE",
        entityType: "AUTHOR",
        entityId: created.id,
        after: created,
        origin: "ADMIN"
      });
      return created;
    });

    if (parsed.data.returnTo === "json") {
      return adminJsonOk({ author, message: "Autor cadastrado e selecionado." });
    }
    return adminJsonRedirect(`/admin/conteudo?author=${author.id}`, { author });
  } catch (error) {
    logServerError("route:/api/admin/authors", error, { userId: auth.id, entity: "AUTHOR" });
    return adminJsonError("Não foi possível cadastrar o autor.", 500);
  } finally {
    await connection.close();
  }
};
