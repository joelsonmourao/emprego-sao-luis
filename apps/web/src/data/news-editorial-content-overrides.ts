export type NewsEditorialOverride = { reviewedAt: string; contentHtml: string };

/** Revisões factuais com fontes primárias. A data original de publicação é preservada. */
const overrides: Record<string, NewsEditorialOverride> = {
  "vagas-hotelaria-temporada-sao-luis": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial de 13/10/2026.</strong> Esta reportagem de serviço explica como avaliar uma seleção em hotelaria em São Luís. Ela <strong>não anuncia vagas abertas</strong>, não estima quantidade de contratações e não afirma que uma empresa esteja recrutando. Uma oportunidade só deve ser tratada como atual depois da conferência do anúncio, da data e do canal responsável.</p>
<h2>Primeiro confirme o estabelecimento e o processo</h2>
<p>Hotelaria reúne funções diferentes: recepção, governança, cozinha, manutenção, reservas, eventos e atendimento, entre outras. Antes de adaptar o currículo, identifique o nome do estabelecimento, o cargo, o endereço ou região de trabalho, a escala, o prazo e a forma oficial de inscrição. Um card sem essas informações é ponto de partida para verificação, não prova de seleção.</p>
<p>O <a href="https://www.gov.br/turismo/pt-br/acesso-a-informacao/acoes-e-programas/testes-de-paginas/agencia-teste/cadastur" target="_blank" rel="noopener noreferrer">Cadastur, do Ministério do Turismo</a>, é o cadastro público de pessoas físicas e jurídicas que atuam no setor. O Ministério informa que meios de hospedagem estão entre as atividades de cadastro obrigatório. A consulta ajuda a verificar a identidade do estabelecimento, mas não comprova que uma vaga divulgada por terceiro seja verdadeira.</p>
<p>Compare o anúncio com o site, telefone ou perfil institucional localizado por caminho independente. Não use o mesmo link recebido na mensagem como única verificação. Se o contato disser representar uma empresa, peça o endereço oficial da oportunidade e confirme nele o prazo e os requisitos.</p>
<h2>Leia a rotina por trás do título</h2>
<p>“Atendimento” pode significar recepcionar hóspedes, operar sistema de reservas, responder dúvidas, registrar ocorrências ou apoiar eventos. “Serviços gerais” pode envolver áreas, produtos e procedimentos distintos. Pergunte quais tarefas ocupam a maior parte do turno, que treinamento existe e a quem o profissional se reporta.</p>
<ul>
  <li><strong>Recepção e reservas:</strong> confirme turnos, ferramentas usadas, atendimento presencial ou por canais digitais e necessidade real de idioma.</li>
  <li><strong>Governança e limpeza:</strong> pergunte sobre setores atendidos, equipamentos, produtos, treinamento e fornecimento de proteção adequada.</li>
  <li><strong>Cozinha e alimentos:</strong> verifique função, horário, divisão da equipe e exigências documentais informadas pelo empregador.</li>
  <li><strong>Eventos e trabalho sazonal:</strong> confirme duração, empregador formal, local, jornada e como serão registrados pagamentos e horas.</li>
</ul>
<p>Não acrescente sistema, idioma, curso ou experiência que você não possui. Se sua experiência veio de restaurante, evento ou atendimento informal, descreva as tarefas verdadeiras e o contexto. O objetivo é mostrar competência transferível sem transformar uma atividade pontual em vínculo inexistente.</p>
<h2>Faça a conta do turno completo</h2>
<p>Em hotelaria podem existir escalas noturnas, trabalho em fins de semana ou variação ligada a eventos. Isso não autoriza presumir a jornada de uma vaga específica. Peça a escala por escrito e simule a ida e a volta nos horários informados. Considere o ponto de embarque, o tempo de espera, a última opção de transporte e um plano seguro para imprevistos.</p>
<p>Use a <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a> com tarifas e quantidade de viagens informadas por você. O portal não presume passagem, salário ou benefício. Compare propostas usando o valor e as condições realmente comunicados pela empresa.</p>
<p><strong>Exemplo hipotético:</strong> duas oportunidades têm remuneração parecida. Uma termina às 17h em região alcançável com um trajeto; a outra termina depois das 23h e exige uma alternativa que o candidato ainda não confirmou. A escolha responsável começa pela verificação da escala e do retorno, não por uma suposição sobre o setor.</p>
<h2>Prepare evidências para a entrevista</h2>
<p>Separe dois exemplos curtos de situações reais. Para recepção, pode ser a organização de fila e o registro correto de uma solicitação. Para governança, pode ser a conferência de uma lista e a comunicação de um item ausente. Para eventos, pode ser a adaptação a uma mudança de horário. Explique contexto, ação e resultado sem inventar números.</p>
<p>Leia também o anúncio para formular perguntas: qual é a rotina do turno, como funciona o treinamento, quais materiais são fornecidos e qual será a próxima etapa. Perguntar com clareza ajuda a identificar incompatibilidades antes de entregar documentos.</p>
<h2>Proteja seus dados e registre a candidatura</h2>
<p>O serviço federal <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> explica a consulta e o encaminhamento pelo sistema público. Ele é um canal possível, não uma confirmação das oportunidades citadas em redes sociais. Para cada candidatura, guarde empresa, cargo, URL, data, canal e próxima ação no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>.</p>
<p>Não pague taxa para reservar entrevista, uniforme, curso ou contratação. Não envie senha, código de verificação, dados bancários ou foto completa de documentos a contato não confirmado. Se a empresa solicitar documentação numa etapa legítima, confirme finalidade e destinatário antes do envio.</p>
<p><strong>Conclusão:</strong> uma candidatura em hotelaria fica mais forte quando cargo, turno, estabelecimento e canal estão confirmados. Consulte as páginas oficiais na data da busca, porque cadastros, processos seletivos e serviços podem mudar depois desta revisão.</p>
    `.trim()
  },
  "contrato-temporario-temporada-direitos": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial de 13/10/2026.</strong> Este conteúdo organiza perguntas para a leitura de um contrato temporário. Não identifica o vínculo de uma vaga específica e não substitui orientação jurídica individual. A palavra “temporário” num anúncio não basta para saber quem será o empregador nem qual regra será usada.</p>
<h2>Descubra qual relação está sendo proposta</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l6019.htm" target="_blank" rel="noopener noreferrer">Lei nº 6.019/1974</a> regula o trabalho temporário prestado por pessoa física contratada por uma empresa de trabalho temporário que a coloca à disposição de uma tomadora. A finalidade legal está ligada à substituição transitória de pessoal permanente ou à demanda complementar de serviços.</p>
<p>Essa estrutura não deve ser confundida automaticamente com todo contrato por prazo determinado ou com um serviço autônomo. Por isso, a primeira pergunta é: quem assinará o contrato e aparecerá como empregador? O local onde a atividade acontece pode ser diferente da empresa responsável pela contratação.</p>
<p>As <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/perguntas-frequentes" target="_blank" rel="noopener noreferrer">Perguntas Frequentes do Ministério do Trabalho e Emprego</a> explicam que, no trabalho temporário da Lei nº 6.019, o contrato pode durar até 180 dias, consecutivos ou não, e ser prorrogado por até 90 dias quando permanecem as condições que justificaram a contratação. Não aplique esses prazos a outra modalidade sem confirmar o documento real.</p>
<h2>Oito itens para conferir antes de assinar</h2>
<ol>
  <li><strong>Empregador:</strong> razão social e CNPJ de quem contrata.</li>
  <li><strong>Tomadora:</strong> identificação da empresa onde o serviço será prestado, quando houver.</li>
  <li><strong>Motivo:</strong> substituição transitória ou demanda complementar descrita de forma compreensível.</li>
  <li><strong>Função e local:</strong> tarefas, unidade e possibilidade de mudança informada no documento.</li>
  <li><strong>Datas:</strong> início, prazo previsto, condições de prorrogação e forma de encerramento.</li>
  <li><strong>Remuneração:</strong> valor, periodicidade, benefícios informados e responsável pelo pagamento.</li>
  <li><strong>Jornada:</strong> horários, intervalos, descansos e forma de registrar as horas.</li>
  <li><strong>Cópias e registros:</strong> como receber o contrato e acompanhar informações na Carteira de Trabalho Digital.</li>
</ol>
<p>Leia sem pressa e peça correção quando nome, data, função ou valor estiver diferente do combinado. Promessa feita apenas por mensagem não substitui cláusula clara. Guarde anúncio, proposta, contrato e comprovantes em local seguro.</p>
<h2>Um exemplo para não confundir as empresas</h2>
<p><strong>Situação hipotética:</strong> uma loja divulga reforço de fim de ano, mas a entrevista e o contrato são conduzidos por uma empresa de trabalho temporário. O candidato deve confirmar qual delas será a empregadora, onde trabalhará, quem pagará e como obterá comprovantes. Não é correto concluir, apenas pelo uniforme ou pelo endereço, que a tomadora assinou o contrato.</p>
<p>Se o anúncio não identifica o intermediário, busque o canal oficial da empresa mencionada e pergunte se a seleção existe. Não pague para participar e não entregue dados bancários, senha ou código de autenticação.</p>
<h2>O que acompanhar durante o vínculo</h2>
<p>Registre jornada, escala, recibos e comunicações sobre prorrogação ou encerramento. Confira os dados disponíveis na <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> e solicite esclarecimento ao empregador quando houver divergência. A ausência imediata de uma atualização no aplicativo não deve ser resolvida com edição por conta própria nem envio de senha a terceiros.</p>
<p>Quando a função, o local ou o prazo mudar, peça a formalização correspondente. Se houver acidente, pagamento divergente ou dúvida sobre direitos, preserve documentos e procure um canal de orientação trabalhista qualificado. Este portal não conhece as condições individuais do vínculo.</p>
<h2>Checklist final do candidato</h2>
<ul>
  <li>Consigo identificar empregador e local de trabalho separadamente?</li>
  <li>Função, remuneração, jornada e datas estão escritas?</li>
  <li>Recebi ou sei como obter minha cópia?</li>
  <li>O anúncio e o contrato descrevem a mesma oportunidade?</li>
  <li>Não houve cobrança para entrevista ou contratação?</li>
  <li>Sei qual canal usar para dúvidas e comprovantes?</li>
</ul>
<p>Consulte a lei e o Ministério do Trabalho na versão atual antes de tomar decisão, pois normas e serviços podem mudar. O objetivo deste roteiro é ajudar a formular perguntas e organizar evidências, não concluir se um contrato concreto é válido ou inválido.</p>
    `.trim()
  },
  "feriado-ponto-facultativo-sao-luis": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial de 13/10/2026.</strong> Feriado e ponto facultativo não são expressões equivalentes. Esta página ensina a verificar a norma e a escala aplicáveis em São Luís; ela não substitui a comunicação da empresa, a convenção coletiva ou orientação jurídica sobre um caso individual.</p>
