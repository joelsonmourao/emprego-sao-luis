import type { APIRoute } from "astro";
import { z } from "zod";
import { createDatabase, jobs, savedJobs } from "@es/db";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  jobId: z.string().uuid(),
  action: z.enum(["save", "remove"])
});

export const POST: APIRoute = async ({ request, locals, redirect, url }) => {
  const candidate = locals.candidate;
  const form = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(form));
  const returnTo = String(form.get("returnTo") || "").trim();
  const safeReturn =
    returnTo.startsWith("/vagas/") && !returnTo.startsWith("//") ? returnTo : "/vagas";

  if (!candidate) {
    const next = new URL("/entrar", url.origin);
    next.searchParams.set("next", safeReturn);
    next.searchParams.set("motivo", "salvar-vaga");
    return redirect(next.toString(), 303);
  }

  if (!parsed.success || !process.env.DATABASE_URL) {
    return redirect(`${safeReturn}?salvar=erro`, 303);
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [job] = await connection.db
      .select({ slug: jobs.slug })
      .from(jobs)
      .where(and(eq(jobs.id, parsed.data.jobId), eq(jobs.publicationStatus, "PUBLISHED")))
      .limit(1);
    if (!job) return redirect(`${safeReturn}?salvar=indisponivel`, 303);

    if (parsed.data.action === "save") {
      await connection.db
        .insert(savedJobs)
        .values({ userId: candidate.id, jobId: parsed.data.jobId })
        .onConflictDoNothing();
      return redirect(`/vagas/${job.slug}?salvar=ok`, 303);
    }

    await connection.db
      .delete(savedJobs)
      .where(and(eq(savedJobs.userId, candidate.id), eq(savedJobs.jobId, parsed.data.jobId)));
    return redirect(`/vagas/${job.slug}?salvar=removido`, 303);
  } finally {
    await connection.close();
  }
};
