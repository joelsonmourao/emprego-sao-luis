"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AlertTriangle, CalendarClock, CheckCircle2, Download, FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeSlug, parseBooleanLike, parseOptionalNumber } from "@/lib/admin/content";
import { scheduledJobUploadRowSchema, type ScheduledJobUploadItem, type ScheduledJobUploadRow } from "@/lib/schemas/scheduled-job-upload";
import { formatScheduledAtDisplay } from "@/lib/timezone";

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
  expiresat: "expiresAt",
  validthrough: "validThrough",
  validthroughmonths: "validThroughMonths",
  mesesvalidade: "validThroughMonths",
  applyurl: "applyUrl",
  source: "sourceName",
  sourcename: "sourceName",
  sourceurl: "sourceUrl",
  locationtype: "locationType",
  seotitle: "seoTitle",
  seodescription: "seoDescription",
  externalid: "externalId",
  resumo: "summary",
  summary: "summary",
  featured: "featured",
  datahorapublicacao: "dataHoraPublicacao",
  datahora: "dataHoraPublicacao",
  data_publicacao: "dataHoraPublicacao",
  publicacao_agendada: "dataHoraPublicacao"
};

type ParsedPreview = {
  index: number;
  valid: boolean;
  errors: string[];
  uploadItem: ScheduledJobUploadItem;
  data?: ScheduledJobUploadRow;
};

type UploadAuditResult = {
  numeroLinhaExcel: number;
  externalIdOriginal: string;
  externalIdFinal: string;
  applyUrl: string;
  slugOriginal: string;
  slugFinal: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
  dataHoraPublicacaoOriginal: string;
  dataHoraPublicacaoConvertida: string;
  resultado: "AGENDADA" | "PUBLICADA_IMEDIATAMENTE" | "ATUALIZADA" | "IGNORADA_SEM_MUDANCA" | "JA_PUBLICADA_PRESERVADA" | "ERRO";
  motivo: string;
  jobId: string;
};

type UploadApiResponse = {
  ok: boolean;
  error?: string;
  totalRows?: number;
  validRows?: number;
  scheduled?: number;
  publishedImmediately?: number;
  updated?: number;
  ignored?: number;
  preservedPublished?: number;
  errors?: number;
  results?: UploadAuditResult[];
};

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

async function parseUploadResponse(response: Response): Promise<UploadApiResponse> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!body.trim()) {
    return {
      ok: false,
      error: response.ok ? "Resposta vazia do servidor." : `Resposta ${response.status} sem corpo.`
    };
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(body) as UploadApiResponse;
    } catch {
      return { ok: false, error: "JSON invalido na resposta." };
    }
  }

  return { ok: false, error: body.slice(0, 240) };
}

