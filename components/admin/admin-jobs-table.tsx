"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Power, Trash2, Copy } from "lucide-react";

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

export function AdminJobsTable({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleStatus(jobId: string, isActive: boolean) {
    setBusyId(jobId);
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
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "DELETE"
    });
    setBusyId(null);
    router.refresh();
  }

  async function duplicateJob(jobId: string) {
    setBusyId(jobId);
    await fetch(`/api/admin/jobs/${jobId}/duplicate`, {
      method: "POST"
    });
    setBusyId(null);
    router.refresh();
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
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
                      <Button size="sm" variant="secondary" disabled={busyId === job.id} onClick={() => toggleStatus(job.id, job.isActive)}>
                        <Power className="mr-2 h-4 w-4" />
                        {job.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === job.id} onClick={() => duplicateJob(job.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === job.id} onClick={() => deleteJob(job.id)}>
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
