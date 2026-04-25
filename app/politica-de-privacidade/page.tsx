import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildSiteMetadata({
    title: siteContent.pages.privacy.seoTitle,
    description: siteContent.pages.privacy.seoDescription,
    pathname: "/politica-de-privacidade"
  });
}

export default async function PrivacyPage() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Política de Privacidade", path: "/politica-de-privacidade" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Política de Privacidade" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Privacidade"
          title={siteContent.pages.privacy.title}
          description={siteContent.pages.privacy.description}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.privacy.contentHtml) }} />
        <div className="space-y-6">
          <div className="brand-chip rounded-[2rem] p-8">
          <h2 className="text-xl font-black text-[var(--brand-navy)]">Resumo rápido</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              <li>- O portal trata dados de navegacao e contato quando isso faz sentido para operar o servico</li>
              <li>- Recursos de medicao opcionais dependem de configuracao e consentimento</li>
              <li>- Links de candidatura podem levar para paginas externas das empresas</li>
            </ul>
          </div>
          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Canal para assuntos de privacidade</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              {settings.email ? `Para tratar assuntos ligados a privacidade e dados enviados voluntariamente, use o e-mail ${settings.email}.` : "Quando houver um e-mail institucional publicado nas configuracoes do portal, ele aparece aqui como canal principal para assuntos de privacidade."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
