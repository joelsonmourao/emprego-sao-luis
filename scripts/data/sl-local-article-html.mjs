/**
 * HTML público dos posts sl-local — corpo distinto por tema, sem repetir “Grande Ilha”
 * nem o mesmo bloco genérico em todos os artigos.
 */
import { MIN_USEFUL_CHARS, catalog } from "./sl-local-editorial-catalog.mjs";
import { tipFollowups46to105 } from "./sl-local-tip-followups-46-105.mjs";

/** Cenas / ângulos únicos por chave (evita texto-clone). */
const scenes = {
  "01-curriculo-ats":
    "Você enviou o mesmo PDF para quinze vagas e nenhuma respondeu. Em vários processos da capital, o primeiro filtro é automático: se o arquivo não ecoa o cargo e as ferramentas do anúncio, a fila humana nem chega a abrir. Adaptar não é mentir — é traduzir o que você já faz na linguagem da vaga.",
  "02-soft-hard-skills":
    "O anúncio pede Excel e “proatividade”. O Excel dá para provar com um exemplo; a proatividade só aparece se você contar uma cena real de fila, prazo ou reclamação resolvida. Separar hard de soft evita currículo cheio de adjetivo e entrevista vazia.",
  "03-primeiro-emprego":
    "Sem carteira anterior, a ansiedade empurra para candidatura em massa. O que muda o jogo na primeira semana é pasta pronta, currículo com tarefas honestas e mensagem curta. Experiência informal conta quando descrita com clareza — inventar cargo de gerente não.",
  "04-cursos-curriculo":
    "Certificado empilhado no rodapé não impressiona se você não sabe explicar o conteúdo em 30 segundos. Dois cursos alinhados ao cargo, com uma linha de aplicação prática, pesam mais do que dez abas de PDF decorativo.",
  "05-marca-pessoal":
    "Marca pessoal barata começa no detalhe: nome igual em tudo, foto só se pedirem, WhatsApp sem status que contradiz o currículo. Em cidade média, incoerência vira conversa de corredor mais rápido do que post motivacional.",
  "06-produtividade-busca":
    "Maratona de domingo e abandono na terça é o padrão que cansa. Um bloco diário de menos de uma hora, com meta de candidaturas bem lidas, costuma gerar mais retorno do que trinta abas abertas sem registro.",
  "07-vagas-afirmativas":
    "Vaga afirmativa existe para abrir porta, não para coletar laudo no primeiro clique duvidoso. Leia o critério, use o canal oficial e prepare-se para a mesma entrevista de competência — a cota não substitui conversa clara sobre o posto.",
  "08-ir-2026-trabalhador":
    "Temporada de IR mistura e-mail legítimo de informe com golpe de “restuição liberada no PIX”. Organizar o informe da empresa e guardar senhas do gov.br longe de “ajudante” no WhatsApp é o básico que evita prejuízo maior que a própria declaração.",
  "09-decimo-terceiro":
    "O 13º chega no meio da correria de fim de ano. Conferir parcelas no holerite e guardar o demonstrativo evita descobrir erro só quando a conta de dezembro não fecha — e reduz boato de grupo no lugar de número real.",
  "10-ferias-direitos":
    "“Depois a gente marca” vira conflito na primeira baixa de movimento. Entender período aquisitivo e perguntar na admissão como a empresa costuma conceder férias evita expectativa errada de folga improvisada.",
  "11-abono-pecuniario":
    "Vender um terço das férias resolve uma conta urgente e adia o descanso. Sem pedido por escrito e linha clara no holerite, o “combinado de corredor” vira briga depois. Faça a conta de dinheiro e de cansaço juntos.",
  "12-ponto-atraso":
    "Dois minutos viram desconto conforme a política do ponto. Testar o trajeto no horário da escala — com chuva e pico — vale tanto quanto estudar o script da entrevista. Pedir para colega bater ponto por você transforma atraso em problema disciplinar.",
  "13-feriado-facultativo":
    "A prefeitura fecha atendimento e o shopping abre. Facultativo não é feriado nacional com as mesmas regras no seu contrato. Confirmar a escala do setor evita chegar folgado em dia de expediente — ou vice-versa.",
  "14-ctps-digital":
    "No dia da admissão, a RH pede a carteira no celular e a senha do gov.br não lembra. Conferir vínculos depois da contratação também importa: se o registro não aparece, pergunte cedo, com print e educação.",
  "15-auxiliar-administrativo":
    "“Sou organizado” não prova nada. Contar como você nomeou pastas, priorizou e-mails ou evitou perda de documento em prazo curto mostra o dia a dia do auxiliar administrativo melhor do que lista de soft skills genéricas.",
  "16-entrevista-video":
    "Resposta boa some atrás de eco, luz estourada e notificação no meio da call. Cinco minutos de teste no mesmo aparelho da entrevista mudam a impressão — e um plano B de dados móveis salva queda de sinal na capital.",
  "17-respostas-comportamentais":
    "“Conte uma situação difícil” trava quem só ensaiou elogio próprio. Três histórias curtas com situação, ação e resultado — de fila, prazo ou erro corrigido — sustentam a conversa sem novela e sem culpar o ex-chefe.",
  "18-pedir-salario":
    "Chutar alto sem pesquisa ou aceitar qualquer número na hora são dois extremos. Faixa realista, considerando passagem e escala na capital, conversa melhor do que teatro de “outras propostas” inventadas.",
  "19-beneficios-vaga":
    "Bruto bonito encolhe quando VT não cobre o trajeto e almoço sai do bolso. Comparar propostas em colunas — salário, vale, saúde, escala — mostra o líquido real da vida de quem trabalha longe do posto.",
  "20-trabalho-hibrido":
    "O anúncio diz híbrido; na prática, a segunda-feira presencial vira toda a semana “por causa da reunião”. Quantos dias, qual equipamento e qual aviso de mudança precisam estar claros antes do aceite.",
  "21-golpes-emprego":
    "A mensagem chega à noite: vaga garantida, só pagar a taxa do crachá. A pressa de quem precisa trabalhar é o combustível do golpe. Empresa séria não cobra candidatura — e não pede selfie com documento no primeiro “oi”.",
  "22-documentos-admissao":
    "A ligação pede comprovante atualizado para ontem. Foto borrada e arquivo com nome “documento(3).pdf” atrasam o início. Pasta digital nomeada e cópia física pronta transformam admissão em formalidade, não em corrida.",
  "23-networking-local":
    "Pedido genérico cansa quem poderia ajudar. Mensagem com cargo-alvo, PDF leve e texto pronto para encaminhar respeita o tempo da rede — e na capital indicação específica ainda abre porta que currículo frio não abre.",
  "24-retorno-ao-trabalho":
    "O gap no currículo assusta mais quem mente do que quem resume em uma frase. Foco no que você entrega agora, contato atualizado e referência de quem viu seu trabalho antes da pausa costumam destravar a conversa.",
  "25-seguranca-mulheres":
    "Entrevista em endereço sem placa, fora do horário comercial, com urgência artificial: pare. Local identificável, aviso a alguém de confiança e recusa a pedido invasivo de foto ou dado bancário não são “frescura” — são filtro de risco.",
  "26-inclusao-pcd":
    "Inclusão de verdade se mede no posto: acesso, banheiro, transporte interno, adaptação. Perguntar com objetividade evita aceitar vaga que existe no papel e falha na rampa do prédio.",
  "27-freela-vs-clt":
    "O freela paga bem na semana cheia e some na vazia. A CLT desconta e protege. Antes de trocar vínculo, some impostos, intervalos sem demanda e se a “PJ” na prática é horário de empregado sem direito.",
  "28-erros-pdf-curriculo":
    "O recrutador abre o arquivo no ônibus e o texto é imagem ilegível. Nome genérico, PDF pesado e telefone errado eliminam candidato bom antes da primeira pergunta. Teste no celular o que você mesmo enviaria.",
  "29-email-pitch":
    "Caixa de entrada lotada enterra assunto “currículo”. Cargo, nome e duas provas de adequação no corpo curto fazem o e-mail trabalhar. Certificado em excesso no primeiro contato vira ruído.",
  "30-dinamica-grupo":
    "Quem grita mais não ganha a dinâmica. Quem escuta, propõe e inclui quem falou pouco demonstra o comportamento que a maioria dos processos locais quer ver em equipe de atendimento e operação.",
  "31-testes-online":
    "O cronômetro começa e a luz cai. Teste online pune ambiente improvisado. Ler o e-mail até o fim, carregar o aparelho e ter dados móveis de reserva evita zerar por infraestrutura, não por falta de conhecimento.",
  "32-ler-holerite":
    "O depósito caiu “estranho” e o demonstrativo ficou no WhatsApp perdido. Conferir bruto, descontos e líquido todo mês — com pasta organizada — evita descobrir erro só no acerto final.",
  "33-pedido-demissao":
    "Avisar o time no grupo antes da liderança queima ponte. Saída clara, devolução de equipamento e guarda de documentos importam tanto quanto a decisão de sair — a capital lembra de saída tumultuada.",
  "34-escala-6x1":
    "Seis dias ligados mudam sono e domingo em família. Folga rotativa, feriado e hora extra precisam de resposta na entrevista; “a gente vê depois” costuma virar sobrecarga no primeiro mês.",
  "35-alimentacao-servicos":
    "O anúncio omite se a gorjeta entra na conta e se o sábado é regra. Alimentação vive de pico: higiene, ritmo e escala real importam mais do que foto de prato no Instagram da empresa.",
  "36-servicos-gerais-epi":
    "“Faz de tudo” sem lista e sem luva adequada é risco. Escopo escrito e EPI fornecido não são detalhe — são o que separa posto sério de improviso perigoso com produto químico sem rótulo.",
  "37-plano-semanal-busca":
    "Sem calendário, a busca vira culpa noturna. Segunda a sábado com metas curtas — ler, adaptar, enviar, treinar — sustenta ritmo. Domingo de descanso de verdade melhora o e-mail da segunda.",
  "38-usar-portal-es":
    "Grupo paralelo promete “vaga antes de todo mundo” e pede taxa. O caminho seguro é filtro no portal, leitura completa e canal oficial do anúncio. Atalho fora do Empregos São Luís é onde mora o golpe.",
  "39-entrevista-presencial":
    "O pin do mapa aponta um quarteirão; o acesso do prédio é outro. Confirmar endereço, sair com margem e cumprimentar a recepção bem define os primeiros trinta segundos — antes mesmo das perguntas.",
  "40-setores-vagas":
    "Candidatar-se a tudo dilui energia. Separar comércio, serviços, alimentação e administrativo por encaixe real — e pelo tempo de ônibus até o posto — concentra esforço onde há mais abertura visível.",
  "41-experiencia-informal":
    "“Gerente da loja da família” sem poder de decisão cai em dois minutos. Título honesto e lista de tarefas (atendeu, organizou, controlou estoque) transformam bico em evidência útil.",
  "42-whatsapp-candidatura":
    "“Oi” isolado e áudio longo não ajudam. Nome, vaga, origem do anúncio e PDF nomeado respeitam o tempo de quem tria no celular entre uma demanda e outra.",
  "43-comercio-servicos":
    "Os anúncios se repetem: disponibilidade, comunicação, organização. Quem monta o currículo espelhando esse núcleo — e admite sábado quando for o caso — perde menos tempo em processo incompatível.",
  "44-transporte-entrevista":
    "Desculpa de ônibus na primeira conversa já nasce frágil. Ensaio de trajeto no horário real, crédito pronto e telefone do contato para atraso excepcional são preparação, não paranoia.",
  "45-panorama-candidaturas":
    "Vinte envios genéricos e zero resposta não pedem “mais volume”. Pedem planilha mínima: o que enviou, o que voltou, o que adaptar no PDF. Qualidade medida bate maratona cega.",
  "46-linkedin-candidato":
    "O PDF chegou limpo, mas o perfil online conta outra história: cargo genérico, foto de festa e zero resultado. Em vários processos da capital, o recrutador cruza as duas fontes depois da triagem. Alinhar título, experiências e tom profissional transforma o LinkedIn em reforço — não em contradição.",
  "47-follow-up-entrevista":
    "A conversa foi bem e o silêncio de dez dias vira spiral de áudios ansiosos. Follow-up único, no canal oficial, citando o cargo e um ponto da entrevista, reabre a porta sem parecer cobrança diária. Prazo combinado na saída continua sendo a melhor bússola.",
  "48-rejeicao-candidatura":
    "O “não” chega num dia em que a conta aperta. Reagir reescrevendo o currículo à noite inteira costuma piorar o material. Registrar a rejeição, ajustar um gap real frente ao anúncio e enviar outra candidatura alinhada no dia seguinte mantém o funil vivo.",
  "49-primeira-semana-emprego":
    "No emprego novo, todo mundo aponta um fluxo diferente. Quem anota ponto, senhas básicas e nomes-chave na primeira semana evita erro público no sábado de pico. Observar antes de “revolucionar o processo” no dia dois também protege a imagem.",
  "50-pedir-aumento":
    "Pedir aumento com ameaça de demissão inventada queima confiança. Chegar com entregas dos últimos meses, faixa de mercado e pergunta sobre janela de revisão transforma a conversa em negociação. O “não” com data ainda é informação útil.",
  "51-banco-horas":
    "“Fica mais uma e a gente compensa” sem regra escrita vira saldo invisível. Banco de horas sério tem política, registro e prazo. Anotar o extra no mesmo dia e pedir o regulamento antes do feriado evita briga de memória no mês seguinte.",
  "52-hora-extra-direitos":
    "O espelho de ponto mostra duas horas a mais; o holerite não. Cruzar os dois documentos no mesmo mês — e perguntar com educação — é o caminho curto. “Depois a gente acerta” sem prazo é o caminho longo do prejuízo.",
  "53-fgts-basico":
    "Muita gente só abre o FGTS na demissão e encontra buraco. Consulta periódica no app oficial, com senha protegida, transforma surpresa em cobrança precoce. Oferta de “liberação via PIX” de desconhecido continua sendo golpe clássico.",
  "54-seguro-desemprego":
    "A demissão sem justa causa mistura alívio e medo. Organizar documentos e usar canal oficial do requerimento reduz fila emocional e intermediação paga suspeita. Protocolo anotado vale mais que promessa de despachante no WhatsApp.",
  "55-vale-alimentacao":
    "Duas propostas com o mesmo bruto divergem no cartão: uma alimenta o almoço perto do posto, outra o mercado do mês. Colocar VA/VR na tabela ao lado do salário revela o líquido da vida real — especialmente com trajeto longo.",
  "56-periodo-experiencia":
    "Os primeiros 45 ou 90 dias não são terra sem lei. Duração, critério de avaliação e benefícios precisam estar claros. Usar o período para avaliar a empresa — escala, respeito, segurança — é tão legítimo quanto ser avaliado.",
  "57-contrato-temporario":
    "A vaga de temporada paga rápido e termina na data. Quem lê início, fim e empregador formal evita o susto de “acabou ontem” sem acerto. Temporário eterno renovado sem transparência merece pergunta dura antes da assinatura.",
  "58-assedio-trabalho":
    "Humilhação repetida ou conduta sexualizada não é cultura de time. Registrar datas e mensagens, buscar canal seguro e priorizar a própria integridade é resposta adulta. Post público no calor do momento raramente substitui prova e orientação.",
  "59-saude-mental-trabalho":
    "Insônia, irritação e medo constante de errar não são medalha de dedicação. Limitar o celular de trabalho no intervalo, observar a escala e buscar apoio quando o corpo pede são parte de se manter capaz de trabalhar — e de buscar outra vaga se preciso.",
  "60-home-office-checklist":
    "O anúncio vende liberdade; a segunda-feira exige presença “só dessa vez” toda semana. Confirmar dias remotos, equipamento e auxílio de internet antes do aceite evita romance furado. Remoto com taxa de liberação continua sendo fraude.",
  "61-mudanca-carreira":
    "Apagar o emprego anterior do PDF não convence. Traduzir o que se repete — atendimento, prazo, planilha — e aceitar um degrau de entrada na área nova costuma funcionar melhor do que fingir expertise sênior do dia para a noite.",
  "62-carta-apresentacao":
    "Carta de uma página com biografia completa perde para um parágrafo no e-mail: cargo, duas provas, telefone. Em processos locais que ainda usam caixa de entrada, objetividade abre; literatura fecha a aba.",
  "63-referencias-profissionais":
    "Colocar telefone de alguém que não autorizou é tiro no pé. Referência útil avisada, atualizada e capaz de falar da sua entrega real ainda move processo na capital — inventar contato é descoberta rápida.",
  "64-ofertas-multiplas":
    "Duas propostas na mesma semana pedem tabela, não impulso. Bruto, benefício, escala e trajeto na mesma folha mostram o líquido. Recusar com educação preserva ponte numa cidade onde indicação circular importa.",
  "65-agradecimento-pos":
    "“Obrigado pela oportunidade” idêntico ao de todo mundo some. Duas frases no mesmo dia, citando um tema real da conversa, reforçam interesse sem parecer robô de internet. Canal oficial da entrevista continua sendo o certo.",
  "66-codigo-vestimenta":
    "Terno em cozinha e bermuda em escritório bancário distraem pelo motivo errado. Ler o setor, priorizar limpeza e sobreviver ao calor da capital com tecido respirável é o meio-termo que deixa a resposta brilhar.",
  "67-excel-basico-vagas":
    "O anúncio pede Excel intermediário e o teste pede filtro e SOMA. Treinar o básico bem feito e declarar o nível com honestidade evita o constrangimento do “domino macros” que trava no primeiro critério.",
  "68-ingles-curriculo":
    "Fluência no PDF e silêncio na saudação em inglês quebram a entrevista em trinta segundos. Nível honesto, contexto de uso e ensaio curto quando a vaga exige o idioma protegem mais do que adjetivo inflado.",
  "69-profissional-40-mais":
    "Esconder vinte anos de história ou romantizar “ainda corro” são extremos ruins. Destacar entrega recente, ferramenta atual e motivo claro para a vaga posiciona experiência como ativo — não como peso a justificar.",
  "70-retorno-maternidade":
    "A pausa existe; a culpa excessiva na entrevista não precisa. Uma linha objetiva, contato atualizado e perguntas práticas de escala mostram preparo. Recrutadores veem retornos o tempo todo — confusão na história é que atrapalha.",
  "71-call-center-perfil":
    "Headset, meta e pausa curta definem o posto mais do que o sorriso do anúncio. Perguntar como a qualidade é medida e se o equipamento home office existe evita mês um de surpresa. Simulação de cliente irritado ainda é comum na seleção.",
  "72-recepcao-clinica":
    "Recepção de clínica é fila, WhatsApp e sigilo ao mesmo tempo. Quem descreve organização de agenda e discrição com dado de paciente fala a língua do anúncio melhor do que “sou comunicativa” sem cena.",
  "73-estoque-logistica":
    "Diferença de inventário e nota conferida errada custam caro. Currículo com verbos de conferência, organização e correção de erro concreto convence mais que lista de soft skills de poster motivacional.",
  "74-vendas-balcao":
    "Comissão no cartaz e terça vazia na loja são a mesma proposta vista de dois ângulos. Perguntar base, percentual e estorno de devolução revela o líquido. Abordagem educada ainda vende mais do que pressão que afasta.",
  "75-turismo-hotelaria":
    "Alta temporada enche o lobby e a escala. Candidato que pergunta sobre pico, plantão e se a vaga é sazonal ou efetiva chega menos iludido — e demonstra leitura do setor de hospedagem da capital.",
  "76-motorista-entregas":
    "CNH ok não paga combustível sozinha. Combinar veículo, meta, seguro e tempo real de rota com chuva e trânsito evita aceite que só fecha a conta no papel. Taxa para liberar rota continua sendo sinal vermelho.",
  "77-plano-90-dias":
    "Busca sem horizonte vira culpa diária. Noventa dias com metas de material, envio de qualidade e treino de entrevista organizam energia. Se a taxa de resposta for zero no fim, muda-se o PDF — não só o volume.",
  "78-sindicato-basico":
    "Áudio de grupo com percentual de reajuste não substitui convenção. Identificar categoria e buscar canal oficial reduz decisão tomada no susto. Contribuição estranha cobrada por desconhecido merece pausa.",
  "79-acordo-coletivo":
    "Piso e adicional podem estar na norma coletiva, não só no “combinado” do supervisor. Pedir qual acordo se aplica e cruzar com o holerite transforma achismo em pergunta com documento.",
  "80-atestado-medico":
    "Atestado adulterado é problema grave; atestado legítimo entregue no canal errado também vira dor de cabeça. Conhecer prazo e guardar comprovante de envio são o básico que a admissão deveria esclarecer.",
  "81-acidente-trabalho":
    "Depois do susto, a pressão para “deixar quieto” aparece. Saúde primeiro, comunicação à liderança e registro de fatos protegem o depois. Assinar o que não se entendeu na pressa é risco evitável.",
  "82-terceirizado-direitos":
    "O crachá é de um nome; o holerite é de outro. Saber quem é o empregador formal define onde cobrar atraso e como guardar documentos. Terceirização séria explica o vínculo — improviso eterno não.",
  "83-trabalho-noturno":
    "Adicional noturno atrai; sono e ônibus de madrugada cobram. Confirmar transporte, refeição e publicação de escala antes do aceite evita descobrir o custo humano só na terceira semana.",
  "84-conflito-lideranca":
    "Conflito de meta vira guerra de corredor quando só existe áudio inflamado. Fatos, conversa privada e canal interno objetivo reduzem dano. Ambiente abusivo pede plano de segurança e saída — não só paciência infinita.",
  "85-feedback-entrevista":
    "Poucos retornos vêm detalhados; quando vêm, viram ajuste de PDF na mesma semana. Pedir com educação, agradecer e não tentar reverter a decisão na hora transforma “não” em dado de mercado pessoal.",
  "86-inteligencia-emocional":
    "A pergunta foi injusta e a vontade é ironizar. Pausa curta, resposta respeitosa e história sem ataque pessoal demonstram o que o anúncio chama de inteligência emocional — sem precisar usar a palavra.",
  "87-gestao-tempo-posto":
    "No time enxuto, tudo parece prioridade máxima. Alinhar a ordem do dia com a liderança e avisar atraso cedo evita rótulo de lento. Lista simples no bolso ainda salva demanda oral esquecida.",
  "88-alfabetizacao-digital":
    "A vaga morre no formulário que não envia, no PDF que não anexa, na foto de documento ilegível. Treino curto de envio digital destrava mais candidatura local do que curso caro que promete emprego garantido.",
  "89-portfolio-simples":
    "Três provas anonimizadas em PDF leve mostram organização melhor do que site que não carrega no 4G. Portfólio só entra quando reforça o anúncio — e nunca com dado sensível de cliente.",
  "90-comparar-portais":
    "A mesma vaga em cinco grupos com salários diferentes é armadilha de tempo e golpe. Âncora no canal oficial, registro de onde já enviou e recusa a taxa de “destaque” mantêm a busca limpa.",
  "91-ler-contrato-clt":
    "A caneta está na mesa e a loja quer você “já”. Dois minutos para cruzar salário, jornada e local com a proposta verbal evitam mês de “mas me falaram outra coisa”. Cópia para você não é frescura.",
  "92-mitos-direitos":
    "Corrente de WhatsApp com tom de certeza jurídica empurra gente para decisão ruim. Fonte, data e documento do próprio contrato pesam mais. Boato de reajuste não paga conta — e às vezes cria briga desnecessária.",
  "93-custo-vida-salario":
    "O bruto cabe no print; a passagem do mês não. Somar condução, almoço e tempo de trajeto na capital revela se a proposta sustenta. Comparar dois líquidos na mesma folha mata ilusão rápido.",
  "94-negociar-deslocamento":
    "O salário fecha e o ônibus não. Levar tempo real de trajeto e pedir ajuste específico — VT, horário, dia remoto — é negociação adulta. Recusar a tempo quando inviável também é.",
  "95-trabalho-fim-semana":
    "O anúncio fala segunda a sexta; a escala mostra domingo. Alinhar fim de semana, folga e adicional na entrevista evita demissão emocional no segundo mês de varejo ou alimentação.",
  "96-transferencia-interna":
    "Pedir troca de setor só com “cansei” raramente funciona. Histórico bom, motivo profissional e transição limpa preservam ponte. Fofoca paralela para forçar mudança costuma voltar como bloqueio.",
  "97-avaliacao-desempenho":
    "Avaliação sem evidência vira teatro. Chegar com números, um ponto de melhoria e pergunta sobre o próximo ciclo transforma a conversa em plano. Se não houver ciclo formal, pedir feedback registrado ainda ajuda.",
  "98-entrevista-desligamento":
    "Na saída, desabafo com nome e xingamento vira lenda local. Razões objetivas, pergunta de acerto e devolução protocolada fecham o ciclo com menos dano à próxima indicação.",
  "99-vagas-sazonais":
    "Pico de calendário abre porta rápida e fecha na data. Tratar sazonal como ponte — contrato lido, busca paralela no fim — evita a ilusão de efetivo automático que ninguém prometeu por escrito.",
  "100-empatia-atendimento":
    "Empatia no anúncio não é concordar com grito. É ouvir, reformular o problema e propor próximo passo sem aceitar abuso. Uma cena real na entrevista fala mais alto que a palavra colada no currículo.",
  "101-gap-habilidades":
    "Três requisitos, uma skill sua. Mapear obrigatório versus desejável, treinar o que se repete nos anúncios e declarar aprendizado com honestidade rende mais do que mentir domínio na ficha.",
  "102-certificado-vs-pratica":
    "Certificado sem hora de prática trava no teste; prática sem papel perde vaga que exige o curso. Ler o que é obrigatório no anúncio e equilibrar os dois evita pasta decorativa e entrevista vazia.",
  "103-burnout-sinais":
    "Candidatura às duas da manhã com raiva raramente melhora a taxa. Pausar 48 horas, dormir e voltar com meta menor é método. Esgotamento disfarçado de “dedicação” queima material e saúde.",
  "104-mensagem-recrutador":
    "Mensagem fria genérica vira spam na caixa do recrutador. Cargo, uma prova, pedido específico e zero cobrança diária respeitam o tempo de quem tria. Ortografia no primeiro contato ainda elimina gente boa.",
  "105-panorama-mercado-local":
    "Sem bola de cristal, o panorama útil é padrão: setores que mais anunciam, peso da escala e golpe a filtrar. Medir o próprio funil e usar canal seguro continua sendo a estratégia prática para 2026 na capital."
};

