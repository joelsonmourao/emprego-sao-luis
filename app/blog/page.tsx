import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getPosts } from "@/lib/repositories/blog";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Blog sobre Jovem Aprendiz e primeiro emprego",
    description: "Dicas de curriculo, entrevista, empresas que contratam e caminhos para conseguir a primeira vaga.",
    pathname: "/blog"
  });
}

export default async function BlogPage() {
  const posts = await getPosts({ page: 1 });

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Dicas para curriculo, entrevista e primeiro emprego"
          description={`Veja ${posts.total} post(s) com orientacoes para se preparar melhor antes de se candidatar.`}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/vagas">Ver vagas</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl">
            <Link href="/empresas">Ver empresas</Link>
          </Button>
        </div>
      </div>
      <div className="brand-chip rounded-[2rem] p-6">
        <SectionHeading
          eyebrow="Para quem esta comecando"
          title="Aprenda a se apresentar melhor antes de enviar o curriculo"
          description="Os textos do blog ajudam a entender como montar curriculo, se sair melhor na entrevista e aproveitar as vagas de Jovem Aprendiz com mais preparo."
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {posts.items.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
