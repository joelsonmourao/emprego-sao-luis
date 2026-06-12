import type { EmploymentType } from "@prisma/client";

/** Valores aceitos em schema.org/JobPosting para employmentType. */
export type SchemaEmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "TEMPORARY"
  | "INTERN"
  | "VOLUNTEER"
  | "PER_DIEM"
  | "OTHER";

export function mapEmploymentTypeForJobPostingSchema(type: EmploymentType): SchemaEmploymentType {
  switch (type) {
    case "INTERNSHIP":
      return "INTERN";
    case "PART_TIME":
      return "PART_TIME";
    case "TEMPORARY":
      return "TEMPORARY";
    case "CONTRACTOR":
      return "CONTRACTOR";
    case "PER_DIEM":
      return "PER_DIEM";
    case "VOLUNTEER":
      return "VOLUNTEER";
    case "APPRENTICESHIP":
      return "PART_TIME";
    case "FULL_TIME":
      return "FULL_TIME";
    default:
      return "OTHER";
  }
}
