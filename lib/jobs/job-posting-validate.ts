import type { EmploymentType } from "@prisma/client";

import { employmentTypeToSchemaValue } from "@/lib/jobs/employment-type";

export type JobPostingValidationInput = {
  displayTitle: string;
  descriptionHtml: string;
  datePosted: string;
  validThrough: string;
  employmentType: EmploymentType;
  companyName: string;
  cityName: string;
  stateCode: string;
  countryCode: string;
};

export function validateJobPostingMinimum(input: JobPostingValidationInput): { ok: true } | { ok: false; reason: string } {
  if (!input.displayTitle.trim()) return { ok: false, reason: "missing_title" };
  if (!input.companyName.trim()) return { ok: false, reason: "missing_company" };
  if (!input.descriptionHtml.trim()) return { ok: false, reason: "missing_description" };
  if (!input.datePosted.trim()) return { ok: false, reason: "missing_datePosted" };
  if (!input.validThrough.trim()) return { ok: false, reason: "missing_validThrough" };
  if (!input.cityName.trim()) return { ok: false, reason: "missing_city" };
  if (!input.stateCode.trim()) return { ok: false, reason: "missing_state" };
  if (!input.countryCode.trim()) return { ok: false, reason: "missing_country" };

  const et = employmentTypeToSchemaValue(input.employmentType, { title: input.displayTitle });
  const etList = Array.isArray(et) ? et : [et];
  if (!etList.length || !etList.every(Boolean)) return { ok: false, reason: "missing_employmentType" };

  return { ok: true };
}
