import { categories, cities, companies, createDatabase, jobs, states } from "@es/db";
import { validateApplicationChannels } from "@es/shared";
import { validateJobPosting } from "@es/seo";
import { asc, eq } from "drizzle-orm";

export type JobAuditIssueCode =
  | "SOURCE_MISSING"
  | "APPLICATION_LINK_MISSING"
  | "APPLICATION_CHANNEL_MISSING"
  | "COMPANY_UNKNOWN"
  | "CITY_INVALID"
  | "SALARY_SUSPICIOUS"
  | "EXPIRED"
  | "POSSIBLE_DUPLICATE"
  | "DESCRIPTION_INSUFFICIENT"
  | "STATUS_INCONSISTENT"
  | "CONTRACT_MISSING"
  | "REQUIREMENTS_MISSING"
  | "BENEFITS_MISSING";

export type JobAuditIssue = { code: JobAuditIssueCode; severity: "BLOCKER" | "WARNING" | "INFO"; message: string };

export type JobAuditRow = {
  job: typeof jobs.$inferSelect;
  companyName: string;
  cityName: string;
  cityActive: boolean;
  stateCode: string;
  categoryName: string | null;
  cityIbgeCode?: string | null;
};

export type JobAuditAssessment = {
  row: JobAuditRow;
  issues: JobAuditIssue[];
  salaryStatus: "VALIDADO" | "SUSPEITO" | "NÃO INFORMADO";
  locationStatus: "VALIDADA" | "SUSPEITA" | "INVÁLIDA";
  complete: boolean;
  expired: boolean;
  duplicate: boolean;
  jobPostingCompatible: boolean;
  classification: "OK" | "REVISAR" | "EXPIRADA" | "DUPLICADA" | "INCOMPLETA" | "SUSPEITA";
  linkStatus: "ATIVO" | "REDIRECIONADO" | "ERRO" | "INDETERMINADO";
  duplicateReasons: string[];
};

const INVALID_LOCATION = /\b(shopping|bairro|regi[aã]o|zona|unidade|filial|loja|rua|avenida|av\.|rodovia|estrada|centro comercial)\b/i;
const TEST_OR_UNKNOWN = /^(teste|test|empresa desconhecida|n[aã]o informad[ao]|a definir|confidencial)$/i;

function listSize(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => String(item ?? "").trim()).length : 0;
}

function validHttpUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (
      !hostname ||
      hostname === "localhost" ||
      hostname === "::1" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".invalid") ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".example") ||
      /^(example\.(com|net|org)|0\.0\.0\.0)$/.test(hostname) ||
      /^(10|127)\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^169\.254\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) return false;
    return true;
  } catch {
    return false;
  }
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const normalizeUrl = (value: string | null) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) if (key.startsWith("utm_") || ["gclid", "fbclid"].includes(key)) url.searchParams.delete(key);
    url.hash = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch { return null; }
};

function descriptionShingles(value: string) {
  const words = normalize(value.replace(/<[^>]*>/g, " ")).split(" ").filter((word) => word.length > 2);
  const shingles = new Set<string>();
  for (let index = 0; index <= words.length - 8; index++) shingles.add(words.slice(index, index + 8).join(" "));
  return shingles;
}

function salaryIssues(job: typeof jobs.$inferSelect) {
  const issues: JobAuditIssue[] = [];
  const minimum = job.salaryMin == null ? null : Number(job.salaryMin);
  const maximum = job.salaryMax == null ? null : Number(job.salaryMax);
  if (minimum == null && maximum == null) return { status: "NÃO INFORMADO" as const, issues };
  const values = [minimum, maximum].filter((value): value is number => value != null);
  if (values.some((value) => !Number.isFinite(value))) issues.push({ code: "SALARY_SUSPICIOUS", severity: "WARNING", message: "Salário não pôde ser interpretado numericamente." });
  if (minimum != null && maximum != null && minimum > maximum) issues.push({ code: "SALARY_SUSPICIOUS", severity: "BLOCKER", message: "Salário mínimo é maior que o máximo." });
  if (values.some((value) => value === 0) && job.salaryVisible) issues.push({ code: "SALARY_SUSPICIOUS", severity: "WARNING", message: "Salário zero está marcado como valor visível." });
  const period = (job.salaryPeriod ?? "MONTH").toUpperCase();
  if (period === "MONTH" && values.some((value) => value > 100_000)) issues.push({ code: "SALARY_SUSPICIOUS", severity: "WARNING", message: "Valor mensal acima de R$ 100 mil; pode ser anual ou conter separador incorreto." });
  if (period === "MONTH" && values.some((value) => value > 0 && value < 300)) issues.push({ code: "SALARY_SUSPICIOUS", severity: "WARNING", message: "Valor mensal muito baixo; pode ser hora, dia ou decimal deslocado." });
  if (["HOUR", "HORA"].includes(period) && values.some((value) => value > 1_000)) issues.push({ code: "SALARY_SUSPICIOUS", severity: "WARNING", message: "Valor por hora excepcionalmente alto; revisar período e separador." });
  if (!/^[A-Z]{3}$/.test(job.salaryCurrency)) issues.push({ code: "SALARY_SUSPICIOUS", severity: "WARNING", message: "Moeda salarial não segue código ISO de três letras." });
  return { status: issues.length ? "SUSPEITO" as const : "VALIDADO" as const, issues };
}

