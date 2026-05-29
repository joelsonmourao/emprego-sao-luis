import { JobIndexingStatus, JobPublicationStatus, JobStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { formatBrazilDateTime } from "@/lib/date-utils";
import { ScheduledPublicationsTable } from "@/components/admin/scheduled-publications-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export default async function DivulgacoesAgendadasPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const filter = typeof raw.filter === "string" ? raw.filter : "all";
  const q = typeof raw.q === "string" ? raw.q.trim() : "";

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const todayStart = startOfToday();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const where: Prisma.JobWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { publishedPublicUrl: { contains: q, mode: "insensitive" } },
      { city: { name: { contains: q, mode: "insensitive" } } },
      { state: { code: { contains: q, mode: "insensitive" } } }
    ];
  }

  if (filter === "draft") where.status = JobStatus.DRAFT;
  const scheduledBaseWhere: Prisma.JobWhereInput = {
    publishedAt: null,
    scheduledPublishAt: { not: null },
    OR: [{ status: JobStatus.SCHEDULED }, { publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO }]
  };

  if (filter === "scheduled") {
    const currentAnd = Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : [];
    where.AND = [...currentAnd, scheduledBaseWhere];
  }
  if (filter === "published") where.status = JobStatus.PUBLISHED;
  if (filter === "error") where.status = JobStatus.ERROR;
  if (filter === "google-sent") where.indexingStatus = JobIndexingStatus.SENT;
  if (filter === "indexing-error") where.indexingStatus = JobIndexingStatus.ERROR;
  if (filter === "today") where.publishedAt = { gte: todayStart };
  if (filter === "next-7-days") {
    where.AND = [scheduledBaseWhere, { scheduledPublishAt: { gte: now, lte: in7Days } }];
  }
  if (filter === "overdue") {
    where.AND = [scheduledBaseWhere, { scheduledPublishAt: { lte: now } }];
  }

  const [rows, totalScheduled, pendingPublication, publishedToday, publishedLast7d, sentToGoogle, indexingErrors, publicationErrors, draftsWithoutSchedule] =
    await Promise.all([
      prisma.job.findMany({
        where,
        include: { city: true, state: true },
        orderBy: [{ scheduledPublishAt: "asc" }, { updatedAt: "desc" }],
        take: 200
      }),
      prisma.job.count({ where: scheduledBaseWhere }),
      prisma.job.count({ where: { ...scheduledBaseWhere, scheduledPublishAt: { not: null, lte: now } } }),
      prisma.job.count({ where: { status: JobStatus.PUBLISHED, publishedAt: { gte: todayStart } } }),
      prisma.job.count({ where: { status: JobStatus.PUBLISHED, publishedAt: { gte: sevenDaysAgo } } }),
      prisma.job.count({ where: { indexingStatus: JobIndexingStatus.SENT } }),
      prisma.job.count({ where: { indexingStatus: JobIndexingStatus.ERROR } }),
      prisma.job.count({ where: { status: JobStatus.ERROR } }),
      prisma.job.count({ where: { status: JobStatus.DRAFT, scheduledPublishAt: null } })
    ]);

  const cards = [
    { label: "Total agendadas", value: totalScheduled },
    { label: "Pendentes de publicacao", value: pendingPublication },
    { label: "Publicadas hoje", value: publishedToday },
    { label: "Publicadas nos ultimos 7 dias", value: publishedLast7d },
    { label: "Enviadas ao Google", value: sentToGoogle },
    { label: "Erros de indexacao", value: indexingErrors },
    { label: "Erros de publicacao", value: publicationErrors },
    { label: "Rascunhos sem agendamento", value: draftsWithoutSchedule }
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <form className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por titulo, empresa, cidade, UF, slug ou URL"
          className="h-12 min-w-[340px] rounded-2xl border border-slate-200 px-4 text-sm"
        />
        <select name="filter" defaultValue={filter} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
          <option value="all">Todas</option>
          <option value="draft">Rascunho</option>
          <option value="scheduled">Agendadas</option>
          <option value="published">Publicadas</option>
          <option value="error">Erro</option>
          <option value="google-sent">Enviadas ao Google</option>
          <option value="indexing-error">Erro de indexacao</option>
          <option value="today">Hoje</option>
          <option value="next-7-days">Proximos 7 dias</option>
          <option value="overdue">Vencidas sem publicar</option>
        </select>
        <button type="submit" className="h-12 rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white">
          Filtrar
        </button>
      </form>

      <ScheduledPublicationsTable
        rows={rows.map((job) => ({
          id: job.id,
          title: job.title,
          companyName: job.companyName,
          city: job.city.name,
          state: job.state.code,
          status: job.status,
          scheduledAt: job.scheduledPublishAt ? formatBrazilDateTime(job.scheduledPublishAt) : "-",
          scheduleSource: job.scheduleSource ?? "-",
          publishedAt: job.publishedAt ? formatBrazilDateTime(job.publishedAt) : "-",
          indexingStatus: job.indexingStatus,
          indexingLastSubmittedAt: job.indexingLastSubmittedAt ? formatBrazilDateTime(job.indexingLastSubmittedAt) : "-",
          error: job.importError || job.indexingError || "",
          url: job.status === JobStatus.PUBLISHED ? `/vagas/${job.slug}` : ""
        }))}
      />
    </div>
  );
}
