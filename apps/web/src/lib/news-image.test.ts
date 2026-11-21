import { describe, expect, it } from "vitest";
import { validateNewsImageAsset } from "./news-image";

const variants = Object.fromEntries(
  ["hero", "card", "og", "square", "landscape43"].map((key) => [
    key,
    { url: `/media/${key}.webp`, width: 1200, height: 630, mimeType: "image/webp", storageKey: `${key}.webp` }
  ])
);

describe("news image standard", () => {
  it("accepts an original with every required variant", () =>
    expect(validateNewsImageAsset({ width: 1600, height: 900, variants }).ok).toBe(true));
  it("rejects images below 1200 px", () =>
    expect(validateNewsImageAsset({ width: 1199, height: 900, variants }).ok).toBe(false));
  it("rejects incomplete derivatives", () =>
    expect(validateNewsImageAsset({ width: 1600, height: 900, variants: {} }).ok).toBe(false));
});
