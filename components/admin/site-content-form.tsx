"use client";

import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Field, Input, Textarea } from "@/components/forms/field";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { homeBlockKeys, siteContentSchema, type SiteContent } from "@/lib/schemas/site-admin";

function MoveButtons({
  index,
  total,
  onMove
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button type="button" size="sm" variant="outline" onClick={() => onMove(index, index - 1)} disabled={index === 0}>
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => onMove(index, index + 1)} disabled={index === total - 1}>
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SiteContentForm({ initialValues }: { initialValues: SiteContent }) {
  const [serverState, setServerState] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SiteContent>({
    resolver: zodResolver(siteContentSchema),
    defaultValues: initialValues
  });

  const navItems = useFieldArray({ control, name: "navigation.main" });
  const faqItems = useFieldArray({ control, name: "faq.home" });
  const howItWorks = useFieldArray({ control, name: "home.howItWorksSteps" });
  const benefits = useFieldArray({ control, name: "home.benefits" });
  const careerCtas = useFieldArray({ control, name: "home.careerCtas" });
  const stateFaq = useFieldArray({ control, name: "hubContent.state.faq" });
  const cityFaq = useFieldArray({ control, name: "hubContent.city.faq" });
  const companyFaq = useFieldArray({ control, name: "hubContent.company.faq" });
  const blockOrder = watch("home.blockOrder") ?? [...homeBlockKeys];

  function moveBlockOrder(from: number, to: number) {
    if (to < 0 || to >= blockOrder.length) return;
    const reordered = [...blockOrder];
    const [item] = reordered.splice(from, 1);
    reordered.splice(to, 0, item);
    setValue("home.blockOrder", reordered, { shouldDirty: true });
  }

  const blockLabels: Record<(typeof homeBlockKeys)[number], string> = {
    quickAccess: "Acesso rapido",
    featuredJobs: "Vagas em destaque",
    blog: "Bloco de blog",
    howItWorks: "Como funciona",
    citiesAndBenefits: "Cidades e beneficios",
    careerCtas: "CTAs de carreira",
    companies: "Empresas",
    faq: "FAQ",
    finalCta: "CTA final"
  };

  async function onSubmit(values: SiteContent) {
    setServerState({ type: "idle", message: "" });

    const response = await fetch("/api/admin/site/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setServerState({ type: "error", message: result.error ?? "Nao foi possivel salvar o conteudo do site." });
      return;
    }

    setServerState({ type: "success", message: "Conteudo do site salvo com sucesso." });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Navegacao e topo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Field label="Texto da barra superior">
              <Input {...register("navigation.topBarText")} />
            </Field>
            <Field label="Link da barra superior">
              <Input {...register("navigation.topBarLinkHref")} />
            </Field>
            <Field label="Rotulo do link da barra superior">
              <Input {...register("navigation.topBarLinkLabel")} />
            </Field>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Botao principal do header">
              <Input {...register("navigation.headerCtaLabel")} />
            </Field>
            <Field label="Link do botao principal do header">
              <Input {...register("navigation.headerCtaHref")} />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Menu principal</h3>
              <Button type="button" variant="outline" onClick={() => navItems.append({ label: "Novo item", href: "/" })}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar item
              </Button>
            </div>
            <div className="grid gap-4">
              {navItems.fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 lg:grid-cols-[1fr_1.4fr_auto_auto]">
                  <Input {...register(`navigation.main.${index}.label`)} placeholder="Rotulo" />
                  <Input {...register(`navigation.main.${index}.href`)} placeholder="/rota" />
                  <MoveButtons index={index} total={navItems.fields.length} onMove={navItems.move} />
                  <Button type="button" variant="outline" onClick={() => navItems.remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Home</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Selo do hero">
              <Input {...register("home.heroBadge")} />
            </Field>
            <Field label="Texto de ajuda da busca">
              <Input {...register("home.searchHelperText")} />
            </Field>
          </div>

          <Field label="Titulo principal">
            <Textarea {...register("home.heroTitle")} className="min-h-24" />
          </Field>
          <Field label="Subtitulo">
            <Textarea {...register("home.heroDescription")} className="min-h-28" />
          </Field>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Botao principal do hero">
              <Input {...register("home.primaryButton.label")} />
            </Field>
            <Field label="Link do botao principal do hero">
              <Input {...register("home.primaryButton.href")} />
            </Field>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Botao secundario do hero">
              <Input {...register("home.secondaryButton.label")} />
            </Field>
            <Field label="Link do botao secundario do hero">
              <Input {...register("home.secondaryButton.href")} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {[
              ["home.blocks.quickAccess", "Acesso rapido"],
              ["home.blocks.featuredJobs", "Vagas em destaque"],
              ["home.blocks.blog", "Bloco de blog"],
              ["home.blocks.howItWorks", "Como funciona"],
              ["home.blocks.citiesAndBenefits", "Cidades e beneficios"],
              ["home.blocks.careerCtas", "CTAs de carreira"],
              ["home.blocks.companies", "Empresas"],
              ["home.blocks.faq", "FAQ"],
              ["home.blocks.finalCta", "CTA final"]
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input type="checkbox" className="h-4 w-4" {...register(name as never)} />
                {label}
              </label>
            ))}
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-slate-200 p-5">
            <div>
              <h3 className="text-lg font-black text-slate-950">Ordem dos blocos da home</h3>
              <p className="mt-1 text-sm text-slate-600">Arrume a ordem das secoes que aparecem abaixo do hero.</p>
            </div>
            <div className="grid gap-3">
              {blockOrder.map((key, index) => (
                <div key={`${key}-${index}`} className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-800">{blockLabels[key]}</span>
                  <MoveButtons index={index} total={blockOrder.length} onMove={moveBlockOrder} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Field label="Estados em destaque" hint="Um slug por linha.">
              <Controller
                control={control}
                name="home.featured.stateSlugs"
                render={({ field }) => (
                  <Textarea
                    value={(field.value ?? []).join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(/\r?\n/)
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                    className="min-h-24"
                  />
                )}
              />
            </Field>
            <Field label="Cidades em destaque" hint="Um slug por linha.">
              <Controller
                control={control}
                name="home.featured.citySlugs"
                render={({ field }) => (
                  <Textarea
                    value={(field.value ?? []).join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(/\r?\n/)
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                    className="min-h-24"
                  />
                )}
              />
            </Field>
            <Field label="Empresas em destaque" hint="Um slug por linha.">
              <Controller
                control={control}
                name="home.featured.companySlugs"
                render={({ field }) => (
                  <Textarea
                    value={(field.value ?? []).join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(/\r?\n/)
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                    className="min-h-24"
                  />
                )}
              />
            </Field>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Slugs de vagas em destaque" hint="Uma por linha. Se ficar vazio, o site usa as vagas marcadas como destaque.">
              <Controller
                control={control}
                name="home.featured.jobSlugs"
                render={({ field }) => (
                  <Textarea
                    value={(field.value ?? []).join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(/\r?\n/)
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                    className="min-h-28"
                  />
                )}
              />
            </Field>
            <Field label="Slugs de posts em destaque" hint="Uma por linha.">
              <Controller
                control={control}
                name="home.featured.postSlugs"
                render={({ field }) => (
                  <Textarea
                    value={(field.value ?? []).join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(/\r?\n/)
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                    className="min-h-28"
                  />
                )}
              />
            </Field>
          </div>

          {[
            ["home.quickJobsEyebrow", "Eyebrow do acesso rapido para vagas"],
            ["home.quickJobsTitle", "Titulo do acesso rapido para vagas"],
            ["home.quickJobsDescription", "Descricao do acesso rapido para vagas"],
            ["home.quickBlogEyebrow", "Eyebrow do acesso rapido para blog"],
            ["home.quickBlogTitle", "Titulo do acesso rapido para blog"],
            ["home.quickBlogDescription", "Descricao do acesso rapido para blog"],
            ["home.featuredTitle", "Titulo da secao de vagas"],
            ["home.featuredDescription", "Descricao da secao de vagas"],
            ["home.blogTitle", "Titulo da secao de blog"],
            ["home.blogDescription", "Descricao da secao de blog"],
            ["home.faqTitle", "Titulo do FAQ"],
            ["home.faqDescription", "Descricao do FAQ"],
            ["home.finalCtaEyebrow", "Eyebrow do CTA final"],
            ["home.finalCtaTitle", "Titulo do CTA final"],
            ["home.finalCtaDescription", "Descricao do CTA final"]
          ].map(([name, label]) => (
            <Field key={name} label={label}>
              <Textarea {...register(name as never)} className="min-h-20" />
            </Field>
          ))}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Como funciona</h3>
              <Button type="button" variant="outline" onClick={() => howItWorks.append({ title: "", description: "", iconKey: "compass" })}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar passo
              </Button>
            </div>
            {howItWorks.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 lg:grid-cols-[1fr_2fr_180px_auto_auto]">
                <Input {...register(`home.howItWorksSteps.${index}.title`)} placeholder="Titulo" />
                <Input {...register(`home.howItWorksSteps.${index}.description`)} placeholder="Descricao" />
                <Input {...register(`home.howItWorksSteps.${index}.iconKey`)} placeholder="compass" />
                <MoveButtons index={index} total={howItWorks.fields.length} onMove={howItWorks.move} />
                <Button type="button" variant="outline" onClick={() => howItWorks.remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Beneficios</h3>
              <Button type="button" variant="outline" onClick={() => benefits.append({ title: "", description: "", iconKey: "briefcase" })}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar beneficio
              </Button>
            </div>
            {benefits.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 lg:grid-cols-[1fr_2fr_180px_auto_auto]">
                <Input {...register(`home.benefits.${index}.title`)} placeholder="Titulo" />
                <Input {...register(`home.benefits.${index}.description`)} placeholder="Descricao" />
                <Input {...register(`home.benefits.${index}.iconKey`)} placeholder="briefcase" />
                <MoveButtons index={index} total={benefits.fields.length} onMove={benefits.move} />
                <Button type="button" variant="outline" onClick={() => benefits.remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Cartoes de carreira</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => careerCtas.append({ title: "", description: "", href: "/blog", iconKey: "file-text" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar cartao
              </Button>
            </div>
            {careerCtas.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 lg:grid-cols-[1fr_1.5fr_1fr_180px_auto_auto]">
                <Input {...register(`home.careerCtas.${index}.title`)} placeholder="Titulo" />
                <Input {...register(`home.careerCtas.${index}.description`)} placeholder="Descricao" />
                <Input {...register(`home.careerCtas.${index}.href`)} placeholder="/blog" />
                <Input {...register(`home.careerCtas.${index}.iconKey`)} placeholder="file-text" />
                <MoveButtons index={index} total={careerCtas.fields.length} onMove={careerCtas.move} />
                <Button type="button" variant="outline" onClick={() => careerCtas.remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>FAQ e paginas institucionais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">FAQ da home</h3>
              <Button type="button" variant="outline" onClick={() => faqItems.append({ question: "", answer: "" })}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar pergunta
              </Button>
            </div>
            {faqItems.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 lg:grid-cols-[1fr_1.4fr_auto_auto]">
                <Input {...register(`faq.home.${index}.question`)} placeholder="Pergunta" />
                <Textarea {...register(`faq.home.${index}.answer`)} className="min-h-20" placeholder="Resposta" />
                <MoveButtons index={index} total={faqItems.fields.length} onMove={faqItems.move} />
                <Button type="button" variant="outline" onClick={() => faqItems.remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {(["about", "contact", "privacy", "cookies", "terms"] as const).map((pageKey) => (
            <div key={pageKey} className="space-y-4 rounded-[1.5rem] border border-slate-200 p-5">
              <h3 className="text-lg font-black text-slate-950">
                {{
                  about: "Pagina Sobre",
                  contact: "Pagina Contato",
                  privacy: "Politica de Privacidade",
                  cookies: "Politica de Cookies",
                  terms: "Termos de Uso"
                }[pageKey]}
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Titulo">
                  <Input {...register(`pages.${pageKey}.title`)} />
                </Field>
                <Field label="Descricao curta">
                  <Textarea {...register(`pages.${pageKey}.description`)} className="min-h-20" />
                </Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="SEO title">
                  <Input {...register(`pages.${pageKey}.seoTitle`)} />
                </Field>
                <Field label="SEO description">
                  <Textarea {...register(`pages.${pageKey}.seoDescription`)} className="min-h-20" />
                </Field>
              </div>
              <Field label="Conteudo principal">
                <Controller
                  control={control}
                  name={`pages.${pageKey}.contentHtml`}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Escreva o conteudo desta pagina." minHeight={260} />
                  )}
                />
              </Field>
            </div>
          ))}

          <div className="space-y-4 rounded-[1.5rem] border border-slate-200 p-5">
            <h3 className="text-lg font-black text-slate-950">Footer</h3>
            <Field label="Descricao do footer">
              <Textarea {...register("footer.description")} className="min-h-24" />
            </Field>
            <Field label="Copyright">
              <Input {...register("footer.copyrightText")} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Textos padrao dos hubs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {([
            ["state", "Estado", stateFaq],
            ["city", "Cidade", cityFaq],
            ["company", "Empresa", companyFaq]
          ] as const).map(([key, label, faqArray]) => (
            <div key={key} className="space-y-4 rounded-[1.5rem] border border-slate-200 p-5">
              <h3 className="text-lg font-black text-slate-950">{label}</h3>
              <Field label="Texto introdutorio padrao" hint="Use placeholders como {{stateName}}, {{cityName}}, {{companyName}}, {{stateCode}} e {{totalJobs}}.">
                <Textarea {...register(`hubContent.${key}.introTemplate`)} className="min-h-28" />
              </Field>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Titulo do FAQ">
                  <Input {...register(`hubContent.${key}.faqTitle`)} />
                </Field>
                <Field label="Descricao do FAQ">
                  <Textarea {...register(`hubContent.${key}.faqDescription`)} className="min-h-20" />
                </Field>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-950">Perguntas padrao</h4>
                  <Button type="button" variant="outline" onClick={() => faqArray.append({ question: "", answer: "" })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar pergunta
                  </Button>
                </div>
                {faqArray.fields.map((field, index) => (
                  <div key={field.id} className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 lg:grid-cols-[1fr_1.4fr_auto_auto]">
                    <Input {...register(`hubContent.${key}.faq.${index}.question`)} placeholder="Pergunta" />
                    <Textarea {...register(`hubContent.${key}.faq.${index}.answer`)} className="min-h-20" placeholder="Resposta" />
                    <MoveButtons index={index} total={faqArray.fields.length} onMove={faqArray.move} />
                    <Button type="button" variant="outline" onClick={() => faqArray.remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {serverState.type !== "idle" ? (
            <p
              className={`rounded-2xl px-4 py-3 text-sm ${
                serverState.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {serverState.message}
            </p>
          ) : null}
          {Object.keys(errors).length ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Existem campos invalidos ou incompletos. Revise antes de salvar.</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar conteudo do site"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
