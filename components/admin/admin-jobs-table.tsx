"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Power, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type JobRow = {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  isActive: boolean;
  publishedAt: string;
  cityName: string;
  stateCode: string;
};

type BulkDeleteResponse = {
  ok: boolean;
  error?: string;
  deletedCount?: number;
  deletedIds?: string[];
  errors?: Array<{ id: string; error: string }>;
};

export function AdminJobsTable({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const visibleIds = useMemo(() => jobs.map((job) => job.id), [jobs]);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const selectedCount = selectedIds.length;

  function toggleSelection(jobId: string, checked: boolean) {
    setSelectedIds((current) => (checked ? [...new Set([...current, jobId])] : current.filter((id) => id !== jobId)));
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? visibleIds : []);
  }

  async function toggleStatus(jobId: string, isActive: boolean) {
    setBusyId(jobId);
    setFeedback("");
    await fetch(`/api/admin/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive })
    });
    setBusyId(null);
    router.refresh();
  }

  async function deleteJob(jobId: string) {
    const confirmed = window.confirm("Deseja excluir esta vaga?");
    if (!confirmed) return;

    setBusyId(jobId);
    setFeedback("");
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "DELETE"
    });
    setSelectedIds((current) => current.filter((id) => id !== jobId));
    setBusyId(null);
    router.refresh();
  }

  async function duplicateJob(jobId: string) {
    setBusyId(jobId);
    setFeedback("");
    await fetch(`/api/admin/jobs/${jobId}/duplicate`, {
      method: "POST"
    });
    setBusyId(null);
    router.refresh();
  }

  async function bulkDelete() {
    if (!selectedCount) return;

    const confirmed = window.confirm(`Deseja excluir ${selectedCount} vaga(s) selecionada(s)? Essa acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setBusyId("bulk-delete");
    setFeedback("");

    const response = await fetch("/api/admin/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "jobs", ids: selectedIds })
    });

    const result = (await response.json()) as BulkDeleteResponse;
    setBusyId(null);

    if (!response.ok || !result.ok) {
      setFeedback(result.error ?? "Nao foi possivel excluir as vagas selecionadas.");
      return;
    }

    setSelectedIds([]);
    const deletedCount = result.deletedCount ?? 0;
    const errorCount = result.errors?.length ?? 0;
    setFeedback(
      errorCount
        ? `${deletedCount} vaga(s) removida(s). ${errorCount} item(ns) nao puderam ser excluidos.`
        : `${deletedCount} vaga(s) removida(s) com sucesso.`
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
                aria-label="Selecionar todas as vagas desta pagina"
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
                <th className="px-6 py-4 font-semibold">Vaga</th>
                <th className="px-6 py-4 font-semibold">Local</th>
                <th className="px-6 py-4 font-semibold">Empresa</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Publicada</th>
                <th className="px-6 py-4 font-semibold text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(job.id)}
                      onChange={(event) => toggleSelection(job.id, event.target.checked)}
                      aria-label={`Selecionar vaga ${job.title}`}
                      className="h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-950">{job.title}</p>
                      <p className="text-xs text-slate-500">{job.companyName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {job.cityName}, {job.stateCode}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{job.companyName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        job.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {job.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{job.publishedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/vagas/${job.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button size="sm" variant="secondary" disabled={busyId === job.id || busyId === "bulk-delete"} onClick={() => toggleStatus(job.id, job.isActive)}>
                        <Power className="mr-2 h-4 w-4" />
                        {job.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === job.id || busyId === "bulk-delete"} onClick={() => duplicateJob(job.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === job.id || busyId === "bulk-delete"} onClick={() => deleteJob(job.id)}>
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
