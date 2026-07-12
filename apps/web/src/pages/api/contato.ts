import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { auditLogs, consentLogs, createDatabase } from "@es/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal("1")
});

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return redirect("/contato?error=Dados+inválidos", 303);

  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      const ipHash = hash(clientAddress ?? "unknown");
      const emailHash = hash(parsed.data.email.toLowerCase());
      const since = new Date(Date.now() - 15 * 60 * 1000);
      const recent = await connection.db
        .select()
        .from(consentLogs)
        .where(and(eq(consentLogs.subjectHash, emailHash), eq(consentLogs.purpose, "contact_form"), gt(consentLogs.createdAt, since)))
        .limit(5);
      if (recent.length >= 3) return redirect("/contato?error=Muitas+tentativas.+Aguarde+15+minutos.", 303);

      await connection.db.transaction(async (tx) => {
        await tx.insert(consentLogs).values({
          subjectHash: emailHash,
          purpose: "contact_form",
          action: "submitted",
          policyVersion: "2026-01",
          source: "contato",
          ipHash,
          userAgentHash: hash(request.headers.get("user-agent") ?? "unknown")
        });
        await tx.insert(auditLogs).values({
          action: "CONTACT_MESSAGE",
          entityType: "CONTACT",
          after: { subject: parsed.data.subject, emailHash, ipHash },
          origin: "PUBLIC"
        });
      });
    } finally {
      await connection.close();
    }
  }

  return redirect("/contato?sent=1", 303);
};
