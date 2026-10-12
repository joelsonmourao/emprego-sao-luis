/**
 * Textos de revisão editorial com curadoria factual. Somente quatro publicações
 * curtas identificadas na auditoria de 12/10/2026. Não gerar em massa.
 * Preserva slug, autor registrado e capa existente no banco; não altera dados.
 */
export interface ReviewedEditorialOverride {
  description: string;
  revisedAt: string;
  html: string;
  sources: Array<{ label: string; url: string; reason: string }>;
}

export const REVIEWED_EDITORIAL_OVERRIDES: Record<string, ReviewedEditorialOverride> = {
  "organizar-busca-emprego": {
    revisedAt: "2026-10-12",
    description: "Plano prático de busca de emprego em São Luís: como escolher vagas, registrar candidaturas, organizar a semana, acompanhar respostas e consultar o SINE.",
    sources: [
      {
        label: "Serviço público de busca de emprego — gov.br/SINE",
        url: "https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine",
        reason: "Consulta e cadastro de vagas no serviço público"
      },
      {
        label: "Orientações do Ministério do Trabalho sobre Carteira Digital",
        url: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho",
        reason: "Importância das informações do perfil e região de interesse"
      }
    ],
    html: `
<p>Procurar emprego não precisa significar abrir dezenas de abas todos os dias. Uma rotina útil começa com duas perguntas: <strong>qual trabalho você consegue realizar hoje?</strong> e <strong>qual deslocamento e horário você consegue cumprir?</strong> Com essas respostas, cada candidatura deixa de ser um clique aleatório e passa a ter um motivo.</p>
<h2>Escolha até três cargos para concentrar a pesquisa</h2>
<p>Escreva dois ou três títulos compatíveis com sua formação e experiências reais. Por exemplo, alguém que trabalhou com atendimento ao público pode procurar por recepção, auxiliar de atendimento e apoio administrativo, desde que cumpra os requisitos indicados no anúncio. Isso é diferente de se candidatar a qualquer função porque apareceu no feed.</p>
<p>Para cada cargo, registre o que você já sabe fazer, uma competência a desenvolver e o tipo de jornada em que pode trabalhar. Se você mora em São Luís, não considere apenas o nome da cidade: o bairro de trabalho e o horário da saída podem mudar completamente o tempo do trajeto. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> para estimar custos com dados que você mesmo conferiu.</p>
<h2>Monte uma lista de canais que você consegue conferir</h2>
<p>Separe páginas oficiais de carreiras, anúncios diretos das empresas e serviços públicos de emprego. O <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Sistema Nacional de Emprego (SINE)</a> é um caminho público para cadastrar informações e consultar oportunidades compatíveis com o perfil. O governo federal recomenda atualizar dados e áreas de interesse, porque eles influenciam a busca por vagas. Isso não garante entrevista nem significa que uma função estará disponível.</p>
<p>Quando encontrar uma vaga em uma rede social, abra o canal original de candidatura. Verifique se a oferta ainda está ativa, se o título do cargo corresponde à descrição e se a empresa não exige pagamento para participar. Se a fonte for um print antigo sem link, trate como informação pendente de confirmação, não como vaga aberta.</p>
<h2>Uma rotina de cinco dias que cabe na vida real</h2>
<ol>
<li><strong>Primeiro dia:</strong> revise currículo, telefone, e-mail e dois cargos de interesse. Salve uma versão legível do currículo em PDF, com um nome de arquivo simples.</li>
<li><strong>Segundo dia:</strong> pesquise anúncios ativos nos canais escolhidos. Antes de se inscrever, compare requisitos, localização, jornada e forma de candidatura.</li>
<li><strong>Terceiro dia:</strong> candidate-se às oportunidades realmente compatíveis. Guarde o comprovante ou anotação da inscrição, sem inserir senhas ou documentos sensíveis em planilhas públicas.</li>
<li><strong>Quarto dia:</strong> consulte novamente os canais oficiais e ajuste o foco se houver poucas opções. Evite reenviar várias vezes o mesmo currículo para a mesma vaga.</li>
<li><strong>Quinto dia:</strong> revise o que foi enviado, quais canais funcionaram e quais etapas ainda aguardam resposta. Planeje pequenas melhorias para a semana seguinte.</li>
</ol>
<p>Se tiver apenas trinta minutos por dia, divida esse tempo entre localizar oportunidades, ler requisitos e registrar candidaturas. Quantidade de inscrições não é indicador de contratação: valorize a adequação real.</p>
<h2>Registre as informações que evitam confusão</h2>
<p>O controle pode ter apenas data, cargo, empresa ou fonte, link original, situação atual e próximo prazo informado. Um exemplo fictício de linha é: <em>12/10 — Assistente de escritório — Empresa Alfa (exemplo) — currículo enviado pelo site — aguardar o prazo informado no anúncio</em>. Não trate esse exemplo como uma oportunidade real.</p>
<p>Você pode utilizar o <a href="/ferramentas/controle-candidaturas">controle gratuito do Empregos São Luís</a>, que exporta um CSV sem enviar os registros ao nosso servidor. Ao final, mantenha esse arquivo em local privado.</p>
<h2>Quando algo não avança, o que revisar?</h2>
<p>Se surgirem poucos anúncios compatíveis, confira se os cargos escolhidos fazem sentido para suas experiências ou se está restringindo demais o local de trabalho. Se existem candidaturas mas não há respostas, verifique se o contato está correto, se o currículo atende aos requisitos e se os anúncios continuam válidos. A ausência de retorno por si só não prova que você foi reprovado.</p>
<p>Para uma entrevista, prepare dois exemplos verdadeiros de algo que fez: uma situação, sua ação e o resultado que observou. Para primeiro emprego, isso pode incluir um projeto escolar ou atividade voluntária, devidamente identificada como tal. O objetivo é falar com precisão e não decorar respostas exageradas.</p>
<h2>Checklist antes de encerrar a semana</h2>
<ul>
<li>Tenho cargos-alvo e disponibilidade definidos?</li>
<li>Sei de onde veio cada vaga e se o canal ainda aceita candidaturas?</li>
<li>Registrei datas e etapas, sem compartilhar dados sensíveis?</li>
<li>Há uma melhoria concreta que consigo fazer no currículo ou no perfil?</li>
<li>Estou evitando cobranças para seleção e links suspeitos?</li>
</ul>
<p>A meta da semana é produzir candidaturas conscientes e um registro que ajude a melhorar a próxima semana. Nenhum roteiro garante contratação, mas um histórico organizado evita retrabalho e facilita tomar decisões.</p>`
  },
  "linkedin-primeiro-emprego": {
    revisedAt: "2026-10-12",
    description: "LinkedIn para quem busca o primeiro emprego: como construir título, resumo, formação e projetos sem inventar experiência, com referências da ajuda oficial.",
    sources: [
      {
        label: "LinkedIn: editar o seu perfil",
        url: "https://www.linkedin.com/help/linkedin/answer/a546603/edit-your-profile?lang=pt",
        reason: "Seções do perfil e caminho oficial de edição"
      },
      {
        label: "LinkedIn: gerenciar a seção Experiência",
        url: "https://www.linkedin.com/help/linkedin/answer/a593695/adicionar-editar-ou-remover-um-cargo-na-secao-experiencia-do-seu-perfil?lang=pt",
        reason: "Como representar corretamente vínculos e atividades"
      }
    ],
    html: `
<p>Um perfil de primeiro emprego não precisa fingir uma carreira que ainda não começou. Ele precisa mostrar <strong>que tipo de oportunidade você procura</strong>, o que sabe fazer e que experiências — formais ou não — ajudam a explicar sua preparação. A página de ajuda oficial do LinkedIn permite editar título, resumo, formação acadêmica, competências e outras seções do perfil.</p>
<h2>Comece com um título que diga sua direção profissional</h2>
<p>Evite usar apenas “em busca de oportunidades”. Um título orientado ao objetivo é mais claro. Exemplo fictício: <em>Estudante de Administração | Interesse em atendimento e rotinas administrativas | São Luís (MA)</em>. Escreva isso somente se a formação e o interesse forem verdadeiros. Não use “analista sênior” ou “gerente” apenas para parecer experiente.</p>
<p>O título pode mudar conforme o que você procura. Se seu foco é logística, diga a área e as competências realmente desenvolvidas, como organização de estoque em curso prático ou experiência comprovada. A intenção é comunicar o foco, não acumular palavras-chave.</p>
<h2>Escreva um resumo curto com uma demonstração concreta</h2>
<p>Em vez de listar adjetivos como “dedicado, comunicativo e proativo”, descreva uma situação real. Um modelo adaptável seria: <em>Estou cursando [curso real] e busco iniciar na área de [área de interesse]. Em [projeto ou atividade verdadeira], pratiquei [duas tarefas]. Tenho disponibilidade para [jornada possível] e estou desenvolvendo [competência em andamento].</em></p>
<p>Use apenas fatos. Se a experiência veio de um projeto escolar, diga isso; se foi trabalho voluntário, identifique o contexto. Não chame uma simulação de estágio nem uma atividade informal de emprego registrado.</p>
<h2>Organize formação, cursos e projetos sem confundir as categorias</h2>
<ol>
<li><strong>Formação:</strong> informe o nome correto do curso e se está em andamento ou foi concluído.</li>
<li><strong>Cursos complementares:</strong> priorize os relacionados aos cargos pretendidos. Um curso básico de planilha pode ser relevante para apoio administrativo, por exemplo.</li>
<li><strong>Projetos:</strong> descreva o desafio, o que fez e o resultado observável. Não invente métricas para tornar a atividade mais impressionante.</li>
<li><strong>Competências:</strong> inclua conhecimentos que conseguiria demonstrar ou explicar em uma entrevista.</li>
</ol>
<p>O próprio <a href="https://www.linkedin.com/help/linkedin/answer/a593695/adicionar-editar-ou-remover-um-cargo-na-secao-experiencia-do-seu-perfil?lang=pt" target="_blank" rel="noopener noreferrer">LinkedIn orienta que a seção Experiência represente vínculos verdadeiros</a> e distingue experiências profissionais de associações informais. Um cargo fictício pode prejudicar sua credibilidade quando perguntarem sobre ele.</p>
<h2>Prepare o perfil para ser lido no celular</h2>
<p>Revise nome, acentuação, telefone ou e-mail de contato que escolheu divulgar e a localidade. Leia o resumo no celular: frases longas e parágrafos únicos dificultam a leitura. Considere uma foto profissional apenas se desejar usá-la e se a imagem for sua; ela não substitui as informações do perfil. Evite publicar endereço residencial completo, documentos pessoais ou dados bancários.</p>
<h2>Como abordar pessoas sem enviar mensagens iguais em massa</h2>
<p>Se encontrar uma vaga real, identifique o responsável pela divulgação e prefira o canal de candidatura oficial informado. Caso seja adequado enviar uma mensagem, mencione o cargo e uma competência compatível. Não cobre resposta imediata nem use mensagens repetidas para pessoas que não anunciaram vagas. Uma conversa respeitosa é melhor do que uma sequência de lembretes no mesmo dia.</p>
<p>Para quem vive em São Luís e procura vaga presencial, pesquise também o endereço e a jornada. O perfil pode estar bem escrito e, ainda assim, a oportunidade não ser viável pelo deslocamento. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> ajuda a organizar essa decisão com valores informados por você.</p>
<h2>Checklist de revisão do seu LinkedIn</h2>
<ul>
<li>O título indica a área de interesse sem exagerar?</li>
<li>O resumo informa algo concreto que realmente fiz?</li>
<li>Formação concluída e formação em andamento estão separadas?</li>
<li>Projetos, voluntariado e emprego formal estão identificados corretamente?</li>
<li>O contato escolhido está correto e não expõe documentos sensíveis?</li>
<li>O perfil corresponde às informações que constam no currículo?</li>
</ul>
<p>Depois de revisar, siga as instruções de <a href="https://www.linkedin.com/help/linkedin/answer/a546603/edit-your-profile?lang=pt" target="_blank" rel="noopener noreferrer">edição do próprio LinkedIn</a> e confirme como o perfil fica visível. A plataforma pode mudar botões e seções; consulte a ajuda oficial para a interface atual. Ter um perfil completo não garante entrevista, mas reduz dúvidas quando alguém consulta sua trajetória.</p>`
  },
  "acompanhar-candidatura-emprego": {
    revisedAt: "2026-10-12",
    description: "Acompanhamento de candidatura: como registrar datas, interpretar etapas, pedir retorno com educação, evitar golpes e organizar o próximo passo.",
    sources: [
      {
        label: "Serviço oficial de emprego SINE — gov.br",
        url: "https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine",
        reason: "Referência de consulta e candidatura pelos canais oficiais"
      }
    ],
    html: `
<p>Depois de enviar um currículo, é fácil perder o controle: vagas com nomes semelhantes, inscrições feitas em aplicativos diferentes e mensagens que não especificam o cargo. A solução é manter um registro pequeno, com informações que realmente ajudem a decidir quando consultar a empresa e quando seguir procurando outras oportunidades.</p>
<h2>O que registrar no dia em que você se candidata</h2>
<p>Guarde a data da inscrição, o cargo, o nome da empresa ou origem do anúncio, o endereço oficial da vaga, o canal utilizado e a situação inicial. Se a plataforma enviar um protocolo ou e-mail de confirmação, mantenha esse comprovante no seu próprio arquivo. Não copie para uma planilha compartilhada senhas, CPF completo ou documentos de identidade.</p>
<p>Para não depender de memória, abra o <a href="/ferramentas/controle-candidaturas">controle gratuito de candidaturas</a> do Empregos São Luís. Ele não exige cadastro e permite exportar os registros em CSV. Os dados ficam somente na página enquanto estiver aberta; baixe o arquivo antes de fechar e guarde-o em local privado.</p>
<h2>Quatro situações que não significam a mesma coisa</h2>
<ul>
<li><strong>Currículo enviado:</strong> você concluiu a inscrição, mas isso não confirma que alguém leu seu perfil.</li>
<li><strong>Em análise:</strong> é uma indicação fornecida pelo sistema ou recrutador, não uma promessa de próxima etapa.</li>
<li><strong>Entrevista marcada:</strong> confirme data, horário, formato e canal de contato; observe o fuso se a empresa atuar de outro lugar.</li>
<li><strong>Processo encerrado:</strong> consulte a comunicação oficial. A ausência de nova mensagem nem sempre indica o motivo do encerramento.</li>
</ul>
<h2>Como decidir quando pedir uma atualização</h2>
<p>Comece pelas instruções da própria vaga. Algumas empresas indicam que apenas candidatos selecionados serão chamados; outras informam uma data provável. Quando houver prazo expresso, espere que ele se encerre antes de perguntar. Se não houver prazo, uma única mensagem educada após um intervalo razoável pode ser mais adequada do que uma sequência de cobranças diárias. Não existe um número universal de dias que garanta retorno.</p>
<p>Uma mensagem pode ser direta e verificável: <em>Olá, participei do processo para [cargo] em [data]. Gostaria de saber se há alguma atualização sobre as etapas previstas. Agradeço pela atenção.</em> Não afirme que foi aprovado se ainda não recebeu confirmação, nem envie dados sensíveis para um contato não verificado.</p>
<h2>Se o recrutador não responder, continue sua pesquisa</h2>
<p>O acompanhamento serve para orientar próximos passos, não para paralisar toda a busca por causa de uma vaga. Continue consultando anúncios compatíveis e deixe claro em seu registro o que está pendente. Se a empresa responder com uma nova data, atualize sua anotação. Se descobrir que o link venceu ou que a oportunidade foi removida, marque a inscrição como encerrada ou não confirmada em vez de continuar abrindo o mesmo anúncio.</p>
<h2>Quando desconfiar de um suposto retorno</h2>
<p>Uma mensagem dizendo que você foi escolhido pode ser falsa. Compare o nome da vaga e o canal com o anúncio original. Não pague taxa para liberar entrevista, não compartilhe senha gov.br e desconfie de pressão para depositar dinheiro imediatamente. Se a candidatura foi feita pelo <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">SINE</a>, consulte o canal oficial para confirmar a informação recebida.</p>
<h2>Revise seu histórico uma vez por semana</h2>
<ol>
<li>Conte quantas candidaturas realmente foram finalizadas, sem contar cliques que não completaram inscrição.</li>
<li>Separe as que têm prazo futuro daquelas que precisam apenas de acompanhamento.</li>
<li>Confira se os contatos registrados ainda são os canais oficiais da empresa.</li>
<li>Analise em quais funções e canais recebeu alguma resposta; isso pode orientar seu próximo currículo.</li>
<li>Faça uma atualização concreta no perfil quando perceber um erro de informação, sem inventar experiência.</li>
</ol>
<p>O melhor registro é o que você consegue manter. Uma tabela simples com cinco ou seis campos já ajuda a evitar duplicações, desencontros de datas e cobranças fora de hora. Não há obrigação de publicar seu histórico; trate-o como informação pessoal.</p>`
  },
  "pesquisar-empresa-antes-entrevista": {
    revisedAt: "2026-10-12",
    description: "Como pesquisar uma empresa antes da entrevista, conferir CNPJ quando informado, verificar canais e preparar perguntas práticas sem cair em vagas falsas.",
    sources: [
      {
        label: "Receita Federal — comprovante de inscrição e situação cadastral do CNPJ",
        url: "https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_S.aspx",
        reason: "Consulta pública de situação cadastral de pessoas jurídicas"
      },
      {
        label: "Governo Federal — serviço Buscar Emprego no SINE",
        url: "https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine",
        reason: "Referência de canal oficial de intermediação de emprego"
      }
    ],
    html: `
<p>Pesquisar uma empresa antes da entrevista é uma forma de fazer perguntas melhores e evitar processos suspeitos. Não é decorar a história inteira da organização: é identificar com clareza <strong>o que ela faz, qual cargo ofereceu e como a seleção está sendo conduzida</strong>. Reserve um tempo proporcional à oportunidade e use fontes que possam ser conferidas.</p>
<h2>Primeiro: confirme qual empresa está realmente recrutando</h2>
<p>Volte ao anúncio original e anote nome, cargo, cidade, local de trabalho e canal de candidatura. Se recebeu apenas um print ou mensagem encaminhada, procure a página oficial da empresa ou da plataforma mencionada antes de compartilhar dados. Verifique se o e-mail do recrutador corresponde a um domínio plausível e se há consistência entre a vaga e o setor em que a empresa atua.</p>
<p>Se o anúncio informar CNPJ, você pode consultar a situação cadastral por meio do <a href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_S.aspx" target="_blank" rel="noopener noreferrer">serviço oficial da Receita Federal</a>. Compare o nome empresarial com o anúncio, lembrando que uma organização pode usar nome fantasia e que empresas legítimas podem contratar por consultorias. A existência de CNPJ ativo <strong>não é garantia de que o anúncio, o recrutador ou a promessa de contratação sejam verdadeiros</strong>.</p>
<h2>Segundo: entenda o negócio em linguagem comum</h2>
<p>Escreva em uma frase o que a empresa oferece e para quem. Se é uma organização de atendimento, pergunte quais clientes ou serviços ela atende, sem presumir o tamanho da equipe. Se é um centro de distribuição, procure entender se a função envolve recebimento, separação, estoque ou expedição. Isso permite conectar sua experiência às atividades reais descritas no anúncio.</p>
<p>Separe fatos públicos de opiniões: um comentário em rede social pode revelar uma experiência individual, mas não prova que todos os setores trabalham da mesma maneira. Evite repetir acusações ou elogios sem fonte na entrevista.</p>
<h2>Terceiro: transforme a pesquisa em perguntas úteis</h2>
<ul>
<li>Quais são as principais atividades das primeiras semanas nesse cargo?</li>
<li>Como a equipe acompanha a adaptação de quem entra?</li>
<li>Quais ferramentas ou sistemas são usados na rotina?</li>
<li>Quem informa as próximas etapas e qual é o prazo estimado?</li>
<li>O local, a jornada e as condições descritas na entrevista correspondem ao anúncio?</li>
</ul>
<p>Não é necessário fazer todas as perguntas. Escolha duas ou três que realmente ajudem você a entender o trabalho. Perguntas específicas demonstram atenção ao cargo, mas nenhuma fórmula garante aprovação.</p>
<h2>Quarto: verifique se você consegue cumprir a proposta</h2>
<p>Em São Luís, um trajeto entre bairros pode representar tempo e despesas importantes. Antes de aceitar uma entrevista presencial, confira endereço, horários e meio de transporte. Se a vaga for em outra cidade da região metropolitana, avalie também o retorno. Nossa <a href="/ferramentas/custo-deslocamento">calculadora gratuita</a> permite estimar gastos com números que você mesmo verificou, sem presumir tarifa.</p>
<p>Observe se a empresa descreve claramente jornada, local, modalidade e benefícios quando estes forem parte da oferta. Caso uma condição mude durante a seleção, peça esclarecimento por canal oficial antes de tomar uma decisão.</p>
<h2>Sinais que exigem atenção adicional</h2>
<p>Desconfie de taxas para reservar entrevista, compra obrigatória de material para participar do processo, links que pedem senha ou código de acesso e convites urgentes enviados por contatos sem relação verificável com a empresa. Não conclua automaticamente que é fraude só porque o recrutador não divulgou todos os dados na primeira mensagem; procure confirmação independente e mantenha cautela.</p>
<p>Quando a oferta estiver vinculada a um serviço público, consulte o próprio <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">canal do SINE no gov.br</a>. Confira o <a href="/seguranca-candidatos">guia de segurança para candidatos</a> antes de encaminhar documentos. Não faça pagamento por promessa de contratação.</p>
<h2>Resumo prático para levar à entrevista</h2>
<ol>
<li>Nome da empresa e fonte oficial do anúncio confirmados.</li>
<li>Cargo e principais responsabilidades destacados.</li>
<li>Dois exemplos verdadeiros das suas habilidades relacionados à vaga.</li>
<li>Duas perguntas objetivas preparadas para o entrevistador.</li>
<li>Endereço e horário conferidos, com rota de ida e volta viável.</li>
<li>Canal para acompanhar as próximas etapas registrado.</li>
</ol>
<p>Esse roteiro não substitui uma investigação jurídica nem uma validação oficial de cada empresa. Ele ajuda o candidato a fazer perguntas melhores, reduzir dúvidas e perceber inconsistências antes de assumir compromissos.</p>`
  }
};

export function getReviewedEditorialOverride(slug: string): ReviewedEditorialOverride | null {
  return REVIEWED_EDITORIAL_OVERRIDES[slug] ?? null;
}
