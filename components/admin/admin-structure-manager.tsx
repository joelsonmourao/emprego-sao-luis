"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit3, MapPinned, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Field, Input, Select, Textarea } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

type StateRow = {
  id: string;
  name: string;
  code: string;
  slug: string;
  seoTitle: string;
  seoIntro: string;
  jobCount: number;
  cityCount: number;
};

type CityRow = {
  id: string;
  name: string;
  slug: string;
  stateId: string;
  stateName: string;
  stateCode: string;
  stateSlug: string;
  seoTitle: string;
  seoIntro: string;
  jobCount: number;
};

type StateForm = {
  name: string;
  code: string;
  slug: string;
  seoTitle: string;
  seoIntro: string;
};

type CityForm = {
  name: string;
  slug: string;
  stateId: string;
  seoTitle: string;
  seoIntro: string;
};

type BulkDeleteResponse = {
  ok: boolean;
  error?: string;
  deletedCount?: number;
  errors?: Array<{ id: string; error: string }>;
  totals?: {
    jobsDeleted: number;
    companiesDeleted: number;
    citiesDeleted: number;
    statesDeleted: number;
    hubProfilesDeleted: number;
  };
};

const emptyStateForm: StateForm = { name: "", code: "", slug: "", seoTitle: "", seoIntro: "" };
const emptyCityForm: CityForm = { name: "", slug: "", stateId: "", seoTitle: "", seoIntro: "" };

