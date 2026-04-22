import type { AdSlot } from "@prisma/client";

import { pagination } from "@/lib/constants";

export type AdComplianceIssue = {
  severity: "error" | "warn" | "info";
  message: string;
};

export type AdComplianceReport = {
  score: number;
  activeSlotCount: number;
  issues: AdComplianceIssue[];
  suggestions: string[];
  byPageKey: Record<string, { active: number; slugs: string[] }>;
};

const ADSENSE_MAX_ADS_PER_PAGE = 3;

function groupByPageKey(slots: AdSlot[]) {
  return slots.reduce<Record<string, { active: number; slugs: string[] }>>((acc, slot) => {
    const key = slot.pageKey || "global";
    if (!acc[key]) acc[key] = { active: 0, slugs: [] };
    if (slot.isActive) {
      acc[key].active += 1;
      acc[key].slugs.push(slot.slug);
    }
    return acc;
  }, {});
}

export function buildAdComplianceReport(slots: AdSlot[]): AdComplianceReport {
  const issues: AdComplianceIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;
  const active = slots.filter((s) => s.isActive);
  const byPageKey = groupByPageKey(slots);

  if (active.length === 0) {
    issues.push({ severity: "info", message: "Nenhum slot ativo: sem receita de display no site." });
    score -= 5;
  }

  for (const [pageKey, { active: count, slugs }] of Object.entries(byPageKey)) {
    if (count > ADSENSE_MAX_ADS_PER_PAGE) {
      issues.push({
        severity: "error",
        message: `Pagina \"${pageKey}\": ${count} slots ativos (limite recomendado pelo AdSense: ${ADSENSE_MAX_ADS_PER_PAGE}). Slugs: ${slugs.join(", ")}.`
      });
      score -= 25;
    } else if (count === ADSENSE_MAX_ADS_PER_PAGE) {
      issues.push({
        severity: "warn",
        message: `Pagina \"${pageKey}\": no limite de ${ADSENSE_MAX_ADS_PER_PAGE} anuncios — revise se ha conteudo suficiente entre eles.`
      });
      score -= 8;
    }
  }

  const jobMainStack = active.filter((s) => s.pageKey === "job-detail" && (s.position === "top" || s.position === "between-listings"));
  if (jobMainStack.length >= 2) {
    issues.push({
      severity: "warn",
      message:
        "Detalhe da vaga: ha mais de um anuncio na coluna principal (topo + entre blocos). Garanta espaco vertical > 200px entre unidades para reduzir cliques acidentais."
    });
    score -= 10;
  }

  const sidebarSlots = active.filter((s) => s.position === "sidebar");
  if (sidebarSlots.length) {
    issues.push({
      severity: "info",
      message:
        "Sidebar: confira no navegador se a coluna lateral tem altura suficiente (~300px+) antes do anuncio para nao comprimir o conteudo."
    });
  }

  if (pagination.jobsPerPage < 8 && byPageKey["jobs-list"]?.active) {
    issues.push({
      severity: "warn",
      message: `Listagem de vagas: com ${pagination.jobsPerPage} vagas por pagina, anuncios \"entre listagens\" ficam densos. Recomendado: 12 vagas por pagina e 1 anuncio apos 6-8 cards.`
    });
    score -= 7;
  } else if (pagination.jobsPerPage >= 12 && byPageKey["jobs-list"]?.active) {
    suggestions.push("Listagem com 12 vagas por pagina: bom espacamento para anuncio entre cards.");
  }

  if (active.length > 12) {
    issues.push({ severity: "warn", message: "Muitos slots ativos no site inteiro — revise se todos sao necessarios." });
    score -= 5;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  if (score < 70) {
    suggestions.push("Reduza slots ativos por pagina, aumente conteudo entre anuncios ou desative unidades redundantes.");
  }

  return {
    score,
    activeSlotCount: active.length,
    issues,
    suggestions,
    byPageKey
  };
}
