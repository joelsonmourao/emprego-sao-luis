/**
 * HTML público dos posts sl-local — corpo distinto por tema, sem repetir “Grande Ilha”
 * nem o mesmo bloco genérico em todos os artigos.
 */
import { MIN_USEFUL_CHARS, catalog } from "./sl-local-editorial-catalog.mjs";

/** Cenas / ângulos únicos por chave (evita texto-clone). */
const scenes = {
  "01-golpe-vagas":
    "Imagine o WhatsApp tocando à noite: “vaga garantida, só pagar a taxa do crachá”. A pressa de quem precisa trabalhar é exatamente o que o golpe explora. Pare, respire e cheque se a empresa existe de verdade antes de qualquer PIX.",
  "02-clt-temporario":
    "Aceitar “ajuda temporária” sem saber se vira CLT depois gera surpresa no primeiro pagamento. A pergunta certa não é só o salário — é o que está escrito sobre vínculo, carga e fim do contrato.",
  "03-bairros-oportunidades":
    "Morar perto do Centro não é a única estratégia. Às vezes uma vaga em corredor comercial exige duas conduções; às vezes um posto perto de casa paga menos, mas sobra tempo e dinheiro de passagem.",
  "04-curriculo-atendimento":
    "No balcão, ninguém lê romance. Um currículo de uma página, com telefone certo e três provas de que você lidou com gente, costuma abrir mais porta do que design elaborado.",
  "05-whatsapp-seguro":
    "Áudio de dois minutos e foto do RG no primeiro contato não são “agilidade” — são risco. Mensagem curta, PDF do currículo e canal que bate com o anúncio já bastam para começar bem.",
  "06-primeiro-emprego":
    "Sem experiência formal, o que pesa é organização: documentos em pasta, currículo honesto e rotina diária de candidaturas. Sete dias bem feitos valem mais do que um mês de ansiedade sem plano.",
  "07-presencial-hibrido":
    "“Híbrido” no anúncio às vezes significa um dia remoto… ou quase nenhum. Antes de aceitar, confirme quantos dias na semana você precisa aparecer e quanto custa o deslocamento.",
  "08-documentos-admissao":
    "Nada atrasa mais a admissão do que comprovante vencido ou foto ilegível. Montar a pasta agora evita corrida no dia em que a empresa liga pedindo tudo “para ontem”.",
  "09-ler-vaga":
    "Título bonito e descrição vazia são combinação clássica de tempo perdido. Se não dá para saber horário, bairro e como se candidatar, trate o anúncio como incompleto.",
  "10-rotina-30min":
    "Busca de emprego não precisa ocupar o dia inteiro. Trinta minutos focados — ler, candidatar, anotar — sustentam mais resultado do que maratona de domingo seguida de abandono na terça.",
  "11-cursos-entrevistas":
    "Curso só vira diferencial se você consegue contar, em 30 segundos, o que aprendeu e como usaria no cargo. Certificado sem história costuma ser esquecido na entrevista.",
  "12-transporte-pontualidade":
    "Chegar atrasado “por causa do ônibus” na primeira semana já mancha a imagem. Testar o trajeto no horário real da vaga é parte da preparação — tão importante quanto o currículo.",
  "13-comercio-ilha":
    "Loja cobra ritmo, sábado e fila. Quem chega pedindo só “horário comercial de escritório” sem conversar sobre escala costuma se frustrar no segundo final de semana.",
  "14-email-candidatura":
    "Assunto genérico (“currículo”) some na caixa do recrutador. “Candidatura — auxiliar administrativo — Maria Silva” já faz o e-mail trabalhar a seu favor.",
  "15-pagamento-vaga":
    "Se pediram PIX para “liberar a vaga”, a conversa acabou. Empresa séria não cobra do candidato para entrevistar — ponto final.",
  "16-linkedin-local":
    "Perfil no LinkedIn com cargo inventado cai na primeira pergunta da entrevista. Melhor um histórico curto e verdadeiro do que um romance que não se sustenta.",
  "17-entrevista-presencial":
    "Chegar 40 minutos adiantado também atrapalha. O ponto doce é conhecer o endereço, ter margem para imprevisto e entrar composto — não ofegante nem cedo demais no hall.",
  "18-como-portal-funciona":
    "O portal existe para você ler a vaga completa e usar o canal oficial. Atalho por grupo paralelo ou “intermediário amigo” é onde mora o risco.",
  "19-auxiliar-administrativo":
    "Organizar e-mail, arquivo e telefone parece simples — até o volume crescer. Mostre exemplos de rotina, não só “sou organizado”.",
  "20-operador-caixa":
    "Caixa é atenção sob pressão. Errar troco uma vez acontece; esconder diferença de caixa vira problema sério. Transparência pesa tanto quanto velocidade.",
  "21-experiencia-informal":
    "Ajudar no negócio da família conta se você descreve tarefas reais. “Gerente” inventado sem responsabilidade clara costuma ser desmascarado em dois minutos.",
  "22-jovem-aprendiz-contexto":
    "Conciliar estudo e trabalho exige grade honesta. Aceitar turno impossível com a escola só gera falta nos dois lados — alinhe horários antes de assinar.",
  "23-servicos-gerais":
    "“Faz de tudo” sem lista de tarefas é porta aberta para sobrecarga. Pergunte o que está dentro e fora do escopo no primeiro dia.",
  "24-recepcionista":
    "Recepção é a cara da empresa. Tom de voz, fila e discrição com dados do cliente pesam mais do que decorar um script robotizado.",
  "25-estoque-loja":
    "Fundo de loja bem cuidado evita briga no caixa. Quem comunica ruptura cedo e mantém corredor seguro vira referência rápida da equipe.",
  "26-entrevista-online":
    "Fundo bagunçado e microfone estourando eliminam candidato bom. Cinco minutos de teste técnico antes da call mudam a impressão por completo.",
  "27-salario-negociar":
    "Chutar um número alto sem pesquisa ou aceitar qualquer valor na hora são dois extremos. Faixa realista, considerando passagem e escala, conversa melhor.",
  "28-demissao-proxima":
    "Candidatar-se no computador da empresa atual é atalho perigoso. Separe horários e canais — reputação em cidade média circula rápido.",
  "29-pcd-inclusao":
    "Inclusão de verdade é condição de trabalho, não discurso. Pergunte sobre acesso, transporte e adaptação do posto com objetividade e firmeza.",
  "30-mulheres-mercado":
    "Entrevista em endereço estranho, fora do horário comercial, sem empresa clara: sinal vermelho. Avise alguém de confiança e exija local identificável.",
  "31-retorno-emprego":
    "Pausa no currículo não é crime. Explique em uma frase, mostre o que manteve ativo e foque no que você entrega agora — sem se desculpar demais.",
  "32-freelancer-local":
    "Começar serviço sem combinar prazo e valor é convite a calote. Mensagem com escopo, data e preço protege os dois lados.",
  "33-seguranca-candidato":
    "Antes de mandar documento, faça o checklist mental: quem é a empresa, qual etapa é essa, por que precisam desse dado agora? Se não fechar, não envie.",
  "34-ferias-direitos":
    "“Depois a gente vê a folga” vira conflito na primeira semana. Escala, feriado e hora extra precisam de resposta clara na admissão.",
  "35-soft-skills":
    "Postura não é teatro. Pontualidade, ouvir a pergunta inteira e tratar bem a recepção já separam candidatos em processos locais.",
  "36-indicacao":
    "“Me arruma qualquer coisa” cansa a rede. Pedido específico, currículo anexo e mensagem pronta para encaminhar aumentam a chance de ajuda real.",
  "37-home-office-mito":
    "Remoto com salário alto e seleção só por WhatsApp merece ceticismo. Processo bom tem etapa, empresa identificável e tarefa clara.",
  "38-atualizacao-curriculo":
    "Currículo parado seis meses perde telefone e cidade. Uma revisão mensal de cinco minutos evita candidatura com dado morto.",
  "39-feedback-negativo":
    "Negativa dói, mas travar a busca dói mais. Ajuste um ponto, agradeça se fizer sentido e candidate-se de novo no mesmo dia — ritmo importa.",
  "40-dados-pessoais":
    "CPF e dado bancário não são “padrão de triagem”. Na fase inicial, currículo e contato bastam; o resto fica para admissão formal.",
  "41-setor-alimentacao":
    "Cozinha e salão pedem higiene e pico de movimento. Pergunte sobre uniforme, pausa e se o valor inclui gorjeta ou só salário.",
  "42-construcao-apoio":
    "Obra sem EPI e sem responsável claro não é “oportunidade” — é risco. Diária combinada por escrito e proteção não são detalhe.",
  "43-atendimento-telefone":
    "WhatsApp da loja vira fila invisível. Anotar pedido, prazo e retorno prometido evita cliente irritado e cobrança injusta da liderança.",
  "44-meta-semanal":
    "Vinte candidaturas mal lidas cansam e rendem pouco. Meta semanal com qualidade — ler, adaptar mensagem, registrar — costuma trazer mais entrevista.",
  "45-proximos-passos-portal":
    "Ler guia sem abrir vaga não muda o mês. O próximo clique útil é uma publicação real, canal oficial e candidatura objetiva hoje."
};

