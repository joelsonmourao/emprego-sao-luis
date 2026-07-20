/**
 * Catálogo de 45 peças editoriais locais (São Luís / Maranhão).
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
  }
];

/** @param {CatalogItem} item */
export function slugFor(item) {
  return `${SLUG_BASE}-${item.key}`;
}
