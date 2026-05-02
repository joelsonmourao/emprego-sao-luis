import Link from "next/link";

import { PublicAdSlot } from "@/components/ads/public-ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { JobsGridWithMidAd } from "@/components/vagas/jobs-grid-with-mid-ad";
import { pagination } from "@/lib/constants";
import type { JobListingPayload } from "@/lib/repositories/jobs";
import { getCityJobsPath, getJobPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildItemListJsonLdFromJobs,
  buildPlaceJsonLdForCityLocality,
  buildWebPageJsonLd
} from "@/lib/seo/json-ld";

type CityModel = {
  id: string;
  name: string;
  slug: string;
  state: { id: string; name: string; slug: string; code: string };
};

export type JovemAprendizCityUfSeoViewProps = {
  estadoSegment: string;
  city: CityModel;
  jobs: {
    items: JobListingPayload[];
    total: number;
    page: number;
    totalPages: number;
  };
  order: "relevance" | "date";
  title: string;
  description: string;
  h1: string;
  intro: string;
  aboutTitle: string;
  aboutBody: string;
  faq: Array<{ question: string; answer: string }>;
};

function buildPageHref(estadoSegment: string, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  const base = `/vagas/jovem-aprendiz/${estadoSegment}`;
  return query ? `${base}?${query}` : base;
}

export function JovemAprendizCityUfSeoView(props: JovemAprendizCityUfSeoViewProps) {
  const { city, jobs, estadoSegment, order, title, description, h1, intro, aboutTitle, aboutBody, faq } = props;
  const pathname = `/vagas/jovem-aprendiz/${estadoSegment}`;
  const buildOrderHref = (o: "relevance" | "date") => buildPageHref(estadoSegment, o, 1);

  const itemList = jobs.items.map((job, i) => ({
    position: (jobs.page - 1) * pagination.jobsPerPage + i + 1,
    name: job.title,
    path: getJobPath(job.slug)
  }));

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildWebPageJsonLd({ name: title, description, path: pathname })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: "Jovem Aprendiz", path: "/vagas" },
          { name: `${city.name}, ${city.state.code}`, path: pathname }
        ])}
      />
      <JsonLd data={buildItemListJsonLdFromJobs(itemList)} />
      <JsonLd data={buildPlaceJsonLdForCityLocality({ cityName: city.name, stateCode: city.state.code })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vagas", href: "/vagas" },
          { label: "Jovem Aprendiz", href: "/vagas" },
          { label: `${city.name}, ${city.state.code}` }
        ]}
      />

      <PublicAdSlot slotSlug="home-after-quicklinks" format="auto" fullWidthResponsive minHeightClass="min-h-[280px]" />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Jovem Aprendiz por cidade</p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{h1}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{intro}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-[var(--brand-text-secondary)]">Ordenar por:</span>
            <Link
              href={buildOrderHref("relevance")}
              className={
                order === "date"
                  ? "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)]"
                  : "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"
              }
            >
              Relevancia
            </Link>
            <Link
              href={buildOrderHref("date")}
              className={
                order === "date"
                  ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"
                  : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)]"
              }
            >
              Data
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading eyebrow="Listagem" title={`Vagas em ${city.name}`} description="Oportunidades ativas de contratação como Jovem Aprendiz divulgadas por empresas." />
          </div>

          {jobs.items.length ? (
            <>
              <JobsGridWithMidAd jobs={jobs.items} />
              <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(estadoSegment, order, pageNumber)} />
            </>
          ) : null}

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">{aboutTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">{aboutBody}</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.8rem] p-6">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Outras rotas</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link className="font-medium text-[var(--brand-blue)] hover:text-[var(--brand-orange)]" href={getCityJobsPath(city.slug)}>
                  Listagem por cidade ({city.name})
                </Link>
              </li>
              <li>
                <Link className="font-medium text-[var(--brand-blue)] hover:text-[var(--brand-orange)]" href={getStateJobsPath(city.state.slug)}>
                  Vagas no estado {city.state.name}
                </Link>
              </li>
            </ul>
          </div>
          <PublicAdSlot slotSlug="home-featured-mid" format="auto" fullWidthResponsive minHeightClass="min-h-[280px]" />
        </aside>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-[var(--brand-navy)]">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </div>

      <PublicAdSlot slotSlug="home-blog" format="auto" fullWidthResponsive minHeightClass="min-h-[250px]" />
    </section>
  );
}
