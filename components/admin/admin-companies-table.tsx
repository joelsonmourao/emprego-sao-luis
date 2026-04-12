"use client";

import { useState } from "react";
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

export function AdminCompaniesTable({ companies }: { companies: CompanyRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleStatus(companyId: string, isActive: boolean) {
    setBusyId(companyId);
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
    await fetch(`/api/admin/companies/${companyId}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  async function duplicateCompany(companyId: string) {
    setBusyId(companyId);
    await fetch(`/api/admin/companies/${companyId}/duplicate`, { method: "POST" });
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
                      <Button size="sm" variant="secondary" disabled={busyId === company.id} onClick={() => toggleStatus(company.id, company.isActive)}>
                        <Power className="mr-2 h-4 w-4" />
                        {company.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === company.id} onClick={() => duplicateCompany(company.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === company.id} onClick={() => deleteCompany(company.id)}>
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
