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
    title: siteContent.pages.contact.seoTitle,
    description: siteContent.pages.contact.seoDescription,
    pathname: "/contato"
  });
}

export default async function ContactPage() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contato", path: "/contato" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contato" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(34,73,245,0.45)] sm:px-8">
        <SectionHeading
          eyebrow="Contato"
          title={siteContent.pages.contact.title}
          description={siteContent.pages.contact.description}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.contact.contentHtml) }} />
        <div className="brand-chip rounded-[2rem] p-8">
          <h2 className="text-xl font-black text-slate-950">Canais de contato</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {settings.email ? <p><strong>E-mail:</strong> {settings.email}</p> : null}
            {settings.phone ? <p><strong>Telefone:</strong> {settings.phone}</p> : null}
            {settings.whatsapp ? <p><strong>WhatsApp:</strong> {settings.whatsapp}</p> : null}
            <p>{settings.supportText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
