/**
 * Catálogo de 45 peças editoriais locais (São Luís / Grande Ilha).
 * Usado por generate-sl-local-covers.mjs e seed-local-editorial-schedule.mjs.
 */
export const SLUG_BASE = "sl-local";
export const MIN_USEFUL_CHARS = 2400;

/** @typedef {{
 *  key: string;
 *  title: string;
 *  type: "NEWS"|"GUIDE"|"DATA_REPORT";
 *  template: "POST_MAGNETICO"|"STANDARD";
 *  keyword: string;
 *  section: string;
 *  lead: string;
 *  tips: string[];
 *  localAngle: string;
 *  coverHue: number;
 * }} CatalogItem */

/** @type {CatalogItem[]} */
export const catalog = [
  {
    key: "01-golpe-vagas",
    title: "Como buscar vagas em São Luís sem cair em golpe",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "vagas sao luis golpe",
    section: "guia",
    lead: "Golpes de emprego na Grande Ilha costumam pedir taxa, kit ou depósito antes de qualquer entrevista. Este guia mostra sinais de alerta e um roteiro seguro de candidatura no portal.",
    tips: [
      "Nunca pague para “garantir” vaga, uniforme ou cadastro em banco de talentos.",
      "Confira se a empresa ou intermediário aparece de forma identificável no anúncio.",
      "Desconfie de pedidos de selfie com documento ou dados bancários no primeiro contato.",
      "Prefira canais oficiais da publicação: e-mail, WhatsApp ou link listados na vaga.",
      "Guarde prints se algo parecer irregular e interrompa a conversa.",
      "Compare a oferta com vagas semelhantes de comércio, atendimento e serviços na ilha."
    ],
    localAngle: "Em São Luís, pedidos de “taxa de liberação” por WhatsApp em grupos fechados são um padrão recorrente de abuso.",
    coverHue: 8
  },
  {
    key: "02-clt-temporario",
    title: "CLT ou temporário na Grande Ilha: o que comparar antes de candidatar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "clt temporario sao luis",
    section: "guia",
    lead: "A escolha entre CLT e contrato temporário muda férias, estabilidade e planejamento financeiro. Veja o que perguntar antes de aceitar uma proposta local.",
    tips: [
      "Peça clareza sobre tipo de contrato, carga horária e local de trabalho.",
      "Compare benefícios anunciados com o que realmente consta na descrição.",
      "Temporário pode fazer sentido para ganhar experiência rápida no comércio da ilha.",
      "CLT costuma oferecer mais previsibilidade de direitos — confirme no ato da admissão.",
      "Anote o código da vaga no Empregos São Luís para acompanhar a origem do anúncio.",
      "Se a resposta for evasiva sobre contrato, trate como sinal de atenção."
    ],
    localAngle: "No mercado da capital maranhense, muitos anúncios misturam linguagem de CLT e “ajuda temporária” — exija definição por escrito.",
    coverHue: 22
  },
  {
    key: "03-bairros-oportunidades",
    title: "Bairros e eixos com mais movimentação de vagas em São Luís",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "vagas por bairro sao luis",
    section: "dados",
    lead: "Nem todo bairro concentra o mesmo tipo de oportunidade. Este panorama ajuda a priorizar deslocamento e busca conforme comércio, serviços e corredores da ilha.",
    tips: [
      "Corredores comerciais costumam pedir atendimento, caixa e estoque.",
      "Áreas de serviços concentram limpeza, manutenção e apoio administrativo.",
      "Avalie tempo de deslocamento no horário de pico, não só a distância no mapa.",
      "Use filtros de cidade e, quando houver, bairro nas buscas do portal.",
      "Combine busca online com observação de placas e indicações confiáveis.",
      "Registre em uma planilha simples: bairro, cargo, canal e data da candidatura."
    ],
    localAngle: "Quem mora longe do Centro ou da orla precisa incluir ônibus e chuva no cálculo da pontualidade.",
    coverHue: 36
  },
  {
    key: "04-curriculo-atendimento",
    title: "Currículo para vagas de atendimento no Maranhão",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "curriculo atendimento maranhao",
    section: "guia",
    lead: "Vagas de atendimento valorizam comunicação clara, organização e disponibilidade. Monte um currículo de uma página focado no que o comércio e serviços locais pedem.",
    tips: [
      "Coloque telefone com WhatsApp e e-mail profissional no topo.",
      "Liste experiências com verbos de ação: atendeu, organizou, resolveu, apoiou.",
      "Destaque disponibilidade de horário e experiência com público, mesmo informal.",
      "Evite blocos longos; use bullets curtos e legíveis no celular.",
      "Não invente cargos — descreva tarefas reais com honestidade.",
      "Leve uma cópia impressa para entrevistas presenciais na capital."
    ],
    localAngle: "Em lojas e clínicas de São Luís, o currículo costuma ser lido rápido: clareza vence design exagerado.",
    coverHue: 48
  },
  {
    key: "05-whatsapp-seguro",
    title: "WhatsApp na candidatura: como se apresentar com segurança",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "candidatura whatsapp sao luis",
    section: "guia",
    lead: "Muitas vagas locais usam WhatsApp como canal. Uma mensagem objetiva aumenta retorno e reduz risco de exposição indevida de dados.",
    tips: [
      "Comece com nome completo, cargo da vaga e onde viu o anúncio.",
      "Envie currículo em PDF ou link — evite fotos ilegíveis de papel amassado.",
      "Não mande áudios longos no primeiro contato.",
      "Não compartilhe senha, código de banco ou foto de documento sem necessidade clara.",
      "Se pedirem pagamento pelo chat, encerre a conversa.",
      "Mantenha o tom educado e profissional, mesmo em conversa informal."
    ],
    localAngle: "No Maranhão, WhatsApp é comum — e por isso também é o canal preferido de quem aplica golpe.",
    coverHue: 62
  },
  {
    key: "06-primeiro-emprego",
    title: "Primeiro emprego em São Luís: passos práticos nesta semana",
    type: "NEWS",
    template: "STANDARD",
    keyword: "primeiro emprego sao luis",
    section: "noticias",
    lead: "Quem busca a primeira oportunidade precisa de rotina, documentos básicos e candidaturas realistas. Veja um plano de sete dias para a capital.",
    tips: [
      "Dia 1–2: organize RG, CPF e comprovante de residência.",
      "Dia 3: monte currículo simples com formação e atividades escolares ou voluntárias.",
      "Dia 4–5: candidate-se a 5–8 vagas alinhadas ao seu perfil.",
      "Dia 6: treine apresentação de um minuto em voz alta.",
      "Dia 7: revise canais e responda retornos com objetividade.",
      "Peça indicação apenas a pessoas de confiança, sem pagar intermediário."
    ],
    localAngle: "Jovens da Grande Ilha costumam competir por vagas de auxiliar e atendimento — consistência diária conta mais que “sorte”.",
    coverHue: 78
  },
  {
    key: "07-presencial-hibrido",
    title: "Vagas presenciais versus híbridas na capital maranhense",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas presenciais sao luis",
    section: "guia",
    lead: "Modalidade de trabalho muda custo de transporte, rotina e equipamento. Saiba o que confirmar no anúncio antes de se candidatar.",
    tips: [
      "Confirme se o presencial é diário ou só em alguns dias.",
      "Pergunte sobre auxílio ou política de home office, se houver.",
      "Calcule passagem e tempo de deslocamento na semana típica.",
      "Híbrido exige disciplina e internet estável — seja honesto sobre isso.",
      "Desconfie de “100% remoto” com salário irreal e seleção só por PIX.",
      "Registre a modalidade no seu controle de candidaturas."
    ],
    localAngle: "Em São Luís, a maioria das vagas de comércio e serviços continua presencial — planeje o trajeto.",
    coverHue: 92
  },
  {
    key: "08-documentos-admissao",
    title: "Documentos que empresas pedem com frequência no MA",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "documentos admissao maranhao",
    section: "guia",
    lead: "Ter a pasta de documentos pronta acelera a admissão e evita corrida de última hora. Lista prática do que costuma ser pedido em São Luís.",
    tips: [
      "RG ou CNH, CPF e comprovante de residência atualizado.",
      "Título de eleitor e comprovantes quando a função exigir.",
      "Dados bancários só na etapa formal de admissão.",
      "Certificados de cursos relevantes ao cargo, se tiver.",
      "Nunca envie documentos sensíveis a desconhecidos sem validar a empresa.",
      "Guarde cópias digitais organizadas em pasta no celular ou nuvem."
    ],
    localAngle: "Processos locais de comércio e serviços pedem pasta completa — atrase menos quem já chega organizado.",
    coverHue: 108
  },
  {
    key: "09-ler-vaga",
    title: "Como ler uma vaga e evitar descrição enganosa",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "ler vaga emprego",
    section: "guia",
    lead: "Título bonito não basta. Aprenda a cruzar requisitos, benefícios e canal de contato para não perder tempo com anúncio fraco.",
    tips: [
      "Leia requisitos obrigatórios e diferencie do que é “diferencial”.",
      "Confira cidade, bairro e horário — omitidos demais é sinal de atenção.",
      "Benefícios vagos (“ótimo ambiente”) sem detalhe merecem pergunta.",
      "Veja se o canal de candidatura é coerente com o porte da empresa.",
      "Compare salário anunciado com funções semelhantes no portal.",
      "Se a descrição parecer copiada de outro estado, peça contexto local."
    ],
    localAngle: "Anúncios genéricos sem referência a São Luís ou ao MA costumam gerar frustração na entrevista.",
    coverHue: 124
  },
  {
    key: "10-rotina-30min",
    title: "Rotina de busca: 30 minutos por dia em São Luís",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "rotina busca emprego",
    section: "guia",
    lead: "Busca irregular cansa e rende pouco. Uma rotina curta e diária costuma gerar mais entrevistas do que maratonas semanais.",
    tips: [
      "10 minutos: abrir novas vagas e filtrar por perfil.",
      "10 minutos: candidatar-se com mensagem e currículo atualizados.",
      "10 minutos: anotar retornos e próximos passos.",
      "Defina horário fixo para não depender de “quando der”.",
      "Evite candidatar-se a dezenas de vagas sem leitura.",
      "Reserve um dia da semana só para revisar o currículo."
    ],
    localAngle: "Entre deslocamentos na ilha e afazeres, 30 minutos consistentes cabem melhor que sessões longas e raras.",
    coverHue: 140
  },
  {
    key: "11-cursos-entrevistas",
    title: "Cursos gratuitos e preparação para entrevistas locais",
    type: "NEWS",
    template: "STANDARD",
    keyword: "cursos gratuitos emprego sao luis",
    section: "noticias",
    lead: "Capacitação curta e treino de entrevista melhoram confiança. Priorize conteúdo aplicável a atendimento, pacote office básico e postura profissional.",
    tips: [
      "Escolha um curso alinhado ao cargo que você busca agora.",
      "Anote três aprendizados e cite-os na entrevista com exemplo.",
      "Treine respostas para: “fale de você”, disponibilidade e experiência.",
      "Evite acumular certificados sem prática — foque em poucos e úteis.",
      "Combine estudo com candidaturas reais na mesma semana.",
      "Use linguagem simples e verdadeira — não decore discursos longos."
    ],
    localAngle: "Em processos de São Luís, demonstrar vontade de aprender pesa tanto quanto diploma longo sem aplicação.",
    coverHue: 156
  },
  {
    key: "12-transporte-pontualidade",
    title: "Transporte e pontualidade: planejar o deslocamento até o trabalho",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "transporte trabalho sao luis",
    section: "guia",
    lead: "Atraso por trânsito ou chuva é comum na ilha. Planejar rota e margem de tempo é parte da imagem profissional.",
    tips: [
      "Teste o trajeto no horário real da vaga, não só no domingo.",
      "Saia com 20–30 minutos de folga nos primeiros dias.",
      "Tenha rota alternativa quando chover forte.",
      "Avise com educação se um imprevisto grave atrasar — e só se for excepcional.",
      "Calcule custo mensal de passagem antes de aceitar o salário.",
      "Pergunte sobre estacionamento ou vale-transporte na admissão."
    ],
    localAngle: "Pontualidade em São Luís inclui conhecer o ritmo do transporte coletivo nos horários de pico.",
    coverHue: 172
  },
  {
    key: "13-comercio-ilha",
    title: "Vagas no comércio da ilha: o que costuma ser avaliado",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "vagas comercio sao luis",
    section: "guia",
    lead: "Lojas e redes locais olham postura, disponibilidade de sábado e capacidade de lidar com fila. Prepare-se para o que mais aparece nas entrevistas.",
    tips: [
      "Mostre experiência com público, mesmo em bicos ou negócios familiares.",
      "Disponibilidade em finais de semana é diferencial frequente.",
      "Chegue apresentável e com currículo impresso.",
      "Saiba explicar um exemplo de cliente difícil resolvido com calma.",
      "Pergunte sobre meta, comissão e horário real de fechamento.",
      "Confirme se há período de experiência e o que será avaliado."
    ],
    localAngle: "O comércio de São Luís valoriza quem aguenta ritmo de promoção e atendimento contínuo.",
    coverHue: 188
  },
  {
    key: "14-email-candidatura",
    title: "E-mail de candidatura curto e claro (modelo para São Luís)",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "email candidatura modelo",
    section: "guia",
    lead: "Um e-mail objetivo com assunto certo e anexo correto aumenta a chance de leitura. Modelo adaptável às vagas do portal.",
    tips: [
      "Assunto: Candidatura — cargo — seu nome.",
      "Corpo: 4–6 linhas com disponibilidade e um destaque de experiência.",
      "Anexo: currículo PDF com nome no arquivo.",
      "Evite gírias, CAPS LOCK e correntes de e-mail.",
      "Confira se respondeu ao endereço oficial da vaga.",
      "Faça follow-up educado após alguns dias úteis, sem spam diário."
    ],
    localAngle: "RH e lojistas locais leem no celular — assunto claro e texto curto vencem e-mail literário.",
    coverHue: 204
  },
  {
    key: "15-pagamento-vaga",
    title: "Quando desconfiar de pedido de pagamento para garantir vaga",
    type: "NEWS",
    template: "STANDARD",
    keyword: "golpe pagamento vaga",
    section: "noticias",
    lead: "Pedido de PIX, boleto ou “taxa de inscrição” para liberar emprego é alerta vermelho. Saiba reagir e proteger seus dados.",
    tips: [
      "Empresa séria não cobra do candidato para entrevistar.",
      "Encerrar contato é a resposta correta — não negociar valor.",
      "Não envie comprovante “só para reservar a vaga”.",
      "Relate o caso internamente se veio de anúncio do portal.",
      "Avise familiares jovens para não caírem no mesmo golpe.",
      "Prefira processos com etapas claras e sem urgência artificial."
    ],
    localAngle: "No MA, urgência (“só hoje”) combinada com PIX é padrão clássico de fraude de emprego.",
    coverHue: 218
  },
  {
    key: "16-linkedin-local",
    title: "Atualizar LinkedIn e perfil local sem inventar experiência",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "linkedin emprego sao luis",
    section: "guia",
    lead: "Perfil coerente ajuda em processos administrativos e comerciais. Honestidade supera cargo inventado que não se sustenta na entrevista.",
    tips: [
      "Foto simples, fundo neutro e nome completo.",
      "Headline com cargo desejado + São Luís/MA.",
      "Descreva tarefas reais com resultados modestos e verdadeiros.",
      "Peça recomendações só a quem realmente conviveu com seu trabalho.",
      "Ative alertas de vaga com filtros realistas.",
      "Use o portal local em paralelo — não dependa de uma só rede."
    ],
    localAngle: "Recrutadores da capital cruzam LinkedIn com currículo enviado — inconsistência elimina rápido.",
    coverHue: 232
  },
  {
    key: "17-entrevista-presencial",
    title: "Checklist da entrevista presencial em São Luís",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "entrevista presencial sao luis",
    section: "guia",
    lead: "Entrevista presencial ainda é padrão em muitos setores da ilha. Um checklist reduz nervosismo e falhas evitáveis.",
    tips: [
      "Confirme endereço, ponto de referência e horário um dia antes.",
      "Leve documento com foto e currículo impresso.",
      "Vista-se de forma limpa e adequada ao setor (comércio vs escritório).",
      "Prepare duas perguntas sobre rotina e expectativas da vaga.",
      "Desligue o celular ou deixe no silencioso antes de entrar.",
      "Agradeça ao final e anote o prazo de retorno informado."
    ],
    localAngle: "Chegar com folga no Centro ou em shoppings evita o estresse do trânsito de São Luís.",
    coverHue: 248
  },
  {
    key: "18-como-portal-funciona",
    title: "Como o Empregos São Luís organiza vagas para o candidato",
    type: "NEWS",
    template: "STANDARD",
    keyword: "como funciona empregos sao luis",
    section: "noticias",
    lead: "Entender o fluxo do portal ajuda a candidatar-se melhor: publicação, códigos ES, canais oficiais e páginas de segurança.",
    tips: [
      "Busque por cargo, cidade e categoria antes de abrir dezenas de abas.",
      "Leia a página completa da vaga, não só o título.",
      "Use o canal indicado — e-mail, WhatsApp ou link — sem intermediário paralelo.",
      "Candidatura do trabalhador segue gratuita e sem cadastro obrigatório.",
      "Consulte a página de segurança do candidato em caso de dúvida.",
      "Salve o link da vaga para acompanhar atualizações."
    ],
    localAngle: "O portal é feito para a Grande Ilha: priorize anúncios com contexto local e canal verificável.",
    coverHue: 262
  },
  {
    key: "19-auxiliar-administrativo",
    title: "Como se preparar para vagas de auxiliar administrativo em São Luís",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "auxiliar administrativo sao luis",
    section: "guia",
    lead: "Auxiliar administrativo pede organização, comunicação e noções de rotina de escritório. Veja o que destacar no currículo e na entrevista.",
    tips: [
      "Liste ferramentas que realmente usa: e-mail, planilhas, WhatsApp Business.",
      "Mostre experiência com arquivo, atendimento telefônico ou agenda.",
      "Demonstre pontualidade e discrição com informações da empresa.",
      "Peça exemplos de tarefas do dia a dia na entrevista.",
      "Organize pastas digitais de documentos pessoais antes da admissão.",
      "Evite exagerar domínio de sistemas que nunca abriu."
    ],
    localAngle: "Escritórios e clínicas da capital valorizam quem organiza demanda sem drama.",
    coverHue: 276
  },
  {
    key: "20-operador-caixa",
    title: "Operador de caixa na Grande Ilha: rotina, metas e postura",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "operador de caixa sao luis",
    section: "guia",
    lead: "Caixa exige atenção, educação e resistência a pico de movimento. Prepare-se para o que as lojas locais costumam cobrar.",
    tips: [
      "Treine cálculos simples e conferência de troco com calma.",
      "Poste-se de forma cordial mesmo sob pressão de fila.",
      "Pergunte sobre abertura/fechamento de caixa e responsabilidade.",
      "Disponibilidade em sábados e datas comemorativas é frequente.",
      "Cuide da aparência e da higiene das mãos no posto.",
      "Relate diferença de caixa com transparência — esconder piora."
    ],
    localAngle: "Em shoppings e redes de São Luís, o pico de fim de tarde testa paciência e precisão.",
    coverHue: 290
  },
  {
    key: "21-experiencia-informal",
    title: "Como colocar experiência informal no currículo sem mentir",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "experiencia informal curriculo",
    section: "guia",
    lead: "Bicos, ajuda em negócio da família e freelas contam se descritos com honestidade. Veja como transformar atividade real em evidência útil.",
    tips: [
      "Use títulos descritivos: “Atendimento em comércio familiar”, não cargo inventado.",
      "Liste tarefas concretas e período aproximado.",
      "Explique na entrevista o contexto sem envergonhar o trabalho informal.",
      "Destaque responsabilidades: caixa, estoque, entrega, agenda.",
      "Não fabrique CNPJ ou empresa fantasma.",
      "Peça referência a quem supervisionou de fato o seu trabalho."
    ],
    localAngle: "Muita gente da ilha começa no informal — o que importa é clareza e responsabilidade demonstrável.",
    coverHue: 304
  },
  {
    key: "22-jovem-aprendiz-contexto",
    title: "Jovem profissional em São Luís: rotina de estudos e trabalho",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "jovem profissional sao luis",
    section: "guia",
    lead: "Conciliar estudo e primeiro emprego exige organização. Orientações gerais para quem está entrando no mercado da capital — sem confundir com programas específicos de aprendizagem.",
    tips: [
      "Alinhe horários de aula e expediente antes de aceitar a vaga.",
      "Comunique com antecedência provas e compromissos escolares.",
      "Priorize sono e deslocamento — cansaço gera erro no trabalho.",
      "Peça feedback nas primeiras semanas para corrigir rota cedo.",
      "Mantenha um caderno de aprendizados da função.",
      "Não abandone a formação por uma vaga instável sem avaliar."
    ],
    localAngle: "Na Grande Ilha, deslocamento longo entre casa, escola e trabalho é o maior ladrão de tempo — planeje a semana.",
    coverHue: 318
  },
  {
    key: "23-servicos-gerais",
    title: "Vagas de serviços gerais: o que perguntar antes de aceitar",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "servicos gerais sao luis",
    section: "guia",
    lead: "Serviços gerais cobrem limpeza, apoio e manutenção leve. Clareza sobre escopo, EPI e horário evita surpresa no primeiro dia.",
    tips: [
      "Pergunte quais ambientes e tarefas estão incluídos.",
      "Confirme fornecimento de material e equipamento de proteção.",
      "Entenda escala, folgas e se há plantão.",
      "Negocie transporte ou vale se o local for distante.",
      "Recuse pedido de tarefa perigosa sem orientação.",
      "Peça apresentação da liderança e do ponto de apoio no local."
    ],
    localAngle: "Condomínios, lojas e clínicas de São Luís contratam com frequência — escopo escrito reduz abuso de “faz de tudo”.",
    coverHue: 332
  },
  {
    key: "24-recepcionista",
    title: "Recepcionista em clínicas e escritórios: perfil pedido na capital",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "recepcionista sao luis",
    section: "guia",
    lead: "Recepção é a porta da empresa. Organização de agenda, tom de voz e discrição com dados do cliente são o núcleo da função.",
    tips: [
      "Treine atendimento telefônico com script curto e educado.",
      "Organize fila presencial sem humilhar quem espera.",
      "Cuide da confidencialidade de documentos e conversas.",
      "Aprenda o fluxo básico de agendamento usado no local.",
      "Vista-se de forma alinhada ao ambiente (saúde vs escritório).",
      "Anote nomes e retornos para não perder demanda."
    ],
    localAngle: "Clínicas e cartórios da ilha valorizam quem mantém calma mesmo com sala cheia.",
    coverHue: 346
  },
  {
    key: "25-estoque-loja",
    title: "Estoque e organização em loja: habilidades que abrem vaga",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "estoque loja sao luis",
    section: "guia",
    lead: "Quem organiza estoque bem reduz falta de produto e conflito no caixa. Habilidades práticas que o comércio local observa.",
    tips: [
      "Mostre cuidado com validade, código e localização do item.",
      "Comunique ruptura de estoque com antecedência ao responsável.",
      "Trabalhe ergonomia básica — carregue com técnica e peça ajuda.",
      "Mantenha corredor e área de separação limpos.",
      "Aprenda o sistema de etiquetas usado pela loja.",
      "Ofereça apoio à reposição em horário de pico."
    ],
    localAngle: "Redes e atacarejos em São Luís precisam de gente confiável no fundo de loja, não só no atendimento.",
    coverHue: 12
  },
  {
    key: "26-entrevista-online",
    title: "Entrevista por videochamada: checklist para candidatos no MA",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "entrevista online maranhao",
    section: "guia",
    lead: "Processos remotos aumentaram. Áudio ruim e fundo caótico eliminam candidatos bons — prepare o básico técnico e comportamental.",
    tips: [
      "Teste câmera, microfone e internet 15 minutos antes.",
      "Escolha fundo simples e iluminação frontal.",
      "Use fone se houver eco ou barulho de rua.",
      "Vista a parte de cima como em entrevista presencial.",
      "Tenha currículo e anotações à mão, fora da tela.",
      "Se a conexão cair, retorne com educação e número de contato."
    ],
    localAngle: "Mesmo para vagas presenciais em São Luís, a triagem inicial muitas vezes é online.",
    coverHue: 28
  },
  {
    key: "27-salario-negociar",
    title: "Como falar de pretensão salarial sem se prejudicar",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "pretensao salarial sao luis",
    section: "guia",
    lead: "Pergunta de salário aparece cedo. Responder com faixa realista e baseada em mercado local evita autoexclusão ou aceitar valor injusto.",
    tips: [
      "Pesquise faixas de cargos semelhantes no portal e em conversas confiáveis.",
      "Informe uma faixa, não um número único rígido, quando possível.",
      "Considere vale-transporte, alimentação e escala no cálculo.",
      "Se a vaga já publica o valor, seja transparente sobre alinhamento.",
      "Evite bluff de proposta inexistente.",
      "Peça tempo curto para avaliar proposta formal por escrito."
    ],
    localAngle: "No mercado de São Luís, honestidade sobre disponibilidade e valor costuma gerar mais retorno que jogo teatral.",
    coverHue: 44
  },
  {
    key: "28-demissao-proxima",
    title: "Está empregado e buscando outra vaga? Como fazer com ética",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "buscar emprego empregado",
    section: "guia",
    lead: "Trocar de emprego é normal. Cuidar da reputação e dos horários evita conflito e referência ruim no mercado local.",
    tips: [
      "Não use computador ou WhatsApp da empresa atual para candidaturas.",
      "Agende entrevistas em horários que não sabotem sua função.",
      "Evite falar mal do empregador atual na entrevista.",
      "Só peça demissão após proposta clara e preferencialmente escrita.",
      "Cumprir aviso e transição demonstra profissionalismo.",
      "Atualize colegas-chave com educação, sem espalhar fofoca."
    ],
    localAngle: "São Luís é cidade em que muita gente se conhece — reputação circula rápido entre comércios e serviços.",
    coverHue: 60
  },
  {
    key: "29-pcd-inclusao",
    title: "Candidatura inclusiva: direitos e preparação sem estigma",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas inclusivas sao luis",
    section: "guia",
    lead: "Pessoas com deficiência têm direito a processos respeitosos. Oriente-se sobre acessibilidade razoável e como apresentar suas habilidades com clareza.",
    tips: [
      "Leia se a vaga menciona acessibilidade ou adaptação do posto.",
      "Na entrevista, foque competências e o que você precisa para performar bem.",
      "Peça informações sobre transporte e acesso ao prédio.",
      "Guarde registros se houver tratamento discriminatório.",
      "Use canais oficiais e políticas do portal quando disponíveis.",
      "Não aceite pressão para abrir mão de direitos básicos."
    ],
    localAngle: "Empresas da capital estão ampliando conversas de inclusão — cobre respeito e condições concretas, não só discurso.",
    coverHue: 76
  },
  {
    key: "30-mulheres-mercado",
    title: "Mulheres no mercado de São Luís: segurança na candidatura",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "mulheres emprego sao luis",
    section: "guia",
    lead: "Além da busca por vaga, segurança no deslocamento e no contato inicial importa. Práticas para se candidatar com mais proteção.",
    tips: [
      "Prefira entrevistas em endereços comerciais identificáveis.",
      "Avise alguém de confiança sobre local e horário.",
      "Desconfie de “entrevista” em residência sem contexto claro.",
      "Recuse pedidos de fotos íntimas ou conteúdo inadequado.",
      "Exija canal profissional e horários comerciais para contato.",
      "Denuncie assédio e interrompa processos abusivos."
    ],
    localAngle: "Na Grande Ilha, combine busca de oportunidade com cuidado redobrado em contatos só por WhatsApp sem empresa clara.",
    coverHue: 90
  },
  {
    key: "31-retorno-emprego",
    title: "Voltando ao mercado após um tempo fora: roteiro de 14 dias",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "voltar ao mercado de trabalho",
    section: "guia",
    lead: "Pausa por cuidado familiar, saúde ou estudo não é o fim da carreira. Um plano de duas semanas reacende a busca com método.",
    tips: [
      "Atualize currículo com atividades recentes, mesmo não formais.",
      "Reative contatos profissionais com mensagem curta e respeitosa.",
      "Candidate-se a vagas alinhadas ao momento atual, não só ao passado.",
      "Treine entrevistas explicando a pausa com objetividade.",
      "Organize documentos e referências antes dos processos.",
      "Cuide da rotina de sono e deslocamento para sustentar a busca."
    ],
    localAngle: "Em São Luís, muitos retornos acontecem via indicação — combine isso com presença consistente no portal.",
    coverHue: 106
  },
  {
    key: "32-freelancer-local",
    title: "Serviços avulsos e freela local: organizar propostas com clareza",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "freelancer sao luis",
    section: "guia",
    lead: "Freela de design, entrega, reforma leve ou apoio digital precisa de escopo e valor combinados. Evite trabalho sem combinado.",
    tips: [
      "Descreva o entregável, prazo e valor antes de começar.",
      "Peça sinal quando o costume do serviço justificar.",
      "Não aceite pressão para “mostrar serviço grátis” sem limite.",
      "Registre combinados por mensagem para memória futura.",
      "Separe conta e comprovantes para organização financeira.",
      "Avalie se a demanda estável recomenda buscar CLT em paralelo."
    ],
    localAngle: "Na capital, freela boca a boca é comum — clareza por escrito reduz calote e mal-entendido.",
    coverHue: 122
  },
  {
    key: "33-seguranca-candidato",
    title: "Segurança do candidato: checklist rápido antes de enviar dados",
    type: "NEWS",
    template: "STANDARD",
    keyword: "seguranca candidato emprego",
    section: "noticias",
    lead: "Antes de mandar documento ou PIX, passe por um checklist de 60 segundos. Proteção deve vir junto com a ansiedade da vaga.",
    tips: [
      "A empresa é identificável? O endereço faz sentido?",
      "O pedido de dado é proporcional à etapa do processo?",
      "Há cobrança? Se sim, pare.",
      "O contato bate com o canal da vaga publicada?",
      "Você consegue explicar a vaga a um familiar sem constrangimento?",
      "Em dúvida, consulte a página de segurança do Empregos São Luís."
    ],
    localAngle: "A pressa do “preciso trabalhar já” é explorada por golpistas na região — o checklist freia o impulso.",
    coverHue: 138
  },
  {
    key: "34-ferias-direitos",
    title: "Férias, folgas e escala: perguntas básicas na admissão",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "escala folga trabalho",
    section: "guia",
    lead: "Entender escala e folgas evita conflito na primeira semana. Perguntas simples para fazer no processo admissional.",
    tips: [
      "Qual é a escala semanal e o dia de folga?",
      "Há banco de horas ou hora extra frequente?",
      "Como funciona feriado trabalhado?",
      "Qual o período de experiência e critérios de avaliação?",
      "Peça resposta clara — “depois a gente vê” é frágil.",
      "Anote o combinado e guarde o contrato quando assinar."
    ],
    localAngle: "Comércio da ilha opera forte em feriados e sábados — alinhe expectativa cedo.",
    coverHue: 154
  },
  {
    key: "35-soft-skills",
    title: "Postura profissional que empregadores locais mais citam",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "postura profissional sao luis",
    section: "guia",
    lead: "Além do currículo, pequenas atitudes decidem contratação: pontualidade, tom de voz, cuidado com o celular e respeito à equipe.",
    tips: [
      "Chegue no horário — ou avise com antecedência real.",
      "Ouça a pergunta inteira antes de responder.",
      "Evite mexer no celular durante a conversa.",
      "Trate recepcionistas e equipe com o mesmo respeito do gestor.",
      "Agradeça oportunidades mesmo quando a resposta for não.",
      "Peça feedback curto se não for selecionado."
    ],
    localAngle: "Em empresas familiares de São Luís, postura costuma pesar tanto quanto curso técnico.",
    coverHue: 170
  },
  {
    key: "36-indicacao",
    title: "Indicação de emprego na Grande Ilha: como pedir sem constranger",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "indicacao emprego sao luis",
    section: "guia",
    lead: "Indicação abre porta, mas pedido genérico cansa a rede. Faça solicitações específicas e fáceis de encaminhar.",
    tips: [
      "Envie currículo atualizado junto com o pedido.",
      "Diga o tipo de vaga e a disponibilidade com clareza.",
      "Facilite o encaminhamento: mensagem curta pronta para repasse.",
      "Agradeça mesmo quando não houver retorno imediato.",
      "Não cobre resultado — indicação não é obrigação.",
      "Reciprocidade: ajude outros quando puder."
    ],
    localAngle: "Redes de bairro e igreja/escola ainda movem muita contratação informal na ilha — use com ética.",
    coverHue: 186
  },
  {
    key: "37-home-office-mito",
    title: "Home office e vagas remotas: o que é realista no Maranhão",
    type: "NEWS",
    template: "STANDARD",
    keyword: "home office maranhao",
    section: "noticias",
    lead: "Ofertas 100% remotas com salário alto e seleção só por WhatsApp merecem ceticismo. Veja como filtrar oportunidades digitais.",
    tips: [
      "Exija descrição clara de tarefas e empresa identificável.",
      "Desconfie de pagamento antecipado do candidato.",
      "Confirme se a vaga é remota de verdade ou híbrida.",
      "Teste se o processo tem etapas (formulário, entrevista, teste).",
      "Não instale APKs ou programas pedindo acesso total ao celular.",
      "Prefira combinar remoto com presença no portal local."
    ],
    localAngle: "Para a maioria dos perfis em São Luís, presencial e comércio ainda dominam — remoto bom existe, mas é minoria.",
    coverHue: 200
  },
  {
    key: "38-atualizacao-curriculo",
    title: "Quando e como atualizar o currículo sem reescrever tudo",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "atualizar curriculo",
    section: "guia",
    lead: "Currículo engessado perde vaga. Uma rotina mensal de microatualizações mantém você pronto para a próxima oportunidade.",
    tips: [
      "Todo mês: revise telefone, e-mail e cidade.",
      "Após projeto relevante: acrescente um bullet de resultado.",
      "Antes de candidatura grande: adapte o resumo ao cargo.",
      "Remova experiências muito antigas e irrelevantes.",
      "Mantenha versão PDF e uma cópia editável.",
      "Peça a alguém de confiança para ler em 30 segundos."
    ],
    localAngle: "Candidatos ativos em São Luís mudam de número e bairro — dado desatualizado perde retorno.",
    coverHue: 216
  },
  {
    key: "39-feedback-negativo",
    title: "Não fui chamado: o que fazer depois de uma negativa",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "negativa entrevista emprego",
    section: "guia",
    lead: "Negativa dói, mas pode virar ajuste de rota. Como pedir feedback e continuar a busca sem travar emocionalmente.",
    tips: [
      "Agradeça a oportunidade em mensagem curta.",
      "Pergunte se há um ponto objetivo a melhorar — aceite se não houver resposta.",
      "Revise se a vaga era alinhada ao seu perfil atual.",
      "Ajuste um item do currículo ou da fala na entrevista.",
      "Candidate-se de novo a outras vagas no mesmo dia — mantenha ritmo.",
      "Converse com alguém de apoio; não isole a frustração."
    ],
    localAngle: "No mercado local, uma porta fecha e outra abre no mesmo corredor comercial — persistência metódica conta.",
    coverHue: 230
  },
  {
    key: "40-dados-pessoais",
    title: "LGPD na prática do candidato: o que compartilhar e quando",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "lgpd candidato emprego",
    section: "guia",
    lead: "Dados pessoais têm momento certo. Entenda o mínimo na triagem e o que só faz sentido na admissão formal.",
    tips: [
      "Na triagem: currículo, telefone e e-mail costumam bastar.",
      "CPF completo e documentos sensíveis ficam para etapas formais.",
      "Desconfie de formulários pedindo dado bancário cedo demais.",
      "Pergunte para que o dado será usado se não estiver claro.",
      "Não envie senha ou código de verificação a “RH”.",
      "Leia as políticas de privacidade do portal e da empresa."
    ],
    localAngle: "Candidatos de São Luís podem e devem cobrar proporcionalidade — vaga boa não exige exposição total no dia 1.",
    coverHue: 244
  },
  {
    key: "41-setor-alimentacao",
    title: "Vagas em alimentação e panificação: ritmo e higiene",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas alimentacao sao luis",
    section: "guia",
    lead: "Bares, lanchonetes e padarias pedem higiene, resistência e trabalho em equipe. O que reforçar na candidatura.",
    tips: [
      "Destaque experiência com higiene e manipulação se tiver.",
      "Disponibilidade em manhã cedo ou noite é diferencial.",
      "Pergunte sobre uniforme, EPI e pausas.",
      "Seja honesto sobre restrições de saúde relevantes à função.",
      "Mostre capacidade de trabalhar sob pico de movimento.",
      "Confirme se há gorjeta, taxa de serviço ou só salário."
    ],
    localAngle: "Gastronomia da orla e do Centro gera vagas sazonais — confirme se a demanda é estável ou só temporada.",
    coverHue: 258
  },
  {
    key: "42-construcao-apoio",
    title: "Apoio em obra e serviços de manutenção: segurança em primeiro lugar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas obra manutencao sao luis",
    section: "guia",
    lead: "Funções de apoio em obra e manutenção exigem atenção a risco. Não aceite tarefa sem orientação e proteção adequada.",
    tips: [
      "Pergunte sobre EPI e treinamento no primeiro dia.",
      "Recuse atividade claramente insegura sem supervisão.",
      "Confirme forma de pagamento e responsável pelo canteiro.",
      "Leve documento e combine ponto de encontro seguro.",
      "Hidratação e pausa importam no calor da ilha.",
      "Registre acordos de diária ou quinzena por escrito."
    ],
    localAngle: "Obras em expansão na Grande Ilha contratam apoio — segurança não é detalhe negociável.",
    coverHue: 272
  },
  {
    key: "43-atendimento-telefone",
    title: "Atendimento telefônico e WhatsApp Business no dia a dia",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "atendimento telefonico whatsapp",
    section: "guia",
    lead: "Muitas vagas locais misturam telefone e WhatsApp. Protocolo simples melhora imagem da empresa e sua avaliação.",
    tips: [
      "Identifique-se e confirme o nome de quem liga.",
      "Anote pedido, prazo e retorno prometido.",
      "Use respostas prontas sem parecer robô.",
      "Não invente informação — diga que vai confirmar.",
      "Separe conversas pessoais do número profissional.",
      "Encerre com próximo passo claro."
    ],
    localAngle: "Lojas e clínicas de São Luís medem qualidade pelo tempo de resposta no WhatsApp — organize a fila de mensagens.",
    coverHue: 286
  },
  {
    key: "44-meta-semanal",
    title: "Plano semanal de candidaturas: meta realista para a ilha",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "meta candidaturas emprego",
    section: "dados",
    lead: "Volume sem qualidade vira cansaço. Uma meta semanal mensurável equilibra quantidade de envios e profundidade da preparação.",
    tips: [
      "Meta sugerida: 8–15 candidaturas bem lidas por semana.",
      "Reserve 2 entrevistas simuladas (espelho ou amigo).",
      "Meça respostas recebidas, não só envios.",
      "Ajuste a meta se o deslocamento na ilha consumir o dia.",
      "Registre motivos de negativa quando souber.",
      "Celebre microvitórias: retorno, entrevista, feedback."
    ],
    localAngle: "Quem trabalha ou estuda em São Luís precisa de meta sustentável — senão a busca abandona na segunda semana.",
    coverHue: 300
  },
  {
    key: "45-proximos-passos-portal",
    title: "Próximos passos no Empregos São Luís após ler este guia",
    type: "NEWS",
    template: "STANDARD",
    keyword: "empregos sao luis proximos passos",
    section: "noticias",
    lead: "Conteúdo só ajuda se virar ação. Feche o ciclo: buscar, candidatar com segurança, acompanhar e voltar aos guias quando precisar.",
    tips: [
      "Abra a busca de vagas e filtre por seu perfil hoje.",
      "Candidate-se só pelo canal oficial da publicação.",
      "Salve alertas se usar a função de avisos do portal.",
      "Releia a página de segurança do candidato antes de enviar documento.",
      "Volte aos guias quando for mudar de área ou retomar a busca.",
      "Compartilhe orientação útil com quem também está procurando — sem espalhar golpe."
    ],
    localAngle: "O portal existe para o candidato da Grande Ilha agir com clareza — o próximo clique deve ser uma vaga real, não mais um atalho duvidoso.",
    coverHue: 314
  }
];

export function slugFor(item) {
  return `${SLUG_BASE}-${item.key}`;
}
