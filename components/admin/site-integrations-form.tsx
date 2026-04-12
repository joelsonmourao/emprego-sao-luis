"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, Input, Textarea } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteSettingsSchema, type SiteSettings } from "@/lib/schemas/site-admin";

function ToggleField({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-950">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--brand-blue)]" />
    </label>
  );
}

export function SiteIntegrationsForm({ initialValues }: { initialValues: SiteSettings }) {
  const [serverState, setServerState] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: SiteSettings) {
    setServerState({ type: "idle", message: "" });

    const response = await fetch("/api/admin/site/integrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        google: values.google,
        consentBanner: values.consentBanner
      })
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setServerState({ type: "error", message: result.error ?? "Nao foi possivel salvar as integracoes." });
      return;
    }

    setServerState({ type: "success", message: "Integracoes e consentimento atualizados." });
  }

  const google = watch("google");
  const consentBanner = watch("consentBanner");
  const gaStatus =
    google.ga4MeasurementId.trim().startsWith("G-") || google.ga4MeasurementId.trim().startsWith("GT-")
      ? "ok"
      : google.ga4MeasurementId.trim()
        ? "warn"
        : "empty";
  const gtmStatus = google.gtmContainerId.trim().startsWith("GTM-") ? "ok" : google.gtmContainerId.trim() ? "warn" : "empty";
  const adsenseStatus = google.adsensePublisherId.trim().startsWith("ca-pub-") ? "ok" : google.adsensePublisherId.trim() ? "warn" : "empty";
  const searchConsoleStatus = google.searchConsoleVerification.trim() ? "ok" : "empty";

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Cookies e consentimento</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ToggleField
            label="Banner de cookies"
            description="Mostra o banner com aceite, recusa e personalizacao de preferencias."
            checked={consentBanner.bannerEnabled}
            onChange={(checked) => setValue("consentBanner.bannerEnabled", checked)}
          />
          <ToggleField
            label="Consent Mode do Google"
            description="Mantem analytics e publicidade negados ate o visitante autorizar."
            checked={google.consentModeEnabled}
            onChange={(checked) => setValue("google.consentModeEnabled", checked)}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Titulo do banner">
              <Input {...register("consentBanner.title")} />
            </Field>
            <Field label="Link da politica">
              <Input {...register("consentBanner.policyHref")} />
            </Field>
          </div>
          <Field label="Descricao do banner">
            <Textarea {...register("consentBanner.description")} className="min-h-24" />
          </Field>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Botao aceitar">
              <Input {...register("consentBanner.acceptLabel")} />
            </Field>
            <Field label="Botao recusar">
              <Input {...register("consentBanner.rejectLabel")} />
            </Field>
            <Field label="Botao gerenciar">
              <Input {...register("consentBanner.manageLabel")} />
            </Field>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Nome da opcao Analytics">
              <Input {...register("consentBanner.analyticsLabel")} />
            </Field>
            <Field label="Nome da opcao Publicidade">
              <Input {...register("consentBanner.advertisingLabel")} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Google Analytics, Tag Manager e Search Console</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ToggleField
            label="Ativar mensuracao do Google"
            description="Libera a carga de Analytics e GTM somente depois do consentimento do visitante."
            checked={google.analyticsEnabled}
            onChange={(checked) => setValue("google.analyticsEnabled", checked)}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="GA4 Measurement ID">
              <Input {...register("google.ga4MeasurementId")} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Google Tag Manager ID">
              <Input {...register("google.gtmContainerId")} placeholder="GTM-XXXXXXX" />
            </Field>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <p className={`rounded-2xl px-4 py-3 text-sm ${gaStatus === "ok" ? "bg-emerald-50 text-emerald-700" : gaStatus === "warn" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>
              GA4: {gaStatus === "ok" ? "formato valido" : gaStatus === "warn" ? "revise o formato do ID" : "nao configurado"}
            </p>
            <p className={`rounded-2xl px-4 py-3 text-sm ${gtmStatus === "ok" ? "bg-emerald-50 text-emerald-700" : gtmStatus === "warn" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>
              GTM: {gtmStatus === "ok" ? "formato valido" : gtmStatus === "warn" ? "revise o formato do ID" : "nao configurado"}
            </p>
            <p className={`rounded-2xl px-4 py-3 text-sm ${searchConsoleStatus === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
              Search Console: {searchConsoleStatus === "ok" ? "codigo salvo" : "nao configurado"}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Codigo de verificacao do Search Console">
              <Input {...register("google.searchConsoleVerification")} placeholder="google-site-verification=..." />
            </Field>
            <Field label="URL da propriedade no Search Console">
              <Input {...register("google.searchConsolePropertyUrl")} placeholder="https://search.google.com/search-console?resource_id=..." />
            </Field>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Looker Studio">
              <Input {...register("google.lookerStudioUrl")} placeholder="https://lookerstudio.google.com/..." />
            </Field>
            <Field label="Relatorios do GA4">
              <Input {...register("google.ga4ReportsUrl")} placeholder="https://analytics.google.com/..." />
            </Field>
          </div>
          <Field label="Relatorios do Search Console">
            <Input {...register("google.searchConsoleReportsUrl")} placeholder="https://search.google.com/search-console/performance/..." />
          </Field>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>AdSense e ads.txt</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ToggleField
            label="Ativar AdSense"
            description="Prepara o carregamento de anuncios quando houver permissao de publicidade."
            checked={google.adsenseEnabled}
            onChange={(checked) => setValue("google.adsenseEnabled", checked)}
          />
          <ToggleField
            label="Ativar Auto Ads"
            description="Quando ligado, o script do AdSense fica pronto para Auto Ads depois do consentimento."
            checked={google.adsenseAutoAds}
            onChange={(checked) => setValue("google.adsenseAutoAds", checked)}
          />
          <Field label="Publisher ID">
            <Input {...register("google.adsensePublisherId")} placeholder="ca-pub-0000000000000000" />
          </Field>
          <p className={`rounded-2xl px-4 py-3 text-sm ${adsenseStatus === "ok" ? "bg-emerald-50 text-emerald-700" : adsenseStatus === "warn" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>
            AdSense: {adsenseStatus === "ok" ? "Publisher ID em formato valido" : adsenseStatus === "warn" ? "revise o Publisher ID" : "nao configurado"}
          </p>
          <Field label="Conteudo do ads.txt" hint="Se deixar vazio, o portal gera automaticamente a linha padrao do Google usando o Publisher ID.">
            <Textarea {...register("google.adsTxtContent")} className="min-h-28 font-mono text-xs" />
          </Field>
        </CardContent>
      </Card>

      {serverState.type !== "idle" ? (
        <p className={`rounded-2xl px-4 py-3 text-sm ${serverState.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {serverState.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar integracoes"}
        </Button>
      </div>
    </form>
  );
}