export function assessJobQuality(row: JobAuditRow, duplicateCount = 1, now = new Date(), duplicateReasons: string[] = []): JobAuditAssessment {
  const { job } = row;
  const issues: JobAuditIssue[] = [];
  const description = job.descriptionHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const channels = validateApplicationChannels(job);
  const expired = Boolean(job.expiresAt && job.expiresAt <= now);
  const duplicate = duplicateCount > 1 || job.publicationStatus === "DUPLICATE";
  const salary = salaryIssues(job);
  issues.push(...salary.issues);

  if (!job.sourceName.trim() || TEST_OR_UNKNOWN.test(job.sourceName.trim()) || !validHttpUrl(job.sourceUrl))
    issues.push({ code: "SOURCE_MISSING", severity: validHttpUrl(job.sourceUrl) ? "WARNING" : "BLOCKER", message: validHttpUrl(job.sourceUrl) ? "Nome da fonte precisa ser revisado." : "URL de origem ausente ou inválida." });
  if (!job.applicationUrl)
    issues.push({ code: "APPLICATION_LINK_MISSING", severity: channels.valid ? "INFO" : "BLOCKER", message: channels.valid ? "Sem URL externa; há outro canal de candidatura válido." : "URL de candidatura ausente." });
  if (!channels.valid) issues.push({ code: "APPLICATION_CHANNEL_MISSING", severity: "BLOCKER", message: "Nenhum canal de candidatura válido." });
  if (!row.companyName.trim() || TEST_OR_UNKNOWN.test(row.companyName.trim()) || job.unidentifiedCompany)
    issues.push({ code: "COMPANY_UNKNOWN", severity: "BLOCKER", message: "Empresa não está identificada de forma confiável." });
  const invalidLocation = !row.cityActive || !/^[A-Z]{2}$/.test(row.stateCode) || INVALID_LOCATION.test(row.cityName);
  const suspiciousLocation = !invalidLocation && (row.cityName.length < 3 || /\d/.test(row.cityName) || row.cityIbgeCode === null);
  if (invalidLocation || suspiciousLocation)
    issues.push({ code: "CITY_INVALID", severity: invalidLocation ? "BLOCKER" : "WARNING", message: invalidLocation ? "Cidade/UF inválida ou representa bairro, endereço, unidade ou região." : "Localização exige conferência manual." });
  if (expired) issues.push({ code: "EXPIRED", severity: job.publicationStatus === "PUBLISHED" ? "BLOCKER" : "INFO", message: job.publicationStatus === "PUBLISHED" ? "Vaga expirada ainda está publicada." : "Vaga expirada." });
  if (duplicate) issues.push({ code: "POSSIBLE_DUPLICATE", severity: "WARNING", message: duplicateReasons.length ? duplicateReasons.join("; ") : "Hash, origem ou status indica possível duplicidade." });
  if (description.length < 120) issues.push({ code: "DESCRIPTION_INSUFFICIENT", severity: "BLOCKER", message: "Descrição possui menos de 120 caracteres úteis." });
  if (!job.employmentType.trim()) issues.push({ code: "CONTRACT_MISSING", severity: "WARNING", message: "Tipo de contratação ausente." });
  if (listSize(job.requirements) === 0) issues.push({ code: "REQUIREMENTS_MISSING", severity: "INFO", message: "Requisitos não informados pela fonte." });
  if (listSize(job.benefits) === 0) issues.push({ code: "BENEFITS_MISSING", severity: "INFO", message: "Benefícios não informados pela fonte." });
  if (job.publicationStatus === "PUBLISHED" && (!job.publishedAt || !job.expiresAt || expired || job.verificationStatus === "NEEDS_REVIEW"))
    issues.push({ code: "STATUS_INCONSISTENT", severity: "BLOCKER", message: "Status publicado é incompatível com revisão, publicação ou validade." });

  const locationStatus = invalidLocation ? "INVÁLIDA" : suspiciousLocation ? "SUSPEITA" : "VALIDADA";
  const blockers = issues.filter((issue) => issue.severity === "BLOCKER");
  const jobPosting = validateJobPosting({
    title: job.normalizedTitle,
    description: job.descriptionHtml,
    publishedAt: job.publishedAt,
    expiresAt: job.expiresAt,
    employmentType: job.employmentType,
    workplaceType: job.workplaceType,
    companyName: row.companyName,
    cityName: row.cityName,
    stateCode: row.stateCode,
    applicationUrl: job.applicationUrl,
    applicationType: job.applicationType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    salaryPeriod: job.salaryPeriod,
    salaryVisible: job.salaryVisible,
    publicCode: job.publicCode,
    canonicalUrl: job.canonicalUrl || `/vagas/${job.slug}`,
    publicationStatus: job.publicationStatus,
    confidentialCompany: job.confidentialCompany,
    unidentifiedCompany: job.unidentifiedCompany,
    organizationPubliclyIdentifiable: !job.confidentialCompany && !job.unidentifiedCompany
  });
  const finalUrl = normalizeUrl(job.applicationUrlFinalUrl);
  const originalUrl = normalizeUrl(job.applicationUrl);
  const linkStatus = ["CLOSED", "INVALID"].includes(job.applicationUrlStatus)
    ? "ERRO"
    : job.applicationUrlStatus === "AVAILABLE" && finalUrl && originalUrl && finalUrl !== originalUrl
      ? "REDIRECIONADO"
      : job.applicationUrlStatus === "AVAILABLE"
        ? "ATIVO"
        : "INDETERMINADO";
  const classification = expired
    ? "EXPIRADA"
    : blockers.length
      ? "INCOMPLETA"
      : duplicate
        ? "DUPLICADA"
        : issues.some((issue) => issue.severity === "WARNING")
          ? "SUSPEITA"
          : issues.length
            ? "REVISAR"
            : "OK";
  return {
    row,
    issues,
    salaryStatus: salary.status,
    locationStatus,
    complete: blockers.length === 0,
    expired,
    duplicate,
    jobPostingCompatible: jobPosting.valid && blockers.length === 0,
    classification,
    linkStatus,
    duplicateReasons
  };
}

