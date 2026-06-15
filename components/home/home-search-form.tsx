"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Briefcase, MapPinned, Search, SlidersHorizontal } from "lucide-react";

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

type SearchCategory = {
  slug: string;
  name: string;
};

export function HomeSearchForm({
  states,
  variant = "full",
  categories = [],
  fixedStateSlug = "maranhao",
  action = "/vagas",
  submitLabel = "Ver vagas",
  helperText,
  footerLinkHref = "/vagas",
  footerLinkLabel = "Abrir todas as vagas",
  initialQuery = "",
  initialState = "",
  initialCity = "",
  initialCategory = "",
  hiddenFields
}: {
  states: SearchState[];
  variant?: "full" | "home";
  categories?: SearchCategory[];
  fixedStateSlug?: string;
  action?: string;
  submitLabel?: string;
  helperText?: string;
  footerLinkHref?: string;
  footerLinkLabel?: string;
  initialQuery?: string;
  initialState?: string;
  initialCity?: string;
  initialCategory?: string;
  hiddenFields?: Record<string, string | undefined>;
}) {
  const isHomeVariant = variant === "home";

  const stateMap = useMemo(() => new Map(states.map((state) => [state.slug, state])), [states]);
  const stateCodeMap = useMemo(() => new Map(states.map((state) => [state.code.toLowerCase(), state.slug])), [states]);
  const normalizedInitialState = useMemo(() => {
    if (isHomeVariant) return fixedStateSlug;
    const candidate = initialState.trim();
    if (!candidate) return "";
    if (stateMap.has(candidate)) return candidate;
    return stateCodeMap.get(candidate.toLowerCase()) ?? "";
  }, [fixedStateSlug, initialState, isHomeVariant, stateCodeMap, stateMap]);

  const [selectedState, setSelectedState] = useState(normalizedInitialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const currentState = stateMap.get(selectedState) ?? null;
  const availableCities = currentState?.cities ?? [];

  useEffect(() => {
    if (isHomeVariant && fixedStateSlug) {
      setSelectedState(fixedStateSlug);
    }
  }, [fixedStateSlug, isHomeVariant]);

  useEffect(() => {
    const hasSelectedCityInState = availableCities.some((city) => city.slug === selectedCity);
    if (!hasSelectedCityInState && selectedCity) {
      setSelectedCity("");
    }
  }, [availableCities, selectedCity]);

  const fieldClass =
    "flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-[rgba(123,44,40,0.26)] bg-white px-3.5 shadow-[0_10px_28px_-24px_rgba(123,44,40,0.3)] focus-within:border-[var(--brand-brick)] focus-within:ring-2 focus-within:ring-[rgba(123,44,40,0.18)] sm:gap-3 sm:px-4";
  const inputClass =
    "h-12 w-full min-w-0 bg-transparent text-sm text-[var(--brand-charcoal)] outline-none placeholder:text-[var(--brand-text-secondary)]";

  return (
    <form
      action={action}
      className={
        isHomeVariant
          ? "w-full rounded-2xl border border-[rgba(123,44,40,0.42)] bg-white p-3 shadow-[0_20px_50px_-32px_rgba(123,44,40,0.34)] ring-1 ring-[rgba(123,44,40,0.08)] sm:p-4"
          : "rounded-[1.85rem] border border-[rgba(123,44,40,0.3)] bg-white p-3.5 shadow-[0_30px_100px_-35px_rgba(123,44,40,0.24)] ring-1 ring-[rgba(123,44,40,0.06)] sm:rounded-[2.15rem] sm:p-4"
      }
    >
      {isHomeVariant ? <input type="hidden" name="estado" value={fixedStateSlug} /> : null}

      <div
        className={
          isHomeVariant
            ? "grid w-full grid-cols-1 gap-3 sm:gap-3.5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
            : "grid grid-cols-1 gap-2.5 lg:grid-cols-[1.8fr_1fr_1fr_auto]"
        }
      >
        <label className={fieldClass}>
          <span className="sr-only">Cargo, empresa ou palavra-chave</span>
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <input
            name="q"
            defaultValue={initialQuery}
            placeholder="Cargo ou palavra-chave"
            aria-label="Cargo, empresa ou palavra-chave"
            className={inputClass}
          />
        </label>

        {!isHomeVariant ? (
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
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className={fieldClass}>
          <span className="sr-only">Cidade</span>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <select
            name="cidade"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            aria-label="Cidade"
            className={inputClass}
            disabled={!isHomeVariant && !selectedState}
          >
            <option value="">
              {isHomeVariant ? "Cidade" : selectedState ? "Todas as cidades" : "Selecione um estado primeiro"}
            </option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        {isHomeVariant && categories.length ? (
          <label className={fieldClass}>
            <span className="sr-only">Categoria ou área</span>
            <Briefcase className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
            <select
              name="categoria"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              aria-label="Categoria ou área"
              className={inputClass}
            >
              <option value="">Categoria</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <Button
          type="submit"
          className={
            isHomeVariant
              ? "h-12 w-full rounded-2xl bg-[var(--brand-brick)] px-6 text-sm font-bold shadow-[0_16px_34px_-18px_rgba(123,44,40,0.55)] hover:bg-[#65231f] xl:w-auto xl:min-w-[9.5rem]"
              : "h-11 w-full rounded-[1.15rem] bg-[var(--brand-brick)] shadow-[0_16px_34px_-18px_rgba(123,44,40,0.55)] hover:bg-[#65231f] sm:h-12 sm:rounded-2xl lg:w-auto"
          }
        >
          {submitLabel}
        </Button>
      </div>

      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) =>
            value ? <input key={name} type="hidden" name={name} value={value} /> : null
          )
        : null}

      <div className="mt-3 border-t border-[rgba(123,44,40,0.14)] pt-3 flex flex-col gap-2 text-[11px] text-[var(--brand-text-secondary)] md:mt-4 md:flex-row md:items-center md:justify-between md:text-xs">
        <p className="inline-flex items-start gap-2 leading-5">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--brand-brick)]" />
          {helperText ?? (isHomeVariant ? "Busque por cargo, cidade e categoria no Maranhão." : "Use cargo, cidade e estado para chegar mais rápido nas vagas.")}
        </p>
        <p>
          <Link
            href={footerLinkHref as never}
            className="font-semibold text-[var(--brand-brick)] underline-offset-4 hover:text-[#65231f] hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
