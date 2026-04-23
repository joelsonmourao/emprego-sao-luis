"use client";

import { useMemo, useState } from "react";
import type { AdSlot } from "@prisma/client";
import { ExternalLink, Megaphone, ShieldAlert, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CompliancePayload = {
  score: number;
  activeSlotCount: number;
  issues: Array<{ severity: "error" | "warn" | "info"; message: string }>;
  suggestions: string[];
  byPageKey: Record<string, { active: number; slugs: string[] }>;
};

type Props = {
  initialGlobalEnabled: boolean;
  initialAutoAdsEnabled?: boolean;
  initialAdMode?: "manual" | "automatico" | "hibrido";
  initialSlots: AdSlot[];
  initialCompliance: CompliancePayload;
};

const positionLabels: Record<string, string> = {
  top: "Topo / hero",
  sidebar: "Sidebar",
  footer: "Rodape",
  "between-listings": "Entre listagens",
  global: "Global"
};

export function AdsManagerClient({
  initialGlobalEnabled,
  initialAutoAdsEnabled = false,
  initialAdMode = "manual",
  initialSlots,
  initialCompliance
}: Props) {
  const [globalEnabled, setGlobalEnabled] = useState(initialGlobalEnabled);
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(initialAutoAdsEnabled);
  const [adMode, setAdMode] = useState<"manual" | "automatico" | "hibrido">(initialAdMode);
  const [slots, setSlots] = useState(initialSlots);
  const [compliance, setCompliance] = useState(initialCompliance);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const statusLabel = adMode === "manual" ? "Modo manual" : adMode === "automatico" ? "Modo automatico" : "Modo hibrido";

  async function refreshCompliance() {
    const res = await fetch("/api/admin/ads");
    if (!res.ok) return;
    const data = (await res.json()) as {
      settings: { globalEnabled: boolean; autoAdsEnabled: boolean; adMode: "manual" | "automatico" | "hibrido" };
      slots: AdSlot[];
      compliance: CompliancePayload;
    };
    setGlobalEnabled(data.settings.globalEnabled);
    setAutoAdsEnabled(data.settings.autoAdsEnabled);
    setAdMode(data.settings.adMode);
    setSlots(data.slots);
    setCompliance(data.compliance);
  }

  async function saveMode(next: "manual" | "automatico" | "hibrido") {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/ads/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adMode: next })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Falha ao salvar");
      setGlobalEnabled(Boolean(data.settings?.globalEnabled));
      setAutoAdsEnabled(Boolean(data.settings?.autoAdsEnabled));
      setAdMode((data.settings?.adMode as "manual" | "automatico" | "hibrido") ?? next);
      setMessage("Modo de propagandas salvo.");
      await refreshCompliance();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function patchSlot(slug: string, patch: Partial<Pick<AdSlot, "code" | "adsenseSlotId" | "isActive" | "notes">>) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/ads/slots/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Falha ao salvar slot");
      setSlots((prev) => prev.map((s) => (s.slug === slug ? data.slot : s)));
      setMessage(`Slot \"${slug}\" atualizado.`);
      await refreshCompliance();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erro ao salvar slot.");
    } finally {
      setSaving(false);
    }
  }

  const scoreColor = useMemo(() => {
    if (compliance.score >= 85) return "text-emerald-700";
    if (compliance.score >= 60) return "text-amber-700";
    return "text-rose-700";
  }, [compliance.score]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-800">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Gerenciar propagandas</CardTitle>
              <CardDescription>Controle global, slots e conformidade com boas praticas do AdSense.</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wide ${adMode === "manual" ? "text-emerald-600" : adMode === "automatico" ? "text-indigo-600" : "text-amber-600"}`}>
              {statusLabel}
            </span>
            <div className="grid gap-1 text-sm text-slate-600">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" className="h-4 w-4 border-slate-300" checked={adMode === "manual"} disabled={saving} onChange={() => void saveMode("manual")} />
                Somente manual
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" className="h-4 w-4 border-slate-300" checked={adMode === "automatico"} disabled={saving} onChange={() => void saveMode("automatico")} />
                Somente automatico
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" className="h-4 w-4 border-slate-300" checked={adMode === "hibrido"} disabled={saving} onChange={() => void saveMode("hibrido")} />
                Hibrido (manual + automatico)
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500">
            Manual ativo: <strong>{globalEnabled ? "sim" : "nao"}</strong> · Auto Ads pronto: <strong>{autoAdsEnabled ? "sim" : "nao"}</strong>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--brand-blue)]" />
            Score de conformidade AdSense
          </CardTitle>
          <CardDescription>Heuristicas locais (quantidade por pagina, densidade, listagem). Ajuste slots conforme alertas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <p className={`text-5xl font-black ${scoreColor}`}>{compliance.score}%</p>
            <p className="text-sm text-slate-600">
              Slots ativos: <strong>{compliance.activeSlotCount}</strong>
            </p>
          </div>
          {compliance.issues.length ? (
            <ul className="space-y-2">
              {compliance.issues.map((issue, i) => (
                <li
                  key={i}
                  className={`flex gap-2 rounded-2xl border px-4 py-3 text-sm ${
                    issue.severity === "error"
                      ? "border-rose-200 bg-rose-50 text-rose-900"
                      : issue.severity === "warn"
                        ? "border-amber-200 bg-amber-50 text-amber-950"
                        : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  {issue.severity === "error" ? <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> : null}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">Nenhum alerta automatico no momento.</p>
          )}
          {compliance.suggestions.length ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sugestoes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {compliance.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Slots de anuncio</CardTitle>
          <CardDescription>Cole HTML do AdSense ou preencha o ID da unidade. Desative slots que nao usar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {slots.map((slot) => (
            <div key={slot.id} className="space-y-3 rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{slot.name}</p>
                  <p className="text-xs text-slate-500">
                    Slug: <code className="rounded bg-slate-100 px-1">{slot.slug}</code> · Pagina:{" "}
                    <code className="rounded bg-slate-100 px-1">{slot.pageKey}</code> · Posicao:{" "}
                    {positionLabels[slot.position] ?? slot.position}
                  </p>
                  {slot.notes ? <p className="mt-1 text-xs text-slate-600">{slot.notes}</p> : null}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={slot.isActive}
                    disabled={saving}
                    onChange={(e) => void patchSlot(slot.slug, { isActive: e.target.checked })}
                  />
                  Ativo
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ID da unidade (data-ad-slot)
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case text-slate-900"
                    defaultValue={slot.adsenseSlotId ?? ""}
                    key={`${slot.id}-slotid`}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (slot.adsenseSlotId ?? "")) void patchSlot(slot.slug, { adsenseSlotId: v || null });
                    }}
                  />
                </label>
                <a
                  href={slot.previewPath}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 self-end text-sm font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)] md:justify-self-end"
                >
                  Preview no site
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Codigo HTML (opcional — sobrescreve unidade acima se preenchido)
                <textarea
                  className="min-h-[120px] rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs font-normal normal-case text-slate-900"
                  defaultValue={slot.code}
                  key={`${slot.id}-code`}
                  onBlur={(e) => {
                    const v = e.target.value;
                    if (v !== slot.code) void patchSlot(slot.slug, { code: v });
                  }}
                />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={saving} onClick={() => void refreshCompliance()}>
          Recalcular conformidade
        </Button>
      </div>
    </div>
  );
}