/** Follow-ups únicos por chave (6 cada) — evitam parágrafo-clone entre posts. */
const tipFollowups = {
  "01-curriculo-ats": [
    "Se a palavra não for verdadeira no seu histórico, o filtro passa e a entrevista quebra — honestidade continua sendo regra.",
    "Cargo-alvo no topo orienta tanto o sistema quanto o olho humano nos primeiros três segundos.",
    "Número simples (fila, prazo, volume) é mais crível do que adjetivo solto.",
    "Tabela bonita no Word vira texto embaralhado em vários leitores automáticos.",
    "Se não dá para selecionar o texto, trate o arquivo como foto — e refaça.",
    "Versão base poupa tempo; versão adaptada aumenta chance na vaga que importa."
  ],
  "02-soft-hard-skills": [
    "Sem prova, hard skill vira bluff fácil de testar na prática.",
    "Cena concreta de soft skill gruda mais na memória do entrevistador.",
    "Inflar liderança é o atalho mais detectável em processo local.",
    "O que se repete em vários anúncios é o núcleo do mercado — priorize isso.",
    "Lista longa dilui o que realmente encaixa; três pontos fortes bastam no topo.",
    "Exemplo de pressão mostra comportamento melhor do que discurso ensaiado de livro."
  ],
  "03-primeiro-emprego": [
    "Documento ilegível atrasa admissão mesmo depois da “sim” verbal.",
    "Tarefa real de escola ou casa conta mais do que frase motivacional.",
    "Candidatura mirando cargo sênior sem base só gera frustração.",
    "Apresentação ensaiada evita branco na recepção.",
    "Indicação paga a estranho quase sempre é golpe disfarçado.",
    "Registro simples impede reenvio cego e mensagens duplicadas."
  ],
  "04-cursos-curriculo": [
    "Curso desalinhado ao cargo vira ruído visual no PDF.",
    "Ano e carga horária evitam parecer certificado eterno e vago.",
    "Uma linha de aplicação prática transforma o curso em evidência.",
    "Topo do currículo é território caro — não desperdice com enchimento.",
    "Entrevistador costuma perguntar o módulo mais recente: esteja pronto.",
    "Anexo em excesso no primeiro e-mail parece desorganização."
  ],
  "05-marca-pessoal": [
    "Nome diferente em cada canal gera dúvida boba e evitável.",
    "Foto pedida e foto empurrada sem necessidade são coisas distintas.",
    "Status contraditório no WhatsApp vaza na triagem informal.",
    "Bio curta ajuda indicação: a pessoa sabe o que encaminhar.",
    "Leitura de 20 segundos simula o tempo real do recrutador.",
    "Reclamação pública no meio do processo pode fechar porta na região."
  ],
  "06-produtividade-busca": [
    "Bloco com horário fixo vira hábito; busca “quando der” some na semana.",
    "Qualidade por envio bate quantidade sem leitura.",
    "Grupo barulhento fragmenta atenção e aumenta erro de mensagem.",
    "Separar “quente” de “talvez” evita culpa por não abraçar tudo.",
    "Pendente resolvido no mesmo dia reduz bola de neve mental.",
    "Revisão semanal curta corrige PDF antes de repetir o mesmo erro."
  ],
  "07-vagas-afirmativas": [
    "Critério claro no texto é sinal de processo estruturado.",
    "Laudo no primeiro clique anônimo merece pausa e verificação.",
    "Cota abre conversa; competência sustenta a contratação.",
    "Acessibilidade do posto é pergunta legítima, não pedido especial demais.",
    "Print com data protege se a descrição mudar depois.",
    "Taxa misturada com discurso inclusivo é golpe com maquiagem."
  ],
  "08-ir-2026-trabalhador": [
    "Informe perdido no spam atrasa declaração e aumenta ansiedade.",
    "Nota fiscal válida importa mais do que print de conversa.",
    "Duas fontes pagadoras mudam a conta — anote cedo.",
    "PIX de “liberação” é clássico de fraude sazonal.",
    "Código do gov.br não se compartilha com “despachante” de WhatsApp.",
    "Contador de confiança na capital custa menos do que erro grave."
  ],
  "09-decimo-terceiro": [
    "Parcela desalinhada ao tempo trabalhado pede pergunta educada à RH.",
    "Hora extra habitual pode entrar na base — confira o demonstrativo.",
    "Desconto absurdo sem explicação não deve ser engolido em silêncio.",
    "Arquivo do 13º junto com o ano facilita acerto futuro.",
    "Recibo em branco é risco desnecessário.",
    "Atraso documentado fortalece qualquer cobrança posterior."
  ],
  "10-ferias-direitos": [
    "Coletiva ou individual muda o planejamento familiar — pergunte cedo.",
    "Data de admissão é âncora do período aquisitivo.",
    "Adicional de férias aparece no demonstrativo; confira a linha.",
    "Combinado só na conversa de corredor some na hora do pagamento.",
    "Férias vencidas no emprego atual complicam saída atropelada.",
    "Registro escrito evita “eu não combinei isso” meses depois."
  ],
  "11-abono-pecuniario": [
    "Pedido por escrito protege os dois lados.",
    "Conta urgente resolvida com cansaço eterno pode sair cara.",
    "Linha do abono separada facilita auditoria pessoal do holerite.",
    "Banco de horas improvisado não é abono — são regimes diferentes.",
    "Pressão anual para vender descanso merece questionamento.",
    "Demonstrativo guardado ajuda no acerto e em dúvida futura."
  ],
  "12-ponto-atraso": [
    "Tolerância oficial evita surpresa no primeiro desconto.",
    "Trajeto de domingo vazio mente sobre a segunda de pico.",
    "Aviso com registro mostra boa-fé em imprevisto real.",
    "Ponto por outra pessoa é falta grave em quase todo regulamento.",
    "Falha de sistema sem comprovante vira discussão sem prova.",
    "Espelho de ponto é o mapa do mês — peça quando discordar."
  ],
  "13-feriado-facultativo": [
    "Contrato e escala do setor mandam mais que boato de grupo.",
    "Compensação de feriado trabalhado precisa de regra clara.",
    "Facultativo de repartição não fecha automaticamente o comércio.",
    "Abrir no facultativo é comum em serviços — leia a escala.",
    "Banco de horas só no verbal vira conflito.",
    "Comunicado oficial encerra discussão de corredor."
  ],
  "14-ctps-digital": [
    "Senha do gov.br é dado sensível — não compartilhe.",
    "Vínculo ausente após admissão pede cobrança educada e rápida.",
    "Anotações visíveis ajudam a cruzar com o holerite.",
    "Print e conversa calma resolvem mais do que briga no primeiro dia.",
    "Atualização paga da CTPS é sinal clássico de golpe.",
    "Acesso estável no dia D evita constrangimento na RH."
  ],
  "15-auxiliar-administrativo": [
    "Sistema citado com exemplo concreto passa credibilidade.",
    "História de arquivo salvo de perda vale mais que “sou detalhista”.",
    "WhatsApp profissional é skill real em escritório local.",
    "Fofoca de folha e cliente quebra confiança rápido.",
    "Teste prático curto é comum — ensaiar e-mail ajuda.",
    "Volume de demanda revela se o time está estruturado ou em caos."
  ],
  "16-entrevista-video": [
    "Teste no aparelho certo evita surpresa de permissão de microfone.",
    "Luz frontal simples melhora mais do que filtro.",
    "Fone reduz eco de ventilador e rua.",
    "Currículo ao lado evita olhar perdido procurando data.",
    "Notificação no meio da resposta quebra ritmo e autoridade.",
    "Mensagem curta na queda de sinal demonstra controle."
  ],
  "17-respostas-comportamentais": [
    "Estrutura curta impede monólogo de cinco minutos.",
    "Exemplo de fila e prazo conecta com a realidade local.",
    "Culpar ex-equipe soa mal em qualquer banca.",
    "Aprendizado mostrado vira maturidade perceptível.",
    "História escolar bem contada vale para primeiro emprego.",
    "Ensaio em voz alta revela onde você enrola."
  ],
  "18-pedir-salario": [
    "Pesquisa no portal ancora a faixa na realidade publicada.",
    "Líquido real inclui passagem — ignore isso e a conta não fecha.",
    "Faixa abre negociação melhor do que número único engessado.",
    "Pacote completo (benefícios e escala) muda o valor aceitável.",
    "Mentira de proposta concorrente circula rápido na cidade.",
    "Combinado escrito evita “eu não disse esse valor”."
  ],
  "19-beneficios-vaga": [
    "Coluna lado a lado revela proposta aparentemente maior.",
    "VT parcial muda o custo diário de quem mora longe.",
    "Carência de plano importa se você precisa usar cedo.",
    "Refeição indefinida vira gasto surpresa todo dia.",
    "“A combinar” eterno costuma significar benefício frágil.",
    "Escala caótica cobra saúde mesmo com vale bonito."
  ],
  "20-trabalho-hibrido": [
    "Frequência presencial é o coração do combinado híbrido.",
    "Equipamento próprio sem ajuda muda o custo da proposta.",
    "Mudança de escala sem aviso vira híbrido só no nome.",
    "Internet instável em casa precisa de honestidade prévia.",
    "Remoto mirabolante com PIX é bandeira vermelha.",
    "Dias presenciais têm preço de passagem — some na decisão."
  ],
  "21-golpes-emprego": [
    "Pagamento para candidatar-se encerra a conversa na hora.",
    "Canal divergente do anúncio público merece checagem.",
    "Documento na triagem inicial é pedido prematuro e arriscado.",
    "Salário alto sem requisito é isca clássica.",
    "Print guardado ajuda denúncia e protege memória dos fatos.",
    "Canal do portal reduz exposição a intermediário fantasma."
  ],
  "22-documentos-admissao": [
    "Comprovante vencido é o atraso mais comum e evitável.",
    "Dado bancário cedo demais em formulário duvidoso é risco.",
    "Nome de arquivo claro acelera a conferência da RH.",
    "Original e cópia evitam segunda viagem no mesmo dia.",
    "Certificado irrelevante só engorda o e-mail.",
    "Número que não confere com o anúncio não merece PDF sensível."
  ],
  "23-networking-local": [
    "Especificidade facilita o “sim, conheço alguém”.",
    "PDF leve respeita quem encaminha pelo celular.",
    "Texto pronto reduz atrito para quem vai ajudar.",
    "Agradecimento mantém a porta aberta para depois.",
    "Cobrança diária transforma favor em desgaste.",
    "Compartilhar vaga boa fortalece a rede sem forçar troca imediata."
  ],
  "24-retorno-ao-trabalho": [
    "Uma linha honesta basta; excesso de detalhe íntimo atrapalha.",
    "Atividade na pausa mostra que você não sumiu do mundo.",
    "Contato morto desperdiça o “sim” inicial.",
    "Mirar o nível real evita rejeição por overclaim.",
    "Tom defensivo transmite insegurança desnecessária.",
    "Referência antiga ainda valida qualidade de trabalho."
  ],
  "25-seguranca-mulheres": [
    "Razão social e endereço comercial são o mínimo verificável.",
    "Residência ou hotel sem vínculo claro não é entrevista séria.",
    "Aviso a alguém de confiança cria rede de segurança simples.",
    "Deslocamento noturno exige cálculo extra de risco.",
    "Pedido invasivo de imagem não faz parte de seleção legítima.",
    "Sair do local e registrar protege mais do que “não queria ser grossa”."
  ],
  "26-inclusao-pcd": [
    "Leitura atenta evita candidatura em modalidade errada.",
    "Acesso real do prédio importa mais que foto da fachada.",
    "Laudo por canal seguro e na etapa certa reduz exposição.",
    "Adaptação combinada com clareza evita frustração mútua.",
    "Responsável nomeado dá rastreabilidade ao processo.",
    "Barreira documentada ajuda a decidir sem gaslighting."
  ],
  "27-freela-vs-clt": [
    "Mês vazio no freela precisa entrar na média anual.",
    "Escopo escrito reduz calote e retrabalho.",
    "Benefício e escala da CLT mudam o valor do bruto.",
    "PJ forçada com batida de ponto merece alerta.",
    "Reserva financeira é equipamento de quem vive de variável.",
    "Usar tempo do emprego atual para freela sem acordo gera risco duplo."
  ],
  "28-erros-pdf-curriculo": [
    "Nome de arquivo profissional já filtra seriedade.",
    "Arquivo pesado falha em WhatsApp de dados fracos.",
    "Texto como imagem quebra ATS e leitura rápida.",
    "Preview cortado no celular elimina candidato sem resposta.",
    "DDD errado é silêncio garantido.",
    "Autoteste no telefone evita vergonha evitável."
  ],
  "29-email-pitch": [
    "Assunto com cargo e nome sobrevive à caixa lotada.",
    "Primeiro parágrafo elimina dúvida sobre a vaga certa.",
    "Duas provas bastam — terceira já começa a enrolar.",
    "Telefone no fechamento acelera o retorno.",
    "Um PDF único mostra foco.",
    "Tom direto respeita o tempo de quem lê dezenas de e-mails."
  ],
  "30-dinamica-grupo": [
    "Reformular o que ouviu mostra escuta ativa de verdade.",
    "Incluir quem falou pouco é liderança prática, não pose.",
    "Interromper demais mancha mesmo ideia boa.",
    "Centralizar tarefa inteira parece insegurança disfarçada.",
    "Gestão de tempo do grupo é skill visível.",
    "Resumo final demonstra clareza sob observação."
  ],
  "31-testes-online": [
    "Prazo e número de tentativas estão no e-mail — leia.",
    "Ambiente calmo reduz erro de clique nervoso.",
    "Resposta por outra pessoa quebra na entrevista seguinte.",
    "Exemplo do sistema é mapa do formato — use.",
    "Travamento longo em uma questão derruba o restante.",
    "Confirmação salva quando o portal falha no envio."
  ],
  "32-ler-holerite": [
    "Base e adicionais separados evitam confusão de “salário sumiu”.",
    "Salto de desconto pede pergunta com o PDF na mão.",
    "DSR e falta precisam bater com o ponto.",
    "Pasta mensal vira linha do tempo do seu contrato.",
    "Depósito diferente do líquido exige checagem no mesmo dia.",
    "Pergunta educada resolve mais rápido do que reclamação genérica."
  ],
  "33-pedido-demissao": [
    "Ordem de comunicação protege reputação.",
    "Aviso e acerto claros reduzem surpresa no bolso.",
    "Data de pagamento das verbas evita ansiedade cega.",
    "Protocolo de devolução fecha ponta solta.",
    "Ataque público com acerto aberto piora o clima e o processo.",
    "Termo guardado é documento, não papel inútil."
  ],
  "34-escala-6x1": [
    "Folga indefinida vira surpresa semanal ruim.",
    "Intervalo de refeição faz parte da carga real.",
    "Feriado trabalhado sem regra clara gera briga depois.",
    "Sete dias de deslocamento mudam o líquido emocional e financeiro.",
    "Escala por escrito é o combinado que vale.",
    "Resposta evasiva hoje é sobrecarga amanhã."
  ],
  "35-alimentacao-servicos": [
    "Gorjeta muda a renda — precisa estar explícita.",
    "Uniforme e apresentação entram na regra do posto.",
    "Pausa real importa em turno longo de salão.",
    "Pico de sábado é o teste verdadeiro do setor.",
    "Detalhe de higiene aparece na entrevista prática.",
    "Rotina de empregado sem registro merece alerta."
  ],
  "36-servicos-gerais-epi": [
    "Lista de escopo evita “só mais essa tarefa” infinita.",
    "EPI com desconto ilegal não é normalizar.",
    "Improviso de proteção falha quando o risco é químico ou corte.",
    "Produto sem rótulo é problema da empresa, não seu silêncio.",
    "Jornada também existe em serviços gerais.",
    "Obra pesada disfarçada de limpeza precisa de esclarecimento."
  ],
  "37-plano-semanal-busca": [
    "Lista de segunda evita escolha ansiosa no meio da semana.",
    "Meta diária realista sustenta mais do que pico único.",
    "Treino de entrevista na quinta encontra a mente ainda fresca.",
    "Follow-up na sexta limpa pendência antes do fim de semana.",
    "Sábado curto impede culpa sem virar maratona.",
    "Descanso de domingo melhora a qualidade do envio seguinte."
  ],
  "38-usar-portal-es": [
    "Filtro bom reduz ruído e golpe de anúncio genérico.",
    "Descrição completa evita candidatura incompatível.",
    "Canal indicado é a âncora de segurança do processo.",
    "Link e data salvos organizam o follow-up.",
    "Horários diferentes de visita capturam vaga nova.",
    "Pagamento por “prioridade” no site é fraude — denuncie e saia."
  ],
  "39-entrevista-presencial": [
    "Ponto de referência evita voltas no quarteirão errado.",
    "Dez minutos de antecedência bastam; quarenta atrapalham.",
    "Pasta simples comunica preparo sem teatro.",
    "Celular tocando no meio da resposta é falha evitável.",
    "Recepção conta impressão tanto quanto a sala da entrevista.",
    "Anotar próximos passos evita “eu achei que eles ligavam”."
  ],
  "40-setores-vagas": [
    "Encaixe forte merece energia primeiro.",
    "Deslocamento viável é filtro tão real quanto o cargo.",
    "Jargão do setor no PDF aumenta reconhecimento rápido.",
    "Meio período pode ser ponte estratégica, não demérito.",
    "Escala de alimentação muda a vida fora do trabalho.",
    "Revisão quinzenal acompanha o que o portal está mostrando."
  ],
  "41-experiencia-informal": [
    "Título honesto sobrevive à pergunta seguinte.",
    "Verbos de tarefa transformam bico em evidência.",
    "Período aproximado é melhor do que data inventada.",
    "Número simples (clientes, turnos) dá concreto à história.",
    "Inventar registro é mentira com prazo curto de validade.",
    "Referência informal valida o que o PDF descreve."
  ],
  "42-whatsapp-candidatura": [
    "Contexto na primeira linha acelera a triagem.",
    "PDF nomeado profissionalmente abre melhor que foto torta.",
    "Áudio longo na primeira mensagem cansa o recrutador.",
    "Horário comercial respeita rotina de quem contrata.",
    "Pedido de PIX no chat encerra o processo — e gera print.",
    "Tom profissional com interlocutor informal ainda é possível."
  ],
  "43-comercio-servicos": [
    "Público e caixa no histórico falam a língua do anúncio.",
    "Sábado omitido no currículo gera atrito na entrevista.",
    "Bairro alcançável evita aceite impossível de cumprir.",
    "Paciência com reclamação é soft skill do setor.",
    "Benefício comparado entre lojas próximas revela proposta melhor.",
    "Planilha semanal mostra o padrão do mercado para você."
  ],
  "44-transporte-entrevista": [
    "Horário real do trajeto é o único que importa.",
    "Margem para chuva é planejamento, não luxo.",
    "Crédito pronto na véspera evita atraso por detalhe bobo.",
    "Aviso de atraso excepcional demonstra respeito.",
    "Chegar cedo demais também atrapalha a operação local.",
    "Referência do prédio na véspera reduz stress na manhã."
  ],
  "45-panorama-candidaturas": [
    "Número sem contexto de resposta não mede progresso.",
    "Taxa zero pede revisão de material, não só mais envio.",
    "Encaixe alto merece adaptação; disparo genérico, menos energia.",
    "Um follow-up basta — bombardeio irrita.",
    "Semana com leitura completa costuma render entrevista melhor.",
    "Portal como fonte principal reduz ruído de grupo."
  ],
  ...tipFollowups46to105
};

