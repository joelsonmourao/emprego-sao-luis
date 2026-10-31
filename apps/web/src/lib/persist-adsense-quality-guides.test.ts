import { describe, expect, it } from "vitest";
import { qualityGuides, isHoldReview } from "../../../../scripts/data/adsense-quality-guides.mjs";
import {
  buildPublicationPlan,
  resolveGuidePublication,
  todayYmdSaoPaulo
} from "../../../../scripts/persist-adsense-quality-guides.mjs";

describe("persist adsense quality guides plan", () => {
  it("keeps FACT_REVIEW as DRAFT and never auto-publishes them", () => {
    const holds = qualityGuides.filter((g) => isHoldReview(g));
    expect(holds.map((g) => g.slug).sort()).toEqual(
      ["estagio-x-jovem-aprendiz", "jovem-aprendiz-como-funciona"].sort()
    );
    const plan = buildPublicationPlan(qualityGuides, { now: new Date("2026-08-10T12:00:00-03:00") });
    for (const hold of holds) {
      const row = plan.find((p) => p.slug === hold.slug);
      expect(row?.status).toBe("DRAFT");
      expect(row?.scheduledAt).toBeNull();
      expect(row?.publishedAt).toBeNull();
      expect(row?.reason).toBe("FACT_REVIEW_HOLD");
    }
    expect(plan.filter((p) => p.status === "PUBLISHED")).toHaveLength(2);
    expect(plan.filter((p) => p.status === "SCHEDULED")).toHaveLength(4);
  });

  it("never schedules in the past relative to now", () => {
    const now = new Date("2026-08-10T21:30:00-03:00");
    const guide = qualityGuides.find((g) => g.publishPlan === "SCHEDULE_DAY");
    expect(guide).toBeTruthy();
    const row = resolveGuidePublication(
      { ...guide!, scheduleDayOffset: 0, scheduleTimeLocal: "09:00" },
      { now }
    );
    expect(row.status).toBe("SCHEDULED");
    expect(row.scheduledAt!.getTime()).toBeGreaterThan(now.getTime());
    expect(todayYmdSaoPaulo(now)).toBe("2026-08-10");
  });

  it("validates local cover files for every guide", () => {
    const plan = buildPublicationPlan();
    expect(plan.every((p) => p.coverOk)).toBe(true);
  });
});
