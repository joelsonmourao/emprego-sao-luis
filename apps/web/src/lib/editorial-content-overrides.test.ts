import { describe, expect, it } from "vitest";
import { getEditorialContentOverride } from "../data/editorial-content-overrides";

const textOnly = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

describe("revisões editoriais substanciais para AdSense", () => {
  it("substitui o primeiro artigo prioritário por conteúdo verificável e útil", () => {
    const override = getEditorialContentOverride("busca-emprego-sao-luis-2026");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

    expect(override?.reviewedAt).toBe("2026-10-12");
    expect(words).toBeGreaterThanOrEqual(900);
    expect(new Set(outbound).size).toBeGreaterThanOrEqual(4);
    expect(html).toContain("gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine");
    expect(html).toContain("ibge.gov.br/cidades-e-estados/ma/sao-luis.html");
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/ferramentas/custo-deslocamento"');
    expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
    expect(html).not.toMatch(/R\$\s*\d|salário médio|vagas abertas hoje/i);
  });

  it("revisa o segundo artigo prioritário com rotina local e fontes oficiais", () => {
    const override = getEditorialContentOverride("organizar-busca-emprego");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

    expect(override?.reviewedAt).toBe("2026-10-12");
    expect(words).toBeGreaterThanOrEqual(1100);
    expect(new Set(outbound).size).toBeGreaterThanOrEqual(5);
    expect(html).toContain("buscar-emprego-no-sistema-nacional-de-emprego-sine");
    expect(html).toContain("portal-emprega-brasil");
    expect(html).toContain("BIMn37.pdf");
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/ferramentas/custo-deslocamento"');
    expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
    expect(html).not.toMatch(/salário médio|vagas abertas hoje|empresas contratando agora/i);
  });

  it("revisa o terceiro artigo prioritário com uso responsável do LinkedIn", () => {
    const override = getEditorialContentOverride("linkedin-primeiro-emprego");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

    expect(override?.reviewedAt).toBe("2026-10-14");
    expect(words).toBeGreaterThanOrEqual(1200);
    expect(new Set(outbound).size).toBeGreaterThanOrEqual(5);
    expect(html).toContain("linkedin.com/help/linkedin/answer/a554351");
    expect(html).toContain("linkedin.com/help/linkedin/answer/a1420165");
    expect(html).toContain("linkedin.com/help/linkedin/answer/a518980");
    expect(html).toContain("linkedin.com/help/linkedin/answer/a1338436");
    expect(html).toContain("buscar-emprego-no-sistema-nacional-de-emprego-sine");
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/guias/emprego-sine-maranhao"');
    expect(html).toContain('href="/blog/objetivo-profissional-curriculo"');
    expect(html).not.toContain('href="/blog/objetivo-profissional"');
    expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
    expect(html).not.toMatch(/salário médio|vagas abertas hoje|empresas contratando agora|contratação garantida/i);
  });

  it("revisa o lote residual que estava sem fonte externa", () => {
    const residual = [
      "perguntas-comuns-entrevista-emprego",
      "objetivo-profissional-curriculo",
      "salario-custo-de-vida-sao-luis",
      "comparar-portais-emprego-seguranca",
      "quantas-vagas-candidatar-por-semana",
      "vagas-comercio-servicos-sao-luis-perfil",
      "mapa-setores-vagas-sao-luis"
    ];

    for (const slug of residual) {
      const override = getEditorialContentOverride(slug);
      const words = textOnly(override?.contentHtml ?? "").split(/\s+/).filter(Boolean);
      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(500);
      expect(override?.contentHtml).toMatch(/<a href="https:\/\//);
      expect(override?.contentHtml).not.toMatch(/No tema em pauta|Leitura útil do cenário/i);
    }
  });

  it("aprofunda os quatro guias trabalhistas mais curtos com fontes oficiais", () => {
    const laborGuides = [
      "seguro-desemprego-checklist-documentos",
      "ctps-digital-carteira-trabalho-consultar",
      "fgts-consultar-trabalhador-clt",
      "ler-contrato-trabalho-clt"
    ];

    for (const slug of laborGuides) {
      const override = getEditorialContentOverride(slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(550);
      expect(html).toMatch(/<a href="https:\/\//);
      expect(html).toMatch(/gov\.br|fgts\.gov\.br|planalto\.gov\.br/);
      expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida/i);
    }
  });

  it("aprofunda oito guias trabalhistas com revisão individual e fontes oficiais", () => {
    const laborGuides = [
      "trabalhar-fim-de-semana-folga-adicional",
      "convencao-coletiva-holerite-trabalhador",
      "periodo-experiencia-clt-o-que-saber",
      "abono-pecuniario-ferias-holerite",
      "trabalho-noturno-adicional-o-que-perguntar",
      "hora-extra-holerite-como-conferir",
      "retorno-trabalho-apos-maternidade",
      "escala-6x1-o-que-perguntar"
    ];

    for (const slug of laborGuides) {
      const override = getEditorialContentOverride(slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(550);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      expect(outbound.every((url) => /https:\/\/(?:www\.)?(?:gov\.br|planalto\.gov\.br)\//.test(url))).toBe(true);
      expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida/i);
    }
  });

  it("fecha os nove guias trabalhistas ainda abaixo de 550 palavras", () => {
    const laborGuides = [
      "trabalhador-terceirizado-direitos",
      "ponto-eletronico-atraso-trabalho",
      "pedido-demissao-aviso-previo-acerto",
      "ferias-clt-periodo-aquisitivo",
      "banco-de-horas-direitos-trabalhador",
      "assedio-no-trabalho-o-que-fazer",
      "atestado-medico-trabalho-como-entregar",
      "mitos-direitos-trabalhistas-whatsapp",
      "como-ler-holerite-descontos"
    ];

    for (const slug of laborGuides) {
      const override = getEditorialContentOverride(slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(550);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      expect(outbound.every((url) => /https:\/\/(?:www\.)?(?:gov\.br|planalto\.gov\.br|mpt\.mp\.br|sistemas\.cfm\.org\.br|cnes\.trabalho\.gov\.br)\//.test(url))).toBe(true);
      expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida/i);
    }
  });

  it("aprofundou oito guias factuais com pelo menos duas fontes primárias", () => {
    const factualGuides = [
      "pesquisar-empresa-antes-entrevista",
      "primeiro-emprego-sao-luis-checklist",
      "acidente-de-trabalho-o-que-fazer",
      "transferencia-interna-emprego-como-pedir",
      "freelancer-ou-clt-vantagens",
      "servicos-gerais-epi-vaga",
      "home-office-remoto-checklist-vaga",
      "documentos-admissao-emprego-maranhao"
    ];

    for (const slug of factualGuides) {
      const override = getEditorialContentOverride(slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(600);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      expect(outbound.every((url) => /https:\/\/(?:www\.)?(?:gov\.br|planalto\.gov\.br|caepi\.trabalho\.gov\.br)\//.test(url))).toBe(true);
      expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida/i);
    }
  });

  it("aprofunda os dois guias que ainda tinham menos de 350 palavras", () => {
    const cases = [
      {
        slug: "curriculo-pdf-erros-triagem",
        minimumWords: 800,
        required: [
          "Teste o PDF como o recrutador pode recebê-lo",
          "Classificação Brasileira de Ocupações",
          "buscar-emprego-no-sistema-nacional-de-emprego-sine"
        ]
      },
      {
        slug: "entrevista-comportamental-exemplos",
        minimumWords: 900,
        required: [
          "Monte um banco de evidências antes de decorar respostas",
          "Exemplo administrativo com prioridade concorrente",
          "cartilha.cert.br/fasciculos"
        ]
      }
    ];

    for (const item of cases) {
      const override = getEditorialContentOverride(item.slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-15");
      expect(words.length).toBeGreaterThanOrEqual(item.minimumWords);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      for (const excerpt of item.required) expect(html).toContain(excerpt);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida/i);
    }
  });
  it("aprofunda oito guias curtos com método, fontes e revisão individual", () => {
    const cases = [
      {
        slug: "rejeicao-processo-seletivo-como-reagir",
        required: ["Escolha o ajuste conforme a etapa em que o processo parou", "Faça um pequeno teste antes de mudar tudo"]
      },
      {
        slug: "plano-semanal-vagas-sao-luis",
        required: ["Exemplo de distribuição para não misturar as etapas", "Evite duplicidade entre portais"]
      },
      {
        slug: "produtividade-busca-emprego-sao-luis",
        required: ["Limite o trabalho em andamento", "Use um quadro de erros para reduzir retrabalho"]
      },
      {
        slug: "linkedin-emprego-sao-luis-perfil",
        required: ["Revise o perfil como uma sequência de respostas", "Verifique convites de recrutadores sem transferir confiança"]
      },
      {
        slug: "marca-pessoal-candidatura-sao-luis",
        required: ["Monte uma relação entre afirmação e prova", "Faça uma auditoria de consistência antes do envio"]
      },
      {
        slug: "networking-emprego-sao-luis",
        required: ["Use um registro mínimo para respeitar o contexto", "Diferencie três tipos de conversa"]
      },
      {
        slug: "inteligencia-emocional-entrevista",
        required: ["Treine respostas para situações desconfortáveis", "Separe pressão legítima de desrespeito"]
      },
      {
        slug: "retorno-mercado-trabalho-gap-curriculo",
        required: ["Organize um plano de retorno em quatro frentes", "Compare oportunidades pelo retorno possível"]
      }
    ];

    for (const item of cases) {
      const override = getEditorialContentOverride(item.slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-15");
      expect(words.length).toBeGreaterThanOrEqual(700);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      for (const excerpt of item.required) expect(html).toContain(excerpt);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida/i);
    }
  });

  it("aprofunda o segundo lote de oito guias prioritários com fontes e seções próprias", () => {
    const cases = [
      {
        slug: "mensagem-fria-recrutador-linkedin",
        required: ["Escolha o tipo de contato antes de abrir a conversa", "Confirme quem está do outro lado"]
      },
      {
        slug: "acompanhar-candidatura-emprego",
        required: ["Diferencie confirmação automática de avanço real", "Encerre e arquive com privacidade"]
      },
      {
        slug: "o-que-vestir-entrevista-emprego",
        required: ["Considere acessibilidade e necessidade pessoal", "Prepare uma alternativa sem transformar isso em compra"]
      },
      {
        slug: "transporte-entrevista-emprego-sao-luis",
        required: ["Faça a checagem em duas janelas de horário", "Calcule o deslocamento sem inventar tarifa ou benefício"]
      },
      {
        slug: "pedir-feedback-entrevista-emprego",
        required: ["Registre o feedback sem reescrever a fala", "Reconheça limite, discriminação e conflito"]
      },
      {
        slug: "mudanca-de-carreira-sao-luis-curriculo",
        required: ["Organize um ciclo de transição de duas semanas", "Ordene o currículo para explicar a ponte"]
      },
      {
        slug: "gestao-de-tempo-trabalho-dicas",
        required: ["Separe urgência, importância e capacidade", "Faça uma passagem de turno completa"]
      },
      {
        slug: "trabalhador-terceirizado-direitos",
        required: ["Não confunda terceirização com trabalho temporário", "Escolha o canal conforme o problema"]
      }
    ];

    for (const item of cases) {
      const override = getEditorialContentOverride(item.slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-15");
      expect(words.length).toBeGreaterThanOrEqual(740);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      for (const excerpt of item.required) expect(html).toContain(excerpt);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida/i);
    }
  });

});
