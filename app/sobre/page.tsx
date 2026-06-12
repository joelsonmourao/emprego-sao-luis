import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { empregoSaoLuisInstitutional } from "@/lib/emprego-sao-luis-institutional";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

const page = empregoSaoLuisInstitutional.about;

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Sobre - Emprego São Luís",
    description: page.description,
    pathname: "/sobre"
  });
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Sobre", path: "/sobre" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sobre" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading eyebrow="Sobre" title={page.title} description={page.description} />
      </div>
      <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(page.contentHtml) }} />
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/vagas">Ver vagas</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl">
          <Link href="/quem-somos">Quem somos</Link>
        </Button>
      </div>
    </section>
  );
}
