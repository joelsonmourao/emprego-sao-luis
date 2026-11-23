import { describe, expect, it } from "vitest";
import { buildPublishIndexingEvents, buildRemoveIndexingEvents, isGoogleIndexingEnabled, type IndexingNotification } from "./indexing";

describe("indexing helpers", () => {
  it("creates publish events for Google and IndexNow", () => {
    const events = buildPublishIndexingEvents({ id: "11111111-1111-4111-8111-111111111111", slug: "assistente", version: 2, prefix: "test" });
    expect(events).toHaveLength(2);
    expect(events.map((event: IndexingNotification) => event.provider)).toEqual(["GOOGLE", "INDEXNOW"]);
    expect(events[0]?.notificationType).toBe("URL_UPDATED");
  });

  it("creates remove events with URL_DELETED for Google", () => {
    const events = buildRemoveIndexingEvents({ id: "11111111-1111-4111-8111-111111111111", slug: "assistente", prefix: "close" });
    expect(events.find((event: IndexingNotification) => event.provider === "GOOGLE")?.notificationType).toBe("URL_DELETED");
  });

  it("respects GOOGLE_INDEXING_ENABLED=false", () => {
    const previous = process.env.GOOGLE_INDEXING_ENABLED;
    process.env.GOOGLE_INDEXING_ENABLED = "false";
    expect(isGoogleIndexingEnabled()).toBe(false);
    process.env.GOOGLE_INDEXING_ENABLED = previous;
  });
});
