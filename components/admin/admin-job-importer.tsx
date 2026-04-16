"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeSlug, parseBooleanLike, parseOptionalNumber } from "@/lib/admin/content";
import { importedJobRowSchema, type ImportedJobRow } from "@/lib/schemas/job-import";

const aliases: Record<string, string> = {
  title: "title",
  titulo: "title",
  slug: "slug",
  company: "companyName",
  empresa: "companyName",
  city: "cityName",
  cidade: "cityName",
  state: "stateName",
  estado: "stateName",
  description: "descriptionHtml",
  descricao: "descriptionHtml",
  requirements: "requirementsText",
  requisitos: "requirementsText",
  benefits: "benefitsText",
  beneficios: "benefitsText",
  salary: "salaryMin",
  salario: "salaryMin",
  salarymin: "salaryMin",
  salarymax: "salaryMax",
  employmenttype: "employmentType",
  workhours: "workHours",
  jornada: "workHours",
  publishedat: "publishedAt",
  expiresat: "expiresAt",
  validthrough: "validThrough",
  applyurl: "applyUrl",
  isactive: "isActive",
  active: "isActive",
  source: "sourceName",
  sourcename: "sourceName",
  sourceurl: "sourceUrl",
  locationtype: "locationType",
  seotitle: "seoTitle",
  seodescription: "seoDescription",
  externalid: "externalId",
  resumo: "summary",
  summary: "summary",
  featured: "featured"
};

