import { describe, expect, it } from "vitest";
import {
  classifyApplicationResponse,
  evaluateJobPublication,
  extractNeighborhood,
  parseBrazilianLocation,
  suggestCategory
} from "./index.js";

const baseJob = {
  title: "Analista de Suporte",
  companyName: "Empresa Maranhense",
  description: "Analista de suporte responsável por atender usuários, registrar chamados, documentar soluções e acompanhar indicadores da operação de tecnologia.",
  cityName: "São Luís",
  stateCode: "MA",
  sourceName: "Site oficial",
  applicationUrl: "https://example.com/vaga",
  expiresAt: new Date(Date.now() + 86_400_000),
  verificationStatus: "VERIFIED",
  publicationStatus: "PUBLISHED"
};

describe("job governance", () => {
  it("normalizes Grande Ilha locations without guessing ambiguous places", () => {
    expect(parseBrazilianLocation({ locality: "São José de Ribamar / MA" })).toMatchObject({
      city: "São José de Ribamar",
      state: "MA",
      status: "EXACT"
    });
    expect(parseBrazilianLocation({ locality: "Centro" }).status).toBe("PENDING");
  });

  it("uses deterministic category rules and exposes confidence", () => {
    const result = suggestCategory(
      { title: "Desenvolvedor de software", description: "Programador de software e dados para a equipe de tecnologia." },
      [{ id: "tech", name: "Tecnologia" }, { id: "sales", name: "Vendas" }]
    );
    expect(result).toMatchObject({ categoryId: "tech", categoryName: "Tecnologia", level: "HIGH", source: "DETERMINISTIC" });
  });

  it("blocks noisy, expired, unreviewed or channel-less publication", () => {
    expect(evaluateJobPublication({ ...baseJob, title: "Teste" }).valid).toBe(false);
    expect(evaluateJobPublication({ ...baseJob, expiresAt: new Date(0) }).valid).toBe(false);
    expect(evaluateJobPublication({ ...baseJob, verificationStatus: "NEEDS_REVIEW" }).valid).toBe(false);
    expect(evaluateJobPublication({ ...baseJob, applicationUrl: null }).valid).toBe(false);
  });

  it("does not block a valid job only because category is absent", () => {
    const result = evaluateJobPublication({ ...baseJob, categoryName: null });
    expect(result.valid).toBe(true);
    expect(result.status).toBe("NEEDS_REVIEW");
  });

  it("treats anti-bot and rate-limit responses as inconclusive", () => {
    expect(classifyApplicationResponse({ status: 403 }).health).toBe("INCONCLUSIVE");
    expect(classifyApplicationResponse({ status: 429 }).health).toBe("INCONCLUSIVE");
    expect(classifyApplicationResponse({ status: 410 }).health).toBe("CLOSED");
    expect(classifyApplicationResponse({ status: 200, body: "Esta vaga está encerrada" }).health).toBe("CLOSED");
  });

  it("extracts neighborhood only from explicit evidence and never invents from city", () => {
    expect(extractNeighborhood({ description: "Vaga em São Luís/MA" }).neighborhood).toBeNull();
    expect(
      extractNeighborhood({
        description: "Trabalho no bairro Cohama, unidade local.",
        knownNeighborhoods: ["Cohama", "Cohatrac"]
      })
    ).toMatchObject({ neighborhood: "Cohama", status: "EXTRACTED" });
  });
});
