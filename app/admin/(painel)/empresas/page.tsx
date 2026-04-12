import Link from "next/link";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { PaginationNav } from "@/components/pagination-nav";
import { AdminCompaniesTable } from "@/components/admin/admin-companies-table";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCompaniesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q.trim() : "";
  const status = typeof raw.status === "string" ? raw.status : "all";
  const page = Math.max(1, Number(typeof raw.page === "string" ? raw.page : "1") || 1);

  const where: Prisma.CompanyWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } }
    ];
  }

  if (status === "active") where.isActive = true;
  if (status === "inactive") where.isActive = false;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        city: true,
        state: true,
        _count: { select: { jobs: true } }
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 12,
      skip: (page - 1) * 12
    }),
    prisma.company.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / 12));

  if (!companies.length) {
    return (
      <div className="grid gap-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/empresas/nova">Nova empresa</Link>
          </Button>
        </div>
        <EmptyState title="Nenhuma empresa cadastrada ainda" description="Cadastre as empresas primeiro para ligar as vagas a perfis reais." href={"/admin/empresas/nova" as never} actionLabel="Criar primeira empresa" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">Gerencie empresas, logos, perfis publicos e a base usada nas vagas.</p>
        <Button asChild>
          <Link href="/admin/empresas/nova">Nova empresa</Link>
        </Button>
      </div>

      <form className="flex flex-wrap gap-3 rounded-[2rem] border border-slate-200 bg-white/90 p-4">
        <input type="search" name="q" defaultValue={q} placeholder="Buscar por nome ou slug" className="h-12 min-w-[280px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
        <select name="status" defaultValue={status} className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
          <option value="all">Todas</option>
          <option value="active">Ativas</option>
          <option value="inactive">Inativas</option>
        </select>
        <Button type="submit">Filtrar</Button>
      </form>

      <AdminCompaniesTable
        companies={companies.map((company) => ({
          id: company.id,
          name: company.name,
          slug: company.slug,
          cityName: company.city.name,
          stateCode: company.state.code,
          jobCount: company._count.jobs,
          isActive: company.isActive,
          updatedAt: new Intl.DateTimeFormat("pt-BR").format(company.updatedAt)
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
          return query ? `/admin/empresas?${query}` : "/admin/empresas";
        }}
      />
    </div>
  );
}
