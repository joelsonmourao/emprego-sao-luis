"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { companyFormDefaults, companyFormSchema, type CompanyFormInput } from "@/lib/schemas/company-form";
import { slugify } from "@/lib/utils";
import { Field, Input, Select, Textarea } from "@/components/forms/field";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { SeoFeedback } from "@/components/forms/seo-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StateOption = { value: string; label: string };
type CityOption = { value: string; label: string; stateSlug: string };

export function CompanyAdminForm({
  mode,
  companyId,
  initialValues,
  states,
  cities
}: {
  mode: "create" | "edit";
  companyId?: string;
  initialValues?: Partial<CompanyFormInput>;
  states: StateOption[];
  cities: CityOption[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CompanyFormInput>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      ...companyFormDefaults,
      ...initialValues
    }
  });

  const selectedState = watch("stateSlug");
  const filteredCities = useMemo(
    () => cities.filter((city) => !selectedState || city.stateSlug === selectedState),
    [cities, selectedState]
  );
  const seoTitle = watch("seoTitle") ?? "";
  const seoDescription = watch("seoDescription") ?? "";
  const description = watch("descriptionHtml") ?? "";

  async function onSubmit(values: CompanyFormInput) {
    setServerError("");
    setServerSuccess("");

    const response = await fetch(mode === "create" ? "/api/admin/companies" : `/api/admin/companies/${companyId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setServerError(result.error ?? "Nao foi possivel salvar a empresa.");
      return;
    }

    setServerSuccess(mode === "create" ? "Empresa criada com sucesso." : "Empresa atualizada com sucesso.");
    router.push("/admin/empresas" as Route);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95 shadow-sm">
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="Nome da empresa">
                <Input
                  {...register("name")}
                  placeholder="Magazine Horizonte"
                  onBlur={(event) => {
                    if (!watch("slug")) {
                      setValue("slug", slugify(event.target.value), { shouldValidate: true });
                    }
                  }}
                />
              </Field>
              {errors.name ? <p className="text-sm text-rose-600">{errors.name.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Field label="Slug">
                <Input {...register("slug")} placeholder="magazine-horizonte" />
              </Field>
              {errors.slug ? <p className="text-sm text-rose-600">{errors.slug.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Controller
              control={control}
              name="logoUrl"
              render={({ field }) => (
                <MediaUrlField label="Logo" value={field.value ?? ""} onChange={field.onChange} placeholder="/uploads/site/logo-empresa.png" previewAlt={watch("name") || "Logo da empresa"} />
              )}
            />
            <Controller
              control={control}
              name="socialImageUrl"
              render={({ field }) => (
                <MediaUrlField label="Imagem social" value={field.value ?? ""} onChange={field.onChange} placeholder="/uploads/site/empresa-social.png" previewAlt={watch("name") || "Imagem social"} />
              )}
            />
            <Field label="Site da empresa">
              <Input {...register("websiteUrl")} placeholder="https://empresa.com.br" />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Estado">
              <Select
                {...register("stateSlug", {
                  onChange: () => {
                    setValue("citySlug", "", { shouldValidate: true });
                  }
                })}
              >
                <option value="">Selecione</option>
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Cidade">
              <Select {...register("citySlug")}>
                <option value="">Selecione</option>
                {filteredCities.map((city) => (
                  <option key={`${city.stateSlug}-${city.value}`} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Resumo curto">
            <Textarea {...register("summary")} className="min-h-24" />
          </Field>

          <Field label="Descricao da empresa">
            <Controller
              control={control}
              name="descriptionHtml"
              render={({ field }) => (
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Conte um pouco sobre a empresa e o perfil das vagas." minHeight={260} />
              )}
            />
          </Field>

          <SeoFeedback title={seoTitle} description={seoDescription} content={description} contentLabel="Descricao da empresa" />

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="SEO title">
              <Input {...register("seoTitle")} />
            </Field>
            <Field label="SEO description">
              <Textarea {...register("seoDescription")} className="min-h-24" />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input type="checkbox" className="h-4 w-4" {...register("featured")} />
              Destacar no site
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input type="checkbox" className="h-4 w-4" {...register("isActive")} />
              Empresa ativa
            </label>
          </div>

          {serverError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</p> : null}
          {serverSuccess ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{serverSuccess}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : mode === "create" ? "Criar empresa" : "Salvar alteracoes"}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.push("/admin/empresas" as Route)}>
              Voltar para a lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
