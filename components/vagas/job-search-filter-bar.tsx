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

  const fieldClass =
    "flex min-h-[3.25rem] min-w-0 items-center gap-2.5 rounded-2xl border border-[rgba(123,44,40,0.26)] bg-white px-3.5 py-2 shadow-[0_10px_28px_-24px_rgba(123,44,40,0.3)] focus-within:border-[var(--brand-brick)] focus-within:ring-2 focus-within:ring-[rgba(123,44,40,0.18)] sm:gap-3 sm:px-4";
  const inputClass =
    "min-w-0 flex-1 bg-transparent text-sm text-[var(--brand-charcoal)] outline-none placeholder:text-[var(--brand-text-secondary)] sm:text-base";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "w-full rounded-[1.75rem] border border-[rgba(123,44,40,0.38)] bg-white p-4 shadow-[0_20px_60px_-40px_rgba(123,44,40,0.3)] ring-1 ring-[rgba(123,44,40,0.06)] sm:rounded-[2rem] sm:p-6",
        className
      )}
    >
      <div className="grid w-full gap-3 sm:gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-stretch">
        <label className={fieldClass}>
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" aria-hidden />
          <span className="sr-only">Cargo, palavra-chave ou empresa</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cargo, palavra-chave ou empresa"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label className={fieldClass}>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" aria-hidden />
          <span className="sr-only">Cidade ou UF</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade ou UF"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full shrink-0 rounded-2xl bg-[var(--brand-brick)] font-semibold shadow-[0_16px_34px_-18px_rgba(123,44,40,0.55)] hover:bg-[#65231f] md:h-auto md:w-auto md:min-w-[10.5rem]"
        >
          Buscar vagas
        </Button>
      </div>
    </form>
  );
}
