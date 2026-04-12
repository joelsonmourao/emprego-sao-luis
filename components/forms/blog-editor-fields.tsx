import { blogFormDefaults } from "@/lib/schemas/blog-form";
import { Field, Input, Select, Textarea } from "@/components/forms/field";

export function BlogEditorFields({ categories }: { categories: string[] }) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Titulo do post">
          <Input defaultValue={blogFormDefaults.title} placeholder="Como conseguir vaga de jovem aprendiz em Sao Luis" />
        </Field>
        <Field label="Slug">
          <Input defaultValue={blogFormDefaults.slug} placeholder="como-conseguir-vaga-de-jovem-aprendiz-em-sao-luis" />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Categoria">
          <Select defaultValue="">
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Imagem de capa">
          <Input defaultValue={blogFormDefaults.coverImageUrl} placeholder="https://..." />
        </Field>
      </div>

      <Field label="Resumo">
        <Textarea defaultValue={blogFormDefaults.excerpt} placeholder="Explique em poucas linhas o ganho do conteudo para o usuario." className="min-h-24" />
      </Field>

      <Field label="Conteudo do post" hint="Base pronta para editor rico, revisao editorial e futura integracao com painel admin.">
        <Textarea
          defaultValue={blogFormDefaults.contentHtml}
          placeholder="Escreva o conteudo em blocos bem estruturados, com titulos, contexto local e CTA."
          className="min-h-56"
        />
      </Field>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="SEO title">
          <Input defaultValue={blogFormDefaults.seoTitle} placeholder="Guia de jovem aprendiz em Sao Luis" />
        </Field>
        <Field label="SEO description">
          <Textarea defaultValue={blogFormDefaults.seoDescription} placeholder="Resumo forte para SERP e compartilhamento." className="min-h-24" />
        </Field>
      </div>
    </div>
  );
}
