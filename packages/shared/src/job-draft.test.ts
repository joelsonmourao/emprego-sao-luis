import { describe, expect, it } from "vitest";
import { jobDraftSchema } from "./index.js";

const valid = {
  originalTitle: "Auxiliar Administrativo",
  normalizedTitle: "Auxiliar Administrativo",
  slug: "auxiliar-administrativo",
  companyId: "3f471fa4-1753-4a13-a1da-16b798f82c59",
  cityId: "c2a25faa-72c1-4562-8af8-d58262c41584",
  stateId: "6baccc3d-fc03-490d-af61-e6e61bdad7d9",
  employmentType: "FULL_TIME",
  workplaceType: "presencial",
  descriptionHtml:
    "A empresa busca profissional para executar rotinas administrativas, organizar documentos e apoiar a equipe.",
  applicationUrl: "https://example.com/vaga",
  sourceName: "Site oficial",
  expiresAt: new Date(Date.now() + 86400000),
  publicationStatus: "DRAFT"
} as const;

describe("jobDraftSchema", () => {
  it("accepts a complete source-backed draft", () =>
    expect(jobDraftSchema.safeParse(valid).success).toBe(true));
  it("rejects inverted salary range", () =>
    expect(jobDraftSchema.safeParse({ ...valid, salaryMin: 2000, salaryMax: 1000 }).success).toBe(false));
  it("rejects an expired opportunity", () =>
    expect(jobDraftSchema.safeParse({ ...valid, expiresAt: new Date(0) }).success).toBe(false));
  it("accepts WhatsApp or e-mail as the only application channel", () => {
    const withoutUrl = { ...valid, applicationUrl: undefined };
    expect(jobDraftSchema.safeParse({ ...withoutUrl, applicationWhatsapp: "(98) 99999-1234" }).success).toBe(true);
    expect(jobDraftSchema.safeParse({ ...withoutUrl, applicationEmail: "rh@example.com" }).success).toBe(true);
  });
  it("rejects a draft without any valid application channel", () => {
    const withoutUrl = { ...valid, applicationUrl: undefined };
    expect(jobDraftSchema.safeParse(withoutUrl).success).toBe(false);
  });
});
