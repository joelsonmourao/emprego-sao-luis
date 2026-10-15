import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Slot = {
  time: string;
  type: string;
  category: string;
  workingTitle: string;
  status: "DRAFT" | "PLANNED";
  slug?: string;
  draftFile?: string;
  qualityGate: string;
};
type Day = { date: string; posts: Slot[] };
const read = (path: string) => readFileSync(resolve(path), "utf8");
const calendar = JSON.parse(read("editorial/calendario-3-artigos-diarios-2026.json")) as {
  period: { start: string; end: string };
  timezone: string;
  totalSlots: number;
  totalDays: number;
  days: Day[];
};

describe("Calendário editorial — três publicações pretendidas por dia", () => {
  it("planeja todos os 80 dias de 13/10 a 31/12, sem pular fim de semana", () => {
    expect(calendar.period).toEqual({ start: "2026-10-13", end: "2026-12-31" });
    expect(calendar.timezone).toBe("America/Sao_Paulo");
    expect(calendar.totalDays).toBe(80);
    expect(calendar.totalSlots).toBe(240);
    expect(calendar.days).toHaveLength(80);
    const dates = calendar.days.map((d) => d.date);
    expect(new Set(dates).size).toBe(80);
    for (let index = 0; index < 80; index++) {
      expect(dates[index]).toBe(new Date(Date.UTC(2026, 9, 13 + index)).toISOString().slice(0, 10));
    }
  });

  it("mantém exatamente três pautas diárias, em horários espalhados", () => {
    const titles = new Set<string>();
    for (const day of calendar.days) {
      expect(day.posts).toHaveLength(3);
      expect(day.posts.map((p) => p.time)).toEqual(["09:00", "13:00", "17:00"]);
      for (const post of day.posts) {
        expect(post.type).toBe("GUIDE");
        expect(post.qualityGate).toContain("revisão antes de publicar");
        expect(post.workingTitle.length).toBeGreaterThan(25);
        expect(titles.has(post.workingTitle)).toBe(false);
        titles.add(post.workingTitle);
        expect(["DRAFT", "PLANNED"]).toContain(post.status);
      }
    }
    expect(titles.size).toBe(240);
  });

  it("os três textos de amanhã existem, têm fontes e NÃO fingem publicação", () => {
    const first = calendar.days[0].posts;
    const slugs = new Set();
    for (const post of first) {
      expect(post.status).toBe("DRAFT");
      expect(post.draftFile?.startsWith("editorial/2026-10-13/")).toBe(true);
      expect(post.slug).toBeTruthy();
      expect(slugs.has(post.slug)).toBe(false);
      slugs.add(post.slug);
      const draft = read(post.draftFile!);
      const body = draft.split("---").slice(2).join("---");
      expect(body.trim().split(/\s+/).length).toBeGreaterThan(500);
      expect(draft).toContain("status: DRAFT");
      expect(draft).toContain("PENDING_APPROVED_COVER");
      expect(draft).toContain("PENDING_EDITORIAL_REVIEW");
      expect(draft).toContain(post.workingTitle);
      expect(body).toContain("https://www.gov.br/");
    }
    for (const day of calendar.days.slice(1))
      for (const post of day.posts) {
        expect(post.status).toBe("PLANNED");
        expect(post.draftFile).toBeUndefined();
      }
  });
});
