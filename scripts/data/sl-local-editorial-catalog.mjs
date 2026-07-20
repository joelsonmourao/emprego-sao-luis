/**
 * Catálogo de 105 peças editoriais locais (São Luís / Maranhão).
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
const rawCatalog = [
  {
    key: "01-curriculo-ats",
    title: "Currículo com palavras-chave que sistemas ATS entendem",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "curriculo palavras chave ats sao luis",
    section: "guia",
    lead: "Muitas empresas da capital filtram currículos por palavras iguais às do anúncio. Se o seu PDF não ecoa o cargo e as ferramentas pedidas, a triagem automática pode descartar você antes de um humano ler.",
    tips: [
      "Copie do anúncio os verbos e sistemas citados (Excel, PDV, CRM) e use-os só se forem verdadeiros no seu histórico.",
      "Escreva o cargo-alvo no topo, não um título genérico como “profissional em busca de oportunidades”.",
      "Troque frases vagas (“trabalhei com público”) por resultados: “atendi fila de 40 clientes no pico do sábado”.",
      "Evite tabelas, caixas de texto e cabeçalhos gráficos que quebram a leitura automática.",
      "Salve em PDF de texto selecionável — teste selecionando uma linha no celular.",
      "Mantenha uma versão “base” e outra adaptada a cada vaga de São Luís que valer a pena."
    ],
    localAngle: "Em processos de redes de varejo e clínicas em São Luís, o filtro por palavra-chave costuma ser o primeiro funil — adapte o PDF antes de enviar em massa.",
    coverHue: 4
  },
  {
    key: "02-soft-hard-skills",
    title: "Soft skills e hard skills: o que os anúncios locais pedem de verdade",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "soft skills hard skills vagas sao luis",
    section: "dados",
    lead: "Ler dezenas de vagas na capital mostra um padrão: hard skills abrem a porta (sistema, ferramenta, certificado), soft skills decidem quem fica na entrevista. Saiba separar o que é requisito técnico do que é comportamento.",
    tips: [
      "Liste hard skills com prova: curso, tempo de uso ou exemplo de tarefa concluída.",
      "Traduza soft skills em cena (“resolvi reclamação sem transferir o cliente três vezes”).",
      "Não invente “liderança” se você só organizou a própria mesa — descreva colaboração real.",
      "Compare duas vagas do mesmo cargo: o que se repete é o núcleo do mercado local.",
      "Priorize no currículo as três habilidades que batem com o anúncio, não uma lista de vinte.",
      "Na entrevista, prepare um exemplo de pressão (fila, prazo, chuva no trajeto) e como você reagiu."
    ],
    localAngle: "No comércio e serviços do Maranhão, “comunicação” quase sempre significa lidar com fila e reclamação — não discurso de palestra.",
    coverHue: 12
  },
  {
    key: "03-primeiro-emprego",
    title: "Primeiro emprego em São Luís: o que montar antes de candidatar",
    type: "NEWS",
    template: "STANDARD",
    keyword: "primeiro emprego sao luis",
    section: "noticias",
    lead: "Sem carteira assinada prévia, o que pesa é pasta de documentos, currículo honesto e candidaturas alinhadas a auxiliar, atendimento e apoio. Este roteiro evita a semana perdida em anúncios impossíveis.",
    tips: [
      "Separe RG, CPF e comprovante de residência em fotos nítidas e pasta física.",
      "No currículo, inclua projetos escolares, voluntariado e ajudas reais em negócio familiar.",
      "Candidate-se a cargos de entrada com horário compatível com estudo, se ainda estudar.",
      "Treine uma apresentação de 45 segundos: quem você é, o que já fez, o que busca.",
      "Peça indicação só a quem viu você trabalhar de verdade — sem pagar “intermediário”.",
      "Anote cada envio: data, empresa, canal e resposta, para não reenviar o mesmo PDF cego."
    ],
    localAngle: "Jovens da capital competem forte por vagas de auxiliar; quem chega com documentos prontos e mensagem objetiva sai na frente.",
    coverHue: 20
  },
  {
    key: "04-cursos-curriculo",
    title: "Como colocar cursos no currículo sem parecer enchimento",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "cursos no curriculo emprego",
    section: "guia",
    lead: "Curso só ajuda se o recrutador entende o que você sabe fazer com ele. Em São Luís, listar dez certificados genéricos cansa mais do que destacar dois alinhados ao cargo.",
    tips: [
      "Priorize cursos ligados ao anúncio (atendimento, Excel, higiene, segurança do trabalho).",
      "Informe carga horária e ano — “curso de 4h em 2014” não precisa ocupar meia página.",
      "Escreva uma linha do que aprendeu aplicável: “planilha de controle de estoque”.",
      "Tire do topo cursos abandonados ou sem relação com a vaga atual.",
      "Se o certificado for online, esteja pronto para explicar o conteúdo em entrevista.",
      "Leve o PDF do certificado só se a empresa pedir — não anexe cinco arquivos no primeiro e-mail."
    ],
    localAngle: "Clínicas e lojas da capital valorizam curso curto e recente mais do que diploma decorativo sem prática.",
    coverHue: 28
  },
  {
    key: "05-marca-pessoal",
    title: "Marca pessoal barata e útil para candidato em São Luís",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "marca pessoal candidatura sao luis",
    section: "guia",
    lead: "Marca pessoal não exige influenciador: é foto limpa, nome consistente, tom profissional no WhatsApp e um histórico que bate com o que você conta na entrevista.",
    tips: [
      "Use o mesmo nome completo no currículo, e-mail e perfil profissional.",
      "Foto só se o canal pedir: fundo simples, roupa neutra, sem filtro exagerado.",
      "Revise status e destaques do WhatsApp se for o canal da vaga.",
      "Escreva uma bio de duas linhas: cargo-alvo + cidade + disponibilidade.",
      "Peça a um amigo para ler seu currículo em 20 segundos e dizer o que entendeu.",
      "Evite postar reclamação pública de processo seletivo com nome da empresa ainda em andamento."
    ],
    localAngle: "Em rede pequena como a da capital maranhense, reputação circula rápido — coerência vale mais que “posicionamento” forçado.",
    coverHue: 36
  },
  {
    key: "06-produtividade-busca",
    title: "Produtividade na busca de emprego: menos abas, mais retorno",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "produtividade busca de emprego",
    section: "guia",
    lead: "Abrir trinta vagas e candidatar-se em modo automático cansa e rende pouco. Um bloco diário com meta clara costuma gerar mais entrevista do que maratona de domingo.",
    tips: [
      "Defina 40–50 minutos focados: ler, adaptar, enviar, registrar.",
      "Limite a 5–8 candidaturas bem lidas por dia, não 25 genéricas.",
      "Desligue notificações de grupos barulhentos durante o bloco de busca.",
      "Separe “vagas quentes” (bateram 80% com você) das “talvez”.",
      "Termine cada sessão com uma mensagem ou follow-up pendente resolvido.",
      "Uma vez por semana, revise o que não gerou resposta e ajuste o PDF ou o tom."
    ],
    localAngle: "Quem divide o dia entre emprego atual e busca na capital precisa de bloco curto e repetível — não de noite em claro.",
    coverHue: 44
  },
  {
    key: "07-vagas-afirmativas",
    title: "Vagas afirmativas: como ler o anúncio e se candidatar com segurança",
    type: "NEWS",
    template: "STANDARD",
    keyword: "vagas afirmativas sao luis",
    section: "noticias",
    lead: "Anúncios voltados a mulheres, pessoas negras, PcD ou 50+ existem para corrigir barreiras — não para expor o candidato. Saiba identificar o critério e o canal oficial sem entregar dado sensível cedo demais.",
    tips: [
      "Confirme se a vaga declara o público-alvo de forma clara e legal.",
      "Candidate-se pelo canal do anúncio; desconfie de formulários pedindo laudo no primeiro clique.",
      "Prepare-se para falar de experiência e disponibilidade — a cota não substitui a entrevista.",
      "Pergunte sobre acessibilidade do posto se isso for condição para você trabalhar bem.",
      "Guarde o print do anúncio com data, caso a descrição mude depois.",
      "Se o processo misturar cobrança de taxa com “vaga inclusiva”, encerre na hora."
    ],
    localAngle: "Em São Luís, processos sérios de inclusão explicam o critério no texto; pressão por documento médico antes de qualquer conversa merece cautela.",
    coverHue: 52
  },
  {
    key: "08-ir-2026-trabalhador",
    title: "IR 2026 para quem trabalha de carteira: o básico sem pânico",
    type: "NEWS",
    template: "STANDARD",
    keyword: "imposto de renda 2026 trabalhador clt",
    section: "noticias",
    lead: "Quem recebe holerite precisa guardar informes e entender se está obrigado a declarar. Este texto não substitui contador, mas organiza o que o trabalhador CLT costuma precisar acompanhar na temporada 2026.",
    tips: [
      "Separe o informe de rendimentos da empresa assim que liberado — não deixe no e-mail perdido.",
      "Anote dependentes, pensão e despesas dedutíveis com nota fiscal válida.",
      "Confira se houve mais de uma fonte pagadora no ano (dois empregos, 13º antecipado).",
      "Desconfie de “desconto” de IR no PIX pedido por desconhecido no WhatsApp.",
      "Se a restituição cair, não compartilhe código de acesso do gov.br com “ajudante”.",
      "Em dúvida de obrigação, leve o informe a um profissional de confiança na capital."
    ],
    localAngle: "Filas de última hora em São Luís lotam: organizar papéis cedo evita correria e golpe de falsa “liberação de restituição”.",
    coverHue: 60
  },
  {
    key: "09-decimo-terceiro",
    title: "13º salário: o que o trabalhador CLT deve conferir no pagamento",
    type: "NEWS",
    template: "STANDARD",
    keyword: "decimo terceiro salario direitos",
    section: "noticias",
    lead: "O 13º aparece no holerite em parcelas e com descontos. Saber o que olhar evita surpresa e ajuda a planejar contas no fim do ano — sem cair em boato de grupo.",
    tips: [
      "Confira se a 1ª e a 2ª parcela batem com o período trabalhado no ano.",
      "Compare o valor bruto com a média salarial; anote horas extras se forem habituais.",
      "Veja descontos de INSS e IR retido — peça explicação se o número parecer absurdo.",
      "Guarde os holerites do 13º junto com o restante do ano.",
      "Não assine recibo em branco nem “acerto” verbal sem demonstrativo.",
      "Se houver atraso, registre a data e busque orientação em canal oficial de direitos."
    ],
    localAngle: "No comércio da capital, o 13º costuma coincidir com pico de movimento — peça o demonstrativo mesmo na correria de dezembro.",
    coverHue: 68
  },
  {
    key: "10-ferias-direitos",
    title: "Férias: como entender período aquisitivo e o que perguntar na admissão",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "ferias clt direitos trabalhador",
    section: "guia",
    lead: "Férias não são “favor” do chefe: há regras de período e pagamento. Antes de aceitar a vaga, pergunte como a empresa costuma marcar e comunicar as férias na prática.",
    tips: [
      "Pergunte se as férias costumam ser coletivas no setor ou individuais.",
      "Anote a data de admissão para calcular o período aquisitivo com calma depois.",
      "Confirme se o pagamento das férias vem com o adicional devido no demonstrativo.",
      "Evite combinar “vende tudo” só de boca — entenda abono em texto separado.",
      "Se já tiver férias vencidas no emprego atual, resolva isso antes de pedir demissão.",
      "Guarde conversas sobre marcação de férias (e-mail ou mensagem oficial)."
    ],
    localAngle: "Em serviços da capital, férias coletivas em períodos de baixa aparecem com frequência — alinhe expectativa na contratação.",
    coverHue: 76
  },
  {
    key: "11-abono-pecuniario",
    title: "Abono pecuniário: vender um terço das férias sem se perder no holerite",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "abono pecuniario ferias",
    section: "guia",
    lead: "Converter parte das férias em dinheiro (abono) é opção com regras. Entender o que você recebe e o que deixa de descansar evita arrependimento no mês seguinte.",
    tips: [
      "Peça por escrito o pedido de abono e a confirmação da empresa.",
      "Calcule se o valor resolve uma conta urgente ou só tapa buraco e cansa você.",
      "Confira no holerite a linha do abono separada do restante das férias.",
      "Não confunda abono com “banco de horas” improvisado sem registro.",
      "Se a liderança pressionar a vender férias todo ano, questione a cultura de sobrecarga.",
      "Guarde o demonstrativo: ele importa em acerto final e em dúvidas futuras."
    ],
    localAngle: "Trabalhadores do Maranhão que vendem férias por impulso muitas vezes voltam exaustos no pico de calor e de demanda — faça a conta completa.",
    coverHue: 84
  },
  {
    key: "12-ponto-atraso",
    title: "Ponto e atraso: o que costuma valer na prática do dia a dia",
    type: "NEWS",
    template: "STANDARD",
    keyword: "ponto eletronico atraso trabalho",
    section: "noticias",
    lead: "Atraso de poucos minutos vira desconto ou advertência conforme política da empresa. Conhecer o sistema de ponto e o trajeto real reduz atrito logo na primeira semana.",
    tips: [
      "Pergunte na admissão qual é a tolerância oficial e como o ponto é registrado.",
      "Teste o trajeto no horário da escala, não no domingo vazio.",
      "Avise com antecedência se o ônibus atrasar de forma excepcional — com registro.",
      "Não peça para colega “bater ponto” por você: isso gera problema sério.",
      "Guarde prints ou comprovantes se o sistema falhar ao registrar entrada.",
      "Se descontos parecerem inconsistentes, peça o espelho de ponto do mês."
    ],
    localAngle: "Chuva forte e trânsito na capital alteram o tempo de deslocamento — quem só olha o mapa no celular se surpreende na segunda-feira.",
    coverHue: 92
  },
  {
    key: "13-feriado-facultativo",
    title: "Feriado ou ponto facultativo: como isso muda sua escala",
    type: "NEWS",
    template: "STANDARD",
    keyword: "feriado ponto facultativo trabalho",
    section: "noticias",
    lead: "Nem todo dia “sem expediente” no calendário da cidade é feriado nacional com as mesmas regras. Saber a diferença evita briga de corredor e expectativa errada de pagamento.",
    tips: [
      "Confirme na empresa se o dia é feriado, facultativo ou expediente normal no seu contrato.",
      "Pergunte se quem trabalhar no feriado recebe compensação conforme a regra local da empresa.",
      "Não assuma folga só porque a prefeitura suspendeu atendimento ao público.",
      "Comércio e serviços podem abrir em dias em que repartições fecham — leia a escala.",
      "Anote combinações de banco de horas por escrito, não só no grupo do time.",
      "Em dúvida, peça à RH ou ao responsável um comunicado oficial do calendário."
    ],
    localAngle: "Em São Luís, datas locais e facultativos confundem quem veio de outro estado — alinhe a escala com o setor, não só com o calendário escolar.",
    coverHue: 100
  },
  {
    key: "14-ctps-digital",
    title: "CTPS digital: como conferir vínculos e anotações no celular",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "ctps digital carteira trabalho",
    section: "guia",
    lead: "A carteira de trabalho digital concentra vínculos e anotações. Saber onde olhar no app evita surpresa na admissão e ajuda a conferir se a empresa registrou o contrato.",
    tips: [
      "Baixe o app oficial e acesse com a conta gov.br — não compartilhe a senha.",
      "Confira se o vínculo novo aparece após a admissão no prazo combinado.",
      "Veja anotações de férias e afastamentos quando disponíveis.",
      "Tire print (com cuidado) se algo estiver errado e leve à empresa com educação.",
      "Desconfie de “atualização da CTPS” pedindo PIX ou dados de cartão.",
      "Mantenha o celular com espaço e rede estável no dia da admissão."
    ],
    localAngle: "Processos de admissão na capital pedem CTPS digital com frequência; chegar sem acesso ao gov.br atrasa o primeiro dia.",
    coverHue: 108
  },
  {
    key: "15-auxiliar-administrativo",
    title: "Auxiliar administrativo: o que mostrar além de “sou organizado”",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "auxiliar administrativo vagas sao luis",
    section: "guia",
    lead: "A vaga de auxiliar administrativo mistura e-mail, arquivo, telefone e planilha. Quem descreve rotinas concretas conquista mais entrevista do que quem só lista soft skills genéricas.",
    tips: [
      "Cite sistemas que já usou (mesmo básicos): Excel, Google Drive, ERP simples.",
      "Conte um exemplo de arquivo que você organizou e o problema que isso evitou.",
      "Mostre experiência com telefone e WhatsApp profissional, se tiver.",
      "Destaque confidencialidade: dados de cliente e folha não são assunto de corredor.",
      "Prepare-se para teste prático curto de planilha ou redação de e-mail.",
      "Pergunte na entrevista o volume típico de demandas do setor."
    ],
    localAngle: "Escritórios e clínicas em São Luís buscam auxiliar que segure rotina sem supervisão constante — prove com exemplos, não com adjetivos.",
    coverHue: 116
  },
  {
    key: "16-entrevista-video",
    title: "Entrevista por vídeo: checklist técnico e de postura",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "entrevista por video emprego",
    section: "guia",
    lead: "Boa resposta some se o áudio estoura ou a câmera aponta para o teto. Cinco minutos de teste mudam a impressão em processos híbridos e remotes da capital.",
    tips: [
      "Teste câmera, microfone e internet 15 minutos antes — no mesmo aparelho da call.",
      "Escolha fundo neutro e luz na frente do rosto, não atrás da janela.",
      "Use fone se o ambiente tiver barulho de rua ou ventilador forte.",
      "Olhe para a câmera ao cumprimentar; tenha o currículo impresso ao lado.",
      "Feche abas e notificações que possam aparecer na tela compartilhada.",
      "Se a conexão cair, avise por mensagem curta e proponha religar em dois minutos."
    ],
    localAngle: "Em São Luís, queda de sinal no meio da entrevista acontece; ter plano B (dados móveis) demonstra profissionalismo.",
    coverHue: 124
  },
  {
    key: "17-respostas-comportamentais",
    title: "Respostas comportamentais: método simples para não travar",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "entrevista comportamental exemplos",
    section: "guia",
    lead: "Perguntas do tipo “conte uma situação difícil” não pedem novela: pedem contexto, ação e resultado. Treine três histórias curtas do seu passado real.",
    tips: [
      "Use a estrutura situação → tarefa → ação → resultado em 60–90 segundos.",
      "Escolha exemplos de fila, prazo, erro corrigido ou conflito resolvido com respeito.",
      "Evite culpar ex-colegas; foque no que você fez de concreto.",
      "Prepare uma história de aprendizado: o que mudaria se repetisse a cena.",
      "Se não tiver emprego formal, use escola, voluntariado ou negócio familiar.",
      "Ensaie em voz alta — resposta só na cabeça costuma enrolar na hora."
    ],
    localAngle: "Recrutadores locais valorizam clareza sob pressão do dia a dia mais do que jargão de livro de carreira.",
    coverHue: 132
  },
  {
    key: "18-pedir-salario",
    title: "Como falar de pretensão salarial sem chute nem medo",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "pretensao salarial entrevista",
    section: "guia",
    lead: "Pedir um número sem pesquisa ou aceitar qualquer valor na hora são extremos ruins. Monte uma faixa realista considerando cargo, escala e custo de deslocamento na capital.",
    tips: [
      "Pesquise faixas de vagas semelhantes no portal antes da entrevista.",
      "Some passagem, almoço e tempo de trajeto ao cálculo do “líquido real”.",
      "Fale em faixa (“entre X e Y”) e pergunte a faixa orçada da empresa.",
      "Se pedirem número cedo demais, diga que prefere entender o pacote completo.",
      "Não invente proposta concorrente falsa — a cidade é pequena para mentira.",
      "Anote o combinado por escrito após a oferta verbal."
    ],
    localAngle: "Em São Luís, o mesmo salário bruto muda de sentido com duas conduções por dia — leve isso para a conversa com educação.",
    coverHue: 140
  },
  {
    key: "19-beneficios-vaga",
    title: "Benefícios além do salário: o que comparar no anúncio",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "beneficios vaga emprego vale transporte",
    section: "dados",
    lead: "Vale-transporte, refeição, plano de saúde e cesta aparecem de formas diferentes. Comparar só o bruto esconde o que sobra no fim do mês para quem trabalha na capital.",
    tips: [
      "Liste benefícios em coluna ao lado do salário bruto de cada proposta.",
      "Confirme se VT cobre o trajeto real ou só parte do valor.",
      "Pergunte carência e coparticipação de plano de saúde, se houver.",
      "Esclareça se refeição é vale, refeitório ou “por conta própria”.",
      "Desconfie de benefício “a combinar” que nunca vira número no contrato.",
      "Inclua estabilidade de horário como fator — hora extra sem controle custa saúde."
    ],
    localAngle: "No Maranhão, VT e alimentação pesam no orçamento de quem mora longe do posto — peça detalhe na proposta.",
    coverHue: 148
  },
  {
    key: "20-trabalho-hibrido",
    title: "Trabalho híbrido na capital: o que confirmar antes de aceitar",
    type: "NEWS",
    template: "STANDARD",
    keyword: "trabalho hibrido sao luis",
    section: "noticias",
    lead: "“Híbrido” no título às vezes significa um dia remoto — ou quase nenhum. Confirme frequência, equipamento e política de presença para não descobrir na segunda semana.",
    tips: [
      "Pergunte quantos dias presenciais por semana são regra, não exceção.",
      "Confirme se a empresa fornece notebook ou se o uso é do seu equipamento.",
      "Esclareça reuniões obrigatórias no escritório e aviso prévio de mudança de escala.",
      "Teste internet e espaço em casa com honestidade antes de aceitar.",
      "Desconfie de remoto total com salário irreal e seleção só por PIX.",
      "Calcule o custo dos dias presenciais (passagem e tempo) na proposta."
    ],
    localAngle: "A maior parte do comércio e serviços em São Luís segue presencial; híbrido aparece mais em escritórios — leia o anúncio sem romantizar.",
    coverHue: 156
  },
  {
    key: "21-golpes-emprego",
    title: "Golpes de emprego: sinais de alerta antes do PIX",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "golpe vaga de emprego sao luis",
    section: "guia",
    lead: "Golpista explora pressa: taxa de crachá, kit, curso obrigatório pago ao “recrutador” ou pedido de selfie com documento no primeiro contato. Pare e valide a empresa.",
    tips: [
      "Nunca pague para candidatar-se, “liberar” vaga ou receber uniforme antecipado.",
      "Confira se o nome da empresa e o canal batem com o anúncio público.",
      "Recuse envio de foto de documento e dados bancários na triagem inicial.",
      "Desconfie de oferta com salário alto, zero requisito e urgência artificial.",
      "Guarde prints e interrompa se a conversa virar ameaça ou chantagem.",
      "Prefira candidatar-se pelo canal listado no Empregos São Luís."
    ],
    localAngle: "Grupos de WhatsApp da região concentram anúncios falsos de “vaga garantida” — trate taxa como sinal vermelho absoluto.",
    coverHue: 164
  },
  {
    key: "22-documentos-admissao",
    title: "Documentos de admissão: pasta pronta para o dia D",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "documentos admissao emprego maranhao",
    section: "guia",
    lead: "A empresa liga pedindo tudo “para ontem”. Quem já tem pasta digital e física evita perder a vaga por comprovante vencido ou foto ilegível.",
    tips: [
      "RG ou CNH, CPF e comprovante de residência com menos de 90 dias, se pedido.",
      "Dados bancários só na etapa formal — nunca em formulário duvidoso de triagem.",
      "Organize PDFs com nomes claros: “rg-frente.pdf”, “comprovante-jun2026.pdf”.",
      "Leve cópia e original no dia presencial, conforme orientação da RH.",
      "Inclua certificados só se forem relevantes ao cargo.",
      "Não envie documento sensível a número que não confere com o anúncio."
    ],
    localAngle: "Admissões de comércio na capital costumam ser rápidas; atraso de documento empurra a data de início e o primeiro pagamento.",
    coverHue: 172
  },
  {
    key: "23-networking-local",
    title: "Networking sem constrangimento: pedidos que as pessoas respondem",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "networking emprego sao luis",
    section: "guia",
    lead: "“Me arruma qualquer coisa” cansa a rede. Pedido específico, currículo anexo e mensagem fácil de encaminhar aumentam a chance de indicação útil na capital.",
    tips: [
      "Cite o cargo e o tipo de empresa que você busca em uma frase.",
      "Anexe PDF leve e diga que pode mandar versão adaptada.",
      "Ofereça um texto pronto para a pessoa encaminhar ao contato dela.",
      "Agradeça mesmo quando a resposta for “não conheço vaga agora”.",
      "Mantenha contato leve: não cobre diariamente quem já ajudou.",
      "Reciprocidade: compartilhe vagas boas quando souber, sem esperar retorno imediato."
    ],
    localAngle: "Indicação ainda move muita contratação em São Luís — mas indicação boa é específica, não genérica.",
    coverHue: 180
  },
  {
    key: "24-retorno-ao-trabalho",
    title: "Voltar ao mercado após pausa: como explicar o gap no currículo",
    type: "NEWS",
    template: "STANDARD",
    keyword: "retorno ao mercado de trabalho",
    section: "noticias",
    lead: "Pausa por cuidado familiar, saúde ou estudo não precisa virar romance nem mentira. Uma frase honesta e foco no que você entrega agora costumam bastar.",
    tips: [
      "Explique o intervalo em uma linha no currículo ou na entrevista — sem excesso de detalhe íntimo.",
      "Mostre o que manteve ativo: curso, freela pontual, rotina de cuidado com organização.",
      "Atualize telefone, e-mail e cidade; gap com contato morto dobra a rejeição.",
      "Candidate-se primeiro a vagas alinhadas ao último nível de experiência real.",
      "Treine a resposta para não soar defensivo nem pedindo desculpas demais.",
      "Peça referências a quem pode falar do seu trabalho antes da pausa."
    ],
    localAngle: "Recrutadores da capital veem gaps com frequência; o problema é a história confusa, não a pausa em si.",
    coverHue: 188
  },
  {
    key: "25-seguranca-mulheres",
    title: "Segurança de candidatas: entrevistas e deslocamentos com menos risco",
    type: "NEWS",
    template: "STANDARD",
    keyword: "seguranca candidatas entrevista emprego",
    section: "noticias",
    lead: "Entrevista em endereço estranho, fora do horário comercial, sem empresa clara é sinal vermelho. Combine localização, avise alguém de confiança e exija canal oficial.",
    tips: [
      "Confirme razão social, endereço comercial e horário comercial da conversa.",
      "Evite processos que pedem encontro em residência ou hotel sem vínculo claro.",
      "Avise familiar ou amiga do local, horário e nome de quem vai receber você.",
      "Prefira deslocamento diurno; se for noite, avalie transporte e companhia.",
      "Recuse pedido de foto íntima, vídeo “teste” invasivo ou dado bancário cedo.",
      "Se algo soar errado no local, saia e registre o ocorrido com prints."
    ],
    localAngle: "Em São Luís, exija local identificável e anúncio rastreável — pressa do “só hoje à noite” não é critério de seleção sério.",
    coverHue: 196
  },
  {
    key: "26-inclusao-pcd",
    title: "Inclusão e PcD: perguntas práticas sobre o posto de trabalho",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas pcd inclusao emprego",
    section: "guia",
    lead: "Inclusão de verdade é condição de trabalho, não discurso. Pergunte sobre acesso, transporte interno, pausas e adaptação do posto com objetividade.",
    tips: [
      "Leia se a vaga é exclusiva PcD ou ampla concorrência com cota.",
      "Pergunte sobre acessibilidade do prédio, banheiro e posto antes de aceitar.",
      "Envie laudo só quando a etapa oficial pedir — e por canal seguro.",
      "Combine necessidades de adaptação sem minimizar e sem exagerar.",
      "Peça o nome do responsável pelo processo, não só um número anônimo.",
      "Se houver barreira não resolvida, documente a conversa para decidir com clareza."
    ],
    localAngle: "Na capital maranhense, pergunte o caminho real até o posto (degrau, elevador, transporte) — mapa bonito não garante acesso.",
    coverHue: 204
  },
  {
    key: "27-freela-vs-clt",
    title: "Freela ou CLT: o que comparar antes de escolher o vínculo",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "freelancer ou clt vantagens",
    section: "guia",
    lead: "CLT traz direitos e descontos; freela pode pagar mais no dia e zero proteção no mês seguinte. Faça a conta completa antes de trocar estabilidade por “liberdade” mal definida.",
    tips: [
      "Some impostos, INSS e períodos sem demanda no cálculo do freela.",
      "Peça escopo, prazo e valor por escrito antes de começar serviço avulso.",
      "Na CLT, confira benefícios e escala — não só o bruto anunciado.",
      "Desconfie de “PJ” forçado para função com horário fixo de empregado.",
      "Mantenha reserva financeira se a renda for variável.",
      "Não misture freela com emprego atual usando tempo e equipamento do patrão sem acordo."
    ],
    localAngle: "Na região, muitos “bicos” viram rotina sem contrato; combine valor e data de pagamento antes de entregar o serviço.",
    coverHue: 212
  },
  {
    key: "28-erros-pdf-curriculo",
    title: "Erros de PDF no currículo que eliminam candidato bom",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "curriculo pdf erros comuns",
    section: "guia",
    lead: "Arquivo pesado, texto como imagem e nome “curriculo-final-final2.pdf” atrapalham. Pequenos ajustes técnicos salvam triagem em celular e notebook.",
    tips: [
      "Nomeie o arquivo com nome e cargo: “Maria-Silva-auxiliar-admin.pdf”.",
      "Mantenha o PDF abaixo de 1–2 MB sem fundo colorido pesado.",
      "Garanta texto selecionável — não só foto de folha impressa.",
      "Use fonte legível e margem que não corte no preview do WhatsApp.",
      "Revise telefone com DDD 98 e e-mail sem erro de digitação.",
      "Abra o PDF no celular antes de enviar; se você não lê, o recrutador também não."
    ],
    localAngle: "Recrutadores de São Luís leem muitos currículos no telefone entre uma tarefa e outra — legibilidade vence design carregado.",
    coverHue: 220
  },
  {
    key: "29-email-pitch",
    title: "E-mail de candidatura: assunto e corpo que abrem resposta",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "email de candidatura modelo",
    section: "guia",
    lead: "Assunto “currículo” some na caixa. Um e-mail curto com cargo, onde viu a vaga e PDF nomeado trabalha a seu favor em processos da capital.",
    tips: [
      "Assunto: “Candidatura — [cargo] — [seu nome]”.",
      "Primeiro parágrafo: quem você é e para qual vaga está escrevendo.",
      "Segundo: 2–3 provas de adequação (experiência ou formação).",
      "Feche com telefone/WhatsApp e disponibilidade para conversa.",
      "Anexe um PDF só — evite cinco certificados no primeiro contato.",
      "Releia em voz alta; tom educado e direto vence texto de novela."
    ],
    localAngle: "Empresas locais ainda usam e-mail formal misturado a WhatsApp — ter os dois canais coerentes evita perda de retorno.",
    coverHue: 228
  },
  {
    key: "30-dinamica-grupo",
    title: "Dinâmica de grupo: como participar sem forçar liderança falsa",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "dinamica de grupo entrevista dicas",
    section: "guia",
    lead: "Dinâmica observa colaboração, escuta e clareza — não quem fala mais alto. Participar bem é contribuir e deixar espaço, não monopolizar o flipchart.",
    tips: [
      "Ouça a proposta inteira antes de discordar; reformule o que entendeu.",
      "Ofereça uma ideia concreta e pergunte a opinião de quem falou pouco.",
      "Evite interromper e evite ficar em silêncio absoluto o tempo todo.",
      "Se for líder espontâneo, distribua tarefas em vez de centralizar.",
      "Cuide do tempo: proponha fechar a discussão dois minutos antes do fim.",
      "Ao final, resuma o combinado do grupo em uma frase clara."
    ],
    localAngle: "Processos de redes e call centers na capital usam dinâmica com frequência — colaboração visível pesa mais que discurso de “líder nato”.",
    coverHue: 236
  },
  {
    key: "31-testes-online",
    title: "Testes online de seleção: o que fazer antes do cronômetro",
    type: "NEWS",
    template: "STANDARD",
    keyword: "teste online processo seletivo",
    section: "noticias",
    lead: "Teste de lógica, português ou Excel com tempo limitado pune improviso. Ambiente calmo, carregador e leitura atenta do enunciado valem mais que chute nervoso.",
    tips: [
      "Leia o e-mail do teste até o fim: prazo, duração e regras de tentativa.",
      "Faça em local quieto com internet estável e aparelho carregado.",
      "Não peça para outra pessoa responder — inconsistência aparece na entrevista.",
      "Se houver exemplo, use-o para entender o formato antes de começar.",
      "Gerencie o tempo: não trave 10 minutos em uma questão difícil.",
      "Tire print da confirmação de envio caso o sistema falhe."
    ],
    localAngle: "Candidatos da capital perdem teste por queda de luz ou dados móveis instáveis — tenha plano B de conexão.",
    coverHue: 244
  },
  {
    key: "32-ler-holerite",
    title: "Holerite sem mistério: bruto, descontos e o que conferir todo mês",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "como ler holerite descontos",
    section: "guia",
    lead: "O demonstrativo de pagamento mostra salário bruto, descontos e líquido. Conferir todo mês evita descobrir erro só quando a conta não fecha.",
    tips: [
      "Identifique salário base, horas extras e adicionais separados.",
      "Confira INSS e IR retido; anote se o valor saltou sem motivo aparente.",
      "Veja faltas, atrasos e DSR — peça o espelho de ponto se discordar.",
      "Guarde PDF ou foto legível de cada mês em pasta organizada.",
      "Compare o líquido depositado com o valor do holerite no mesmo dia.",
      "Em dúvida, pergunte à RH com educação e com o documento em mãos."
    ],
    localAngle: "Trabalhadores em São Luís que guardam holerite desde o primeiro mês resolvem acerto final com bem menos estresse.",
    coverHue: 252
  },
  {
    key: "33-pedido-demissao",
    title: "Pedido de demissão: aviso prévio, acerto e postura na saída",
    type: "NEWS",
    template: "STANDARD",
    keyword: "pedido de demissao aviso previo",
    section: "noticias",
    lead: "Sair do emprego pede comunicação clara, cuidado com o aviso e organização do acerto. Queimar ponte na cidade pequena custa caro no próximo processo.",
    tips: [
      "Comunique a decisão primeiro à liderança, não ao grupo do WhatsApp da equipe.",
      "Entenda se cumprirá aviso trabalhado ou as condições do acerto.",
      "Peça previsão de documentos e datas de pagamento das verbas.",
      "Devolva uniformes e equipamentos com protocolo simples.",
      "Evite xingar a empresa em público enquanto o acerto está em aberto.",
      "Guarde holerites e termo de rescisão para consulta futura."
    ],
    localAngle: "No mercado da capital, reputação de saída educada volta como indicação — ou como bloqueio silencioso.",
    coverHue: 260
  },
  {
    key: "34-escala-6x1",
    title: "Escala 6x1: perguntas essenciais antes de aceitar a vaga",
    type: "NEWS",
    template: "STANDARD",
    keyword: "escala 6x1 direitos folga",
    section: "noticias",
    lead: "Trabalhar seis dias e folgar um muda sono, deslocamento e vida familiar. Antes de aceitar, confirme folga, feriados e como a empresa trata hora extra.",
    tips: [
      "Pergunte qual dia da folga costuma cair e se rotaciona.",
      "Confirme carga horária diária e intervalo de refeição.",
      "Esclareça trabalho em feriado e compensação praticada.",
      "Calcule sete dias de passagem e cansaço no orçamento pessoal.",
      "Peça a escala por escrito ou print oficial, não só “a gente vê depois”.",
      "Se a resposta for evasiva, trate como risco de sobrecarga."
    ],
    localAngle: "Comércio e alimentação em São Luís usam 6x1 com frequência — alinhe expectativa de domingo e feriado na entrevista.",
    coverHue: 268
  },
  {
    key: "35-alimentacao-servicos",
    title: "Vagas em alimentação: higiene, pico e o que perguntar no salão",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas restaurante lanchonete sao luis",
    section: "guia",
    lead: "Cozinha e salão pedem ritmo, higiene e tolerância a pico. Entender uniforme, gorjeta e pausa evita surpresa no primeiro sábado movimentado.",
    tips: [
      "Pergunte se o valor inclui gorjeta ou se é só salário-base.",
      "Confirme fornecimento de uniforme e regras de apresentação.",
      "Esclareça pausa para refeição e local onde a equipe come.",
      "Prepare-se para falar de experiência com calor, fila e pressão educada.",
      "Leve cabelo preso e unhas adequadas se a entrevista for prática.",
      "Desconfie de “ajuda” sem registro quando a rotina é de empregado fixo."
    ],
    localAngle: "Bares e lanchonetes da capital vivem de fim de semana; pergunte a escala real, não só a segunda a sexta do anúncio.",
    coverHue: 276
  },
  {
    key: "36-servicos-gerais-epi",
    title: "Serviços gerais e EPI: escopo da função e proteção no posto",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "servicos gerais epi vaga",
    section: "guia",
    lead: "“Faz de tudo” sem lista vira sobrecarga. Pergunte tarefas, produtos químicos e se a empresa fornece EPI adequado ao risco do posto.",
    tips: [
      "Peça a lista do que está dentro e fora do escopo no primeiro dia.",
      "Confirme se luvas, calçado e outros EPIs são fornecidos sem desconto ilegal.",
      "Recuse improvisar proteção com saco plástico quando o risco for real.",
      "Reporte produto sem rótulo ou treinamento — não “se vire” em silêncio.",
      "Anote jornada e intervalo; serviços gerais também têm limite de carga.",
      "Se o anúncio misturar limpeza com obra pesada, esclareça antes de aceitar."
    ],
    localAngle: "Condomínios e empresas da capital pedem serviços gerais com demandas distintas — escopo claro protege salário e saúde.",
    coverHue: 284
  },
  {
    key: "37-plano-semanal-busca",
    title: "Plano semanal de busca: segunda a sábado com meta realista",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "plano semanal busca de emprego",
    section: "guia",
    lead: "Busca sem calendário vira culpa. Um plano leve de seis dias — com meta de candidaturas de qualidade — sustenta ritmo sem esgotar a semana.",
    tips: [
      "Segunda: atualize currículo e liste 10 vagas alinhadas.",
      "Terça e quarta: envie 4–6 candidaturas bem adaptadas por dia.",
      "Quinta: treine entrevista e revise mensagens sem resposta.",
      "Sexta: follow-up educado e organização da pasta de documentos.",
      "Sábado: só 30 minutos de revisão — sem maratona ansiosa.",
      "Domingo: descanse de verdade; mente cansada escreve e-mail ruim."
    ],
    localAngle: "Quem busca vaga em São Luís conciliando bico ou estudo precisa de plano curto; consistência vence sprint único.",
    coverHue: 292
  },
  {
    key: "38-usar-portal-es",
    title: "Como usar o Empregos São Luís: do filtro à candidatura segura",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "como usar empregos sao luis portal",
    section: "guia",
    lead: "O portal concentra vagas da capital e do estado com canal oficial no anúncio. Usar filtro, ler a descrição completa e evitar atalho de grupo paralelo reduz golpe e tempo perdido.",
    tips: [
      "Filtre por cidade e palavra-chave do cargo antes de abrir vinte abas.",
      "Leia requisitos, horário e forma de candidatura até o fim.",
      "Candidate-se só pelo canal indicado na publicação.",
      "Salve o link da vaga e a data do envio no seu controle pessoal.",
      "Volte ao portal em horários diferentes — anúncios novos entram ao longo da semana.",
      "Se algo pedir pagamento para “prioridade no site”, trate como fraude."
    ],
    localAngle: "O Empregos São Luís é ponto de partida gratuito; o risco aumenta quando alguém tira você do canal oficial da vaga.",
    coverHue: 300
  },
  {
    key: "39-entrevista-presencial",
    title: "Entrevista presencial na capital: trajeto, horário e primeira impressão",
    type: "NEWS",
    template: "STANDARD",
    keyword: "entrevista presencial dicas sao luis",
    section: "noticias",
    lead: "Chegar ofegante ou 40 minutos adiantado demais atrapalha. Conhecer o endereço, ter margem para imprevisto e entrar composto muda o começo da conversa.",
    tips: [
      "Confirme endereço, ponto de referência e nome de quem vai receber você.",
      "Saia com margem para trânsito e chuva; chegue cerca de 10 minutos antes.",
      "Leve documento, currículo impresso e caneta em pasta simples.",
      "Desligue o som do celular antes de entrar na sala.",
      "Cumprimente a recepção com o mesmo respeito da entrevista.",
      "Ao sair, anote nomes e próximos passos combinados."
    ],
    localAngle: "Endereços na capital às vezes confundem quem usa só o pin do mapa — ligue e confirme o acesso do prédio se estiver na dúvida.",
    coverHue: 308
  },
  {
    key: "40-setores-vagas",
    title: "Setores com mais abertura de vagas: como priorizar a busca",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "setores com mais vagas sao luis",
    section: "dados",
    lead: "Comércio, serviços, alimentação e apoio administrativo concentram boa parte dos anúncios visíveis. Priorizar setores alinhados ao seu perfil rende mais do que candidatar-se a tudo.",
    tips: [
      "Separe setores em “forte encaixe”, “possível” e “só se adaptar”.",
      "Observe quais cargos se repetem na sua região de deslocamento viável.",
      "Ajuste o currículo ao jargão do setor (PDV, estoque, recepção, limpeza).",
      "Não ignore vaga de meio período se ela encaixa estudo ou segundo turno.",
      "Cruze setor com escala: alimentação no fim de semana exige outra rotina.",
      "Revise a prioridade a cada duas semanas conforme o que está saindo no portal."
    ],
    localAngle: "Em São Luís, quem mora longe dos corredores comerciais precisa incluir tempo de ônibus na escolha do setor — não só o salário do anúncio.",
    coverHue: 316
  },
  {
    key: "41-experiencia-informal",
    title: "Experiência informal no currículo: como descrever sem inventar cargo",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "experiencia informal curriculo",
    section: "guia",
    lead: "Ajudar no negócio da família ou fazer bico conta se você descreve tarefas reais. Título inflado (“gerente”) sem responsabilidade clara cai na primeira pergunta.",
    tips: [
      "Use cargo honesto: “auxiliar de loja (negócio familiar)” ou “atendimento avulso”.",
      "Liste tarefas com verbos: organizou, atendeu, controlou, entregou.",
      "Informe período aproximado e se foi contínuo ou eventual.",
      "Prepare exemplos concretos para a entrevista — números simples ajudam.",
      "Não invente CNPJ ou carteira se não houve registro.",
      "Peça a alguém que viu seu trabalho para ser referência informal."
    ],
    localAngle: "Muita gente na capital começa no informal; honestidade com tarefas bem descritas costuma ser bem recebida.",
    coverHue: 324
  },
  {
    key: "42-whatsapp-candidatura",
    title: "Candidatura por WhatsApp: mensagem curta que não queima a chance",
    type: "NEWS",
    template: "STANDARD",
    keyword: "candidatura whatsapp emprego",
    section: "noticias",
    lead: "WhatsApp é canal comum em vagas locais. Áudio longo e foto de RG no primeiro contato atrapalham; mensagem objetiva e PDF limpo abrem conversa melhor.",
    tips: [
      "Comece com nome, cargo da vaga e onde viu o anúncio.",
      "Envie o currículo em PDF nomeado — evite foto torta de papel.",
      "Não mande sticker, áudio de dois minutos nem “oi” isolado.",
      "Espere horário comercial para o primeiro contato, salvo indicação contrária.",
      "Se pedirem pagamento pelo chat, encerre e registre o print.",
      "Mantenha o tom profissional mesmo se o recrutador for informal."
    ],
    localAngle: "No Maranhão, WhatsApp acelera processo sério — e também golpe; o texto do anúncio continua sendo a âncora de segurança.",
    coverHue: 332
  },
  {
    key: "43-comercio-servicos",
    title: "Comércio e serviços: o que os anúncios repetem sobre perfil",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "vagas comercio servicos sao luis",
    section: "dados",
    lead: "Anúncios de loja, clínica e atendimento repetem disponibilidade, boa comunicação e organização. Ler o padrão ajuda a montar currículo e a escolher processo com encaixe real.",
    tips: [
      "Destaque experiência com público, caixa ou telefone se tiver.",
      "Deixe clara a disponibilidade de sábado quando o setor exigir.",
      "Mostre deslocamento viável até o bairro da vaga.",
      "Prepare exemplos de paciência com reclamação e fila.",
      "Compare benefícios entre lojas do mesmo corredor antes de aceitar.",
      "Registre quais requisitos se repetem na sua planilha semanal."
    ],
    localAngle: "Corredores comerciais de São Luís pedem ritmo de fim de semana; quem só quer horário de escritório precisa filtrar melhor o setor.",
    coverHue: 340
  },
  {
    key: "44-transporte-entrevista",
    title: "Transporte até a entrevista: planejar trajeto para não chegar atrasado",
    type: "NEWS",
    template: "STANDARD",
    keyword: "transporte entrevista emprego sao luis",
    section: "noticias",
    lead: "Atraso na primeira conversa mancha a impressão mesmo com bom currículo. Testar o trajeto no horário real e ter plano B de condução é parte da preparação.",
    tips: [
      "Veja linhas e tempo no horário da entrevista, não à tarde livre.",
      "Saia com margem para chuva e trânsito — especialmente em segunda.",
      "Tenha crédito ou QR de transporte pronto na noite anterior.",
      "Salve o telefone do contato para avisar atraso excepcional.",
      "Evite chegar tão cedo a ponto de atrapalhar a rotina da recepção.",
      "Se o local for de difícil acesso, peça ponto de referência no dia anterior."
    ],
    localAngle: "Deslocamento na capital muda com chuva e horário de pico — tratar o trajeto como ensaio evita desculpa na porta.",
    coverHue: 348
  },
  {
    key: "45-panorama-candidaturas",
    title: "Panorama da candidatura: volume versus qualidade na busca local",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "quantas vagas candidatar por semana",
    section: "dados",
    lead: "Mais envios não significam mais entrevistas. Um panorama simples — quantas vagas você lê, adapta e acompanha — mostra se a semana está produtiva ou só cansativa.",
    tips: [
      "Conte candidaturas enviadas, respostas e entrevistas em uma planilha mínima.",
      "Se a taxa de resposta for perto de zero, revise PDF e mensagem antes de aumentar volume.",
      "Separe vagas “encaixe alto” das de disparo genérico.",
      "Limite follow-ups a um por processo, com intervalo razoável.",
      "Compare semanas: qualidade sobe quando você lê o anúncio até o fim.",
      "Use o portal como fonte principal e trate grupos como ruído a filtrar."
    ],
    localAngle: "Candidatos na região que medem o próprio funil (envio → resposta → entrevista) ajustam a busca mais rápido do que quem só “manda currículo o dia todo”.",
    coverHue: 356
  },
  {
    key: "46-linkedin-candidato",
    title: "LinkedIn para candidato em São Luís: perfil que gera conversa",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "linkedin candidato emprego sao luis",
    section: "guia",
    lead: "Perfil vazio ou cheio de frase motivacional atrai pouco. Em processos locais, um LinkedIn útil tem cargo-alvo claro, experiências com resultado e foto sóbria — e serve de reforço ao PDF, não de substituto.",
    tips: [
      "Escreva o título com o cargo que você busca, não só o último emprego genérico.",
      "Resuma em três linhas o que você entrega: setor, força e disponibilidade de cidade.",
      "Liste experiências com verbos e um resultado simples (volume, prazo, melhoria).",
      "Peça recomendações só a quem trabalhou com você de verdade.",
      "Ative alertas de vaga com palavra-chave realista para São Luís e Maranhão.",
      "Não copie texto de influenciador: recrutador local reconhece discurso genérico."
    ],
    localAngle: "Nem toda vaga da capital começa no LinkedIn, mas RH de escritório e clínicas costuma olhar o perfil depois do currículo — incoerência entre os dois fecha porta.",
    coverHue: 0
  },
  {
    key: "47-follow-up-entrevista",
    title: "Follow-up após entrevista: quando mandar e o que escrever",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "follow up apos entrevista emprego",
    section: "guia",
    lead: "Silêncio depois da conversa gera ansiedade — e mensagem diária irrita. Um follow-up curto, no prazo combinado, reforça interesse sem pressão teatral.",
    tips: [
      "Anote na saída se combinaram prazo de retorno; espere esse prazo antes de cobrar.",
      "Se não houve prazo, espere 5–7 dias úteis para a primeira mensagem educada.",
      "Agradeça, cite o cargo e relembre um ponto forte alinhado à vaga em duas frases.",
      "Pergunte se precisam de algum documento adicional — oferece utilidade, não só cobrança.",
      "Um follow-up basta; o segundo só se o próprio recrutador abrir nova janela.",
      "Guarde o print do envio e do anúncio original para referência futura."
    ],
    localAngle: "Processos em São Luís misturam WhatsApp e e-mail; use o mesmo canal da conversa oficial e mantenha tom profissional mesmo no chat.",
    coverHue: 1
  },
  {
    key: "48-rejeicao-candidatura",
    title: "Rejeição na seleção: como reagir sem travar a busca inteira",
    type: "NEWS",
    template: "STANDARD",
    keyword: "rejeicao processo seletivo dicas",
    section: "noticias",
    lead: "Não ser chamado não significa “inútil”. Significa que naquela rodada outro perfil encaixou — ou que o processo nem chegou a ler todo mundo. Separar ego de aprendizado mantém a semana produtiva.",
    tips: [
      "Espere 24 horas antes de reescrever o currículo por impulso após um “não”.",
      "Peça feedback só se o canal for aberto e a relação já existir; aceite silêncio.",
      "Compare o anúncio com o seu PDF: o gap costuma estar em ferramenta ou escala.",
      "Registre a rejeição na planilha sem drama — volume sem registro vira paranoia.",
      "Candidate-se a outra vaga alinhada no mesmo dia, em dose curta.",
      "Evite desabafar com nome da empresa em rede pública enquanto outros processos rolam."
    ],
    localAngle: "Na capital, a mesma rede de varejo abre várias vezes no ano; queimar a marca por um “não” atrapalha a próxima janela.",
    coverHue: 2
  },
  {
    key: "49-primeira-semana-emprego",
    title: "Primeira semana no emprego novo: o que observar e anotar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "primeira semana emprego novo",
    section: "guia",
    lead: "Os primeiros dias definem ritmo, ponto e relações. Observar mais do que opinar — e anotar senhas, fluxos e nomes — reduz erro caro na semana dois.",
    tips: [
      "Confirme horário de entrada, intervalo e quem aprova falta ou atraso.",
      "Anote o fluxo de tarefas críticas antes de sugerir “melhoria” no dia um.",
      "Peça o organograma informal: quem resolve o quê na prática.",
      "Guarde holerite e comunicado de benefícios desde o primeiro pagamento.",
      "Apresente-se à recepção e a setores vizinhos com educação — eles destravam rotina.",
      "Se algo do contrato divergir do combinado verbal, pergunte cedo e por escrito."
    ],
    localAngle: "Em lojas e clínicas de São Luís, a primeira semana costuma ser treinamento na correria; quem anota o básico sofre menos no sábado de pico.",
    coverHue: 3
  },
  {
    key: "50-pedir-aumento",
    title: "Pedir aumento com argumentos: preparação sem ultimato",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "como pedir aumento salario clt",
    section: "guia",
    lead: "Aumento raro cai do céu. Pedido bem preparado — com entregas, mercado e momento da empresa — conversa melhor do que ameaça de demissão inventada.",
    tips: [
      "Liste entregas dos últimos 6–12 meses com impacto (prazo, volume, qualidade).",
      "Pesquise faixas de vagas semelhantes na região antes de citar número.",
      "Marque conversa com a liderança, não jogue o pedido no grupo da equipe.",
      "Ouça o “não” completo: às vezes há data de revisão ou meta intermediária.",
      "Evite comparar salário de colega em público — foque no seu pacote e escopo.",
      "Se a resposta for definitiva, decida com calma se busca externa faz sentido."
    ],
    localAngle: "No mercado da capital, pedido de aumento em mês de baixa ou logo após erro grave costuma falhar — escolha janela e evidência.",
    coverHue: 5
  },
  {
    key: "51-banco-horas",
    title: "Banco de horas: o que confirmar no regulamento da empresa",
    type: "NEWS",
    template: "STANDARD",
    keyword: "banco de horas direitos trabalhador",
    section: "noticias",
    lead: "Banco de horas não é “ficar a mais e ver depois”. Precisa de regra clara de acúmulo, compensação e prazo. Sem isso, o extra vira briga de memória.",
    tips: [
      "Pergunte se existe acordo ou política escrita de banco de horas no seu contrato.",
      "Anote horas extras no mesmo dia — não confie só no sistema sem conferir.",
      "Entenda o prazo máximo para compensar o saldo positivo.",
      "Desconfie de “banco informal” só no caderno do supervisor.",
      "Na saída do emprego, pergunte como o saldo será pago ou compensado.",
      "Guarde prints de escala alterada e mensagens que pediram permanência além do horário."
    ],
    localAngle: "Comércio e serviços em São Luís usam banco com frequência em datas de pico — peça a regra antes do feriado, não depois.",
    coverHue: 6
  },
  {
    key: "52-hora-extra-direitos",
    title: "Hora extra: como conferir se o adicional entrou no holerite",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "hora extra holerite como conferir",
    section: "guia",
    lead: "Trabalhar além da jornada sem ver a linha no demonstrativo é sinal de alerta. Conferir espelho de ponto e holerite no mesmo mês evita acúmulo de prejuízo.",
    tips: [
      "Some as horas extras do espelho de ponto antes de abrir o holerite.",
      "Localize a linha de adicional e o percentual aplicado no demonstrativo.",
      "Pergunte à RH com educação se o número não bater — leve os dois documentos.",
      "Não aceite “depois a gente acerta” sem prazo e registro.",
      "Evite bater ponto por colega ou pedir o contrário: isso contamina a prova.",
      "Guarde os holerites do período com extra habitual — importam em dúvidas futuras."
    ],
    localAngle: "Em sazonalidade de comércio na capital, extra vira rotina; quem não confere mês a mês só descobre o buraco no acerto final.",
    coverHue: 7
  },
  {
    key: "53-fgts-basico",
    title: "FGTS na prática: o que o trabalhador CLT deve acompanhar",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "fgts trabalhador clt como consultar",
    section: "guia",
    lead: "O FGTS não é “dinheiro esquecido”: é depósito mensal que você deve acompanhar. Saber consultar o extrato e questionar atraso protege patrimônio do vínculo.",
    tips: [
      "Baixe o app oficial e acesse com conta gov.br segura — sem compartilhar senha.",
      "Confira se os depósitos mensais aparecem após a admissão.",
      "Anote meses em branco e leve a dúvida à empresa com calma e print.",
      "Desconfie de “liberação de FGTS” pedindo PIX ou taxa a desconhecido.",
      "Entenda que regras de saque mudam conforme modalidade — não creia em boato de grupo.",
      "Guarde o histórico digital; ele ajuda em rescisão e conferências."
    ],
    localAngle: "Trabalhadores em São Luís que só olham o FGTS na demissão descobrem falha tarde — uma checagem trimestral evita surpresa.",
    coverHue: 8
  },
  {
    key: "54-seguro-desemprego",
    title: "Seguro-desemprego: checklist básico após demissão sem justa causa",
    type: "NEWS",
    template: "STANDARD",
    keyword: "seguro desemprego requisitos documentos",
    section: "noticias",
    lead: "Após demissão sem justa causa, o seguro-desemprego tem requisitos de tempo e documentação. Organizar papéis cedo reduz fila e informação errada de “despachante”.",
    tips: [
      "Guarde termo de rescisão, documentos pessoais e dados bancários atualizados.",
      "Confirme se o seu caso se enquadra nos requisitos vigentes antes de prometer data a si mesmo.",
      "Prefira canais oficiais de requerimento — desconfie de taxa para “agilizar”.",
      "Anote prazos e números de protocolo de cada etapa.",
      "Não compartilhe senha do gov.br com intermediário de WhatsApp.",
      "Se houver dúvida complexa, busque orientação em órgão ou profissional de confiança."
    ],
    localAngle: "Na capital, a pressa pós-demissão alimenta golpe de “liberação rápida”; protocolo oficial e paciência protegida valem mais que atalho pago.",
    coverHue: 9
  },
  {
    key: "55-vale-alimentacao",
    title: "Vale-alimentação e refeição: diferenças que mudam o líquido do mês",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "vale alimentacao vale refeicao diferenca",
    section: "dados",
    lead: "VA e VR não são a mesma coisa no dia a dia: um costuma cobrir mercado, o outro refeição perto do posto. Comparar propostas só pelo bruto esconde esse detalhe.",
    tips: [
      "Pergunte o valor mensal e se há desconto em folha sobre o benefício.",
      "Confirme se o cartão aceita o uso que você precisa (almoço x mercado).",
      "Veja se há refeitório da empresa — isso muda o peso do VR.",
      "Inclua o benefício na coluna ao lado do salário ao comparar duas ofertas.",
      "Desconfie de benefício “a combinar” que nunca vira número no contrato.",
      "Anote a data de crédito no cartão para planejar a semana sem surpresa."
    ],
    localAngle: "Quem trabalha longe do centro de São Luís sente no bolso se o VR não cobre o trajeto até um lugar de almoço viável — peça detalhe na proposta.",
    coverHue: 10
  },
  {
    key: "56-periodo-experiencia",
    title: "Período de experiência: direitos e o que perguntar na admissão",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "periodo de experiencia clt direitos",
    section: "guia",
    lead: "Os primeiros 45 ou 90 dias não são “sem direito”. Há regras de registro, pagamento e término. Entender o combinado evita aceitar abuso disfarçado de teste.",
    tips: [
      "Confirme no contrato a duração do período de experiência e se há prorrogação prevista.",
      "Peça clareza sobre critérios de avaliação antes do fim do prazo.",
      "Trabalhe como se o registro valesse — porque vale — e guarde holerites.",
      "Se pedirem demissão “de boca” sem documento, registre datas e busque orientação.",
      "Pergunte sobre benefícios que começam só após a experiência.",
      "Use o período para avaliar a empresa também: escala real, respeito e segurança."
    ],
    localAngle: "Em comércios da capital, renovação de experiência acontece; peça o papel, não só o “está tudo certo” no corredor.",
    coverHue: 11
  },
  {
    key: "57-contrato-temporario",
    title: "Contrato temporário: o que ler antes de assinar a temporada",
    type: "NEWS",
    template: "STANDARD",
    keyword: "contrato temporario emprego direitos",
    section: "noticias",
    lead: "Vaga temporária de fim de ano ou pico pode ser boa ponte — se prazo, remuneração e empresa estiverem claros. Assinar sem ler o fim do contrato é risco clássico.",
    tips: [
      "Leia data de início, término e se há possibilidade de prorrogação escrita.",
      "Confirme salário, benefícios e local de trabalho no papel, não só no anúncio.",
      "Pergunte quem é o empregador formal (empresa ou agência) e o canal de RH.",
      "Entenda o que acontece no término: documentos e prazos de pagamento.",
      "Desconfie de temporário eterno renovado sem transparência.",
      "Guarde cópia do contrato e dos holerites da temporada."
    ],
    localAngle: "Sazonalidade de comércio em São Luís abre muitas temporárias; quem lê o prazo evita surpresa de “acabou ontem” sem acerto claro.",
    coverHue: 13
  },
  {
    key: "58-assedio-trabalho",
    title: "Assédio no trabalho: sinais, registro e canais com menos risco",
    type: "NEWS",
    template: "POST_MAGNETICO",
    keyword: "assedio no trabalho o que fazer",
    section: "noticias",
    lead: "Assédio não é “brincadeira de equipe”. Isolar, humilhar, sexualizar ou pressionar de forma abusiva exige registro e cuidado com a própria segurança ao buscar ajuda.",
    tips: [
      "Anote datas, locais, testemunhas e preserve mensagens sem editar o conteúdo.",
      "Evite confrontar sozinho em local isolado se houver risco concreto.",
      "Busque canal interno confiável (RH, ouvidoria) quando existir e for seguro.",
      "Converse com alguém de confiança fora da empresa para apoio emocional.",
      "Procure orientação em órgãos ou serviços especializados quando o caso exigir.",
      "Não publique detalhes identificáveis em rede no calor do momento — priorize prova e segurança."
    ],
    localAngle: "Em cidades médias como São Luís, medo de “queimar o filme” silencia muita gente; registro discreto e canal adequado pesam mais que post impulsivo.",
    coverHue: 14
  },
  {
    key: "59-saude-mental-trabalho",
    title: "Saúde mental e trabalho: limites saudáveis sem culpa excessiva",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "saude mental trabalho limites",
    section: "guia",
    lead: "Cansaço crônico, irritação e medo de errar o tempo todo são sinais — não “frescura”. Cuidar de limites e buscar apoio é parte de se manter empregável no longo prazo.",
    tips: [
      "Observe padrões: insônia, choro fácil, raiva ou apatia ligados à escala.",
      "Use pausas reais no intervalo; celular de trabalho o tempo todo não é descanso.",
      "Separe, quando possível, um ritual de fim de expediente (mesmo curto).",
      "Peça ajuda profissional de saúde se os sintomas persistirem.",
      "Na busca de vaga, inclua escala e deslocamento como critério de saúde, não só de dinheiro.",
      "Evite normalizar humilhação como “cultura forte” do setor."
    ],
    localAngle: "Trajeto longo na capital soma ao estresse do posto; ao comparar propostas, some tempo de ônibus à conta de bem-estar.",
    coverHue: 15
  },
  {
    key: "60-home-office-checklist",
    title: "Home office de verdade: checklist antes de aceitar remoto",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "home office checklist candidato",
    section: "guia",
    lead: "Remoto mal combinado vira presencial disfarçado ou custo alto de internet e energia. Checklist curto evita romance de anúncio e surpresa na segunda semana.",
    tips: [
      "Confirme quantos dias remotos são regra e com que aviso a empresa pode mudar.",
      "Pergunte sobre equipamento, auxílio internet e suporte de TI.",
      "Teste sua conexão e um espaço mínimo silencioso com honestidade.",
      "Esclareça horário de disponibilidade e se há plantão fora da jornada.",
      "Desconfie de remoto com salário irreal e seleção só por pagamento antecipado.",
      "Calcule o custo dos dias presenciais obrigatórios na proposta."
    ],
    localAngle: "Remoto pleno ainda é minoria em São Luís frente a comércio e serviços; leia o anúncio sem projetar o que não está escrito.",
    coverHue: 16
  },
  {
    key: "61-mudanca-carreira",
    title: "Mudança de carreira na capital: como transição sem apagar o passado",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "mudanca de carreira curriculo dicas",
    section: "guia",
    lead: "Trocar de área não exige fingir que o emprego anterior não existiu. Traduza habilidades transferíveis e aceite degrau realista de entrada na nova função.",
    tips: [
      "Liste o que se repete entre a área antiga e a nova (atendimento, planilha, prazo).",
      "Faça um curso curto só se ele destravar requisito explícito dos anúncios.",
      "Reescreva o resumo do currículo com o cargo-alvo novo no topo.",
      "Candidate-se a vagas ponte, não só ao cargo-sonho sênior imediato.",
      "Prepare uma frase clara para a entrevista: por que a mudança agora.",
      "Mantenha referência de quem pode falar da sua entrega na área anterior."
    ],
    localAngle: "No Maranhão, muita transição passa por comércio e serviços antes do escritório desejado — use a ponte com intenção, não com vergonha.",
    coverHue: 17
  },
  {
    key: "62-carta-apresentacao",
    title: "Carta de apresentação curta: quando vale a pena enviar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "carta de apresentacao emprego modelo curto",
    section: "guia",
    lead: "Carta longa e literária cansa. Em processos locais, um parágrafo objetivo no e-mail ou formulário — ligado ao anúncio — costuma bastar quando pedem.",
    tips: [
      "Só envie carta se o anúncio pedir ou se o e-mail for o canal principal.",
      "Abra com o cargo e onde viu a vaga; nada de introdução de romance.",
      "Cite duas provas de adequação alinhadas aos requisitos do texto.",
      "Feche com telefone e disponibilidade para conversa.",
      "Evite repetir o currículo inteiro — a carta é ponte, não cópia.",
      "Revise nomes da empresa; erro de colar anúncio anterior elimina na hora."
    ],
    localAngle: "Em São Luís, WhatsApp frequentemente substitui carta formal; quando o canal for e-mail, o parágrafo curto ainda diferencia.",
    coverHue: 18
  },
  {
    key: "63-referencias-profissionais",
    title: "Referências profissionais: quem pedir e como preparar o contato",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "referencias profissionais emprego",
    section: "guia",
    lead: "Referência boa é quem viu seu trabalho e pode falar com honestidade. Pedir a desconhecido “influencer” ou a parente sem contexto enfraquece a candidatura.",
    tips: [
      "Peça autorização antes de colocar nome e telefone no formulário.",
      "Escolha liderança ou colega sênior que presenciou entrega real.",
      "Avise a pessoa sobre o cargo e a empresa que podem ligar.",
      "Mantenha o contato atualizado — número morto queima a etapa.",
      "Não invente referência; checagem acontece mais do que se imagina.",
      "Se só tiver experiência informal, use quem viu sua rotina com clareza."
    ],
    localAngle: "Rede curta na capital faz referência circular rápido — escolha quem realmente endossa, não quem só “conhece alguém”.",
    coverHue: 19
  },
  {
    key: "64-ofertas-multiplas",
    title: "Duas ofertas na mesa: como comparar sem pressa tóxica",
    type: "NEWS",
    template: "STANDARD",
    keyword: "comparar duas propostas de emprego",
    section: "noticias",
    lead: "Ter mais de uma proposta é ótimo — e estressante. Comparar bruto, benefício, escala e trajeto na mesma folha evita escolher só pelo número maior da mensagem.",
    tips: [
      "Monte uma tabela: salário, VA/VR, VT, saúde, escala, distância e clima da entrevista.",
      "Peça prazo razoável para responder; pressão de “só até hoje à noite” merece cautela.",
      "Não invente oferta fictícia para forçar contraproposta.",
      "Considere crescimento e aprendizado se os líquidos forem parecidos.",
      "Comunique a recusa com educação à empresa que não ficou — a cidade é pequena.",
      "Assine só quando o combinado essencial estiver por escrito."
    ],
    localAngle: "Em São Luís, queimar ponte na recusa mal educada volta em indicação futura; firmeza e respeito cabem no mesmo áudio.",
    coverHue: 21
  },
  {
    key: "65-agradecimento-pos",
    title: "Mensagem de agradecimento pós-entrevista que não parece robô",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "mensagem agradecimento pos entrevista",
    section: "guia",
    lead: "Agradecer no mesmo dia reforça interesse. Texto genérico de internet soa falso; duas frases pessoais ligadas à conversa funcionam melhor.",
    tips: [
      "Envie em até 24 horas pelo mesmo canal da entrevista.",
      "Cite um tema específico discutido (ferramenta, escala, meta do time).",
      "Reafirme disponibilidade e interesse em uma linha.",
      "Evite emoji em excesso e áudio longo de “filosofia de vida”.",
      "Não anexe currículo de novo sem pedido — a menos que tenham pedido ajuste.",
      "Se errar o nome da pessoa, corrija com educação em mensagem seguinte curta."
    ],
    localAngle: "Recrutadores locais leem dezenas de “obrigado pela oportunidade” idênticos; um detalhe da conversa real destaca você.",
    coverHue: 22
  },
  {
    key: "66-codigo-vestimenta",
    title: "O que vestir na entrevista: leitura do setor sem exagero",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "o que vestir entrevista emprego",
    section: "guia",
    lead: "Roupa não substitui resposta boa, mas desalinhamento extremo distrai. Ler o setor — escritório, loja, cozinha — evita terno em padaria e bermuda em banco.",
    tips: [
      "Observe fotos oficiais da empresa e o tom do anúncio para calibrar.",
      "Prefira limpeza, caimento e conforto para o clima da capital.",
      "Evite perfume forte, estampa agressiva e acessório barulhento.",
      "Leve um agasalho leve se o ar-condicionado do escritório for gelado.",
      "Para vaga operacional, pergunte se haverá teste prático com uniforme.",
      "O que importa é parecer cuidado e coerente com a função, não “de revista”."
    ],
    localAngle: "Calor e umidade em São Luís pedem tecido respirável; passar mal de calor na entrevista não é estratégia de autenticidade.",
    coverHue: 23
  },
  {
    key: "67-excel-basico-vagas",
    title: "Excel pedida em vaga local: o que treinar de verdade",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "excel basico vagas emprego",
    section: "guia",
    lead: "Muitos anúncios pedem Excel “intermediário” e testam o básico bem feito. Saber filtrar, somar e organizar planilha pesa mais que dizer que “domina macros”.",
    tips: [
      "Treine SOMA, filtro, ordenação e formatação de data/número.",
      "Monte uma planilha simples de controle (estoque, agenda ou despesas).",
      "Saiba explicar no que já usou planilha no trabalho ou estudo.",
      "Não finja VBA se nunca abriu o editor — o teste prático denuncia.",
      "Leve exemplo anonimizado só se pedirem e se não houver dado sensível.",
      "No currículo, escreva “Excel: tabelas, filtros e fórmulas básicas” com honestidade."
    ],
    localAngle: "Escritórios e estoques em São Luís usam planilha no dia a dia; demonstração curta e correta vence currículo com “expert” vazio.",
    coverHue: 24
  },
  {
    key: "68-ingles-curriculo",
    title: "Inglês no currículo: como declarar nível sem inventar fluência",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "ingles no curriculo nivel",
    section: "dados",
    lead: "Declarar fluência sem conseguir se apresentar trava na primeira pergunta. Nível honesto e prova (curso, uso real) protegem melhor do que adjetivo inflado.",
    tips: [
      "Use escala clara: básico, intermediário, avançado — e esteja pronto para provar.",
      "Cite contexto de uso: e-mail, atendimento, leitura de manual.",
      "Inclua curso só se recente ou relevante ao cargo.",
      "Se a vaga exige inglês diário, ensaie uma apresentação curta no idioma.",
      "Não cole certificado antigo sem lembrar o conteúdo.",
      "Para vagas 100% em português, inglês é diferencial — não o centro do PDF."
    ],
    localAngle: "Poucas vagas operacionais da capital exigem inglês diário; quando pedirem, a entrevista costuma testar na hora — honestidade evita constrangimento.",
    coverHue: 25
  },
  {
    key: "69-profissional-40-mais",
    title: "Profissional 40+: como posicionar experiência sem se apagar",
    type: "NEWS",
    template: "STANDARD",
    keyword: "emprego apos 40 anos curriculo",
    section: "noticias",
    lead: "Etarismo existe, mas currículo que esconde década inteira também atrapalha. Foque em resultado recente, atualização prática e energia para o posto — sem pedir desculpas pela idade.",
    tips: [
      "Destaque os últimos 10–15 anos com mais detalhe; resuma o início se preciso.",
      "Mostre ferramenta atual que você usa de verdade (sistema, planilha, PDV).",
      "Evite foto datada ou discurso de “ainda tenho fôlego” — mostre entrega.",
      "Candidate-se a vagas com encaixe real de escopo, não só a título de status antigo.",
      "Prepare resposta curta para “por que essa vaga agora”.",
      "Use rede de indicação com quem viu seu trabalho recente."
    ],
    localAngle: "Em serviços e comércio de São Luís, experiência estável ainda abre porta — desde que o PDF fale do presente, não só de 1998.",
    coverHue: 26
  },
  {
    key: "70-retorno-maternidade",
    title: "Volta ao mercado após maternidade: currículo e conversa sem culpa",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "retorno ao trabalho apos maternidade",
    section: "guia",
    lead: "Pausa por maternidade não precisa de novela nem de silêncio constrangedor. Uma linha clara, foco no que você entrega agora e perguntas práticas sobre escala ajudam.",
    tips: [
      "Explique o intervalo em uma frase objetiva, sem excesso de detalhe íntimo.",
      "Atualize habilidades e contato; gap com telefone morto dobra rejeição.",
      "Pergunte sobre escala e flexibilidade com educação, não com pedido genérico.",
      "Organize rede de apoio e documentos antes de aceitar horário impossível.",
      "Treine a resposta para não soar defensiva nem pedindo permissão para existir.",
      "Peça referências de quem trabalhou com você antes da pausa."
    ],
    localAngle: "Recrutadores na capital veem retornos o tempo todo; o que pesa é clareza de disponibilidade e preparo de documentos, não discurso de culpa.",
    coverHue: 27
  },
  {
    key: "71-call-center-perfil",
    title: "Vagas de call center: voz, meta e o que perguntar na seleção",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "vagas call center sao luis dicas",
    section: "guia",
    lead: "Atendimento ativo ou receptivo pede voz clara, paciência e meta. Entender turno, fone e cobrança de resultado evita surpresa no primeiro mês de headset.",
    tips: [
      "Pergunte se a meta é individual, por equipe e como é medida.",
      "Confirme turno, intervalo e política de pausa para banheiro e água.",
      "Teste sua voz e postura sentada — a entrevista pode incluir simulação.",
      "Esclareça se o home office de call center inclui equipamento e internet.",
      "Prepare exemplo de cliente irritado resolvido com educação.",
      "Leia o contrato sobre descontos e “qualidade” antes de assinar."
    ],
    localAngle: "Operações de atendimento que contratam em São Luís variam muito de clima; meta sem pausa real é sinal para questionar na entrevista.",
    coverHue: 29
  },
  {
    key: "72-recepcao-clinica",
    title: "Recepção em clínica e consultório: o que o anúncio espera de você",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vaga recepcionista clinica sao luis",
    section: "guia",
    lead: "Recepção misturagenda, telefone, WhatsApp e sigilo. Quem descreve organização de fila e cuidado com dado de paciente conquista mais do que “sou simpática”.",
    tips: [
      "Cite experiência com agenda, confirmação de horário ou atendimento telefônico.",
      "Destaque discrição: prontuário e conversa de corredor não se misturam.",
      "Prepare-se para lidar com atraso de paciente e profissional com calma.",
      "Pergunte sobre sistema de marcação e volume típico de atendimentos.",
      "Vista-se de forma limpa e sóbria — o setor valoriza apresentação cuidadosa.",
      "Confirme horário de sábado e feriado se a clínica abrir nesses dias."
    ],
    localAngle: "Clínicas na capital pedem recepcionista que segure WhatsApp e presencial ao mesmo tempo — mostre que você prioriza sem perder educação.",
    coverHue: 30
  },
  {
    key: "73-estoque-logistica",
    title: "Estoque e logística leve: como mostrar precisão sem jargão vazio",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas estoque logistica sao luis",
    section: "guia",
    lead: "Conferir nota, organizar prateleira e evitar extravio são o coração do estoque. Currículo com verbos concretos vence frase de “proativo e dinâmico”.",
    tips: [
      "Descreva conferência de mercadoria, inventário ou organização de área.",
      "Cite ferramentas: leitor, planilha, sistema simples de entrada e saída.",
      "Fale de cuidado com validade e ruptura se tiver experiência em varejo.",
      "Pergunte sobre peso, altura de prateleira e EPI no posto.",
      "Confirme escala de recebimento noturno ou madrugada se houver.",
      "Mostre atenção a erro de nota — exemplo curto impressiona mais que adjetivo."
    ],
    localAngle: "Centros de distribuição e lojas em São Luís valorizam quem reduz diferença de inventário; prepare um exemplo real de correção de erro.",
    coverHue: 31
  },
  {
    key: "74-vendas-balcao",
    title: "Vendas no balcão: meta, comissão e tom que não afasta cliente",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "vagas vendedor loja comissao",
    section: "dados",
    lead: "Anúncio de vendedor mistura “meta desafiadora” e sorriso. Entender se a renda depende de comissão — e como ela é calculada — evita líquido ilusório.",
    tips: [
      "Pergunte o salário-base, o percentual de comissão e o histórico realista do time.",
      "Esclareça se devolução de venda desconta comissão depois.",
      "Prepare exemplos de abordagem educada, não de pressão agressiva.",
      "Confirme horário de shopping ou rua e trabalho em feriado.",
      "Observe na entrevista se a liderança fala só de meta ou também de treinamento.",
      "Compare duas lojas do mesmo corredor antes de aceitar a primeira oferta."
    ],
    localAngle: "Corredores comerciais de São Luís vivem de fim de semana; comissão bonita no papel precisa sobreviver a terça vazia — peça número completo.",
    coverHue: 32
  },
  {
    key: "75-turismo-hotelaria",
    title: "Hotelaria e turismo local: sazonalidade e postura de atendimento",
    type: "NEWS",
    template: "STANDARD",
    keyword: "vagas hotelaria turismo sao luis",
    section: "noticias",
    lead: "Alta temporada e eventos mudam o ritmo de hotéis e atrações. Quem entende pico, uniformidade de atendimento e escala irregular se prepara melhor para a seleção.",
    tips: [
      "Destaque experiência com público, idiomas básicos ou organização de check-in se tiver.",
      "Pergunte sobre temporada alta, hora extra e dormida em plantão.",
      "Prepare-se para falar de reclamação de hóspede resolvida com calma.",
      "Confirme uniforme, apresentação e regras de uso de celular no posto.",
      "Leia se a vaga é sazonal ou efetiva antes de planejar a renda anual.",
      "Desconfie de “ajuda” sem registro em período de festa lotada."
    ],
    localAngle: "Eventos e feriados em São Luís enchem hospedagem; pergunte a escala real da alta, não só o anúncio de baixa temporada.",
    coverHue: 33
  },
  {
    key: "76-motorista-entregas",
    title: "Motorista e entregas: documentos, rota e o que o anúncio omite",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas motorista entregador sao luis",
    section: "guia",
    lead: "CNH válida é só o começo. Veículo, app, seguro e tempo de rota mudam o ganho. Ler o que a empresa fornece evita aceitar custo escondido.",
    tips: [
      "Confirme se o veículo é da empresa ou próprio e quem paga combustível/manutenção.",
      "Peça clareza sobre meta de entregas e área de cobertura.",
      "Mantenha CNH, CRLV e documentos pessoais em dia e legíveis.",
      "Pergunte sobre seguro e procedimento em caso de sinistro ou assalto.",
      "Calcule tempo real de trânsito na capital no horário da rota.",
      "Recuse proposta que peça taxa para “liberar” rota ou app."
    ],
    localAngle: "Trânsito e chuva em São Luís alteram rota de entrega; combine expectativa de tempo com a operação antes de prometer o impossível.",
    coverHue: 34
  },
  {
    key: "77-plano-90-dias",
    title: "Plano de 90 dias na busca: ritmo sustentável até a entrevista",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "plano 90 dias busca emprego",
    section: "guia",
    lead: "Busca sem horizonte vira ansiedade infinita. Um bloco de 90 dias com metas mensais — currículo, volume de qualidade, treino de entrevista — organiza energia.",
    tips: [
      "Mês 1: PDF sólido, pasta de documentos e 3 histórias comportamentais.",
      "Mês 2: candidaturas adaptadas e follow-ups com registro em planilha.",
      "Mês 3: reforço de rede, simulação de entrevista e ajuste fino do material.",
      "Revise métricas a cada 15 dias: envios, respostas, entrevistas.",
      "Inclua descanso semanal — burnout de busca piora o tom das mensagens.",
      "Se em 90 dias a taxa for zero, mude o material antes de só aumentar volume."
    ],
    localAngle: "Quem busca em São Luís conciliando bico precisa de plano longo o bastante para não desistir na terceira semana silenciosa.",
    coverHue: 35
  },
  {
    key: "78-sindicato-basico",
    title: "Sindicato e trabalhador: o básico para não cair em boato",
    type: "NEWS",
    template: "STANDARD",
    keyword: "sindicato trabalhador direitos basico",
    section: "noticias",
    lead: "Sindicato não é vilão automático nem salvador mágico. Entender categoria, contribuição e canais oficiais ajuda a buscar informação sem depender de áudio de grupo.",
    tips: [
      "Identifique a categoria do seu cargo e se há convenção aplicável.",
      "Prefira informação em canal oficial do sindicato da categoria.",
      "Desconfie de cobrança estranha feita por desconhecido no WhatsApp.",
      "Guarde boletos e comprovantes se houver contribuição formal.",
      "Em dúvida de direito específico, anote a pergunta antes de ligar ou ir ao atendimento.",
      "Não misture boato de reajuste com o que está escrito no acordo."
    ],
    localAngle: "Trabalhadores da capital maranhense ganham tempo quando separam convenção real de correntes de mensagem com percentual inventado.",
    coverHue: 37
  },
  {
    key: "79-acordo-coletivo",
    title: "Acordo e convenção coletiva: o que isso muda no seu holerite",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "convencao coletiva holerite trabalhador",
    section: "dados",
    lead: "Piso, adicional e regra de jornada podem vir de norma coletiva, não só da lei geral. Saber que o documento existe ajuda a questionar valor estranho com base.",
    tips: [
      "Pergunte à RH qual convenção ou acordo se aplica ao seu contrato.",
      "Compare o piso da categoria com o seu salário-base no demonstrativo.",
      "Anote cláusulas de VT, refeição ou adicional noturno se existirem.",
      "Guarde PDF ou link oficial da norma quando disponível.",
      "Não confunda proposta de empresa com regra já negociada da categoria.",
      "Em divergência, leve o documento e o holerite juntos à conversa."
    ],
    localAngle: "Em setores de São Luís com forte convenção, o “sempre foi assim” do corredor pode estar desatualizado — o texto da norma manda mais.",
    coverHue: 38
  },
  {
    key: "80-atestado-medico",
    title: "Atestado médico no emprego: entrega, prazo e cuidados com o documento",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "atestado medico trabalho como entregar",
    section: "guia",
    lead: "Atestado existe para justificar ausência por saúde. Entregar no canal certo, no prazo da empresa e sem adulterar o papel evita problema disciplinar grave.",
    tips: [
      "Conheça o prazo e o canal (e-mail, RH, sistema) para envio do atestado.",
      "Guarde cópia legível do documento e do comprovante de entrega.",
      "Nunca adultere data, CID ou assinatura — a consequência é séria.",
      "Se o sistema rejeitar o arquivo, avise na hora e reenvie por canal alternativo oficial.",
      "Esclareça se a empresa exige presencial após certo número de dias.",
      "Cuide da própria saúde de verdade; atestado não é ferramenta de folga combinada."
    ],
    localAngle: "Políticas de atestado variam entre empresas da capital; perguntar na admissão evita descobrir regra rígida só na primeira gripe.",
    coverHue: 39
  },
  {
    key: "81-acidente-trabalho",
    title: "Acidente de trabalho: primeiros passos e registro sem pânico",
    type: "NEWS",
    template: "STANDARD",
    keyword: "acidente de trabalho o que fazer",
    section: "noticias",
    lead: "Acidente no posto exige cuidado imediato com a saúde e registro. Improvisar “fica quieto que a gente resolve” pode prejudicar tratamento e direitos depois.",
    tips: [
      "Busque atendimento médico adequado o quanto antes.",
      "Comunique a liderança e a área responsável assim que possível.",
      "Preserve evidências simples: local, horário, testemunhas, fotos se seguro.",
      "Pergunte sobre abertura de comunicação de acidente conforme o caso.",
      "Não assine documento que não entendeu — peça cópia e tempo para ler.",
      "Acompanhe afastamento e retorno com orientação de saúde ocupacional quando houver."
    ],
    localAngle: "Em operações de São Luís com risco físico (limpeza, carga, cozinha), EPI e treino importam antes do acidente — e registro importa depois.",
    coverHue: 40
  },
  {
    key: "82-terceirizado-direitos",
    title: "Trabalho terceirizado: quem é o empregador e o que perguntar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "trabalhador terceirizado direitos",
    section: "guia",
    lead: "Crachá da empresa tomadora e contrato com a prestadora confundem. Saber quem paga, quem demite e onde reclamar evita cobrança no lugar errado.",
    tips: [
      "Identifique no contrato o nome da empregadora formal.",
      "Guarde holerites e comunicados da prestadora, não só da empresa do local.",
      "Pergunte sobre benefícios e escala no papel da contratante certa.",
      "Em atraso de pagamento, registre e busque o canal da empregadora.",
      "Desconfie de “ajuda” permanente sem registro no local da tomadora.",
      "Mantenha cópia de crachá, contrato e aditivos."
    ],
    localAngle: "Prédios, hospitais e shoppings em São Luís concentram terceirizados; clareza de vínculo protege na hora do acerto.",
    coverHue: 41
  },
  {
    key: "83-trabalho-noturno",
    title: "Trabalho noturno: adicional, sono e perguntas antes de aceitar",
    type: "NEWS",
    template: "STANDARD",
    keyword: "trabalho noturno adicional direitos",
    section: "noticias",
    lead: "Turno da noite muda corpo e rotina familiar. Além do adicional, pergunte transporte, refeição e como a empresa trata troca de escala.",
    tips: [
      "Confirme se há adicional noturno e como aparece no holerite.",
      "Pergunte sobre transporte de madrugada e segurança do trajeto.",
      "Entenda intervalo e política de troca de turno.",
      "Calcule impacto no sono e na vida pessoal antes de aceitar só pelo valor.",
      "Se já tiver outro emprego diurno, avalie legalidade e saúde da dupla jornada.",
      "Guarde escalas publicadas — mudança verbal frequente é sinal de atenção."
    ],
    localAngle: "Hospitais, segurança e alguns comércios da capital usam noite; trajeto vazio de ônibus às 4h precisa entrar na conta da proposta.",
    coverHue: 42
  },
  {
    key: "84-conflito-lideranca",
    title: "Conflito com a liderança: como documentar e falar com objetividade",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "conflito com chefe trabalho dicas",
    section: "guia",
    lead: "Desacordo de meta ou tom não se resolve só com silêncio. Falar com fatos, buscar mediação interna e saber a hora de sair protege carreira e saúde.",
    tips: [
      "Separe fato (data, tarefa, combinado) de interpretação emocional no rascunho.",
      "Peça conversa privada com pauta clara — não discuta raiva no grupo.",
      "Se houver RH ou mediação, use o canal com registro objetivo.",
      "Evite fofoca paralela que vira “você contra o time”.",
      "Cuide da própria performance documentada enquanto o conflito existe.",
      "Se o ambiente for abusivo, priorize segurança e plano de saída estruturado."
    ],
    localAngle: "Em equipes pequenas de São Luís, conflito mal conduzido vaza rápido; objetividade e registro valem mais que áudio inflamado.",
    coverHue: 43
  },
  {
    key: "85-feedback-entrevista",
    title: "Feedback na entrevista: como pedir e o que fazer com a resposta",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "pedir feedback entrevista emprego",
    section: "guia",
    lead: "Poucos processos dão retorno detalhado — mas quando dão, é ouro. Pedir feedback com educação e aplicar no próximo envio acelera a curva.",
    tips: [
      "Peça feedback só após resposta final ou quando o recrutador se mostrar aberto.",
      "Pergunte o que poderia fortalecer no perfil para vagas semelhantes.",
      "Agradeça mesmo se a crítica doer; processe depois, não na hora.",
      "Traduza o feedback em um ajuste concreto no PDF ou na fala.",
      "Não discuta a decisão tentando “reverter” com argumentação longa.",
      "Se não houver feedback, revise sozinho anúncio versus currículo."
    ],
    localAngle: "RH local com agenda cheia raramente escreve laudo; uma pergunta curta no WhatsApp oficial tem mais chance do que e-mail de duas páginas.",
    coverHue: 45
  },
  {
    key: "86-inteligencia-emocional",
    title: "Inteligência emocional na seleção: calma que se demonstra na prática",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "inteligencia emocional entrevista emprego",
    section: "guia",
    lead: "Não é discurso de coach: é não explodir com provocação leve, ouvir até o fim e responder com respeito. Processos locais testam isso em dinâmica e no balcão.",
    tips: [
      "Treine pausa de dois segundos antes de responder pergunta difícil.",
      "Nomeie o fato sem atacar a pessoa na história comportamental.",
      "Mostre que você pede ajuda quando o limite técnico aparece.",
      "Evite ironizar o processo ou o entrevistador — mesmo se a pergunta for ruim.",
      "Na dinâmica, escute quem fala pouco e incorpore uma ideia alheia.",
      "Depois da entrevista, não desconte raiva em avaliação pública da empresa."
    ],
    localAngle: "Fila, calor e atraso de ônibus em São Luís já testam o humor antes da sala; chegar composto é parte da demonstração.",
    coverHue: 46
  },
  {
    key: "87-gestao-tempo-posto",
    title: "Gestão de tempo no posto novo: priorizar sem parecer lento",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "gestao de tempo trabalho dicas",
    section: "guia",
    lead: "No emprego novo, tudo parece urgente. Aprender a priorizar com a liderança — e comunicar atraso cedo — evita imagem de desorganização injusta.",
    tips: [
      "Peça a ordem de prioridade do dia na primeira semana.",
      "Use lista simples no papel ou no celular para não perder demanda oral.",
      "Avise cedo se o prazo vai estourar — surpresa no fim do dia piora.",
      "Agrupe tarefas parecidas (ligações, arquivos) para reduzir troca de contexto.",
      "Proteja o intervalo: trabalhar sem pausa não prova valor eterno.",
      "Revise no fim do expediente o que ficou pendente para o dia seguinte."
    ],
    localAngle: "Times enxutos na capital empilham tarefa; quem alinha prioridade com o chefe sofre menos acusação de “não rende”.",
    coverHue: 47
  },
  {
    key: "88-alfabetizacao-digital",
    title: "Alfabetização digital para vagas locais: o mínimo que destrava",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "alfabetizacao digital emprego basico",
    section: "dados",
    lead: "PDF, e-mail, nuvem e formulário online são o chão de muitas seleções. Sem isso, candidato bom trava no envio — não na entrevista.",
    tips: [
      "Saiba anexar PDF, compactar foto de documento e nomear arquivo.",
      "Crie e organize uma pasta no Drive ou similar só para candidaturas.",
      "Treine preencher formulário sem fechar a aba no meio.",
      "Use senha forte no e-mail e no gov.br — sem anotar em post público.",
      "Peça ajuda a alguém de confiança para um ensaio de envio, se precisar.",
      "Não pague “curso milagroso” de celular que promete emprego garantido."
    ],
    localAngle: "Processos em São Luís pedem cada vez mais envio digital; quem só domina o papel precisa de um treino curto antes da próxima vaga.",
    coverHue: 48
  },
  {
    key: "89-portfolio-simples",
    title: "Portfólio simples sem ser designer: quando e como montar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "portfolio simples candidato emprego",
    section: "guia",
    lead: "Nem toda vaga pede portfólio, mas atendimento, admin e operação podem mostrar “antes e depois” de organização. Um PDF curto com 3 provas basta.",
    tips: [
      "Escolha três exemplos anonimizados: planilha, fluxo, peça de comunicação.",
      "Tire dados sensíveis de cliente e colega antes de compartilhar.",
      "Explique em uma linha o problema e o resultado de cada peça.",
      "Envie só se pedirem ou se reforçar fortemente o anúncio.",
      "Mantenha o arquivo leve para WhatsApp.",
      "Atualize o portfólio quando mudar de área-alvo."
    ],
    localAngle: "Em processos da capital, portfólio curto e legível no celular funciona melhor que site pesado que não abre no 4G.",
    coverHue: 49
  },
  {
    key: "90-comparar-portais",
    title: "Portais de vaga: como comparar fontes sem cair em duplicata e golpe",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "comparar portais de emprego seguranca",
    section: "dados",
    lead: "A mesma vaga aparece em três sites com textos diferentes. Cruzar fonte, data e canal oficial reduz candidatura duplicada e anúncio falso.",
    tips: [
      "Prefira o canal indicado no Empregos São Luís quando a vaga estiver lá.",
      "Compare razão social e cidade antes de enviar documento.",
      "Desconfie de republicação com salário milagroso e zero requisito.",
      "Anote onde já se candidatou para não spammar o mesmo RH.",
      "Trate grupo de Telegram/WhatsApp como ruído a filtrar, não como fonte principal.",
      "Se pedir taxa para “destaque no portal”, encerre."
    ],
    localAngle: "Candidatos em São Luís perdem tempo com a mesma vaga colada em cinco grupos; uma planilha mínima de origem evita reenvio cego.",
    coverHue: 50
  },
  {
    key: "91-ler-contrato-clt",
    title: "Ler o contrato CLT antes de assinar: cláusulas que merecem pausa",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "ler contrato trabalho clt dicas",
    section: "guia",
    lead: "Assinar sem ler é clássico de arrependimento. Cargo, salário, local, jornada e período de experiência precisam bater com o que foi falado na proposta.",
    tips: [
      "Compare salário e benefícios do papel com a mensagem da oferta.",
      "Confirme endereço ou área de trabalho e possibilidade de transferência.",
      "Leia jornada, intervalo e se há banco de horas citado.",
      "Peça cópia assinada para você — não fique só com o “depois te mando”.",
      "Se algo divergir, pergunte antes de assinar; pressão extrema é sinal.",
      "Guarde o PDF/foto legível do contrato com os holerites."
    ],
    localAngle: "Admissões rápidas de comércio em São Luís não eliminam o direito de ler; dois minutos a mais evitam mês inteiro de discussão.",
    coverHue: 51
  },
  {
    key: "92-mitos-direitos",
    title: "Mitos de direitos trabalhistas que circulam em grupo de WhatsApp",
    type: "NEWS",
    template: "STANDARD",
    keyword: "mitos direitos trabalhistas whatsapp",
    section: "noticias",
    lead: "Áudio confiante não é lei. Percentual de adicional, regra de falta e “posso processar por isso” precisam de fonte — não de corrente encaminhada.",
    tips: [
      "Desconfie de mensagem sem data, sem fonte e com urgência de compartilhar.",
      "Confira informação em canal oficial ou profissional de confiança.",
      "Não tome decisão de demissão ou confrontação só com base em boato.",
      "Guarde o holerite e o contrato — eles pesam mais que print de desconhecido.",
      "Evite pagar consulta milagrosa vendida no mesmo grupo do boato.",
      "Se a dúvida for séria, anote os fatos do seu caso antes de buscar orientação."
    ],
    localAngle: "Grupos de emprego em São Luís misturam vaga útil e mito perigoso; separar os dois é habilidade de candidato moderno.",
    coverHue: 53
  },
  {
    key: "93-custo-vida-salario",
    title: "Custo de vida e salário em São Luís: conta mínima antes de aceitar",
    type: "DATA_REPORT",
    template: "POST_MAGNETICO",
    keyword: "custo de vida salario sao luis",
    section: "dados",
    lead: "O bruto bonito encolhe com condução, almoço e tempo. Uma conta mínima de deslocamento e alimentação mostra se a proposta sustenta o mês.",
    tips: [
      "Some passagens do mês no horário real da escala.",
      "Estime almoço fora se não houver VR/refeitório suficiente.",
      "Inclua custo de dados móveis se o trabalho exigir app o tempo todo.",
      "Compare líquido estimado entre duas propostas na mesma folha.",
      "Considere tempo de trajeto como custo de vida — não só dinheiro.",
      "Deixe margem para imprevisto; proposta no limite exato aperta no primeiro atraso."
    ],
    localAngle: "Morar longe do posto em São Luís transforma salário “ok” em apertado; faça a conta com honestidade geográfica.",
    coverHue: 54
  },
  {
    key: "94-negociar-deslocamento",
    title: "Deslocamento longo: como negociar horário ou auxílio com educação",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "negociar horario deslocamento emprego",
    section: "guia",
    lead: "Às vezes o salário fecha e o trajeto não. Negociar entrada diferenciada, VT completo ou home parcial — quando fizer sentido — exige dado, não drama.",
    tips: [
      "Leve o tempo real de trajeto (teste feito) para a conversa.",
      "Peça ajuste específico: 30 minutos, VT integral, dia remoto.",
      "Mostre compromisso com pontualidade se o ajuste for concedido.",
      "Aceite o “não” sem ameaça; use a informação para decidir se fica.",
      "Evite negociar isso só no corredor sem registro do combinado.",
      "Se o trajeto for inviável, recusar a tempo é profissionalismo."
    ],
    localAngle: "Empresas da capital conhecem o problema do deslocamento; pedido concreto e educado tem mais chance do que reclamação genérica de trânsito.",
    coverHue: 55
  },
  {
    key: "95-trabalho-fim-semana",
    title: "Trabalho no fim de semana: o que alinhar sobre folga e adicional",
    type: "NEWS",
    template: "STANDARD",
    keyword: "trabalhar fim de semana direitos folga",
    section: "noticias",
    lead: "Sábado e domingo no posto são comuns em comércio e serviços. O que importa é saber se a folga compensa, se há adicional e como a escala é publicada.",
    tips: [
      "Pergunte quantos fins de semana por mês são regra no setor.",
      "Confirme se folga compensatória ou adicional aparece no holerite.",
      "Peça a escala com antecedência razoável — surpresa semanal cansa.",
      "Calcule impacto em estudo, família e segundo vínculo antes de aceitar.",
      "Guarde prints de escala quando houver troca de última hora frequente.",
      "Se o anúncio esconde o domingo, trate como risco na entrevista."
    ],
    localAngle: "Alimentação e varejo em São Luís giram no fim de semana; alinhar expectativa na seleção evita pedido de demissão no segundo mês.",
    coverHue: 56
  },
  {
    key: "96-transferencia-interna",
    title: "Transferência interna: como pedir mudança de setor sem queimar ponte",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "transferencia interna emprego dicas",
    section: "guia",
    lead: "Mudar de setor na mesma empresa pode ser crescimento — ou fuga mal explicada. Pedido com motivo profissional e histórico bom de entrega conversa melhor.",
    tips: [
      "Espere ter entregas sólidas no posto atual antes de pedir troca.",
      "Fale primeiro com a liderança atual, salvo risco de retaliação grave.",
      "Explique o interesse pelo novo setor com skill transferível, não só “cansei”.",
      "Aceite que a empresa pode dizer não e prepare plano B externo.",
      "Evite campanha paralela de fofoca para forçar a mudança.",
      "Se aprovado, faça transição limpa: passe o bastão documentado."
    ],
    localAngle: "Em grupos econômicos presentes em São Luís, indicação interna move vaga; reputação no setor atual pesa tanto quanto o pedido.",
    coverHue: 57
  },
  {
    key: "97-avaliacao-desempenho",
    title: "Avaliação de desempenho: como se preparar sem teatro",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "avaliacao de desempenho preparacao",
    section: "guia",
    lead: "Avaliação boa não é discurso de autoelogio. É evidência de meta, exemplo de melhoria e pergunta sobre o próximo ciclo. Chegue com fatos, não com surpresa.",
    tips: [
      "Reúna números e exemplos dos últimos meses antes da conversa.",
      "Liste um ponto a melhorar com plano simples — mostra maturidade.",
      "Peça clareza sobre critérios se a nota parecer subjetiva demais.",
      "Anote combinados de desenvolvimento e cobrado prazo depois.",
      "Evite comparar colega na frente do avaliador.",
      "Use o feedback para ajustar busca interna ou externa com calma."
    ],
    localAngle: "Nem toda empresa da capital tem ciclo formal; se não houver, peça feedback trimestral informal registrado por e-mail ou mensagem.",
    coverHue: 58
  },
  {
    key: "98-entrevista-desligamento",
    title: "Entrevista de desligamento: o que falar e o que guardar",
    type: "NEWS",
    template: "STANDARD",
    keyword: "entrevista de desligamento dicas",
    section: "noticias",
    lead: "Na saída, a empresa pode perguntar motivos. Honestidade estratégica — fatos sem ataque pessoal — protege referência e acerto, sem transformar a sala em tribunal.",
    tips: [
      "Prepare duas ou três razões profissionais objetivas se for demissão a pedido.",
      "Evite xingar nomes; descreva processo ou condição, não personagem.",
      "Pergunte prazos de documentos e pagamentos com educação.",
      "Devolva equipamentos com protocolo.",
      "Guarde cópias do que assinar no desligamento.",
      "Não grave conversa às escondidas se isso gerar risco legal — busque orientação adequada."
    ],
    localAngle: "Mercado local lembra saída tumultuada; tom firme e curto na despedida costuma ser o melhor legado.",
    coverHue: 59
  },
  {
    key: "99-vagas-sazonais",
    title: "Contratação sazonal: como entrar no pico sem ilusão de efetivo",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "vagas sazonais comercio sao luis",
    section: "dados",
    lead: "Pico de datas comemorativas abre vaga rápida e prazo curto. Tratar sazonal como ponte — com contrato lido — evita frustração de quem esperava efetivação automática.",
    tips: [
      "Pergunte taxa histórica de efetivação sem acreditar em promessa vaga.",
      "Organize a renda sabendo a data de término.",
      "Entregue desempenho alto: indicação interna ainda acontece.",
      "Mantenha a busca paralela leve nas últimas semanas do contrato.",
      "Guarde avaliações e contatos de liderança para referência.",
      "Leia multa, aviso e pagamento no término antes de assinar."
    ],
    localAngle: "Comércio de São Luís incha em datas certas do calendário; quem entra ciente do fim planeja o mês seguinte com menos susto.",
    coverHue: 61
  },
  {
    key: "100-empatia-atendimento",
    title: "Empatia no atendimento: soft skill que anúncios pedem sem explicar",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "empatia atendimento cliente entrevista",
    section: "guia",
    lead: "“Ter empatia” no anúncio significa ouvir, não concordar com tudo. Na entrevista, uma cena de cliente irritado resolvido com respeito vale mais que a palavra solta.",
    tips: [
      "Prepare uma história: escutou, reformulou o problema, propôs próximo passo.",
      "Mostre limite saudável: empatia não é aceitar abuso.",
      "Evite resposta robótica de script decorado sem exemplo.",
      "Na dinâmica, pratique incluir quem está calado.",
      "Cite aprendizado de uma reclamação que você melhorou depois.",
      "No currículo, troque “empático” por resultado de atendimento."
    ],
    localAngle: "Lojas e clínicas da capital vivem de reclamação no balcão; recrutador local quer ver calma sob pressão, não discurso de palestra.",
    coverHue: 62
  },
  {
    key: "101-gap-habilidades",
    title: "Gap de habilidades: como fechar buraco entre você e o anúncio",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "gap de habilidades candidatura",
    section: "guia",
    lead: "O anúncio pede três ferramentas e você tem uma. Em vez de desistir ou mentir, mapeie o buraco, treine o essencial e candidate-se com honestidade estratégica.",
    tips: [
      "Liste requisitos obrigatórios versus desejáveis no anúncio.",
      "Treine só o que aparece em vários anúncios do mesmo cargo.",
      "No PDF, destaque o que você já tem e o plano curto do que está aprendendo.",
      "Na entrevista, não finja domínio — mostre velocidade de aprendizado com exemplo.",
      "Evite dez cursos simultâneos; um requisito fechado por vez rende mais.",
      "Revise o gap a cada duas semanas conforme o portal."
    ],
    localAngle: "Mercado de São Luís repete certas ferramentas por setor; fechar o gap do que se repete destrava mais entrevista do que curso aleatório da moda.",
    coverHue: 63
  },
  {
    key: "102-certificado-vs-pratica",
    title: "Certificado ou prática: o que pesa mais na triagem local",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "certificado ou experiencia emprego",
    section: "dados",
    lead: "Certificado abre conversa; prática sustenta. Anúncios locais misturam os dois — ler o que é obrigatório evita acumular PDF decorativo sem hora de mesa.",
    tips: [
      "Se o anúncio exige certificado específico, priorize isso.",
      "Se pede “experiência com”, prepare exemplo — papel sozinho não basta.",
      "No currículo, coloque prática recente acima de curso antigo irrelevante.",
      "Use certificado para cobrir gap real, não para enfeitar margem.",
      "Esteja pronto para teste prático mesmo com diploma na pasta.",
      "Compare duas vagas: o que se repete como obrigatório é o núcleo."
    ],
    localAngle: "Clínicas e lojas em São Luís pedem curso curto com frequência, mas a entrevista ainda testa o dia a dia — equilibre os dois.",
    coverHue: 64
  },
  {
    key: "103-burnout-sinais",
    title: "Sinais de esgotamento na busca e no emprego: quando pausar",
    type: "NEWS",
    template: "POST_MAGNETICO",
    keyword: "burnout busca emprego sinais",
    section: "noticias",
    lead: "Mandar currículo às 2h da manhã com raiva raramente melhora a taxa de resposta. Reconhecer esgotamento — e pausar com método — é estratégia, não fraqueza.",
    tips: [
      "Note se irritação, insônia e catastrofismo dominam cada envio.",
      "Faça pausa de 48 horas com regra: zero candidatura, só descanso básico.",
      "Volte com meta menor e material revisado, não com maratona de culpa.",
      "No emprego atual, observe se erro por cansaço está subindo — peça ajuda.",
      "Busque apoio de saúde se os sintomas forem intensos ou persistentes.",
      "Inclua sono e alimentação como parte do “plano de busca”, não como luxo."
    ],
    localAngle: "Calor, deslocamento e pressão financeira em São Luís somam no esgotamento; candidato que pausa com método sustenta a corrida mais longa.",
    coverHue: 65
  },
  {
    key: "104-mensagem-recrutador",
    title: "Mensagem fria para recrutador: template curto que não parece spam",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "mensagem para recrutador linkedin whatsapp",
    section: "guia",
    lead: "“Oi, tem vaga?” não funciona. Mensagem fria útil cita cargo, uma prova de adequação e pedido específico — com respeito ao tempo de quem recebe dezenas por dia.",
    tips: [
      "Abra com nome, cargo-alvo e por que aquela pessoa/empresa.",
      "Em duas linhas, cite experiência alinhada ao que eles publicam.",
      "Peça algo concreto: indicação de canal ou se há processo aberto.",
      "Anexe PDF só se o canal permitir e o arquivo for leve.",
      "Evite sequência diária de cobrança se não houver resposta.",
      "Revise ortografia; erro no primeiro contato pesa desproporcionalmente."
    ],
    localAngle: "Recrutadores que atuam em São Luís respondem mais a especificidade local (setor, disponibilidade, bairro alcançável) do que a elogio genérico.",
    coverHue: 66
  },
  {
    key: "105-panorama-mercado-local",
    title: "Panorama 2026 da busca local: o que priorizar nos próximos meses",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "mercado de trabalho sao luis 2026",
    section: "dados",
    lead: "Sem prever milagre, o candidato ganha ao olhar padrão: setores que mais anunciam, peso de escala e cuidado com golpe. Um panorama simples orienta a meta semanal.",
    tips: [
      "Revise no portal quais cargos se repetem na sua região de deslocamento.",
      "Priorize qualidade de envio em comércio, serviços e apoio administrativo se for o seu encaixe.",
      "Mantenha pasta de documentos sempre pronta — processos locais são rápidos.",
      "Trate segurança da candidatura como filtro permanente, não como paranoia.",
      "Meça seu funil a cada duas semanas e ajuste PDF antes de só aumentar volume.",
      "Use o Empregos São Luís como âncora e filtre ruído de grupo paralelo."
    ],
    localAngle: "Quem busca emprego em São Luís em 2026 ainda compete por vaga operacional e de atendimento; consistência e canal seguro continuam sendo o diferencial prático.",
    coverHue: 67
  }
];

/** Overlay SEO/taxonomia (títulos, keywords, type/section). */
const catalogPatchByKey = new Map([
  {
    "key": "06-produtividade-busca",
    "title": "Busca de emprego em São Luís: bloco diário com mais retorno",
    "keyword": "produtividade busca emprego sao luis"
  },
  {
    "key": "37-plano-semanal-busca",
    "title": "Plano semanal de vagas em São Luís: meta de segunda a sábado",
    "keyword": "plano semanal vagas sao luis"
  },
  {
    "key": "77-plano-90-dias",
    "title": "Plano de 90 dias na busca de emprego: ritmo até a entrevista",
    "keyword": "plano 90 dias emprego sao luis"
  },
  {
    "key": "45-panorama-candidaturas",
    "type": "DATA_REPORT",
    "section": "dados",
    "title": "Quantas vagas candidatar por semana: checklist volume × qualidade",
    "keyword": "quantas vagas candidatar por semana"
  },
  {
    "key": "01-curriculo-ats",
    "title": "Currículo ATS em São Luís: palavras-chave que o filtro lê",
    "keyword": "curriculo ats palavras chave sao luis"
  },
  {
    "key": "28-erros-pdf-curriculo",
    "title": "Erros de PDF no currículo que eliminam na triagem",
    "keyword": "curriculo pdf erros triagem"
  },
  {
    "key": "04-cursos-curriculo",
    "title": "Cursos no currículo: como listar sem parecer enchimento",
    "keyword": "cursos no curriculo sem enchimento"
  },
  {
    "key": "102-certificado-vs-pratica",
    "type": "GUIDE",
    "section": "guia",
    "title": "Certificado ou prática na triagem: o que priorizar no PDF",
    "keyword": "certificado ou experiencia curriculo"
  },
  {
    "key": "29-email-pitch",
    "title": "E-mail de candidatura: assunto e corpo que geram resposta",
    "keyword": "email candidatura emprego modelo"
  },
  {
    "key": "42-whatsapp-candidatura",
    "type": "GUIDE",
    "section": "guia",
    "title": "Candidatura por WhatsApp: mensagem curta que não queima a vaga",
    "keyword": "candidatura whatsapp emprego mensagem"
  },
  {
    "key": "62-carta-apresentacao",
    "title": "Carta de apresentação curta: quando enviar e o que escrever",
    "keyword": "carta apresentacao emprego curta"
  },
  {
    "key": "104-mensagem-recrutador",
    "title": "Mensagem fria a recrutador: template LinkedIn/WhatsApp sem spam",
    "keyword": "mensagem fria recrutador linkedin"
  },
  {
    "key": "18-pedir-salario",
    "title": "Pretensão salarial na entrevista: faixa sem chute nem medo",
    "keyword": "pretensao salarial entrevista dicas"
  },
  {
    "key": "19-beneficios-vaga",
    "type": "GUIDE",
    "section": "guia",
    "title": "Benefícios da vaga: checklist para comparar além do bruto",
    "keyword": "comparar beneficios vaga emprego"
  },
  {
    "key": "55-vale-alimentacao",
    "type": "GUIDE",
    "section": "guia",
    "title": "Vale-alimentação ou refeição: diferença que muda o líquido",
    "keyword": "vale alimentacao ou refeicao diferenca"
  },
  {
    "key": "93-custo-vida-salario",
    "type": "DATA_REPORT",
    "section": "dados",
    "title": "Salário × custo de vida em São Luís: conta antes de aceitar",
    "keyword": "salario custo de vida sao luis"
  },
  {
    "key": "20-trabalho-hibrido",
    "type": "GUIDE",
    "section": "guia",
    "title": "Trabalho híbrido em São Luís: o que confirmar antes de aceitar",
    "keyword": "trabalho hibrido sao luis checklist"
  },
  {
    "key": "60-home-office-checklist",
    "title": "Home office: checklist antes de aceitar vaga 100% remota",
    "keyword": "home office remoto checklist vaga"
  },
  {
    "key": "08-ir-2026-trabalhador",
    "type": "NEWS",
    "section": "noticias",
    "title": "IR 2026 CLT: o básico para trabalhador sem cair em golpe",
    "keyword": "imposto de renda 2026 trabalhador clt"
  },
  {
    "key": "09-decimo-terceiro",
    "type": "NEWS",
    "section": "noticias",
    "title": "13º salário na janela de pagamento: o que conferir no holerite",
    "keyword": "decimo terceiro salario pagamento clt"
  },
  {
    "key": "13-feriado-facultativo",
    "type": "NEWS",
    "section": "noticias",
    "title": "Feriado ou facultativo em São Luís: como isso muda sua escala",
    "keyword": "feriado ponto facultativo sao luis"
  },
  {
    "key": "57-contrato-temporario",
    "type": "NEWS",
    "section": "noticias",
    "title": "Contrato temporário na temporada: o que ler antes de assinar",
    "keyword": "contrato temporario temporada direitos"
  },
  {
    "key": "75-turismo-hotelaria",
    "type": "NEWS",
    "section": "noticias",
    "title": "Vagas de hotelaria em São Luís: temporada e atendimento",
    "keyword": "vagas hotelaria temporada sao luis"
  },
  {
    "key": "105-panorama-mercado-local",
    "type": "DATA_REPORT",
    "section": "dados",
    "title": "Busca de emprego em São Luís 2026: o que priorizar no semestre",
    "keyword": "busca emprego sao luis 2026"
  },
  {
    "key": "03-primeiro-emprego",
    "type": "GUIDE",
    "section": "guia",
    "title": "Primeiro emprego em São Luís: checklist antes de candidatar",
    "keyword": "primeiro emprego sao luis checklist"
  },
  {
    "key": "07-vagas-afirmativas",
    "type": "GUIDE",
    "section": "guia",
    "title": "Vagas afirmativas: ler o anúncio e candidatar com segurança",
    "keyword": "vagas afirmativas como candidatar"
  },
  {
    "key": "12-ponto-atraso",
    "type": "GUIDE",
    "section": "guia",
    "title": "Ponto e atraso no trabalho: o que confirmar na prática",
    "keyword": "ponto eletronico atraso trabalho"
  },
  {
    "key": "24-retorno-ao-trabalho",
    "type": "GUIDE",
    "section": "guia",
    "title": "Voltar ao mercado após pausa: explicar o gap no currículo",
    "keyword": "retorno mercado trabalho gap curriculo"
  },
  {
    "key": "25-seguranca-mulheres",
    "type": "GUIDE",
    "section": "guia",
    "title": "Segurança de candidatas: entrevista e deslocamento com menos risco",
    "keyword": "seguranca candidatas entrevista emprego"
  },
  {
    "key": "31-testes-online",
    "type": "GUIDE",
    "section": "guia",
    "title": "Teste online de seleção: o que fazer antes do cronômetro",
    "keyword": "teste online processo seletivo dicas"
  },
  {
    "key": "33-pedido-demissao",
    "type": "GUIDE",
    "section": "guia",
    "title": "Pedido de demissão: aviso prévio, acerto e saída sem queimar ponte",
    "keyword": "pedido demissao aviso previo acerto"
  },
  {
    "key": "34-escala-6x1",
    "type": "GUIDE",
    "section": "guia",
    "title": "Escala 6x1: perguntas essenciais antes de aceitar a vaga",
    "keyword": "escala 6x1 o que perguntar"
  },
  {
    "key": "39-entrevista-presencial",
    "type": "GUIDE",
    "section": "guia",
    "title": "Entrevista presencial em São Luís: trajeto, horário e impressão",
    "keyword": "entrevista presencial sao luis dicas"
  },
  {
    "key": "44-transporte-entrevista",
    "type": "GUIDE",
    "section": "guia",
    "title": "Transporte até a entrevista em São Luís: planejar para não atrasar",
    "keyword": "transporte entrevista emprego sao luis"
  },
  {
    "key": "48-rejeicao-candidatura",
    "type": "GUIDE",
    "section": "guia",
    "title": "Rejeição no processo seletivo: reagir sem travar a busca",
    "keyword": "rejeicao processo seletivo como reagir"
  },
  {
    "key": "51-banco-horas",
    "type": "GUIDE",
    "section": "guia",
    "title": "Banco de horas: o que confirmar no regulamento da empresa",
    "keyword": "banco de horas direitos trabalhador"
  },
  {
    "key": "54-seguro-desemprego",
    "type": "GUIDE",
    "section": "guia",
    "title": "Seguro-desemprego: checklist após demissão sem justa causa",
    "keyword": "seguro desemprego checklist documentos"
  },
  {
    "key": "58-assedio-trabalho",
    "type": "GUIDE",
    "section": "guia",
    "title": "Assédio no trabalho: sinais, registro e canais com menos risco",
    "keyword": "assedio no trabalho o que fazer"
  },
  {
    "key": "64-ofertas-multiplas",
    "type": "GUIDE",
    "section": "guia",
    "title": "Duas ofertas de emprego: como comparar sem pressa tóxica",
    "keyword": "comparar duas propostas emprego"
  },
  {
    "key": "69-profissional-40-mais",
    "type": "GUIDE",
    "section": "guia",
    "title": "Emprego após os 40: posicionar experiência sem se apagar",
    "keyword": "emprego apos 40 anos curriculo"
  },
  {
    "key": "78-sindicato-basico",
    "type": "GUIDE",
    "section": "guia",
    "title": "Sindicato e trabalhador: o básico para não cair em boato",
    "keyword": "sindicato trabalhador direitos basico"
  },
  {
    "key": "81-acidente-trabalho",
    "type": "GUIDE",
    "section": "guia",
    "title": "Acidente de trabalho: primeiros passos e registro sem pânico",
    "keyword": "acidente de trabalho o que fazer"
  },
  {
    "key": "83-trabalho-noturno",
    "type": "GUIDE",
    "section": "guia",
    "title": "Trabalho noturno: adicional, sono e perguntas antes de aceitar",
    "keyword": "trabalho noturno adicional o que perguntar"
  },
  {
    "key": "92-mitos-direitos",
    "type": "GUIDE",
    "section": "guia",
    "title": "Mitos trabalhistas no WhatsApp: como checar antes de decidir",
    "keyword": "mitos direitos trabalhistas whatsapp"
  },
  {
    "key": "95-trabalho-fim-semana",
    "type": "GUIDE",
    "section": "guia",
    "title": "Trabalho no fim de semana: alinhar folga e adicional",
    "keyword": "trabalhar fim de semana folga adicional"
  },
  {
    "key": "98-entrevista-desligamento",
    "type": "GUIDE",
    "section": "guia",
    "title": "Entrevista de desligamento: o que falar e o que guardar",
    "keyword": "entrevista desligamento o que falar"
  },
  {
    "key": "103-burnout-sinais",
    "type": "GUIDE",
    "section": "guia",
    "title": "Esgotamento na busca de emprego: sinais e quando pausar",
    "keyword": "esgotamento busca emprego sinais"
  },
  {
    "key": "02-soft-hard-skills",
    "type": "GUIDE",
    "section": "guia",
    "title": "Soft e hard skills no anúncio: como provar sem inventar",
    "keyword": "soft skills hard skills curriculo"
  },
  {
    "key": "40-setores-vagas",
    "type": "DATA_REPORT",
    "section": "dados",
    "title": "Mapa de setores em São Luís: como priorizar sua busca",
    "keyword": "mapa setores vagas sao luis"
  },
  {
    "key": "43-comercio-servicos",
    "type": "DATA_REPORT",
    "section": "dados",
    "title": "Comércio e serviços em São Luís: checklist do que o anúncio pede",
    "keyword": "vagas comercio servicos sao luis perfil"
  },
  {
    "key": "68-ingles-curriculo",
    "type": "GUIDE",
    "section": "guia",
    "title": "Inglês no currículo: declarar nível sem inventar fluência",
    "keyword": "ingles no curriculo nivel honesto"
  },
  {
    "key": "74-vendas-balcao",
    "type": "GUIDE",
    "section": "guia",
    "title": "Vendas no balcão: meta, comissão e tom que não afasta",
    "keyword": "vagas vendedor loja comissao dicas"
  },
  {
    "key": "79-acordo-coletivo",
    "type": "GUIDE",
    "section": "guia",
    "title": "Acordo e convenção coletiva: o que isso muda no holerite",
    "keyword": "convencao coletiva holerite trabalhador"
  },
  {
    "key": "88-alfabetizacao-digital",
    "type": "GUIDE",
    "section": "guia",
    "title": "Alfabetização digital para emprego: o mínimo que destrava",
    "keyword": "alfabetizacao digital emprego basico"
  },
  {
    "key": "99-vagas-sazonais",
    "type": "GUIDE",
    "section": "guia",
    "title": "Vaga sazonal em São Luís: entrar no pico sem ilusão de efetivo",
    "keyword": "vaga sazonal comercio sao luis"
  },
  {
    "key": "90-comparar-portais",
    "type": "DATA_REPORT",
    "section": "dados",
    "title": "Comparar portais de emprego: checklist anti-duplicata e golpe",
    "keyword": "comparar portais emprego seguranca"
  },
  {
    "key": "10-ferias-direitos",
    "title": "Férias CLT: período aquisitivo e o que perguntar na admissão",
    "keyword": "ferias clt periodo aquisitivo"
  },
  {
    "key": "11-abono-pecuniario",
    "title": "Abono pecuniário: vender 1/3 das férias sem se perder no holerite",
    "keyword": "abono pecuniario ferias holerite"
  },
  {
    "key": "14-ctps-digital",
    "title": "CTPS digital: conferir vínculos e anotações no celular",
    "keyword": "ctps digital carteira trabalho consultar"
  },
  {
    "key": "15-auxiliar-administrativo",
    "title": "Auxiliar administrativo em São Luís: prove além de organizado",
    "keyword": "auxiliar administrativo vagas sao luis"
  },
  {
    "key": "21-golpes-emprego",
    "title": "Golpe de vaga em São Luís: sinais de alerta antes do PIX",
    "keyword": "golpe vaga emprego sao luis"
  },
  {
    "key": "22-documentos-admissao",
    "title": "Documentos de admissão no MA: pasta pronta para o dia D",
    "keyword": "documentos admissao emprego maranhao"
  },
  {
    "key": "23-networking-local",
    "title": "Networking em São Luís: pedidos que as pessoas respondem",
    "keyword": "networking emprego sao luis"
  },
  {
    "key": "32-ler-holerite",
    "title": "Como ler holerite: bruto, descontos e o que conferir todo mês",
    "keyword": "como ler holerite descontos"
  },
  {
    "key": "35-alimentacao-servicos",
    "title": "Vagas em restaurante em São Luís: higiene, pico e perguntas",
    "keyword": "vagas restaurante sao luis dicas"
  },
  {
    "key": "38-usar-portal-es",
    "title": "Como usar o Empregos São Luís: filtro à candidatura segura",
    "keyword": "como usar empregos sao luis"
  },
  {
    "key": "41-experiencia-informal",
    "title": "Experiência informal no currículo: descrever sem inventar cargo",
    "keyword": "experiencia informal curriculo como colocar"
  },
  {
    "key": "46-linkedin-candidato",
    "title": "LinkedIn para vagas em São Luís: perfil que gera conversa",
    "keyword": "linkedin emprego sao luis perfil"
  },
  {
    "key": "47-follow-up-entrevista",
    "title": "Follow-up após entrevista: quando mandar e o que escrever",
    "keyword": "follow up apos entrevista mensagem"
  },
  {
    "key": "50-pedir-aumento",
    "title": "Como pedir aumento de salário: argumentos sem ultimato",
    "keyword": "como pedir aumento salario"
  },
  {
    "key": "52-hora-extra-direitos",
    "title": "Hora extra no holerite: como conferir se o adicional entrou",
    "keyword": "hora extra holerite como conferir"
  },
  {
    "key": "53-fgts-basico",
    "title": "FGTS do trabalhador CLT: o que acompanhar no app oficial",
    "keyword": "fgts consultar trabalhador clt"
  },
  {
    "key": "56-periodo-experiencia",
    "title": "Período de experiência CLT: o que perguntar na admissão",
    "keyword": "periodo experiencia clt o que saber"
  },
  {
    "key": "61-mudanca-carreira",
    "title": "Mudança de carreira em São Luís: transição sem apagar o passado",
    "keyword": "mudanca de carreira sao luis curriculo"
  },
  {
    "key": "65-agradecimento-pos",
    "title": "Agradecimento pós-entrevista: mensagem curta que não parece robô",
    "keyword": "agradecimento pos entrevista mensagem"
  },
  {
    "key": "70-retorno-maternidade",
    "title": "Volta ao trabalho após maternidade: currículo e conversa sem culpa",
    "keyword": "retorno trabalho apos maternidade"
  },
  {
    "key": "71-call-center-perfil",
    "title": "Vagas de call center em São Luís: meta, voz e o que perguntar",
    "keyword": "vagas call center sao luis"
  },
  {
    "key": "72-recepcao-clinica",
    "title": "Recepcionista de clínica em São Luís: o que o anúncio espera",
    "keyword": "vaga recepcionista clinica sao luis"
  },
  {
    "key": "73-estoque-logistica",
    "title": "Vagas de estoque em São Luís: precisão sem jargão vazio",
    "keyword": "vagas estoque logistica sao luis"
  },
  {
    "key": "76-motorista-entregas",
    "title": "Motorista e entregas em São Luís: documentos, rota e omissões",
    "keyword": "vagas motorista entregador sao luis"
  },
  {
    "key": "80-atestado-medico",
    "title": "Atestado médico no emprego: prazo, entrega e cuidados",
    "keyword": "atestado medico trabalho como entregar"
  },
  {
    "key": "82-terceirizado-direitos",
    "title": "Trabalho terceirizado: quem é o empregador e o que perguntar",
    "keyword": "trabalhador terceirizado direitos"
  },
  {
    "key": "84-conflito-lideranca",
    "title": "Conflito com a chefia: documentar e falar com objetividade",
    "keyword": "conflito com chefe trabalho dicas"
  },
  {
    "key": "86-inteligencia-emocional",
    "title": "Inteligência emocional na entrevista: calma na prática",
    "keyword": "inteligencia emocional entrevista"
  },
  {
    "key": "91-ler-contrato-clt",
    "title": "Ler contrato CLT antes de assinar: cláusulas que pedem pausa",
    "keyword": "ler contrato trabalho clt"
  },
  {
    "key": "94-negociar-deslocamento",
    "title": "Deslocamento longo ao emprego: negociar horário ou auxílio",
    "keyword": "negociar horario deslocamento emprego"
  },
  {
    "key": "96-transferencia-interna",
    "title": "Transferência interna: pedir mudança de setor sem queimar ponte",
    "keyword": "transferencia interna emprego como pedir"
  },
  {
    "key": "100-empatia-atendimento",
    "title": "Empatia no atendimento: soft skill que o anúncio não explica",
    "keyword": "empatia atendimento cliente entrevista"
  },
  {
    "key": "101-gap-habilidades",
    "title": "Gap de habilidades na vaga: fechar o buraco até o anúncio",
    "keyword": "gap habilidades candidatura como fechar"
  }
].map((p) => [p.key, p]));

