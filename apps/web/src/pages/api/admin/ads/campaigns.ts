import type { APIRoute } from "astro";
import { adCreatives, auditLogs, campaigns, createDatabase } from "@es/db";
import { z } from "zod";
import { can } from "../../../../lib/auth";

const campaignSchema = z.object({
  advertiserId: z.uuid(),
  name: z.string().min(2),
  sponsorName: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"]).default("DRAFT"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  priority: z.coerce.number().int().default(0),
  citySlug: z.string().optional(),
  categorySlug: z.string().optional(),
  companySlug: z.string().optional(),
  workplaceType: z.string().optional(),
  impressionLimit: z.coerce.number().int().optional(),
  clickLimit: z.coerce.number().int().optional(),
  internalNotes: z.string().optional(),
  slotId: z.uuid(),
  creativeName: z.string().min(2),
  imageUrl: z.url(),
  destinationUrl: z.url(),
  altText: z.string().min(2)
});

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "commercial.manage")) return new Response("Proibido", { status: 403 });
  const parsed = campaignSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const targeting = {
      citySlug: parsed.data.citySlug || null,
      categorySlug: parsed.data.categorySlug || null,
      companySlug: parsed.data.companySlug || null,
      workplaceType: parsed.data.workplaceType || null
    };
    const [campaign] = await connection.db.insert(campaigns).values({
      advertiserId: parsed.data.advertiserId,
      name: parsed.data.name,
      sponsorName: parsed.data.sponsorName || null,
      status: parsed.data.status,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      priority: parsed.data.priority,
      targeting,
      impressionLimit: parsed.data.impressionLimit,
      clickLimit: parsed.data.clickLimit,
      internalNotes: parsed.data.internalNotes || null
    }).returning();
    const [creative] = await connection.db.insert(adCreatives).values({
      campaignId: campaign!.id,
      slotId: parsed.data.slotId,
      name: parsed.data.creativeName,
      imageUrl: parsed.data.imageUrl,
      destinationUrl: parsed.data.destinationUrl,
      altText: parsed.data.altText,
      status: parsed.data.status === "ACTIVE" ? "ACTIVE" : "DRAFT",
      active: parsed.data.status === "ACTIVE"
    }).returning();
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "AD_CAMPAIGN_CREATE", entityType: "CAMPAIGN", entityId: campaign!.id, after: { campaign, creative, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    return redirect("/admin/publicidade?campaign=1", 303);
  } finally {
    await connection.close();
  }
};
