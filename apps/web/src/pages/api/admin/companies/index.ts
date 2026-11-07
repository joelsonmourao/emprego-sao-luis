import { zOptionalUrl } from "@es/shared";
import type { APIRoute } from "astro";
import { auditLogs, companies, createDatabase } from "@es/db";
import { z } from "zod";
import { can } from "../../../../lib/auth";
const optionalUrl = zOptionalUrl();
const schema = z.object({ name: z.string().trim().min(2).max(160), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), websiteUrl: optionalUrl, logoUrl: optionalUrl, description: z.string().trim().max(5000).optional() });
export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => { const auth = locals.auth!; if (!can(auth, "companies.manage")) return new Response("Proibido", { status: 403 }); const parsed = schema.safeParse(Object.fromEntries(await request.formData())); if (!parsed.success || !process.env.DATABASE_URL) return Response.json({ error: "Dados inválidos", details: parsed.success ? undefined : parsed.error.issues }, { status: 400 }); const connection = createDatabase(process.env.DATABASE_URL); try { await connection.db.transaction(async (tx) => { const [company] = await tx.insert(companies).values({ ...parsed.data, descriptionHtml: parsed.data.description || null }).returning(); await tx.insert(auditLogs).values({ actorId: auth.id, action: "CREATE", entityType: "COMPANY", entityId: company!.id, after: { record: company, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" }); }); return redirect("/admin/empresas?created=1", 303); } finally { await connection.close(); } };
