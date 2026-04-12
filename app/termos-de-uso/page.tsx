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
    title: siteContent.pages.terms.seoTitle,
    description: siteContent.pages.terms.seoDescription,
    pathname: "/termos-de-uso"
  });
}

export default async function TermsPage() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Termos de Uso", path: "/termos-de-uso" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Termos de Uso" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Termos"
          title={siteContent.pages.terms.title}
          description={siteContent.pages.terms.description}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.terms.contentHtml) }} />
        <div className="space-y-6">
          <div className="brand-chip rounded-[2rem] p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Pontos principais</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              <li>- O portal organiza vagas e conteudos, mas a candidatura final acontece no link oficial informado</li>
              <li>- Informacoes de vagas podem mudar conforme a empresa ou a fonte original</li>
              <li>- Navegacao abusiva, copia indevida e acesso nao autorizado ao admin nao sao permitidos</li>
            </ul>
          </div>
          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Contato para duvidas</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              {settings.email ? `Se voce tiver duvidas sobre estas regras, use o e-mail ${settings.email}.` : "Quando o canal institucional principal estiver configurado, ele aparece aqui para facilitar o contato sobre uso do portal."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