<h2>Comece pela abrangência da publicação oficial</h2>
<p>O <a href="https://diariooficial.saoluis.ma.gov.br/documento/view/48792" target="_blank" rel="noopener noreferrer">calendário municipal de 2026 publicado no Diário Oficial de São Luís</a> estabelece feriados e pontos facultativos no âmbito da administração municipal e declara expressamente sua aplicação às repartições subordinadas ao Executivo, autarquias, fundações e empresas públicas, preservando serviços essenciais. Isso não significa que todo ponto facultativo da prefeitura feche automaticamente uma empresa privada.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l9093.htm" target="_blank" rel="noopener noreferrer">Lei nº 9.093/1995</a> trata da definição de feriados civis e religiosos. Para uma data concreta, confirme se a norma é nacional, estadual ou municipal e se alcança a atividade e a localidade do contrato. Não use apenas calendário escolar, card de rede social ou mensagem encaminhada.</p>
<h2>Como ler o calendário sem tirar conclusão errada</h2>
<p>Observe o título, o órgão emissor, o ano, a data e o público alcançado. Um decreto pode organizar o expediente dos órgãos municipais sem criar folga para todos os trabalhadores da cidade. Do mesmo modo, um feriado legal pode ter regras específicas de funcionamento, compensação ou autorização relacionadas à atividade e ao instrumento coletivo.</p>
<p>Use o <a href="https://diariooficial.saoluis.ma.gov.br/" target="_blank" rel="noopener noreferrer">portal do Diário Oficial de São Luís</a> para localizar o documento e eventuais alterações posteriores. Guarde o número e a data da publicação consultada. Para normas estaduais, consulte a fonte oficial do Maranhão; para normas federais, confira a legislação nacional.</p>
<h2>Quatro cenários que exigem perguntas diferentes</h2>
<ol>
  <li><strong>Ponto facultativo municipal:</strong> confirme se o comunicado se limita ao serviço público e pergunte à empresa privada se haverá expediente normal.</li>
  <li><strong>Feriado aplicável:</strong> peça a escala e a regra de folga ou compensação utilizada para sua categoria.</li>
  <li><strong>Serviço essencial ou operação contínua:</strong> confirme horário, registro de jornada e descanso, mesmo quando repartições estiverem fechadas.</li>
  <li><strong>Mudança de última hora:</strong> solicite comunicação identificável e guarde a versão recebida; não dependa de áudio ou boato de grupo.</li>