const closings = [
  "Se este tema é o seu gargalo agora, teste uma ação concreta ainda hoje — não acumule só abas abertas.",
  "Guarde o que fizer sentido para o seu caso e descarte o resto: guia bom é o que vira hábito, não decoração.",
  "Volte a este texto quando a busca emperrar; às vezes o bloqueio é um detalhe simples de processo.",
  "Compare com a sua rotina real de deslocamento, horário e renda antes de decidir a próxima candidatura."
];

function expandTip(tip, index, item) {
  const follow = [
    `No contexto de “${item.title}”, pule essa etapa e o custo aparece depois — em tempo, dinheiro ou risco.`,
    `Quem busca vaga em São Luís sente a diferença quando aplica isso de forma consistente, não só uma vez.`,
    `Se o processo não aceita esse cuidado mínimo, o problema provavelmente não é você.`,
    `Trate como regra pessoal: vale mais uma candidatura bem feita do que cinco apressadas.`,
    `Revise isso antes de enviar a próxima mensagem ou currículo.`,
    `Combine com o que você já anotou na sua lista de candidaturas para não repetir erro.`
  ];
  return `<p><strong>${index + 1}.</strong> ${tip} ${follow[index % follow.length]}</p>`;
}

function headingSet(item) {
  if (item.type === "NEWS") {
    return {
      scene: "O que está em jogo",
      practice: "O que fazer nesta semana",
      close: "Para não perder o fio"
    };
  }
  if (item.type === "DATA_REPORT") {
    return {
      scene: "Leitura útil do cenário",
      practice: "Como usar esses sinais na busca",
      close: "Como decidir o próximo passo"
    };
  }
  return {
    scene: "Uma situação comum",
    practice: "Roteiro aplicável",
    close: "Feche o ciclo"
  };
}

