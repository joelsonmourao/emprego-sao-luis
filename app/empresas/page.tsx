import Link from "next/link";
import { Building2 } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { buildCollectionPageJsonLd, buildCompaniesIndexSeo } from "@/lib/hub-seo";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getCompanyHubs } from "@/lib/repositories/jobs";

export async function generateMetadata() {
  const companies = await getCompanyHubs();
  const seo = buildCompaniesIndexSeo({ total: companies.length, pathname: "/empresas" });

  return buildSiteMetadata({
    title: seo.title,
    description: seo.description,
    pathname: "/empresas"
  });
}

export default async function CompaniesPage() {
  const companies = await getCompanyHubs();
  const seo = buildCompaniesIndexSeo({ total: companies.length, pathname: "/empresas" });

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Empresas", path: "/empresas" }])} />
      <JsonLd data={buildCollectionPageJsonLd({ name: seo.h1, description: seo.description, path: "/empresas" })} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Empresas" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Empresas"
          title={seo.h1}
          description={seo.intro}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {companies.map((company) => (
          <Link key={company.slug} href={`/empresas/${company.slug}`} className="brand-chip rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-12 w-12 rounded-2xl border border-slate-200 bg-white object-cover p-1" />
            ) : (
            <Building2 className="h-7 w-7 text-[var(--brand-orange)]" />
            )}
            <h2 className="mt-4 text-2xl font-black text-slate-950">{company.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Empresa com presenca em {company.cityName}, {company.stateCode}.
            </p>
                    <p className="mt-3 text-sm font-semibold text-[var(--brand-orange)]">{company.count} vaga(s) relacionada(s)</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
