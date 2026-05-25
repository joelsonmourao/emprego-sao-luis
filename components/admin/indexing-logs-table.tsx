"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  url: string;
  jobId: string | null;
  jobLabel: string;
  type: string;
  status: string;
  httpStatus: string;
  attemptedAt: string;
  response: string;
  error: string;
};

export function IndexingLogsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [olderThanDays, setOlderThanDays] = useState("30");
  const [message, setMessage] = useState("");

  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  async function resend(jobId: string) {
    setBusyJobId(jobId);
    await fetch(`/api/admin/jobs/${jobId}/submit-indexing`, { method: "POST" });
    setBusyJobId(null);
    router.refresh();
  }

  function toggleSelection(id: string, checked: boolean) {
    setSelectedIds((current) => (checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)));
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? rows.map((row) => row.id) : []);
  }

  async function deleteSingle(id: string) {
    const confirmed = window.confirm("Deseja apagar este log de indexacao?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/indexing-logs/${id}`, { method: "DELETE" });
    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Falha ao apagar log.");
    } else {
      setMessage("Log apagado com sucesso.");
      setSelectedIds((current) => current.filter((item) => item !== id));
      router.refresh();
    }
  }

  async function previewBulkDelete(payload: {
    ids?: string[];
    status?: "ERROR" | "SKIPPED";
    olderThanDays?: number;
  }) {
    const response = await fetch("/api/admin/indexing-logs/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, dryRun: true })
    });
    const result = (await response.json()) as { ok: boolean; error?: string; matchedCount?: number };
    if (!response.ok || !result.ok) {
      throw new Error(result.error ?? "Falha ao calcular a quantidade de logs para exclusao.");
    }
    return result.matchedCount ?? 0;
  }

  async function bulkDelete(
    payload: { ids?: string[]; status?: "ERROR" | "SKIPPED"; olderThanDays?: number },
    successMessage: string,
    confirmMessage: (matched: number) => string
  ) {
    try {
      const matched = await previewBulkDelete(payload);
      if (matched === 0) {
        setMessage("Nenhum log encontrado para o criterio informado.");
        return;
      }

      const confirmed = window.confirm(confirmMessage(matched));
      if (!confirmed) return;

      const response = await fetch("/api/admin/indexing-logs/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { ok: boolean; error?: string; deletedCount?: number };
      if (!response.ok || !result.ok) {
        setMessage(result.error ?? "Falha ao apagar logs.");
        return;
      }
      setMessage(`${successMessage} (${result.deletedCount ?? 0} item(ns)).`);
      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao preparar exclusao em massa.");
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/95">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            bulkDelete(
              { ids: selectedIds },
              "Logs selecionados apagados",
              (matched) => `Confirmar exclusao de ${matched} log(s) selecionado(s)? Esta acao nao pode ser desfeita.`
            )
          }
          disabled={!selectedIds.length}
        >
          Apagar selecionados
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            bulkDelete(
              { status: "ERROR" },
              "Logs com erro apagados",
              (matched) => `Foram encontrados ${matched} log(s) com status ERROR. Deseja apagar todos?`
            )
          }
        >
          Apagar todos os logs com erro
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            bulkDelete(
              { status: "SKIPPED" },
              "Logs SKIPPED apagados",
              (matched) => `Foram encontrados ${matched} log(s) com status SKIPPED. Deseja apagar todos?`
            )
          }
        >
          Apagar todos os logs SKIPPED
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={olderThanDays}
            onChange={(event) => setOlderThanDays(event.target.value)}
            className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              bulkDelete(
                { olderThanDays: Number(olderThanDays) || 30 },
                "Logs antigos removidos",
                (matched) =>
                  `Foram encontrados ${matched} log(s) mais antigos que ${Number(olderThanDays) || 30} dia(s). Deseja remover?`
              )
            }
          >
            Limpar logs antigos
          </Button>
        </div>
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
                  aria-label="Selecionar todos os logs"
                />
              </th>
              <th className="px-6 py-4 font-semibold">URL</th>
              <th className="px-6 py-4 font-semibold">Vaga</th>
              <th className="px-6 py-4 font-semibold">Tipo</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">HTTP</th>
              <th className="px-6 py-4 font-semibold">Data/hora</th>
              <th className="px-6 py-4 font-semibold">Resposta</th>
              <th className="px-6 py-4 font-semibold">Erro</th>
              <th className="px-6 py-4 font-semibold text-right">Acao</th>
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
                    aria-label={`Selecionar log ${row.id}`}
                  />
                </td>
                <td className="px-6 py-4">{row.url}</td>
                <td className="px-6 py-4">{row.jobLabel}</td>
                <td className="px-6 py-4">{row.type}</td>
                <td className="px-6 py-4">{row.status}</td>
                <td className="px-6 py-4">{row.httpStatus}</td>
                <td className="px-6 py-4">{row.attemptedAt}</td>
                <td className="px-6 py-4">{row.response}</td>
                <td className="px-6 py-4">{row.error || "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {row.jobId ? (
                      <Button size="sm" variant="outline" onClick={() => resend(row.jobId!)} disabled={busyJobId === row.jobId}>
                        Reenviar
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" onClick={() => deleteSingle(row.id)}>
                      Apagar log
                    </Button>
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
