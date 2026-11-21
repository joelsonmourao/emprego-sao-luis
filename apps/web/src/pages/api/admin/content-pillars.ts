import type { APIRoute } from "astro";
import { contentClusters, contentPillars, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { adminJsonError, adminJsonRedirect } from "../../../lib/admin-api-response";
import { can } from "../../../lib/auth";
import { slugify } from "../../../lib/slug";

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) return adminJsonError("Sem permissão.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco indisponível.", 503);
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    if (action === "CREATE_PILLAR") {
      const name = String(form.get("name") ?? "").trim();
      const slug = slugify(String(form.get("slug") ?? name));
      const description = String(form.get("description") ?? "").trim() || null;
      const audience = String(form.get("audience") ?? "CANDIDATE");
      if (!name || !slug) return adminJsonError("Nome e slug são obrigatórios.", 422);
      await connection.db.insert(contentPillars).values({
        name,
        slug,
        description,
        audience: ["CANDIDATE", "COMPANY", "BOTH"].includes(audience) ? audience : "CANDIDATE",
        active: true
      });
      return adminJsonRedirect("/admin/conteudo/pilares?saved=1");
    }
    if (action === "CREATE_CLUSTER") {
      const pillarId = String(form.get("pillarId") ?? "");
      const name = String(form.get("name") ?? "").trim();
      const slug = slugify(String(form.get("slug") ?? name));
      const description = String(form.get("description") ?? "").trim() || null;
      if (!pillarId || !name || !slug) return adminJsonError("Pilar, nome e slug são obrigatórios.", 422);
      await connection.db.insert(contentClusters).values({
        pillarId,
        name,
        slug,
        description,
        active: true
      });
      return adminJsonRedirect("/admin/conteudo/pilares?saved=1");
    }
    if (action === "TOGGLE_PILLAR") {
      const id = String(form.get("id") ?? "");
      const [row] = await connection.db.select().from(contentPillars).where(eq(contentPillars.id, id)).limit(1);
      if (!row) return adminJsonError("Pilar não encontrado.", 404);
      await connection.db.update(contentPillars).set({ active: !row.active, updatedAt: new Date() }).where(eq(contentPillars.id, id));
      return adminJsonRedirect("/admin/conteudo/pilares?saved=1");
    }
    return adminJsonError("Ação inválida.", 400);
  } finally {
    await connection.close();
  }
};