const legalDisclaimerKeys = new Set([
  "07-vagas-afirmativas",
  "08-ir-2026-trabalhador",
  "09-decimo-terceiro",
  "10-ferias-direitos",
  "11-abono-pecuniario",
  "12-ponto-atraso",
  "13-feriado-facultativo",
  "14-ctps-digital",
  "26-inclusao-pcd",
  "27-freela-vs-clt",
  "32-ler-holerite",
  "33-pedido-demissao",
  "34-escala-6x1",
  "51-banco-horas",
  "52-hora-extra-direitos",
  "53-fgts-basico",
  "54-seguro-desemprego",
  "56-periodo-experiencia",
  "57-contrato-temporario",
  "58-assedio-trabalho",
  "78-sindicato-basico",
  "79-acordo-coletivo",
  "80-atestado-medico",
  "81-acidente-trabalho",
  "82-terceirizado-direitos",
  "83-trabalho-noturno",
  "91-ler-contrato-clt",
  "92-mitos-direitos",
  "95-trabalho-fim-semana",
  "98-entrevista-desligamento"
]);

function sectionForType(type) {
  if (type === "NEWS") return "noticias";
  if (type === "DATA_REPORT") return "dados";
  return "guia";
}

/** @type {CatalogItem[]} */
export const catalog = rawCatalog.map((item) => {
  const patch = catalogPatchByKey.get(item.key) || {};
  const next = {
    ...item,
    ...(patch.type ? { type: patch.type } : {}),
    ...(patch.title ? { title: patch.title } : {}),
    ...(patch.keyword ? { keyword: patch.keyword } : {})
  };
  next.section = patch.section || sectionForType(next.type);
  if (legalDisclaimerKeys.has(item.key)) next.legalDisclaimer = true;
  return next;
});

/** @param {CatalogItem} item */
export function slugFor(item) {
  return `${SLUG_BASE}-${item.key}`;
}
