import { describe, expect, it } from "vitest";
import { INSTITUTIONAL_SLUGS } from "./site-pages";

describe("site-pages", () => {
  it("define todas as páginas institucionais exigidas", () => {
    const required = [
      "quem-somos",
      "contato",
      "privacidade",
      "cookies",
      "termos",
      "lgpd",
      "politica-editorial",
      "politica-correcoes",
      "politica-fontes",
      "seguranca-candidatos",
      "anunciar-vaga",
      "area-empresas",
      "redacao",
      "sobre"
    ];
    for (const slug of required) expect(INSTITUTIONAL_SLUGS).toContain(slug);
  });
});
