import { EditorShell } from "@/components/editor-shell";
import { BlogCard } from "@/components/blog-card";
import { BlogEditorFields } from "@/components/forms/blog-editor-fields";
import { buildMetadata } from "@/lib/seo/metadata";
import { getRecentPosts } from "@/lib/repositories/blog";

export const metadata = buildMetadata({
  title: "Modelo de cadastro de post",
  description: "Pagina de preparacao para o futuro painel admin do blog.",
  pathname: "/gestao/modelos/blog",
  noIndex: true
});

export default async function BlogModelPage() {
  const posts = await getRecentPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category.name)));

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <EditorShell
        eyebrow="Estrutura futura"
        title="Modelo de cadastro de post do blog"
        description="Esses campos foram organizados para SEO editorial, conteudo evergreen e futura edicao em painel admin."
      >
        <BlogEditorFields categories={categories} />
      </EditorShell>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="brand-chip rounded-[2rem] p-6">
          <h2 className="text-2xl font-black text-slate-950">Base editorial preparada</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <li>• Campos pensados para SEO, resumo, categoria e imagem de capa.</li>
            <li>• Estrutura pronta para preview, revisao editorial e publicacao futura.</li>
            <li>• Conteudo conectado a cidades, categorias, empresas e vagas.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-950">Preview basico de card do blog</h2>
          {posts.slice(0, 1).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
