import type { APIRoute } from "astro";
import { articleRevisions, articles, auditLogs, createDatabase } from "@es/db";
import { can } from "../../../../lib/auth";

const optional = (form: FormData, key: string) => String(form.get(key) ?? "").trim() || null;
const date = (value: string | null) => value ? new Date(value) : null;
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const auth = locals.auth!;
  if (!can(auth, "content.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });
  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const authorId = String(form.get("authorId") ?? "");
  const contentHtml = String(form.get("contentHtml") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "").trim();
  if (title.length < 5 || excerpt.length < 10 || contentHtml.length < 20 || !authorId) return new Response("Campos editoriais incompletos", { status: 400 });
  const status = String(form.get("status") ?? "DRAFT") as "DRAFT" | "SCHEDULED" | "PUBLISHED";
  const now = new Date();
  const values = { type: String(form.get("type") ?? "NEWS") as "NEWS" | "GUIDE" | "DATA_REPORT", authorId, title, subtitle: optional(form, "subtitle"), slug: slugify(String(form.get("slug") ?? title)), excerpt, contentHtml, coverImageUrl: optional(form, "coverImageUrl"), coverImageAlt: optional(form, "coverImageAlt"), coverImageCaption: optional(form, "coverImageCaption"), section: optional(form, "section"), tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean), sourceName: optional(form, "sourceName"), sourceUrl: optional(form, "sourceUrl"), seoTitle: optional(form, "seoTitle"), metaDescription: optional(form, "metaDescription"), canonicalUrl: optional(form, "canonicalUrl"), internalNotes: optional(form, "internalNotes"), status, scheduledAt: date(optional(form, "scheduledAt")), expiresAt: date(optional(form, "expiresAt")), publishedAt: status === "PUBLISHED" ? now : null, featured: form.get("featured") === "on" };
  if (status === "SCHEDULED" && (!values.scheduledAt || values.scheduledAt <= now)) return new Response("Agendamento deve estar no futuro", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const article = await connection.db.transaction(async (tx) => { const [created] = await tx.insert(articles).values(values).returning(); if (!created) throw new Error("Falha ao criar conteúdo"); await tx.insert(articleRevisions).values({ articleId: created.id, version: 1, snapshot: created, actorId: auth.id }); await tx.insert(auditLogs).values({ actorId: auth.id, action: "CREATE", entityType: "ARTICLE", entityId: created.id, after: created, origin: "ADMIN" }); return created; });
    return redirect(`/admin/conteudo/${article.id}/editar?created=1`, 303);
  } finally { await connection.close(); }
};
