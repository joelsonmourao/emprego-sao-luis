import { AuditAction, JobIndexingStatus, JobScheduleSource, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { parseScheduledAtInputToUtc } from "@/lib/scheduled-at-utc";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const bodySchema = z.object({
  dataHoraPublicacao: z.union([z.string(), z.number(), z.date()])
});

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const body = bodySchema.parse(await request.json());
    const scheduledAt = parseScheduledAtInputToUtc(body.dataHoraPublicacao);
    if (!scheduledAt || scheduledAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { ok: false, error: "Data/hora invalida ou no passado. Use um horario futuro em dataHoraPublicacao." },
        { status: 400 }
      );
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.SCHEDULED,
        isActive: false,
        scheduledAt,
        publishedAt: null,
        scheduleSource: JobScheduleSource.MANUAL,
        importError: null,
        indexingStatus: JobIndexingStatus.NOT_SENT,
        indexingError: null,
        indexingLastSubmittedAt: null
      },
      select: { id: true, title: true, scheduledAt: true }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      entityId: job.id,
      entityLabel: job.title,
      summary: "Vaga reagendada manualmente",
      after: { status: JobStatus.SCHEDULED, scheduledAt: job.scheduledAt }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao reagendar vaga.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
