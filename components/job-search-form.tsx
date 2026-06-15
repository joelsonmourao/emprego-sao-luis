"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPinned, Search, SlidersHorizontal } from "lucide-react";

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
      className={`es-search-shell w-full rounded-2xl p-3.5 sm:p-4 ${compact ? "" : "sm:rounded-[2.15rem]"}`}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="es-search-field sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Cargo, empresa ou palavra-chave</span>
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <input
            name="q"
            defaultValue={initialQuery}
            placeholder="Cargo, empresa ou palavra-chave"
            aria-label="Cargo, empresa ou palavra-chave"
            className="es-search-input"
          />
        </label>

        <label className="es-search-field">
          <span className="sr-only">Estado</span>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <select
            name="estado"
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            aria-label="Estado"
            className="es-search-input"
          >
            <option value="">Todos os estados</option>
            {states.map((state) => (
              <option key={state.id} value={state.slug}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className="es-search-field">
          <span className="sr-only">Cidade</span>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <select
            name="cidade"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            aria-label="Cidade"
            className="es-search-input"
          >
            <option value="">Todas as cidades</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="es-search-submit lg:min-w-[9.5rem]">
          {submitLabel}
        </button>
      </div>

      <div className="es-search-footer">
        <p className="inline-flex items-start gap-2 leading-5">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--brand-beige)]" />
          {helperText}
        </p>
        <p>
          <Link href={footerLinkHref as never} className="font-semibold text-white underline-offset-4 hover:text-[var(--brand-beige)] hover:underline">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