</ol>
<p><strong>Exemplo hipotético:</strong> a prefeitura anuncia ponto facultativo para uma sexta-feira. Uma loja informa expediente normal, enquanto um órgão municipal fecha o atendimento. As duas situações podem coexistir porque o ato administrativo e o contrato privado não têm necessariamente a mesma abrangência.</p>
<h2>O que perguntar ao receber a escala</h2>
<ul>
  <li>A data é feriado legal, ponto facultativo ou dia normal para esta atividade?</li>
  <li>Qual horário devo cumprir e onde ele foi comunicado?</li>
  <li>Haverá folga, compensação ou outra regra prevista para a categoria?</li>
  <li>Existe convenção ou acordo coletivo aplicável?</li>
  <li>Como serão registrados ponto, troca de turno e eventual alteração?</li>
</ul>
<p>Faça perguntas antes de faltar ou trocar horário por conta própria. Preserve escala, registro de ponto, contracheque e comunicação da empresa. Se a resposta for contraditória, peça esclarecimento por escrito ao RH ou responsável.</p>
<h2>Planejamento de transporte em dias diferentes</h2>
<p>Feriados e pontos facultativos podem afetar horários de transporte e funcionamento de serviços, mas a mudança precisa ser conferida no canal responsável. Não presuma que a grade de um dia comum será mantida. Planeje ida e volta conforme o turno realmente comunicado e use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> apenas com valores atuais informados por você.</p>
<h2>Evite mensagens enganosas</h2>
<p>Antes de compartilhar um card, verifique o ano, a cidade, o órgão e o texto integral. Calendários de outros municípios ou de anos anteriores circulam fora de contexto. Se a postagem não traz número do ato ou link oficial, procure a publicação antes de orientar colegas.</p>
<p><strong>Limite editorial:</strong> esta revisão não calcula pagamento, não interpreta convenção específica e não confirma escala de empresa. Em caso de divergência sobre jornada ou remuneração, reúna documentos e procure orientação trabalhista qualificada.</p>
    `.trim()
  },
  "decimo-terceiro-salario-pagamento-clt": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial de 13/10/2026.</strong> Este explicativo ajuda o trabalhador a conferir documentos do décimo terceiro salário. Ele não calcula valor individual e não afirma que determinada empresa já pagou ou deixou de pagar. Datas de admissão, remuneração e componentes do vínculo precisam ser analisados nos comprovantes reais.</p>
<h2>Quais são as referências básicas</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l4090.htm" target="_blank" rel="noopener noreferrer">Lei nº 4.090/1962</a> institui a gratificação de Natal e relaciona o cálculo à remuneração devida em dezembro, na proporção de 1/12 por mês de serviço do ano. A própria lei define a regra de contagem da fração mensal. Leia o texto vigente antes de aplicar ao seu caso.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l4749.htm" target="_blank" rel="noopener noreferrer">Lei nº 4.749/1965</a> determina o pagamento até 20 de dezembro, compensado o adiantamento, e prevê o adiantamento entre fevereiro e novembro. A página do <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/trabalho-sustentavel/trabalhadores-e-trabalhadoras" target="_blank" rel="noopener noreferrer">Ministério do Trabalho e Emprego para trabalhadores</a> resume as duas parcelas: a primeira até 30 de novembro e a segunda até 20 de dezembro.</p>
<p>Essas referências gerais não resolvem sozinhas situações com afastamento, remuneração variável, término de contrato ou instrumento coletivo. O passo correto é conferir as rubricas e pedir a memória de cálculo quando houver dúvida.</p>
<h2>Monte uma pasta de conferência</h2>
<ul>
  <li>contracheques do ano e demonstrativos das parcelas;</li>
  <li>data de admissão e, se aplicável, documento de desligamento;</li>
  <li>comprovantes de depósito relacionados ao pagamento;</li>
  <li>registros de remuneração variável identificados nos holerites;</li>
  <li>comunicações do RH sobre adiantamento, férias ou ajustes;</li>
  <li>convenção ou acordo coletivo, quando pertinente.</li>
</ul>
<p>Use cópias próprias e não encaminhe contracheque completo em grupo público. Ele pode conter CPF, dados bancários e outras informações pessoais.</p>
<h2>Leia o bruto antes de comparar o líquido</h2>
<p>Comparar apenas o valor líquido de duas pessoas pode produzir conclusão errada. Datas de admissão, remuneração, adiantamento e retenções podem ser diferentes. Localize no demonstrativo o valor bruto, a identificação da parcela e os descontos apresentados. Depois compare cada rubrica com os documentos do próprio vínculo.</p>
<p><strong>Exemplo hipotético:</strong> duas pessoas recebem salário-base semelhante, mas uma começou no início do ano e outra foi admitida depois. Os totais podem ser diferentes. O exemplo não permite calcular nenhum dos casos sem datas e valores reais.</p>
<h2>Um roteiro de verificação em seis etapas</h2>
<ol>
  <li>Confirme a data de admissão e os meses considerados.</li>
  <li>Localize primeira e segunda parcelas nos demonstrativos.</li>
  <li>Confira se o adiantamento já ocorreu, inclusive nas férias quando solicitado conforme a regra aplicável.</li>
  <li>Separe valor bruto, descontos e depósito recebido.</li>
  <li>Peça ao RH a memória de cálculo quando uma rubrica não estiver clara.</li>
  <li>Guarde a resposta e qualquer demonstrativo corrigido.</li>
</ol>
<p>Evite planilhas genéricas que prometem resultado exato sem conhecer o vínculo. Elas podem ajudar a organizar perguntas, mas não substituem documentos nem regras específicas.</p>
<h2>Como conversar com o RH</h2>
<p>Faça uma solicitação objetiva: identifique a parcela, a data e a rubrica sobre a qual tem dúvida. Em vez de afirmar que o total está errado, peça os meses considerados, a remuneração de referência e os descontos demonstrados. Essa abordagem facilita uma resposta verificável.</p>
<p>Se a explicação não resolver a divergência, preserve contratos, holerites, depósitos e comunicações e busque orientação trabalhista qualificada. Não publique dados pessoais da empresa ou de colegas para tentar obter cálculo em rede social.</p>
<h2>Sinais de golpe relacionados ao pagamento</h2>
<p>Não forneça senha, código bancário ou acesso à conta gov.br para receber parcela. Desconfie de mensagem que exige taxa para “liberar” valor ou envia link fora do canal habitual da empresa. Confirme a comunicação com o RH por um contato conhecido de forma independente.</p>
<p><strong>Conclusão:</strong> a conferência responsável usa lei vigente, holerites, datas e memória de cálculo. Este portal oferece um roteiro educacional; somente os documentos do vínculo e a orientação adequada podem esclarecer o caso individual.</p>
    `.trim()
  },
  "imposto-de-renda-2026-trabalhador-clt": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Atualização editorial de 13/10/2026.</strong> O prazo regular da declaração do IRPF 2026 <strong>já terminou</strong>. Segundo a <a href="https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/perguntas-frequentes/imposto-de-renda/dirpf/declaracao/prazo" target="_blank" rel="noopener noreferrer">Receita Federal</a>, a entrega ocorreu de 23 de março a 29 de maio de 2026. O exercício de 2026 considera informações do ano-calendário de 2025. Este texto não substitui atendimento contábil ou orientação individual.</p>
