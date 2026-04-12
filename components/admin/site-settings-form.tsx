"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";

import { type SiteSettings, siteSettingsSchema } from "@/lib/schemas/site-admin";
import { Field, Input } from "@/components/forms/field";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SiteSettingsForm({ initialValues }: { initialValues: SiteSettings }) {
  const [serverState, setServerState] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: SiteSettings) {
    setServerState({ type: "idle", message: "" });

    const payload: SiteSettings = {
      ...initialValues,
      ...values,
      socialLinks: {
        ...initialValues.socialLinks,
        ...values.socialLinks
      },
      consentBanner: initialValues.consentBanner,
      google: initialValues.google
    };

    const response = await fetch("/api/admin/site/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setServerState({ type: "error", message: result.error ?? "Nao foi possivel salvar as configuracoes." });
      return;
    }

    setServerState({ type: "success", message: "Configuracoes gerais salvas com sucesso." });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Configuracoes gerais do site</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Nome do site">
              <Input {...register("siteName")} />
            </Field>
            <Field label="Nome legal">
              <Input {...register("legalName")} />
            </Field>
          </div>

          <Field label="Descricao curta">
            <Input {...register("shortDescription")} />
          </Field>

          <div className="grid gap-6 lg:grid-cols-2">
            <Controller
              control={control}
              name="logoUrl"
              render={({ field }) => (
                <MediaUrlField label="Logo principal" value={field.value ?? ""} onChange={field.onChange} placeholder="/uploads/site/logo.png" previewAlt="Logo principal do site" />
              )}
            />
            <Controller
              control={control}
              name="logoCompactUrl"
              render={({ field }) => (
                <MediaUrlField label="Logo compacta" value={field.value ?? ""} onChange={field.onChange} placeholder="/uploads/site/logo-compacta.png" previewAlt="Logo compacta do site" />
              )}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Controller
              control={control}
              name="faviconUrl"
              render={({ field }) => (
                <MediaUrlField label="Favicon" value={field.value ?? ""} onChange={field.onChange} placeholder="/uploads/site/favicon.png" previewAlt="Favicon do site" />
              )}
            />
            <Controller
              control={control}
              name="defaultSocialImageUrl"
              render={({ field }) => (
                <MediaUrlField
                  label="Imagem padrao de compartilhamento"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="/uploads/site/og-default.png"
                  previewAlt="Imagem padrao de compartilhamento"
                />
              )}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Field label="E-mail">
              <Input {...register("email")} />
            </Field>
            <Field label="Telefone">
              <Input {...register("phone")} />
            </Field>
            <Field label="WhatsApp">
              <Input {...register("whatsapp")} />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Field label="Instagram">
              <Input {...register("socialLinks.instagram")} />
            </Field>
            <Field label="Facebook">
              <Input {...register("socialLinks.facebook")} />
            </Field>
            <Field label="LinkedIn">
              <Input {...register("socialLinks.linkedin")} />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="YouTube">
              <Input {...register("socialLinks.youtube")} />
            </Field>
            <Field label="TikTok">
              <Input {...register("socialLinks.tiktok")} />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Texto alternativo padrao da imagem social">
              <Input {...register("defaultOgAlt")} />
            </Field>
            <Field label="Texto curto de suporte">
              <Input {...register("supportText")} />
            </Field>
          </div>

          {Object.keys(errors).length ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">Revise os campos obrigatorios antes de salvar.</p>
          ) : null}
          {serverState.type !== "idle" ? (
            <p
              className={`rounded-2xl px-4 py-3 text-sm ${
                serverState.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {serverState.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar configuracoes gerais"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
