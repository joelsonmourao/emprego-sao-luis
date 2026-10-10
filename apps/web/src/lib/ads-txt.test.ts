import { describe, expect, it } from "vitest";
import {
  normalizeGooglePublisherId,
  prepareAdsTxtContent,
  validateAdsTxtContent
} from "./ads-txt";

describe("ads.txt validation", () => {
  const publisher = "pub-1234567890123456";
  const validLine = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0`;

  it("normalizes and deduplicates valid records", () => {
    const result = validateAdsTxtContent(
      `${validLine.toLowerCase()}\ngoogle.com,${publisher},direct,f08c47fec0942fa0`
    );
    expect(result.valid).toBe(true);
    expect(result.content).toBe(validLine);
    expect(result.duplicatesRemoved).toBe(1);
  });

  it("rejects placeholders and malformed Google publisher IDs", () => {
    expect(validateAdsTxtContent("google.com, pub-…, DIRECT, f08c47fec0942fa0").valid).toBe(false);
    expect(validateAdsTxtContent("google.com, pub-123, DIRECT, f08c47fec0942fa0").valid).toBe(false);
    expect(validateAdsTxtContent("google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0").valid).toBe(false);
  });

  it("only prepares content with a valid seller record", () => {
    expect(prepareAdsTxtContent("# AdSense ainda não configurado")).toBe("");
    expect(prepareAdsTxtContent(validLine)).toBe(`${validLine}\n`);
    expect(prepareAdsTxtContent("google.com, pub-123, DIRECT, f08c47fec0942fa0")).toBe("");
  });

  it("normalizes only real 16-digit Google publisher IDs", () => {
    expect(normalizeGooglePublisherId(`ca-${publisher}`)).toBe(publisher);
    expect(normalizeGooglePublisherId(publisher)).toBe(publisher);
    expect(normalizeGooglePublisherId("pub-123")).toBe("");
    expect(normalizeGooglePublisherId("pub-0000000000000000")).toBe("");
  });
});