export function AdminScheduledJobUpload() {
  const [rows, setRows] = useState<ParsedPreview[]>([]);
  const [fileName, setFileName] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [auditRows, setAuditRows] = useState<UploadAuditResult[]>([]);
  const [auditFilter, setAuditFilter] = useState<
    "ALL" | "AGENDADA" | "PUBLICADA_IMEDIATAMENTE" | "ATUALIZADA" | "IGNORADA_SEM_MUDANCA" | "JA_PUBLICADA_PRESERVADA" | "ERRO"
  >("ALL");

  const validRows = useMemo(
    () => rows.filter((row) => row.valid && row.data).map((row) => row.data as ScheduledJobUploadRow),
    [rows]
  );
  const invalidRows = rows.filter((row) => !row.valid);
  const filteredAuditRows = useMemo(
    () => (auditFilter === "ALL" ? auditRows : auditRows.filter((row) => row.resultado === auditFilter)),
    [auditRows, auditFilter]
  );

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
        slug:
          String(normalized.slug ?? "").trim() ||
          normalizeSlug(String(normalized.title ?? normalized.seoTitle ?? "")),
        companyName: String(normalized.companyName ?? "").trim(),
        cityName: String(normalized.cityName ?? "").trim(),
        stateName: String(normalized.stateName ?? "").trim(),
        summary: String(normalized.summary ?? normalized.descriptionHtml ?? "").trim().slice(0, 220),
        descriptionHtml: String(normalized.descriptionHtml ?? "").trim(),
        requirementsText: String(normalized.requirementsText ?? "").trim(),
        benefitsText: String(normalized.benefitsText ?? "").trim(),
        salaryMin: parseOptionalNumber(normalized.salaryMin),
        salaryMax: parseOptionalNumber(normalized.salaryMax),
        employmentType: String(normalized.employmentType ?? "").trim(),
        workHours: String(normalized.workHours ?? "").trim(),
        expiresAt: String(normalized.expiresAt ?? "").trim(),
        validThrough: String(normalized.validThrough ?? "").trim(),
        validThroughMonths: parseOptionalNumber(normalized.validThroughMonths),
        applyUrl: String(normalized.applyUrl ?? "").trim(),
        sourceName: String(normalized.sourceName ?? "").trim(),
        sourceUrl: String(normalized.sourceUrl ?? "").trim(),
        locationType: String(normalized.locationType ?? "ONSITE").trim().toUpperCase(),
        seoTitle: String(normalized.seoTitle ?? normalized.title ?? "").trim(),
        seoDescription: String(normalized.seoDescription ?? normalized.summary ?? "").trim(),
        featured: parseBooleanLike(normalized.featured ?? false),
        externalId: String(normalized.externalId ?? "").trim(),
        dataHoraPublicacao: normalized.dataHoraPublicacao ?? ""
      };

      const parsedRow = scheduledJobUploadRowSchema.safeParse(candidate);

      return {
        index: index + 2,
        valid: parsedRow.success,
        errors: parsedRow.success ? [] : parsedRow.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
        uploadItem: {
          numeroLinhaExcel: index + 2,
          row: candidate
        },
        data: parsedRow.success ? parsedRow.data : undefined
      };
    });

    setRows(parsed);
  }

  async function handleUpload() {
    if (!rows.length) {
      setResultMessage("Nenhuma linha encontrada para enviar.");
      return;
    }

    setIsUploading(true);
    setResultMessage("");

    try {
      const response = await fetch("/api/admin/jobs/scheduled-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: rows.map((item) => item.uploadItem) })
      });

      const result = await parseUploadResponse(response);

      if (!response.ok) {
        setResultMessage(`ERRO: ${result.error ?? "Falha HTTP no upload."}`);
        return;
      }

      const summary = {
        totalRows: result.totalRows ?? rows.length,
        validRows: result.validRows ?? 0,
        scheduled: result.scheduled ?? 0,
        publishedImmediately: result.publishedImmediately ?? 0,
        updated: result.updated ?? 0,
        ignored: result.ignored ?? 0,
        preservedPublished: result.preservedPublished ?? 0,
        errors: result.errors ?? 0
      };
      setAuditRows(result.results ?? []);
      setResultMessage(
        `Importacao concluida.\nTotal lidas: ${summary.totalRows}\nValidas: ${summary.validRows}\nAgendadas: ${summary.scheduled}\nPublicadas imediatamente: ${summary.publishedImmediately}\nAtualizadas: ${summary.updated}\nIgnoradas sem mudanca: ${summary.ignored}\nJa publicadas preservadas: ${summary.preservedPublished}\nErros: ${summary.errors}`
      );
    } catch (error) {
      setResultMessage(`ERRO DE REDE: ${error instanceof Error ? error.message : "Falha na comunicacao."}`);
    } finally {
      setIsUploading(false);
    }
  }

  function handleDownloadAudit() {
    if (!filteredAuditRows.length) {
      setResultMessage("Nenhuma auditoria disponivel para exportar.");
      return;
    }

    const exportRows = filteredAuditRows.map((row) => ({
      linha: row.numeroLinhaExcel,
      externalIdOriginal: row.externalIdOriginal,
      externalIdFinal: row.externalIdFinal,
      applyUrl: row.applyUrl,
      slugOriginal: row.slugOriginal,
      slugFinal: row.slugFinal,
      title: row.title,
      companyName: row.companyName,
      city: row.city,
      state: row.state,
      dataHoraPublicacaoOriginal: row.dataHoraPublicacaoOriginal,
      dataHoraPublicacaoConvertida: row.dataHoraPublicacaoConvertida,
      resultado: row.resultado,
      motivo: row.motivo,
      jobId: row.jobId
    }));

    const sheet = XLSX.utils.json_to_sheet(exportRows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Auditoria");
    XLSX.writeFile(book, `auditoria-importacao-agendada-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <CalendarClock className="h-6 w-6" />
        </div>
        <CardTitle>Upload de planilha agendada</CardTitle>
        <CardDescription>
          Obrigatorios: <strong>seoTitle</strong>, <strong>seoDescription</strong>, <strong>description</strong>,{" "}
          <strong>applyUrl</strong>, <strong>city</strong> e <strong>state</strong>. O campo <strong>dataHoraPublicacao</strong> e usado para
          agendamento e nao e obrigatorio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-amber-300 bg-amber-50/80 px-6 py-10 text-center text-sm text-amber-950 transition hover:border-amber-400 hover:bg-amber-100/80">
          <Upload className="h-5 w-5" />
          <span>{fileName ? `Arquivo: ${fileName}` : "Selecionar Excel (.xlsx) com dataHoraPublicacao"}</span>
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
          <Button type="button" size="lg" onClick={handleUpload} disabled={isUploading || !rows.length}>
            {isUploading ? "Salvando..." : "Salvar vagas agendadas no banco"}
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={handleDownloadAudit} disabled={!filteredAuditRows.length}>
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar Excel de auditoria
            </span>
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          O Excel de auditoria exporta o mesmo relatorio linha a linha exibido abaixo.
        </p>

        {resultMessage ? <p className="whitespace-pre-line rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{resultMessage}</p> : null}

        {auditRows.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-slate-900">Auditoria da importacao</p>
              <select
                value={auditFilter}
                onChange={(event) =>
                  setAuditFilter(
                    event.target.value as "ALL" | "AGENDADA" | "PUBLICADA_IMEDIATAMENTE" | "ATUALIZADA" | "IGNORADA_SEM_MUDANCA" | "JA_PUBLICADA_PRESERVADA" | "ERRO"
                  )
                }
                className="h-9 rounded-xl border border-slate-200 px-3 text-xs"
              >
                <option value="ALL">Todas</option>
                <option value="AGENDADA">Agendadas</option>
                <option value="PUBLICADA_IMEDIATAMENTE">Publicadas imediatamente</option>
                <option value="ATUALIZADA">Atualizadas</option>
                <option value="IGNORADA_SEM_MUDANCA">Ignoradas sem mudanca</option>
                <option value="JA_PUBLICADA_PRESERVADA">Ja publicadas preservadas</option>
                <option value="ERRO">Erros</option>
              </select>
            </div>
            <div className="max-h-[360px] overflow-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Linha</th>
                    <th className="px-3 py-2 text-left">External ID original/final</th>
                    <th className="px-3 py-2 text-left">Slug original/final</th>
                    <th className="px-3 py-2 text-left">Apply URL</th>
                    <th className="px-3 py-2 text-left">Titulo</th>
                    <th className="px-3 py-2 text-left">Cidade/UF</th>
                    <th className="px-3 py-2 text-left">Data publicacao</th>
                    <th className="px-3 py-2 text-left">Resultado</th>
                    <th className="px-3 py-2 text-left">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditRows.map((row) => (
                    <tr key={`${row.numeroLinhaExcel}-${row.externalIdFinal}-${row.resultado}`} className="border-t border-slate-100">
                      <td className="px-3 py-2">{row.numeroLinhaExcel}</td>
                      <td className="px-3 py-2">
                        <div>{row.externalIdOriginal || "-"}</div>
                        <div className="text-slate-500">{row.externalIdFinal || "-"}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div>{row.slugOriginal || "-"}</div>
                        <div className="text-slate-500">{row.slugFinal || "-"}</div>
                      </td>
                      <td className="px-3 py-2">{row.applyUrl || "-"}</td>
                      <td className="px-3 py-2">{row.title || "-"}</td>
                      <td className="px-3 py-2">{row.city && row.state ? `${row.city}/${row.state}` : "-"}</td>
                      <td className="px-3 py-2">{row.dataHoraPublicacaoConvertida || row.dataHoraPublicacaoOriginal || "-"}</td>
                      <td className="px-3 py-2">{row.resultado}</td>
                      <td className="px-3 py-2">{row.motivo || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {rows.length ? (
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FileSpreadsheet className="h-4 w-4" />
              Pre-visualizacao
            </div>
            <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
              {rows.map((row) => (
                <div key={row.index} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-950">Linha {row.index}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.valid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {row.valid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {row.valid ? "OK" : "Erro"}
                    </span>
                  </div>
                  {row.valid ? (
                    <p className="mt-1 text-xs text-slate-600">
                      {row.data?.title} •{" "}
                      {(() => {
                        const raw = row.data?.dataHoraPublicacao;
                        if (raw == null || String(raw).trim() === "") return "Sem agendamento (DRAFT)";
                        return formatScheduledAtDisplay(raw) || String(raw);
                      })()}
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-xs text-rose-700">
                      {row.errors.map((e) => (
                        <li key={e}>- {e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
