import type { APIRoute } from "astro";
import { articleRevisions, articles, auditLogs, authors, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { adminJsonError, adminJsonRedirect } from "../../../../lib/admin-api-response";
import { parseArticleForm } from "../../../../lib/admin-article-input";
import { can } from "../../../../lib/auth";
import { logServerError } from "../../../../lib/server-error";

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return adminJsonError("Sem permissão para criar conteúdo.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco de dados indisponível.", 503);

  const parsed = parseArticleForm(await request.formData());
  if (!parsed.ok) return adminJsonError(parsed.error, 422, { details: parsed.details });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [[author], [duplicate]] = await Promise.all([
      connection.db.select({ id: authors.id }).from(authors).where(eq(authors.id, parsed.data.authorId)).limit(1),
      connection.db.select({ id: articles.id }).from(articles).where(eq(articles.slug, parsed.data.slug)).limit(1)
    ]);
    if (!author) return adminJsonError("Autor não encontrado.", 409, { code: "AUTHOR_NOT_FOUND" });
    if (duplicate) return adminJsonError("Já existe conteúdo com este slug.", 409, { code: "ARTICLE_SLUG_EXISTS" });

    const now = new Date();
    const article = await connection.db.transaction(async (tx) => {
      const [created] = await tx.insert(articles).values({
        ...parsed.data,
        publishedAt: parsed.data.status === "PUBLISHED" ? now : null
      }).returning();
      if (!created) throw new Error("Falha ao criar conteúdo.");
      await tx.insert(articleRevisions).values({ articleId: created.id, version: 1, snapshot: created, actorId: auth.id });
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "CREATE", entityType: "ARTICLE", entityId: created.id, after: created, origin: "ADMIN" });
      return created;
    });
    return adminJsonRedirect(`/admin/conteudo/${article.id}/editar?created=1`, { article });
  } catch (error) {
    logServerError("route:/api/admin/articles", error, { userId: auth.id, entity: "ARTICLE" });
    return adminJsonError("Não foi possível criar o conteúdo.", 500);
  } finally { await connection.close(); }
};
