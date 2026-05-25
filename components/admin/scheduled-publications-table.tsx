"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
  status: string;
  scheduledAt: string;
  scheduleSource: string;
  publishedAt: string;
  indexingStatus: string;
  indexingLastSubmittedAt: string;
  error: string;
  url: string;
};

export function ScheduledPublicationsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  async function callAction(jobId: string, action: "publish-now" | "cancel-schedule" | "submit-indexing") {
    setBusyId(jobId);
    setMessage("");
    const response = await fetch(`/api/admin/jobs/${jobId}/${action}`, { method: "POST" });
    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Falha ao executar acao.");
    } else {
      setMessage("Acao executada com sucesso.");
    }
    setBusyId(null);
    router.refresh();
  }

  function toggleSelection(id: string, checked: boolean) {
    setSelectedIds((current) => (checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)));
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? rows.map((row) => row.id) : []);
  }

  async function deleteJobs(ids: string[]) {
    if (!ids.length) return;
    setMessage("");
    const response = await fetch("/api/admin/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "jobs", ids })
    });
    const result = (await response.json()) as { ok: boolean; error?: string; deletedCount?: number };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Falha ao apagar vagas selecionadas.");
      return;
    }
    setMessage(`${result.deletedCount ?? 0} vaga(s) apagada(s) com sucesso.`);
    setSelectedIds([]);
    router.refresh();
  }

  async function rescheduleJob(jobId: string) {
    const input = window.prompt("Informe a nova dataHoraPublicacao (dd/MM/yyyy HH:mm):");
    if (!input?.trim()) return;
    setBusyId(jobId);
    setMessage("");
    const response = await fetch(`/api/admin/jobs/${jobId}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataHoraPublicacao: input.trim() })
    });
    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Falha ao reagendar vaga.");
    } else {
      setMessage("Vaga reagendada com sucesso.");
    }
    setBusyId(null);
    router.refresh();
  }

  async function fixScheduledImport() {
    const confirmed = window.confirm(
      "Confirmar a correcao da importacao agendada? Essa acao vai reagendar vagas publicadas indevidamente."
    );
    if (!confirmed) return;
    setMessage("");
    const response = await fetch("/api/admin/jobs/fix-scheduled-import", { method: "POST" });
    const result = (await response.json()) as {
      ok: boolean;
      error?: string;
      analisadas?: number;
      reagendadas?: number;
      ignoradas?: number;
      erros?: number;
    };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Falha ao corrigir importacao agendada.");
      return;
    }
    setMessage(
      `Correcao concluida: analisadas ${result.analisadas ?? 0}, reagendadas ${result.reagendadas ?? 0}, ignoradas ${result.ignoradas ?? 0}, erros ${result.erros ?? 0}.`
    );
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/95">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-4">
        <Button size="sm" variant="outline" onClick={() => deleteJobs(selectedIds)} disabled={!selectedIds.length}>
          Apagar selecionadas
        </Button>
        <Button size="sm" variant="outline" onClick={fixScheduledImport}>
          Corrigir importacao agendada
        </Button>
        <Button size="sm" variant="outline" onClick={fixScheduledImport}>
          Corrigir vagas publicadas indevidamente
        </Button>
      </div>
      {message ? <p className="border-b border-slate-100 px-6 py-3 text-sm text-slate-700">{message}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-4 font-semibold">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => toggleAll(event.target.checked)}
                  aria-label="Selecionar todas as vagas"
                />
              </th>
              <th className="px-6 py-4 font-semibold">Titulo</th>
              <th className="px-6 py-4 font-semibold">Empresa</th>
              <th className="px-6 py-4 font-semibold">Cidade/UF</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Agendada</th>
              <th className="px-6 py-4 font-semibold">Origem</th>
              <th className="px-6 py-4 font-semibold">Publicada</th>
              <th className="px-6 py-4 font-semibold">Indexacao</th>
              <th className="px-6 py-4 font-semibold">Ultimo envio</th>
              <th className="px-6 py-4 font-semibold">Erro</th>
              <th className="px-6 py-4 font-semibold text-right">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={(event) => toggleSelection(row.id, event.target.checked)}
                    aria-label={`Selecionar vaga ${row.title}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-950">{row.title}</p>
                </td>
                <td className="px-6 py-4">{row.companyName}</td>
                <td className="px-6 py-4">{row.city}, {row.state}</td>
                <td className="px-6 py-4">{row.status}</td>
                <td className="px-6 py-4">{row.scheduledAt}</td>
                <td className="px-6 py-4">{row.scheduleSource}</td>
                <td className="px-6 py-4">{row.publishedAt}</td>
                <td className="px-6 py-4">{row.indexingStatus}</td>
                <td className="px-6 py-4">{row.indexingLastSubmittedAt}</td>
                <td className="px-6 py-4">{row.error || "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => callAction(row.id, "publish-now")} disabled={busyId === row.id}>
                      Publicar agora
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => callAction(row.id, "cancel-schedule")} disabled={busyId === row.id}>
                      Cancelar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rescheduleJob(row.id)} disabled={busyId === row.id}>
                      Reagendar vaga
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => callAction(row.id, "submit-indexing")}
                      disabled={busyId === row.id || row.status !== "PUBLISHED"}
                    >
                      Reenviar indexacao
                    </Button>
                    {row.url ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={row.url} target="_blank" rel="noreferrer">
                          Ver vaga
                        </a>
                      </Button>
                    ) : null}
                    {row.status === "ERROR" ? (
                      <Button size="sm" variant="outline" onClick={() => deleteJobs([row.id])}>
                        Apagar vaga com erro
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