type ParsedPreview = {
  index: number;
  valid: boolean;
  errors: string[];
  data?: ImportedJobRow;
};

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function AdminJobImporter() {
  const [rows, setRows] = useState<ParsedPreview[]>([]);
  const [fileName, setFileName] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const validRows = useMemo(() => rows.filter((row) => row.valid && row.data).map((row) => row.data as ImportedJobRow), [rows]);
  const invalidRows = rows.filter((row) => !row.valid);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResultMessage("");

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

    const parsed = jsonRows.map((rawRow, index) => {
      const normalized: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(rawRow)) {
        const mapped = aliases[normalizeHeader(key)];
        if (mapped) normalized[mapped] = value;
      }

      const candidate = {
        title: String(normalized.title ?? "").trim(),
        slug: String(normalized.slug ?? "").trim() || normalizeSlug(String(normalized.title ?? "")),
        companyName: String(normalized.companyName ?? "").trim(),
        cityName: String(normalized.cityName ?? "").trim(),
        stateName: String(normalized.stateName ?? "").trim(),
        summary: String(normalized.summary ?? normalized.descriptionHtml ?? "").trim().slice(0, 220),
        descriptionHtml: String(normalized.descriptionHtml ?? "").trim(),
        requirementsText: String(normalized.requirementsText ?? "").trim(),
        benefitsText: String(normalized.benefitsText ?? "").trim(),
        salaryMin: parseOptionalNumber(normalized.salaryMin),
        salaryMax: parseOptionalNumber(normalized.salaryMax),
        employmentType: String(normalized.employmentType ?? "APPRENTICESHIP").trim().toUpperCase(),
        workHours: String(normalized.workHours ?? "").trim(),
        publishedAt: String(normalized.publishedAt ?? "").trim(),
        expiresAt: String(normalized.expiresAt ?? "").trim(),
        validThrough: String(normalized.validThrough ?? "").trim(),
        validThroughMonths: parseOptionalNumber(normalized.validThroughMonths),
        applyUrl: String(normalized.applyUrl ?? "").trim(),
        isActive: parseBooleanLike(normalized.isActive ?? true),
        sourceName: String(normalized.sourceName ?? "").trim(),
        sourceUrl: String(normalized.sourceUrl ?? "").trim(),
        locationType: String(normalized.locationType ?? "ONSITE").trim().toUpperCase(),
        seoTitle: String(normalized.seoTitle ?? normalized.title ?? "").trim(),
        seoDescription: String(normalized.seoDescription ?? normalized.summary ?? "").trim(),
        featured: parseBooleanLike(normalized.featured ?? false),
        externalId: String(normalized.externalId ?? "").trim()
      };

      const parsedRow = importedJobRowSchema.safeParse(candidate);

      return {
        index: index + 2,
        valid: parsedRow.success,
        errors: parsedRow.success ? [] : parsedRow.error.issues.map((issue) => issue.message),
        data: parsedRow.success ? parsedRow.data : undefined
      };
    });

    setRows(parsed);
  }

  async function handleImport() {
    if (!validRows.length) {
      setResultMessage("Nenhuma linha valida disponivel para importacao.");
      return;
    }

    setIsImporting(true);
    setResultMessage("");

    try {
      const response = await fetch("/api/admin/import/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: validRows })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        // Mostrar erro detalhado do Prisma/Backend
        const errorMessage = result.error || result.details || "Nao foi possivel importar a planilha.";
        setResultMessage(`ERRO: ${errorMessage}`);
        
        // Se houver erros específicos, mostrar no console
        if (result.debug?.errorDetails && result.debug.errorDetails.length > 0) {
          console.error("Erros da importação:", result.debug.errorDetails);
        }
        setIsImporting(false);
        return;
      }

      // Resposta de sucesso com detalhes
      const summary = result.summary || {};
      const successRate = summary.successRate || 0;
      
      let message = `Importação concluída: ${summary.importedCount || 0} nova(s) vaga(s) e ${summary.updatedCount || 0} atualizada(s).`;
      
      if (successRate < 100 && summary.errorCount > 0) {
        message += ` (${summary.errorCount} erro(s) - Taxa de sucesso: ${successRate}%)`;
        
        // Mostrar erros específicos se houver
        if (result.results?.errors && result.results.errors.length > 0) {
          const errorDetails = result.results.errors.map((e: any) => `Linha ${e.line}: ${e.message}`).join('; ');
          console.error("Detalhes dos erros:", errorDetails);
          message += ` Verifique o console para detalhes.`;
        }
      }
      
      setResultMessage(message);
      
      // Log detalhado para depuração
      console.log("Resultado da importação:", result);
      
    } catch (error) {
      console.error("Erro na requisição de importação:", error);
      setResultMessage(`ERRO DE REDE: ${error instanceof Error ? error.message : 'Falha na comunicação com o servidor'}`);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <CardTitle>Importar vagas por Excel</CardTitle>
          <CardDescription>
            Envie uma planilha `.xlsx` com colunas como `title`, `company`, `city`, `state`, `description`, `applyUrl` e os campos SEO.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-sky-300 bg-sky-50 px-6 py-10 text-center text-sm text-sky-900 transition hover:border-sky-400 hover:bg-sky-100/70">
            <Upload className="h-5 w-5" />
            <span>{fileName ? `Arquivo selecionado: ${fileName}` : "Selecionar planilha Excel (.xlsx)"}</span>
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Validas</p>
              <p className="mt-2 text-3xl font-black text-emerald-900">{validRows.length}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Invalidas</p>
              <p className="mt-2 text-3xl font-black text-rose-900">{invalidRows.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Total</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{rows.length}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" size="lg" onClick={handleImport} disabled={isImporting || !validRows.length}>
              {isImporting ? "Importando..." : "Importar linhas validas"}
            </Button>
          </div>

          {resultMessage ? <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{resultMessage}</p> : null}
        </CardContent>
      </Card>

      {rows.length ? (
        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader>
            <CardTitle>Pre-visualizacao da importacao</CardTitle>
            <CardDescription>Confira linhas validas e erros por linha antes de salvar no banco.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {rows.map((row) => (
                <div key={row.index} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Linha {row.index}</p>
                      <p className="text-xs text-slate-500">{row.data?.title ?? "Linha com erro de validacao"}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${row.valid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {row.valid ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      {row.valid ? "Valida" : "Invalida"}
                    </span>
                  </div>
                  {row.valid ? (
                    <div className="mt-3 text-sm text-slate-600">
                      {row.data?.companyName} • {row.data?.cityName}, {row.data?.stateName}
                    </div>
                  ) : (
                    <ul className="mt-3 space-y-2 text-sm text-rose-700">
                      {row.errors.map((error) => (
                        <li key={error}>- {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
