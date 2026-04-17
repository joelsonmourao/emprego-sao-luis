"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Power, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CompanyRow = {
  id: string;
  name: string;
  slug: string;
  cityName: string;
  stateCode: string;
  jobCount: number;
  isActive: boolean;
  updatedAt: string;
};

type BulkDeleteResponse = {
  ok: boolean;
  error?: string;
  deletedCount?: number;
  deletedIds?: string[];
  errors?: Array<{ id: string; error: string }>;
  totals?: {
    jobsDeleted: number;
    companiesDeleted: number;
    citiesDeleted: number;
    statesDeleted: number;
    hubProfilesDeleted: number;
  };
};

export function AdminCompaniesTable({ companies }: { companies: CompanyRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const visibleIds = useMemo(() => companies.map((company) => company.id), [companies]);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const selectedCount = selectedIds.length;

  function toggleSelection(companyId: string, checked: boolean) {
    setSelectedIds((current) => (checked ? [...new Set([...current, companyId])] : current.filter((id) => id !== companyId)));
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? visibleIds : []);
  }

  async function toggleStatus(companyId: string, isActive: boolean) {
    setBusyId(companyId);
    setFeedback("");
    await fetch(`/api/admin/companies/${companyId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive })
    });
    setBusyId(null);
    router.refresh();
  }

  async function deleteCompany(companyId: string) {
    const confirmed = window.confirm("Deseja excluir esta empresa?");
    if (!confirmed) return;
    setBusyId(companyId);
    setFeedback("");
    await fetch(`/api/admin/companies/${companyId}`, { method: "DELETE" });
    setSelectedIds((current) => current.filter((id) => id !== companyId));
    setBusyId(null);
    router.refresh();
  }

  async function duplicateCompany(companyId: string) {
    setBusyId(companyId);
    setFeedback("");
    await fetch(`/api/admin/companies/${companyId}/duplicate`, { method: "POST" });
    setBusyId(null);
    router.refresh();
  }

  async function bulkDelete() {
    if (!selectedCount) return;

    const confirmed = window.confirm(
      `Deseja excluir ${selectedCount} empresa(s) selecionada(s)? As vagas vinculadas a essas empresas tambem serao removidas.`
    );
    if (!confirmed) return;

    setBusyId("bulk-delete");
    setFeedback("");

    const response = await fetch("/api/admin/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "companies", ids: selectedIds })
    });

    const result = (await response.json()) as BulkDeleteResponse;
    setBusyId(null);

    if (!response.ok || !result.ok) {
      setFeedback(result.error ?? "Nao foi possivel excluir as empresas selecionadas.");
      return;
    }

    setSelectedIds([]);
    const deletedCount = result.deletedCount ?? 0;
    const errorCount = result.errors?.length ?? 0;
    const deletedJobs = result.totals?.jobsDeleted ?? 0;
    const deletedProfiles = result.totals?.hubProfilesDeleted ?? 0;
    setFeedback(
      errorCount
        ? `${deletedCount} empresa(s) removida(s), ${deletedJobs} vaga(s) vinculada(s) apagada(s) e ${deletedProfiles} perfil(is) SEO removido(s). ${errorCount} item(ns) apresentaram erro.`
        : `${deletedCount} empresa(s) removida(s) com sucesso, junto com ${deletedJobs} vaga(s) vinculada(s) e ${deletedProfiles} perfil(is) SEO.`
    );
    router.refresh();
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => toggleAll(event.target.checked)}
                aria-label="Selecionar todas as empresas desta pagina"
                className="h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
              />
              <span>Selecionar todas da pagina</span>
            </label>
            <span>{selectedCount} selecionada(s)</span>
          </div>
          <Button type="button" variant="outline" disabled={!selectedCount || busyId === "bulk-delete"} onClick={bulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir selecionadas
          </Button>
        </div>
        {feedback ? <p className="border-b border-slate-100 px-6 py-3 text-sm text-slate-600">{feedback}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-4 font-semibold">
                  <span className="sr-only">Selecao</span>
                </th>
                <th className="px-6 py-4 font-semibold">Empresa</th>
                <th className="px-6 py-4 font-semibold">Local</th>
                <th className="px-6 py-4 font-semibold">Vagas</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Atualizada</th>
                <th className="px-6 py-4 font-semibold text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(company.id)}
                      onChange={(event) => toggleSelection(company.id, event.target.checked)}
                      aria-label={`Selecionar empresa ${company.name}`}
                      className="h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-950">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {company.cityName}, {company.stateCode}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{company.jobCount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${company.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {company.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{company.updatedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/empresas/${company.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button size="sm" variant="secondary" disabled={busyId === company.id || busyId === "bulk-delete"} onClick={() => toggleStatus(company.id, company.isActive)}>
                        <Power className="mr-2 h-4 w-4" />
                        {company.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === company.id || busyId === "bulk-delete"} onClick={() => duplicateCompany(company.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === company.id || busyId === "bulk-delete"} onClick={() => deleteCompany(company.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
