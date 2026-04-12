"use client";

import { jobFormDefaults } from "@/lib/schemas/job-form";
import { Field, Input, Select, Textarea } from "@/components/forms/field";

type Option = { label: string; value: string };

export function JobEditorFields({
  states,
  cities,
  companies
}: {
  states: Option[];
  cities: Option[];
  companies: Option[];
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Titulo da vaga" hint="Use um titulo claro, com cargo e localidade quando fizer sentido.">
          <Input defaultValue={jobFormDefaults.title} placeholder="Jovem Aprendiz em Atendimento" />
        </Field>
        <Field label="Slug" hint="URL amigavel para compartilhamento e indexacao.">
          <Input defaultValue={jobFormDefaults.slug} placeholder="jovem-aprendiz-atendimento-sao-luis-ma" />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Empresa" hint="Selecione a empresa que vai receber a candidatura.">
          <Select defaultValue="">
            <option value="">Selecione uma empresa</option>
            {companies.map((company) => (
              <option key={company.value} value={company.value}>
                {company.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo de localizacao">
          <Select defaultValue={jobFormDefaults.locationType}>
            <option value="ONSITE">Presencial</option>
            <option value="HYBRID">Hibrido</option>
            <option value="REMOTE">Remoto</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Field label="Estado">
          <Select defaultValue="">
            <option value="">Selecione</option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cidade">
          <Select defaultValue="">
            <option value="">Selecione</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo de contrato">
          <Select defaultValue={jobFormDefaults.employmentType}>
            <option value="APPRENTICESHIP">Jovem Aprendiz</option>
            <option value="INTERNSHIP">Estagio</option>
            <option value="PART_TIME">Meio periodo</option>
            <option value="FULL_TIME">Tempo integral</option>
            <option value="TEMPORARY">Temporario</option>
          </Select>
        </Field>
      </div>

      <Field label="Resumo curto" hint="Resumo usado em cards e compartilhamento.">
        <Textarea defaultValue={jobFormDefaults.summary} placeholder="Descreva rapidamente a oportunidade, horario e publico ideal." className="min-h-24" />
      </Field>

      <Field label="Descricao completa da vaga" hint="Explique atividades, rotina e detalhes da oportunidade.">
        <Textarea
          defaultValue={jobFormDefaults.descriptionHtml}
          placeholder="Explique atividades, rotina, ambiente e detalhes da oportunidade."
          className="min-h-40"
        />
      </Field>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="Requisitos">
          <Textarea defaultValue={jobFormDefaults.requirementsText} placeholder="Uma linha por requisito." />
        </Field>
        <Field label="Beneficios">
          <Textarea defaultValue={jobFormDefaults.benefitsText} placeholder="Vale-transporte, refeicao, curso, etc." />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Field label="Salario minimo">
          <Input type="number" defaultValue="" placeholder="700" />
        </Field>
        <Field label="Salario maximo">
          <Input type="number" defaultValue="" placeholder="900" />
        </Field>
        <Field label="Jornada">
          <Input defaultValue={jobFormDefaults.workHours} placeholder="4h por dia" />
        </Field>
        <Field label="Link de candidatura">
          <Input defaultValue={jobFormDefaults.applyUrl} placeholder="https://empresa.com/vaga" />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field label="SEO title">
          <Input defaultValue={jobFormDefaults.seoTitle} placeholder="Jovem Aprendiz em Atendimento em Sao Luis, MA" />
        </Field>
        <Field label="SEO description">
          <Textarea defaultValue={jobFormDefaults.seoDescription} placeholder="Descricao curta para Google e redes sociais." className="min-h-24" />
        </Field>
      </div>
    </div>
  );
}
