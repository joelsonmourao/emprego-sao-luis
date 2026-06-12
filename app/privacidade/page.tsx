import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { empregoSaoLuisInstitutional } from "@/lib/emprego-sao-luis-institutional";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

const page = empregoSaoLuisInstitutional.privacy;

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Política de Privacidade - Emprego São Luís",
    description: page.description,
    pathname: "/privacidade"
  });
}

export default function PrivacidadePage() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacidade", path: "/privacidade" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Política de Privacidade" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading eyebrow="Privacidade" title={page.title} description={page.description} />
      </div>
      <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(page.contentHtml) }} />
    </section>
  );
}
