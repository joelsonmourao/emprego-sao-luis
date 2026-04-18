"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPinned, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackPortalEvent } from "@/lib/analytics/client";

type SearchState = {
  id: string;
  name: string;
  slug: string;
  cities: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

type JobSearchFormProps = {
  states: SearchState[];
  action?: string;
  submitLabel?: string;
  helperText?: string;
  footerLinkHref?: string;
  footerLinkLabel?: string;
  initialQuery?: string;
  initialState?: string;
  initialCity?: string;
  compact?: boolean;
};

export function JobSearchForm({
  states,
  action = "/busca",
  submitLabel = "Buscar vagas",
  helperText = "Use cargo, cidade e estado para chegar mais rapido nas vagas.",
  footerLinkHref = "/vagas",
  footerLinkLabel = "Ver todas as vagas",
  initialQuery = "",
  initialState = "",
  initialCity = "",
  compact = false
}: JobSearchFormProps) {
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const currentState = states.find((item) => item.slug === selectedState);
  const availableCities = currentState?.cities ?? [];

  useEffect(() => {
    if (!availableCities.some((city) => city.slug === selectedCity)) {
      setSelectedCity("");
    }
  }, [availableCities, selectedCity]);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        void trackPortalEvent({
          eventName: "search_submit",
          path: action,
          metadata: {
            query: String(formData.get("q") ?? initialQuery),
            state: String(formData.get("estado") ?? selectedState),
            city: String(formData.get("cidade") ?? selectedCity)
          }
        });
      }}
      className={
        compact
          ? "rounded-[1.7rem] border border-[var(--brand-line)] bg-white/98 p-3.5 shadow-[0_24px_70px_-40px_rgba(26,43,76,0.18)] sm:rounded-[2rem] sm:p-4"
          : "rounded-[1.85rem] border border-white/60 bg-white/99 p-3.5 shadow-[0_30px_100px_-35px_rgba(26,43,76,0.24)] sm:rounded-[2.15rem] sm:p-4"
      }
    >
      <div className="grid gap-2.5 xl:grid-cols-[1.8fr_1fr_1fr_auto]">
        <label className="flex items-center gap-3 rounded-[1.15rem] border border-[var(--brand-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(244,247,246,0.98))] px-4 sm:rounded-2xl">
          <span className="sr-only">Cargo, empresa ou palavra-chave</span>
          <Search className="h-5 w-5 text-[var(--brand-orange)]" />
          <input
            name="q"
            defaultValue={initialQuery}
            placeholder="Cargo, empresa ou palavra-chave"
            aria-label="Cargo, empresa ou palavra-chave"
            className="h-11 w-full bg-transparent text-sm text-[var(--brand-navy)] outline-none placeholder:text-[var(--brand-text-secondary)] sm:h-12"
          />
        </label>

        <label className="flex items-center gap-3 rounded-[1.15rem] border border-[var(--brand-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(244,247,246,0.98))] px-4 sm:rounded-2xl">
          <span className="sr-only">Estado</span>
          <MapPinned className="h-5 w-5 text-[var(--brand-blue)]" />
          <select
            name="estado"
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            aria-label="Estado"
            className="h-11 w-full bg-transparent text-sm text-[var(--brand-navy)] outline-none sm:h-12"
          >
            <option value="">Todos os estados</option>
            {states.map((state) => (
              <option key={state.id} value={state.slug}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-[1.15rem] border border-[var(--brand-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(244,247,246,0.98))] px-4 sm:rounded-2xl">
          <span className="sr-only">Cidade</span>
          <MapPinned className="h-5 w-5 text-[var(--brand-blue)]" />
          <select
            name="cidade"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            aria-label="Cidade"
            className="h-11 w-full bg-transparent text-sm text-[var(--brand-navy)] outline-none sm:h-12"
          >
            <option value="">Todas as cidades</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" className="h-11 rounded-[1.15rem] sm:h-12 sm:rounded-2xl">
          {submitLabel}
        </Button>
      </div>

      <div className="mt-3 flex flex-col gap-2 text-[11px] text-[var(--brand-text-secondary)] md:mt-4 md:flex-row md:items-center md:justify-between md:text-xs">
        <p className="inline-flex items-start gap-2 leading-5">
          <SlidersHorizontal className="h-4 w-4 text-[var(--brand-orange)]" />
          {helperText}
        </p>
        <p>
          <Link href={footerLinkHref as never} className="font-semibold text-[var(--brand-blue)] underline-offset-4 hover:text-[var(--brand-orange)] hover:underline">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