const closings = [
  "Se este tema é o seu gargalo agora, escolha uma ação concreta ainda hoje e execute sem acumular só abas abertas.",
  "Guarde o que fizer sentido para o seu caso e descarte o resto: orientação útil vira hábito, não decoração de tela.",
  "Volte a este texto quando a busca emperrar; muitas vezes o bloqueio é um detalhe simples de processo ou de documento.",
  "Compare com a sua rotina real de deslocamento, horário e renda antes de decidir a próxima candidatura ou aceite.",
  "Trate o próximo passo como experimento curto: uma mensagem melhor, um trajeto testado, um holerite conferido."
];

function expandTip(tip, index, item) {
  const list = tipFollowups[item.key];
  const follow = list && list[index]
    ? list[index]
    : "Aplique no próximo envio e registre o resultado para ajustar a semana.";
  // No máximo uma menção ao título no bloco de dicas (só no primeiro tip)
  const titleOnce =
    index === 0
      ? ` No tema em pauta — ${item.title} — o detalhe abaixo costuma separar candidatura fraca de candidatura cuidadosa.`
      : "";
  return `<h3>${tip}</h3>\n<p>${follow}${titleOnce}</p>`;
}

/** H2 próprios do tema — nunca o trio genérico repetido em massa. */
function headingSet(item) {
  const topic = String(item.keyword || item.title)
    .replace(/\s+/g, " ")
    .trim();
  const short = topic.length > 52 ? `${topic.slice(0, 49)}…` : topic;
  const n = Number(String(item.key).match(/^(\d+)/)?.[1] || 0);
  if (item.type === "NEWS") {
    const variants = [
      {
        scene: `O que mudou sobre ${short}`,
        practice: `Como reagir com segurança`,
        close: `Checklist antes de compartilhar`
      },
      {
        scene: `Leitura do fato: ${short}`,
        practice: `Passos desta semana`,
        close: `Sinais para pausar`
      },
      {
        scene: `Contexto local de ${short}`,
        practice: `O que conferir agora`,
        close: `Próximo passo responsável`
      }
    ];
    return variants[n % variants.length];
  }
  if (item.type === "DATA_REPORT") {
    const variants = [
      {
        scene: `O que os sinais de ${short} mostram`,
        practice: `Como usar na sua busca`,
        close: `Decisão com critério`
      },
      {
        scene: `Leitura útil: ${short}`,
        practice: `Traduzir dado em prioridade`,
        close: `O que ajustar na semana`
      }
    ];
    return variants[n % variants.length];
  }
  const variants = [
    {
      scene: `Por que ${short} trava candidaturas`,
      practice: `Roteiro específico para ${short}`,
      close: `Erros que mais custam tempo`
    },
    {
      scene: `O problema real em ${short}`,
      practice: `Passo a passo aplicável`,
      close: `Como fechar o ciclo hoje`
    },
    {
      scene: `Situação típica: ${short}`,
      practice: `Checklist de execução`,
      close: `Quando pedir ajuda ou pausar`
    },
    {
      scene: `Antes de improvisar em ${short}`,
      practice: `Ordem prática que funciona`,
      close: `Resumo acionável`
    },
    {
      scene: `O que costuma dar errado em ${short}`,
      practice: `Como fazer direito, em etapas`,
      close: `Próxima ação concreta`
    }
  ];
  return variants[n % variants.length];
}

