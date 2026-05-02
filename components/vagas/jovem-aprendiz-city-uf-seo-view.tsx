import type { LocationType } from "@prisma/client";
import Link from "next/link";

import { PublicAdSlot } from "@/components/ads/public-ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobSearchFilterBar } from "@/components/vagas/job-search-filter-bar";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { JobsGridWithMidAd } from "@/components/vagas/jobs-grid-with-mid-ad";
import { pagination } from "@/lib/constants";
import type { JobListingPayload } from "@/lib/repositories/jobs";
import type { JobSearchFilterGeoState } from "@/lib/vagas/job-search-filter-resolve";
import { getCityJobsPath, getJobPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildItemListJsonLdFromJobs,
  buildPlaceJsonLdForCityLocality,
  buildWebPageJsonLd
} from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

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
  modalidade?: LocationType;
  /** Título completo para WebPage (igual ao &lt;title&gt; renderizado). */
  webPageJsonLdName: string;
  description: string;
  h1: string;
  intro: string;
  aboutTitle: string;
  aboutBody: string;
  faq: Array<{ question: string; answer: string }>;
  geoStates: JobSearchFilterGeoState[];
};

function buildPageHref(
  estadoSegment: string,
  opts: { order?: "relevance" | "date"; page?: number; modalidade?: LocationType | null } = {}
) {
  const params = new URLSearchParams();
  const ord = opts.order ?? "relevance";
  if (ord !== "relevance") params.set("order", ord);
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  if (opts.modalidade) params.set("modalidade", opts.modalidade);
  const query = params.toString();
  const base = `/vagas/jovem-aprendiz/${estadoSegment}`;
  return query ? `${base}?${query}` : base;
}

function chipClass(active: boolean) {
  return cn(
    "rounded-full px-4 py-2 text-sm font-medium transition",
    active ? "bg-[var(--brand-navy)] font-semibold text-white" : "border border-[color:rgba(26,43,76,0.1)] bg-white text-[var(--brand-text-secondary)] hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"
  );
}

export function JovemAprendizCityUfSeoView(props: JovemAprendizCityUfSeoViewProps) {
  const { city, jobs, estadoSegment, order, modalidade, webPageJsonLdName, description, h1, intro, aboutTitle, aboutBody, faq, geoStates } = props;
  const pathname = `/vagas/jovem-aprendiz/${estadoSegment}`;

  const itemList = jobs.items.map((job, i) => ({
    position: (jobs.page - 1) * pagination.jobsPerPage + i + 1,
    name: job.title,
    path: getJobPath(job.slug)
  }));

  const hasRemote = jobs.items.some((j) => j.locationType === "REMOTE");
  const hasHybrid = jobs.items.some((j) => j.locationType === "HYBRID");
  const hasOnsite = jobs.items.some((j) => !j.locationType || j.locationType === "ONSITE");

  return (
    <section className="mx-auto max-w-[90rem] space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
      <JsonLd data={buildWebPageJsonLd({ name: webPageJsonLdName, description, path: pathname })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: "Jovem Aprendiz", path: "/vagas/jovem-aprendiz" },
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
          { label: "Jovem Aprendiz", href: "/vagas/jovem-aprendiz" },
          { label: `${city.name}, ${city.state.code}` }
        ]}
      />

      <JobSearchFilterBar
        states={geoStates}
        defaultQuery="Jovem Aprendiz"
        defaultLocation={`${city.name}, ${city.state.code}`}
        className="min-h-[5.5rem]"
      />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Jovem Aprendiz por cidade</p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{h1}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{intro}</p>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-text-secondary)]">Filtros rápidos</span>
            <div className="flex flex-wrap gap-2">
              <Link href={buildPageHref(estadoSegment, {})} className={chipClass(order === "relevance" && !modalidade)}>
                Relevância
              </Link>
              <Link href={buildPageHref(estadoSegment, { order: "date" })} className={chipClass(order === "date" && !modalidade)}>
                Mais recentes
              </Link>
              {hasOnsite ? (
                <Link href={buildPageHref(estadoSegment, { modalidade: "ONSITE" })} className={chipClass(modalidade === "ONSITE")}>
                  Presencial
                </Link>
              ) : null}
              {hasHybrid ? (
                <Link href={buildPageHref(estadoSegment, { modalidade: "HYBRID" })} className={chipClass(modalidade === "HYBRID")}>
                  Híbrido
                </Link>
              ) : null}
              {hasRemote ? (
                <Link href={buildPageHref(estadoSegment, { modalidade: "REMOTE" })} className={chipClass(modalidade === "REMOTE")}>
                  Remoto
                </Link>
              ) : null}
              <Link href={`/vagas?estado=${city.state.slug}&cidade=${city.slug}`} className={chipClass(false)}>
                Empresas
              </Link>
              <Link href={getCityJobsPath(city.slug)} className={chipClass(false)}>
                Cidade
              </Link>
              <Link href={getStateJobsPath(city.state.slug)} className={chipClass(false)}>
                Estado
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Listagem"
              title={`Vagas em ${city.name}`}
              description="Oportunidades ativas divulgadas por empresas; o portal apenas reúne e organiza as informações."
            />
          </div>

          {jobs.items.length ? (
            <>
              <JobsGridWithMidAd jobs={jobs.items} maxColumns={2} />
              <PaginationNav
                page={jobs.page}
                totalPages={jobs.totalPages}
                buildHref={(pageNumber) =>
                  buildPageHref(estadoSegment, {
                    order,
                    page: pageNumber,
                    modalidade: modalidade ?? null
                  })
                }
              />
            </>
          ) : null}

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">{aboutTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">{aboutBody}</p>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
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
        </div>

        <aside className="min-w-0 space-y-6 lg:max-w-[20rem]">
          <div className="overflow-hidden rounded-[1.8rem] border border-[color:rgba(26,43,76,0.08)] bg-white p-3 shadow-sm">
            <PublicAdSlot slotSlug="home-featured-mid" format="rectangle" fullWidthResponsive minHeightClass="min-h-[280px]" />
          </div>
        </aside>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-[var(--brand-navy)]">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </div>
    </section>
  );
}
