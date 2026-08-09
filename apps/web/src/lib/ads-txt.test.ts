import { describe, expect, it } from "vitest";
import { validateAdsTxtContent } from "./ads-txt";

describe("ads.txt validation", () => {
  it("normalizes and deduplicates valid records", () => {
    const result = validateAdsTxtContent("google.com, pub-123, direct, f08c47fec0942fa0\ngoogle.com,pub-123,DIRECT,f08c47fec0942fa0");
    expect(result.valid).toBe(true);
    expect(result.content).toBe("google.com, pub-123, DIRECT, f08c47fec0942fa0");
    expect(result.duplicatesRemoved).toBe(1);
  });

  it("rejects placeholders and malformed publisher IDs", () => {
    expect(validateAdsTxtContent("google.com, pub-…, DIRECT, f08c47fec0942fa0").valid).toBe(false);
  });
});
