import { formatDatePtBr } from "@es/shared";

export function formatSalary(input: {
  salaryVisible: boolean;
  salaryMin: string | null;
  salaryMax: string | null;
  salaryCurrency: string;
  salaryPeriod: string | null;
}): string | null {
  if (!input.salaryVisible) return null;
  const min = input.salaryMin ? Number(input.salaryMin) : null;
  const max = input.salaryMax ? Number(input.salaryMax) : null;
  if (!min && !max) return null;
  const fmt = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: input.salaryCurrency || "BRL",
      maximumFractionDigits: 0
    });
  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min ?? max!);
}

export function formatWorkplace(value: string): string {
  const map: Record<string, string> = { presencial: "Presencial", hibrido: "Híbrido", remoto: "Remoto" };
  return map[value] ?? value;
}

export function formatRelativeDate(value: Date | null | undefined): string {
  return formatDatePtBr(value);
}
