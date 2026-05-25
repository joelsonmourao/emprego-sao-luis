"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/forms/field";
import type { GoogleIndexingAdminSnapshot } from "@/lib/admin/google-indexing";

type MessageState = { type: "idle" | "success" | "error"; text: string };

export function GoogleIndexingPanel({ initialSnapshot }: { initialSnapshot: GoogleIndexingAdminSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [manualUrl, setManualUrl] = useState("");
  const [busyAction, setBusyAction] = useState<"test" | "manual" | "pending" | "refresh" | null>(null);
  const [message, setMessage] = useState<MessageState>({ type: "idle", text: "" });

  const lastSubmittedLabel = useMemo(() => {
    if (!snapshot.lastSubmittedAt) return "-";
    const date = new Date(snapshot.lastSubmittedAt);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
  }, [snapshot.lastSubmittedAt]);

  async function refreshStatus() {
    setBusyAction("refresh");
    try {
      const response = await fetch("/api/admin/google-indexing/status", { cache: "no-store" });
      const result = (await response.json()) as { ok: boolean; error?: string; snapshot?: GoogleIndexingAdminSnapshot };
      if (!response.ok || !result.ok || !result.snapshot) {
        setMessage({ type: "error", text: result.error ?? "Falha ao atualizar status da Google Indexing API." });
        return;
      }
      setSnapshot(result.snapshot);
    } finally {
      setBusyAction(null);
    }
  }

  async function testConnection() {
    setBusyAction("test");
    setMessage({ type: "idle", text: "" });
    try {
      const response = await fetch("/api/admin/google-indexing/test-connection", { method: "POST" });
      const result = (await response.json()) as { ok: boolean; message?: string };
      setMessage({
        type: response.ok && result.ok ? "success" : "error",
        text: result.message ?? "Falha ao testar conexao."
      });
      await refreshStatus();
    } finally {
      setBusyAction(null);
    }
  }

  async function submitManualUrl() {
    setBusyAction("manual");
    setMessage({ type: "idle", text: "" });
    try {
      const response = await fetch("/api/admin/google-indexing/manual-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: manualUrl.trim() })
      });
      const result = (await response.json()) as { ok: boolean; message?: string };
      setMessage({
        type: response.ok && result.ok ? "success" : "error",
        text: result.message ?? (result.ok ? "URL enviada com sucesso." : "Falha no envio manual.")
      });
      if (response.ok && result.ok) {
        setManualUrl("");
      }
      await refreshStatus();
    } finally {
      setBusyAction(null);
    }
  }

  async function submitPendingJobs() {
    setBusyAction("pending");
    setMessage({ type: "idle", text: "" });
    try {
      const response = await fetch("/api/admin/google-indexing/submit-pending", { method: "POST" });
      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        processed?: number;
        success?: number;
        errors?: number;
        skipped?: number;
      };
      if (!response.ok || !result.ok) {
        setMessage({ type: "error", text: result.message ?? "Falha ao enviar vagas publicadas pendentes." });
      } else {
        setMessage({
          type: "success",
          text: `Execucao concluida: processadas ${result.processed ?? 0}, sucesso ${result.success ?? 0}, erro ${result.errors ?? 0}, ignoradas ${result.skipped ?? 0}.`
        });
      }
      await refreshStatus();
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader>
        <CardTitle>Google Indexing API</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          As credenciais da Google Indexing API sao configuradas no servidor por variaveis de ambiente, por seguranca. A private key nunca e exibida no painel.
        </p>

        <div className="grid gap-3 lg:grid-cols-2">
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>Status:</strong> {snapshot.configured ? "Configurada" : "Nao configurada"}
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>GOOGLE_INDEXING_ENABLED:</strong> {snapshot.enabled ? "ativo" : "inativo"}
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>Client email:</strong> {snapshot.clientEmailMasked}
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>Project ID:</strong> {snapshot.projectId}
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>SITE_URL:</strong> {snapshot.siteUrl}
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>Ultimo envio realizado:</strong> {lastSubmittedLabel}
          </p>
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <strong>Total de envios com sucesso:</strong> {snapshot.successCount}
          </p>
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <strong>Total de envios com erro:</strong> {snapshot.errorCount}
          </p>
        </div>

        <p className="text-sm text-slate-600">
          Vagas publicadas pendentes para envio: <strong>{snapshot.pendingCount}</strong>
        </p>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <Input
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
            placeholder="https://seu-dominio.com/vagas/seu-slug"
          />
          <Button
            type="button"
            variant="outline"
            onClick={submitManualUrl}
            disabled={busyAction !== null || !manualUrl.trim()}
          >
            {busyAction === "manual" ? "Enviando..." : "Enviar URL manualmente"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={testConnection} disabled={busyAction !== null}>
            {busyAction === "test" ? "Testando..." : "Testar conexao"}
          </Button>
          <Button type="button" onClick={submitPendingJobs} disabled={busyAction !== null}>
            {busyAction === "pending" ? "Enviando pendentes..." : "Enviar vagas publicadas pendentes"}
          </Button>
          <Button type="button" variant="outline" onClick={refreshStatus} disabled={busyAction !== null}>
            {busyAction === "refresh" ? "Atualizando..." : "Atualizar status"}
          </Button>
        </div>

        {message.type !== "idle" ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
