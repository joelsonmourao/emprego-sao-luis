import Link from "next/link";

import { buildSiteMetadata } from "@/lib/seo/metadata";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Menor Aprendiz: vagas, idade e como conseguir",
    description:
      "Entenda como funcionam as vagas de menor aprendiz, veja requisitos mais comuns e acesse oportunidades por cidade e estado.",
    pathname: "/menor-aprendiz"
  });
}

export default function MenorAprendizPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="brand-page-hero rounded-[2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Guia rapido"
          title="Menor Aprendiz: como encontrar vagas com mais foco"
          description="No mercado, muita gente procura por menor aprendiz para encontrar oportunidades de primeiro emprego. Nesta pagina voce encontra os pontos principais e os proximos passos para buscar vagas."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/vagas">Ver vagas abertas</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl">
            <Link href="/blog">Ler dicas no blog</Link>
          </Button>
        </div>
      </div>

      <article className="prose-content rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-8">
        <h2>Menor aprendiz e jovem aprendiz: qual a diferenca?</h2>
        <p>
          Em muitas buscas, os termos aparecem como sinonimos. Na pratica, as vagas normalmente estao dentro do programa de jovem aprendiz e seguem
          regras especificas da empresa e da regiao.
        </p>
        <h2>Como aumentar suas chances</h2>
        <ul>
          <li>Pesquisar vagas por cidade e estado para reduzir concorrencia ampla.</li>
          <li>Manter um curriculo simples, atualizado e objetivo.</li>
          <li>Ler requisitos e etapas antes de se candidatar.</li>
          <li>Treinar apresentacao para entrevistas de primeiro emprego.</li>
        </ul>
        <h2>Proximos passos</h2>
        <p>
          Use a pagina de vagas para filtrar oportunidades e acompanhe o blog para melhorar curriculo, entrevista e preparo para o primeiro emprego.
        </p>
      </article>
    </section>
  );
}
