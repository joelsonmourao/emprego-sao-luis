"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { MapPinned, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackPortalEvent } from "@/lib/analytics/client";
import type { JobSearchFilterGeoState } from "@/lib/vagas/job-search-filter-resolve";
import { buildVagasQueryFallback } from "@/lib/vagas/job-search-filter-resolve";
import { cn } from "@/lib/utils";

export type JobSearchFilterBarProps = {
  states: JobSearchFilterGeoState[];
  defaultQuery?: string;
  defaultLocation?: string;
  className?: string;
};

export function JobSearchFilterBar({
  states,
  defaultQuery = "",
  defaultLocation = "",
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
    router.push(buildVagasQueryFallback(q, loc, geo));
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "w-full rounded-[1.75rem] border border-[color:rgba(26,43,76,0.1)] bg-white p-4 shadow-[0_20px_60px_-40px_rgba(26,43,76,0.18)] sm:rounded-[2rem] sm:p-6",
        className
      )}
    >
      <div className="grid w-full gap-3 sm:gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-stretch">
        <label className="flex min-h-[3.25rem] items-center gap-3 rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-[linear-gradient(180deg,#fff,#f7f9fc)] px-4 py-2">
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" aria-hidden />
          <span className="sr-only">Cargo, palavra-chave ou empresa</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cargo, palavra-chave ou empresa"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--brand-navy)] outline-none placeholder:text-[var(--brand-text-secondary)] sm:text-base"
          />
        </label>
        <label className="flex min-h-[3.25rem] items-center gap-3 rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-[linear-gradient(180deg,#fff,#f7f9fc)] px-4 py-2">
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" aria-hidden />
          <span className="sr-only">Cidade ou UF</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade ou UF"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--brand-navy)] outline-none placeholder:text-[var(--brand-text-secondary)] sm:text-base"
          />
        </label>
        <Button type="submit" size="lg" className="h-12 w-full shrink-0 rounded-2xl font-semibold md:h-auto md:w-auto md:min-w-[10.5rem]">
          Buscar vagas
        </Button>
      </div>
    </form>
  );
}
