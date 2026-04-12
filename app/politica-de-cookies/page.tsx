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
    title: siteContent.pages.cookies.seoTitle,
    description: siteContent.pages.cookies.seoDescription,
    pathname: "/politica-de-cookies"
  });
}

export default async function CookiesPolicyPage() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Politica de Cookies", path: "/politica-de-cookies" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Politica de Cookies" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading eyebrow="Cookies" title={siteContent.pages.cookies.title} description={siteContent.pages.cookies.description} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.cookies.contentHtml) }} />
        <div className="space-y-6">
          <div className="brand-chip rounded-[2rem] p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Categorias usadas no portal</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--brand-text-secondary)]">
              <div>
                <p className="font-semibold text-[var(--brand-navy)]">Necessarios</p>
                <p>Ativos para seguranca, preferencia de consentimento e funcionamento do portal.</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--brand-navy)]">Analiticos</p>
                <p>{settings.google.analyticsEnabled ? "Podem ser usados para medir navegacao e desempenho, sempre respeitando a preferencia do usuario." : "A estrutura esta pronta, mas a medicao opcional ainda nao esta ativa nesta configuracao."}</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--brand-navy)]">Marketing</p>
                <p>{settings.google.adsenseEnabled ? "Podem ser usados para publicidade quando esta categoria for autorizada." : "A categoria continua prevista no controle de preferencias, mas publicidade ainda nao esta ativa nesta configuracao."}</p>
              </div>
            </div>
          </div>
          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Como ajustar a escolha</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              O portal mostra um banner no primeiro acesso e depois mantem um atalho para reabrir as preferencias de cookies sem precisar limpar o navegador.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
