import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobSubmissionForm } from "@/components/forms/job-submission-form";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Anuncie uma Vaga - Emprego São Luís",
    description:
      "Divulgue sua vaga para candidatos de São Luís, Região Metropolitana e Maranhão. Empresas e recrutadores podem enviar oportunidades pelo portal.",
    pathname: "/anunciar-vaga"
  });
}

export default function AnunciarVagaPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Anunciar Vaga", path: "/anunciar-vaga" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Anunciar Vaga" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="Empresas e recrutadores"
          title="Divulgue sua vaga no Emprego São Luís"
          description="Divulgue sua vaga para candidatos de São Luís, Região Metropolitana e Maranhão."
        />
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-6 text-sm leading-7 text-[var(--brand-text-secondary)]">
          Preencha o formulário abaixo com as informações da oportunidade. A equipe do portal analisará os dados e entrará em contato pelo e-mail informado. O Emprego São Luís atua como divulgador de oportunidades — a contratação é realizada pela empresa anunciante.
        </p>
        <JobSubmissionForm />
      </div>
    </section>
  );
}