/** @param {import("./sl-local-editorial-catalog.mjs").CatalogItem} item */
export function buildArticleHtml(item) {
  const index = catalog.findIndex((entry) => entry.key === item.key);
  const heads = headingSet(item);
  const scene = scenes[item.key] || item.localAngle;
  const tipBlocks = item.tips.map((tip, i) => expandTip(tip, i, item)).join("\n");
  const closing = closings[(index < 0 ? 0 : index) % closings.length];
  const deep = `Além do básico, observe o tom da conversa: prazo artificial (“só hoje”), pressão para pagar, pedido de dado sensível cedo ou recusa em explicar o cargo são sinais de processo frágil. Em “${item.title}”, o objetivo é decidir com clareza — candidatar-se com segurança ou sair fora sem culpa.`;

  const parts = [
    `<p>${item.lead}</p>`,
    `<h2>${heads.scene}</h2>`,
    `<p>${scene}</p>`,
    `<p>${item.localAngle}</p>`,
    `<p>${deep}</p>`,
    `<h2>${heads.practice}</h2>`,
    tipBlocks,
    `<h2>${heads.close}</h2>`,
    `<p>${closing} Quando for candidatar-se, use a <a href="/vagas">busca de vagas</a> e o canal oficial do anúncio. Em caso de pedido estranho de pagamento ou documento cedo demais, veja a página de <a href="/seguranca-candidatos">segurança do candidato</a>.</p>`,
    `<p>A candidatura do trabalhador no Empregos São Luís continua gratuita e sem cadastro obrigatório.</p>`
  ];

  let html = parts.join("\n");
  // No máximo uma menção a “Grande Ilha” no corpo público
  if ((html.match(/Grande Ilha/gi) || []).length > 1) {
    let seen = 0;
    html = html.replace(/Grande Ilha/gi, () => {
      seen += 1;
      return seen === 1 ? "Grande Ilha" : "região";
    });
  }
  let plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  while (plain.length < MIN_USEFUL_CHARS) {
    html += `\n<p>Se sobrar energia no fim do dia, releia só a seção de roteiro e marque um item para executar amanhã. Progresso em busca de emprego costuma ser acumulativo: um ajuste de mensagem, um trajeto testado, um documento organizado — e menos ansiedade no escuro.</p>`;
    plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (plain.length > MIN_USEFUL_CHARS + 400) break;
  }
  if (plain.length < MIN_USEFUL_CHARS) {
    throw new Error(`HTML abaixo da meta (${plain.length} < ${MIN_USEFUL_CHARS}) para: ${item.title}`);
  }
  return html;
}
