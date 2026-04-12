import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildSiteMetadata({
    title: siteContent.pages.contact.seoTitle,
    description: siteContent.pages.contact.seoDescription,
    pathname: "/contato"
  });
}

export default async function ContactPage() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);
  const contactChannels = [
    settings.email
      ? {
          label: "E-mail",
          value: settings.email,
          href: `mailto:${settings.email}`,
          action: "Enviar e-mail"
        }
      : null,
    settings.whatsapp
      ? {
          label: "WhatsApp",
          value: settings.whatsapp,
          href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
          action: "Abrir WhatsApp"
        }
      : null,
    settings.phone
      ? {
          label: "Telefone",
          value: settings.phone,
          href: `tel:${settings.phone.replace(/\s+/g, "")}`,
          action: "Ligar"
        }
      : null
  ].filter(Boolean) as Array<{ label: string; value: string; href: string; action: string }>;

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contato", path: "/contato" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contato" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Contato"
          title={siteContent.pages.contact.title}
          description={siteContent.pages.contact.description}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.contact.contentHtml) }} />
        <div className="space-y-6">
          <div className="brand-chip rounded-[2rem] p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Canais de contato</h2>
            <div className="mt-4 grid gap-3">
              {contactChannels.length ? (
                contactChannels.map((channel) => (
                  <div key={channel.label} className="rounded-[1.5rem] border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-orange)]">{channel.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--brand-navy)]">{channel.value}</p>
                    <Button asChild size="sm" className="mt-4">
                      <a href={channel.href}>{channel.action}</a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[color:rgba(26,43,76,0.16)] bg-white px-4 py-4 text-sm leading-7 text-[var(--brand-text-secondary)]">
                  Os canais diretos ainda nao foram publicados nas configuracoes do portal. Enquanto isso, a equipe pode atualizar estes dados pelo painel administrativo.
                </div>
              )}
            </div>
          </div>
          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)]">Quando vale entrar em contato</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--brand-text-secondary)]">
              <li>- Erro em vaga, link quebrado ou informacao desatualizada</li>
              <li>- Dificuldade de navegacao, busca ou filtros</li>
              <li>- Sugestao de conteudo para curriculo, entrevista e primeiro emprego</li>
              <li>- Atualizacao institucional e assuntos ligados a empresas parceiras</li>
            </ul>
            <p className="mt-4 text-sm leading-7 text-[var(--brand-text-secondary)]">{settings.supportText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
