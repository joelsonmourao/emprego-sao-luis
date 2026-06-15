"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Briefcase, MapPinned, Search, SlidersHorizontal } from "lucide-react";

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

  return (
    <form
      action={action}
      className={`es-search-shell w-full rounded-2xl p-3 sm:p-4 ${isHomeVariant ? "" : "sm:rounded-[2.15rem]"}`}
    >
      {isHomeVariant ? <input type="hidden" name="estado" value={fixedStateSlug} /> : null}

      <div
        className={
          isHomeVariant
            ? "grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
            : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
        }
      >
        <label className={`es-search-field ${isHomeVariant ? "sm:col-span-2 xl:col-span-1" : "sm:col-span-2 lg:col-span-1"}`}>
          <span className="sr-only">Cargo, empresa ou palavra-chave</span>
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <input
            name="q"
            defaultValue={initialQuery}
            placeholder="Cargo ou palavra-chave"
            aria-label="Cargo, empresa ou palavra-chave"
            className="es-search-input"
          />
        </label>

        {!isHomeVariant ? (
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
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="es-search-field">
          <span className="sr-only">Cidade</span>
          <MapPinned className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
          <select
            name="cidade"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            aria-label="Cidade"
            className="es-search-input"
            disabled={!isHomeVariant && !selectedState}
          >
            <option value="">
              {isHomeVariant ? "Todas as cidades" : selectedState ? "Todas as cidades" : "Selecione um estado primeiro"}
            </option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        {isHomeVariant && categories.length ? (
          <label className="es-search-field">
            <span className="sr-only">Categoria ou área</span>
            <Briefcase className="h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
            <select
              name="categoria"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              aria-label="Categoria ou área"
              className="es-search-input"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <button type="submit" className={`es-search-submit ${isHomeVariant ? "xl:min-w-[9.5rem]" : "lg:min-w-[9.5rem]"}`}>
          {submitLabel}
        </button>
      </div>

      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) =>
            value ? <input key={name} type="hidden" name={name} value={value} /> : null
          )
        : null}

      <div className="es-search-footer">
        <p className="inline-flex items-start gap-2 leading-5">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--brand-beige)]" />
          {helperText ?? (isHomeVariant ? "Busque por cargo, cidade e categoria no Maranhão." : "Use cargo, cidade e estado para chegar mais rápido nas vagas.")}
        </p>
        <p>
          <Link
            href={footerLinkHref as never}
            className="font-semibold text-white underline-offset-4 hover:text-[var(--brand-beige)] hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
