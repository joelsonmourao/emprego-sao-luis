import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { JobSearchFilterBar } from "@/components/vagas/job-search-filter-bar";
import { SectionHeading } from "@/components/section-heading";
import { getSearchGeoData } from "@/lib/repositories/geo";
import { getApprenticeCityUfSitemapRows } from "@/lib/repositories/jobs";
import { buildJovemAprendizCityUfPath } from "@/lib/seo/jovem-aprendiz-city-uf-slug";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/json-ld";
import type { JobSearchFilterGeoState } from "@/lib/vagas/job-search-filter-resolve";

export const revalidate = 1800;

const PATH = "/vagas/jovem-aprendiz";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Jovem Aprendiz por cidade",
    description:
      "Vagas de Jovem Aprendiz por cidade e UF: listagens com oportunidades ativas, busca por região e links para cada localidade.",
    pathname: PATH,
    canonicalUrl: PATH
  });
}

function mapGeo(states: Awaited<ReturnType<typeof getSearchGeoData>>): JobSearchFilterGeoState[] {
  return states.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    code: s.code,
    cities: s.cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
  }));
}

export default async function JovemAprendizHubPage() {
  const [geoRaw, apprenticeRows] = await Promise.all([getSearchGeoData(), getApprenticeCityUfSitemapRows()]);
  const geoStates = mapGeo(geoRaw);

  const cityMetaByKey = new Map<string, { name: string; stateCode: string }>();
  for (const st of geoRaw) {
    for (const c of st.cities) {
      cityMetaByKey.set(`${c.slug}__${st.code}`, { name: c.name, stateCode: st.code });
    }
  }

  const links = apprenticeRows
    .map((row) => {
      const meta = cityMetaByKey.get(`${row.citySlug}__${row.stateCode}`);
      if (!meta) return null;
      return { ...row, cityName: meta.name, stateCode: meta.stateCode };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.cityName.localeCompare(b.cityName, "pt-BR"));

  const pageTitle = "Jovem Aprendiz por cidade";
  const pageDescription =
    "Navegue pelas listagens de Jovem Aprendiz organizadas por cidade e UF. Cada página reúne vagas ativas divulgadas por empresas.";

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildWebPageJsonLd({ name: pageTitle, description: pageDescription, path: PATH })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: "Jovem Aprendiz", path: PATH }
        ])}
      />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: "Jovem Aprendiz" }]} />

      <JobSearchFilterBar states={geoStates} defaultQuery="Jovem Aprendiz" className="min-h-[5.5rem]" />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Hub Jovem Aprendiz</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-4xl">{pageTitle}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{pageDescription}</p>
        <p className="mt-4 text-sm text-[var(--brand-text-secondary)]">
          Quer a lista geral?{" "}
          <Link href="/vagas" className="font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)]">
            Ir para todas as vagas
          </Link>
        </p>
      </header>

      <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeading
          eyebrow="Cidades"
          title="Acesso rápido por localidade"
          description="Somente cidades com pelo menos uma vaga ativa no critério Jovem Aprendiz do portal."
        />
        {links.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {links.map((row) => (
              <li key={`${row.citySlug}-${row.stateCode}`}>
                <Link
                  href={buildJovemAprendizCityUfPath(row.citySlug, row.stateCode)}
                  className="inline-flex rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"
                >
                  {`${row.cityName}, ${row.stateCode}`}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-[var(--brand-text-secondary)]">Nenhuma cidade com vagas ativas no momento.</p>
        )}
      </div>
    </section>
  );
}
