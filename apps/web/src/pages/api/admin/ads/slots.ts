import type { APIRoute } from "astro";
import { adSlots, auditLogs, createDatabase } from "@es/db";
import { assertSlotNotNearCandidature, CANDIDATURE_BLOCKED_SLOT_KEYS } from "@es/ads";
import { z } from "zod";
import { can } from "../../../../lib/auth";

const schema = z.object({
  key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  pageType: z.string().min(1),
  position: z.string().min(1),
  device: z.enum(["all", "mobile", "desktop"]).default("all"),
  reservedHeight: z.coerce.number().int().min(80).max(600).default(280),
  allowAdsense: z.string().optional(),
  allowDirect: z.string().optional(),
  adsenseSlotId: z.string().optional(),
  active: z.string().optional()
});

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "commercial.manage")) return new Response("Proibido", { status: 403 });
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  if (CANDIDATURE_BLOCKED_SLOT_KEYS.has(parsed.data.key)) return new Response("Chave bloqueada perto da candidatura", { status: 400 });
  try {
    assertSlotNotNearCandidature(parsed.data.key, parsed.data.pageType === "job" ? "job" : undefined);
  } catch {
    return new Response("Espaço inválido para páginas de vaga", { status: 400 });
  }
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [slot] = await connection.db.insert(adSlots).values({
      key: parsed.data.key,
      name: parsed.data.name,
      pageType: parsed.data.pageType,
      position: parsed.data.position,
      device: parsed.data.device,
      reservedHeight: parsed.data.reservedHeight,
      allowAdsense: parsed.data.allowAdsense === "yes",
      allowDirect: parsed.data.allowDirect !== "no",
      adsenseSlotId: parsed.data.adsenseSlotId || null,
      active: parsed.data.active === "yes",
      exclusionRules: parsed.data.pageType === "job" ? { blockNearCandidature: true } : {}
    }).onConflictDoUpdate({
      target: adSlots.key,
      set: { name: parsed.data.name, pageType: parsed.data.pageType, position: parsed.data.position, device: parsed.data.device, reservedHeight: parsed.data.reservedHeight, allowAdsense: parsed.data.allowAdsense === "yes", allowDirect: parsed.data.allowDirect !== "no", adsenseSlotId: parsed.data.adsenseSlotId || null, active: parsed.data.active === "yes", updatedAt: new Date() }
    }).returning();
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "AD_SLOT_UPSERT", entityType: "AD_SLOT", entityId: slot!.id, after: { record: slot, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    return redirect("/admin/publicidade?slot=1", 303);
  } finally {
    await connection.close();
  }
};
