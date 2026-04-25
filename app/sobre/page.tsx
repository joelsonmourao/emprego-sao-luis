import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildSiteMetadata({
    title: siteContent.pages.about.seoTitle,
    description: siteContent.pages.about.seoDescription,
    pathname: "/sobre"
  });
}

export default async function AboutPage() {
  const siteContent = await getSiteContent();

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Sobre", path: "/sobre" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sobre" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Sobre"
          title={siteContent.pages.about.title}
          description={siteContent.pages.about.description}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.about.contentHtml) }} />
        <div className="space-y-6">
          <div className="brand-chip rounded-[2rem] p-8">
          <h2 className="text-xl font-black text-[var(--brand-navy)]">O que você encontra aqui</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              <li>- Vagas por cidade, estado e empresa</li>
              <li>- Paginas organizadas para facilitar comparacao</li>
            <li>- Conteúdos para currículo, entrevista e candidatura</li>
              <li>- Navegacao pensada para funcionar bem no celular</li>
            </ul>
          </div>
          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Como usar melhor o portal</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              Comece pela busca de vagas ou navegue pelas paginas de cidade e empresa. Depois, use o blog para se preparar antes de abrir o link de candidatura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
