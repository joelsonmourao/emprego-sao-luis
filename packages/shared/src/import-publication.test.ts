import { describe, expect, it } from "vitest";
import { isOfficialImportMappingReady, resolveImportPublication } from "./import-publication.js";

describe("resolveImportPublication", () => {
  const now = new Date("2026-07-21T15:00:00.000Z");

  it("publishes when dataPublicacao is in the past/present", () => {
    const plan = resolveImportPublication({
      mode: "PUBLISH_BY_DATE",
      publishedAt: new Date("2026-07-20T12:00:00.000Z"),
      expiresAt: new Date("2026-08-21T12:00:00.000Z"),
      now
    });
    expect(plan.publicationStatus).toBe("PUBLISHED");
    expect(plan.publishedAt?.toISOString()).toBe("2026-07-20T12:00:00.000Z");
    expect(plan.scheduledAt).toBeNull();
  });

  it("schedules when dataPublicacao is in the future", () => {
    const plan = resolveImportPublication({
      mode: "PUBLISH_BY_DATE",
      publishedAt: new Date("2026-07-25T12:00:00.000Z"),
      expiresAt: new Date("2026-08-21T12:00:00.000Z"),
      now
    });
    expect(plan).toMatchObject({
      publicationStatus: "SCHEDULED",
      publishedAt: null,
      verificationStatus: "SOURCE_CONFIRMED"
    });
    expect(plan.scheduledAt?.toISOString()).toBe("2026-07-25T12:00:00.000Z");
  });

  it("falls back to draft without dataPublicacao", () => {
    const plan = resolveImportPublication({
      mode: "PUBLISH_BY_DATE",
      expiresAt: new Date("2026-08-21T12:00:00.000Z"),
      now
    });
    expect(plan.publicationStatus).toBe("DRAFT");
    expect(plan.warning).toMatch(/dataPublicacao/i);
  });
});

describe("isOfficialImportMappingReady", () => {
  it("requires publishedAt and a channel", () => {
    expect(
      isOfficialImportMappingReady({
        title: "titulo",
        company: "empresa",
        description: "descricao",
        sourceName: "fonteNome",
        city: "cidade",
        state: "uf",
        applicationUrl: "candidaturaUrl",
        publishedAt: "dataPublicacao"
      })
    ).toBe(true);
    expect(
      isOfficialImportMappingReady({
        title: "titulo",
        company: "empresa",
        description: "descricao",
        sourceName: "fonteNome",
        city: "cidade",
        state: "uf",
        applicationUrl: "candidaturaUrl"
      })
    ).toBe(false);
  });
});
