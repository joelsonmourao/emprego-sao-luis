import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { JobStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { AdminJobsTable } from "@/components/admin/admin-jobs-table";
import { PaginationNav } from "@/components/pagination-nav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminJobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminJobsPage({ searchParams }: AdminJobsPageProps) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q.trim() : "";
  const status = typeof raw.status === "string" ? raw.status : "all";
  const page = Math.max(1, Number(typeof raw.page === "string" ? raw.page : "1") || 1);

  const where: Prisma.JobWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } }
    ];
  }

  if (status === "active") {
    where.isActive = true;
  } else if (status === "inactive") {
    where.isActive = false;
  } else if (status === "draft") {
    where.status = JobStatus.DRAFT;
  } else if (status === "scheduled") {
    where.status = JobStatus.SCHEDULED;
  } else if (status === "published") {
    where.status = JobStatus.PUBLISHED;
  } else if (status === "error") {
    where.status = JobStatus.ERROR;
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { city: true, state: true },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
    skip: (page - 1) * 12
  });

  const total = await prisma.job.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / 12));

  if (!jobs.length) {
    return (
      <div className="grid gap-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/vagas/nova">Nova vaga</Link>
          </Button>
        </div>
        <EmptyState
          title="Nenhuma vaga cadastrada ainda"
          description="Comece criando a primeira vaga manualmente ou use a importacao por Excel para preencher a base."
          href={"/admin/vagas/nova" as never}
          actionLabel="Criar primeira vaga"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">Gerencie o ciclo de vida das vagas, do cadastro manual ate a ativacao.</p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <a href="/api/admin/jobs/export">Exportar CSV</a>
          </Button>
          <Button asChild>
            <Link href="/admin/vagas/nova">Nova vaga</Link>
          </Button>
        </div>
      </div>

      <form className="flex flex-wrap gap-3 rounded-[2rem] border border-slate-200 bg-white/90 p-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por titulo, empresa ou slug"
          className="h-12 min-w-[280px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          <option value="all">Todas</option>
          <option value="active">Ativas</option>
          <option value="inactive">Inativas</option>
          <option value="draft">Rascunho</option>
          <option value="scheduled">Agendada</option>
          <option value="published">Publicada</option>
          <option value="error">Erro</option>
        </select>
        <Button type="submit">Filtrar</Button>
      </form>

      <AdminJobsTable
        jobs={jobs.map((job) => ({
          id: job.id,
          title: job.title,
          slug: job.slug,
          companyName: job.companyName,
          isActive: job.isActive,
          status: job.status,
          publishedAt: job.publishedAt ? new Intl.DateTimeFormat("pt-BR").format(job.publishedAt) : "-",
          cityName: job.city.name,
          stateCode: job.state.code
        }))}
      />

      <PaginationNav
        page={page}
        totalPages={totalPages}
        buildHref={(pageNumber) => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (status !== "all") params.set("status", status);
          if (pageNumber > 1) params.set("page", String(pageNumber));
          const query = params.toString();
          return query ? `/admin/vagas?${query}` : "/admin/vagas";
        }}
      />
    </div>
  );
}
