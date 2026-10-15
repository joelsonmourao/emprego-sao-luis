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
      expect(override?.reviewedAt).toBe(["mapa-setores-vagas-sao-luis", "salario-custo-de-vida-sao-luis", "vagas-comercio-servicos-sao-luis-perfil", "objetivo-profissional-curriculo", "quantas-vagas-candidatar-por-semana"].includes(slug) ? "2026-10-15" : "2026-10-14");
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
      expect(override?.reviewedAt).toBe(["fgts-consultar-trabalhador-clt", "seguro-desemprego-checklist-documentos"].includes(slug) ? "2026-10-15" : "2026-10-14");
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
      expect(override?.reviewedAt).toBe("2026-10-15");
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
      expect(override?.reviewedAt).toBe("2026-10-15");
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
      expect(override?.reviewedAt).toBe([
        "acidente-de-trabalho-o-que-fazer",
        "transferencia-interna-emprego-como-pedir",
        "freelancer-ou-clt-vantagens",
        "servicos-gerais-epi-vaga",
        "documentos-admissao-emprego-maranhao"
      ].includes(slug) ? "2026-10-15" : "2026-10-14");
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

  it("aprofunda o lote 8c com fontes, extensao e controles por URL", () => {
    const cases = [
      {
        slug: "mapa-setores-vagas-sao-luis",
        required: ["Monte uma coleta de 14 dias", "Separe fluxo de anúncios de estoque de empregos"]
      },
      {
        slug: "follow-up-apos-entrevista-mensagem",
        required: ["Use uma linha do tempo, não a ansiedade", "Guarde prova sem montar um arquivo de dados pessoais"]
      },
      {
        slug: "cursos-no-curriculo-sem-enchimento",
        required: ["Dê uma nota que possa ser explicada", "Trate pendência, validade e comprovação sem maquiar"]
      },
      {
        slug: "excel-basico-vagas-emprego",
        required: ["Valide a planilha como se outra pessoa fosse recebê-la", "Tenha cuidado ao importar CSV e trocar de versão"]
      },
      {
        slug: "vagas-estoque-logistica-sao-luis",
        required: ["Compare o processo antes de comparar o nome do cargo", "Avalie turno e deslocamento em São Luís"]
      },
      {
        slug: "vagas-motorista-entregador-sao-luis",
        required: ["Confirme qual regra se aplica à atividade descrita", "Calcule custo e risco sem chamar faturamento de renda"]
      },
      {
        slug: "ponto-eletronico-atraso-trabalho",
        required: ["Identifique o sistema e preserve o comprovante", "Consulte também a regra coletiva aplicável"]
      },
      {
        slug: "fgts-consultar-trabalhador-clt",
        required: ["Faça uma conciliação por competência", "Diferencie ausência, atraso de processamento e leitura incompleta"]
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

  it("aprofunda o lote 8d com fontes e controles especificos por URL", () => {
    const cases = [
      { slug: "gap-habilidades-candidatura-como-fechar", required: ["Priorize por frequência, necessidade e possibilidade de prova", "Use uma regra de parada"] },
      { slug: "avaliacao-de-desempenho-preparacao", required: ["Faça uma tabela de expectativa, fato e dependência", "Teste se o feedback pode virar ação"] },
      { slug: "trabalho-hibrido-sao-luis-checklist", required: ["Classifique cada presença antes de aceitar a rotina", "Reconcilie o combinado com a prática"] },
      { slug: "alfabetizacao-digital-emprego-basico", required: ["Treine permissões e tamanho de arquivo", "Crie um teste mensal de autonomia"] },
      { slug: "conflito-com-chefe-trabalho-dicas", required: ["Escolha uma frase que peça decisão", "Use uma escala de resposta"] },
      { slug: "empatia-atendimento-cliente-entrevista", required: ["Use apenas o dado necessário para resolver", "Prepare uma resposta para dizer não"] },
      { slug: "negociar-horario-deslocamento-emprego", required: ["Compare três cenários antes da conversa", "Registre o que foi aprovado e por quanto tempo"] },
      { slug: "primeira-semana-emprego-novo", required: ["Use as primeiras 72 horas para mapear riscos", "Classifique tarefas por autonomia"] }
    ];

    for (const item of cases) {
      const override = getEditorialContentOverride(item.slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-15");
      expect(words.length).toBeGreaterThanOrEqual(760);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      for (const excerpt of item.required) expect(html).toContain(excerpt);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida/i);
    }
  });


  it("aprofunda o lote 8e de direitos trabalhistas e decisões locais com controles por URL", () => {
    const cases = [
      { slug: "entrevista-desligamento-o-que-falar", required: ["Monte uma matriz de pendências, documentos e responsáveis", "Diferencie relato, opinião e solicitação"] },
      { slug: "experiencia-informal-curriculo-como-colocar", required: ["Monte prova em três camadas sem expor terceiros", "Cheque consistência entre currículo, entrevista e cadastro"] },
      { slug: "saude-mental-trabalho-limites", required: ["Separe cuidado individual de risco na organização", "Crie um plano de escalonamento antes da crise"] },
      { slug: "sindicato-trabalhador-direitos-basico", required: ["Faça o teste de quatro chaves antes de aplicar uma cláusula", "Diferencie entidade de trabalhadores e entidade patronal"] },
      { slug: "como-pedir-aumento-salario", required: ["Converta o pedido em uma tabela verificável", "Prepare três respostas possíveis antes da reunião"] },
      { slug: "salario-custo-de-vida-sao-luis", required: ["Faça um teste de estresse do primeiro mês", "Registre o custo de tempo separado do dinheiro"] },
      { slug: "ferias-clt-periodo-aquisitivo", required: ["Confira comunicação, concessão e pagamento em documentos separados", "Leia o fracionamento com os requisitos completos"] },
      { slug: "entrevista-presencial-sao-luis-dicas", required: ["Use um protocolo de chegada e saída segura", "Faça uma ficha pós-entrevista em quinze minutos"] }
    ];

    for (const item of cases) {
      const override = getEditorialContentOverride(item.slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-15");
      expect(words.length).toBeGreaterThanOrEqual(780);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      for (const excerpt of item.required) expect(html).toContain(excerpt);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida/i);
    }
  });


  it("aprofunda o lote 8f de direitos, segurança e decisões locais com controles por URL", () => {
    const cases = [
      { slug: "pedido-demissao-aviso-previo-acerto", required: ["Separe pedido de demissão de acordo entre as partes", "Monte uma linha do tempo do acerto"] },
      { slug: "vagas-pcd-inclusao-emprego", required: ["Descreva a barreira antes de pedir um recurso", "Faça uma verificação de ponta a ponta"] },
      { slug: "vagas-vendedor-loja-comissao-dicas", required: ["Crie rastreabilidade para cada etapa da comissão", "Reconcilie o primeiro demonstrativo"] },
      { slug: "golpe-vaga-emprego-sao-luis", required: ["Use um roteiro de quinze minutos antes de responder", "Preserve evidência sem prolongar o contato"] },
      { slug: "vagas-call-center-sao-luis", required: ["Mapeie o que será observado durante o turno", "Compare anúncio, treinamento e prática"] },
      { slug: "vagas-comercio-servicos-sao-luis-perfil", required: ["Faça uma amostra local sem transformar anúncio em estatística", "Monte um mapa de unidades e horários"] },
      { slug: "seguranca-candidatas-entrevista-emprego", required: ["Use dois pontos de confirmação", "Registre fatos sem ampliar exposição"] },
      { slug: "comparar-duas-propostas-emprego", required: ["Defina um piso de decisão antes de escolher", "Aplique um portão de confirmação"] }
    ];

    for (const item of cases) {
      const override = getEditorialContentOverride(item.slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-15");
      expect(words.length).toBeGreaterThanOrEqual(860);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      for (const excerpt of item.required) expect(html).toContain(excerpt);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida|empresa está contratando/i);
    }
  });


  it("aprofunda o lote 8g com privacidade, evidencia e limites verificaveis", () => {
    const cases = [
      { slug: "objetivo-profissional-curriculo", minimumWords: 900, required: ["Converta a frase em três testes de coerência", "Crie versões apenas para alvos realmente diferentes"] },
      { slug: "quantas-vagas-candidatar-por-semana", minimumWords: 880, required: ["Monte uma capacidade semanal a partir do tempo real", "Defina regras para aumentar ou reduzir o ritmo"] },
      { slug: "teste-online-processo-seletivo-dicas", minimumWords: 900, required: ["Faça uma ficha de privacidade antes de iniciar", "Decida o que fazer em três tipos de falha"] },
      { slug: "entrevista-por-video-emprego", minimumWords: 900, required: ["Faça um ensaio com roteiro de cinco minutos", "Prepare dois planos de contingência por escrito"] },
      { slug: "referencias-profissionais-emprego", minimumWords: 900, required: ["Monte um dossiê mínimo para cada referência", "Tenha uma substituição que não pareça improviso"] },
      { slug: "ingles-no-curriculo-nivel-honesto", minimumWords: 900, required: ["Faça uma matriz por habilidade, não uma média abstrata", "Use os níveis A1 a C2 com o descritor correspondente"] },
      { slug: "plano-90-dias-emprego-sao-luis", minimumWords: 900, required: ["Transforme os 90 dias em seis ciclos de quinze", "Defina uma regra de pausa e outra de mudança"] },
      { slug: "esgotamento-busca-emprego-sinais", minimumWords: 940, required: ["Use um semáforo de funcionamento, não um autodiagnóstico", "Prepare apoio concreto para dias difíceis"] }
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
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida|empresa está contratando/i);
    }
  });

  it("aprofunda o lote 8h de direitos trabalhistas com fontes e conferencias por URL", () => {
    const cases = [
      { slug: "seguro-desemprego-checklist-documentos", minimumWords: 950, required: ["Monte uma linha do tempo que outra pessoa consiga conferir", "Prepare um recurso ligado ao motivo apresentado"] },
      { slug: "trabalhar-fim-de-semana-folga-adicional", minimumWords: 800, required: ["Use uma matriz de quatro classificações", "Faça a conferência em três camadas"] },
      { slug: "vale-alimentacao-ou-refeicao-diferenca", minimumWords: 810, required: ["Separe existência, modalidade e uso", "Faça um teste de utilidade por cinco dias"] },
      { slug: "abono-pecuniario-ferias-holerite", minimumWords: 850, required: ["Separe decisão, pedido, descanso e pagamento", "Teste o documento com três contas independentes"] },
      { slug: "convencao-coletiva-holerite-trabalhador", minimumWords: 920, required: ["Faça o teste de enquadramento em quatro chaves", "Converta a cláusula em uma conferência de folha"] },
      { slug: "trabalho-noturno-adicional-o-que-perguntar", minimumWords: 830, required: ["Faça um mapa por trecho do plantão", "Reconcilie plantão, ponto e folha"] },
      { slug: "banco-de-horas-direitos-trabalhador", minimumWords: 940, required: ["Classifique cada lançamento antes de somar", "Faça uma auditoria em três datas"] },
      { slug: "periodo-experiencia-clt-o-que-saber", minimumWords: 900, required: ["Monte uma ficha de início que caiba em uma página", "Prepare três cenários antes da data final"] }
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
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida|empresa está contratando/i);
    }
  });

  it("aprofunda o lote 8i de vagas locais, inclusao e avaliacao profissional", () => {
    const cases = [
      { slug: "vagas-restaurante-sao-luis-dicas", minimumWords: 900, required: ["Monte um mapa de risco para um turno simulado", "Compare duas propostas sem somar valores incertos"] },
      { slug: "vaga-sazonal-comercio-sao-luis", minimumWords: 890, required: ["Diferencie três modelos antes de comparar propostas", "Faça uma conferência em quatro momentos"] },
      { slug: "vaga-recepcionista-clinica-sao-luis", minimumWords: 860, required: ["Use o mínimo necessário em cada mensagem", "Faça uma passagem de turno que possa ser auditada"] },
      { slug: "auxiliar-administrativo-vagas-sao-luis", minimumWords: 900, required: ["Resolva um caso de duplicidade sem apagar o histórico", "Classifique a autonomia pedida no anúncio"] },
      { slug: "vagas-afirmativas-como-candidatar", minimumWords: 870, required: ["Separe critério de elegibilidade, avaliação e acessibilidade", "Audite o processo sem expor outras pessoas"] },
      { slug: "pretensao-salarial-entrevista-dicas", minimumWords: 880, required: ["Faça uma ficha de comparabilidade antes de buscar números", "Prepare três respostas para a negociação"] },
      { slug: "certificado-ou-experiencia-curriculo", minimumWords: 840, required: ["Construa uma matriz de evidência, não uma pilha de anexos", "Teste a coerência em três documentos"] },
      { slug: "soft-skills-hard-skills-curriculo", minimumWords: 860, required: ["Faça um inventário em pares de tarefa e comportamento", "Faça o teste da pergunta seguinte"] }
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
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida|empresa está contratando/i);
    }
  });

  it("aprofunda o lote 8j de direitos trabalhistas com rastreabilidade e limites", () => {
    const cases = [
      { slug: "transferencia-interna-emprego-como-pedir", minimumWords: 950, required: ["Faça uma matriz de mudança contratual", "Defina critérios de sucesso e saída"] },
      { slug: "mitos-direitos-trabalhistas-whatsapp", minimumWords: 830, required: ["Use uma ficha de rastreabilidade da afirmação", "Classifique antes de encaminhar"] },
      { slug: "acidente-de-trabalho-o-que-fazer", minimumWords: 950, required: ["Faça uma reconciliação entre cinco registros", "Prepare retorno e restrição como um plano de tarefa"] },
      { slug: "atestado-medico-trabalho-como-entregar", minimumWords: 820, required: ["Separe emissão, entrega, validação e afastamento", "Use uma ficha mínima de rastreio"] },
      { slug: "retorno-trabalho-apos-maternidade", minimumWords: 850, required: ["Monte um mapa de retorno com três responsáveis", "Teste a primeira quinzena, não apenas o primeiro dia"] },
      { slug: "assedio-no-trabalho-o-que-fazer", minimumWords: 850, required: ["Construa um mapa de risco antes de escolher o canal", "Faça um relato em duas camadas"] },
      { slug: "hora-extra-holerite-como-conferir", minimumWords: 820, required: ["Reconcilie dia, competência e destino", "Faça uma auditoria em três documentos"] },
      { slug: "servicos-gerais-epi-vaga", minimumWords: 950, required: ["Monte uma matriz tarefa–risco–controle", "Faça um teste de entrega em quatro passos"] },
      { slug: "escala-6x1-o-que-perguntar", minimumWords: 820, required: ["Simule dois ciclos completos antes de aceitar", "Faça o teste de alteração previsível"] },
      { slug: "como-ler-holerite-descontos", minimumWords: 850, required: ["Reconstrua o líquido sem começar pelas alíquotas", "Faça um teste de continuidade entre meses"] },
      { slug: "freelancer-ou-clt-vantagens", minimumWords: 990, required: ["Faça uma simulação de noventa dias", "Defina um portão antes de mudar de regime"] },
      { slug: "documentos-admissao-emprego-maranhao", minimumWords: 980, required: ["Use um protocolo de envio em duas etapas", "Audite o primeiro dia em quatro confirmações"] }
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
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida|aprovação garantida|empresa está contratando/i);
    }
  });

});
