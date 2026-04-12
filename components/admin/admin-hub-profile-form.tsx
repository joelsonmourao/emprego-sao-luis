"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Field, Input, Textarea } from "@/components/forms/field";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const hubProfileFormSchema = z.object({
  title: z.string().default(""),
  intro: z.string().default(""),
  contentHtml: z.string().default(""),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  canonicalUrl: z.string().default(""),
  socialImageUrl: z.string().default(""),
  noIndex: z.boolean().default(false)
});

type HubProfileFormInput = z.input<typeof hubProfileFormSchema>;
type HubProfileFormValues = z.output<typeof hubProfileFormSchema>;

export function AdminHubProfileForm({
  type,
  slug,
  label,
  initialValues
}: {
  type: string;
  slug: string;
  label: string;
  initialValues: HubProfileFormInput;
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<HubProfileFormInput, unknown, HubProfileFormValues>({
    resolver: zodResolver(hubProfileFormSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: HubProfileFormValues) {
    setServerMessage("");

    const response = await fetch(`/api/admin/hubs/${type}/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setServerMessage(result.error ?? "Nao foi possivel salvar o hub.");
      return;
    }

    setServerMessage("Hub salvo com sucesso.");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Titulo visivel do hub">
              <Input {...register("title")} />
            </Field>
            <Field label="SEO title">
              <Input {...register("seoTitle")} />
            </Field>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Introducao curta">
              <Textarea {...register("intro")} className="min-h-24" />
            </Field>
            <Field label="SEO description">
              <Textarea {...register("seoDescription")} className="min-h-24" />
            </Field>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Canonical">
              <Input {...register("canonicalUrl")} placeholder="https://..." />
            </Field>
            <Controller
              control={control}
              name="socialImageUrl"
              render={({ field }) => (
                <MediaUrlField
                  label="Imagem social"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="/uploads/site/og.png"
                  previewAlt={label}
                />
              )}
            />
          </div>
          <Field label="Conteudo adicional">
            <Controller
              control={control}
              name="contentHtml"
              render={({ field }) => (
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Adicione um texto util para essa pagina." minHeight={260} />
              )}
            />
          </Field>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" className="h-4 w-4" {...register("noIndex")} />
            Nao indexar esta pagina
          </label>

          {serverMessage ? <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{serverMessage}</p> : null}

          <div className="flex gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar hub"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
