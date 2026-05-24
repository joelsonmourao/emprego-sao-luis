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

  async function resend(jobId: string) {
    setBusyJobId(jobId);
    await fetch(`/api/admin/jobs/${jobId}/submit-indexing`, { method: "POST" });
    setBusyJobId(null);
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/95">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
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