<h2>Ter carteira assinada não decide sozinho a obrigação</h2>
<p>Ser empregado CLT não significa automaticamente estar obrigado — nem dispensado — de declarar. A Receita mantém a página oficial <a href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/quem/quem" target="_blank" rel="noopener noreferrer">Quem deve declarar</a>, com os critérios do exercício de 2026. Verifique a versão atual porque limites e condições podem mudar de um ano para outro.</p>
<p>Também não confunda imposto retido mensalmente no salário com obrigação de apresentar a declaração anual. A análise deve considerar todas as condições aplicáveis ao contribuinte, não apenas o contracheque de um empregador.</p>
<h2>Documentos para reunir antes de corrigir ou entregar em atraso</h2>
<ul>
  <li>informes de rendimentos de todos os empregadores de 2025;</li>
  <li>informes de bancos e outras fontes pagadoras;</li>
  <li>documentos de bens, direitos, dívidas e operações que precisem ser informadas;</li>
  <li>comprovantes de despesas e deduções que atendam às regras;</li>
  <li>dados e documentos dos dependentes, quando aplicável;</li>
  <li>declaração anterior e recibo de entrega, se existirem;</li>
  <li>cópia da declaração de 2026 e notificações recebidas, se já houve transmissão.</li>
</ul>
<p>Se a pessoa trabalhou para dois empregadores em 2025, precisa conferir os dois informes. Não copie apenas os dados da empresa atual. Divergência de nome, CPF, CNPJ ou valores deve ser esclarecida com a fonte pagadora antes de uma correção improvisada.</p>
<h2>Prazo encerrado: qual é o próximo passo</h2>
<p>A página oficial de <a href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/prazo" target="_blank" rel="noopener noreferrer">prazo de entrega</a> informa que a declaração enviada depois do prazo legal fica sujeita à multa por atraso. Antes de agir, confirme se você estava obrigado, se já houve entrega e se o caso é de declaração atrasada ou retificação.</p>
<p>Não transmita uma segunda declaração como se fosse nova quando o correto for retificar a anterior. Use os sistemas e instruções atuais da Receita e guarde recibos. Em situações com patrimônio, atividade no exterior, ganho de capital, espólio ou dúvidas sobre dependentes, procure atendimento profissional habilitado.</p>
<h2>Escolha apenas canais oficiais</h2>
<p>A central <a href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda" target="_blank" rel="noopener noreferrer">Meu Imposto de Renda</a> reúne acesso, perguntas e orientações oficiais. Digite o endereço gov.br diretamente ou use o aplicativo oficial obtido na loja do sistema. Não entre por link recebido em mensagem que promete restituição imediata.</p>
<p>A Receita não precisa da sua senha enviada por WhatsApp para liberar restituição. Não compartilhe código de autenticação, acesso à conta gov.br, cartão ou dados bancários com suposto “ajudante”. Um contador pode solicitar documentos necessários ao serviço contratado, mas você deve confirmar identidade, finalidade e canal seguro.</p>
<h2>Exemplo de conferência sem adivinhar valores</h2>
<p><strong>Situação hipotética:</strong> uma pessoa mudou de emprego durante 2025 e recebeu dois informes. Ela deve comparar cada informe com os respectivos contracheques e incluir as fontes conforme as instruções oficiais. O exemplo não informa limites, imposto ou restituição porque esses resultados dependem do conjunto real de dados.</p>
<p>Outro caso comum é perceber, após a entrega, que um informe foi esquecido. A decisão entre corrigir a declaração e buscar esclarecimento deve seguir as orientações atuais da Receita. Não altere números apenas para aumentar restituição ou eliminar imposto.</p>
<h2>Checklist de segurança e consistência</h2>
<ol>
  <li>Confirmei minha obrigação usando os critérios oficiais de 2026?</li>
  <li>Reuni informes de todas as fontes pagadoras de 2025?</li>
  <li>Comparei nomes, documentos e valores antes de transmitir?</li>
  <li>Usei somente sistema e endereço oficiais?</li>
  <li>Guardei recibo e cópia do arquivo transmitido?</li>
  <li>Procurei orientação individual quando o caso ultrapassou um preenchimento simples?</li>
</ol>
<p>As páginas oficiais podem receber atualizações após esta revisão. Para atraso, retificação, multa ou exercícios diferentes, consulte a Receita Federal na data da ação. O portal Empregos São Luís não recebe declaração, não calcula restituição e não pede documentos fiscais.</p>
    `.trim()
  }
};

export function getNewsEditorialOverride(slug: string): NewsEditorialOverride | null {
  return overrides[slug] ?? null;
}
