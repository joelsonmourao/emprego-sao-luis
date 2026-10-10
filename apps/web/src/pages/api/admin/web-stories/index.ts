import type { APIRoute } from "astro";
import { createDatabase, webStories } from "@es/db";
import { validateWebStory } from "@es/shared";
import { can } from "../../../../lib/auth";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim();
  const articleId = String(form.get("articleId") ?? "").trim();
  const authorId = String(form.get("authorId") ?? "").trim();
  const posterUrl = String(form.get("posterUrl") ?? "").trim();
  const posterAlt = String(form.get("posterAlt") ?? "").trim();
  let pages: unknown = [];
  try {
    pages = JSON.parse(String(form.get("pagesJson") ?? "[]"));
  } catch {
    return new Response("JSON de páginas inválido", { status: 400 });
  }

  const siteUrl = process.env.SITE_URL ?? "https://empregossaoluis.com.br";
  const canonicalUrl = new URL(`/web-stories/${slug}`, siteUrl).toString();
  const validation = validateWebStory({
    title,
    slug,
    articleId,
    authorId,
    pages: Array.isArray(pages) ? pages : [],
    posterUrl,
    posterAlt,
    canonicalUrl,
    status: "DRAFT",
    sourceArticleEligible: true
  });
  if (!validation.valid) return new Response(validation.errors.join(" "), { status: 400 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [created] = await connection.db
      .insert(webStories)
      .values({
        title,
        slug,
        articleId,
        authorId,
        status: "DRAFT",
        pages,
        posterUrl,
        posterAlt,
        canonicalUrl
      })
      .returning({ id: webStories.id });
    return redirect(`/admin/web-stories/${created!.id}`, 303);
  } finally {
    await connection.close();
  }
};
