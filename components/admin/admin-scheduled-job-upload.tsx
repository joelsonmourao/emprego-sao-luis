"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AlertTriangle, CalendarClock, CheckCircle2, Download, FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeSlug, parseBooleanLike, parseOptionalNumber } from "@/lib/admin/content";
import { scheduledJobUploadRowSchema, type ScheduledJobUploadRow } from "@/lib/schemas/scheduled-job-upload";
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
  data?: ScheduledJobUploadRow;
};

type UploadApiResponse = {
  ok: boolean;
  error?: string;
  summary?: {
    totalRows: number;
    saved: number;
    errors: number;
  };
  imported?: string[];
  issues?: Array<{ line: number; message: string }>;
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

  const validRows = useMemo(
    () => rows.filter((row) => row.valid && row.data).map((row) => row.data as ScheduledJobUploadRow),
    [rows]
  );
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
        title: String(normalized.title ?? normalized.seoTitle ?? "").trim(),
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
        data: parsedRow.success ? parsedRow.data : undefined
      };
    });

    setRows(parsed);
  }

  async function handleUpload() {
    if (!validRows.length) {
      setResultMessage("Nenhuma linha valida para enviar.");
      return;
    }

    setIsUploading(true);
    setResultMessage("");

    try {
      const response = await fetch("/api/admin/jobs/scheduled-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: validRows })
      });

      const result = await parseUploadResponse(response);

      if (!response.ok) {
        setResultMessage(`ERRO: ${result.error ?? "Falha HTTP no upload."}`);
        return;
      }

      if (!result.ok) {
        const summary = result.summary;
        const msg = [
          result.error ?? "Upload concluido com erros em parte das linhas.",
          summary ? `Salvas: ${summary.saved}. Falhas: ${summary.errors}.` : ""
        ]
          .filter(Boolean)
          .join(" ");
        setResultMessage(msg);
        if (result.issues?.length) {
          console.error("Linhas com problema:", result.issues);
        }
        return;
      }

      const summary = result.summary ?? { totalRows: validRows.length, saved: 0, errors: 0 };
      setResultMessage(
        `Processamento concluido: ${summary.saved} vaga(s) importada(s). Revise os status SCHEDULED, DRAFT ou ERROR na tela de divulgacoes agendadas.`
      );
    } catch (error) {
      setResultMessage(`ERRO DE REDE: ${error instanceof Error ? error.message : "Falha na comunicacao."}`);
    } finally {
      setIsUploading(false);
    }
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
          <Button type="button" size="lg" onClick={handleUpload} disabled={isUploading || !validRows.length}>
            {isUploading ? "Salvando..." : "Salvar vagas agendadas no banco"}
          </Button>
          <Button asChild type="button" size="lg" variant="outline">
            <a href="/api/admin/jobs/publication-export">
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Baixar Excel de auditoria
              </span>
            </a>
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          O arquivo exportado inclui: dataHoraPublicacao, publishStatus (AGUARDANDO, PUBLICADA, ERRO), publishedUrl, publishedAt,
          googleIndexingStatus, googleIndexedAt, googleIndexingMessage, title e externalId.
        </p>

        {resultMessage ? <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{resultMessage}</p> : null}

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
