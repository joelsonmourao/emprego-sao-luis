import { describe, expect, it } from "vitest";
import { publicCodeSchema } from "./index.js";

describe("publicCodeSchema", () => {
  it("accepts the public job code format", () => expect(publicCodeSchema.parse("ES-000001")).toBe("ES-000001"));
  it("rejects invalid codes", () => expect(() => publicCodeSchema.parse("ES-1")).toThrow());
});
