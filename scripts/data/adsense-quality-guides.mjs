/**
 * Pacote editorial de qualidade para preparação AdSense (evergreen).
 * Lacunas reais vs catálogo sl-local (105).
 * Persistência: scripts/persist-adsense-quality-guides.mjs (requer DATABASE_URL).
 * NÃO usar seed template adsense-editorial-*.
 *
 * publishPlan:
 * - PUBLISH_NOW: até 2 itens — status PUBLISHED na persistência
 * - SCHEDULE_DAY: 1/dia a partir de amanhã (America/Sao_Paulo)
 * - HOLD_REVIEW: FACT_REVIEW — grava como DRAFT, sem agendar
 */
export const PACKAGE_ID = "adsense-quality-guides-v1";
export const PACKAGE_TZ = "America/Sao_Paulo";
export const COVER_DIR = "/covers/adsense-quality";

export const qualityGuides = [
  {
    "slug": "objetivo-profissional-curriculo",
    "type": "GUIDE",
    "title": "Como escrever o objetivo profissional no currículo",
    "subtitle": "Uma frase clara que diga o cargo-alvo sem clichê",
    "excerpt": "Objetivo profissional curto, específico e honesto ajuda o recrutador a entender para qual vaga você está se candidatando — sem frases genéricas.",
    "seoTitle": "Objetivo profissional no currículo: como escrever",
    "metaDescription": "Aprenda a escrever um objetivo profissional objetivo, com exemplos práticos e erros comuns a evitar.",
    "primaryKeyword": "objetivo profissional curriculo",
    "searchIntent": "INFORMATIONAL",
    "section": "curriculo",
    "tags": [
      "curriculo",
      "primeiro-emprego",
      "carreira"
    ],
    "clusterHint": "Currículo",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Pessoa jovem organizando anotações ao lado de um notebook para montar o currículo",
    "coverImageCaption": "Ilustração editorial: preparação de objetivo profissional",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Editorial realistic photo, young adult at desk with notebook and paper checklist, soft window light, no text/logos",
    "localHook": "Útil para quem candidata em processos de varejo, clínicas e serviços na capital e no interior do MA.",
    "audience": "Candidatos iniciantes e em transição",
    "directAnswer": "Escreva uma frase com cargo-alvo + tipo de oportunidade + uma prova curta do que você oferece — sem clichês como “em busca de crescimento”.",
    "candidateCta": "Revise também o guia de currículo ATS e o checklist de primeiro emprego.",
    "relatedSlugs": [
      "curriculo-ats-palavras-chave-sao-luis",
      "primeiro-emprego-sao-luis-checklist"
    ],
    "aiAssisted": true,
    "publishPlan": "PUBLISH_NOW",
    "scheduleDayOffset": 0,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen. Fonte institucional ok (orientação prática, não legislação).",
    "contentHtml": "<p>O objetivo profissional não precisa ser um parágrafo longo. Na prática, recrutadores usam essa linha para confirmar se o currículo bate com a vaga aberta.</p>\n<h2>O que colocar</h2>\n<p>Use no máximo duas linhas com:</p>\n<ul>\n<li>cargo ou área-alvo;</li>\n<li>nível (primeiro emprego, auxiliar, assistente);</li>\n<li>uma prova curta (experiência informal, curso ou resultado simples).</li>\n</ul>\n<p><strong>Exemplo sólido:</strong> “Auxiliar administrativo em início de carreira, com organização de arquivos e atendimento ao público em comércio.”</p>\n<p><strong>Exemplo fraco:</strong> “Profissional dinâmico em busca de oportunidades de crescimento e novos desafios.”</p>\n<h2>Passo a passo</h2>\n<ol>\n<li>Leia o título da vaga e escreva o cargo com as mesmas palavras (só se for verdade).</li>\n<li>Corte adjetivos vazios (proativo, inovador, focado em resultados).</li>\n<li>Inclua um fato verificável: tempo de atendimento, ferramenta ou tarefa.</li>\n<li>Adapte a frase quando mudar o tipo de vaga (não use a mesma para tudo).</li>\n</ol>\n<h2>Erros comuns</h2>\n<ul>\n<li>Objetivo genérico demais.</li>\n<li>Misturar objetivo com resumo longo de toda a vida.</li>\n<li>Pedir “qualquer área” — isso reduz confiança.</li>\n</ul>\n<h2>Checklist rápido</h2>\n<ul>\n<li>Cabe em duas linhas?</li>\n<li>Cita o cargo-alvo?</li>\n<li>Tem pelo menos uma prova concreta?</li>\n<li>Faz sentido para a vaga desta semana?</li>\n</ul>\n<p>Depois do objetivo, alinhe o restante do PDF às palavras do anúncio. Veja também o guia de <a href=\"/blog/curriculo-ats-palavras-chave-sao-luis\">currículo ATS</a> e o <a href=\"/blog/primeiro-emprego-sao-luis-checklist\">checklist de primeiro emprego</a>.</p><h2>Exemplos por perfil</h2>\n<p><strong>Primeiro emprego:</strong> “Busco vaga de auxiliar de loja, com experiência em atendimento no comércio e disponibilidade para finais de semana.”</p>\n<p><strong>Transição de área:</strong> “Assistente administrativo em transição do atendimento, com organização de agenda e domínio de planilhas.”</p>\n<p><strong>Recolocação:</strong> “Operador de caixa com prática em fechamento de turno e meta de fila, disponível para escala 6x1.”</p>\n<h2>Onde posicionar no PDF</h2>\n<p>Coloque o objetivo abaixo do nome e do contato, antes da experiência. Se o formulário online não tiver campo “objetivo”, use a mesma frase no e-mail de candidatura ou na mensagem inicial.</p>\n<p>Revise a frase toda vez que mudar o tipo de vaga. Manter um objetivo genérico “para qualquer área” costuma reduzir a chance de leitura completa do currículo.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Quando vale omitir o campo</h2><p>Em formulários online muito curtos, priorize experiências e competências. Se houver campo livre, use a frase de objetivo. Em PDF de uma página para vaga específica, o objetivo bem escrito ainda ajuda o olhar rápido do recrutador.</p><h2>Resumo</h2><p>Objetivo = cargo-alvo + prova curta. Sem clichê. Adapte por vaga. Alinhe ao restante do currículo e aos guias de ATS e primeiro emprego.</p>"
  },
  {
    "slug": "perguntas-comuns-entrevista-emprego",
    "type": "GUIDE",
    "title": "Perguntas comuns em entrevista de emprego (e como responder)",
    "subtitle": "Prepare respostas curtas com situação, ação e resultado",
    "excerpt": "Liste das perguntas mais frequentes em entrevistas e um método simples para responder sem decorar texto robótico.",
    "seoTitle": "Perguntas comuns em entrevista de emprego",
    "metaDescription": "Veja perguntas frequentes de entrevista e um roteiro prático para responder com clareza e exemplos reais.",
    "primaryKeyword": "perguntas comuns entrevista emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "entrevistas",
    "tags": [
      "entrevista",
      "carreira",
      "primeiro-emprego"
    ],
    "clusterHint": "Entrevistas",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Candidato e recrutador conversando em entrevista profissional em escritório",
    "coverImageCaption": "Ilustração editorial: entrevista de emprego",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Two people in office interview across desk, natural light, no text/logos",
    "localHook": "Serve para entrevistas presenciais e por vídeo em processos locais de atendimento, operação e administrativo.",
    "audience": "Candidatos em seleção",
    "directAnswer": "Ensaie 5–7 respostas curtas com situação, ação e resultado; não decore discurso — pratique em voz alta.",
    "candidateCta": "Combine com o guia de entrevista comportamental e segurança do candidato.",
    "relatedSlugs": [
      "entrevista-comportamental-exemplos",
      "entrevista-por-video-emprego",
      "golpe-vaga-emprego-sao-luis"
    ],
    "aiAssisted": true,
    "publishPlan": "PUBLISH_NOW",
    "scheduleDayOffset": 0,
    "scheduleTimeLocal": "11:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen prático; sem afirmações legais.",
    "contentHtml": "<p>Entrevista não é prova de memorização. O recrutador quer entender se você comunica com clareza, assume responsabilidade e entende a vaga.</p>\n<h2>Perguntas que quase sempre aparecem</h2>\n<ul>\n<li>Fale sobre você.</li>\n<li>Por que esta vaga / esta empresa?</li>\n<li>Qual seu ponto forte e o que está melhorando?</li>\n<li>Conte um problema que resolveu.</li>\n<li>Como lida com pressão ou fila de atendimento?</li>\n<li>Qual sua pretensão ou disponibilidade de escala?</li>\n<li>Tem alguma pergunta para nós?</li>\n</ul>\n<h2>Método simples de resposta</h2>\n<p>Use três partes: <strong>situação</strong> → <strong>ação</strong> → <strong>resultado</strong>. Exemplo: “Na loja, a fila aumentou no sábado (situação). Organizei prioridades e pedi apoio ao caixa (ação). Reduzimos a espera sem deixar reclamação aberta (resultado).”</p>\n<h2>Como se preparar</h2>\n<ol>\n<li>Escreva três histórias reais (prazo, cliente, erro corrigido).</li>\n<li>Ensaie em voz alta por 60–90 segundos cada.</li>\n<li>Leia o anúncio e marque requisitos que você pode provar.</li>\n<li>Prepare uma pergunta útil: escala, treinamento, próximos passos.</li>\n</ol>\n<h2>Erros comuns</h2>\n<ul>\n<li>Falar mal de emprego anterior.</li>\n<li>Resposta de 5 minutos sem foco.</li>\n<li>Inventar experiência — costuma cair na pergunta seguinte.</li>\n</ul>\n<p>Para aprofundar respostas comportamentais, leia o guia de <a href=\"/blog/entrevista-comportamental-exemplos\">entrevista comportamental</a>. Se a conversa for online, revise também a <a href=\"/blog/entrevista-por-video-emprego\">entrevista por vídeo</a>. Desconfie de processos que cobram taxa: veja <a href=\"/seguranca-candidatos\">segurança do candidato</a>.</p><h2>Como treinar sem ficar robótico</h2>\n<p>Grave um áudio de 60 segundos no celular e ouça. Se parecer discurso decorado, corte adjetivos e mantenha a cena. Peça a alguém de confiança para fazer as perguntas fora de ordem.</p>\n<h2>Perguntas que você pode fazer</h2>\n<ul>\n<li>Como é o treinamento da primeira semana?</li>\n<li>Qual a escala e o horário de pico?</li>\n<li>Quais os próximos passos e o prazo de retorno?</li>\n</ul>\n<p>Evite perguntas só sobre salário no primeiro minuto, a menos que o recrutador abra o tema. Tenha uma faixa realista pesquisada para quando a conversa chegar lá.</p>\n<p>Se a entrevista for presencial, confirme endereço e documente com quem avisou. Se for online, teste câmera, microfone e plano B de internet com antecedência.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Depois da entrevista</h2><p>Anote perguntas feitas e pontos em que travou. Isso melhora a próxima conversa. Se combinaram retorno em data X, registre no acompanhamento de candidaturas.</p><h2>Resumo</h2><p>Ensaie histórias curtas, conheça a vaga, faça uma pergunta útil e desconfie de processos que cobram taxa.</p>"
  },
  {
    "slug": "pesquisar-empresa-antes-entrevista",
    "type": "GUIDE",
    "title": "Como pesquisar uma empresa antes da entrevista",
    "subtitle": "O que verificar em 20 minutos sem inventar história",
    "excerpt": "Checklist rápido para pesquisar a empresa antes da entrevista: o que faz, canais oficiais, tom do anúncio e sinais de alerta.",
    "seoTitle": "Como pesquisar empresa antes da entrevista",
    "metaDescription": "Checklist prático para pesquisar a empresa antes da entrevista e chegar preparado — sem informações inventadas.",
    "primaryKeyword": "pesquisar empresa antes entrevista",
    "searchIntent": "INFORMATIONAL",
    "section": "entrevistas",
    "tags": [
      "entrevista",
      "seguranca",
      "carreira"
    ],
    "clusterHint": "Entrevistas",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Segurança do candidato — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/seguranca-candidatos"
      }
    ],
    "coverImageAlt": "Pessoa pesquisando informações de uma empresa no notebook antes de uma entrevista",
    "coverImageCaption": "Ilustração editorial: pesquisa pré-entrevista",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Young adult researching on laptop with notebook, focused, no readable screen text",
    "localHook": "Ajuda a filtrar processos improvisados e a preparar perguntas úteis em seleções locais.",
    "audience": "Candidatos em processo seletivo",
    "directAnswer": "Em 20 minutos: confirme o que a empresa faz, o canal oficial do contato, o endereço/horário da entrevista e se o anúncio pede pagamento — se pedir, pare.",
    "candidateCta": "Use junto com o guia de golpes e a página de segurança.",
    "relatedSlugs": [
      "golpe-vaga-emprego-sao-luis",
      "perguntas-comuns-entrevista-emprego"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 1,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Liga forte com segurança; não inventar dados de empresas.",
    "contentHtml": "<p>Pesquisar a empresa não é decorar slogan. É chegar à entrevista sabendo o essencial e reduzindo risco de processo falso.</p>\n<h2>Checklist de 20 minutos</h2>\n<ol>\n<li>O que a empresa faz? (produto/serviço em uma frase)</li>\n<li>O anúncio bate com o site ou perfil oficial?</li>\n<li>O contato usa domínio/telefone coerente com a empresa?</li>\n<li>Endereço e horário da entrevista são identificáveis?</li>\n<li>Pedem pagamento, “taxa de crachá” ou dados bancários no primeiro contato? Se sim, interrompa.</li>\n</ol>\n<h2>O que anotar</h2>\n<ul>\n<li>Uma frase sobre o negócio.</li>\n<li>Dois requisitos da vaga que você cobre.</li>\n<li>Uma pergunta sobre treinamento ou escala.</li>\n</ul>\n<h2>Sinais de alerta</h2>\n<ul>\n<li>Urgência artificial (“precisa pagar hoje”).</li>\n<li>Entrevista só por mensagem, sem dados verificáveis.</li>\n<li>Pedido de selfie com documento no primeiro “oi”.</li>\n</ul>\n<p>Para sinais de golpe, leia <a href=\"/blog/golpe-vaga-emprego-sao-luis\">como identificar vaga falsa</a> e a página de <a href=\"/seguranca-candidatos\">segurança do candidato</a>. Depois, ensaie respostas com o guia de <a href=\"/blog/perguntas-comuns-entrevista-emprego\">perguntas comuns</a>.</p><h2>Fontes confiáveis para checar</h2>\n<ul>\n<li>Site oficial ou perfil institucional da empresa</li>\n<li>Anúncio original (não só o encaminhamento no WhatsApp)</li>\n<li>CNPJ/razão social quando disponíveis em canais oficiais</li>\n<li>Mapa e referência do endereço da entrevista</li>\n</ul>\n<h2>O que NÃO fazer</h2>\n<p>Não invente “pesquisa” na entrevista. Se não achou informação, diga com honestidade o que confirmou e faça uma pergunta sincera sobre o produto ou o público atendido.</p>\n<p>Também não publique dados sensíveis do processo em redes. Guarde prints de conversas suspeitas e use a página de segurança do portal para denúncia/orientação.</p>\n<p>Uma boa pesquisa cabe em uma folha: nome da empresa, o que faz, dois requisitos alinhados a você e um sinal de alerta (ou a ausência dele).</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p>\n\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Resumo</h2><p>Vinte minutos bastam para confirmar o básico e reduzir risco. Anote o que a empresa faz, valide o canal e interrompa se pedirem pagamento. Chegue à entrevista com uma pergunta concreta.</p>"
  },
  {
    "slug": "acompanhar-candidatura-emprego",
    "type": "GUIDE",
    "title": "Como acompanhar uma candidatura sem insistir demais",
    "subtitle": "Registro simples, prazo razoável e mensagem curta",
    "excerpt": "Organize candidaturas em uma planilha simples e saiba quando e como pedir retorno sem parecer spam.",
    "seoTitle": "Como acompanhar candidatura de emprego",
    "metaDescription": "Método prático para acompanhar candidaturas: registro, prazos e modelo de mensagem de follow-up.",
    "primaryKeyword": "acompanhar candidatura emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "candidatura",
    "tags": [
      "candidatura",
      "carreira",
      "organizacao"
    ],
    "clusterHint": "Carreira",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Pessoa organizando agenda e anotações para acompanhar candidaturas de emprego",
    "coverImageCaption": "Ilustração editorial: acompanhamento de candidaturas",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Person with notebook tracker and phone calendar, morning light, no readable text",
    "localHook": "Útil quando você se candidata a várias vagas na mesma semana e precisa lembrar canais e datas.",
    "audience": "Candidatos ativos",
    "directAnswer": "Anote data, empresa, canal e status; espere o prazo informado (ou ~5–7 dias úteis) e envie um follow-up curto e educado.",
    "candidateCta": "Combine com organização da busca e segurança contra golpes.",
    "relatedSlugs": [
      "produtividade-busca-emprego-sao-luis",
      "organizar-busca-emprego"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 2,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen operacional.",
    "contentHtml": "<p>Candidatar sem registro vira ansiedade: você não sabe o que já enviou nem quando pode cobrar retorno.</p>\n<h2>Planilha mínima</h2>\n<p>Colunas suficientes:</p>\n<ul>\n<li>data;</li>\n<li>empresa e cargo;</li>\n<li>canal (e-mail, formulário, WhatsApp);</li>\n<li>status (enviado, entrevista, aguardando, encerrado);</li>\n<li>próximo passo e data.</li>\n</ul>\n<h2>Quando pedir retorno</h2>\n<ol>\n<li>Se o anúncio deu prazo, respeite-o.</li>\n<li>Se não deu, espere cerca de 5 a 7 dias úteis.</li>\n<li>Envie uma mensagem curta: nome, vaga, data do envio, disponibilidade.</li>\n<li>Se não houver resposta após um segundo contato educado, siga em frente.</li>\n</ol>\n<h2>Modelo curto</h2>\n<p>“Olá, me candidatei à vaga de [cargo] em [data]. Segue meu interesse e disponibilidade para conversar. Obrigado(a).”</p>\n<h2>Erros comuns</h2>\n<ul>\n<li>Cobrar todo dia.</li>\n<li>Mensagens longas com currículo em texto.</li>\n<li>Misturar várias vagas no mesmo follow-up.</li>\n</ul>\n<p>Para ritmo sustentável de busca, veja <a href=\"/blog/organizar-busca-emprego\">como organizar a busca de emprego</a> e o guia de <a href=\"/blog/produtividade-busca-emprego-sao-luis\">produtividade na busca</a>.</p><h2>Ferramentas simples</h2>\n<p>Planilha, bloco de notas ou aplicativo de tarefas bastam. O importante é abrir o registro todo dia no mesmo horário. Sem ferramenta perfeita, o hábito não se sustenta.</p>\n<h2>Quando encerrar uma candidatura</h2>\n<p>Se passaram duas tentativas educadas de contato e o prazo do anúncio expirou, marque como encerrada. Continuar cobrando não aumenta chance — só gasta energia.</p>\n<p>Guarde o que aprendeu: cargos que respondem mais, canais que funcionam e erros de formulário (anexo pesado, campo obrigatório esquecido).</p>\n<p>Se receber proposta, compare salário, deslocamento, escala e benefícios antes de aceitar. Pressa artificial é sinal para respirar e revisar a segurança do processo.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p>\n\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Resumo</h2><p>Registre, espere o prazo, faça follow-up curto e encerre o que não responde. Organização reduz ansiedade e evita cobrança excessiva.</p>"
  },
  {
    "slug": "linkedin-primeiro-emprego",
    "type": "GUIDE",
    "title": "Como usar o LinkedIn no primeiro emprego",
    "subtitle": "Perfil honesto, headline clara e networking sem spam",
    "excerpt": "Guia para quem está começando: o que colocar no LinkedIn sem inventar experiência e como pedir indicação com respeito.",
    "seoTitle": "LinkedIn para o primeiro emprego",
    "metaDescription": "Monte um LinkedIn útil no primeiro emprego: headline, experiências honestas e mensagens curtas sem spam.",
    "primaryKeyword": "linkedin primeiro emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "primeiro-emprego",
    "tags": [
      "linkedin",
      "primeiro-emprego",
      "curriculo"
    ],
    "clusterHint": "Primeiro emprego",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Jovem adulto montando perfil profissional em notebook para busca do primeiro emprego",
    "coverImageCaption": "Ilustração editorial: LinkedIn para iniciantes",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Young adult creating professional profile on laptop, clean desk, no UI text/logos",
    "localHook": "Complementa o perfil local: use o mesmo nome e telefone do currículo enviado em São Luís/MA.",
    "audience": "Iniciantes",
    "directAnswer": "Headline com cargo-alvo, sobre com provas honestas (estágio, voluntariado, comércio) e mensagens curtas pedindo conversa — não “vaga urgente”.",
    "candidateCta": "Alinhe LinkedIn ao PDF e ao checklist de primeiro emprego.",
    "relatedSlugs": [
      "linkedin-emprego-sao-luis-perfil",
      "primeiro-emprego-sao-luis-checklist",
      "objetivo-profissional-curriculo"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 3,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Não confundir com guia LinkedIn já existente (perfil SLZ); foco 1º emprego.",
    "contentHtml": "<p>No primeiro emprego, LinkedIn não precisa parecer senior. Precisa ser coerente, encontrável e honesto.</p>\n<h2>O essencial do perfil</h2>\n<ul>\n<li>Foto simples e nítida (se for usar).</li>\n<li>Headline com cargo-alvo: “Auxiliar administrativo | atendimento e organização”.</li>\n<li>Sobre em 4–6 linhas com o que você já fez de fato.</li>\n<li>Experiências: estágio, jovem aprendiz, comércio, freela ou voluntariado — com tarefas concretas.</li>\n</ul>\n<h2>Mensagem sem spam</h2>\n<p>Evite “preciso de emprego urgente”. Prefira: quem você é, o cargo-alvo e um PDF leve se pedirem.</p>\n<h2>Checklist</h2>\n<ul>\n<li>Nome igual ao currículo.</li>\n<li>Telefone e e-mail atualizados.</li>\n<li>Sem exagero de cargos.</li>\n<li>Uma publicação ou comentário útil por semana (opcional).</li>\n</ul>\n<p>Para perfil voltado a vagas na capital, veja também <a href=\"/blog/linkedin-emprego-sao-luis-perfil\">LinkedIn para vagas em São Luís</a>. Monte o objetivo do PDF com <a href=\"/blog/objetivo-profissional-curriculo\">objetivo profissional</a> e o <a href=\"/blog/primeiro-emprego-sao-luis-checklist\">checklist de primeiro emprego</a>.</p><h2>Experiência sem carteira</h2>\n<p>Descreva tarefas reais: “organizei estoque”, “atendi balcão”, “ajudei em eventos da escola”. Evite títulos inflados. Quem entrevista costuma pedir exemplos — inventar atrapalha.</p>\n<h2>Rede sem constrangimento</h2>\n<p>Conecte-se a colegas de curso, professores e pessoas da área-alvo com nota curta. Não peça emprego na primeira mensagem. Peça conversa de 10 minutos ou indicação de onde acompanhar vagas.</p>\n<p>Mantenha o mesmo telefone do currículo. Desative status que contradiz a imagem profissional. Se não quiser foto, priorize headline e sobre bem escritos.</p>\n<p>Atualize o perfil quando mudar o cargo-alvo. Um LinkedIn parado com objetivo antigo confunde recrutadores tanto quanto um PDF desatualizado.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p>\n\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Resumo</h2><p>Headline clara, sobre honesto, experiências reais e mensagem respeitosa. Mantenha coerência com o currículo em PDF.</p>"
  },
  {
    "slug": "jovem-aprendiz-como-funciona",
    "type": "GUIDE",
    "title": "Jovem Aprendiz: como funciona (guia prático)",
    "subtitle": "O que é o contrato de aprendizagem e o que conferir na prática",
    "excerpt": "Explicação prática sobre Jovem Aprendiz, com remissão à legislação oficial. Confirme sempre regras atuais em fontes do governo.",
    "seoTitle": "Jovem Aprendiz: como funciona",
    "metaDescription": "Entenda o básico do Jovem Aprendiz e onde consultar a regra oficial. Guia prático para candidatos e famílias.",
    "primaryKeyword": "jovem aprendiz como funciona",
    "searchIntent": "INFORMATIONAL",
    "section": "jovem-aprendiz",
    "tags": [
      "jovem-aprendiz",
      "primeiro-emprego",
      "direitos"
    ],
    "clusterHint": "Jovem Aprendiz",
    "pillarHint": "Carreira",
    "sourceName": "Lei do Aprendiz (Lei 10.097/2000) — Planalto",
    "sourceUrl": "https://www.planalto.gov.br/ccivil_03/leis/l10097.htm",
    "sources": [
      {
        "name": "Lei nº 10.097/2000 (Planalto)",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l10097.htm"
      },
      {
        "name": "Ministério do Trabalho e Emprego",
        "url": "https://www.gov.br/trabalho-e-emprego/pt-br"
      }
    ],
    "coverImageAlt": "Jovem em ambiente de trabalho aprendendo com supervisão em atividade profissional",
    "coverImageCaption": "Ilustração editorial: aprendizagem profissional",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Young apprentice learning with supervisor in workplace, daylight, no logos/text",
    "localHook": "Candidatos no MA devem confirmar idade, escolaridade e vaga com a empresa e a instituição de ensino parceira.",
    "audience": "Jovens e responsáveis",
    "directAnswer": "Jovem Aprendiz é contrato de aprendizagem previsto em lei: combine trabalho e formação. Confira idade, curso e condições no anúncio e nas fontes oficiais.",
    "candidateCta": "Compare com estágio e prepare documentos de admissão.",
    "relatedSlugs": [
      "estagio-x-jovem-aprendiz",
      "documentos-admissao-emprego-maranhao",
      "primeiro-emprego-sao-luis-checklist"
    ],
    "aiAssisted": true,
    "publishPlan": "HOLD_REVIEW",
    "scheduleDayOffset": null,
    "scheduleTimeLocal": null,
    "editorialStage": "FACT_REVIEW",
    "internalNotes": "Factual: fontes oficiais. Não inventar cotas/%; orientar consulta ao gov.br/planalto. | HOLD: exige revisão humana factual antes de publicar/agendar. Fontes Planalto validadas por URL; não marcar reviewedAt sem humano.",
    "contentHtml": "<p>O contrato de aprendizagem (Jovem Aprendiz) é uma forma legal de ingressar no mercado com formação teórica e prática. Este guia é prático e <strong>não substitui</strong> a leitura da norma oficial.</p>\n<h2>O que é, em termos simples</h2>\n<p>É um contrato especial de trabalho voltado à formação profissional, com acompanhamento de instituição de ensino habilitada e regras próprias definidas em lei.</p>\n<h2>O que conferir antes de aceitar</h2>\n<ol>\n<li>Idade e escolaridade exigidas no anúncio.</li>\n<li>Se há instituição de ensino/formação citada.</li>\n<li>Jornada, local e remuneração informadas com clareza.</li>\n<li>Se o processo é gratuito (não pague para “garantir vaga”).</li>\n</ol>\n<h2>Fontes oficiais para consultar</h2>\n<ul>\n<li><a href=\"https://www.planalto.gov.br/ccivil_03/leis/l10097.htm\" rel=\"noopener noreferrer\">Lei nº 10.097/2000 (Planalto)</a></li>\n<li><a href=\"https://www.gov.br/trabalho-e-emprego/pt-br\" rel=\"noopener noreferrer\">Ministério do Trabalho e Emprego</a></li>\n</ul>\n<p>Regras, faixas etárias e obrigações podem ter detalhes atualizados — valide sempre no texto oficial e nos canais do governo.</p>\n<h2>Erros comuns</h2>\n<ul>\n<li>Assinar sem entender horário de aula × trabalho.</li>\n<li>Entregar documentos sensíveis por canal duvidoso.</li>\n<li>Confundir aprendiz com estágio (são regimes diferentes).</li>\n</ul>\n<p>Compare os caminhos em <a href=\"/blog/estagio-x-jovem-aprendiz\">Estágio × Jovem Aprendiz</a>. Para pasta de documentos, veja <a href=\"/blog/documentos-admissao-emprego-maranhao\">documentos de admissão</a>.</p><h2>Documentos e conversa com a família</h2>\n<p>Antes da inscrição, alinhe horários de aula, deslocamento e autorização responsável quando aplicável. Leve documentos organizados e desconfie de intermediários que cobram “taxa de garantia”.</p>\n<h2>Direitos e deveres (visão geral)</h2>\n<p>Aprendizagem combina formação e trabalho sob regras específicas. Não trate como “emprego qualquer”. Leia o contrato, tire dúvidas por escrito e confirme a instituição de ensino parceira.</p>\n<p>Valores, jornada e requisitos etários devem ser confirmados nas fontes oficiais listadas acima — este guia não substitui a lei nem o edital da vaga.</p>\n<p>Se o anúncio misturar termos de estágio e aprendiz, peça esclarecimento. Aceitar o regime errado gera frustração na primeira semana.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p>\n\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Resumo</h2><p>Aprendizagem é regime próprio com base legal. Confirme anúncio, instituição e contrato. Consulte Planalto e Ministério do Trabalho. Não pague para “garantir” vaga.</p>"
  },
  {
    "slug": "estagio-x-jovem-aprendiz",
    "type": "GUIDE",
    "title": "Estágio × Jovem Aprendiz: diferenças práticas",
    "subtitle": "Como não confundir os dois caminhos de início de carreira",
    "excerpt": "Compare estágio e Jovem Aprendiz em linguagem simples e saiba o que perguntar antes de aceitar. Consulte fontes oficiais para regras atuais.",
    "seoTitle": "Estágio ou Jovem Aprendiz: diferenças",
    "metaDescription": "Diferenças práticas entre estágio e Jovem Aprendiz, com links para bases legais oficiais.",
    "primaryKeyword": "estagio ou jovem aprendiz",
    "searchIntent": "INFORMATIONAL",
    "section": "jovem-aprendiz",
    "tags": [
      "estagio",
      "jovem-aprendiz",
      "primeiro-emprego"
    ],
    "clusterHint": "Jovem Aprendiz",
    "pillarHint": "Carreira",
    "sourceName": "Lei do Estágio (Lei 11.788/2008) — Planalto",
    "sourceUrl": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm",
    "sources": [
      {
        "name": "Lei nº 11.788/2008 — Estágio (Planalto)",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm"
      },
      {
        "name": "Lei nº 10.097/2000 — Aprendiz (Planalto)",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l10097.htm"
      }
    ],
    "coverImageAlt": "Dois jovens em contextos profissionais distintos, sugerindo caminhos de estágio e aprendizagem",
    "coverImageCaption": "Ilustração editorial: caminhos de início de carreira",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Two young adults in different workplace contexts, natural light, no logos/text",
    "localHook": "Ajuda estudantes e famílias a escolher o caminho certo sem cair em anúncio confuso.",
    "audience": "Estudantes e iniciantes",
    "directAnswer": "Estágio e aprendizagem são regimes diferentes: verifique matrícula/curso, tipo de contrato e direitos no anúncio e na lei oficial.",
    "candidateCta": "Leia o guia do aprendiz e prepare documentos.",
    "relatedSlugs": [
      "jovem-aprendiz-como-funciona",
      "documentos-admissao-emprego-maranhao"
    ],
    "aiAssisted": true,
    "publishPlan": "HOLD_REVIEW",
    "scheduleDayOffset": null,
    "scheduleTimeLocal": null,
    "editorialStage": "FACT_REVIEW",
    "internalNotes": "Factual comparativo; remeter às leis oficiais sem inventar percentuais. | HOLD: exige revisão humana factual antes de publicar/agendar. Fontes Planalto validadas por URL; não marcar reviewedAt sem humano.",
    "contentHtml": "<p>Anúncios às vezes misturam “estágio” e “aprendiz”. São caminhos distintos. Use este quadro prático e confirme detalhes nas leis oficiais.</p>\n<h2>Diferenças que importam no dia a dia</h2>\n<ul>\n<li><strong>Vínculo e regras:</strong> cada um tem lei própria — não assuma que benefícios são iguais.</li>\n<li><strong>Estudo:</strong> estágio exige vínculo com instituição de ensino; aprendizagem também envolve formação, com desenho próprio.</li>\n<li><strong>Objetivo:</strong> ambos formam, mas com obrigações e limites diferentes para empresa e estudante.</li>\n</ul>\n<h2>Perguntas antes de aceitar</h2>\n<ol>\n<li>Qual o regime exatamente (estágio ou aprendiz)?</li>\n<li>Qual a carga horária e como combina com a aula?</li>\n<li>Quem assina o termo/contrato e quem supervisiona?</li>\n<li>O processo é gratuito?</li>\n</ol>\n<h2>Consulte a base legal</h2>\n<ul>\n<li><a href=\"https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm\" rel=\"noopener noreferrer\">Lei do Estágio (11.788/2008)</a></li>\n<li><a href=\"https://www.planalto.gov.br/ccivil_03/leis/l10097.htm\" rel=\"noopener noreferrer\">Lei do Aprendiz (10.097/2000)</a></li>\n</ul>\n<p>Detalhes de bolsa, recreio, férias e encargos devem ser confirmados no texto oficial e no contrato. Continue em <a href=\"/blog/jovem-aprendiz-como-funciona\">Jovem Aprendiz: como funciona</a>.</p><h2>Quando cada caminho costuma fazer sentido</h2>\n<p><strong>Estágio:</strong> em geral ligado a curso e termo de compromisso com instituição de ensino.</p>\n<p><strong>Aprendiz:</strong> contrato de aprendizagem com formação estruturada e regras próprias.</p>\n<p>Não escolha só pelo nome “mais bonito”. Escolha pelo que o contrato diz sobre horário, remuneração/bolsa, duração e supervisão.</p>\n<h2>Checklist de leitura do anúncio</h2>\n<ul>\n<li>Palavra exata do regime</li>\n<li>Carga horária</li>\n<li>Local e deslocamento</li>\n<li>Documentos pedidos</li>\n<li>Canal oficial de inscrição</li>\n</ul>\n<p>Em dúvida, consulte a lei no Planalto e pergunte RH/instituição antes de enviar documentos sensíveis. Evite processos que pressionam pagamento imediato.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p>\n\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Resumo</h2><p>Estágio e aprendiz não são sinônimos. Leia o regime no anúncio, compare com as leis oficiais e tire dúvidas antes de enviar documentos.</p>"
  },
  {
    "slug": "organizar-busca-emprego",
    "type": "GUIDE",
    "title": "Como organizar uma busca de emprego de verdade",
    "subtitle": "Rotina semanal, metas realistas e menos ansiedade",
    "excerpt": "Monte uma rotina semanal de busca de emprego com metas realistas, registro de candidaturas e revisão do que funciona.",
    "seoTitle": "Como organizar a busca de emprego",
    "metaDescription": "Rotina prática para organizar a busca de emprego: blocos de tempo, metas e revisão semanal.",
    "primaryKeyword": "organizar busca de emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "carreira",
    "tags": [
      "organizacao",
      "candidatura",
      "carreira"
    ],
    "clusterHint": "Carreira",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Pessoa planejando a semana de busca de emprego com anotações em mesa organizada",
    "coverImageCaption": "Ilustração editorial: rotina de busca de emprego",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Person organizing weekly job search plan on tidy desk, daylight, no readable text",
    "localHook": "Funciona tanto para quem busca vagas na capital quanto no interior — o método é o mesmo.",
    "audience": "Candidatos ativos",
    "directAnswer": "Defina blocos curtos diários, meta de candidaturas bem lidas (não em massa) e uma revisão semanal do que gerou retorno.",
    "candidateCta": "Use com acompanhamento de candidatura e currículo atualizado.",
    "relatedSlugs": [
      "produtividade-busca-emprego-sao-luis",
      "acompanhar-candidatura-emprego",
      "objetivo-profissional-curriculo"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 4,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen; diferencia do guia de produtividade já existente pelo foco em sistema semanal.",
    "contentHtml": "<p>Busca desorganizada cansa: dezenas de abas, zero registro e sensação de “não avançou”. Organização vence volume cego.</p>\n<h2>Rotina sugerida (ajuste à sua vida)</h2>\n<ul>\n<li><strong>Segunda:</strong> atualizar currículo e lista de cargos-alvo.</li>\n<li><strong>Terça a quinta:</strong> 45–60 minutos de candidaturas bem lidas.</li>\n<li><strong>Sexta:</strong> follow-ups e revisão do que respondeu.</li>\n<li><strong>Fim de semana (opcional):</strong> um curso curto ou portfólio, não maratona.</li>\n</ul>\n<h2>Metas realistas</h2>\n<p>Prefira 3 a 5 candidaturas bem adaptadas por dia a 30 envios genéricos. Qualidade reduz frustração e aumenta chance de conversa.</p>\n<h2>Revisão semanal</h2>\n<ol>\n<li>Quantas respostas/entrevistas?</li>\n<li>Quais cargos geraram retorno?</li>\n<li>O PDF está alinhado aos anúncios?</li>\n<li>Há processos suspeitos na lista? Elimine.</li>\n</ol>\n<p>Detalhe o acompanhamento em <a href=\"/blog/acompanhar-candidatura-emprego\">como acompanhar candidatura</a>. Para ritmo diário, veja <a href=\"/blog/produtividade-busca-emprego-sao-luis\">produtividade na busca</a> e ajuste o <a href=\"/blog/objetivo-profissional-curriculo\">objetivo profissional</a>.</p><h2>Ambiente de trabalho da busca</h2>\n<p>Separe uma pasta digital: currículo PDF, documentos, prints de anúncios e planilha. Nomeie arquivos com cargo e data. Isso reduz erro de envio e retrabalho.</p>\n<h2>Sinais de que a rotina está funcionando</h2>\n<ul>\n<li>Você sabe quantas candidaturas fez na semana</li>\n<li>Há follow-ups agendados</li>\n<li>O PDF mudou pelo menos uma vez conforme feedback</li>\n<li>Você eliminou processos suspeitos rapidamente</li>\n</ul>\n<p>Se estiver exausto, reduza volume e aumente qualidade. Busca sustentável supera maratona de domingo seguida de abandono na terça.</p>\n<p>Combine a rotina com segurança: nenhum processo legítimo exige pagamento para candidatar. Em caso de dúvida, pause e revise a página de segurança do portal.</p>\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p>\n\n<h2>Resumo prático</h2>\n<p>Guarde este conteúdo como referência e volte a ele quando for candidatar. Ajuste exemplos à sua realidade — não copie trechos que não sejam verdadeiros sobre você.</p>\n<p>Se notar contradição entre um anúncio e o que foi dito na conversa, peça confirmação por escrito antes de aceitar. Transparência protege candidato e empresa.</p>\n<p>Continue navegando pelos guias relacionados no blog e pelas páginas institucionais do portal (redação, política editorial e segurança) para manter uma busca de emprego mais segura e organizada.</p><h2>Resumo</h2><p>Rotina curta, candidaturas bem lidas, planilha e revisão semanal. Qualidade acima de volume. Segurança acima de pressa.</p>"
  }
];

export function coverPathFor(slug) {
  return `${COVER_DIR}/${slug}.webp`;
}

export function isHoldReview(guide) {
  return guide.publishPlan === "HOLD_REVIEW" || guide.editorialStage === "FACT_REVIEW";
}
