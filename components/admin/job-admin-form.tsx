"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { jobFormDefaults, jobFormSchema, type JobFormInput } from "@/lib/schemas/job-form";
import { slugify } from "@/lib/utils";
import { Field, Input, Select, Textarea } from "@/components/forms/field";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { SeoFeedback } from "@/components/forms/seo-feedback";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StateOption = { value: string; label: string };
type CityOption = { value: string; label: string; stateSlug: string };
type CompanyOption = { value: string; label: string; stateSlug: string; citySlug: string };

const workHourOptions = [
  "4h por dia",
  "6h por dia",
  "Meio periodo - manha",
  "Meio periodo - tarde",
  "Segunda a sexta, 4h por dia",
  "Segunda a sexta, 6h por dia"
];

export function JobAdminForm({
  mode,
  jobId,
  initialValues,
  states,
  cities,
  companies
}: {
  mode: "create" | "edit";
  jobId?: string;
  initialValues?: Partial<JobFormInput>;
  states: StateOption[];
  cities: CityOption[];
  companies: CompanyOption[];
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
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      ...jobFormDefaults,
      ...initialValues
    }
  });

  const selectedState = watch("stateSlug");
  const selectedCompanyId = watch("companyId");
  const filteredCities = useMemo(
    () => cities.filter((city) => !selectedState || city.stateSlug === selectedState),
    [cities, selectedState]
  );
  const selectedCompany = useMemo(
    () => companies.find((company) => company.value === selectedCompanyId),
    [companies, selectedCompanyId]
  );

  const description = watch("descriptionHtml") ?? "";
  const seoTitle = watch("seoTitle") ?? "";
  const seoDescription = watch("seoDescription") ?? "";

  async function onSubmit(values: JobFormInput) {
    setServerError("");
    setServerSuccess("");

    const response = await fetch(mode === "create" ? "/api/admin/jobs" : `/api/admin/jobs/${jobId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setServerError(result.error ?? "Nao foi possivel salvar a vaga.");
      return;
    }

    setServerSuccess(mode === "create" ? "Vaga criada com sucesso." : "Vaga atualizada com sucesso.");
    router.push("/admin/vagas" as Route);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95 shadow-sm">
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="Titulo da vaga">
                <Input
                  {...register("title")}
                  placeholder="Jovem Aprendiz em Atendimento"
                  onBlur={(event) => {
                    if (!watch("slug")) {
                      setValue("slug", slugify(event.target.value), { shouldValidate: true });
                    }
                  }}
                />
              </Field>
              {errors.title ? <p className="text-sm text-rose-600">{errors.title.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Field label="Slug">
                <Input {...register("slug")} placeholder="jovem-aprendiz-atendimento-sao-luis-ma" />
              </Field>
              {errors.slug ? <p className="text-sm text-rose-600">{errors.slug.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <Field label="Empresa">
                <Select
                  {...register("companyId", {
                    onChange: (event) => {
                      const company = companies.find((item) => item.value === event.target.value);
                      if (company) {
                        setValue("stateSlug", company.stateSlug, { shouldValidate: true });
                        setValue("citySlug", company.citySlug, { shouldValidate: true });
                      }
                    }
                  })}
                >
                  <option value="">Selecione</option>
                  {companies.map((company) => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </Select>
              </Field>
              {errors.companyId ? <p className="text-sm text-rose-600">{errors.companyId.message}</p> : null}
            </div>

            <Field label="Tipo de localizacao">
              <Select {...register("locationType")}>
                <option value="ONSITE">Presencial</option>
                <option value="HYBRID">Hibrido</option>
                <option value="REMOTE">Remoto</option>
              </Select>
            </Field>

            <Field label="Tipo de contrato">
              <Select {...register("employmentType")}>
                <option value="APPRENTICESHIP">Jovem Aprendiz</option>
                <option value="INTERNSHIP">Estagio</option>
                <option value="PART_TIME">Meio periodo</option>
                <option value="FULL_TIME">Tempo integral</option>
                <option value="TEMPORARY">Temporario</option>
                <option value="CONTRACTOR">Autonomo / PJ</option>
                <option value="VOLUNTEER">Voluntario</option>
                <option value="PER_DIEM">Por dia / diaria</option>
                <option value="OTHER">Outro</option>
              </Select>
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Empresa selecionada" hint="Logo, site e cidade principal vem da ficha da empresa.">
              <Input value={selectedCompany?.label ?? "Selecione uma empresa acima"} readOnly />
            </Field>
            <Controller
              control={control}
              name="heroImageUrl"
              render={({ field }) => (
                <MediaUrlField
                  label="Imagem da vaga"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="/uploads/site/vaga.png"
                  hint="Opcional. Aparece na pagina da vaga e ajuda no compartilhamento."
                  previewAlt={watch("title") || "Imagem da vaga"}
                />
              )}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
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
              {errors.stateSlug ? <p className="text-sm text-rose-600">{errors.stateSlug.message}</p> : null}
            </div>

            <div className="space-y-2">
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
              {errors.citySlug ? <p className="text-sm text-rose-600">{errors.citySlug.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Field label="Resumo curto" hint="Use 2 ou 3 frases para explicar a vaga de forma simples.">
              <Textarea {...register("summary")} className="min-h-28" />
            </Field>
            {errors.summary ? <p className="text-sm text-rose-600">{errors.summary.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Field label="Descricao da vaga" hint="Você pode usar subtitulos, listas, negrito e links.">
              <Controller
                control={control}
                name="descriptionHtml"
                render={({ field }) => (
                  <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Explique atividades, rotina e detalhes da oportunidade." minHeight={320} />
                )}
              />
            </Field>
            {errors.descriptionHtml ? <p className="text-sm text-rose-600">{errors.descriptionHtml.message}</p> : null}
          </div>

          <SeoFeedback title={seoTitle} description={seoDescription} content={description} contentLabel="Descricao da vaga" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="Requisitos" hint="Uma linha por item.">
                <Textarea {...register("requirementsText")} />
              </Field>
              {errors.requirementsText ? <p className="text-sm text-rose-600">{errors.requirementsText.message}</p> : null}
            </div>
            <Field label="Beneficios" hint="Uma linha por item.">
              <Textarea {...register("benefitsText")} />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <Field label="Salario minimo">
              <Input type="number" {...register("salaryMin", { setValueAs: (value) => (value === "" ? null : Number(value)) })} />
            </Field>
            <Field label="Salario maximo">
              <Input type="number" {...register("salaryMax", { setValueAs: (value) => (value === "" ? null : Number(value)) })} />
            </Field>
            <Field label="Jornada / horario" hint="Escolha uma opcao comum ou digite do seu jeito.">
              <Input {...register("workHours")} list="work-hours-options" placeholder="4h por dia" />
            </Field>
            <div className="space-y-2">
              <Field label="Link de candidatura">
                <Input {...register("applyUrl")} placeholder="https://empresa.com/vaga" />
              </Field>
              {errors.applyUrl ? <p className="text-sm text-rose-600">{errors.applyUrl.message}</p> : null}
            </div>
            <datalist id="work-hours-options">
              {workHourOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Field label="Expira em">
              <Input type="date" {...register("expiresAt")} />
            </Field>
            <Field label="Validade em meses (opcional)" hint="Calcula automaticamente a data de hoje + meses">
              <select {...register("validThroughMonths")} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                <option value="">Selecione os meses</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map(months => (
                  <option key={months} value={months}>{months} mês{months > 1 ? 'es' : ''}</option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input type="checkbox" className="h-4 w-4" {...register("featured")} />
              Destacar na home
            </label>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input type="checkbox" className="h-4 w-4" {...register("isActive")} />
              Vaga ativa
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="SEO title">
                <Input {...register("seoTitle")} placeholder="Vaga de Jovem Aprendiz em Sao Luis, MA" />
              </Field>
              {errors.seoTitle ? <p className="text-sm text-rose-600">{errors.seoTitle.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Field label="SEO description">
                <Textarea {...register("seoDescription")} className="min-h-24" placeholder="Resumo curto para aparecer melhor na busca." />
              </Field>
              {errors.seoDescription ? <p className="text-sm text-rose-600">{errors.seoDescription.message}</p> : null}
            </div>
          </div>

          {serverError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</p> : null}
          {serverSuccess ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{serverSuccess}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : mode === "create" ? "Criar vaga" : "Salvar alteracoes"}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.push("/admin/vagas" as Route)}>
              Voltar para a lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
