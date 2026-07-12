import type { APIRoute } from "astro";
import { auditLogs, authors, createDatabase } from "@es/db";
import { can } from "../../../lib/auth";

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const auth = locals.auth!;
  if (!can(auth, "content.manage")) return new Response("Proibido", { status: 403 });
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2 || !process.env.DATABASE_URL) return new Response("Nome ou banco inválido", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [author] = await connection.db.insert(authors).values({ name, slug: slugify(String(form.get("slug") ?? name)), bio: String(form.get("bio") ?? "").trim() || null }).returning();
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "CREATE", entityType: "AUTHOR", entityId: author?.id, after: author, origin: "ADMIN" });
    return redirect("/admin/conteudo?author=created", 303);
  } finally { await connection.close(); }
};
