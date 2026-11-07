import { describe, expect, it } from "vitest";
import { classifyCategoryPage, classifyCityPage, classifyCompanyPage } from "./entity-page-quality";

const longText = "Conteúdo editorial próprio e verificável. ".repeat(20);

describe("entity page quality", () => {
  it("keeps empty entities out of the index", () => {
    expect(classifyCityPage({ activeJobs: 0 })).toBe("SEM_VAGAS");
  });

  it("only considers categories strong with jobs, substantial copy and metadata", () => {
    expect(classifyCategoryPage({ activeJobs: 8, description: longText, seoTitle: "Vagas de tecnologia em São Luís", metaDescription: longText.slice(0, 150) })).toBe("FORTE");
    expect(classifyCategoryPage({ activeJobs: 8, description: "Lista de vagas" })).toBe("FRACA");
  });

  it("does not treat a company job listing as editorial content", () => {
    expect(classifyCompanyPage({ activeJobs: 3, descriptionHtml: "<p>Empresa</p>" })).toBe("FRACA");
  });
});
