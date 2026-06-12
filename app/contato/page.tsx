import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { empregoSaoLuisInstitutional } from "@/lib/emprego-sao-luis-institutional";
import { siteConfig } from "@/lib/constants";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

const page = empregoSaoLuisInstitutional.contact;

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Contato - Emprego São Luís",
    description: page.description,
    pathname: "/contato"
  });
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contato", path: "/contato" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contato" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading eyebrow="Contato" title={page.title} description={page.description} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
        <div className="space-y-6">
          <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-8" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(page.contentHtml) }} />
          <div className="brand-chip rounded-[2rem] p-6 sm:p-8">
            <h2 className="text-lg font-black text-[var(--brand-charcoal)]">Canais diretos</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--brand-text-secondary)]">
              <p>
                <span className="font-semibold text-[var(--brand-charcoal)]">Instagram:</span>{" "}
                <a href="https://instagram.com/empregosaoluis" target="_blank" rel="noreferrer" className="text-[var(--brand-brick)] hover:underline">
                  {siteConfig.instagram}
                </a>
              </p>
              <p>
                <span className="font-semibold text-[var(--brand-charcoal)]">E-mail:</span>{" "}
                <a href="mailto:contato@empregossaoluis.com.br" className="text-[var(--brand-brick)] hover:underline">
                  contato@empregossaoluis.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
