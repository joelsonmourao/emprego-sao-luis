import type { EmploymentType } from "@prisma/client";

function fold(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Converte texto da planilha (PT-BR ou valores Schema.org) para o enum persistido no Prisma.
 */
export function parseSpreadsheetEmploymentType(raw: unknown): EmploymentType {
  const key = fold(String(raw ?? ""));
  if (!key) {
    return "APPRENTICESHIP";
  }

  if (key === "full_time" || key === "fulltime") return "FULL_TIME";
  if (key === "part_time" || key === "parttime") return "PART_TIME";
  if (key === "temporary" || key === "temporario") return "TEMPORARY";
  if (key === "internship" || key === "intern") return "INTERNSHIP";
  if (key === "apprenticeship") return "APPRENTICESHIP";
  if (key === "contractor") return "CONTRACTOR";
  if (key === "volunteer" || key === "voluntario") return "VOLUNTEER";
  if (key === "per_diem" || key === "perdiem") return "PER_DIEM";
  if (key === "other" || key === "outro" || key === "outros") return "OTHER";

  const pt: Array<{ match: string | RegExp; value: EmploymentType }> = [
    { match: /^aprendiz$/, value: "APPRENTICESHIP" },
    { match: /^jovem aprendiz$/, value: "APPRENTICESHIP" },
    { match: /^menor aprendiz$/, value: "APPRENTICESHIP" },
    { match: /^aprendizagem$/, value: "APPRENTICESHIP" },
    { match: /^clt$/, value: "FULL_TIME" },
    { match: /^efetivo$/, value: "FULL_TIME" },
    { match: /^tempo integral$/, value: "FULL_TIME" },
    { match: /^meio periodo$/, value: "PART_TIME" },
    { match: /^parcial$/, value: "PART_TIME" },
    { match: /^estagio$/, value: "INTERNSHIP" },
    { match: /^temporario$/, value: "TEMPORARY" },
    { match: /^freelancer$/, value: "CONTRACTOR" },
    { match: /^autonomo$/, value: "CONTRACTOR" }
  ];

  for (const entry of pt) {
    if (typeof entry.match === "string") {
      if (key === entry.match) return entry.value;
    } else if (entry.match.test(key)) {
      return entry.value;
    }
  }

  const upper = String(raw ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  const allowed: EmploymentType[] = [
    "APPRENTICESHIP",
    "INTERNSHIP",
    "TEMPORARY",
    "PART_TIME",
    "FULL_TIME",
    "CONTRACTOR",
    "VOLUNTEER",
    "PER_DIEM",
    "OTHER"
  ];
  if (allowed.includes(upper as EmploymentType)) {
    return upper as EmploymentType;
  }

  return "APPRENTICESHIP";
}

/**
 * Valor(ores) finais aceitos pelo Google em JobPosting.employmentType.
 * INTERNSHIP no banco vira INTERN no schema.
 */
export function employmentTypeToSchemaValue(employmentType: EmploymentType, opts?: { title?: string; sheetValueEmpty?: boolean }): string | string[] {
  const title = opts?.title ?? "";
  const aprendizRe = /jovem\s+aprendiz|menor\s+aprendiz|aprendizagem|\baprendiz\b/i;
  if (opts?.sheetValueEmpty && aprendizRe.test(title)) {
    return ["FULL_TIME", "PART_TIME"];
  }

  if (employmentType === "INTERNSHIP") {
    return "INTERN";
  }

  return employmentType;
}
