import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Quem Somos - Emprego São Luís",
    description:
      "Conheça a missão do Emprego São Luís: conectar candidatos a oportunidades de trabalho em São Luís, Região Metropolitana e cidades do Maranhão.",
    pathname: "/quem-somos"
  });
}

export default function QuemSomosPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Quem Somos", path: "/quem-somos" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quem Somos" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="Quem Somos"
          title="Um portal feito para facilitar a busca por emprego no Maranhão"
          description={siteConfig.slogan}
        />
      </div>
      <div className="prose-content space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">
        <p>
          O Emprego São Luís nasceu com um objetivo simples e importante: ajudar pessoas a encontrar oportunidades de trabalho em São Luís, na Região Metropolitana e em outras cidades do Maranhão de forma organizada, gratuita e acessível.
        </p>
        <h2>Nossa missão</h2>
        <p>
          Reunir vagas divulgadas por empresas, consultorias e fontes de recrutamento, facilitando o caminho de quem está procurando emprego, estágio ou jovem aprendiz. Queremos que o candidato encontre informações claras, sem precisar navegar por dezenas de links soltos.
        </p>
        <h2>O que fazemos</h2>
        <p>
          Atuamos como divulgador e agregador de oportunidades. Publicamos vagas com descrição útil, organizamos por cidade e categoria, e oferecemos conteúdos no blog para ajudar na preparação de currículo, entrevista e candidatura online.
        </p>
        <h2>O que não somos</h2>
        <p>
          O Emprego São Luís não é a empresa contratante das vagas publicadas. As informações de cada oportunidade são de responsabilidade da empresa ou fonte anunciante. Nosso papel é divulgar e facilitar o acesso, sempre com transparência.
        </p>
        <h2>Compromisso com o candidato</h2>
        <p>
          Trabalhamos para manter o portal rápido, responsivo e confiável — especialmente no celular, onde muita gente busca emprego. Acreditamos que informação organizada e conteúdo útil fazem diferença real na jornada de quem procura trabalho.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/vagas">Ver vagas disponíveis</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl">
          <Link href="/contato">Falar com a equipe</Link>
        </Button>
      </div>
    </section>
  );
}
