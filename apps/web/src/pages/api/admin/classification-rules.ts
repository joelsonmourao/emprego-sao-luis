import type { APIRoute } from "astro";
import { classificationRules, createDatabase } from "@es/db";
import { can } from "../../../lib/auth";

function csv(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });
  const form = await request.formData();
  const categorySlug = String(form.get("categorySlug") ?? "").trim().toLowerCase();
  const categoryName = String(form.get("categoryName") ?? "").trim();
  const keywords = csv(form.get("keywords"));
  const synonyms = csv(form.get("synonyms"));
  const priority = Number(form.get("priority") ?? 100);
  if (!categorySlug || !categoryName || keywords.length === 0) {
    return new Response("Slug, nome e palavras-chave são obrigatórios.", { status: 400 });
  }
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db
      .insert(classificationRules)
      .values({
        categorySlug,
        categoryName,
        keywords,
        synonyms,
        priority: Number.isFinite(priority) ? priority : 100,
        active: true
      })
      .onConflictDoUpdate({
        target: classificationRules.categorySlug,
        set: {
          categoryName,
          keywords,
          synonyms,
          priority: Number.isFinite(priority) ? priority : 100,
          active: true,
          updatedAt: new Date()
        }
      });
    return redirect("/admin/classificacao?saved=1", 303);
  } finally {
    await connection.close();
  }
};