export function AdminStructureManager({
  initialStates,
  initialCities
}: {
  initialStates: StateRow[];
  initialCities: CityRow[];
}) {
  const router = useRouter();
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [editingStateId, setEditingStateId] = useState<string | null>(null);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [newState, setNewState] = useState<StateForm>(emptyStateForm);
  const [newCity, setNewCity] = useState<CityForm>({ ...emptyCityForm, stateId: initialStates[0]?.id ?? "" });
  const [draftStates, setDraftStates] = useState<Record<string, StateForm>>({});
  const [draftCities, setDraftCities] = useState<Record<string, CityForm>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const visibleStates = useMemo(() => {
    const normalized = stateQuery.trim().toLowerCase();
    if (!normalized) return initialStates;
    return initialStates.filter((item) => `${item.name} ${item.code} ${item.slug}`.toLowerCase().includes(normalized));
  }, [initialStates, stateQuery]);

  const visibleCities = useMemo(() => {
    const normalized = cityQuery.trim().toLowerCase();
    if (!normalized) return initialCities;
    return initialCities.filter((item) => `${item.name} ${item.slug} ${item.stateName} ${item.stateCode}`.toLowerCase().includes(normalized));
  }, [initialCities, cityQuery]);

  const allVisibleStatesSelected = visibleStates.length > 0 && visibleStates.every((item) => selectedStateIds.includes(item.id));
  const allVisibleCitiesSelected = visibleCities.length > 0 && visibleCities.every((item) => selectedCityIds.includes(item.id));

  function toggleStateSelection(stateId: string, checked: boolean) {
    setSelectedStateIds((current) => (checked ? [...new Set([...current, stateId])] : current.filter((id) => id !== stateId)));
  }

  function toggleCitySelection(cityId: string, checked: boolean) {
    setSelectedCityIds((current) => (checked ? [...new Set([...current, cityId])] : current.filter((id) => id !== cityId)));
  }

  function toggleAllStates(checked: boolean) {
    setSelectedStateIds(checked ? visibleStates.map((item) => item.id) : []);
  }

  function toggleAllCities(checked: boolean) {
    setSelectedCityIds(checked ? visibleCities.map((item) => item.id) : []);
  }

  async function submit(resource: "states" | "cities", payload: unknown, id?: string) {
    setBusyKey(`${resource}:${id ?? "new"}`);
    setMessage("");

    const response = await fetch(id ? `/api/admin/taxonomies/${resource}/${id}` : `/api/admin/taxonomies/${resource}`, {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    setBusyKey(null);

    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Nao foi possivel salvar.");
      return false;
    }

    setMessage("Estrutura salva com sucesso.");
    router.refresh();
    return true;
  }

  async function remove(resource: "states" | "cities", id: string) {
    const confirmed = window.confirm("Deseja excluir este item?");
    if (!confirmed) return;

    setBusyKey(`${resource}:delete:${id}`);
    setMessage("");

    const response = await fetch(`/api/admin/taxonomies/${resource}/${id}`, { method: "DELETE" });
    const result = (await response.json()) as { ok: boolean; error?: string };
    setBusyKey(null);

    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Nao foi possivel excluir.");
      return;
    }

    if (resource === "states") {
      setSelectedStateIds((current) => current.filter((itemId) => itemId !== id));
    } else {
      setSelectedCityIds((current) => current.filter((itemId) => itemId !== id));
    }

    setMessage("Item removido com sucesso.");
    router.refresh();
  }

  async function bulkRemove(resource: "states" | "cities") {
    const selectedIds = resource === "states" ? selectedStateIds : selectedCityIds;
    if (!selectedIds.length) return;

    const label = resource === "states" ? "estado(s)" : "cidade(s)";
    const confirmed = window.confirm(
      resource === "states"
        ? `Deseja excluir ${selectedIds.length} ${label} selecionado(s)? Cidades, empresas, vagas e perfis SEO ligados a esses estados tambem serao removidos.`
        : `Deseja excluir ${selectedIds.length} ${label} selecionada(s)? Empresas, vagas e perfis SEO ligados a essas cidades tambem serao removidos.`
    );
    if (!confirmed) return;

    setBusyKey(`${resource}:bulk-delete`);
    setMessage("");

    const response = await fetch("/api/admin/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource, ids: selectedIds })
    });

    const result = (await response.json()) as BulkDeleteResponse;
    setBusyKey(null);

    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Nao foi possivel excluir os itens selecionados.");
      return;
    }

    if (resource === "states") {
      setSelectedStateIds([]);
    } else {
      setSelectedCityIds([]);
    }

    const deletedCount = result.deletedCount ?? 0;
    const errorCount = result.errors?.length ?? 0;
    const deletedJobs = result.totals?.jobsDeleted ?? 0;
    const deletedCompanies = result.totals?.companiesDeleted ?? 0;
    const deletedCities = result.totals?.citiesDeleted ?? 0;
    const deletedStates = result.totals?.statesDeleted ?? 0;
    const deletedProfiles = result.totals?.hubProfilesDeleted ?? 0;
    setMessage(
      errorCount
        ? `${deletedCount} ${label} removido(s). Dependencias apagadas: ${deletedStates} estado(s), ${deletedCities} cidade(s), ${deletedCompanies} empresa(s), ${deletedJobs} vaga(s) e ${deletedProfiles} perfil(is) SEO. ${errorCount} item(ns) apresentaram erro.`
        : `${deletedCount} ${label} removido(s) com sucesso. Dependencias apagadas: ${deletedStates} estado(s), ${deletedCities} cidade(s), ${deletedCompanies} empresa(s), ${deletedJobs} vaga(s) e ${deletedProfiles} perfil(is) SEO.`
    );
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      {message ? <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{message}</p> : null}

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Estados</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1fr_1fr_0.8fr]">
            <Field label="Nome do estado">
              <Input value={newState.name} onChange={(event) => setNewState((current) => ({ ...current, name: event.target.value }))} onBlur={(event) => !newState.slug && setNewState((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="Maranhao" />
            </Field>
            <Field label="Sigla">
              <Input maxLength={2} value={newState.code} onChange={(event) => setNewState((current) => ({ ...current, code: event.target.value.toUpperCase() }))} placeholder="MA" />
            </Field>
            <Field label="Slug">
              <Input value={newState.slug} onChange={(event) => setNewState((current) => ({ ...current, slug: event.target.value }))} placeholder="maranhao" />
            </Field>
            <Field label="SEO title">
              <Input value={newState.seoTitle} onChange={(event) => setNewState((current) => ({ ...current, seoTitle: event.target.value }))} />
            </Field>
            <div className="lg:col-span-2">
              <Field label="Resumo curto da pagina do estado">
                <Textarea value={newState.seoIntro} onChange={(event) => setNewState((current) => ({ ...current, seoIntro: event.target.value }))} className="min-h-24" />
              </Field>
            </div>
            <div className="flex items-end">
              <Button type="button" size="lg" disabled={busyKey === "states:new"} onClick={async () => (await submit("states", newState)) && setNewState(emptyStateForm)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar estado
              </Button>
            </div>
          </div>

          <Input value={stateQuery} onChange={(event) => setStateQuery(event.target.value)} placeholder="Buscar estado por nome, sigla ou slug" className="max-w-md" />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={allVisibleStatesSelected}
                onChange={(event) => toggleAllStates(event.target.checked)}
                aria-label="Selecionar todos os estados visiveis"
                className="h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
              />
              <span>Selecionar todos os estados visiveis</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <span>{selectedStateIds.length} selecionado(s)</span>
              <Button type="button" size="sm" variant="outline" disabled={!selectedStateIds.length || busyKey === "states:bulk-delete"} onClick={() => bulkRemove("states")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir selecionados
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {visibleStates.map((item) => {
              const form = draftStates[item.id] ?? emptyStateForm;
              const isEditing = editingStateId === item.id;
              return (
                <div key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStateIds.includes(item.id)}
                        onChange={(event) => toggleStateSelection(item.id, event.target.checked)}
                        aria-label={`Selecionar estado ${item.name}`}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
                      />
                      <div>
                        <p className="text-lg font-black text-slate-950">{item.name} ({item.code})</p>
                        <p className="mt-2 text-sm text-slate-600">Slug: {item.slug} • {item.cityCount} cidade(s) • {item.jobCount} vaga(s)</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => {
                        setEditingStateId(item.id);
                        setDraftStates((current) => ({ ...current, [item.id]: { name: item.name, code: item.code, slug: item.slug, seoTitle: item.seoTitle, seoIntro: item.seoIntro } }));
                      }}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button asChild type="button" size="sm" variant="outline">
                        <Link href={`/admin/hubs/state/${item.slug}`}>
                          <MapPinned className="mr-2 h-4 w-4" />
                          Hub
                        </Link>
                      </Button>
                      <Button type="button" size="sm" variant="outline" disabled={busyKey === `states:delete:${item.id}` || busyKey === "states:bulk-delete"} onClick={() => remove("states", item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr_0.8fr]">
                      <Field label="Nome"><Input value={form.name} onChange={(event) => setDraftStates((current) => ({ ...current, [item.id]: { ...form, name: event.target.value } }))} /></Field>
                      <Field label="Sigla"><Input maxLength={2} value={form.code} onChange={(event) => setDraftStates((current) => ({ ...current, [item.id]: { ...form, code: event.target.value.toUpperCase() } }))} /></Field>
                      <Field label="Slug"><Input value={form.slug} onChange={(event) => setDraftStates((current) => ({ ...current, [item.id]: { ...form, slug: event.target.value } }))} /></Field>
                      <Field label="SEO title"><Input value={form.seoTitle} onChange={(event) => setDraftStates((current) => ({ ...current, [item.id]: { ...form, seoTitle: event.target.value } }))} /></Field>
                      <div className="lg:col-span-2"><Field label="Resumo curto"><Textarea value={form.seoIntro} onChange={(event) => setDraftStates((current) => ({ ...current, [item.id]: { ...form, seoIntro: event.target.value } }))} className="min-h-24" /></Field></div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="button" size="sm" disabled={busyKey === `states:${item.id}`} onClick={async () => (await submit("states", form, item.id)) && setEditingStateId(null)}><Save className="mr-2 h-4 w-4" />Salvar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditingStateId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Cidades</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1fr_1fr_0.8fr]">
            <Field label="Estado">
              <Select value={newCity.stateId} onChange={(event) => setNewCity((current) => ({ ...current, stateId: event.target.value }))}>
                <option value="">Selecione</option>
                {initialStates.map((state) => <option key={state.id} value={state.id}>{state.name} ({state.code})</option>)}
              </Select>
            </Field>
            <Field label="Cidade">
              <Input value={newCity.name} onChange={(event) => setNewCity((current) => ({ ...current, name: event.target.value }))} onBlur={(event) => !newCity.slug && setNewCity((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="Sao Luis" />
            </Field>
            <Field label="Slug">
              <Input value={newCity.slug} onChange={(event) => setNewCity((current) => ({ ...current, slug: event.target.value }))} placeholder="sao-luis" />
            </Field>
            <Field label="SEO title">
              <Input value={newCity.seoTitle} onChange={(event) => setNewCity((current) => ({ ...current, seoTitle: event.target.value }))} />
            </Field>
            <div className="lg:col-span-2">
              <Field label="Resumo curto da cidade">
                <Textarea value={newCity.seoIntro} onChange={(event) => setNewCity((current) => ({ ...current, seoIntro: event.target.value }))} className="min-h-24" />
              </Field>
            </div>
            <div className="flex items-end">
              <Button type="button" size="lg" disabled={busyKey === "cities:new"} onClick={async () => (await submit("cities", newCity)) && setNewCity({ ...emptyCityForm, stateId: initialStates[0]?.id ?? "" })}>
                <Plus className="mr-2 h-4 w-4" />
                Criar cidade
              </Button>
            </div>
          </div>

          <Input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Buscar cidade por nome, estado ou slug" className="max-w-md" />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={allVisibleCitiesSelected}
                onChange={(event) => toggleAllCities(event.target.checked)}
                aria-label="Selecionar todas as cidades visiveis"
                className="h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
              />
              <span>Selecionar todas as cidades visiveis</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <span>{selectedCityIds.length} selecionado(s)</span>
              <Button type="button" size="sm" variant="outline" disabled={!selectedCityIds.length || busyKey === "cities:bulk-delete"} onClick={() => bulkRemove("cities")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir selecionadas
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {visibleCities.map((item) => {
              const form = draftCities[item.id] ?? emptyCityForm;
              const isEditing = editingCityId === item.id;
              return (
                <div key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCityIds.includes(item.id)}
                        onChange={(event) => toggleCitySelection(item.id, event.target.checked)}
                        aria-label={`Selecionar cidade ${item.name}`}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--brand-orange)] focus:ring-[var(--brand-blue)]"
                      />
                      <div>
                        <p className="text-lg font-black text-slate-950">{item.name}, {item.stateCode}</p>
                        <p className="mt-2 text-sm text-slate-600">Slug: {item.slug} • {item.jobCount} vaga(s)</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => {
                        setEditingCityId(item.id);
                        setDraftCities((current) => ({ ...current, [item.id]: { name: item.name, slug: item.slug, stateId: item.stateId, seoTitle: item.seoTitle, seoIntro: item.seoIntro } }));
                      }}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button asChild type="button" size="sm" variant="outline">
                        <Link href={`/admin/hubs/city/${item.stateSlug}__${item.slug}`}>
                          <MapPinned className="mr-2 h-4 w-4" />
                          Hub
                        </Link>
                      </Button>
                      <Button type="button" size="sm" variant="outline" disabled={busyKey === `cities:delete:${item.id}` || busyKey === "cities:bulk-delete"} onClick={() => remove("cities", item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr]">
                      <Field label="Estado">
                        <Select value={form.stateId} onChange={(event) => setDraftCities((current) => ({ ...current, [item.id]: { ...form, stateId: event.target.value } }))}>
                          <option value="">Selecione</option>
                          {initialStates.map((state) => <option key={state.id} value={state.id}>{state.name} ({state.code})</option>)}
                        </Select>
                      </Field>
                      <Field label="Nome"><Input value={form.name} onChange={(event) => setDraftCities((current) => ({ ...current, [item.id]: { ...form, name: event.target.value } }))} /></Field>
                      <Field label="Slug"><Input value={form.slug} onChange={(event) => setDraftCities((current) => ({ ...current, [item.id]: { ...form, slug: event.target.value } }))} /></Field>
                      <Field label="SEO title"><Input value={form.seoTitle} onChange={(event) => setDraftCities((current) => ({ ...current, [item.id]: { ...form, seoTitle: event.target.value } }))} /></Field>
                      <div className="lg:col-span-2"><Field label="Resumo curto"><Textarea value={form.seoIntro} onChange={(event) => setDraftCities((current) => ({ ...current, [item.id]: { ...form, seoIntro: event.target.value } }))} className="min-h-24" /></Field></div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="button" size="sm" disabled={busyKey === `cities:${item.id}`} onClick={async () => (await submit("cities", form, item.id)) && setEditingCityId(null)}><Save className="mr-2 h-4 w-4" />Salvar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditingCityId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
