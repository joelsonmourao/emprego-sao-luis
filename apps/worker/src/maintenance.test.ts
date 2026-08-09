import { describe, expect, it } from "vitest";
import { shouldSuppressIndexingInReview } from "./maintenance.js";

describe("indexing events during AdSense review mode", () => {
  it("suppresses job and web-story updates but keeps removals and editorial updates", () => {
    expect(shouldSuppressIndexingInReview("https://empregossaoluis.com.br/vagas/auxiliar", "URL_UPDATED", true)).toBe(true);
    expect(shouldSuppressIndexingInReview("https://empregossaoluis.com.br/web-stories/curriculo", "URL_UPDATED", true)).toBe(true);
    expect(shouldSuppressIndexingInReview("https://empregossaoluis.com.br/vagas/auxiliar", "URL_DELETED", true)).toBe(false);
    expect(shouldSuppressIndexingInReview("https://empregossaoluis.com.br/blog/curriculo", "URL_UPDATED", true)).toBe(false);
  });
});
