import type { APIRoute } from "astro";
import { auditLogs, companyCredits, createDatabase } from "@es/db";
import { and, eq, gt, sql } from "drizzle-orm";
import { getOrderByCode } from "../../../lib/commercial";
import { z } from "zod";

const schema = z.object({
  orderCode: z.string().min(4),
  jobTitle: z.string().trim().min(3).max(180),
  description: z.string().trim().min(20).max(8000),
  applyUrl: z.string().trim().url().max(500),
  termsAccepted: z.literal("1")
});

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) return redirect("/publicar-vaga", 303);
  const data = await getOrderByCode(parsed.data.orderCode);
  if (!data || data.order.status !== "PAID" || data.remaining <= 0) {
    return redirect("/publicar-vaga?error=sem-credito", 303);
  }
  if (!process.env.DATABASE_URL) return redirect("/publicar-vaga?error=indisponivel", 303);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [credit] = await tx
        .select()
        .from(companyCredits)
        .where(
          and(
            eq(companyCredits.orderId, data.order.id),
            gt(companyCredits.expiresAt, new Date()),
            sql`${companyCredits.usedCredits} < ${companyCredits.totalCredits}`
          )
        )
        .limit(1);
      if (!credit) throw new Error("Sem crédito");
      await tx.update(companyCredits).set({ usedCredits: credit.usedCredits + 1, updatedAt: new Date() }).where(eq(companyCredits.id, credit.id));
      await tx.insert(auditLogs).values({
        action: "COMMERCIAL_JOB_DRAFT",
        entityType: "COMMERCIAL_ORDER",
        entityId: data.order.id,
        after: { jobTitle: parsed.data.jobTitle, applyUrl: parsed.data.applyUrl, status: "PENDING_REVIEW" },
        origin: "PUBLIC"
      });
    });
    return redirect(`/publicar-vaga/pedido/${parsed.data.orderCode}?draft=ok`, 303);
  } catch {
    return redirect("/publicar-vaga?error=credito", 303);
  } finally {
    await connection.close();
  }
};