type JobAuditReport = { assessments: JobAuditAssessment[]; duplicateGroups: Array<{ id: number; reason: string; jobs: Array<{ id: string; code: string; title: string }> }>; summary: ReturnType<typeof summarize> };
let reportCache: { at: number; value: JobAuditReport } | null = null;
const REPORT_CACHE_MS = 15_000;

export async function getJobAuditReport() {
  if (!process.env.DATABASE_URL) return { assessments: [] as JobAuditAssessment[], duplicateGroups: [], summary: emptySummary() };
  if (reportCache && Date.now() - reportCache.at < REPORT_CACHE_MS) return reportCache.value;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = await connection.db.select({
      job: jobs,
      companyName: companies.name,
      cityName: cities.name,
      cityActive: cities.active,
      stateCode: states.code,
      categoryName: categories.name,
      cityIbgeCode: cities.ibgeCode
    }).from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(cities, eq(jobs.cityId, cities.id))
      .innerJoin(states, eq(jobs.stateId, states.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .orderBy(asc(jobs.normalizedTitle));
    const byId = new Map(rows.map((row) => [row.job.id, row]));
    const candidates = new Map<string, { reason: string; ids: Set<string> }>();
    const addCandidate = (key: string | null, reason: string, id: string) => {
      if (!key || key === "hash:null" || key === "hash:undefined" || key === "hash:") return;
      const candidate = candidates.get(key) ?? { reason, ids: new Set<string>() };
      candidate.ids.add(id);
      candidates.set(key, candidate);
    };
    for (const row of rows) {
      addCandidate(`hash:${row.job.duplicateHash}`, "Mesmo hash de deduplicação", row.job.id);
      addCandidate(normalizeUrl(row.job.sourceUrl) ? `source:${normalizeUrl(row.job.sourceUrl)}` : null, "Mesma URL de origem", row.job.id);
      addCandidate(normalizeUrl(row.job.applicationUrl) ? `apply:${normalizeUrl(row.job.applicationUrl)}` : null, "Mesma URL de candidatura", row.job.id);
      addCandidate(`identity:${normalize(row.companyName)}|${normalize(row.job.normalizedTitle)}|${normalize(row.cityName)}`, "Mesma empresa, cargo e cidade", row.job.id);
    }
    const shingleOwners = new Map<string, string[]>();
    const shinglesById = new Map(rows.map((row) => [row.job.id, descriptionShingles(row.job.descriptionHtml)]));
    for (const [id, shingles] of shinglesById) for (const shingle of shingles) shingleOwners.set(shingle, [...(shingleOwners.get(shingle) ?? []), id]);
    const pairs = new Set<string>();
    for (const ids of shingleOwners.values()) if (ids.length > 1 && ids.length <= 20) for (let left = 0; left < ids.length - 1; left++) for (let right = left + 1; right < ids.length; right++) pairs.add([ids[left]!, ids[right]!].sort().join("|"));
    for (const pair of pairs) {
      const [leftId, rightId] = pair.split("|") as [string, string];
      const left = shinglesById.get(leftId)!;
      const right = shinglesById.get(rightId)!;
      if (!left.size || !right.size) continue;
      const shared = [...left].filter((value) => right.has(value)).length;
      const similarity = shared / (left.size + right.size - shared);
      if (similarity >= 0.65) {
        addCandidate(`description:${pair}`, `Descrições ${(similarity * 100).toFixed(0)}% semelhantes`, leftId);
        addCandidate(`description:${pair}`, `Descrições ${(similarity * 100).toFixed(0)}% semelhantes`, rightId);
      }
    }
    const duplicateCandidates = [...candidates.values()].filter((candidate) => candidate.ids.size > 1);
    const reasonsById = new Map<string, Set<string>>();
    for (const candidate of duplicateCandidates) for (const id of candidate.ids) {
      const reasons = reasonsById.get(id) ?? new Set<string>();
      reasons.add(candidate.reason);
      reasonsById.set(id, reasons);
    }
    const assessments = rows.map((row) => {
      const reasons = [...(reasonsById.get(row.job.id) ?? [])];
      return assessJobQuality(row, reasons.length ? 2 : 1, new Date(), reasons);
    });
    const seenGroups = new Set<string>();
    const duplicateGroups = duplicateCandidates.flatMap((candidate, index) => {
      const ids = [...candidate.ids].sort();
      const signature = ids.join("|");
      if (seenGroups.has(signature)) return [];
      seenGroups.add(signature);
      return [{ id: index + 1, reason: candidate.reason, jobs: ids.map((id) => byId.get(id)!).filter(Boolean).map((row) => ({ id: row.job.id, code: row.job.publicCode, title: row.job.normalizedTitle })) }];
    });
    const value = { assessments, duplicateGroups, summary: summarize(assessments) };
    reportCache = { at: Date.now(), value };
    return value;
  } finally {
    await connection.close();
  }
}

function emptySummary() {
  return { total: 0, complete: 0, incomplete: 0, withProblems: 0, expired: 0, duplicates: 0, suspicious: 0, review: 0, ok: 0, missingSource: 0, unknownCompany: 0, missingApplicationUrl: 0, missingChannel: 0, suspiciousSalary: 0, invalidLocation: 0, brokenLinks: 0, jobPostingValid: 0, jobPostingInvalid: 0 };
}

function summarize(assessments: JobAuditAssessment[]) {
  const countIssue = (code: JobAuditIssueCode) => assessments.filter((item) => item.issues.some((issue) => issue.code === code)).length;
  const published = assessments.filter((item) => item.row.job.publicationStatus === "PUBLISHED");
  return {
    total: assessments.length,
    complete: assessments.filter((item) => item.complete).length,
    incomplete: assessments.filter((item) => !item.complete).length,
    withProblems: assessments.filter((item) => item.classification !== "OK").length,
    suspicious: assessments.filter((item) => item.classification === "SUSPEITA").length,
    review: assessments.filter((item) => item.classification === "REVISAR").length,
    ok: assessments.filter((item) => item.classification === "OK").length,
    expired: assessments.filter((item) => item.expired).length,
    duplicates: assessments.filter((item) => item.duplicate).length,
    missingSource: countIssue("SOURCE_MISSING"),
    unknownCompany: countIssue("COMPANY_UNKNOWN"),
    missingApplicationUrl: countIssue("APPLICATION_LINK_MISSING"),
    missingChannel: countIssue("APPLICATION_CHANNEL_MISSING"),
    suspiciousSalary: countIssue("SALARY_SUSPICIOUS"),
    invalidLocation: countIssue("CITY_INVALID"),
    brokenLinks: assessments.filter((item) => ["CLOSED", "INVALID"].includes(item.row.job.applicationUrlStatus)).length,
    jobPostingValid: published.filter((item) => item.jobPostingCompatible).length,
    jobPostingInvalid: published.filter((item) => !item.jobPostingCompatible).length
  };
}
