import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SITE_TIME_ZONE,
  formatDatePtBr,
  formatDateTimePtBr,
  fromDatetimeLocalValue,
  getDateTimePartsInTimeZone,
  toDatetimeLocalValue
} from "./timezone.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site timezone helpers", () => {
  it("defaults to America/Sao_Paulo", () => {
    expect(DEFAULT_SITE_TIME_ZONE).toBe("America/Sao_Paulo");
  });

  it("formats dates in Brazil time regardless of process UTC offset", () => {
    // 21/07/2026 21:00 UTC = 18:00 em São Luís (UTC-3)
    const date = new Date("2026-07-21T21:00:00.000Z");
    expect(formatDateTimePtBr(date, "America/Sao_Paulo")).toMatch(/21\/07\/2026/);
    expect(formatDateTimePtBr(date, "America/Sao_Paulo")).toMatch(/18:00/);
    expect(formatDatePtBr(date, "America/Sao_Paulo")).toMatch(/21/);
  });

  it("round-trips datetime-local values in America/Sao_Paulo", () => {
    const local = "2026-07-21T18:30";
    const instant = fromDatetimeLocalValue(local, "America/Sao_Paulo")!;
    expect(instant.toISOString()).toBe("2026-07-21T21:30:00.000Z");
    expect(toDatetimeLocalValue(instant, "America/Sao_Paulo")).toBe(local);
  });

  it("reads wall-clock parts in Sao Paulo", () => {
    const parts = getDateTimePartsInTimeZone(new Date("2026-01-15T03:00:00.000Z"), "America/Sao_Paulo");
    expect(parts).toMatchObject({ year: 2026, month: 1, day: 15, hour: 0, minute: 0 });
  });
});
