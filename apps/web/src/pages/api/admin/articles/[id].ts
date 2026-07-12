import type { APIRoute } from "astro";
import { and, eq, ne } from "drizzle-orm";
import { articleRevisions, articles, auditLogs, createDatabase } from "@es/db";
import { can } from "../../../../lib/auth";

const optional = (form: FormData, key: string) => String(form.get(key) ?? "").trim() || null;
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const POST: APIRoute = async ({ params, request, locals, redirect }) => {
  const auth = locals.auth!; if (!can(auth, "content.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || !process.env.DATABASE_URL) return new Response("Inválido", { status: 400 });
  const form = await request.formData(); const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [before] = await connection.db.select().from(articles).where(eq(articles.id, params.id)).limit(1); if (!before) return new Response("Não encontrado", { status: 404 });
    const action = String(form.get("action") ?? "SAVE");
    if (action === "DUPLICATE") { const [copy] = await connection.db.insert(articles).values({ ...before, id: undefined, slug: `${before.slug}-copia-${Date.now()}`, title: `${before.title} (cópia)`, status: "DRAFT", publishedAt: null, scheduledAt: null, version: 1, createdAt: undefined, updatedAt: undefined }).returning(); await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "DUPLICATE", entityType: "ARTICLE", entityId: copy?.id, before, after: copy, origin: "ADMIN" }); return redirect(`/admin/conteudo/${copy?.id}/editar`, 303); }
    const status = String(form.get("status") ?? before.status) as typeof before.status; const scheduledAt = optional(form, "scheduledAt") ? new Date(String(form.get("scheduledAt"))) : null;
    if (status === "SCHEDULED" && (!scheduledAt || scheduledAt <= new Date())) return new Response("Agendamento deve estar no futuro", { status: 400 });
    const nextVersion = before.version + 1;
    const values = { type: String(form.get("type") ?? before.type) as typeof before.type, authorId: String(form.get("authorId") ?? before.authorId), title: String(form.get("title") ?? before.title).trim(), subtitle: optional(form, "subtitle"), slug: slugify(String(form.get("slug") ?? before.slug)), excerpt: String(form.get("excerpt") ?? before.excerpt).trim(), contentHtml: String(form.get("contentHtml") ?? before.contentHtml).trim(), coverImageUrl: optional(form, "coverImageUrl"), coverImageAlt: optional(form, "coverImageAlt"), section: optional(form, "section"), tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean), sourceName: optional(form, "sourceName"), sourceUrl: optional(form, "sourceUrl"), seoTitle: optional(form, "seoTitle"), metaDescription: optional(form, "metaDescription"), canonicalUrl: optional(form, "canonicalUrl"), internalNotes: optional(form, "internalNotes"), status, scheduledAt, expiresAt: optional(form, "expiresAt") ? new Date(String(form.get("expiresAt"))) : null, publishedAt: status === "PUBLISHED" ? before.publishedAt ?? new Date() : before.publishedAt, featured: form.get("featured") === "on", version: nextVersion, updatedAt: new Date() };
    const duplicate = await connection.db.select({ id: articles.id }).from(articles).where(and(eq(articles.slug, values.slug), ne(articles.id, before.id))).limit(1); if (duplicate.length) return new Response("Slug já utilizado", { status: 409 });
    await connection.db.transaction(async (tx) => { await tx.insert(articleRevisions).values({ articleId: before.id, version: before.version, snapshot: before, actorId: auth.id }).onConflictDoNothing(); const [after] = await tx.update(articles).set(values).where(eq(articles.id, before.id)).returning(); await tx.insert(auditLogs).values({ actorId: auth.id, action: "UPDATE", entityType: "ARTICLE", entityId: before.id, before, after, origin: "ADMIN" }); });
    return redirect(`/admin/conteudo/${before.id}/editar?saved=1`, 303);
  } finally { await connection.close(); }
};
