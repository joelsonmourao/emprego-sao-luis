import type { APIRoute } from "astro";
import { auditLogs, createDatabase } from "@es/db";
import { adSettingsSchema } from "@es/ads";
import { can } from "../../../../lib/auth";
import { getAdSettings, saveAdSettings } from "../../../../lib/ads";

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "commercial.manage")) return new Response("Proibido", { status: 403 });
  const form = await request.formData();
  const before = await getAdSettings();
  const envClient = process.env.PUBLIC_ADSENSE_CLIENT_ID ?? "";
  const parsed = adSettingsSchema.safeParse({
    ...before,
    globalEnabled: form.get("globalEnabled") === "yes",
    adsenseEnabled: form.get("adsenseEnabled") === "yes",
    adsenseClientId: String(form.get("adsenseClientId") ?? envClient).trim(),
    consentRequired: form.get("consentRequired") !== "no"
  });
  if (!parsed.success) return new Response("Configuração inválida", { status: 400 });
  await saveAdSettings(parsed.data);
  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "AD_SETTINGS_UPDATE", entityType: "SETTINGS", entityId: "ad_settings", before, after: { record: parsed.data, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    } finally {
      await connection.close();
    }
  }
  return redirect("/admin/publicidade?saved=1", 303);
};
