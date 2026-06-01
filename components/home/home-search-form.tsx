"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPinned, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

type SearchState = {
  id: string;
  name: string;
  slug: string;
  code: string;
  cities: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export function HomeSearchForm({
  states,
  action = "/vagas",
  submitLabel = "Ver vagas",
  helperText,
  footerLinkHref = "/vagas",
  footerLinkLabel = "Abrir todas as vagas",
  initialQuery = "",
  initialState = "",
  initialCity = "",
  hiddenFields
}: {
  states: SearchState[];
  action?: string;
  submitLabel?: string;
  helperText?: string;
  footerLinkHref?: string;
  footerLinkLabel?: string;
  initialQuery?: string;
  initialState?: string;
  initialCity?: string;
  hiddenFields?: Record<string, string | undefined>;
}) {
  const stateMap = useMemo(() => new Map(states.map((state) => [state.slug, state])), [states]);
  const stateCodeMap = useMemo(() => new Map(states.map((state) => [state.code.toLowerCase(), state.slug])), [states]);
  const normalizedInitialState = useMemo(() => {
    const candidate = initialState.trim();
    if (!candidate) return "";
    if (stateMap.has(candidate)) return candidate;
    return stateCodeMap.get(candidate.toLowerCase()) ?? "";
  }, [initialState, stateCodeMap, stateMap]);
  const [selectedState, setSelectedState] = useState(normalizedInitialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const currentState = stateMap.get(selectedState) ?? null;
  const availableCities = currentState?.cities ?? [];

  useEffect(() => {
    const hasSelectedCityInState = availableCities.some((city) => city.slug === selectedCity);
    if (!hasSelectedCityInState && selectedCity) {
      setSelectedCity("");
    }
  }, [availableCities, selectedCity]);

  return (
    <form
      action={action}
      className="rounded-[1.85rem] border border-white/60 bg-white/99 p-3.5 shadow-[0_30px_100px_-35px_rgba(26,43,76,0.24)] sm:rounded-[2.15rem] sm:p-4"
    >
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[1.8fr_1fr_1fr_auto]">
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
                {state.name} ({state.code})
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
            disabled={!selectedState}
          >
            <option value="">{selectedState ? "Todas as cidades" : "Selecione um estado primeiro"}</option>
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

      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) =>
            value ? <input key={name} type="hidden" name={name} value={value} /> : null
          )
        : null}

      <div className="mt-3 flex flex-col gap-2 text-[11px] text-[var(--brand-text-secondary)] md:mt-4 md:flex-row md:items-center md:justify-between md:text-xs">
        <p className="inline-flex items-start gap-2 leading-5">
          <SlidersHorizontal className="h-4 w-4 text-[var(--brand-orange)]" />
          {helperText ?? "Use cargo, cidade e estado para chegar mais rápido nas vagas."}
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
