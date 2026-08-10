import type { APIRoute } from "astro";
import { articles, auditLogs, createDatabase, indexingEvents, webStories } from "@es/db";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { indexingDedupeKey, publicArticleUrl, type IndexingNotification } from "../../../../lib/indexing";

const actionSchema = z.enum(["DELETE", "ARCHIVED", "DRAFT", "PENDING_REVIEW"]);

function buildArticleDeleteIndexing(item: {
  id: string;
  slug: string;
  type: "NEWS" | "GUIDE" | "DATA_REPORT";
}): IndexingNotification[] {
  const url = publicArticleUrl(item.slug, item.type);
  return [
    {
      dedupeKey: indexingDedupeKey(`article-delete`, item.id, "google"),
      provider: "GOOGLE",
      url,
      notificationType: "URL_DELETED"
    },
    {
      dedupeKey: indexingDedupeKey(`article-delete`, item.id, "indexnow"),
      provider: "INDEXNOW",
      url,
      notificationType: "URL_DELETED"
    }
  ];
}

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "content.manage")) return new Response("Proibido", { status: 403 });

  const form = await request.formData();
  const ids = z.array(z.string().uuid()).min(1).max(200).safeParse(form.getAll("articleId"));
  const action = actionSchema.safeParse(String(form.get("action") ?? "").trim());
  if (!ids.success || !action.success || !process.env.DATABASE_URL) {
    return new Response("Selecione posts e uma ação válida.", { status: 400 });
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const before = await tx.select().from(articles).where(inArray(articles.id, ids.data));
      if (before.length !== ids.data.length) throw new Error("Uma ou mais postagens não foram encontradas.");

      if (action.data === "DELETE") {
        await tx
          .update(webStories)
          .set({ articleId: null, updatedAt: new Date() })
          .where(inArray(webStories.articleId, ids.data));

        const indexingRows = before
          .filter((item) => item.status === "PUBLISHED")
          .flatMap((item) =>
            buildArticleDeleteIndexing({
              id: item.id,
              slug: item.slug,
              type: item.type as "NEWS" | "GUIDE" | "DATA_REPORT"
            })
          );
        if (indexingRows.length) await tx.insert(indexingEvents).values(indexingRows).onConflictDoNothing();

        await tx.delete(articles).where(inArray(articles.id, ids.data));
        await tx.insert(auditLogs).values({
          actorId: auth.id,
          action: "BULK_ARTICLE_DELETE",
          entityType: "ARTICLE",
          after: {
            ids: ids.data,
            count: before.length,
            titles: before.map((item) => item.title),
            ip: clientAddress,
            userAgent: request.headers.get("user-agent")
          },
          origin: "ADMIN"
        });
        return;
      }

      const now = new Date();
      const changed = await tx
        .update(articles)
        .set({
          status: action.data,
          updatedAt: now
        })
        .where(inArray(articles.id, ids.data))
        .returning({ id: articles.id });

      const indexingRows: IndexingNotification[] = before
        .filter((item) => item.status === "PUBLISHED")
        .flatMap((item) =>
          buildArticleDeleteIndexing({
            id: item.id,
            slug: item.slug,
            type: item.type as "NEWS" | "GUIDE" | "DATA_REPORT"
          })
        );
      if (indexingRows.length) await tx.insert(indexingEvents).values(indexingRows).onConflictDoNothing();

      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: `BULK_ARTICLE_STATUS_${action.data}`,
        entityType: "ARTICLE",
        after: {
          ids: changed.map((item) => item.id),
          count: changed.length,
          status: action.data,
          ip: clientAddress,
          userAgent: request.headers.get("user-agent")
        },
        origin: "ADMIN"
      });
    });

    return redirect(`/admin/conteudo?bulk=${action.data}`, 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na ação em massa.";
    return new Response(message, { status: 500 });
  } finally {
    await connection.close();
  }
};
