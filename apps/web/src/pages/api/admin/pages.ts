import type { APIRoute } from "astro";
import { auditLogs, createDatabase } from "@es/db";
import { z } from "zod";
import { can } from "../../../lib/auth";
import { INSTITUTIONAL_SLUGS, saveInstitutionalPages } from "../../../lib/site-pages";

const schema = z.object({
  slug: z.enum(INSTITUTIONAL_SLUGS),
  title: z.string().trim().min(2),
  seoTitle: z.string().trim().min(2),
  metaDescription: z.string().trim().min(10),
  canonicalPath: z.string().startsWith("/"),
  contentHtml: z.string().min(1),
  published: z.string().optional()
});

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "settings.manage")) return new Response("Proibido", { status: 403 });

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return new Response("Dados inválidos", { status: 400 });

  const page = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    seoTitle: parsed.data.seoTitle,
    metaDescription: parsed.data.metaDescription,
    canonicalPath: parsed.data.canonicalPath,
    contentHtml: parsed.data.contentHtml,
    published: parsed.data.published === "1"
  };

  await saveInstitutionalPages({ [parsed.data.slug]: page });

  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      await connection.db.insert(auditLogs).values({
        actorId: auth.id,
        action: "INSTITUTIONAL_PAGE_UPDATED",
        entityType: "PAGE",
        entityId: parsed.data.slug,
        after: { slug: parsed.data.slug, ip: clientAddress },
        origin: "ADMIN"
      });
    } finally {
      await connection.close();
    }
  }

  return redirect(`/admin/paginas?slug=${parsed.data.slug}&saved=1`, 303);
};
