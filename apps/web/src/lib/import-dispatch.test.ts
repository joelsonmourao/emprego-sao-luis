import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldProcessImportOnWeb } from "./import-dispatch";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("shouldProcessImportOnWeb", () => {
  it("processes on web when S3 is not fully configured", () => {
    vi.stubEnv("S3_BUCKET", "");
    vi.stubEnv("S3_ENDPOINT", "");
    vi.stubEnv("S3_ACCESS_KEY_ID", "");
    vi.stubEnv("S3_SECRET_ACCESS_KEY", "");
    expect(shouldProcessImportOnWeb()).toBe(true);
  });

  it("prefers worker queue when S3 is configured", () => {
    vi.stubEnv("S3_BUCKET", "bucket");
    vi.stubEnv("S3_ENDPOINT", "https://example.invalid");
    vi.stubEnv("S3_ACCESS_KEY_ID", "key");
    vi.stubEnv("S3_SECRET_ACCESS_KEY", "secret");
    expect(shouldProcessImportOnWeb()).toBe(false);
  });
});
