"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { blogFormDefaults, blogFormSchema, type BlogFormInput } from "@/lib/schemas/blog-form";
import { looksLikeMarkdown } from "@/lib/admin/content";
import { slugify } from "@/lib/utils";
import { Field, Input, Textarea } from "@/components/forms/field";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { SeoFeedback } from "@/components/forms/seo-feedback";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BlogAdminForm({
  mode,
  postId,
  initialValues,
  categories
}: {
  mode: "create" | "edit";
  postId?: string;
  initialValues?: Partial<BlogFormInput>;
  categories: string[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      ...blogFormDefaults,
      ...initialValues
    }
  });

  const content = watch("contentHtml") ?? "";
  const excerpt = watch("excerpt") ?? "";
  const seoTitle = watch("seoTitle") ?? "";
  const seoDescription = watch("seoDescription") ?? "";

  async function onSubmit(values: BlogFormInput) {
    setServerError("");
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "blog-markdown",
        hypothesisId: "H5_INPUT_FIELD_MISMATCH",
        location: "components/admin/blog-admin-form.tsx:onSubmit",
        message: "Conteudo enviado no form de blog",
        data: {
          excerptLen: values.excerpt.length,
          contentLen: values.contentHtml.length,
          excerptMarkdown: looksLikeMarkdown(values.excerpt),
          contentMarkdown: looksLikeMarkdown(values.contentHtml)
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    const response = await fetch(mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setServerError(result.error ?? "Nao foi possivel salvar o post.");
      return;
    }

    router.push("/admin/blog" as Route);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="Titulo">
                <Input
                  {...register("title")}
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
                <Input {...register("slug")} />
              </Field>
              {errors.slug ? <p className="text-sm text-rose-600">{errors.slug.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="Categoria">
                <Input {...register("categorySlug")} list="blog-categories" placeholder="jovem-aprendiz" />
                <datalist id="blog-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </Field>
              {errors.categorySlug ? <p className="text-sm text-rose-600">{errors.categorySlug.message}</p> : null}
            </div>

            <Field label="Data de publicacao">
              <Input type="date" {...register("publishedAt")} />
            </Field>
          </div>

          <div className="space-y-2">
            <Field label="Resumo" hint="Use um texto curto e claro para o card do blog.">
              <Textarea {...register("excerpt")} className="min-h-28" />
            </Field>
            {errors.excerpt ? <p className="text-sm text-rose-600">{errors.excerpt.message}</p> : null}
            {looksLikeMarkdown(excerpt) ? (
              <p className="text-xs text-amber-700">
                O campo Resumo nao tem preview Markdown. Para pre-visualizar Markdown, use o campo Conteudo.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Field label="Conteudo" hint="Você pode usar subtitulos, listas, negrito, italico e links.">
              <Controller
                control={control}
                name="contentHtml"
                render={({ field }) => (
                  <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Escreva o post aqui..." minHeight={360} />
                )}
              />
            </Field>
            {errors.contentHtml ? <p className="text-sm text-rose-600">{errors.contentHtml.message}</p> : null}
          </div>

          <SeoFeedback title={seoTitle} description={seoDescription} content={content} contentLabel="Conteudo do post" />

          <Controller
            control={control}
            name="coverImageUrl"
            render={({ field }) => (
              <MediaUrlField
                label="Imagem de capa"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="/uploads/site/capa-post.png"
                hint="Opcional. Use a biblioteca de midia para copiar a URL."
                previewAlt={watch("title") || "Imagem de capa"}
              />
            )}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Field label="SEO title">
                <Input {...register("seoTitle")} />
              </Field>
              {errors.seoTitle ? <p className="text-sm text-rose-600">{errors.seoTitle.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Field label="SEO description">
                <Textarea {...register("seoDescription")} className="min-h-24" />
              </Field>
              {errors.seoDescription ? <p className="text-sm text-rose-600">{errors.seoDescription.message}</p> : null}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" className="h-4 w-4" {...register("isPublished")} />
            Publicar este post
          </label>

          {serverError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : mode === "create" ? "Criar post" : "Salvar alteracoes"}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.push("/admin/blog" as Route)}>
              Voltar para o blog
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
