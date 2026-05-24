import { prisma } from "@/lib/db";
import { formatBrazilDateTime } from "@/lib/date-utils";
import { IndexingLogsTable } from "@/components/admin/indexing-logs-table";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminIndexacaoPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const filter = typeof raw.filter === "string" ? raw.filter : "all";
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const where: { status?: string; createdAt?: { gte?: Date } } = {};
  if (filter === "success") where.status = "SUCCESS";
  if (filter === "error") where.status = "ERROR";
  if (filter === "skipped") where.status = "SKIPPED";
  if (filter === "today") where.createdAt = { gte: todayStart };
  if (filter === "7days") where.createdAt = { gte: sevenDaysAgo };

  const logs = await prisma.indexingLog.findMany({
    where,
    include: {
      job: { select: { id: true, title: true, slug: true } }
    },
    orderBy: [{ createdAt: "desc" }],
    take: 300
  });

  return (
    <div className="grid gap-6">
      <form className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <select name="filter" defaultValue={filter} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
          <option value="all">Todos</option>
          <option value="success">Sucesso</option>
          <option value="error">Erro</option>
          <option value="skipped">Ignorados</option>
          <option value="today">Hoje</option>
          <option value="7days">Ultimos 7 dias</option>
        </select>
        <button type="submit" className="h-12 rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white">
          Filtrar
        </button>
      </form>

      <IndexingLogsTable
        rows={logs.map((log) => ({
          id: log.id,
          url: log.url,
          jobId: log.jobId,
          jobLabel: log.job ? `${log.job.title} (${log.job.slug})` : "-",
          type: log.type,
          status: log.status,
          httpStatus: log.httpStatus ? String(log.httpStatus) : "-",
          attemptedAt: formatBrazilDateTime(log.createdAt),
          response: log.response ? JSON.stringify(log.response).slice(0, 120) : "-",
          error: log.error ?? ""
        }))}
      />
    </div>
  );
}
