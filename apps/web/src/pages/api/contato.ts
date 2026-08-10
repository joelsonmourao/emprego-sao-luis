import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { consentLogs, contactSubmissions, createDatabase } from "@es/db";
import { z } from "zod";

const categories = [
  "suporte_candidato",
  "correcao_vaga",
  "denuncia",
  "empresa",
  "publicidade",
  "pagamento",
  "privacidade_lgpd",
  "parceria",
  "outro"
] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(3).max(160),
  category: z.enum(categories),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal("1")
});

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

function protocol() {
  const n = Date.now().toString(36).toUpperCase();
  return `CT-${n.slice(-8)}`;
}

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse({ ...form, phone: String(form.phone ?? "").trim() || undefined });
  if (!parsed.success) return redirect("/contato?error=Dados+inválidos", 303);

  const proto = protocol();
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
        await tx.insert(contactSubmissions).values({
          protocol: proto,
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone ?? null,
          subject: parsed.data.subject,
          category: parsed.data.category,
          message: parsed.data.message,
          ipHash
        });
        await tx.insert(consentLogs).values({
          subjectHash: emailHash,
          purpose: "contact_form",
          action: "submitted",
          policyVersion: "2026-01",
          source: "contato",
          ipHash,
          userAgentHash: hash(request.headers.get("user-agent") ?? "unknown")
        });
      });
    } finally {
      await connection.close();
    }
  }

  return redirect(`/contato?sent=1&protocolo=${proto}`, 303);
};
