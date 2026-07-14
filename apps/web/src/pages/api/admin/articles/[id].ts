import type { APIRoute } from "astro";
import { articleRevisions, articles, auditLogs, createDatabase } from "@es/db";
import { and, eq, ne } from "drizzle-orm";
import { adminJsonError, adminJsonRedirect } from "../../../../lib/admin-api-response";
import { parseArticleForm } from "../../../../lib/admin-article-input";
import { can } from "../../../../lib/auth";
import { logServerError } from "../../../../lib/server-error";

export const POST: APIRoute = async ({ params, request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return adminJsonError("Sem permissão para alterar conteúdo.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Conteúdo ou banco inválido.", 400);

  const form = await request.formData();
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [before] = await connection.db.select().from(articles).where(eq(articles.id, params.id)).limit(1);
    if (!before) return adminJsonError("Conteúdo não encontrado.", 404);

    if (form.get("action") === "DUPLICATE") {
      const suffix = Date.now().toString(36);
      const [copy] = await connection.db.insert(articles).values({
        ...before,
        id: undefined,
        slug: `${before.slug}-copia-${suffix}`,
        title: `${before.title} (cópia)`,
        status: "DRAFT",
        publishedAt: null,
        scheduledAt: null,
        version: 1,
        createdAt: undefined,
        updatedAt: undefined
      }).returning();
      if (!copy) throw new Error("Falha ao duplicar conteúdo.");
      await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "DUPLICATE", entityType: "ARTICLE", entityId: copy.id, before: { sourceId: before.id }, after: copy, origin: "ADMIN" });
      return adminJsonRedirect(`/admin/conteudo/${copy.id}/editar?duplicated=1`, { article: copy });
    }

    const parsed = parseArticleForm(form);
    if (!parsed.ok) return adminJsonError(parsed.error, 422, { details: parsed.details });
    const [duplicate] = await connection.db.select({ id: articles.id }).from(articles).where(and(eq(articles.slug, parsed.data.slug), ne(articles.id, before.id))).limit(1);
    if (duplicate) return adminJsonError("Já existe outro conteúdo com este slug.", 409, { code: "ARTICLE_SLUG_EXISTS" });

    const nextVersion = before.version + 1;
    const values = {
      ...parsed.data,
      publishedAt: parsed.data.status === "PUBLISHED" ? before.publishedAt ?? new Date() : before.publishedAt,
      version: nextVersion,
      updatedAt: new Date()
    };
    let after: typeof before | undefined;
    await connection.db.transaction(async (tx) => {
      await tx.insert(articleRevisions).values({ articleId: before.id, version: before.version, snapshot: before, actorId: auth.id }).onConflictDoNothing();
      [after] = await tx.update(articles).set(values).where(eq(articles.id, before.id)).returning();
      if (!after) throw new Error("Falha ao atualizar conteúdo.");
      await tx.insert(auditLogs).values({ actorId: auth.id, action: parsed.data.status === "ARCHIVED" ? "ARCHIVE" : "UPDATE", entityType: "ARTICLE", entityId: before.id, before, after, origin: "ADMIN" });
    });
    return adminJsonRedirect(`/admin/conteudo/${before.id}/editar?saved=1`, { article: after });
  } catch (error) {
    logServerError("route:/api/admin/articles/:id", error, { userId: auth.id, entity: "ARTICLE", route: `/api/admin/articles/${params.id}` });
    return adminJsonError("Não foi possível alterar o conteúdo.", 500);
  } finally { await connection.close(); }
};
