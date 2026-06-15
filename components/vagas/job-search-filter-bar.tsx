"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { MapPinned, Search } from "lucide-react";

import { trackPortalEvent } from "@/lib/analytics/client";
import type { JobSearchFilterGeoState } from "@/lib/vagas/job-search-filter-resolve";
import { buildVagasQueryFallback } from "@/lib/vagas/job-search-filter-resolve";
import { cn } from "@/lib/utils";

export type JobSearchFilterBarProps = {
  states: JobSearchFilterGeoState[];
  defaultQuery?: string;
  defaultLocation?: string;
  categorySlug?: string;
  className?: string;
};

export function JobSearchFilterBar({
  states,
  defaultQuery = "",
  defaultLocation = "",
  categorySlug,
  className
}: JobSearchFilterBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);

  const serialized = useMemo(() => JSON.stringify(states), [states]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    const loc = location.trim();
    void trackPortalEvent({
      eventName: "job_filter_bar_submit",
      path: typeof window !== "undefined" ? window.location.pathname : "",
      metadata: { query: q, location: loc }
    });

    const geo = JSON.parse(serialized) as JobSearchFilterGeoState[];
    const href = buildVagasQueryFallback(q, loc, geo);
    if (!categorySlug) {
      router.push(href);
      return;
    }

    const [pathname, search = ""] = href.split("?");
    const params = new URLSearchParams(search);
    params.set("categoria", categorySlug);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className={cn("es-search-shell w-full rounded-2xl p-4 sm:rounded-[2rem] sm:p-6", className)}>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-stretch">
        <label className="es-search-field sm:col-span-2 md:col-span-1">
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" aria-hidden />
          <span className="sr-only">Cargo, palavra-chave ou empresa</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cargo, palavra-chave ou empresa"
            autoComplete="off"
            className="es-search-input"
          />
        </label>
        <label className="es-search-field">
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" aria-hidden />
          <span className="sr-only">Cidade ou UF</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade ou UF"
            autoComplete="off"
            className="es-search-input"
          />
        </label>
        <button type="submit" className="es-search-submit md:min-w-[10.5rem]">
          Buscar vagas
        </button>
      </div>
    </form>
  );
}