function relatedLinksHtml(item, index) {
  const sameSection = catalog.filter((entry) => entry.section === item.section && entry.key !== item.key);
  const pool = sameSection.length >= 2 ? sameSection : catalog.filter((entry) => entry.key !== item.key);
  if (pool.length < 2) return "";
  const a = pool[index % pool.length];
  const b = pool[(index + 3) % pool.length];
  if (!a || !b || a.key === b.key) return "";
  const path = (entry) => (entry.type === "NEWS" ? `/noticias/${slugForSafe(entry)}` : `/blog/${slugForSafe(entry)}`);
  return `<h2>Leia também</h2>
<ul>
<li><a href="${path(a)}">${a.title}</a></li>
<li><a href="${path(b)}">${b.title}</a></li>
<li><a href="/seguranca-candidatos">Segurança do candidato</a></li>
</ul>`;
}

function slugForSafe(item) {
  const fromKeyword = String(item.keyword || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 72);
  if (fromKeyword.length >= 8) return fromKeyword;
  return String(item.title || "guia")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function deepParagraph(item) {
  const byType = {
    NEWS:
      "Notícia boa de carreira local não é rumor de grupo: é checagem de canal, prazo e documento. Observe se a conversa cria urgência artificial, pede pagamento ou dado sensível cedo demais. Nesses casos, sair sem culpa é decisão profissional — não falta de coragem.",
    DATA_REPORT:
      "Dado útil de mercado só ajuda se virar critério de prioridade: setor, escala, benefício e deslocamento. Anote o que se repete nos anúncios que você abre e ajuste currículo e meta semanal a esse padrão, em vez de reagir a cada título chamativo.",
    GUIDE:
      "Guia de candidatura funciona quando vira checklist executável. Além do básico, observe o tom do processo: prazo “só hoje”, pressão para pagar, recusa em explicar o cargo ou pedido precoce de documento sensível. Nesses sinais, interrompa e proteja seus dados."
  };
  return byType[item.type] || byType.GUIDE;
}

function topicPadParagraphs(item, index) {
  const topic = item.keyword || item.title;
  return [
    `Volte a este guia de ${topic} quando a busca emperrar: releia só a seção de roteiro e marque um item para executar amanhã. Progresso costuma ser acumulativo — um ajuste de mensagem, um trajeto testado, um documento organizado.`,
    `Antes do próximo envio ligado a ${topic}, confira telefone com DDD, e-mail sem erro e se o canal é o mesmo do anúncio. Detalhe pequeno evita silêncio que parece rejeição, mas era só contato errado.`,
    `Se ${topic} envolve comparar propostas, anote bruto, benefícios, escala e tempo de deslocamento na mesma folha. Decisão no feeling puro costuma ignorar o custo real da semana em São Luís e no Maranhão.`
  ].map((text, i) => (i === index % 3 ? text : null)).filter(Boolean);
}

/** @param {import("./sl-local-editorial-catalog.mjs").CatalogItem} item */
export function buildArticleHtml(item) {
  const index = catalog.findIndex((entry) => entry.key === item.key);
  const heads = headingSet(item);
  const scene = scenes[item.key] || item.localAngle;
  const tipBlocks = item.tips.map((tip, i) => expandTip(tip, i, item)).join("\n");
  const closing = closings[(index < 0 ? 0 : index) % closings.length];
  const deep = deepParagraph(item);
  const bridge = `No contexto de São Luís e do Maranhão, ${item.localAngle.charAt(0).toLowerCase()}${item.localAngle.slice(1)} Vale cruzar isso com a sua disponibilidade real de horário e com o custo de deslocamento até o posto.`;

  const hubPath = item.type === "NEWS" ? "/noticias" : "/blog";
  const ctaVariants = [
    `Quando for candidatar-se, use o canal oficial do anúncio e leia mais no <a href="${hubPath}">hub editorial</a>. Em dúvida de golpe, veja <a href="/seguranca-candidatos">segurança do candidato</a>.`,
    `Compare orientações no <a href="${hubPath}">hub editorial</a> antes de enviar documentos. Pedido de pagamento antecipado? Vá para <a href="/seguranca-candidatos">segurança do candidato</a>.`,
    `Próximo passo: uma candidatura pelo canal do anúncio, com apoio dos <a href="/blog">guias do Empregos São Luís</a>. Para checagem de risco, use <a href="/seguranca-candidatos">segurança do candidato</a>.`
  ];
  const cta = ctaVariants[(index < 0 ? 0 : index) % ctaVariants.length];
  const legalBlock = item.legalDisclaimer
    ? `<p><em>Aviso:</em> este texto é orientação geral para candidatos em São Luís e no Maranhão. Não substitui advogado, contador, sindicato ou orientação oficial do empregador/governo. Regras e valores mudam — confira sempre a fonte oficial e o seu contrato.</p>`
    : "";

  const parts = [
    `<p>${item.lead}</p>`,
    `<h2>${heads.scene}</h2>`,
    `<p>${scene}</p>`,
    `<p>${item.localAngle}</p>`,
    `<p>${deep}</p>`,
    `<p>${bridge}</p>`,
    `<h2>${heads.practice}</h2>`,
    tipBlocks,
    `<h2>${heads.close}</h2>`,
    legalBlock,
    `<p>${closing} ${cta}</p>`,
    relatedLinksHtml(item, index < 0 ? 0 : index),
    `<p>A orientação ao trabalhador no Empregos São Luís continua gratuita. Avance com um envio bem feito hoje, em vez de guardar a oportunidade “para depois”.</p>`
  ].filter(Boolean);

  let html = parts.join("\n");
  if ((html.match(/Grande Ilha/gi) || []).length > 1) {
    let seen = 0;
    html = html.replace(/Grande Ilha/gi, () => {
      seen += 1;
      return seen === 1 ? "Grande Ilha" : "região";
    });
  }
  let plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  let pad = 0;
  const topicPads = topicPadParagraphs(item, index < 0 ? 0 : index);
  while (plain.length < MIN_USEFUL_CHARS && pad < topicPads.length) {
    html += `\n<p>${topicPads[pad]}</p>`;
    pad += 1;
    plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  // Se ainda curto, acrescenta mais tips contextuais sem boilerplate genérico de fechamento.
  while (plain.length < MIN_USEFUL_CHARS && pad < 5) {
    html += `\n<p>No tema “${item.title}”, revise se o que você vai enviar (PDF, mensagem ou documento) realmente responde ao anúncio — e se o canal é oficial. Isso vale para quem busca oportunidade em São Luís e no interior do Maranhão.</p>`;
    pad += 1;
    plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  if (plain.length < MIN_USEFUL_CHARS) {
    throw new Error(`HTML abaixo da meta (${plain.length} < ${MIN_USEFUL_CHARS}) para: ${item.title}`);
  }
  return html;
}
