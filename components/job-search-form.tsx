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
  helperText = "Use cargo, cidade e estado para chegar mais rápido nas vagas.",
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

  const fieldClass =
    "flex min-w-0 items-center gap-2.5 rounded-[1.15rem] border border-[rgba(123,44,40,0.26)] bg-white px-3.5 shadow-[0_10px_28px_-24px_rgba(123,44,40,0.3)] focus-within:border-[var(--brand-brick)] focus-within:ring-2 focus-within:ring-[rgba(123,44,40,0.18)] sm:gap-3 sm:rounded-2xl sm:px-4";
  const inputClass =
    "h-11 w-full min-w-0 bg-transparent text-sm text-[var(--brand-charcoal)] outline-none placeholder:text-[var(--brand-text-secondary)] sm:h-12";

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
          ? "rounded-[1.7rem] border border-[rgba(123,44,40,0.34)] bg-white p-3.5 shadow-[0_24px_70px_-40px_rgba(123,44,40,0.26)] ring-1 ring-[rgba(123,44,40,0.06)] sm:rounded-[2rem] sm:p-4"
          : "rounded-[1.85rem] border border-[rgba(123,44,40,0.34)] bg-white p-3.5 shadow-[0_30px_100px_-35px_rgba(123,44,40,0.28)] ring-1 ring-[rgba(123,44,40,0.06)] sm:rounded-[2.15rem] sm:p-4"
      }
    >
      <div className="grid gap-2.5 grid-cols-1 lg:grid-cols-[1.8fr_1fr_1fr_auto]">
        <label className={fieldClass}>
          <span className="sr-only">Cargo, empresa ou palavra-chave</span>
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <input
            name="q"
            defaultValue={initialQuery}
            placeholder="Cargo, empresa ou palavra-chave"
            aria-label="Cargo, empresa ou palavra-chave"
            className={inputClass}
          />
        </label>

        <label className={fieldClass}>
          <span className="sr-only">Estado</span>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <select
            name="estado"
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            aria-label="Estado"
            className={inputClass}
          >
            <option value="">Todos os estados</option>
            {states.map((state) => (
              <option key={state.id} value={state.slug}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className="sr-only">Cidade</span>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <select
            name="cidade"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            aria-label="Cidade"
            className={inputClass}
          >
            <option value="">Todas as cidades</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        <Button
          type="submit"
          className="h-11 w-full rounded-[1.15rem] bg-[var(--brand-brick)] shadow-[0_16px_34px_-18px_rgba(123,44,40,0.55)] hover:bg-[#65231f] sm:h-12 sm:rounded-2xl lg:w-auto"
        >
          {submitLabel}
        </Button>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgba(123,44,40,0.14)] pt-3 text-[11px] text-[var(--brand-text-secondary)] md:mt-4 md:flex-row md:items-center md:justify-between md:text-xs">
        <p className="inline-flex items-start gap-2 leading-5">
          <SlidersHorizontal className="h-4 w-4 text-[var(--brand-brick)]" />
          {helperText}
        </p>
        <p>
          <Link href={footerLinkHref as never} className="font-semibold text-[var(--brand-brick)] underline-offset-4 hover:text-[#65231f] hover:underline">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
