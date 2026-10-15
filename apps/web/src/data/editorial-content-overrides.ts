export type EditorialContentOverride = {
  reviewedAt: string;
  contentHtml: string;
};

const overrides: Record<string, EditorialContentOverride> = {
  "busca-emprego-sao-luis-2026": {
    reviewedAt: "2026-10-12",
    contentHtml: `
      <p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Este guia não promete vagas nem tenta adivinhar quais empresas vão contratar. Ele ensina a decidir onde concentrar tempo usando fontes públicas, anúncios verificáveis e o retorno das suas próprias candidaturas.</p>

      <h2>Comece pelo que cabe na sua rotina em São Luís</h2>
      <p>Antes de escolher um cargo, defina três limites reais: o tempo máximo de deslocamento, os horários que você consegue cumprir e a renda mínima necessária para aceitar uma proposta. Uma vaga pode combinar com o currículo e ainda ser inviável quando a escala termina depois do último transporte disponível ou quando o custo mensal do trajeto consome uma parte importante da remuneração.</p>
      <p>Faça duas listas. Na primeira, coloque bairros e municípios que você alcança com segurança no horário da vaga. Na segunda, registre funções em que já consegue demonstrar alguma tarefa concreta. Atendimento, por exemplo, não é apenas “ser comunicativo”: pode significar organizar fila, registrar pedido, responder dúvida ou resolver reclamação. Essa tradução ajuda a comparar sua experiência com o anúncio sem inventar cargo.</p>
      <p>Para transformar o trajeto em número, use a <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a>. Ela usa a tarifa e a quantidade de viagens informadas por você; o portal não presume valor de passagem, benefício ou salário.</p>

      <h2>Consulte oportunidade atual, não lista antiga</h2>
      <p>Em vez de concluir que um setor “está contratando” porque viu uma publicação antiga, abra os canais no dia da busca. O serviço federal <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> explica o cadastro, a consulta e a candidatura pelo sistema público. A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> é outro canal oficial para acessar serviços ligados ao trabalho.</p>
      <p>Para entender tendências, consulte a área de <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho" target="_blank" rel="noopener noreferrer">estatísticas do Ministério do Trabalho e Emprego</a>. Os painéis do Novo Caged ajudam a observar admissões e desligamentos formais, mas não substituem a leitura de uma vaga específica. Dados estaduais ou nacionais não provam que determinada empresa, bairro ou função esteja com processo aberto hoje.</p>
      <p>Use redes sociais como ponto de descoberta, nunca como confirmação final. Antes de enviar currículo, procure o anúncio no site da empresa, no sistema indicado pelo órgão público ou em outro canal institucional identificável. Não pague taxa para “reservar” entrevista e não forneça senha ou código da conta gov.br.</p>

      <h2>Um teste de duas semanas para escolher prioridades</h2>
      <p>Separe dois cargos próximos da sua experiência, não dez cargos sem relação. Durante duas semanas, reserve blocos curtos para pesquisar, adaptar o currículo e registrar o resultado. Um exemplo hipotético: uma candidata com experiência real em caixa e organização de estoque pode testar “operador de loja” e “auxiliar de estoque”. Ela não deve acrescentar curso, sistema ou liderança que nunca exerceu; deve descrever as tarefas que consegue explicar em uma entrevista.</p>
      <ol>
        <li><strong>Leia dez anúncios completos</strong> de cada cargo e anote apenas requisitos que se repetem.</li>
        <li><strong>Separe obrigatório de desejável.</strong> Não descarte a vaga por um item desejável, mas não ignore requisito legal, horário ou formação obrigatória.</li>
        <li><strong>Adapte o resumo e a ordem das experiências</strong> para destacar tarefas verdadeiras relacionadas ao anúncio.</li>
        <li><strong>Envie pelo canal confirmado</strong> e guarde cargo, empresa, data, URL e versão do currículo.</li>
        <li><strong>Revise após 14 dias.</strong> Compare respostas, entrevistas e incompatibilidades; não avalie apenas o total de envios.</li>
      </ol>
      <p>O <a href="/ferramentas/controle-candidaturas">controle gratuito de candidaturas</a> organiza esses dados no navegador e permite baixar um CSV. Ele não envia informações ao portal. Evite registrar CPF, RG, senhas ou outros dados sensíveis.</p>

      <p>Ao fim do teste, mantenha uma nota curta para cada cargo: quantos anúncios eram realmente compatíveis, quantas candidaturas foram concluídas e quais requisitos impediram o envio. Se a maioria exigia uma habilitação que você não possui, escolha outra função ou procure formação legítima; não marque o requisito como concluído. Se o obstáculo era sempre horário ou distância, ajuste o raio da busca antes de alterar o currículo.</p>

      <h2>Como interpretar o seu funil sem se culpar</h2>
      <p>Se houve visualização ou contato, mas nenhuma entrevista, confira se o currículo evidencia as tarefas centrais do anúncio. Se houve entrevistas, mas as propostas não cabem no deslocamento ou na escala, o problema está no filtro inicial, não na quantidade de candidaturas. Se não houve retorno, reduza o volume por alguns dias e compare o documento com anúncios reais: título do cargo, ferramentas que você de fato usa, disponibilidade e telefone precisam estar fáceis de localizar.</p>
      <p>Não transforme ausência de resposta em certeza sobre sua capacidade. Empresas encerram processos, mudam orçamento e recebem volumes diferentes de candidatos. O dado útil é aquilo que você consegue ajustar: qualidade do anúncio escolhido, adequação honesta do currículo, canal utilizado e preparação para a próxima conversa.</p>

      <h2>Checklist antes de priorizar uma vaga</h2>
      <ul>
        <li>O anúncio identifica empresa ou canal responsável pela seleção?</li>
        <li>O local e o horário são compatíveis com seu deslocamento real?</li>
        <li>Os requisitos obrigatórios estão claros e você consegue comprová-los?</li>
        <li>A candidatura ocorre em site, e-mail ou contato que você conseguiu verificar?</li>
        <li>Não há cobrança, promessa de aprovação ou pedido antecipado de senha e dados bancários?</li>
        <li>Você guardou uma cópia do anúncio e a data do envio?</li>
      </ul>

      <h2>O que este panorama pode e não pode afirmar</h2>
      <p>Este conteúdo oferece um método de busca para São Luís; não é um boletim de vagas nem uma previsão econômica. As fontes oficiais podem atualizar telas, séries e regras depois da data de revisão. Para dados de contexto do município, consulte também o perfil de <a href="https://www.ibge.gov.br/cidades-e-estados/ma/sao-luis.html" target="_blank" rel="noopener noreferrer">São Luís no IBGE</a> e verifique o ano de referência de cada indicador antes de compará-lo com 2026.</p>
      <p>Quando encontrar uma oportunidade, confira a publicação mais recente do responsável pela seleção. Para usar o SINE e a Carteira Digital com mais segurança, leia o <a href="/guias/emprego-sine-maranhao">guia de canais oficiais no Maranhão</a>. Se algum link ou informação desta página estiver desatualizado, solicite correção pela página de contato; a redação registra a revisão sem apagar o histórico do artigo.</p>
    `.trim()
  },

  "organizar-busca-emprego": {
    reviewedAt: "2026-10-12",
    contentHtml: `
      <p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Organizar a busca de emprego não significa enviar o maior número possível de currículos. O objetivo é criar uma rotina que permita confirmar a origem da vaga, adaptar informações verdadeiras, acompanhar respostas e perceber quais escolhas precisam mudar. Este guia foi escrito para quem procura trabalho em São Luís e região, mas não anuncia vagas nem promete contratação.</p>

      <h2>Defina o que é viável antes de abrir os anúncios</h2>
      <p>Comece registrando três limites pessoais: funções que você consegue exercer e explicar em uma entrevista, horários realmente disponíveis e áreas que consegue alcançar. Em São Luís, o bairro informado no anúncio não basta para decidir. Considere o horário de entrada e saída, as conexões necessárias e o custo efetivo do trajeto. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> ajuda a comparar cenários usando os valores que você mesmo informar, sem presumir tarifa, salário ou benefício.</p>
      <p>Escolha no máximo dois cargos-alvo por ciclo de duas semanas. Eles podem ser próximos, como auxiliar de estoque e operador de loja, desde que correspondam à sua experiência. Anote também um cargo que você decidiu não buscar e o motivo. Essa exclusão consciente reduz candidaturas incompatíveis e evita alterar o currículo para cada título chamativo.</p>

      <h2>Use canais oficiais como ponto de verificação</h2>
      <p>O serviço federal <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> informa que o trabalhador pode cadastrar formação e experiências e consultar oportunidades compatíveis pelo atendimento on-line ou presencial. O <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/sistema-nacional-de-emprego-sine/portal-emprega-brasil" target="_blank" rel="noopener noreferrer">Portal Emprega Brasil</a> reforça a importância de manter atualizados os dados cadastrais e as pretensões profissionais.</p>
      <p>A <a href="https://www.gov.br/pt-br/temas/carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> reúne acesso a serviços ligados à vida laboral. Esses canais não transformam toda publicação vista em rede social em vaga confirmada. Quando o anúncio citar uma empresa, volte ao site institucional ou ao canal indicado pela própria organização e confira se cargo, local, prazo e forma de candidatura coincidem.</p>
      <p>Salve a URL e a data da consulta, não apenas uma captura de tela. Uma imagem encaminhada em grupo pode continuar circulando depois do encerramento do processo. Se não houver página verificável, identifique claramente no seu controle que a origem ainda precisa ser confirmada antes de compartilhar documentos.</p>

      <h2>Monte uma rotina semanal que caiba no seu dia</h2>
      <p>Uma agenda curta e repetível costuma ser mais útil que uma maratona ocasional. O exemplo abaixo é apenas um modelo; ajuste os dias à sua rotina:</p>
      <ol>
        <li><strong>Primeiro bloco:</strong> localizar anúncios atuais nos dois cargos escolhidos e eliminar os que não informam requisitos, local ou canal responsável.</li>
        <li><strong>Segundo bloco:</strong> comparar cinco anúncios completos e anotar tarefas ou conhecimentos que aparecem mais de uma vez.</li>
        <li><strong>Terceiro bloco:</strong> revisar o currículo-base e criar uma versão para cada cargo, mudando apenas a ordem e a ênfase de experiências verdadeiras.</li>
        <li><strong>Quarto bloco:</strong> enviar as candidaturas confirmadas e guardar URL, empresa, cargo, data, canal e versão do currículo.</li>
        <li><strong>Último bloco:</strong> revisar respostas, prazos e incompatibilidades; arquivar anúncios encerrados e preparar a semana seguinte.</li>
      </ol>
      <p>Se você dispõe de pouco tempo, reduza a quantidade de anúncios analisados, não a etapa de verificação. Quinze minutos usados para confirmar empresa e canal podem evitar o envio de documentos a um contato falso.</p>

      <h2>Crie um currículo-base sem copiar palavras que não domina</h2>
      <p>Mantenha um arquivo principal com formação, cursos concluídos, datas, experiências e contatos atualizados. Para cada cargo-alvo, faça uma cópia e traga para o início as tarefas relacionadas ao anúncio. Se trabalhou informalmente, descreva o que realizou e o contexto, sem inventar vínculo, empresa, sistema ou tempo de experiência.</p>
      <p>Um anúncio que pede atendimento ao cliente pode valorizar registro de pedidos, organização de fila ou solução de dúvidas. Só inclua uma dessas tarefas se ela aconteceu e se você consegue explicar como a executava. Palavras repetidas em anúncios servem para entender a função, não para fabricar competências.</p>
      <p>Nomeie os arquivos de forma simples, como <em>nome-cargo-mes-ano.pdf</em>. Abra o PDF antes do envio para conferir telefone, e-mail, páginas em branco e cortes. Evite inserir CPF, RG, dados bancários, senha ou foto de documentos no currículo. Documentos adicionais devem ser fornecidos apenas quando o processo e o destinatário estiverem confirmados.</p>

      <h2>Acompanhe cada candidatura sem guardar dados sensíveis</h2>
      <p>Use uma planilha ou o <a href="/ferramentas/controle-candidaturas">controle gratuito de candidaturas</a> para registrar somente o necessário: cargo, empresa, URL, data do envio, canal, prazo informado, status e próxima ação. A ferramenta do portal funciona no navegador e permite exportar CSV; ela não envia candidaturas por você.</p>
      <p>Adote poucos status objetivos: “a confirmar”, “pronta para enviar”, “enviada”, “retorno recebido”, “entrevista”, “encerrada” e “descartada”. A coluna “próxima ação” deve ter uma tarefa verificável, como conferir o site da empresa ou responder a um e-mail, e não frases vagas como “tentar mais”.</p>
      <p>Um exemplo hipotético: uma candidata encontrou doze anúncios em uma semana, mas somente sete tinham origem e requisitos confirmáveis. Ela enviou cinco candidaturas compatíveis, descartou duas por horário e manteve duas aguardando verificação. O resultado útil não é “doze vagas”; é saber por que cada anúncio avançou, foi descartado ou ficou pendente.</p>

      <h2>Faça uma revisão a cada quatorze dias</h2>
      <p>Conte quantas candidaturas foram realmente concluídas, quantas receberam contato e quais obstáculos apareceram. Se muitos anúncios exigiam algo que você ainda não possui, verifique formação legítima ou ajuste o cargo-alvo. Se o principal problema era deslocamento, reduza a área antes de reescrever todo o currículo. Se havia compatibilidade, mas nenhum retorno, compare clareza, ordem das experiências, título do arquivo e canal usado.</p>
      <p>Não interprete silêncio como prova de incapacidade. Processos podem ser encerrados, pausados ou receber muitos candidatos. A revisão serve para melhorar decisões sob seu controle, sem inventar explicações sobre a empresa e sem aumentar volume às cegas.</p>

      <h2>Reconheça sinais de golpe antes de agir</h2>
      <p>O boletim de segurança do Governo Federal sobre <a href="https://www.gov.br/gsi/pt-br/seguranca-da-informacao-e-cibernetica/boletim-informativo-mensal/BIMn37.pdf" target="_blank" rel="noopener noreferrer">falsas ofertas de trabalho</a> recomenda pesquisar a empresa e desconfiar de propostas muito atraentes ou pedidos de informações pessoais e financeiras. Outro <a href="https://www.gov.br/cisc/pt-br/alertas-de-golpes-digitais/golpistas-enviam-mensagens-no-whatsapp-se-passando-por-entidades-do-governo" target="_blank" rel="noopener noreferrer">alerta oficial sobre mensagens falsas</a> destaca o uso de urgência, links maliciosos e cobranças indevidas.</p>
      <ul>
        <li>Não pague taxa para garantir entrevista, material, certificado ou contratação.</li>
        <li>Não informe senha, código de verificação ou acesso à conta gov.br.</li>
        <li>Compare o domínio do link com o endereço institucional verdadeiro.</li>
        <li>Interrompa o contato quando houver pressão para decidir ou pagar imediatamente.</li>
        <li>Guarde a evidência e procure os canais oficiais ou as autoridades se houver suspeita de fraude.</li>
      </ul>

      <h2>Checklist para encerrar a semana</h2>
      <ul>
        <li>Os dois cargos-alvo continuam compatíveis com minha experiência e rotina?</li>
        <li>Cada candidatura possui URL, data e canal verificáveis?</li>
        <li>Usei uma versão identificável do currículo e revisei o PDF?</li>
        <li>Separei anúncios descartados daqueles que ainda aguardam confirmação?</li>
        <li>Registrei a próxima ação sem incluir documentos ou dados sensíveis?</li>
        <li>Comparei custo e horário do deslocamento antes de aceitar entrevista?</li>
      </ul>
      <p>Esta rotina é um método de organização, não uma previsão de contratação. Serviços públicos, páginas e processos seletivos podem mudar depois da data de revisão. Consulte sempre a versão atual da fonte e o canal informado pelo responsável pela seleção. Para entender o uso do SINE no estado, veja também o <a href="/guias/emprego-sine-maranhao">guia de canais oficiais no Maranhão</a>.</p>
    `.trim()
  },

  "linkedin-primeiro-emprego": {
    reviewedAt: "2026-10-14",
    contentHtml: `
      <p><strong>Revisão editorial: 14 de outubro de 2026.</strong> O LinkedIn pode ajudar quem procura o primeiro emprego a apresentar experiências reais, acompanhar organizações e descobrir anúncios. Ele não substitui currículo, entrevista, SINE ou o canal oficial da empresa; também não garante que um perfil será encontrado. Este guia mostra como usar a plataforma com método e segurança, sem inventar cargo, curso, competência ou contratação.</p>

      <h2>Escolha um objetivo que você consegue sustentar</h2>
      <p>Antes de editar o perfil, selecione um ou dois cargos compatíveis com sua formação, disponibilidade e atividades que já realizou. Em São Luís, considere também onde consegue trabalhar e em quais horários pode se deslocar. “Qualquer vaga” não ajuda o recrutador a entender sua direção e dificulta a criação de alertas úteis.</p>
      <p>Transforme atividades em evidências. Quem ajudou a organizar materiais em um projeto escolar pode mencionar inventário simples, conferência e registro, mas não deve se apresentar como analista de estoque. Quem atendeu pessoas em ação voluntária pode descrever recepção e orientação, sem criar vínculo empregatício. O limite é simples: você precisa conseguir explicar quando, onde e como realizou cada tarefa.</p>
      <p>Se ainda não definiu a direção, compare anúncios atuais e anote requisitos que se repetem. O guia de <a href="/blog/objetivo-profissional-curriculo">objetivo profissional</a> ajuda a converter essa leitura em um texto curto e honesto.</p>

      <h2>Preencha o perfil como um documento verificável</h2>
      <p>A orientação oficial <a href="https://www.linkedin.com/help/linkedin/answer/a554351/edit-your-profile?lang=en" target="_blank" rel="noopener noreferrer">Criar um bom perfil no LinkedIn</a> reúne os elementos editáveis do perfil. Para o primeiro emprego, use esses campos como um resumo organizado do que já existe, não como espaço para compensar falta de experiência com palavras exageradas.</p>
      <ul>
        <li><strong>Nome:</strong> use a forma pela qual você se apresenta profissionalmente.</li>
        <li><strong>Localidade:</strong> informe sua região real; não troque a cidade apenas para aparecer em mais buscas.</li>
        <li><strong>Título:</strong> combine cargo-alvo, área ou formação com uma habilidade que consiga demonstrar.</li>
        <li><strong>Sobre:</strong> escreva um parágrafo curto sobre situação atual, atividades reais, objetivo e disponibilidade relevante.</li>
        <li><strong>Experiência:</strong> identifique estágio, aprendizagem, trabalho formal, projeto, serviço autônomo ou voluntariado sem confundir uma modalidade com outra.</li>
        <li><strong>Formação e cursos:</strong> registre instituição, nome correto e situação — concluído, cursando ou interrompido.</li>
      </ul>
      <p>Exemplo hipotético de título: “Estudante de Administração | apoio em organização de documentos e atendimento”. Ele só serve para quem realmente estuda Administração e consegue explicar essas atividades. Evite “especialista”, “coordenador” ou “gestor” se esses níveis não correspondem à sua trajetória.</p>

      <h2>Escreva a seção Sobre sem copiar promessa pronta</h2>
      <p>Use quatro partes: quem você é hoje, o que já fez, o que procura e como pode ser contatado pela plataforma. Um texto possível seria: “Estudante do ensino médio em São Luís, com participação na organização de feira escolar e atendimento aos visitantes. Procuro oportunidade de aprendizagem nas áreas de atendimento ou apoio administrativo. Tenho disponibilidade no turno informado no meu currículo e prefiro receber o primeiro contato por mensagem.”</p>
      <p>O exemplo não deve ser copiado sem adaptação. Troque cada informação pela sua realidade e retire aquilo que não consegue comprovar. Não publique CPF, RG, endereço completo, dados bancários, senha, código de verificação ou foto de documento. Telefone e e-mail podem ser compartilhados conforme sua decisão de privacidade, mas devem estar atualizados e ser monitorados.</p>

      <h2>Registre experiência sem transformar projeto em emprego</h2>
      <p>Quando não há carteira assinada, projetos de escola, cursos práticos, voluntariado, portfólio e serviços pontuais podem mostrar aprendizado. Identifique o contexto e descreva a entrega. “Organizei inscrições de 40 participantes em uma atividade escolar” é diferente de afirmar que trabalhou como assistente administrativo. Não informe quantidade se você não possui registro ou lembrança confiável.</p>
      <p>Use frases com ação, contexto e resultado observável: “conferi materiais antes do evento”, “preparei apresentação em grupo” ou “orientei visitantes durante a feira”. Evite listas de adjetivos como proativo, resiliente e líder sem um exemplo associado. Competência no perfil deve apontar para algo que você estudou ou praticou.</p>

      <h2>Revise o que fica público antes de divulgar o endereço</h2>
      <p>O LinkedIn explica que a <a href="https://www.linkedin.com/help/linkedin/answer/a518980?mainArticle=true" target="_blank" rel="noopener noreferrer">visibilidade do perfil público</a> pode alcançar pessoas fora da plataforma, dependendo das configurações. Antes de colocar o endereço do perfil no currículo, abra as opções de visibilidade e decida quais campos devem aparecer publicamente.</p>
      <p>Faça também uma conferência fora da sua sessão, sem presumir que todas as pessoas verão a mesma tela. Verifique nome, título, foto escolhida, localidade e informações de contato. Se usar foto, prefira uma imagem atual, nítida e coerente; foto não é prova de competência e não deve ser requisito criado por este guia.</p>
      <p>Reveja permissões sempre que acrescentar telefone, e-mail, atividade ou documento. O objetivo é ser localizável sem expor informação desnecessária. Guarde uma cópia do texto principal para manter LinkedIn e currículo coerentes.</p>

      <h2>Crie alertas específicos e confira cada anúncio</h2>
      <p>O recurso oficial de <a href="https://www.linkedin.com/help/linkedin/answer/a1420165" target="_blank" rel="noopener noreferrer">alertas de vagas do LinkedIn</a> permite criar, editar e excluir alertas relacionados às preferências informadas. Para começar, use um alerta por cargo-alvo e localidade. Em vez de “emprego”, experimente um título existente nos anúncios, como auxiliar administrativo, jovem aprendiz ou atendente, somente quando compatível com seu objetivo.</p>
      <p>Um alerta é aviso automatizado, não confirmação de que a oportunidade continua aberta nem recomendação editorial deste portal. Abra o anúncio completo e confira empresa, cidade, modalidade, requisitos, data e canal de candidatura. Quando houver site de carreira da organização, compare as informações antes de enviar documentos.</p>
      <p>O serviço federal <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> oferece outro caminho oficial para consulta e candidatura. Use fontes diferentes sem duplicar envios. Registre cada oportunidade no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>, com URL, data, empresa, cargo, canal e próxima ação.</p>

      <h2>Construa rede sem enviar pedidos genéricos em massa</h2>
      <p>Comece por pessoas que você conhece: colegas, professores, orientadores, ex-colegas de curso e profissionais encontrados em eventos ou atividades reais. Ao enviar convite, explique a ligação em uma frase. Não peça indicação ou vaga no primeiro contato com desconhecido e não anexe currículo sem que a pessoa tenha solicitado.</p>
      <p>Siga empresas e instituições para observar comunicações oficiais, mas não conclua que uma postagem antiga representa processo aberto. Se comentar, faça pergunta ligada ao conteúdo e mantenha respeito. Copiar a mesma mensagem para dezenas de pessoas pode gerar bloqueio, prejudicar sua reputação e raramente produz informação útil.</p>
      <p>Depois de uma conversa ou evento, registre o contexto para não abordar a mesma pessoa repetidamente. Networking não é coleta de contatos: é manter relações profissionais identificáveis e agir com consentimento.</p>

      <h2>Reconheça sinais de perfil ou oportunidade falsa</h2>
      <p>O próprio LinkedIn mantém instruções para <a href="https://www.linkedin.com/help/linkedin/answer/a1338436/reporting-fake-profiles" target="_blank" rel="noopener noreferrer">identificar e denunciar perfis falsos</a>. Desconfie quando o contato não consegue indicar página da empresa ou anúncio verificável, pressiona por resposta imediata, oferece remuneração incompatível sem explicar atividades ou pede pagamento, senha, código e dados financeiros.</p>
      <ul>
        <li>Compare nome e domínio do remetente com o site institucional.</li>
        <li>Não pague curso, exame, material ou taxa para garantir entrevista ou contratação.</li>
        <li>Não compartilhe documento completo antes de confirmar empresa, finalidade e destinatário.</li>
        <li>Não entregue senha ou código de acesso do LinkedIn, e-mail, WhatsApp ou conta gov.br.</li>
        <li>Guarde URL, mensagem e data quando precisar denunciar uma abordagem suspeita.</li>
      </ul>
      <p>Se a empresa for mencionada, procure um canal oficial independente e pergunte se o processo existe. Não confronte nem divulgue dados pessoais do remetente; interrompa o contato, use as ferramentas de denúncia e procure orientação das autoridades quando houver tentativa de fraude.</p>

      <h2>Um plano de sete dias para publicar um perfil coerente</h2>
      <ol>
        <li><strong>Dia 1:</strong> escolha até dois cargos-alvo e anote limites de horário e deslocamento.</li>
        <li><strong>Dia 2:</strong> reúna currículo, certificados verdadeiros e exemplos de atividades.</li>
        <li><strong>Dia 3:</strong> revise nome, localidade, título e seção Sobre.</li>
        <li><strong>Dia 4:</strong> registre formação, experiências e projetos com contexto correto.</li>
        <li><strong>Dia 5:</strong> ajuste visibilidade e confira como o perfil aparece fora da sessão.</li>
        <li><strong>Dia 6:</strong> crie alertas específicos e salve apenas anúncios verificáveis.</li>
        <li><strong>Dia 7:</strong> compare o perfil com o currículo e corrija datas, títulos e contatos divergentes.</li>
      </ol>
      <p>Depois da primeira semana, revise mensalmente ou sempre que curso, disponibilidade ou experiência mudarem. Não edite o perfil apenas para repetir palavras de um anúncio; mantenha um registro que continue verdadeiro em uma entrevista.</p>

      <h2>Checklist antes de usar o perfil em uma candidatura</h2>
      <ul>
        <li>O título descreve um objetivo compatível com minha trajetória?</li>
        <li>Consigo explicar cada experiência, competência e curso informado?</li>
        <li>LinkedIn e currículo usam datas e contatos coerentes?</li>
        <li>Revisei as opções de visibilidade e retirei dados sensíveis?</li>
        <li>O anúncio foi confirmado em canal identificável da empresa ou serviço oficial?</li>
        <li>Registrei candidatura e próxima ação sem repetir envio?</li>
      </ul>
      <p>LinkedIn é uma das ferramentas possíveis, não uma medida do valor profissional de alguém. Um perfil completo não cria experiência e uma rede grande não garante entrevista. Para combinar a plataforma com canais públicos no Maranhão, consulte o <a href="/guias/emprego-sine-maranhao">guia do SINE e da Carteira de Trabalho Digital</a>. Se um recurso ou link mudar depois desta revisão, confirme a versão atual na Central de Ajuda correspondente e avise a redação pela página de contato.</p>
    `.trim()
  },
  "mensagem-fria-recrutador-linkedin": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Entrar em contato com alguém da área de recrutamento não significa pedir uma vaga imediatamente. O objetivo pode ser descobrir o canal oficial de seleção ou confirmar se existe processo aberto. Uma mensagem curta e específica respeita mais o destinatário do que copiar o mesmo texto para dezenas de pessoas.</p>
<h2>Antes de escrever: três verificações</h2>
<ol><li>Confira se o perfil realmente representa a empresa ou o profissional e se o canal de candidaturas aparece no site institucional.</li><li>Leia o cargo anunciado e identifique uma competência sua relacionada à descrição.</li><li>Decida qual informação precisa perguntar. Não peça indicação sem contexto a alguém que não conhece você.</li></ol>
<h2>Modelo para perguntar sobre o canal oficial</h2>
<blockquote><p>Olá, [nome]. Encontrei uma oportunidade de [cargo] divulgada por [empresa] e estou conferindo o procedimento correto. Tenho experiência em [atividade verificável] e gostaria de confirmar qual é a página oficial de inscrição. Obrigado pelo seu tempo.</p></blockquote>
<p>Substitua os colchetes por informações verdadeiras. Se a empresa já publicou o link de candidatura, use-o diretamente em vez de enviar mensagem paralela. O modelo não garante resposta nem entrevista.</p>
<h2>Modelo para uma conversa de orientação, sem vaga anunciada</h2>
<blockquote><p>Olá, [nome]. Estou estudando funções de [área] em São Luís. Percebi que sua atuação envolve [atividade citada no perfil]. Posso perguntar quais conhecimentos você considera essenciais para quem está começando? Não quero tomar muito do seu tempo.</p></blockquote>
<h2>O que deve ficar fora da primeira mensagem</h2>
<ul><li>CPF, RG, foto de documento ou dados bancários.</li><li>Arquivos pesados enviados sem solicitação.</li><li>Afirmações como “tenho disponibilidade total” quando isso não é verdade.</li><li>Cobranças repetidas ou pedidos de contratação imediata.</li></ul>
<p><strong>Exemplo local ilustrativo:</strong> se o anúncio menciona trabalho presencial no Turu e você só tem transporte viável até a região central, descubra horários e local antes de dizer que pode aceitar qualquer turno. Essa verificação é mais útil do que inserir “sou proativo” na abertura.</p>
<h2>Depois do contato</h2>
<p>Registre a data e o próximo passo na <a href="/ferramentas/controle-candidaturas">ferramenta gratuita de candidaturas</a>. Se o contato não responder, continue usando fontes oficiais em vez de insistir diariamente. Para buscar oportunidades pelo serviço público, conheça o <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">SINE (gov.br)</a>. Mensagem privada não substitui candidatura feita no canal da empresa.</p>
<h2>Escolha o tipo de contato antes de abrir a conversa</h2>
<p>Há diferença entre pedir o canal de uma vaga, solicitar uma informação sobre a área e convidar alguém para fazer parte da sua rede. No primeiro caso, cite o anúncio e faça uma pergunta objetiva. No segundo, explique por que aquela pessoa pode responder e deixe claro que uma negativa é aceitável. No terceiro, dê contexto sobre a relação real — evento, instituição, área ou trabalho anterior — sem fingir proximidade.</p>
<p>A página oficial do LinkedIn sobre <a href="https://www.linkedin.com/help/linkedin/answer/a569204/personalizacao-dos-convites-de-conexao?lang=pt" target="_blank" rel="noopener noreferrer">personalização de convites</a> recomenda uma nota concisa e atenciosa para explicar quem envia e por que deseja se conectar. Isso não transforma convite em candidatura. Se o anúncio manda usar outro sistema, complete o processo no sistema e use a rede apenas para a pergunta que ainda ficou sem resposta.</p>
<h2>Revise a mensagem com quatro filtros</h2>
<ul><li><strong>Identidade:</strong> nome e empresa estão corretos no perfil atual?</li><li><strong>Contexto:</strong> o destinatário entenderá qual anúncio, área ou conversa motivou o contato?</li><li><strong>Pedido:</strong> existe uma pergunta que pode ser respondida sem analisar todo o seu currículo?</li><li><strong>Saída:</strong> a mensagem permite que a pessoa não responda sem receber cobrança?</li></ul>
<p>Evite elogio genérico, autobiografia longa e anexos na primeira abordagem. Um recrutador que cuida de outra unidade ou outro tipo de vaga talvez não tenha a informação. A resposta “não sou responsável por esse processo” é um dado para corrigir o canal, não motivo para insistir.</p>
<h2>Confirme quem está do outro lado</h2>
<p>Perfil com logotipo, cargo ou fotografia não prova identidade. Compare domínio do e-mail, página de carreiras, histórico público do perfil e canal informado no anúncio. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne orientações sobre perfis falsos, phishing, privacidade e autenticação. Não entregue código de acesso, senha, documento ou pagamento porque a conversa começou dentro de uma rede profissional.</p>
<h2>Defina o encerramento antes do envio</h2>
<p>Se houver resposta, agradeça e execute o próximo passo confirmado. Se não houver, registre uma única tentativa e volte aos canais oficiais. Uma segunda mensagem só faz sentido quando surgiu fato novo — por exemplo, a empresa corrigiu o link ou o prazo informado venceu. Arquive contatos sem relação com seu objetivo e não monte lista paralela de dados pessoais de recrutadores. O resultado útil é sair com canal verificado, orientação concreta ou decisão de não insistir.</p>
`.trim()
  },
  "acompanhar-candidatura-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Acompanhar uma candidatura significa ter informações organizadas, não enviar cobranças constantes. Com um registro simples, você sabe a qual anúncio respondeu, em qual data, qual etapa foi confirmada e quando é adequado verificar uma atualização.</p>
<h2>O que registrar em cada oportunidade</h2>
<ol><li><strong>Cargo e empresa:</strong> use o nome do anúncio original. Se for recrutamento confidencial, anote o portal e o identificador público.</li><li><strong>Canal:</strong> site da empresa, sistema de RH ou e-mail divulgado. Guarde o link, sem copiar senhas.</li><li><strong>Data:</strong> registre quando enviou o currículo e quando recebeu confirmação.</li><li><strong>Situação:</strong> enviada, recebida, entrevista marcada, em avaliação, encerrada ou contratada.</li><li><strong>Próximo passo:</strong> aguardar prazo informado, revisar documentos ou preparar entrevista.</li></ol>
<p>Abra a <a href="/ferramentas/controle-candidaturas">ferramenta de controle de candidaturas</a> e use o botão Baixar CSV antes de sair. Ela não exige conta e não envia os registros ao servidor. O arquivo é seu, então guarde-o em local privado.</p>
<h2>Quando pedir retorno</h2>
<p>Se o anúncio estabelece uma data, respeite esse prazo. Se não há previsão, uma pergunta educada depois de um intervalo razoável pode ser aceitável pelo canal de recrutamento divulgado. Não existe regra universal de número de dias: acompanhe o que foi comunicado pela empresa e não envie mensagens repetidas por várias redes.</p>
<blockquote><p>Olá, equipe de recrutamento. Participei do processo para [cargo] em [data], pelo canal [site/e-mail]. Gostaria de saber se existe previsão para atualização da etapa. Obrigado pela atenção.</p></blockquote>
<h2>Como interpretar o silêncio</h2>
<p>Não receber resposta não comprova falha do currículo. Pode haver prazo interno, encerramento de vaga ou volume alto de candidaturas. Seu registro ajuda a identificar padrões: quais canais enviam confirmação, quais cargos combinam com sua experiência e quais anúncios permanecem sem atualização. Ajuste uma variável de cada vez, sem inventar experiência no PDF.</p>
<p>A página oficial <a href="https://www.linkedin.com/help/linkedin/answer/a508716" target="_blank" rel="noopener noreferrer">O que esperar depois de se candidatar no LinkedIn</a> explica que o responsável pode analisar os dados enviados, mas a plataforma não garante resposta ou aprovação. Outros portais e empresas seguem processos próprios; use sempre o prazo e o canal informados no anúncio real.</p>
<p>Quando quiser continuar buscando por um serviço público, consulte <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a>. Uma nova candidatura deve ser compatível e identificável, não uma tentativa de compensar silêncio com disparos em massa.</p>
<p><strong>Segurança:</strong> não informe senha ou dados bancários para “liberar retorno”; suspeitas devem ser reportadas pelos canais oficiais. Veja <a href="/seguranca-candidatos">como reconhecer golpes de vaga</a>.</p>
<h2>Diferencie confirmação automática de avanço real</h2>
<p>“Recebemos seu currículo” confirma entrega, não leitura, entrevista ou aprovação. “Perfil visualizado” também não informa decisão. Registre o texto exato recebido e a data, sem converter evento técnico em etapa que a empresa não anunciou. Quando o portal mostra somente “em andamento”, procure no anúncio o prazo e o canal de suporte antes de concluir que houve atraso.</p>
<p>Crie três colunas separadas: <strong>última evidência</strong>, <strong>próxima ação</strong> e <strong>data de revisão</strong>. Exemplo: evidência “e-mail automático em 15/10”; ação “aguardar o prazo do anúncio”; revisão “22/10”. Assim, o controle orienta uma decisão e não vira uma lista que você precisa abrir a cada hora.</p>
<h2>Use uma regra de contato compatível com a origem</h2>
<p>Se a candidatura foi feita no portal da empresa, prefira o suporte ou contato publicado ali. Se ocorreu por e-mail, responda à conversa existente e preserve o assunto. Se o SINE fez o encaminhamento, consulte o sistema ou o posto responsável. Não localize um funcionário aleatório em outra rede apenas porque o canal original ainda não respondeu.</p>
<p>Antes de escrever, verifique quatro condições: o prazo terminou; você tem identificação da candidatura; o destinatário é responsável pelo processo; e a pergunta cabe em uma mensagem. Sem essas condições, adie o contato e continue a busca por oportunidades compatíveis.</p>
<h2>Faça uma revisão semanal do funil</h2>
<ul><li>Quantas candidaturas têm anúncio e URL preservados?</li><li>Quais receberam somente confirmação automática?</li><li>Quais avançaram para conversa ou entrevista?</li><li>Quais foram encerradas pelo responsável?</li><li>Quais precisam ser arquivadas por ausência de informação verificável?</li></ul>
<p>Compare períodos equivalentes, mas não invente taxa ideal. Um pequeno número de envios não permite concluir que determinado portal ou currículo “não funciona”. Procure padrões observáveis, como telefone incorreto, arquivos não abertos, requisitos essenciais ausentes ou candidaturas repetidas.</p>
<h2>Encerre e arquive com privacidade</h2>
<p>Quando o processo terminar, registre o desfecho informado e remova lembretes desnecessários. Guarde apenas dados úteis sobre a sua participação; não mantenha planilha com telefone pessoal do recrutador, nomes de outros candidatos ou documentos internos. Se o anúncio desaparecer, preserve a URL e uma nota curta sobre o que você enviou. Arquivar corretamente permite retomar a busca sem confundir silêncio, recusa e candidatura ainda dentro do prazo.</p>
`.trim()
  },
  "pesquisar-empresa-antes-entrevista": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Guia revisado em 14/10/2026.</strong> Pesquisar uma empresa antes de uma entrevista serve para descobrir o que ela faz, como a vaga se relaciona com a operação e se o convite veio de um canal confiável. Isso ajuda a preparar perguntas e reduz risco de fraude.</p>
<h2>Pesquisa em 15 minutos, sem adivinhar</h2>
<ol><li>Abra o site institucional e identifique produto, serviço, região de atuação e canal de carreiras.</li><li>Confirme se a empresa e o local do anúncio coincidem com o convite recebido.</li><li>Leia novamente as atribuições e separe duas atividades que você consegue demonstrar.</li><li>Se houver entrevista remota, confira plataforma, horário e domínio do convite.</li><li>Prepare duas perguntas específicas sobre rotina, equipe ou treinamento.</li></ol>
<h2>Exemplo: uma vaga de recepção</h2>
<p>O anúncio pede atendimento ao público e pacote Office. Na pesquisa, você identifica que o estabelecimento atende por agendamento. Em vez de repetir “sou organizado”, prepare um exemplo real de como controla horários, confirma informação e evita dupla marcação. Pergunte qual sistema é utilizado e se haverá treinamento inicial.</p>
<h2>Exemplo: uma vaga de estoque</h2>
<p>Uma distribuidora descreve conferência e separação. Investigue a diferença entre recebimento, inventário e expedição. Se já trabalhou com contagem de itens ou planilhas, descreva exatamente a tarefa. Se não conhece o sistema mencionado, diga o que sabe e como pretende aprender; inventar domínio costuma causar problemas quando começa o treinamento.</p>
<h2>O que a pesquisa não consegue garantir</h2>
<p>Site bem apresentado e avaliações em redes não garantem contratação nem boas condições trabalhistas. Comentários isolados também não comprovam problemas estruturais. Compare informações por data e origem, faça perguntas sobre escala e contrato e mantenha postura profissional.</p>
<p>Se receber pedido de pagamento para realizar a entrevista, interrompa o processo e verifique o anunciante. Para consultar oportunidades pelo sistema público, veja <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a>. O serviço não atesta uma empresa específica; é uma alternativa oficial de busca.</p>
<h2>Confirme quem está convidando você</h2>
<p>Compare o nome empresarial, o domínio do e-mail e o telefone com o site que você abriu por conta própria. O serviço <a href="https://www.gov.br/pt-br/servicos/consultar-cadastro-nacional-de-pessoas-juridicas" target="_blank" rel="noopener noreferrer">Consultar CNPJ da Receita Federal</a> permite conferir informações e a situação cadastral. A consulta ajuda a confirmar existência, cadastro e atividade declarada, mas não prova que a pessoa que mandou a mensagem representa a empresa nem que a vaga é legítima. Volte ao canal institucional e pergunte pelo processo sem usar o link recebido.</p>
<p>Guarde o anúncio, o endereço da página, a data e o nome informado pelo contato. Se a empresa usar consultoria de recrutamento, confirme as duas organizações e pergunte quem receberá os dados enviados. Uma mensagem com logotipo ou foto de perfil não substitui essa confirmação.</p>
<h2>Leve perguntas que testem a consistência da vaga</h2>
<ul><li>Qual é a razão social responsável pela contratação e qual será o local de trabalho?</li><li>A vaga é nova ou reposição? Quais tarefas ocupam a maior parte do turno?</li><li>Qual é a jornada, a escala e a etapa seguinte do processo?</li><li>Que documentos serão pedidos, em qual momento e por qual canal?</li></ul>
<p>Respostas objetivas não garantem contratação, mas permitem comparar convite, anúncio e contrato. Se a pessoa evita identificar o empregador, antecipa cobrança ou solicita senha, código de autenticação ou acesso ao aparelho, encerre o contato. O guia federal <a href="https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/sofri-um-golpe-e-agora" target="_blank" rel="noopener noreferrer">Sofri um golpe, e agora?</a> orienta a preservar provas, avisar instituições envolvidas e registrar a ocorrência pelos canais adequados.</p>
<h2>Transforme a pesquisa em preparação, não em roteiro decorado</h2>
<p>Anote três fatos com fonte e data: o que a organização oferece, onde atua e como a função contribui. Depois associe cada fato a uma pergunta ou experiência verdadeira. Se o site diz que o atendimento ocorre em unidades físicas, por exemplo, pergunte como a equipe divide recepção e registro; não afirme conhecer a operação interna. Avaliações públicas podem indicar temas para perguntar, mas não devem ser repetidas como fatos sem confirmação.</p>`.trim()
  },
  "seguro-desemprego-checklist-documentos": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial de 14/10/2026.</strong> O seguro-desemprego é uma assistência temporária e tem requisitos cumulativos. A dispensa, sozinha, não comprova direito, quantidade de parcelas ou valor. Este roteiro ajuda a organizar a solicitação de trabalhador formal pelos canais públicos; categorias como empregado doméstico, pescador artesanal e trabalhador resgatado têm regras próprias que devem ser consultadas no serviço correspondente.</p>
<h2>Antes do pedido: confira se os dados contam a mesma história</h2>
<p>Comece pelo <a href="https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego" target="_blank" rel="noopener noreferrer">serviço oficial de solicitação do Seguro-Desemprego</a>. Para trabalhador formal, a página informa, entre outras condições, dispensa involuntária sem justa causa, ausência de renda própria suficiente e períodos mínimos de salários que variam conforme seja a primeira, a segunda ou uma solicitação posterior. Em vez de aplicar uma regra ouvida de colega, identifique qual solicitação é a sua e leia os critérios atualizados no portal.</p>
<p>Compare nome, CPF, empregador e datas do desligamento nos documentos recebidos. Uma diferença de grafia ou data não deve ser “corrigida” por conta própria: registre o que diverge e peça orientação ao empregador ou ao atendimento oficial. A Carteira de Trabalho Digital ajuda a consultar vínculos, mas não substitui o Requerimento do Seguro-Desemprego.</p>
<h2>Checklist enxuto de documentos e registros</h2>
<ol><li><strong>CPF e conta gov.br pessoal:</strong> faça a autenticação você mesmo; senha e código de verificação não devem ser informados a terceiros.</li><li><strong>Requerimento do Seguro-Desemprego:</strong> o documento entregue pelo empregador contém dados necessários ao pedido. O portal oficial lista Requerimento e CPF entre os documentos básicos.</li><li><strong>Documentos do desligamento:</strong> mantenha as comunicações e comprovantes recebidos para conferir modalidade e datas.</li><li><strong>Histórico dos vínculos:</strong> anote qual empregador aparece em cada registro e preserve cópias legíveis.</li><li><strong>Protocolo:</strong> depois do envio, registre data, canal utilizado e número exibido, sem publicar esses dados.</li></ol>
<p>O pedido pode ser iniciado pelo portal gov.br ou pelo aplicativo Carteira de Trabalho Digital. A página oficial também indica atendimento pelo telefone 158 e unidades presenciais para quem precisa de auxílio. Use apenas os canais relacionados no serviço; um perfil de rede social ou um contato que cobra para “encaixar” o benefício não integra o procedimento público.</p>
<h2>Exemplo: vínculo recente e histórico anterior</h2>
<p>Imagine uma pessoa dispensada sem justa causa que vê dois empregadores no histórico. Ela não deve somar meses mentalmente e concluir que está habilitada. Primeiro identifica se é sua primeira, segunda ou solicitação posterior; depois compara os períodos exibidos com os critérios do portal. Se os dados estiverem corretos, envia o requerimento. Se houver divergência, guarda a tela e os documentos e procura o canal competente, sem criar datas ou alterar comprovantes.</p>
<h2>O que acompanhar após o envio</h2>
<p>No portal ou aplicativo oficial é possível consultar o andamento e, quando houver habilitação, informações sobre parcelas, valores e datas de liberação. “Em análise” não equivale a aprovação. Evite planejar pagamentos contando com um valor ainda não confirmado e não repasse captura de tela que exponha CPF, protocolo ou dados bancários.</p>
<h2>Indeferimento: leia o motivo antes de recorrer</h2>
<p>Se o pedido for negado, confira a justificativa apresentada e reúna apenas documentos relacionados a ela. O serviço <a href="https://www.gov.br/pt-br/servicos/cadastrar-recurso-relativo-ao-seguro-desemprego" target="_blank" rel="noopener noreferrer">Cadastrar Recurso relativo ao Seguro-Desemprego</a> informa que a revisão administrativa pode ser solicitada pelos canais oficiais e indica prazo de 120 dias contado da notificação. O próprio fluxo aponta os documentos necessários conforme o motivo; enviar arquivos aleatórios ou ilegíveis pode dificultar a análise.</p>
<p><strong>Segurança:</strong> não pague taxa para liberar parcela, não instale aplicativo enviado por mensagem e não compartilhe senha gov.br. Este guia é informativo e não decide direito individual. Para um caso concreto, use o atendimento do Ministério do Trabalho e Emprego indicado nas páginas oficiais.</p>`.trim()
  },
  "ctps-digital-carteira-trabalho-consultar": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisado em 14/10/2026.</strong> A Carteira de Trabalho Digital reúne informações da vida profissional e dá acesso a serviços trabalhistas. Ela é uma fonte útil para conferir vínculos e datas, mas não prova que uma mensagem de recrutamento seja verdadeira e não substitui a leitura do contrato, do contracheque ou do extrato do FGTS.</p>
<h2>Acesso seguro: comece na página pública</h2>
<p>Abra <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Obter a Carteira de Trabalho, no gov.br</a>. O serviço é gratuito, está disponível para quem possui CPF e usa autenticação da conta gov.br. A própria página aponta as opções para Android, iOS e acesso pela web. Confira o domínio antes de digitar credenciais e instale o aplicativo somente a partir dos links oficiais da loja.</p>
<ol><li>Entre com seu CPF no ambiente gov.br e conclua a autenticação sem ajuda de desconhecidos.</li><li>Abra a área de contratos ou vínculos indicada na versão atual do sistema.</li><li>Leia os campos exibidos para cada empregador e período.</li><li>Compare-os com proposta, contrato, comunicações formais e comprovantes que você guardou.</li><li>Anote uma divergência de cada vez, sem publicar tela com dados pessoais.</li></ol>
<p>O Ministério do Trabalho e Emprego mantém um <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho/passo-a-passo-da-carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">passo a passo da CTPS Digital</a>. Telas e nomes de menus podem mudar; por isso, um tutorial antigo de vídeo não deve prevalecer sobre a orientação atual do portal.</p>
<h2>Primeiro emprego: uma conferência que cabe no celular</h2>
<p>Depois de começar, compare o empregador exibido, a data de admissão e os demais campos disponíveis com o documento de contratação. Se algo não coincidir, descreva a diferença ao setor responsável: “no contrato recebi a data X; no aplicativo aparece Y”. Essa formulação é mais útil que afirmar genericamente que “a carteira está errada”. Não tente criar outro vínculo nem pagar alguém para alterar o registro.</p>
<p>Se o vínculo ainda não estiver visível, guarde contrato, mensagens do canal corporativo e comprovantes relacionados. A ausência momentânea não revela sozinha a causa. Procure o empregador e, se necessário, os canais oficiais indicados no serviço; a Central Alô Trabalho atende pelo número 158.</p>
<h2>Emprego anterior: como usar o histórico sem copiar erros</h2>
<p>Ao preparar o currículo, a CTPS pode ajudar a conferir nomes e períodos. Ela não descreve tudo o que você fez. Use as datas como referência e escreva somente atividades realmente exercidas. Se um nome empresarial for diferente da marca conhecida, não “corrija” para a marca sem verificar: razão social e nome de divulgação podem não ser iguais.</p>
<p>Também não é preciso enviar imagem integral da carteira junto com toda candidatura. Um anúncio pode solicitar dados compatíveis com a etapa, mas CPF, telas de vínculos e documentos não devem ser distribuídos sem necessidade e sem canal verificado. Veja nosso roteiro de <a href="/seguranca-candidatos">segurança para candidatos</a>.</p>
<h2>CTPS, contrato, FGTS e currículo têm funções distintas</h2>
<ul><li><strong>CTPS Digital:</strong> permite consultar registros e acessar serviços trabalhistas.</li><li><strong>Contrato ou documento de admissão:</strong> apresenta os termos fornecidos para aquela relação de trabalho.</li><li><strong>Extrato do FGTS:</strong> mostra contas e movimentações próprias do Fundo; deve ser consultado no canal oficial.</li><li><strong>Currículo:</strong> é seu resumo profissional e deve explicar atividades reais, não reproduzir dados sensíveis.</li></ul>
<p>Uma fonte complementa a outra. Ver o vínculo na carteira não confirma que todos os demais documentos estejam corretos, e receber um contrato não dispensa a conferência posterior dos registros.</p>
<h2>Proteja a conta gov.br</h2>
<p>Senha, código de autenticação e recuperação de conta são pessoais. Um recrutador legítimo não precisa entrar na sua conta para “validar” candidatura. Se receber link por WhatsApp ou e-mail, não use a mensagem como atalho: feche-a e abra diretamente o portal ou aplicativo oficial. Este site não consulta CTPS, não recebe senhas e não corrige registros.</p>`.trim()
  },
  "fgts-consultar-trabalhador-clt": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Atualizado em 15/10/2026.</strong> O extrato do FGTS permite acompanhar saldo, depósitos e movimentações das contas vinculadas. Consultá-lo ajuda a organizar dúvidas, mas não autoriza saque e não revela sozinho por que um lançamento esperado não aparece. O Empregos São Luís não acessa contas, não promete liberação e não recebe documentos financeiros.</p>
<h2>Entre pelo endereço oficial, sem atalho de mensagem</h2>
<p>A página do <a href="https://www.fgts.gov.br/Paginas/trabalhador/app-fgts.aspx" target="_blank" rel="noopener noreferrer">Aplicativo FGTS</a> informa que o app é gratuito e permite acompanhar depósitos e saldo. A página de <a href="https://www.fgts.gov.br/Paginas/subpaginas/outros-servicos-sub-extrato.aspx" target="_blank" rel="noopener noreferrer">consulta de extrato do FGTS</a> explica que o documento reúne entradas e movimentações. Use os links das lojas indicados pelo próprio Fundo e não instale arquivo enviado por número desconhecido.</p>
<p>Antes de abrir a consulta, separe uma lista simples: nome de cada empregador, período aproximado em que trabalhou e os documentos que já possui. Isso evita comparar uma conta com o vínculo errado. Não envie essa lista a perfis que oferecem “consulta completa” mediante pagamento.</p>
<h2>Leia por conta, vínculo e período</h2>
<ol><li><strong>Identifique a conta:</strong> relacione-a ao empregador exibido, sem presumir que duas contas sejam duplicidade.</li><li><strong>Defina o intervalo:</strong> compare as competências mostradas com o período em que o vínculo existiu.</li><li><strong>Leia a descrição:</strong> diferencie depósito, atualização e outras movimentações apresentadas no extrato.</li><li><strong>Registre a dúvida:</strong> anote empregador, competência e o que esperava encontrar. Evite frases vagas como “meu FGTS sumiu”.</li><li><strong>Guarde evidências:</strong> preserve contrato, contracheques e o próprio extrato em local privado.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma trabalhadora teve vínculo em uma loja e depois em uma distribuidora. Ao abrir o aplicativo, vê mais de uma conta. Em vez de somar tudo e concluir que houve erro, ela associa cada conta ao empregador, confere os períodos e anota somente as competências que precisam de esclarecimento. Contas distintas podem corresponder a vínculos distintos.</p>
<h2>Saldo disponível não é a mesma coisa que hipótese de saque</h2>
<p>O valor total exibido e o que pode ser movimentado em uma situação concreta são informações diferentes. As hipóteses de saque possuem regras próprias e podem depender de documentos e enquadramento. Consulte a modalidade dentro do canal oficial antes de contar com o dinheiro. Uma promessa de “liberação imediata” mediante Pix, taxa ou entrega de senha é sinal para interromper o contato.</p>
<h2>Como tratar uma divergência sem perder informação</h2>
<p>Primeiro, confirme se a dúvida se refere à conta e ao mês corretos. Depois, compare o extrato com o vínculo consultado na <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> e com os documentos guardados. Essa comparação não decide quem está certo; ela produz uma pergunta verificável.</p>
<p>Se a divergência permanecer, procure os canais oficiais indicados pelo FGTS. A página do extrato orienta que, quando houver dificuldade de acesso, o trabalhador pode buscar atendimento da Caixa com documentos pessoais. Leve apenas o necessário e confirme o endereço da unidade em canal oficial antes do deslocamento.</p>
<h2>O que não fazer em uma candidatura</h2>
<ul><li>Não entregue senha do app FGTS para recrutador, consultor ou perfil de vagas.</li><li>Não pague para comprovar que possui conta ou saldo.</li><li>Não envie extrato completo quando a etapa não exige informação financeira.</li><li>Não confunda a obrigação do empregador com uma cobrança ao candidato.</li><li>Não publique captura de tela com CPF, saldo, telefone ou dados bancários.</li></ul>
<p>O extrato é um documento de conferência pessoal. Se a questão envolver interpretação jurídica ou cobrança em um caso específico, busque o órgão competente ou orientação profissional. Este guia explica como organizar a verificação; não calcula depósitos nem conclui direito a saque.</p>
<h2>Faça uma conciliação por competência</h2>
<p>Crie uma tabela privada com empregador exibido, competência, vínculo correspondente, valor mostrado no extrato, documento usado na comparação e situação: “localizado”, “valor diferente”, “não localizado” ou “aguardando confirmação”. Não use saldo total para concluir que todos os meses foram depositados. Também não some contas de empregadores diferentes como se fossem um único vínculo.</p>
<p>O contracheque e a Carteira de Trabalho Digital ajudam a organizar período e remuneração informada, mas não substituem o extrato da conta vinculada. Preserve cada arquivo com data de obtenção e nome neutro. Não altere PDF, não recorte a identificação do vínculo na cópia de trabalho e mantenha os documentos fora de computador compartilhado.</p>
<h2>Diferencie ausência, atraso de processamento e leitura incompleta</h2>
<p>Se um lançamento não aparece, confira primeiro conta, competência, atualização da tela e intervalo consultado. Depois obtenha novo extrato pelo canal oficial e registre a data da verificação. Sem esses passos, não afirme que houve ausência de depósito nem aceite explicação informal como conclusão. O <a href="https://www.fgts.gov.br/Pages/trabalhador/canais-de-atendimento.aspx" target="_blank" rel="noopener noreferrer">FGTS reúne seus canais de atendimento oficiais</a>; use-os para confirmar como apresentar uma dúvida.</p>
<h2>Prepare um pedido que possa ser conferido</h2>
<p>Informe ao empregador ou canal oficial qual vínculo, competência e diferença você encontrou, anexando somente o documento necessário pelo meio confirmado. Peça protocolo e prazo de retorno. Se houver várias competências, envie uma tabela ordenada em vez de mensagens separadas. Para orientação trabalhista ou medida formal, procure o canal público ou profissional habilitado com o conjunto original de documentos; esta página não calcula débito nem prescreve ação.</p>
<h2>Proteja conta e extrato</h2>
<p>Senha gov.br, código de verificação e acesso ao aplicativo são pessoais. Nenhum recrutador precisa entrar em sua conta para conferir experiência. Desconfie de promessa de “regularização imediata”, saque garantido ou cobrança antecipada. Ao compartilhar um extrato com atendimento legítimo, confira destinatário, finalidade e campos estritamente necessários.</p>
`.trim()
  },
  "ler-contrato-trabalho-clt": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial de 14/10/2026.</strong> Ler o contrato antes de começar ajuda a transformar uma oferta vaga em perguntas verificáveis. O objetivo não é interpretar sozinho toda a legislação, e sim conferir quem contrata, qual trabalho foi combinado, onde será realizado e como as condições foram registradas.</p>
<h2>Não trate anúncio, conversa e contrato como se fossem iguais</h2>
<p>O anúncio apresenta uma oportunidade; a conversa com recrutamento esclarece detalhes; o documento entregue para assinatura registra termos. Compare os três. Se a vaga anunciava uma unidade em São Luís e o texto recebido menciona outro local, pare e pergunte. Se falava em remuneração fixa mais componente variável, identifique onde cada parte aparece e como será apurada. Não preencha lacunas com suposições.</p>
<h2>Primeira leitura: identifique as partes e o tipo de documento</h2>
<ol><li><strong>Contratante:</strong> confira nome empresarial e demais identificadores apresentados. Uma marca conhecida pode ter razão social diferente; peça confirmação em vez de alterar o texto.</li><li><strong>Trabalhador:</strong> revise seu nome e dados. Não compartilhe versão com informações pessoais em grupos ou redes.</li><li><strong>Início e duração:</strong> localize data de admissão e qualquer indicação de prazo ou experiência. Pergunte o que acontecerá ao fim do período indicado.</li><li><strong>Função:</strong> compare título e atividades com o anúncio. Termos amplos merecem exemplos concretos da rotina.</li><li><strong>Assinatura e versão:</strong> confirme se todas as páginas pertencem ao mesmo documento e guarde uma cópia do que efetivamente aceitou.</li></ol>
<h2>Segunda leitura: transforme condições em perguntas</h2>
<p><strong>Jornada e escala:</strong> quais dias e horários foram informados? Há intervalo? Como a escala será comunicada e onde serão registrados os horários? Se a oportunidade inclui finais de semana, pergunte qual é a organização prevista em vez de presumir uma escala.</p>
<p><strong>Remuneração:</strong> separe valor fixo, componentes variáveis e benefícios. Pergunte qual é o critério da parte variável, o período de apuração e onde a regra está documentada. “Comissão atrativa” não informa base, condição ou data.</p>
<p><strong>Local e deslocamento:</strong> identifique unidade principal, possibilidade de atuação em outro endereço e quem comunica mudanças. Para avaliar seu orçamento, use nossa <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a> com as tarifas que você mesmo informar; ela não define obrigação do empregador.</p>
<p><strong>Equipamentos e responsabilidades:</strong> confira o que será fornecido, o que ficará sob sua guarda e como a devolução foi descrita. Não aceite cobrança externa para comprar “kit de admissão” sem verificar empresa e documento.</p>
<h2>Exemplo: oferta com variável pouco definida</h2>
<p>Uma candidata recebe anúncio de atendimento com “salário + comissão”. No documento, encontra somente um valor, sem explicação da variável. A pergunta útil não é “a comissão está certa?”, mas: “este valor é a parte fixa? Qual documento registra a regra de apuração, as condições e o período de pagamento da parte variável?”. Ela guarda a resposta pelo canal corporativo e confere se haverá uma versão revisada do contrato.</p>
<h2>Exemplo: função e local não coincidem</h2>
<p>O anúncio mencionava auxiliar de estoque em uma unidade, mas o texto recebido usa outro cargo e prevê deslocamento sem esclarecer locais. Antes de assinar, o candidato pede uma descrição das tarefas e dos endereços possíveis. Isso não é recusar a vaga; é evitar que cada parte comece com uma interpretação diferente.</p>
<h2>Fontes oficiais ajudam, mas não resolvem o caso sozinhas</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">Consolidação das Leis do Trabalho (CLT)</a> reúne normas federais e alterações, mas sua leitura isolada pode não responder a uma situação individual. Instrumentos coletivos, atividade, modalidade e fatos do caso podem importar. Para consultar o registro do vínculo depois da admissão, acesse a <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>.</p>
<p>Se houver convenção ou acordo coletivo citado, peça a identificação exata do instrumento aplicável e onde consultá-lo. Se uma cláusula continuar incompreensível ou houver conflito relevante, procure o sindicato da categoria, o órgão competente ou orientação jurídica. Este portal não valida contratos.</p>
<h2>Antes de assinar ou enviar documentos</h2>
<ul><li>Confirme que o link e o remetente pertencem ao canal verificado da organização.</li><li>Leia a versão final, inclusive anexos; não presuma que o arquivo é idêntico ao anterior.</li><li>Não entregue senha, código gov.br ou dados bancários para “abrir” o contrato.</li><li>Não assine campos em branco e não aceite pressão para ignorar divergências materiais.</li><li>Salve a sua cópia com data e um nome que permita identificar a versão.</li></ul>
<p>Depois do início, compare o que foi registrado na CTPS Digital com os documentos guardados. Uma diferença deve ser descrita com precisão e levada ao canal responsável. Este roteiro organiza a conversa; não substitui análise profissional do caso concreto.</p>`.trim()
  },
  "curriculo-pdf-erros-triagem": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial de 15/10/2026.</strong> Salvar o currículo em PDF ajuda a preservar a apresentação, mas não corrige informação vaga, ordem confusa ou experiência inventada. Este roteiro trata o arquivo como uma peça de evidência: cada linha deve ajudar alguém a entender qual trabalho você procura, o que já fez e como entrar em contato.</p>

<h2>Defina o alvo antes de escolher o modelo</h2>
<p>Abra um anúncio real e separe três grupos: tarefas, requisitos obrigatórios e condições da vaga. Depois marque o que consegue comprovar. Se a vaga pede atendimento e uso de planilha, por exemplo, não basta escrever “sou proativo”. Informe onde atendeu, que tipo de registro fazia e qual ferramenta realmente utilizou. Um currículo pode ser curto e ainda assim específico.</p>
<p>Para conferir a nomenclatura e o conteúdo geral de uma ocupação, consulte a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a>. Use a CBO como referência de pesquisa, não como texto para copiar. A descrição de uma família ocupacional não prova que você exerceu todas aquelas atividades e não substitui os requisitos do anúncio.</p>

<h2>Monte uma ordem que funcione sem adivinhação</h2>
<ol>
  <li><strong>Cabeçalho:</strong> nome, cidade, telefone e e-mail acompanhados por você. Não é necessário expor endereço residencial completo.</li>
  <li><strong>Objetivo:</strong> um cargo ou uma área coerente com a vaga. Evite listar funções sem relação entre si.</li>
  <li><strong>Resumo opcional:</strong> duas ou três linhas com tempo ou contexto de experiência, tarefas centrais e ferramentas que realmente domina.</li>
  <li><strong>Experiências:</strong> empresa ou contexto, função, período e de duas a quatro atividades concretas.</li>
  <li><strong>Formação e cursos:</strong> instituição, nome e situação real — concluído, em andamento ou interrompido.</li>
  <li><strong>Informações adicionais:</strong> apenas dados relevantes, como disponibilidade de horário ou habilitação quando a vaga exigir.</li>
</ol>
<p>Se ainda não houve emprego formal, substitua a seção de experiência por evidências honestas: projeto de curso, atividade voluntária ou trabalho informal. Identifique o contexto. “Organizei lista de materiais e conferi entregas em atividade familiar” é mais útil do que mudar o nome da atividade para criar um cargo que não existiu.</p>

<h2>Transforme tarefas em descrições verificáveis</h2>
<p><strong>Frase vaga:</strong> “Boa comunicação e muita experiência em atividades administrativas.”</p>
<p><strong>Versão específica:</strong> “Atendimento telefônico, organização de agendas e atualização semanal de planilhas de controle.”</p>
<p>A segunda frase só deve ser usada por quem realizou essas tarefas. Quando houver resultado medido, explique de onde veio o número; quando não houver, descreva o processo sem inventar porcentagem. Também não copie palavras-chave escondidas ou atribuições que não conseguiria explicar em uma entrevista.</p>
<p>Faça o teste da pergunta seguinte: “como você fazia isso?”. Se não consegue responder com um exemplo, equipamento, documento ou rotina, a frase provavelmente está genérica demais ou não representa sua experiência.</p>

<h2>Teste o PDF como o recrutador pode recebê-lo</h2>
<ul>
  <li>Abra o arquivo no celular e no computador e verifique cortes, fonte pequena e páginas em branco.</li>
  <li>Selecione e copie o texto para um editor simples. A ordem copiada deve continuar compreensível; caixas, colunas e imagens podem embaralhar a leitura.</li>
  <li>Pesquise no PDF seu telefone, e-mail, cargo-alvo e uma tarefa principal. Se a busca não encontra texto, o documento pode ter sido exportado como imagem.</li>
  <li>Confira se links são opcionais e identificáveis. Um portfólio precisa abrir sem exigir acesso indevido à sua conta.</li>
  <li>Use um nome de arquivo claro, como <em>nome-sobrenome-cargo.pdf</em>, sem CPF ou data de nascimento.</li>
</ul>
<p>Esses testes reduzem erros de leitura, mas nenhum formato garante aprovação em sistemas de triagem. Se um anúncio fornecer modelo, campo obrigatório ou instrução de envio, siga a orientação daquela seleção.</p>

<h2>Crie uma versão por alvo, não uma história diferente</h2>
<p>Adaptar significa mudar a ênfase, não os fatos. Para uma vaga de auxiliar de estoque, experiências de conferência, organização e inventário podem aparecer primeiro. Para atendimento, destaque contato com público e registro de solicitações. Empresa, datas, formação e atividades realizadas permanecem verdadeiras nas duas versões.</p>
<p>Guarde uma cópia-base e nomeie as versões com cargo e data. Registre qual arquivo foi enviado a cada oportunidade na <a href="/ferramentas/controle-candidaturas">ferramenta gratuita de candidaturas</a>. Isso evita levar à entrevista uma versão diferente daquela recebida pela empresa.</p>

<h2>Proteja dados e confirme o canal</h2>
<p>CPF, RG, dados bancários, senha, código de autenticação e fotografia de documentos não pertencem ao currículo inicial. Se uma etapa posterior pedir documentação, confirme empresa, finalidade e canal por uma fonte independente. Não pague para “liberar” análise ou entrevista.</p>
<p>O serviço federal <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> explica os canais de cadastro, consulta e candidatura. Atualize formação e experiências com dados reais e consulte oportunidades no serviço ou no canal oficial indicado pelo empregador.</p>

<h2>Conferência final em sete minutos</h2>
<ol>
  <li>Compare objetivo e primeiras tarefas com o anúncio.</li>
  <li>Confirme datas, nomes de empresas e situação dos cursos.</li>
  <li>Leia telefone e e-mail caractere por caractere.</li>
  <li>Remova adjetivos que não estejam apoiados por um exemplo.</li>
  <li>Verifique ortografia e consistência dos títulos.</li>
  <li>Abra o PDF depois de exportar; não confie apenas no arquivo editável.</li>
  <li>Envie pelo canal confirmado e guarde a URL ou o anúncio.</li>
</ol>
<p><strong>Limite editorial:</strong> este guia não avalia currículo individual nem promete entrevista. Ele oferece um procedimento para reduzir erro, preservar a verdade profissional e facilitar a leitura.</p>
    `.trim()
  },
  "entrevista-comportamental-exemplos": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial de 15/10/2026.</strong> Perguntas comportamentais pedem episódios, não adjetivos. Em vez de afirmar “sou organizado”, o candidato descreve uma situação real, sua responsabilidade, a ação tomada e o que aconteceu. Os exemplos abaixo são exercícios ilustrativos: não devem ser apresentados como experiência própria.</p>

<h2>Monte um banco de evidências antes de decorar respostas</h2>
<p>Escolha quatro episódios que você conhece bem: uma prioridade difícil, uma colaboração, um erro corrigido e um atendimento ou entrega. Eles podem vir de emprego formal, estágio, curso, projeto, voluntariado ou atividade informal. Anote o contexto verdadeiro e deixe claro qual era o seu papel.</p>
<p>Compare as tarefas do anúncio com a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> para entender a família ocupacional. A vaga concreta, porém, define as tarefas e os requisitos daquela seleção. A CBO não autoriza criar experiência, ferramenta ou resultado.</p>

<h2>Use quatro partes para não se perder</h2>
<ol>
  <li><strong>Contexto:</strong> onde ocorreu e qual era a necessidade?</li>
  <li><strong>Responsabilidade:</strong> o que dependia de você, sem assumir o trabalho da equipe inteira?</li>
  <li><strong>Ação:</strong> quais passos tomou e quando pediu ajuda?</li>
  <li><strong>Desfecho:</strong> o que foi entregue, corrigido ou aprendido?</li>
</ol>
<p>Uma boa resposta pode reconhecer limite ou resultado parcial. Não é preciso transformar todo episódio em vitória extraordinária. Quando não existe número registrado, use um desfecho observável — pedido corrigido, fila organizada, informação conferida — sem inventar porcentagem.</p>

<h2>Exemplo de atendimento com limite de autorização</h2>
<p><strong>Pergunta:</strong> “Conte sobre uma pessoa insatisfeita que você atendeu.”</p>
<p><strong>Resposta ilustrativa:</strong> “Durante um atendimento, uma cliente contestou uma informação do pedido. Eu conferi o registro, expliquei o que constava no sistema e encaminhei a alteração ao responsável porque não tinha autorização para concluí-la. Depois passei a confirmar o número do pedido no início da conversa.”</p>
<p>O valor do exemplo está nos passos e no limite reconhecido. Se sua experiência foi escolar ou informal, diga isso. Não troque “ajudei em uma atividade” por “liderei uma equipe” apenas para a resposta parecer mais forte.</p>

<h2>Exemplo de logística ou estoque sem número inventado</h2>
<p><strong>Pergunta:</strong> “Como você lidou com um erro em uma tarefa?”</p>
<p><strong>Resposta ilustrativa:</strong> “Ao conferir materiais, percebi diferença entre a etiqueta e a lista. Separei o item, refiz a contagem e avisei a pessoa responsável antes de registrar a entrada. O documento foi corrigido, e passei a fazer a conferência por lote.”</p>
<p>Se o erro foi seu, explique como percebeu, comunicou e reduziu a chance de repetição. Culpar outra pessoa ou ocultar o problema impede o entrevistador de entender seu julgamento.</p>

<h2>Exemplo administrativo com prioridade concorrente</h2>
<p><strong>Pergunta:</strong> “Fale de um momento em que recebeu duas demandas urgentes.”</p>
<p><strong>Resposta ilustrativa:</strong> “Eu confirmei os prazos com quem solicitou, identifiquei qual entrega bloqueava o atendimento e alinhei a ordem. Finalizei primeiro a atualização necessária para o atendimento e informei o novo horário da segunda tarefa.”</p>
<p>Adapte somente se você já tomou decisão semelhante. Dizer que “fez tudo ao mesmo tempo” não explica critério, comunicação nem qualidade.</p>

<h2>Prepare respostas para quem busca o primeiro emprego</h2>
<p>Não ter vínculo formal não significa não ter episódios. Um trabalho em grupo pode demonstrar divisão de tarefas; uma atividade familiar pode mostrar conferência e atendimento; um curso pode oferecer exemplo de prazo e correção. Contextualize sem transformar colaboração pontual em emprego.</p>
<p><strong>Exemplo de estrutura:</strong> “No projeto final do curso, eu fiquei responsável pela planilha de materiais. Percebi itens duplicados, confirmei com o grupo e organizei uma versão única antes da apresentação. Aprendi a registrar a origem das alterações.” Use apenas detalhes compatíveis com a sua história.</p>

<h2>Responda sobre conflito sem expor terceiros</h2>
<p>Descreva comportamento e decisão, não rotule colegas ou antigos chefes. Troque “a pessoa era impossível” por “recebemos instruções diferentes e confirmei a prioridade por escrito”. Não revele dados de clientes, documentos internos ou informação confidencial para dar mais impacto ao relato.</p>
<p>Se a pergunta envolver falha séria ou situação sensível, seja breve e honesto. Você pode explicar que preservará informações confidenciais e ainda descrever como comunicou o problema ou buscou orientação.</p>

<h2>Conecte a resposta às condições da vaga</h2>
<p>Para oportunidade em São Luís, prepare perguntas sobre unidade, escala, horário e forma de comunicação das mudanças. Esses dados afetam deslocamento e disponibilidade. Não prometa presença em um turno que ainda precisa confirmar nem cite tarifa de transporte sem verificar o valor atual.</p>
<p>Se a entrevista for remota, teste som, câmera, conexão e nome exibido. Tenha o anúncio aberto e use um local em que consiga ouvir. Problema técnico não exige inventar desculpa: avise pelo canal confirmado e proponha retomada possível.</p>

<h2>Faça perguntas que ajudem a decidir</h2>
<ul>
  <li>Quais tarefas ocupam a maior parte da rotina?</li>
  <li>Como a equipe recebe orientação e feedback?</li>
  <li>Qual é a unidade e o horário previstos?</li>
  <li>Existe etapa prática e como ela será avaliada?</li>
  <li>Qual é o canal e o prazo estimado para retorno?</li>
</ul>
<p>Perguntar não garante contratação; ajuda a comparar o que foi anunciado com o trabalho real e a registrar condições que precisam ser confirmadas por escrito.</p>

<h2>Treino de vinte minutos e revisão posterior</h2>
<ol>
  <li>Escolha três perguntas ligadas ao anúncio.</li>
  <li>Conte cada episódio em até dois minutos, sem ler.</li>
  <li>Marque trechos vagos e substitua por ação observável.</li>
  <li>Retire números que não consegue demonstrar.</li>
  <li>Após a entrevista, registre perguntas, respostas e próximos passos na <a href="/ferramentas/controle-candidaturas">ferramenta de candidaturas</a>, sem dados pessoais do entrevistador.</li>
</ol>

<h2>Confirme identidade e proteja seus dados</h2>
<p>Se o convite chegar por mensagem, confirme empresa, vaga, endereço e canal por outra fonte. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne orientações sobre perfis falsos, phishing, privacidade e autenticação. Não compartilhe senha, código, acesso à conta gov.br nem pague por entrevista.</p>
<p><strong>Limite editorial:</strong> não existe resposta-modelo que garanta aprovação. O objetivo é organizar evidências verdadeiras, reconhecer limites e fazer perguntas que permitam avaliar a oportunidade.</p>
    `.trim()
  },
  "primeiro-emprego-sao-luis-checklist": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Guia revisado em 14/10/2026.</strong> O primeiro emprego exige comprovar disposição para aprender e capacidade de cumprir tarefas, não inventar experiência. Antes de sair enviando currículo, defina para quais funções você consegue demonstrar habilidades básicas.</p>
<h2>Primeira etapa: escolha três cargos possíveis</h2>
<p>Liste funções próximas de sua formação e rotina: atendimento, estoque, auxiliar administrativo, apoio de produção ou outras que apareçam em anúncios reais. Leia os requisitos obrigatórios de cada vaga. Um curso não substitui automaticamente experiência quando o anúncio a exige; também não desqualifica todo candidato iniciante quando ela é apenas desejável.</p>
<h2>Segunda etapa: monte provas simples de capacidade</h2>
<ol><li>Se deseja atendimento, prepare uma história verdadeira de organização ou resolução de dúvida.</li><li>Para escritório, demonstre uma planilha que você mesmo montou, sem dados de terceiros.</li><li>Para estoque, explique como faria uma contagem e reportaria divergência, sem fingir prática profissional.</li><li>Inclua cursos concluídos somente com nome e instituição corretos.</li><li>Confirme telefone, e-mail e disponibilidade antes de enviar.</li></ol>
<h2>Terceira etapa: encontre oportunidades confiáveis</h2>
<p>Use o <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> e páginas de carreiras de empresas. Confira cidade, horário, requisitos e validade. Publicação antiga em rede social não confirma processo ativo. Se o anúncio solicitar Pix ou taxa para concorrer, não prossiga.</p>
<h2>Quarta etapa: acompanhe sem ansiedade desnecessária</h2>
<p>Registre cargo, empresa, data e resposta recebida no <a href="/ferramentas/controle-candidaturas">controle gratuito</a>. Uma candidatura sem retorno não significa que seu esforço foi inútil; observe quais formatos de currículo e funções geram respostas reais antes de alterar tudo.</p>
<p><strong>Exemplo ilustrativo:</strong> alguém que mora no Cohatrac encontra vaga no outro lado da cidade com jornada cedo. Antes de enviar, precisa calcular tempo de viagem, custo e condições de transporte no horário. O salário do anúncio não revela sozinho se a oportunidade é viável.</p>
<p>Para documentação profissional, o serviço <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> orienta o acesso ao documento. Nunca forneça senha da sua conta gov.br a recrutadores.</p>
<h2>Separe vaga de entrada, aprendizagem e estágio</h2>
<p>Esses caminhos não são sinônimos. Aprendizagem profissional combina contrato de trabalho e formação técnico-profissional para o público que atende aos requisitos legais. A página oficial de <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/aprendizagem-profissional" target="_blank" rel="noopener noreferrer">Aprendizagem Profissional do Ministério do Trabalho e Emprego</a> reúne legislação, manuais e informações do programa. Estágio depende de matrícula e de um termo com instituição de ensino, enquanto uma vaga inicial comum pode exigir apenas os requisitos do anúncio. Leia a modalidade antes de adaptar o currículo.</p>
<p>Se você ainda estuda, registre turno, previsão de conclusão e disponibilidade sem prometer horário impossível. Se já concluiu, não mantenha “cursando” para parecer elegível a estágio. No caso de jovem aprendiz, não pague intermediário para inscrição e confirme a entidade formadora e o empregador pelos canais oficiais.</p>
<h2>Monte um currículo-base de uma página quando possível</h2>
<ul><li><strong>Cabeçalho:</strong> nome, São Luís ou município onde mora, telefone e e-mail profissional; não inclua CPF, RG ou endereço completo.</li><li><strong>Objetivo:</strong> um cargo ou área coerente com o anúncio, sem “qualquer oportunidade”.</li><li><strong>Formação:</strong> curso, instituição, situação e previsão de conclusão verdadeira.</li><li><strong>Projetos e atividades:</strong> contexto, tarefa e resultado observável, deixando claro quando não houve vínculo empregatício.</li><li><strong>Cursos:</strong> apenas os concluídos ou em andamento, com carga horária e instituição conferíveis.</li></ul>
<p>Um projeto escolar de controle de materiais pode demonstrar organização e planilha; não vira experiência profissional em estoque. Um trabalho voluntário com recepção pode provar comunicação; não deve ser apresentado como emprego formal. Essa distinção dá credibilidade na entrevista.</p>
<h2>Plano de sete dias sem candidatura em massa</h2>
<ol><li>Escolha até três cargos e leia cinco anúncios completos de cada um.</li><li>Marque requisitos obrigatórios, desejáveis, horário, local e canal.</li><li>Crie uma versão do currículo para cada cargo, reordenando apenas fatos verdadeiros.</li><li>Teste o PDF no celular e confira telefone e e-mail.</li><li>Envie somente para anúncios atuais e guarde a URL.</li><li>Prepare dois exemplos de tarefa, estudo ou projeto.</li><li>Revise respostas e incompatibilidades antes de repetir a busca.</li></ol>
<p>O objetivo não é completar um número diário. É produzir candidaturas que você consiga defender, com deslocamento possível e origem verificável. Se não houver retorno, compare os requisitos reais antes de adicionar palavras ao currículo ou pagar por curso.</p>`.trim()
  },
  "acidente-de-trabalho-o-que-fazer": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Um acidente durante o trabalho ou no trajeto precisa ser tratado primeiro como questão de saúde e segurança. Este guia organiza ações práticas, mas não determina se um caso específico gera benefício, estabilidade ou indenização. Essas conclusões dependem dos fatos, dos documentos e da análise do órgão ou profissional competente.</p>
<h2>Primeiro: interrompa o risco e procure atendimento</h2>
<p>Se houver perigo ativo, afaste-se quando isso puder ser feito com segurança e peça ajuda. Em situação urgente, priorize o serviço de emergência e as orientações da equipe de saúde. Não continue uma tarefa apenas para “terminar o turno” quando houver dor, sangramento, tontura, queda, queimadura, choque ou outra alteração relevante.</p>
<p>Informe ao atendimento como o evento aconteceu, quais partes do corpo foram afetadas e quais equipamentos estavam envolvidos. Não acrescente detalhes que não presenciou. Guarde receitas, relatórios, exames e orientações de retorno; esses documentos ajudam a acompanhar a saúde e a reconstruir a sequência do ocorrido.</p>
<h2>Registre o que você sabe, sem virar investigador</h2>
<ol><li>Anote data, horário, setor e atividade realizada.</li><li>Registre quem presenciou o fato, sem pressionar colegas a produzir uma versão.</li><li>Guarde comunicações enviadas à liderança, ao RH ou à área de segurança.</li><li>Fotografe o local ou equipamento apenas se isso for permitido e não criar novo risco.</li><li>Peça cópia de documentos que assinou e não confirme uma narrativa que não compreendeu.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma auxiliar de cozinha sofre queimadura ao movimentar uma panela. O registro útil descreve tarefa, horário, atendimento e comunicação. Ele não precisa atribuir culpa antes de uma apuração técnica.</p>
<h2>Entenda a Comunicação de Acidente de Trabalho</h2>
<p>O serviço federal <a href="https://www.gov.br/pt-br/servicos/registrar-comunicacao-de-acidente-de-trabalho-cat?id=9402&amp;origem=servico" target="_blank" rel="noopener noreferrer">Cadastrar Comunicação de Acidente de Trabalho (CAT)</a> explica quem pode registrar, os dados solicitados e o procedimento digital. A CAT é uma comunicação administrativa: emitir o documento não substitui atendimento médico nem decide sozinho todos os efeitos trabalhistas ou previdenciários.</p>
<p>Se a empresa informou que registrou a CAT, solicite o número ou uma cópia. O serviço <a href="https://www.gov.br/pt-br/servicos/consultar-comunicacao-de-acidente-de-trabalho-cat?id=9331&amp;origem=servico" target="_blank" rel="noopener noreferrer">Consultar CAT</a> orienta a consulta pelo canal oficial. Se houver recusa, atraso ou dúvida sobre quem pode registrar, use as instruções do serviço e procure orientação qualificada; não pague intermediário para “liberar” protocolo.</p>
<h2>Afastamento e retorno exigem documentos claros</h2>
<p>Siga as recomendações da equipe de saúde e entregue documentos pelo canal formal informado pela empresa. Antes de retornar, confirme se existe avaliação ocupacional, restrição ou adaptação indicada. Não prometa desempenhar atividade incompatível com a orientação médica apenas por medo de perder o posto.</p>
<p>Em São Luís, funções de limpeza, carga, cozinha, construção e atendimento externo podem envolver riscos muito diferentes. O nome do cargo não basta para avaliar o caso: importam a tarefa concreta, o ambiente, os equipamentos, o treinamento e o que ocorreu naquele dia.</p>
<h2>Checklist para as próximas 24 horas</h2>
<ul><li>Saúde atendida e orientações guardadas.</li><li>Liderança ou canal responsável avisado por meio rastreável.</li><li>Data, local, tarefa e testemunhas anotados.</li><li>CAT verificada no serviço oficial, quando aplicável.</li><li>Cópias de documentos preservadas fora do telefone corporativo.</li><li>Dúvidas individuais encaminhadas a órgão, sindicato ou profissional competente.</li></ul>
<h2>CAT, benefício e investigação são etapas diferentes</h2>
<p>A comunicação informa o evento à Previdência; ela não substitui diagnóstico médico, análise do INSS, investigação de segurança nem eventual discussão trabalhista. Da mesma forma, um atestado descreve afastamento ou condição clínica, mas não registra sozinho todas as circunstâncias do acidente. Mantenha cada documento com sua data e finalidade, sem editar imagem ou juntar versões contraditórias.</p>
<p>O <a href="https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-por-incapacidade" target="_blank" rel="noopener noreferrer">INSS reúne os serviços de benefícios por incapacidade</a> e os canais oficiais para requerimento e acompanhamento. Não conclua que haverá concessão apenas porque a CAT foi emitida. Confira requisitos e situação no serviço atual, e desconfie de quem cobra para “garantir” resultado.</p>
<h2>Como relatar sem perder precisão</h2>
<p>Escreva uma linha do tempo com verbos concretos: qual tarefa executava, qual evento ocorreu, o que sentiu, quem foi avisado e onde recebeu atendimento. Separe observação de conclusão. “O piso estava molhado quando escorreguei” descreve algo observado; “a empresa é culpada” é uma conclusão que exige apuração. Se corrigir informação, registre a correção e preserve a versão anterior.</p>
<p>Quando houver retorno ao trabalho, leve as orientações recebidas e pergunte como serão aplicadas eventuais restrições. Se sintomas piorarem, procure atendimento novamente. Este roteiro organiza evidências e cuidados; não recomenda automedicação, retorno antecipado ou assinatura de documento incompreendido.</p>
<p>Não publique prontuário, CPF ou fotos de lesão em redes abertas. Para reconhecer contatos falsos que tentam cobrar por benefício ou vaga, consulte também a página de <a href="/seguranca-candidatos">segurança do candidato</a>.</p>
`.trim()
  },
  "assedio-no-trabalho-o-que-fazer": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Violência e assédio no trabalho podem envolver humilhação, isolamento, ameaça, constrangimento sexual, perseguição ou outras condutas que afetam dignidade e segurança. Nem todo conflito ou cobrança profissional é assédio; por isso, é importante registrar fatos concretos e buscar orientação sem tentar fechar um diagnóstico jurídico sozinho.</p>
<h2>Descreva condutas, não rótulos</h2>
<p>Em vez de anotar apenas “meu chefe me assedia”, registre o que foi dito ou feito, em que dia, onde e diante de quem. Uma cobrança de prazo pode ser legítima; xingamentos, ameaças, exposição vexatória ou comentários sexualizados são fatos diferentes e precisam ser descritos com precisão.</p>
<p>O Ministério Público do Trabalho mantém as cartilhas oficiais <a href="https://mpt.mp.br/pgt/publicacoes?td=cartilhas" target="_blank" rel="noopener noreferrer">Violência e Assédio Moral no Trabalho</a> e <a href="https://mpt.mp.br/pgt/publicacoes?td=cartilhas" target="_blank" rel="noopener noreferrer">Violência e Assédio Sexual no Trabalho</a>. Consulte a edição e a data do material, porque conceitos e canais podem ser atualizados.</p>
<h2>Monte uma linha do tempo segura</h2>
<ol><li>Anote data, horário, local, participantes e palavras ou ações observáveis.</li><li>Preserve e-mails, mensagens, escalas ou documentos aos quais você tem acesso legítimo.</li><li>Não edite arquivos para “deixar mais claro”; mantenha o original e uma cópia.</li><li>Liste testemunhas sem combinar versões.</li><li>Guarde o material em conta pessoal protegida, respeitando sigilo de clientes e terceiros.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma atendente recebe comentários sobre o corpo em reuniões e mensagens privadas fora do expediente. A linha do tempo deve separar cada episódio e preservar o conteúdo original. Ela não deve expor colegas ou dados de clientes em uma postagem pública.</p>
<h2>Escolha o canal considerando sua segurança</h2>
<p>Se houver risco imediato, priorize sair do local e buscar apoio. Quando for seguro, verifique se a organização tem RH, ouvidoria, canal de ética, CIPA ou outro procedimento formal. Faça uma comunicação objetiva e guarde o protocolo. Um canal interno pode ajudar, mas não é a única alternativa e não deve ser usado de modo que aumente o risco para a pessoa afetada.</p>
<p>O <a href="https://mpt.mp.br/pgt/servicos/servico-denuncie" target="_blank" rel="noopener noreferrer">Serviço Denuncie do MPT</a> apresenta o encaminhamento por estado. A página pede informações para compreender a irregularidade; leia as orientações antes de enviar. Dependendo do caso, também podem ser relevantes sindicato, assistência jurídica, polícia, serviço de saúde ou outro órgão. Este guia não escolhe o canal por você.</p>
<h2>Prepare um relato que outra pessoa consiga compreender</h2>
<p>Organize uma página com episódios em ordem cronológica, pessoas presentes, documentos existentes e providências já tentadas. Separe o que você presenciou do que ouviu de terceiros. Se houver mensagens, preserve a conversa completa e o contexto, não apenas um recorte. Ao procurar um canal, pergunte como anexar arquivos, quem terá acesso e como receber o protocolo.</p>
<p><strong>Exemplo em São Luís:</strong> uma trabalhadora lotada em uma unidade recebe mensagens ofensivas do gestor da prestadora e também comunica o responsável do local. Ela registra qual pessoa recebeu cada aviso e qual foi a resposta, sem misturar empresas, datas ou relatos de colegas. Essa separação permite que sindicato, MPT ou assistência jurídica entendam o vínculo e orientem a via adequada.</p>
<h2>Cuide da saúde sem transformar sofrimento em prova pública</h2>
<p>Ansiedade, medo, insônia e queda de rendimento merecem atendimento. Procure suporte de saúde e alguém de confiança. Um relato público feito no momento de crise pode revelar dados pessoais, dificultar a proteção de provas e expor outras pessoas. Buscar ajuda não exige narrar tudo em uma rede social.</p>
<h2>Perguntas para organizar a decisão</h2>
<ul><li>Existe risco de ficar sozinho com a pessoa envolvida?</li><li>Quais fatos consigo datar e comprovar sem acessar conteúdo proibido?</li><li>Há um canal formal seguro e como obtenho protocolo?</li><li>Preciso de acompanhamento de saúde ou apoio emocional agora?</li><li>Qual órgão ou profissional pode analisar o meu caso individual?</li></ul>
<p>Não assine retratação, pedido de demissão ou declaração que não compreendeu. Peça cópia e tempo para orientação. Se o problema começou ainda no recrutamento, interrompa pedidos impróprios e consulte a página de <a href="/seguranca-candidatos">segurança para candidatos</a>.</p>
`.trim()
  },
  "atestado-medico-trabalho-como-entregar": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Um documento médico deve ser entregue de forma íntegra, legível e pelo canal correto. Não existe um único procedimento interno para todas as empresas. O trabalhador precisa separar o que consta da lei e das normas profissionais do que é prazo, sistema ou rotina administrativa do empregador.</p>
<h2>Antes de sair do atendimento</h2>
<p>Confira se o documento identifica o profissional e informa o período recomendado de afastamento ou comparecimento conforme o atendimento realizado. Não acrescente, apague ou corrija conteúdo por conta própria. Se houver erro, solicite correção ao profissional ou estabelecimento responsável.</p>
<p>A norma do Conselho Federal de Medicina sobre documentos médicos pode ser consultada no sistema oficial em <a href="https://sistemas.cfm.org.br/normas/visualizar/resolucoes/BR/2024/2381" target="_blank" rel="noopener noreferrer">Resolução CFM nº 2.381/2024</a>. Ela trata da emissão de documentos por médicos; o trabalhador não deve usar um resumo de internet como substituto da norma ou da orientação recebida.</p>
<h2>Descubra o canal sem expor sua saúde</h2>
<ol><li>Consulte regulamento, manual do empregado ou orientação do RH.</li><li>Confirme se o envio ocorre por sistema, e-mail corporativo ou entrega presencial.</li><li>Pergunte quem pode acessar o documento e como receberá confirmação.</li><li>Envie dentro do prazo informado quando isso for possível.</li><li>Se estiver hospitalizado ou impossibilitado, comunique a situação por canal disponível e regularize assim que puder.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma trabalhadora recebe alta à noite e o aplicativo interno não aceita o arquivo. Ela registra a tentativa, avisa o RH pelo e-mail oficial e pede orientação para reenviar no formato correto. Não manda o documento em grupo de mensagens com colegas.</p>
<h2>CID e dados de saúde exigem cuidado</h2>
<p>Diagnóstico, exame e histórico clínico são dados sensíveis. Não presuma que todo destinatário pode exigir ou compartilhar essas informações. Questões sobre CID, consentimento, validação e medicina ocupacional dependem da norma aplicável e do contexto. Se houver dúvida, pergunte ao profissional que emitiu o documento e ao canal formal da empresa, sem publicar o arquivo.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados Pessoais</a> classifica dados de saúde como sensíveis. Isso não elimina obrigações legítimas, mas reforça que coleta, uso e armazenamento precisam de finalidade e proteção adequadas.</p>
<h2>Guarde prova da entrega e acompanhe</h2>
<p>Mantenha uma cópia legível e o comprovante do envio. Se entregar em papel, peça protocolo ou recibo. Se enviar pelo sistema, salve a tela de confirmação. Se o documento for recusado, peça o motivo por escrito e não tente resolver alterando o arquivo.</p>
<p>Atestado, declaração de comparecimento e relatório médico não são documentos idênticos. Leia o título e o conteúdo que recebeu. A página oficial da <a href="https://www.planalto.gov.br/ccivil_03/leis/l0605.htm" target="_blank" rel="noopener noreferrer">Lei nº 605/1949</a> é uma das referências legais relacionadas à justificativa de ausências; regras complementares, instrumentos coletivos e situações particulares podem exigir análise própria.</p>
<h2>Se o documento for digital</h2>
<p>Guarde o arquivo recebido do estabelecimento, sem converter em imagem nem editar campos. Confira se o RH aceita aquele formato e se a confirmação mostra data e horário do envio. Um arquivo recusado pelo sistema não deve ser refeito por conta própria: preserve a mensagem de erro, informe o canal responsável e peça instrução escrita.</p>
<p>Quando outra pessoa precisar entregar o documento porque o trabalhador está internado ou sem acesso ao sistema, envie apenas o necessário e confirme quem foi autorizado a receber. Uma foto em grupo de mensagens aumenta a exposição e não substitui protocolo. Depois, verifique se o afastamento e o retorno aparecem de forma coerente nos registros internos, sem divulgar diagnóstico a colegas.</p>
<h2>Checklist de entrega responsável</h2>
<ul><li>Documento original conferido, sem alteração.</li><li>Canal e prazo confirmados no regulamento aplicável.</li><li>Somente destinatários necessários receberam o arquivo.</li><li>Comprovante de entrega guardado.</li><li>Rejeição ou falha de sistema registrada e comunicada.</li><li>Dúvida individual levada à medicina do trabalho, sindicato ou orientação competente.</li></ul>
<p>Não compre atestado e não compartilhe senha, CPF ou documento médico com perfis que prometem “abonar falta”. Suspeitas de fraude também podem colocar a própria pessoa em risco disciplinar e criminal.</p>
`.trim()
  },
  "banco-de-horas-direitos-trabalhador": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Banco de horas é uma forma de compensar variações de jornada; não é um saldo informal controlado apenas pela memória do supervisor. A validade, o prazo de compensação e a forma do acordo dependem da legislação e do instrumento aplicável ao vínculo.</p>
<h2>Comece identificando qual regra existe</h2>
<p>Pergunte ao RH se o regime decorre do contrato, de acordo individual, de acordo coletivo ou de convenção coletiva. Peça acesso ao texto e verifique a vigência. A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">Consolidação das Leis do Trabalho (CLT)</a> trata da jornada e das formas de compensação; leia a versão atualizada e não confie em tabela sem data.</p>
<p>Quando houver instrumento coletivo, consulte o serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>. Categoria, sindicato, empresa, território e período de vigência importam. Um acordo de outra empresa ou de outro estado pode não responder ao seu caso em São Luís.</p>
<h2>Leia o espelho de ponto junto com o saldo</h2>
<ol><li>Confira horários de entrada, saída e intervalos.</li><li>Compare alterações de escala com o que aparece no registro.</li><li>Identifique separadamente horas creditadas, compensadas e eventual saldo negativo.</li><li>Veja qual período de fechamento a empresa utiliza.</li><li>Peça correção de divergência por canal rastreável.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> um vendedor fica quarenta minutos além do horário em três dias de evento. O controle útil não é apenas somar os minutos: é verificar se foram registrados, em qual regime entraram e qual regra informa a compensação.</p>
<h2>Faça perguntas antes da data de pico</h2>
<p>Em comércio, hotelaria, alimentação e serviços, datas de maior movimento podem alterar escalas. Isso não prova que toda empresa usa banco de horas nem que qualquer compensação é válida. Antes do período, pergunte como a convocação será registrada, com que antecedência aparece a folga e onde consultar o saldo.</p>
<p>Evite combinar folga somente por mensagem informal. Se o sistema não refletir o acordo, peça regularização. Também não registre ponto por outra pessoa nem permita que façam isso em seu nome.</p>
<h2>Se o saldo não fecha</h2>
<p>Separe documentos do mesmo período: espelho de ponto, holerite, escala e extrato do banco. Faça uma pergunta objetiva, por exemplo: “No dia 8, o ponto registrou saída às 19h20, mas o extrato não mostra crédito. Qual regra foi aplicada?” Isso ajuda o RH a localizar a divergência sem transformar a conversa em cálculo improvisado.</p>
<p>Na saída do emprego, o tratamento do saldo depende da situação e da regra válida. Não presuma que todo saldo positivo ou negativo terá o mesmo resultado. Peça memória de cálculo e procure orientação individual se os documentos não coincidirem.</p>
<h2>Feche cada período com uma trilha de conferência</h2>
<p>Anote a data em que o ponto fecha e em que o saldo é atualizado. Se uma folga foi combinada, confira se o extrato mostra a compensação na mesma quantidade registrada. Guarde a resposta do RH junto do espelho correspondente; uma captura sem competência ou identificação não permite reconstruir a conta depois.</p>
<p><strong>Exemplo em São Luís:</strong> durante uma semana de evento, uma equipe altera horários em três dias. Cada trabalhador compara escala, marcações e extrato quando a folha fecha. Se houver diferença, informa as datas e pede qual cláusula ou acordo foi aplicado, em vez de somar todas as horas do mês sem distinguir jornada registrada, intervalo e compensação.</p>
<h2>Checklist mensal</h2>
<ul><li>Regra aplicável e vigência identificadas.</li><li>Espelho de ponto conferido antes do fechamento.</li><li>Saldo positivo e negativo compreendidos.</li><li>Compensações registradas com data.</li><li>Divergências comunicadas por escrito.</li><li>Documentos guardados fora do dispositivo corporativo.</li></ul>
<p>Este guia não calcula horas nem declara que um banco específico é válido ou inválido. Para entender também os lançamentos pagos, leia o guia de <a href="/blog/hora-extra-holerite-como-conferir">conferência de horas extras no holerite</a>.</p>
`.trim()
  },
  "convencao-coletiva-holerite-trabalhador": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Convenção coletiva e acordo coletivo podem estabelecer regras relevantes para remuneração, jornada, benefícios e procedimentos. O nome da empresa ou do cargo, sozinho, não identifica qual instrumento se aplica. É preciso conferir categoria, partes, abrangência territorial e período de vigência.</p>
<h2>Entenda a diferença prática</h2>
<p>De forma geral, a convenção é negociada entre entidades sindicais e o acordo envolve sindicato de trabalhadores e uma ou mais empresas. Essa distinção não resolve automaticamente qual texto vale para você. A fonte correta é o instrumento registrado e vigente, combinado com o vínculo concreto.</p>
<p>O Ministério do Trabalho e Emprego explica o registro de <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/mediacao/registro-de-convencoes-e-acordo-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">convenções e acordos coletivos</a> e informa que os documentos ficam disponíveis para consulta. Use também o serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>.</p>
<h2>Como localizar o documento certo</h2>
<ol><li>Identifique o CNPJ e a atividade principal do empregador.</li><li>Confirme sua função e a categoria informada nos documentos de admissão.</li><li>Pesquise estado, município, sindicatos e partes envolvidas.</li><li>Confira datas de início e fim da vigência.</li><li>Leia termos aditivos e instrumentos posteriores.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> duas recepcionistas trabalham em empresas diferentes em São Luís. O título do cargo é igual, mas uma atua em clínica e a outra em hotel. Não é seguro copiar o piso ou benefício encontrado para a primeira sem confirmar a categoria e o instrumento da segunda.</p>
<h2>Compare o texto com o holerite</h2>
<p>Separe salário-base, adicionais, descontos e benefícios. Procure no instrumento a cláusula correspondente e leia definições, datas e condições, não apenas o valor destacado. Uma cláusula pode ter exceções, faixas ou requisitos que mudam a comparação.</p>
<p>Compare também a data em que a cláusula começou a produzir efeitos com a competência do holerite. Um reajuste previsto para determinado mês não explica automaticamente uma folha anterior, e um PDF vigente hoje pode não ser o documento que alcançava o período questionado. Se houver mais de um arquivo, faça uma linha do tempo com instrumento, termo aditivo, vigência e competência conferida.</p>
<p>Se houver divergência, leve ao RH o holerite, a competência e a cláusula completa. Pergunte qual enquadramento foi usado. Se a resposta não esclarecer, procure o sindicato da categoria ou orientação profissional. Este portal não substitui essa análise.</p>
<h2>Registre a consulta de modo reproduzível</h2>
<p>Salve o PDF completo, o endereço oficial consultado e a data da pesquisa. No cabeçalho, confirme número de registro, entidades signatárias e abrangência. Não use apenas uma captura de tela de uma cláusula, pois ela omite definições e exceções próximas. Ao encaminhar uma dúvida, cite o título do documento, a cláusula, a página e a competência do holerite.</p>
<p><strong>Segundo exemplo:</strong> um auxiliar encontra dois documentos para a mesma categoria, um anterior e um termo aditivo posterior. Em vez de escolher o valor maior, ele confere se o aditivo altera aquela cláusula e desde quando. Se a busca oficial não esclarecer o enquadramento, apresenta os dois arquivos ao sindicato ou a profissional habilitado.</p>
<h2>Evite cinco erros comuns</h2>
<ul><li>Usar instrumento vencido porque o PDF aparece primeiro na busca.</li><li>Confundir proposta interna com direito coletivo registrado.</li><li>Aplicar convenção de outra categoria por semelhança de cargo.</li><li>Ignorar termo aditivo ou data-base.</li><li>Compartilhar recorte sem cabeçalho, vigência e partes.</li></ul>
<h2>Organize uma pasta mínima</h2>
<p>Guarde contrato, holerites, espelhos de ponto e o PDF do instrumento com o endereço e a data de consulta. Nomeie o arquivo com categoria e vigência. Assim, uma dúvida sobre piso, adicional ou benefício pode ser discutida com documento completo.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT atualizada</a> reúne normas gerais sobre negociação coletiva. A lei e o instrumento precisam ser lidos de forma coordenada; um resumo editorial não determina o resultado de um caso individual.</p>
`.trim()
  },
  "escala-6x1-o-que-perguntar": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> “6x1” descreve uma sequência de seis dias de trabalho e um de descanso, mas não informa sozinho a duração diária, os intervalos, a folga dominical, o trabalho em feriados ou o modo de compensação. Antes de aceitar uma vaga, transforme o nome da escala em horários concretos.</p>
<h2>Peça uma semana de exemplo</h2>
<p>Solicite ao recrutador ou RH um exemplo de segunda a domingo: hora de entrada, saída, intervalo e dia de descanso. Pergunte se a folga é fixa ou rotativa e com que antecedência a escala é divulgada. Uma resposta como “horário comercial, depois vemos a folga” não permite calcular deslocamento nem organizar cuidados familiares.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> reúne regras gerais sobre jornada e intervalos, e a <a href="https://www.planalto.gov.br/ccivil_03/leis/l0605.htm" target="_blank" rel="noopener noreferrer">Lei nº 605/1949</a> trata do repouso semanal e de feriados. Normas coletivas podem trazer condições específicas; verifique o instrumento aplicável.</p>
<h2>Sete perguntas antes do aceite</h2>
<ol><li>Qual é a carga horária diária e semanal prevista?</li><li>Quanto dura o intervalo e ele entra ou não na jornada?</li><li>Em qual dia costuma ocorrer o descanso e como funciona a rotação?</li><li>Como domingos e feriados são programados?</li><li>Existe banco de horas ou pagamento de horas extras?</li><li>Qual unidade é o local habitual e pode haver transferência entre lojas?</li><li>Quando a escala do mês ou da semana é entregue?</li></ol>
<h2>Teste o deslocamento no horário real</h2>
<p>Uma entrada às 6h ou saída após 22h pode exigir rota diferente daquela mostrada no meio da tarde. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com tarifas e viagens informadas por você. Considere também tempo de espera, iluminação do ponto e alternativas quando houver chuva ou atraso.</p>
<p><strong>Exemplo ilustrativo:</strong> a vaga fica em um shopping, mas o fechamento do setor acontece depois do último ônibus direto para o bairro do candidato. A pergunta correta não é apenas “aceita 6x1?”, e sim se o horário de saída e o transporte são viáveis em todos os dias da escala.</p>
<h2>Compare anúncio, proposta e contrato</h2>
<p>Guarde o anúncio e anote o que foi explicado na entrevista. Antes de assinar, confira se cargo, unidade, jornada, salário e benefícios correspondem à proposta. Se houver acordo ou convenção coletiva, consulte o documento no serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>.</p>
<h2>Monte um quadro de sete dias</h2>
<p>Crie uma linha para cada dia e colunas para entrada, saída, intervalo, unidade, transporte e observações. Some a duração somente depois de separar o intervalo e marque o descanso como um evento próprio. Esse quadro não decide se a escala é válida; ele revela perguntas que o rótulo “6x1” esconde, como mudança de unidade, fechamento tardio e folga móvel.</p>
<p><strong>Segundo exemplo:</strong> duas vagas anunciam a mesma escala. A primeira informa seis jornadas com horário estável e escala entregue antecipadamente. A segunda alterna abertura e fechamento, mas ainda não explica o intervalo nem a folga. A candidata não conclui que uma é regular e a outra não: pede os dados faltantes e compara a viabilidade prática antes de aceitar.</p>
<p>Depois da admissão, confronte semanalmente o quadro comunicado com o espelho de ponto. Trocas combinadas devem aparecer no registro correto. Se houver diferença, indique data, horário previsto, horário registrado e quem autorizou a mudança; isso é mais útil do que reclamar apenas que “a escala veio errada”.</p>
<h2>Sinais de que ainda faltam informações</h2>
<ul><li>A empresa não informa horário de entrada ou saída.</li><li>A folga depende apenas de aviso verbal no dia anterior.</li><li>O intervalo é descrito de forma contraditória.</li><li>Horas além da escala são tratadas como “ajuda” sem registro.</li><li>Unidade e deslocamentos entre locais não estão claros.</li></ul>
<p>Esses sinais não provam irregularidade, mas justificam pedir esclarecimento antes do aceite. Nenhum guia substitui a leitura do contrato ou a orientação sobre uma escala concreta. Registre a oportunidade no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> e compare alternativas com os mesmos critérios.</p>
`.trim()
  },
  "hora-extra-holerite-como-conferir": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Conferir hora extra exige comparar jornada registrada, regra aplicável e lançamentos do holerite. Um valor isolado não permite concluir se o pagamento está correto, porque podem existir banco de horas, períodos de fechamento, adicionais previstos em norma coletiva e outros componentes.</p>
<h2>Reúna documentos do mesmo período</h2>
<ol><li>Espelho de ponto ou registro de jornada.</li><li>Escala e alterações comunicadas.</li><li>Holerite da competência correspondente.</li><li>Contrato e política de banco de horas, se houver.</li><li>Acordo ou convenção coletiva vigente.</li></ol>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> reúne regras gerais sobre duração do trabalho, horas suplementares e compensação. A Constituição também prevê remuneração do serviço extraordinário; consulte o texto oficial e o instrumento da categoria em vez de usar calculadora sem contexto.</p>
<h2>Leia o espelho antes do holerite</h2>
<p>Marque os dias em que a saída, a entrada ou o intervalo diferem da escala. Verifique se houve correção manual e se você reconhece o motivo. Não some apenas “tempo dentro da empresa”: deslocamento, espera, intervalo e atividade efetiva podem ter tratamentos distintos conforme os fatos e a regra aplicável.</p>
<p><strong>Exemplo ilustrativo:</strong> o ponto de uma auxiliar mostra saída posterior em dois dias, mas o holerite fecha antes do fim do mês. Antes de afirmar que faltou pagamento, ela confirma o período de apuração e se as horas foram para banco. Se a explicação não aparecer nos documentos, pergunta ao RH por escrito.</p>
<h2>Localize as rubricas no demonstrativo</h2>
<p>Procure descrição, quantidade, referência e valor. Algumas folhas separam hora extra e reflexos; outras usam nomes internos. Não presuma o significado de uma sigla. Peça a legenda ou memória de cálculo e compare com o salário-base, a jornada contratual e o percentual previsto para o caso.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" target="_blank" rel="noopener noreferrer">Constituição Federal</a>, no artigo 7º, trata da remuneração do serviço extraordinário, e a CLT disciplina jornada, compensação e controle. Para conferir um caso real, esses textos precisam ser lidos com o contrato e o instrumento coletivo aplicável; a menção a um percentual geral não substitui a memória da folha.</p>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a> ajuda a localizar convenções e acordos registrados. Confirme partes e vigência antes de usar uma cláusula.</p>
<h2>Faça uma conciliação, não uma estimativa solta</h2>
<p>Monte uma tabela com data, jornada prevista, marcações, intervalo, motivo da extensão e destino informado: pagamento, compensação ou ajuste. Em outra coluna, registre a competência em que a rubrica apareceu. Isso evita comparar horas de um período de ponto com um holerite que usa fechamento diferente.</p>
<p><strong>Segundo exemplo:</strong> um trabalhador vê quatro horas no extrato do banco e duas no holerite. Antes de somar tudo como crédito não pago, ele confirma se são eventos distintos e solicita o intervalo exato de apuração de cada documento. Quando parte da jornada atravessa o período noturno, pede que a memória identifique separadamente as regras usadas, sem refazer o cálculo com uma fórmula genérica da internet.</p>
<h2>Como perguntar sem fazer acusação precipitada</h2>
<blockquote><p>Olá. No espelho de ponto da competência [mês], identifiquei os registros dos dias [datas]. Não localizei no holerite a rubrica correspondente nem a movimentação no banco de horas. Poderiam informar o período de fechamento e a regra aplicada?</p></blockquote>
<p>Anexe somente documentos necessários e use o canal oficial. Guarde protocolo e resposta. Se houver erro reconhecido, peça a previsão e a forma de correção.</p>
<h2>Não comprometa o próprio registro</h2>
<ul><li>Não bata ponto por colega.</li><li>Não altere captura de tela.</li><li>Não deixe de registrar saída por ordem apenas verbal sem pedir orientação formal.</li><li>Não publique holerite completo com CPF, matrícula ou dados bancários.</li><li>Não aceite cálculo de perfil desconhecido como decisão final.</li></ul>
<p>Se a divergência persistir, leve o conjunto de documentos ao sindicato, à inspeção do trabalho ou a profissional competente. Este guia ensina a conferir e formular perguntas; ele não calcula crédito trabalhista nem substitui perícia contábil.</p>
`.trim()
  },
  "pedido-demissao-aviso-previo-acerto": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Pedir demissão é encerrar o contrato por iniciativa do trabalhador. A decisão pode afetar aviso prévio, datas, descontos e verbas do acerto. Antes de entregar a carta, organize documentos e confirme as consequências para a sua situação; não use um modelo genérico como cálculo definitivo.</p>
<h2>Registre a decisão com clareza</h2>
<p>Faça uma comunicação datada, identificando a empresa e seu pedido. Guarde uma via com recebimento. Se quiser solicitar dispensa do cumprimento do aviso, escreva isso como pedido; não trate a dispensa como garantida. A resposta e o tratamento financeiro dependem do caso e da regra aplicável.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT atualizada</a> reúne as normas sobre aviso prévio e término do contrato. Leia o texto oficial e busque orientação antes de assinar acordo, quitação ou declaração que não compreendeu.</p>
<h2>Antes da carta, confira cinco pontos</h2>
<ol><li>Data em que pretende encerrar as atividades.</li><li>Se existe novo emprego confirmado ou apenas expectativa.</li><li>Saldo de férias, adiantamentos, banco de horas e benefícios.</li><li>Equipamentos, chaves, uniforme e documentos sob sua responsabilidade.</li><li>Endereço, telefone e conta informados para comunicações do acerto.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> um trabalhador recebe convite verbal para começar em outra empresa na semana seguinte. Antes de pedir demissão, confirma a proposta por escrito e pergunta ao empregador atual como será o aviso. Isso não elimina riscos, mas evita decidir com base apenas em promessa informal.</p>
<h2>Peça uma memória do acerto</h2>
<p>Confira período trabalhado, férias vencidas ou proporcionais quando aplicáveis, décimo terceiro proporcional, descontos e outros lançamentos. Não presuma que pedido de demissão tem os mesmos efeitos de dispensa sem justa causa. Se houver desconto de aviso, adiantamento ou equipamento, peça a base e o documento correspondente.</p>
<p>Use a <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> para acompanhar dados do vínculo, lembrando que atualizações podem depender dos registros enviados. Guarde termo de rescisão, comprovantes e holerites.</p>
<h2>Devolução e transição</h2>
<p>Liste bens da empresa e peça recibo de devolução com data e estado aparente. Transfira tarefas sem copiar base de clientes, documentos sigilosos ou arquivos que não lhe pertencem. Uma transição organizada protege ambas as partes e não exige abrir mão de questionar valores.</p>
<h2>Depois do último dia, confira os documentos</h2>
<p>Guarde a carta recebida, a resposta sobre o aviso, o termo apresentado e o comprovante de pagamento em uma pasta pessoal. Compare as datas entre esses arquivos e o último espelho de ponto. Consulte a Carteira de Trabalho Digital posteriormente para verificar o registro do vínculo, sem presumir que uma atualização instantânea seja garantida.</p>
<p>Se pedirem assinatura eletrônica, abra o documento completo, baixe uma cópia e verifique se a data e o motivo do desligamento correspondem ao que ocorreu. Senha gov.br e código de autenticação são pessoais; não entregue esses dados para alguém “concluir” a rescisão. Uma divergência deve ser questionada pelo canal oficial antes de aceitar explicações apenas verbais.</p>
<h2>Evite decisões sob pressão</h2>
<ul><li>Não assine pedido de demissão escrito por outra pessoa sem conferir se representa sua vontade.</li><li>Não entregue carta em branco ou sem data.</li><li>Não apague mensagens ou comprovantes necessários para entender o acerto.</li><li>Não publique acusações ou dados internos durante a negociação.</li><li>Não pague intermediário que promete “aumentar a rescisão”.</li></ul>
<h2>Quando buscar ajuda</h2>
<p>Se houver coação, doença, acidente, estabilidade, gravidez, afastamento, acordo especial ou divergência relevante, procure o sindicato, assistência jurídica ou profissional habilitado antes de concluir. Esses elementos podem mudar a análise.</p>
<p>Para organizar a mudança sem interromper sua busca, registre propostas reais no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>. O Empregos São Luís não recebe cartas de demissão nem calcula verbas rescisórias.</p>
<h2>Separe pedido de demissão de acordo entre as partes</h2>
<p>Pedido de demissão, dispensa sem justa causa e extinção por acordo não são nomes intercambiáveis. A extinção por acordo está prevista no artigo 484-A da CLT e exige concordância real das duas partes; não transforme uma conversa informal em “acordo” nem assine um motivo diferente do que ocorreu. Antes de decidir, peça que a empresa identifique por escrito qual forma de encerramento está propondo e quais parcelas serão usadas no demonstrativo.</p>
<p>Se você iniciou o desligamento, confira o artigo 487: a falta do aviso pelo empregado pode permitir o desconto dos salários correspondentes ao prazo. Isso não significa que todo desconto apresentado esteja automaticamente correto. Registre se o aviso seria trabalhado, se você pediu dispensa e qual resposta recebeu. Instrumento coletivo, estabilidade ou situação especial podem alterar a análise; consulte a norma da categoria no <a href="https://www3.mte.gov.br/sistemas/mediador/ConsultarInstColetivo" target="_blank" rel="noopener noreferrer">Sistema Mediador do MTE</a> e procure orientação quando houver dúvida.</p>
<h2>Monte uma linha do tempo do acerto</h2>
<p>Use quatro datas separadas: entrega da carta, início ou dispensa do aviso, último dia efetivamente trabalhado e data do pagamento. O artigo 477 da CLT prevê prazo de até dez dias corridos contados do término do contrato para entrega dos documentos que comprovem a comunicação da extinção e pagamento dos valores do instrumento rescisório. Conte somente depois de confirmar qual data encerrou o contrato; não use a data da carta como atalho.</p>
<ol><li>Guarde o comprovante de recebimento da carta.</li><li>Peça resposta escrita sobre cumprimento ou dispensa do aviso.</li><li>Compare último ponto, holerite e demonstrativo de cada parcela.</li><li>Registre data e meio do pagamento sem publicar dados bancários.</li><li>Questione divergências pelo canal oficial e preserve a resposta.</li></ol>
<p>Um demonstrativo legível deve separar a natureza e o valor das parcelas. Some os valores apenas depois de conferir bases e descontos; o portal não calcula rescisão individual. Se salário variável, férias, afastamento ou estabilidade tornarem a conta complexa, leve os documentos ao sindicato ou a profissional habilitado.</p>
`.trim()
  },
  "abono-pecuniario-ferias-holerite": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Abono pecuniário é a conversão em dinheiro de até um terço do período de férias a que o trabalhador tem direito. Não é a venda informal de dias decidida no corredor, nem significa trabalhar durante todas as férias. A escolha precisa ser documentada e comparada com a necessidade real de descanso.</p>
<h2>O que a CLT estabelece</h2>
<p>O artigo 143 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">Consolidação das Leis do Trabalho</a> permite ao empregado converter um terço do período de férias em abono. O pedido deve ser feito até quinze dias antes do fim do período aquisitivo. Em férias coletivas, a conversão depende de acordo coletivo, não de pedidos individuais isolados.</p>
<p>O artigo 145 prevê que a remuneração das férias e o abono solicitado sejam pagos até dois dias antes do início do descanso. Consulte sempre a versão atualizada da lei e o instrumento coletivo aplicável; este guia não calcula valores.</p>
<h2>Como decidir sem olhar apenas o dinheiro</h2>
<p>Primeiro confirme quantos dias de férias constam do aviso. Depois simule a rotina com menos dias de repouso. O abono pode ajudar em uma despesa planejada, mas não substitui a recuperação física e mental. Pressão da empresa para converter dias ou promessa verbal de pagamento são sinais para pedir esclarecimento formal.</p>
<p><strong>Exemplo ilustrativo:</strong> uma atendente recebe aviso de trinta dias de férias e avalia converter dez. Antes de decidir, verifica a data-limite do pedido, o período efetivo de descanso e como as rubricas aparecerão no recibo. Ela não assina documento retroativo nem trabalha nos dias registrados como férias.</p>
<h2>Documentos para conferir</h2>
<ol><li>Data de admissão e término do período aquisitivo.</li><li>Pedido de abono com data e comprovante de recebimento.</li><li>Aviso de férias com início e fim do descanso.</li><li>Recibo de férias e comprovante do pagamento.</li><li>Holerite da competência, observando rubricas separadas.</li></ol>
<h2>Separe cinco datas que costumam ser confundidas</h2>
<p>Anote o início e o fim do período aquisitivo, a data em que o pedido foi protocolado, o início do descanso e a data do pagamento. Acrescente a competência em que as rubricas aparecem. Essa linha do tempo permite verificar se aviso, recibo, depósito e holerite falam do mesmo ciclo, sem concluir pela regularidade ou pelo erro apenas pelo valor líquido.</p>
<p><strong>Segundo exemplo:</strong> um empregado encontra o pagamento antes das férias, mas a rubrica aparece em demonstrativo posterior. Ele guarda ambos, confere as datas e pergunta ao RH qual competência contábil foi usada. Não assina novo pedido retroativo para fazer os documentos coincidirem e não trabalha nos dias registrados como descanso.</p>
<p>Os nomes das rubricas variam entre sistemas. Peça ao RH a memória de cálculo quando não entender a separação entre remuneração de férias, adicional constitucional e abono. Não conclua que houve erro apenas porque a folha usa uma sigla interna.</p>
<h2>Perguntas objetivas ao RH</h2>
<ul><li>Qual é a data final para protocolar o pedido neste período?</li><li>Quantos dias de descanso e quantos dias de abono constarão do aviso?</li><li>Quando o pagamento será feito e onde ficará o recibo?</li><li>Existe férias coletiva ou regra prevista em instrumento coletivo?</li><li>Quem corrige divergência entre aviso, recibo e depósito?</li></ul>
<p>Quando houver referência a acordo ou convenção, use o serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a> e confirme partes, categoria, território e vigência. Um instrumento de outra empresa ou período não resolve a dúvida atual.</p>
<p>Guarde cópias fora do aparelho corporativo, sem divulgar CPF, conta bancária ou holerite completo. Se houver pressão, documento retroativo ou divergência persistente, procure sindicato, inspeção do trabalho ou orientação jurídica individual. Para entender o ciclo anterior ao pedido, leia também o guia sobre <a href="/blog/ferias-clt-periodo-aquisitivo">período aquisitivo de férias</a>.</p>
`.trim()
  },
  "ferias-clt-periodo-aquisitivo": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Período aquisitivo é o intervalo usado para formar o direito às férias; período concessivo é o prazo seguinte em que o empregador deve concedê-las. Saber essa diferença evita confundir aniversário do contrato com escolha automática da data de descanso.</p>
<h2>Localize o ciclo no seu vínculo</h2>
<p>O artigo 130 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> começa pela regra de que, após cada período de doze meses de vigência do contrato, o empregado adquire direito às férias. A própria lei trata de quantidade de dias, faltas injustificadas, concessão, comunicação e pagamento. Leia o texto atualizado e não use tabela sem fonte para decidir um caso individual.</p>
<p>A data de admissão ajuda a identificar o primeiro ciclo, mas afastamentos, faltas e outras situações podem alterar a análise. Confirme o histórico com RH e documentos antes de concluir que a empresa atrasou ou que determinado número de dias está garantido.</p>
<h2>O que perguntar na admissão</h2>
<ul><li>Como a empresa solicita preferências de data?</li><li>Com quanta antecedência comunica o período concedido?</li><li>Há férias coletivas em alguma unidade ou época?</li><li>Onde ficam o aviso, o recibo e o histórico de períodos?</li><li>Qual canal deve ser usado para corrigir datas divergentes?</li></ul>
<p>Essas perguntas organizam expectativa; não transformam a preferência do empregado em confirmação. A concessão segue a regra legal, o planejamento da empresa e, quando aplicável, instrumentos coletivos.</p>
<h2>Monte uma linha do tempo</h2>
<p><strong>Exemplo ilustrativo:</strong> uma pessoa admitida em 8 de agosto marca essa data como início do primeiro ciclo e registra cada documento recebido. Quando o sistema mostra outra data, ela não altera o cadastro por conta própria: envia ao RH o contrato, a tela e uma pergunta objetiva sobre a base usada.</p>
<ol><li>Anote admissão e eventuais interrupções relevantes.</li><li>Separe avisos de férias por período, sem misturar anos.</li><li>Confira início, fim e quantidade de dias no aviso.</li><li>Compare recibo e depósito antes do descanso.</li><li>Guarde confirmação de retorno e eventual alteração.</li></ol>
<h2>Férias coletivas e fracionamento</h2>
<p>A CLT possui regras próprias para férias coletivas e para divisão do período. Não presuma que uma prática de outra empresa se aplica ao seu vínculo. Se houver instrumento coletivo, localize o documento oficial no serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>, conferindo categoria, partes, território e vigência.</p>
<h2>Como separar planejamento de confirmação</h2>
<p>Pedido de preferência, conversa com a liderança e viagem pesquisada não equivalem ao aviso formal. Antes de assumir compromisso financeiro, verifique se as datas foram comunicadas no documento utilizado pela empresa. Se houver mudança, guarde a versão anterior e a nova, com a justificativa e a confirmação de recebimento.</p>
<p><strong>Exemplo em São Luís:</strong> uma empregada pretende viajar durante o período de chuvas menos intensas e informa sua preferência meses antes. Ao receber o aviso, descobre outra data. Ela compara o período aquisitivo e o documento formal, pergunta se existe alternativa e só compra passagem depois da resposta. O guia não presume que a preferência precise ser aceita.</p>
<h2>Se as datas não fecharem</h2>
<p>Peça por escrito a indicação do período aquisitivo, do período programado e do documento que sustenta eventual ajuste. Não assine aviso com data que não corresponde ao que recebeu sem pedir correção. Também não publique recibos com matrícula, CPF ou dados bancários.</p>
<p>Este guia não calcula indenização nem determina a validade de uma concessão. Em caso de atraso, afastamento, rescisão ou divergência relevante, leve contrato, avisos e recibos ao sindicato, à inspeção do trabalho ou a profissional habilitado. Se considerar converter parte do descanso, consulte o guia de <a href="/blog/abono-pecuniario-ferias-holerite">abono pecuniário</a> antes de protocolar o pedido.</p>

<h2>Confira comunicação, concessão e pagamento em documentos separados</h2>
<p>No texto consolidado consultado em 15 de outubro de 2026, o artigo 134 da CLT trata da concessão das férias nos doze meses seguintes à aquisição; o artigo 135 prevê comunicação escrita com antecedência mínima de trinta dias; e o artigo 145 trata do pagamento até dois dias antes do início. Use o <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">texto oficial compilado da CLT</a> e confirme se alterações posteriores afetam o caso.</p>
<p>Crie três linhas na sua pasta: aviso recebido, período efetivamente concedido e comprovante de pagamento. Não altere a data de recebimento para coincidir com o sistema. Se o documento chegou por portal, salve o arquivo e a confirmação de acesso; se veio em papel, peça sua via.</p>
<h2>Leia o fracionamento com os requisitos completos</h2>
<p>A CLT permite, com concordância do empregado, fracionar as férias em até três períodos; um deles não pode ser inferior a quatorze dias corridos e os demais não podem ser inferiores a cinco dias corridos cada. Não use apenas a frase “pode dividir em três” sem conferir a concordância e os tamanhos dos períodos. Férias coletivas seguem regras próprias.</p>
<p>Exemplo: antes de aceitar duas ou três datas, escreva cada intervalo, conte dias corridos e confirme a qual período aquisitivo pertencem. Se o sistema mistura saldo, abono ou outro ciclo, peça demonstrativo em vez de reconstruir o cálculo por suposição.</p>
<h2>Monte um dossiê mínimo para divergências</h2>
<ul><li>contrato ou registro da admissão;</li><li>histórico de afastamentos relevante, quando houver;</li><li>avisos e alterações de férias;</li><li>recibos e comprovantes de pagamento;</li><li>instrumento coletivo aplicável, se existir;</li><li>pergunta objetiva enviada ao RH e resposta recebida.</li></ul>
<p>O conjunto ajuda a localizar o problema, mas não substitui cálculo profissional. Em atraso, rescisão, afastamento ou divergência persistente, procure sindicato, Inspeção do Trabalho ou profissional habilitado antes de concluir valor, penalidade ou medida cabível.</p>
    `.trim()
  },
  "periodo-experiencia-clt-o-que-saber": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Contrato de experiência é um contrato por prazo determinado usado para que empresa e trabalhador avaliem a relação. Ele não cria um período sem registro, sem salário ou sem regras. As condições essenciais precisam estar claras desde o início.</p>
<h2>Limite legal e documento</h2>
<p>O parágrafo único do artigo 445 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> determina que o contrato de experiência não pode exceder noventa dias. O documento deve permitir identificar início, término e condições pactuadas. Prazo menor pode existir; o limite de noventa dias não autoriza renovações indefinidas.</p>
<p>Não aceite “alguns dias de teste” trabalhando normalmente sem registro e sem definição de pagamento. Processo seletivo, prova prática e contrato de trabalho não são a mesma coisa; quando houver prestação de trabalho real, procure orientação se o vínculo estiver disfarçado.</p>
<h2>Checklist antes de assinar</h2>
<ol><li>Leia datas de início e término e peça uma via.</li><li>Confira cargo, unidade, jornada, intervalo, salário e benefícios.</li><li>Pergunte como será comunicada eventual prorrogação dentro do limite legal.</li><li>Entenda quais tarefas e critérios serão observados.</li><li>Confirme o canal para ponto, atestado, segurança e dúvidas.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma auxiliar recebe contrato de quarenta e cinco dias, com possibilidade de prorrogação. Ela anota a data final, guarda a via assinada e pede que qualquer extensão seja formalizada antes do vencimento. Não se orienta apenas por “depois o RH renova”.</p>
<h2>A empresa também está sendo avaliada</h2>
<p>Observe se a escala corresponde à proposta, se há treinamento para tarefas e equipamentos, se o ponto registra a jornada efetiva e se pagamentos e benefícios chegam como combinado. Registre dúvidas por canal oficial. Cobrar clareza não significa recusar avaliação de desempenho.</p>
<h2>Crie uma linha do tempo do contrato</h2>
<p>Registre em uma página a data de admissão, o prazo inicial, a data-limite informada para eventual prorrogação e o término previsto. Anexe a via original e qualquer aditivo, sem substituir um arquivo pelo outro. O artigo 451 da CLT trata da prorrogação de contrato por prazo determinado; isso reforça a importância de não aceitar extensões sucessivas apenas por mensagem ou documento sem data.</p>
<p><strong>Segundo exemplo:</strong> um contrato começa com trinta dias e o RH apresenta um aditivo antes do vencimento. O trabalhador lê a nova data, verifica se a soma permanece dentro do limite aplicável e guarda a via. Se o documento chegar depois do prazo ou trouxer data retroativa, ele pede esclarecimento antes de assinar e busca orientação individual.</p>
<h2>Use critérios concretos na avaliação</h2>
<p>Peça ao gestor exemplos do desempenho esperado: tarefas, padrões de qualidade, segurança, frequência e treinamento. Anote feedbacks com data e ação combinada. Isso torna o período útil para as duas partes e evita que a única conversa sobre desempenho ocorra no último dia. Não copie dados de clientes nem materiais internos para produzir prova; preserve apenas documentos que legitimamente dizem respeito ao próprio vínculo.</p>
<p>Acompanhe o vínculo na <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>, lembrando que a atualização depende das informações transmitidas pelo empregador e pode não ser instantânea. Divergência deve ser comunicada com documentos, não corrigida por aplicativos de terceiros.</p>
<h2>No encerramento</h2>
<p>O término na data prevista, a saída antecipada e a continuidade após o prazo podem produzir efeitos diferentes. Não aplique uma tabela genérica para calcular verbas. Peça termo, recibos, comprovantes e explicação das rubricas. Se houver cláusula sobre rescisão antecipada, leia antes de decidir sair.</p>
<ul><li>Não pague taxa para “efetivação”.</li><li>Não entregue senha da conta gov.br.</li><li>Não assine documento em branco ou retroativo.</li><li>Não devolva uniforme ou equipamento sem recibo.</li><li>Não presuma que o silêncio significa prorrogação.</li></ul>
<p>Se o prazo ultrapassar noventa dias, os documentos não coincidirem ou houver trabalho sem registro, procure sindicato, inspeção do trabalho ou orientação jurídica. Para conferir a rotina já iniciada, use também o guia de <a href="/blog/ponto-eletronico-atraso-trabalho">registro de ponto</a>.</p>
`.trim()
  },
  "ponto-eletronico-atraso-trabalho": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Registro de ponto deve refletir a jornada realmente cumprida. Atraso, falha de equipamento e ajuste manual são situações diferentes. Pedir que um colega registre por você ou alterar horário para “fechar a folha” transforma uma dúvida simples em problema de confiabilidade.</p>
<h2>O que a CLT diz sobre pequenas variações</h2>
<p>O artigo 58, §1º, da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> estabelece que variações de até cinco minutos em cada marcação, observado o máximo de dez minutos diários, não são descontadas nem computadas como jornada extraordinária. Isso não é autorização para atrasar todos os dias: trata-se do tratamento da marcação para cálculo da jornada, enquanto assiduidade e disciplina seguem regras próprias e proporcionais.</p>
<p>O artigo 74 determina registro de entrada e saída para estabelecimentos com mais de vinte trabalhadores. A marcação por exceção depende de acordo individual escrito, convenção ou acordo coletivo. O empregado deve saber qual sistema se aplica, sem assumir que toda empresa usa relógio eletrônico.</p>
<p>O Ministério do Trabalho e Emprego reúne as regras técnicas na <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2021/portaria-mtp-no-671-de-8-de-novembro-de-2021-atualizada" target="_blank" rel="noopener noreferrer">Portaria MTP nº 671/2021 atualizada</a>. Ela diferencia modalidades de registrador e requisitos do controle eletrônico. Para o trabalhador, o passo prático é identificar qual sistema a empresa declarou usar, como obter o comprovante e onde solicitar correção.</p>
<h2>Quando o equipamento falha</h2>
<ol><li>Registre a tentativa ou a mensagem de erro sem manipular a tela.</li><li>Avise imediatamente o canal indicado pelo RH.</li><li>Informe horário real e motivo do ajuste.</li><li>Confira o espelho antes do fechamento.</li><li>Guarde protocolo e resposta.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> ao chegar para a abertura de uma loja, a funcionária encontra o terminal fora do ar. Ela fotografa apenas a mensagem do equipamento, sem dados de colegas, avisa a liderança e solicita ajuste com o horário efetivo. Não pede ao próximo turno que bata o ponto em seu lugar.</p>
<h2>Planeje o deslocamento sem inventar justificativa</h2>
<p>Chuva, obras e mudança de linha podem afetar o trajeto em São Luís, mas o mapa consultado fora do horário da escala não mede toda a rotina. Teste o caminho no período real, identifique alternativa e avise assim que perceber que não chegará no horário. Uma justificativa pode explicar o fato; não apaga automaticamente o registro.</p>
<p>Use a <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a> com tarifas informadas por você e separe custo de tempo. Para escala noturna, confirme transporte e segurança antes do aceite.</p>
<h2>Como contestar um espelho</h2>
<p>Indique data, marcação exibida, horário que você afirma ter cumprido e documento de apoio. Evite acusação genérica. Uma mensagem objetiva permite localizar o evento: “No dia 14, o sistema mostra saída às 18h, mas permaneci até 18h35 por solicitação registrada no chamado X. Como solicito a correção?”</p>
<p>Revise o espelho antes do fechamento, não apenas quando o holerite chegar. Se o aplicativo permitir exportação, preserve o arquivo original com competência e data. Em relógio físico, guarde comprovantes sem fotografar marcações de colegas. Correção autorizada deve manter uma trilha identificável; não aceite orientação para registrar horário diferente do efetivamente trabalhado.</p>
<ul><li>Não assine espelho que não conferiu.</li><li>Não compartilhe senha ou biometria.</li><li>Não registre jornada de outra pessoa.</li><li>Não apague comprovantes após a correção.</li><li>Não publique tela com nomes e matrículas de colegas.</li></ul>
<p>Se ajustes são recorrentes, negados sem explicação ou não correspondem à jornada, reúna espelhos, escalas e holerites e procure RH, sindicato, inspeção do trabalho ou orientação jurídica. O guia de <a href="/blog/hora-extra-holerite-como-conferir">horas extras no holerite</a> ajuda a comparar documentos do mesmo período.</p>

<h2>Identifique o sistema e preserve o comprovante</h2>
<p>Antes de discutir cálculo, descubra se a empresa usa registro manual, mecânico ou eletrônico e qual procedimento formal existe para correção. Nos sistemas abrangidos pela Portaria MTP nº 671/2021, peça acesso ao comprovante ou espelho disponibilizado ao trabalhador e guarde a versão recebida. Captura isolada de tela não substitui o registro oficial, mas ajuda a documentar quando e como a dúvida surgiu.</p>
<h2>Separe marcação, intervalo e justificativa</h2>
<p>Entrada, saída e intervalos descrevem momentos diferentes. Atestado, autorização de gestor ou falha do relógio pode explicar uma ocorrência, mas não deve apagar horário efetivamente trabalhado. Anote data, marcação exibida, horário que você entende correto, motivo e documento relacionado. Não preencha horário “padrão” se ele não corresponde ao ocorrido.</p>
<h2>Peça correção com uma linha do tempo objetiva</h2>
<ol><li>registre a divergência assim que perceber;</li><li>use o canal definido pela empresa e guarde protocolo;</li><li>informe marcação, data e correção solicitada;</li><li>confira a resposta no espelho seguinte;</li><li>se o problema repetir, reúna os episódios sem alterar arquivos originais.</li></ol>
<p>Exemplo: “No dia 14, o sistema exibiu entrada às 8h32. Meu comprovante mostra 8h02. Solicito conferência e orientação sobre o ajuste.” Evite acusação que não consegue provar e não entregue senha ou cartão a colega.</p>
<h2>Consulte também a regra coletiva aplicável</h2>
<p>Jornada, banco de horas e marcação por exceção podem envolver acordo individual escrito, acordo coletivo ou convenção, conforme o tema. Confirme sindicato, categoria e vigência do instrumento antes de citar uma cláusula. Se desconto, repetição de erro ou recusa de acesso ao registro persistir, procure orientação qualificada com documentos organizados; o guia não determina sozinho a solução jurídica.</p>
`.trim()
  },
  "trabalhador-terceirizado-direitos": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Na terceirização, a empresa prestadora contrata e remunera os trabalhadores; a contratante recebe o serviço definido em contrato. Trabalhar dentro da unidade da contratante ou usar crachá de acesso não muda sozinho quem é o empregador formal.</p>
<h2>Identifique as duas empresas</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l6019.htm" target="_blank" rel="noopener noreferrer">Lei nº 6.019/1974</a> define a empresa prestadora e a contratante. O contrato de trabalho, o registro na Carteira de Trabalho Digital e o holerite devem ajudar a identificar a prestadora. A contratante não pode utilizar os trabalhadores em atividades diferentes das que foram objeto do contrato de prestação.</p>
<p>Anote razão social, CNPJ, endereço e canais de RH da prestadora, além do responsável operacional no local da contratante. Nomes de fantasia parecidos e uniformes não bastam para localizar quem assina documentos.</p>
<h2>Responsabilidades que precisam estar claras</h2>
<p>A lei atribui à contratante a responsabilidade por garantir condições de segurança, higiene e salubridade quando o trabalho é realizado em suas dependências ou em local previamente convencionado. Ela também prevê responsabilidade subsidiária pelas obrigações trabalhistas referentes ao período da prestação. Esses termos têm aplicação jurídica própria; diante de inadimplemento, não escolha sozinho quem processar ou como cobrar.</p>
<p><strong>Exemplo ilustrativo:</strong> uma auxiliar de limpeza presta serviço em um hospital de São Luís. O holerite é emitido pela prestadora, mas o local deve oferecer condições seguras para a atividade. Se falta equipamento ou treinamento, ela comunica imediatamente os responsáveis indicados pelas duas empresas e guarda protocolos.</p>
<h2>Perguntas antes de iniciar</h2>
<ul><li>Qual empresa assinará o contrato e fará os pagamentos?</li><li>Quem recebe atestado, pedido de férias e dúvida sobre holerite?</li><li>Quem orienta tarefas, acesso e segurança no posto?</li><li>O trabalho ocorrerá em uma ou mais unidades?</li><li>Como será comunicada troca de posto ou de horário?</li><li>Qual canal usar se a prestadora não responder?</li></ul>
<h2>Guarde documentos por empresa e período</h2>
<p>Separe contrato, holerites, ponto, escalas, avisos, treinamentos, recibos de equipamentos e mensagens oficiais. Ao relatar problema, diga qual empresa, posto, data e tarefa estão envolvidos. Não envie prontuário, dados de clientes ou documento sigiloso da contratante para provar a presença no local.</p>
<p>Acompanhe o vínculo no serviço oficial da <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. Desconfie de cobrança para liberar uniforme, vaga ou cadastro e não compartilhe senha gov.br.</p>
<h2>Quando houver troca de prestadora</h2>
<p>Uma mudança anunciada no posto não explica automaticamente o que acontecerá com o contrato atual. Peça comunicação formal sobre data, rescisão, devolução de materiais e eventual novo processo de admissão. Não assine pedido de demissão ou documento em branco para “facilitar a troca”.</p>
<p>Separe o encerramento do vínculo atual de uma possível contratação futura. Confirme quem receberá uniforme e crachá, quem entregará documentos rescisórios e se existe proposta escrita da nova prestadora. Continuidade no mesmo posto não autoriza presumir continuidade do mesmo contrato, manutenção de benefícios ou aproveitamento automático do saldo anterior.</p>
<p>Ao consultar a Carteira de Trabalho Digital, compare razão social e datas com o contrato e o holerite. Se aparecer empresa desconhecida ou informação divergente, registre a tela sem expor senha e peça esclarecimento à prestadora. Para problema de segurança no local, comunique também o canal definido pela contratante, registrando qual empresa recebeu cada aviso.</p>
<p>Atraso de salário, falta de segurança, rescisão ou continuidade do serviço exigem análise dos fatos e contratos. Leve documentos ao sindicato, à inspeção do trabalho ou a profissional habilitado. Este guia organiza perguntas; não determina responsabilidade em um caso concreto.</p>

<h2>Não confunda terceirização com trabalho temporário</h2>
<p>A mesma Lei nº 6.019/1974 trata de modalidades diferentes. Trabalho temporário atende necessidade transitória prevista em lei e envolve empresa de trabalho temporário; prestação de serviços a terceiros segue contrato entre prestadora e contratante. Nome do posto, duração curta ou atuação dentro da tomadora não bastam para classificar o vínculo. Leia contrato, registro e comunicação formal antes de usar uma regra de outra modalidade.</p>
<h2>Confira salário, ponto e depósitos por evidência</h2>
<p>Compare holerite, crédito recebido, espelho de ponto e registro na Carteira de Trabalho Digital. Divergência deve ser comunicada à prestadora com data, competência e documento relacionado. Não envie senha gov.br nem extrato completo para contato desconhecido. As <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho/perguntas-frequentes-carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">perguntas frequentes da CTPS Digital</a> explicam informações do registro eletrônico e canais ligados ao documento.</p>
<p>Se o problema envolve ambiente ou equipamento no posto, registre também o canal da contratante definido para segurança. Um protocolo para cada empresa ajuda a demonstrar quem recebeu o aviso e quando, sem antecipar conclusão jurídica sobre responsabilidade.</p>
<h2>Formalize mudança de tarefa, unidade ou horário</h2>
<p>Pedido ocasional não deve virar alteração indefinida sem esclarecimento. Anote quem orientou, qual tarefa, local, horário e duração. Quando a atividade parece diferente do serviço contratado, peça confirmação à supervisão da prestadora. Não recuse de forma improvisada situação de emergência, mas não execute atividade insegura para provar colaboração; siga o procedimento de segurança e comunicação do local.</p>
<h2>Escolha o canal conforme o problema</h2>
<ul><li><strong>Contrato, salário, férias ou rescisão:</strong> RH ou canal formal da prestadora.</li><li><strong>Acesso e rotina do posto:</strong> supervisão indicada, preservando o vínculo com a prestadora.</li><li><strong>Segurança imediata:</strong> responsáveis das duas empresas conforme o procedimento local.</li><li><strong>Divergência persistente:</strong> sindicato, inspeção do trabalho ou orientação jurídica com documentos.</li></ul>
<p>Não assine declaração pronta sem ler nem entregue documento original sem recibo. Este roteiro ajuda a organizar evidências e perguntas; a solução concreta depende do contrato, dos fatos e da análise competente.</p>
`.trim()
  },
  "trabalhar-fim-de-semana-folga-adicional": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Trabalhar no sábado ou no domingo não gera, por si só, um adicional chamado “de fim de semana”. O resultado depende da jornada contratual, do repouso semanal, de feriados, de horas extras e do instrumento coletivo. Misturar essas categorias produz cálculo errado.</p>
<h2>Repouso semanal não é a mesma coisa que feriado</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l0605.htm" target="_blank" rel="noopener noreferrer">Lei nº 605/1949</a> assegura repouso semanal remunerado de vinte e quatro horas consecutivas, preferencialmente aos domingos. A mesma lei trata separadamente do trabalho em feriados e prevê pagamento em dobro, salvo concessão de outro dia de folga. Não conclua que todo domingo será pago em dobro nem que uma folga compensa qualquer situação.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> reúne regras gerais sobre jornada e descanso. Categoria, atividade e convenção coletiva podem acrescentar escalas, folgas e adicionais específicos.</p>
<h2>Transforme a escala em calendário</h2>
<ol><li>Marque cada dia de trabalho e horário completo.</li><li>Identifique o repouso de vinte e quatro horas.</li><li>Separe domingos de feriados oficiais.</li><li>Registre trocas de folga e quem autorizou.</li><li>Compare com ponto, holerite e banco de horas.</li></ol>
<p>Use cores ou colunas diferentes para “domingo”, “feriado”, “repouso semanal” e “horas além da escala”. Um único dia pode exigir mais de uma pergunta, mas as categorias não devem ser tratadas como sinônimos. Para feriados locais, confirme a data em fonte oficial do ente competente; uma imagem compartilhada em rede social não substitui o calendário oficial nem a análise do vínculo.</p>
<p><strong>Exemplo ilustrativo:</strong> um atendente trabalha no domingo e descansa na terça-feira. Antes de exigir “adicional de domingo”, ele verifica a escala, o repouso concedido, a existência de feriado e a convenção da categoria. Se trabalhou em feriado sem folga compensatória, registra o dia de forma separada para pedir a memória de cálculo.</p>
<p><strong>Segundo exemplo:</strong> uma funcionária troca a folga com uma colega por necessidade pessoal. Ela confirma a autorização no canal da empresa e depois verifica se a mudança aparece na escala e no ponto. O comprovante não serve para divulgar dados da colega; serve para explicar por que o calendário comunicado e o registro final diferem.</p>
<h2>Perguntas na entrevista</h2>
<ul><li>A folga é fixa ou rotativa?</li><li>Com quanta antecedência a escala é divulgada?</li><li>Como funcionam domingos e feriados?</li><li>Existe acordo coletivo ou convenção aplicável?</li><li>Como horas além da escala são registradas?</li><li>Qual o horário real de saída e o transporte disponível?</li></ul>
<p>Para localizar o instrumento registrado, use o serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>. Confira sindicato, empresa ou categoria, município, vigência e eventuais aditivos.</p>
<h2>Deslocamento também entra na decisão</h2>
<p>Uma saída no fechamento de shopping, restaurante ou hotel pode exigir rota diferente da usada durante o dia. Teste o trajeto no horário da escala e confirme como chegar e voltar com segurança. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> usa a tarifa e o número de viagens inseridos por você; ela não presume preço nem benefício.</p>
<h2>Concilie o mês antes de questionar o valor</h2>
<p>No fim do período, coloque lado a lado calendário, espelho de ponto, extrato do banco de horas e holerite. Indique ao RH o dia e a rubrica que não entendeu, perguntando se houve folga, compensação ou pagamento e qual regra foi aplicada. Uma pergunta documentada permite correção; uma conta baseada apenas no número de domingos do calendário pode misturar situações diferentes.</p>
<p>Se a escala muda sem registro, o repouso não aparece ou o holerite não explica feriado e hora extra, peça esclarecimento por escrito. Leve calendário, ponto, holerite e instrumento coletivo ao sindicato, à inspeção do trabalho ou a profissional habilitado. Este texto não calcula adicional e não substitui análise jurídica.</p>
`.trim()
  },
  "trabalho-noturno-adicional-o-que-perguntar": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Trabalho noturno altera cálculo da jornada e também sono, transporte, alimentação e convivência familiar. Antes de aceitar, peça horário completo e condições práticas; a expressão “turno da noite” não informa quando começa, termina ou como será pago.</p>
<h2>Regra urbana da CLT</h2>
<p>O artigo 73 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> considera noturno, para trabalho urbano, o período entre 22h e 5h. A remuneração tem acréscimo de pelo menos vinte por cento e a hora noturna é computada como cinquenta e dois minutos e trinta segundos. A lei também trata de horários mistos e da prorrogação do trabalho noturno.</p>
<p>Essas regras não devem ser copiadas automaticamente para trabalho rural ou situações com disciplina própria. Norma coletiva pode trazer condições adicionais. Consulte a legislação atualizada e o instrumento aplicável.</p>
<h2>Peça uma escala completa</h2>
<ul><li>Hora de entrada, saída e intervalo.</li><li>Dias trabalhados, folgas e rotação.</li><li>Trechos que atravessam 22h ou 5h.</li><li>Rubrica do adicional no holerite.</li><li>Transporte no início e no fim do turno.</li><li>Refeição, local de descanso e protocolo de segurança.</li></ul>
<p><strong>Exemplo ilustrativo:</strong> uma recepcionista recebe proposta das 21h às 5h20. Ela pede que o RH explique quais horas entram no período noturno, como o intervalo aparece no ponto e se há transporte após a saída. Não calcula o salário final apenas multiplicando horas do relógio, porque a hora reduzida e outras regras precisam estar na memória de cálculo.</p>
<h2>Compare quatro documentos</h2>
<p>Use contrato, escala, espelho de ponto e holerite do mesmo período. Marque plantões trocados e extensões após 5h. Pergunte por escrito sobre rubricas que não reconhece e guarde a resposta. Para norma coletiva, consulte o serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>.</p>
<p>Monte uma linha por plantão com horário do relógio, intervalo, trecho informado como noturno e eventual prorrogação. Depois registre a competência e a rubrica usadas no holerite. Essa tabela não substitui o cálculo do empregador; ela mostra exatamente qual plantão precisa de explicação. Em jornada mista, peça memória de cálculo em vez de aplicar o adicional a todo o turno por conta própria.</p>
<p><strong>Segundo exemplo:</strong> um vigia começa antes das 22h e termina depois das 5h. Ele não transforma todas as horas em “hora noturna” por uma conta caseira. Entrega ao RH as marcações do plantão e pergunta como foram tratados cada trecho, o intervalo e a extensão. Se a resposta não coincidir com o ponto, guarda os documentos e procura orientação qualificada.</p>
<h2>Proteja o sono e o trajeto</h2>
<p>Verifique se consegue manter período regular de descanso em ambiente escuro e silencioso. Planeje refeições e evite dirigir ou operar equipamento se estiver sonolento. Se a mudança de turno produzir sintomas persistentes, procure atendimento de saúde; um artigo não substitui avaliação clínica.</p>
<p>Antes do primeiro plantão, confirme também a quem comunicar mal-estar, incidente, falta de transporte ou trabalho isolado. Não espere uma emergência para descobrir o contato. Informações de saúde devem circular apenas pelo procedimento necessário, não em grupos amplos de mensagens.</p>
<p>Em São Luís, confirme a rota exatamente no horário de saída. Não presuma que a linha usada durante o dia circula na madrugada. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com os valores que você verificou e considere alternativa segura para falhas do transporte.</p>
<h2>Sinais de informação incompleta</h2>
<ul><li>O anúncio diz apenas “disponibilidade total”.</li><li>O adicional é prometido sem explicar a jornada.</li><li>A saída varia sem escala ou ponto.</li><li>A troca de plantão ocorre só por mensagem informal.</li><li>Não há orientação sobre emergência e trabalho isolado.</li></ul>
<p>Esses sinais pedem esclarecimento, não provam irregularidade por si mesmos. Se ponto e holerite divergirem ou houver risco à saúde e segurança, reúna documentos e procure RH, sindicato, inspeção do trabalho ou orientação profissional.</p>
`.trim()
  },
  "retorno-trabalho-apos-maternidade": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Voltar ao emprego após licença-maternidade e retomar a busca por trabalho são situações diferentes. Em ambas, maternidade não precisa ser tratada como culpa nem como informação a ser escondida; o foco deve ser o que a pessoa precisa para exercer a função com segurança e quais direitos se aplicam ao vínculo.</p>
<h2>Se o retorno é ao mesmo emprego</h2>
<p>Antes da data prevista, confirme por canal oficial o dia, horário, unidade, escala e eventual exame ocupacional. Peça orientação sobre acesso, ponto e mudanças ocorridas durante a licença. Não assine pedido de demissão ou alteração contratual que não compreendeu.</p>
<p>O artigo 396 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> prevê, até que a criança complete seis meses, dois descansos especiais de meia hora durante a jornada para amamentação, inclusive em caso de adoção. Os horários devem ser definidos em acordo individual entre a mulher e o empregador, e o período pode ser ampliado quando a saúde do filho exigir.</p>
<p>A proteção à maternidade também aparece na <a href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" target="_blank" rel="noopener noreferrer">Constituição Federal e no ADCT</a>. Estabilidade, afastamento, adoção, saúde e situação contratual exigem leitura do caso concreto; não use um resumo para calcular datas ou decidir uma rescisão.</p>
<h2>Converse sobre logística sem expor a criança</h2>
<p><strong>Exemplo ilustrativo:</strong> uma trabalhadora retorna a uma loja com escala rotativa. Ela solicita por escrito a definição dos intervalos do artigo 396 e confirma quem pode ajustar o ponto. Não precisa enviar fotografia, certidão ou informação médica além do documento necessário ao procedimento formal.</p>
<ul><li>Quem confirma a escala da primeira semana?</li><li>Como serão registrados os descansos especiais?</li><li>Existe local apropriado e orientação interna?</li><li>Qual canal atende necessidade de saúde ou adaptação?</li><li>Como comunicar emergência familiar sem divulgar dados em grupo?</li></ul>
<h2>Organize o retorno em três conversas</h2>
<p>Primeiro, trate com o RH os documentos, a data e os procedimentos formais. Depois, alinhe com a liderança a escala, os acessos e a retomada das tarefas. Por fim, confirme com quem administra o ponto como serão registrados os descansos ou outros ajustes autorizados. Separar os assuntos evita expor informação médica a pessoas que só precisam conhecer a organização do trabalho.</p>
<p><strong>Segundo exemplo:</strong> a data de retorno consta em documento, mas o aplicativo corporativo ainda bloqueia o acesso. A trabalhadora registra a tentativa, avisa o canal indicado e pede orientação antes do turno. Ela não usa credencial de colega nem assina alteração contratual para resolver uma falha operacional.</p>
<p>Se houver recomendação médica relacionada à própria saúde ou à da criança, entregue apenas o documento exigido pelo procedimento e guarde o protocolo. Necessidades e prazos podem variar; não copie a solução de outra família nem publique laudos em grupo de trabalho.</p>
<h2>Se o objetivo é voltar ao mercado</h2>
<p>No currículo, descreva experiências, tarefas e resultados verdadeiros. Uma pausa pode ser indicada de forma breve quando necessário para tornar a cronologia compreensível, mas não invente trabalho informal, curso ou cargo para preencher datas. Na entrevista, responda sobre disponibilidade real e condições da vaga; detalhes íntimos da criança não demonstram competência.</p>
<p>Compare propostas com uma agenda real: horário de entrada, tempo de viagem, escala de fins de semana, possibilidade de mudança de unidade e pessoa de apoio em emergências. Isso não reduz a candidatura à maternidade; transforma requisitos vagos em condições objetivas para exercer o cargo. Registre cada informação no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> e confirme mudanças antes de aceitar.</p>
<p>Atualize telefone, e-mail e acesso à <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. Pesquise jornada, unidade e deslocamento antes de candidatar. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> ajuda a comparar propostas com valores informados por você.</p>
<h2>Planeje uma primeira semana realista</h2>
<ol><li>Teste o trajeto no horário efetivo.</li><li>Defina contatos de emergência e limites de compartilhamento.</li><li>Revise documentos e acessos necessários ao trabalho.</li><li>Reserve margem para adaptação da rotina.</li><li>Registre qualquer combinação relevante com o RH.</li></ol>
<p>Se houver pressão para pedir demissão, discriminação, recusa de direito, risco à saúde ou divergência sobre estabilidade, preserve mensagens e documentos e procure sindicato, inspeção do trabalho, assistência jurídica ou profissional habilitado. Este guia oferece organização prática; não substitui avaliação jurídica ou médica.</p>
`.trim()
  },

  "como-ler-holerite-descontos": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> O holerite é um registro para conferir, não uma conta que o trabalhador precisa aceitar sem entender. Compare o documento com o contrato, o controle de jornada e o valor que entrou na conta. Não use uma tabela antiga da internet para concluir que há erro: alíquotas, bases e regras podem mudar.</p>
<h2>Leia em quatro blocos</h2>
<ol>
<li><strong>Identificação e competência:</strong> confirme nome, empregador, cargo e o mês a que o pagamento se refere.</li>
<li><strong>Proventos:</strong> salário-base, horas, adicionais, comissões ou outras parcelas devem corresponder ao que ocorreu no período.</li>
<li><strong>Descontos:</strong> observe a descrição, a base e o valor de cada item; descontos sem explicação merecem pergunta formal.</li>
<li><strong>Líquido:</strong> confira se o total depositado corresponde ao líquido indicado e guarde o comprovante.</li>
</ol>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a>, especialmente nos artigos 462 e 464, disciplina descontos e a comprovação do pagamento. Isso não transforma todo desconto divergente em ilegal: adiantamentos, previsão legal e instrumentos coletivos podem alterar a leitura do caso.</p>
<h2>Um exemplo sem adivinhar alíquotas</h2>
<p>Imagine que o ponto mostra duas horas extras, mas o holerite não traz rubrica correspondente. Primeiro confirme se houve compensação válida, fechamento do ponto em data diferente ou banco de horas. Depois envie ao RH uma pergunta objetiva: “No demonstrativo de julho não localizei as horas de 8 e 9 de julho. Elas foram compensadas ou entrarão na próxima competência?” Anexe apenas o trecho necessário do espelho de ponto.</p>
<h2>Checklist para conversar com o RH</h2>
<ul>
<li>Qual período de ponto entrou nesta folha?</li>
<li>Que documento explica esta rubrica?</li>
<li>O desconto decorre de lei, contrato, adiantamento ou instrumento coletivo?</li>
<li>Existe folha complementar ou ajuste previsto?</li>
<li>Como recebo a resposta e o demonstrativo corrigido por escrito?</li>
</ul>
<h2>Faça uma conferência mensal simples</h2>
<p>Crie uma linha por competência com salário-base, dias trabalhados, horas registradas, faltas justificadas, férias, benefícios e líquido recebido. Quando houver variável, anote a origem: venda, plantão, comissão ou ajuste. Essa planilha não substitui a folha; ela ajuda a localizar em que mês surgiu a diferença.</p>
<p>Use também a <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> para conferir os dados disponíveis do vínculo. O aplicativo não substitui holerite, espelho de ponto nem resposta da empresa; ele é mais uma fonte para comparar razão social, datas e registros informados.</p>
<p><strong>Exemplo de reconciliação:</strong> uma atendente em São Luís recebe comissão referente às vendas do mês anterior. Ela anota a competência da folha, o período usado pela empresa e a rubrica correspondente. Se o depósito não coincide, pergunta qual ciclo entrou no cálculo e guarda a memória apresentada, sem divulgar o demonstrativo completo em grupo.</p>
<p>Não compare apenas dois líquidos: férias, afastamento, adiantamento, início ou término no meio do mês e fechamento de ponto podem alterar o resultado. Compare primeiro as rubricas e bases. Se receber folha retificadora, preserve também a versão anterior e a resposta que explica o motivo.</p>
<h2>Dúvidas que o valor líquido não responde</h2>
<p><strong>O salário-base está certo, então a folha está certa?</strong> Não necessariamente. Jornada, adicionais, faltas, benefícios e descontos também precisam corresponder aos registros do período.</p>
<p><strong>Posso enviar o holerite inteiro por WhatsApp?</strong> Prefira o canal oficial e compartilhe só o necessário. O documento contém remuneração e outros dados pessoais.</p>
<p><strong>Uma diferença pequena pode ser ignorada?</strong> Registre e pergunte. Valores pequenos repetidos se acumulam e podem indicar uma rubrica interpretada de forma diferente pelo RH.</p>
<p>Quando a folha usa códigos internos, peça o glossário de rubricas em vez de adivinhar pelo nome abreviado. Na rescisão ou troca de sistema, exporte seus demonstrativos antes de perder o acesso ao portal corporativo. Arquivo pessoal não deve depender apenas do e-mail ou aplicativo da empresa.</p>
<p>Guarde holerites, espelhos de ponto, contrato e comprovantes em local pessoal seguro. Se a diferença persistir, peça memória de cálculo ao empregador e consulte o sindicato da categoria ou profissional habilitado. Este guia ajuda a organizar a conferência; não calcula tributos nem substitui análise contábil ou jurídica.</p>
`.trim()
  },
  "freelancer-ou-clt-vantagens": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> “Freelancer” descreve uma forma comum de prestar serviços, mas não resolve sozinho se existe ou não vínculo de emprego. A escolha prática deve considerar autonomia real, previsibilidade de renda, custos, proteção previdenciária e o contrato proposto — não apenas o valor anunciado.</p>
<h2>Compare o trabalho concreto</h2>
<table>
<thead><tr><th>Ponto</th><th>Emprego formal</th><th>Prestação por conta própria</th></tr></thead>
<tbody>
<tr><td>Rotina</td><td>Jornada, direção e regras do empregador</td><td>Escopo, entrega e autonomia precisam estar claros</td></tr>
<tr><td>Pagamento</td><td>Salário e parcelas conforme contrato e legislação</td><td>Preço, prazo, aceite e multa devem constar do acordo</td></tr>
<tr><td>Custos</td><td>Verifique transporte, alimentação e equipamentos</td><td>Inclua tempo sem projeto, tributos, contribuição e ferramentas no preço</td></tr>
<tr><td>Risco</td><td>Renda tende a ser mais previsível, conforme o vínculo</td><td>Atraso do cliente e intervalos sem demanda precisam de reserva</td></tr>
</tbody>
</table>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> reúne as regras gerais do emprego. Para quem trabalha por conta própria, o <a href="https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tipos-de-filiacao" target="_blank" rel="noopener noreferrer">INSS explica os tipos de filiação</a> e mantém orientações sobre <a href="https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/contribuicao-previdenciaria-e-salario-de-contribuicao" target="_blank" rel="noopener noreferrer">contribuição previdenciária</a>. Consulte as páginas atuais antes de escolher categoria ou valor; uma tabela antiga pode induzir erro.</p>
<h2>Faça uma conta mensal, não por diária</h2>
<p><strong>Exemplo ilustrativo:</strong> uma pessoa recebe proposta de quatro entregas por mês. Ela soma horas de execução, reuniões, transporte, internet, equipamento, eventual emissão de documento fiscal e semanas sem demanda. Só então compara com uma proposta empregatícia, considerando jornada, benefícios confirmados e custo do trajeto em São Luís.</p>
<h2>Perguntas antes de aceitar</h2>
<ul>
<li>Quem define horário, local, método e prioridade?</li>
<li>Qual é o escopo e quantas revisões estão incluídas?</li>
<li>Quando a entrega é considerada aceita e quando vence o pagamento?</li>
<li>Quem fornece equipamento, acesso e material?</li>
<li>Há exclusividade, confidencialidade ou cessão de direitos?</li>
<li>Como encerrar o acordo e receber o que já foi entregue?</li>
</ul>
<h2>Coloque o acordo de serviço no papel</h2>
<p>Uma proposta de prestação deve identificar as partes, o resultado esperado, os arquivos ou serviços incluídos, a data de entrega, a forma de aceite, o preço, o vencimento e o que acontece se o escopo mudar. Defina também quem fornece acesso, material e autorização para usar marcas ou dados. “Fazer as redes” ou “dar apoio” é amplo demais para cobrar e entregar com segurança.</p>
<p>Para comparar renda, simule um mês fraco, um mês normal e um mês cheio. Reserve tempo não faturado para prospectar, organizar documentos e corrigir entregas. Se o contrato exige disponibilidade permanente, exclusividade ou controle diário, considere esse impacto antes de aceitar e procure orientação se a prática parecer diferente do rótulo usado.</p>
<h2>Três decisões antes de trocar de modelo</h2>
<p><strong>Reserva:</strong> quantos meses você consegue cobrir despesas se um cliente atrasar ou cancelar? <strong>Dependência:</strong> qual percentual da renda viria de um único contratante? <strong>Capacidade:</strong> quantas horas cabem sem reduzir qualidade ou descanso?</p>
<p>Se você já tem emprego, revise cláusulas de confidencialidade, conflito de interesse e horário antes de aceitar projeto paralelo. Nunca use lista de clientes, equipamento ou arquivo do empregador sem autorização. Se está desempregado, trate promessa de volume futuro como possibilidade, não como receita confirmada.</p>
<p>Peça uma proposta-piloto paga quando ainda não houver histórico com o cliente; ela reduz incerteza sem transformar trabalho completo em “teste grátis”.</p>
<h2>Não compare bruto com líquido de forma incompleta</h2>
<p>Crie duas colunas e use o mesmo período. No vínculo formal, registre salário, parcelas e benefícios efetivamente informados, descontos esperados, horas e deslocamento. Na prestação, registre preço recebido, tributos e contribuição aplicáveis, ferramentas, internet, transporte, tempo de negociação, retrabalho e intervalo sem contrato. Não atribua valor a benefício que a proposta não confirmou e não use faturamento como se fosse renda disponível.</p>
<p>O portal oficial do <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" target="_blank" rel="noopener noreferrer">Empreendedor</a> reúne orientações para formalização e serviços empresariais. Abrir MEI ou outra empresa depende de atividade permitida, limites e obrigações atuais; o rótulo “freelancer” não torna alguém automaticamente elegível. Verifique a ocupação e a regra vigentes antes de emitir documento ou pagar guia.</p>
<h2>Teste o contrato com um caso concreto</h2>
<p>Imagine que o cliente pede uma quinta revisão depois do aceite. O texto diz quantas revisões estavam incluídas, quem aprovou a entrega e como o novo escopo será orçado? Se o projeto for cancelado no meio, existe critério de pagamento proporcional? Se houver dados de clientes, estão definidos acesso, finalidade, armazenamento e eliminação? Perguntas assim revelam risco melhor que uma lista abstrata de “vantagens”.</p>
<p>Guarde proposta, aceite, versões entregues e comprovantes pelo prazo adequado à sua situação, sem armazenar dados além do necessário. Em projeto presencial em São Luís, some deslocamento e tempo de espera; em projeto remoto, identifique equipamento e licenças. Se um único contratante controla rotina, horário e modo de execução, não tente resolver possível vínculo apenas trocando o título do documento: procure orientação qualificada.</p>
<p>Não abra CNPJ, pague taxa ou entregue senha gov.br só porque um anúncio exige urgência. Se a rotina real divergir do contrato ou houver dúvida sobre vínculo, tributação ou contribuição, leve os documentos a profissional habilitado. Este conteúdo é um roteiro de decisão, não enquadramento jurídico automático.</p>
`.trim()
  },
  "mitos-direitos-trabalhistas-whatsapp": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Mensagens virais misturam regra geral, exceção, decisão sobre um caso específico e informação já superada. Em vez de responder “verdadeiro” ou “falso” sem contexto, verifique a fonte, a data, a categoria profissional e o documento aplicável.</p>
<h2>Um método de verificação em cinco passos</h2>
<ol>
<li><strong>Capture a afirmação exata.</strong> Salve texto, data e link; áudio sem origem é difícil de auditar.</li>
<li><strong>Identifique o tipo de regra.</strong> Pode vir de lei, contrato, política interna, convenção ou acordo coletivo.</li>
<li><strong>Confirme a abrangência.</strong> Categoria, município, empresa, vigência e situação contratual podem mudar a resposta.</li>
<li><strong>Abra a fonte primária.</strong> Use portais oficiais, não uma imagem cortada.</li>
<li><strong>Registre a dúvida restante.</strong> Pergunte ao RH, sindicato ou profissional habilitado com os documentos do caso.</li>
</ol>
<p>Para legislação geral, consulte a <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT no Planalto</a>. O Ministério do Trabalho permite <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">consultar instrumentos coletivos registrados</a> e mantém o <a href="https://cnes.trabalho.gov.br/app/publico/consultas/cadastro-entidade" target="_blank" rel="noopener noreferrer">CNES</a> para verificar entidades sindicais.</p>
<h2>Exemplo: “todo trabalhador recebe o mesmo adicional”</h2>
<p>A frase é incompleta. O nome da parcela, a atividade, o horário, a base de cálculo e a norma aplicável precisam ser identificados. A verificação correta começa pelo contrato e holerite, passa pelo instrumento coletivo vigente e termina na regra oficial pertinente. Um print sem empresa, período e categoria não sustenta conclusão.</p>
<h2>Sinais de mensagem insegura</h2>
<ul>
<li>não informa número, órgão, data ou link da norma;</li>
<li>promete dinheiro automático ou indenização garantida;</li>
<li>pede CPF, senha, código ou pagamento para “liberar direito”;</li>
<li>usa “vale para todo mundo” sem explicar categoria e vigência;</li>
<li>manda encaminhar antes que a mensagem seja “apagada”.</li>
</ul>
<h2>Como registrar a resposta sem criar outro boato</h2>
<p>Copie o título da fonte, o órgão responsável, a data de consulta e a passagem relevante em suas próprias palavras. Se a regra vier de convenção coletiva, registre número, vigência, categoria e município. Se depender do contrato, diga explicitamente que a fonte geral não resolve o caso sozinha.</p>
<p><strong>Exemplo de resposta responsável:</strong> “A CLT contém a regra geral, mas o instrumento coletivo e os documentos do vínculo precisam ser conferidos. O serviço oficial para pesquisar acordos está neste link. Consultei em 12/10/2026.” Esse formato permite que outra pessoa refaça a verificação.</p>
<h2>Quando não responder em grupo</h2>
<p>Atestado, acidente, assédio, dispensa e desconto podem expor dados pessoais ou exigir prazo. Nesses casos, preserve a mensagem, saia da discussão pública e use um canal individual com a entidade ou profissional adequado. Não publique nome da empresa ou colega como acusação sem apuração.</p>
<h2>Confira se a página oficial ainda é a mesma</h2>
<p>Uma corrente pode usar um link verdadeiro para sustentar uma conclusão que a página não traz. Abra o endereço, leia título, órgão, data de atualização e escopo. Se houver PDF, confirme se é a versão vigente e se existe norma posterior. Um resultado de busca ou trecho destacado não substitui a leitura do documento.</p>
<p>Desconfie especialmente de mensagens que misturam serviço público gratuito com cobrança, prometem “saldo liberado” ou pedem autenticação. Digite o endereço oficial no navegador ou comece pelo portal gov.br; não entregue senha nem código recebido no telefone. Para dúvida coletiva, compartilhe o link da fonte e explique o limite da verificação, sem anexar dados do seu vínculo.</p>
<h2>Perguntas para desmontar uma corrente</h2>
<ul><li>Qual é o número da lei, cláusula ou decisão?</li><li>Qual órgão publicou e em que data?</li><li>A informação vale para empregado, servidor, autônomo ou uma categoria específica?</li><li>A regra está vigente na data do fato?</li><li>Há condição ou exceção que foi cortada da mensagem?</li></ul>
<p>Se ninguém consegue responder, rotule a informação como não verificada. Não complete a lacuna com memória ou com outro post que cita a mesma corrente. Uma busca pode encontrar muitas repetições sem encontrar a fonte original.</p>
<p>Ao compartilhar uma correção, envie o link oficial e uma frase limitada: “esta fonte diz X; é preciso confirmar se se aplica ao seu contrato”. Não exponha holerite, atestado ou dados de colegas em grupo. Se houver prazo, desconto, dispensa ou risco à saúde, preserve os documentos e procure orientação individual. Este guia combate desinformação; não oferece parecer jurídico.</p>
`.trim()
  },
  "servicos-gerais-epi-vaga": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Em uma vaga de serviços gerais, perguntar sobre risco e proteção é parte da avaliação profissional. “Usa luva” não basta: o equipamento precisa corresponder ao risco da tarefa, ter orientação de uso e estar integrado às medidas de prevenção do local.</p>
<h2>O que a vaga deve esclarecer</h2>
<ul>
<li>ambientes e tarefas: limpeza comum, resíduos, produtos químicos, altura ou área de saúde;</li>
<li>produtos utilizados e onde ficam as fichas e instruções;</li>
<li>equipamentos de trabalho e manutenção;</li>
<li>treinamento antes de tarefas de maior risco;</li>
<li>responsável por reposição, higienização e comunicação de defeitos.</li>
</ul>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-6-nr-6" target="_blank" rel="noopener noreferrer">NR-6</a> trata de equipamento de proteção individual. O Ministério do Trabalho também mantém a <a href="https://caepi.trabalho.gov.br/internet/ConsultaCAInternet.aspx" target="_blank" rel="noopener noreferrer">consulta do Certificado de Aprovação</a>. O CA indica aprovação do equipamento dentro do escopo informado; não significa que qualquer EPI serve para toda tarefa.</p>
<h2>Durante a entrevista</h2>
<p>Pergunte de forma concreta: “Quais produtos e superfícies fazem parte da rotina?”, “Há treinamento antes do primeiro uso?” e “Como funciona a troca de equipamento danificado?”. Uma resposta profissional descreve processo, não culpa o candidato por ainda não conhecer o local.</p>
<h2>Ao iniciar o trabalho</h2>
<ol>
<li>confira tamanho, integridade e identificação do equipamento;</li>
<li>aprenda como colocar, retirar, limpar e guardar;</li>
<li>não misture produtos nem improvise embalagem;</li>
<li>interrompa a tarefa e comunique vazamento, dano ou sintoma;</li>
<li>registre a solicitação de substituição pelo canal indicado.</li>
</ol>
<p><strong>Exemplo ilustrativo:</strong> uma auxiliar recebe luvas, mas nota rasgo antes de limpar um banheiro. Ela separa o item, avisa a supervisão e solicita substituição antes de continuar. Fotografar pessoas, prontuários ou áreas restritas para “provar” o fato pode criar outro problema; siga o procedimento interno e preserve apenas o registro necessário.</p>
<h2>EPI não substitui organização do trabalho</h2>
<p>Equipamento individual é uma camada de proteção. Ventilação, isolamento da área, sinalização, equipamento adequado e procedimento de limpeza podem ser tão importantes quanto luvas, calçado ou máscara. Por isso, a pergunta correta não é “qual EPI eu uso?”, mas “qual é o risco avaliado e quais controles foram definidos?”.</p>
<p>Se houver contato com material biológico, produto corrosivo, eletricidade, altura ou máquina, não improvise com equipamento doméstico. Peça a orientação específica e confirme quem está autorizado a executar a tarefa. Um CA válido não transforma um equipamento inadequado ao risco em escolha correta.</p>
<h2>Sinais de posto mal organizado</h2>
<ul><li>produto sem rótulo ou diluição feita “de memória”;</li><li>EPI compartilhado sem higienização definida;</li><li>treinamento reduzido a assinatura em lista;</li><li>pressão para continuar com item danificado;</li><li>tarefa perigosa fora do escopo sem supervisão.</li></ul>
<h2>Como descrever experiência no currículo</h2>
<p>Em vez de escrever apenas “serviços gerais”, liste tarefas verdadeiras: limpeza de áreas administrativas, coleta segregada, reposição de materiais ou uso de equipamento específico para o qual recebeu orientação. Não declare curso, produto ou ambiente de risco que você não conhece.</p>
<p>Na entrevista, experiência inclui seguir procedimento, sinalizar área molhada, comunicar defeito e evitar mistura de produtos. Esses exemplos mostram cuidado sem inventar certificação. Se a vaga envolve hospital, cozinha industrial ou altura, peça que a empresa explique requisitos e treinamento do próprio posto.</p>
<h2>Separe entrega, orientação e uso</h2>
<p>A NR-6 atribui responsabilidades diferentes à organização e ao trabalhador. Para avaliar o posto, peça que expliquem como o equipamento foi selecionado para o risco, como ocorre o fornecimento gratuito, onde ficam os registros, qual treinamento será dado e como funciona substituição. Depois de orientado, o trabalhador deve usar o EPI para a finalidade prevista, cuidar do item e comunicar perda, dano ou alteração que o torne impróprio. Assinar recebimento sem conferir item, tamanho e condição não resolve essas etapas.</p>
<p>Na <a href="https://caepi.trabalho.gov.br/internet/ConsultaCAInternet.aspx" target="_blank" rel="noopener noreferrer">consulta oficial do CA</a>, confira número e situação do certificado informado no equipamento. O resultado precisa ser lido junto das limitações e instruções do fabricante. Não escolha luva, respirador ou calçado apenas pela aparência ou pelo número do CA.</p>
<h2>Registre um desvio de forma útil</h2>
<p>Um aviso objetivo contém tarefa, local, risco observado, equipamento afetado e medida imediata: “A luva destinada à limpeza do sanitário estava rasgada antes do uso; separei o item e pedi reposição ao supervisor”. Evite fotografar pessoas ou áreas restritas. Guarde o protocolo quando o canal fornecer e peça retorno antes de reiniciar tarefa que dependa daquela proteção.</p>
<p>Se aparecer novo produto ou atividade, não suponha que o EPI anterior continua adequado. Peça a ficha do produto, procedimento atualizado e orientação específica. O trabalhador não deve improvisar mistura, diluição ou embalagem para cumprir prazo.</p>
<p>Não compre EPI exigido pela vaga como condição para participar de seleção e não aceite pagamento para “kit obrigatório” enviado por desconhecido. Em risco imediato, falta de orientação ou recusa de substituição, procure a supervisão e os canais de segurança do trabalho; conforme o caso, sindicato, inspeção do trabalho ou atendimento de saúde. O guia não substitui avaliação técnica do ambiente.</p>
`.trim()
  },
  "sindicato-trabalhador-direitos-basico": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Para procurar um sindicato, comece pela categoria e pela base territorial, não pelo nome que apareceu em uma mensagem. Entidades diferentes podem representar trabalhadores e empregadores, categorias distintas ou regiões diferentes.</p>
<h2>Como identificar a entidade</h2>
<ol>
<li>anote sua função, a atividade principal do empregador e o município de trabalho;</li>
<li>pergunte ao RH qual instrumento coletivo foi usado no contrato ou holerite;</li>
<li>consulte a situação e a representação no <a href="https://cnes.trabalho.gov.br/app/publico/consultas/cadastro-entidade" target="_blank" rel="noopener noreferrer">Cadastro Nacional de Entidades Sindicais</a>;</li>
<li>confira convenções e acordos no serviço oficial de <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">consulta de instrumentos coletivos</a>;</li>
<li>compare CNPJ, endereço, abrangência e vigência antes de enviar documentos ou pagar.</li>
</ol>
<p>O Ministério do Trabalho explica que o <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/sindicatos/cadastro-de-entidades/cadastro-de-entidades-sindicais/informacoes-gerais-sobre-o-cadastro-nacional-de-entidades-sindicais" target="_blank" rel="noopener noreferrer">CNES disponibiliza dados públicos de representação e situação cadastral</a>. Já o instrumento coletivo deve ser lido pela vigência, categoria, base e cláusula específica; encontrar um PDF não prova que ele se aplica ao seu vínculo.</p>
<h2>Prepare uma consulta útil</h2>
<p>Em vez de enviar todos os documentos, formule a pergunta: “Trabalho como X na empresa Y, em São Luís, desde tal mês. Qual instrumento coletivo vigente abrange esta situação e onde está a cláusula sobre Z?”. Compartilhe apenas o necessário e oculte senha, código, dados bancários e informações de terceiros.</p>
<h2>O que conferir antes de contribuir ou se filiar</h2>
<ul>
<li>nome completo e CNPJ da entidade;</li>
<li>categoria e municípios representados;</li>
<li>finalidade da cobrança e forma de autorização;</li>
<li>canal oficial e recibo;</li>
<li>procedimento para contestar erro ou esclarecer dúvida.</li>
</ul>
<p><strong>Exemplo ilustrativo:</strong> duas entidades com nomes parecidos entram em contato. O trabalhador não escolhe pela foto do perfil: consulta o CNES, lê o instrumento vigente e pede confirmação escrita da representação. Se os dados não coincidem, não envia documento nem faz Pix.</p>
<h2>Que ajuda pedir</h2>
<p>Separe três tipos de demanda. Para entender uma cláusula, peça o instrumento completo e a página aplicável. Para divergência no holerite, leve contrato, demonstrativo e pergunta objetiva. Para negociação coletiva, confirme o canal de assembleia ou atendimento e a base representada. Essa separação evita mandar um dossiê inteiro a quem só precisa localizar uma norma.</p>
<p>Ao telefonar ou escrever, peça protocolo, nome do setor e prazo estimado. Depois confirme a orientação por documento ou link oficial. Uma resposta recebida em conversa privada não substitui o texto do acordo nem prova automaticamente que ele se aplica a todas as pessoas da empresa.</p>
<h2>Proteja-se de falsos contatos</h2>
<p>Golpistas podem copiar logotipo e nome de entidade. Digite o endereço oficial em vez de abrir link recebido, confira o domínio e compare telefone e CNPJ com o cadastro. Nunca informe código de autenticação, senha bancária ou senha gov.br.</p>
<h2>Leia uma convenção sem se perder</h2>
<p>Comece pela identificação das partes, categoria, abrangência territorial e vigência. Depois busque a palavra da sua dúvida, como jornada, piso, refeição ou auxílio. Leia a cláusula inteira e as condições próximas; uma tabela isolada pode depender de cargo, tempo de empresa ou data.</p>
<p>Registre o número do instrumento e a página consultada. Se o texto antigo aparece primeiro no buscador, compare a vigência com a data do seu fato e procure termo aditivo. Não use o valor de outra cidade ou categoria para negociar como se fosse obrigatório no seu vínculo.</p>
<p>O sindicato pode orientar e negociar, mas a resposta para um caso individual depende dos fatos e documentos. Em prazo de rescisão, risco à saúde, assédio ou conflito relevante, busque também assistência jurídica ou o órgão competente. Este guia ensina a verificar identidade e fonte; não indica entidade específica nem presume filiação.</p>

<h2>Faça o teste de quatro chaves antes de aplicar uma cláusula</h2>
<p>Uma convenção ou acordo só deve entrar na sua análise depois de conferir <strong>partes</strong>, <strong>categoria</strong>, <strong>território</strong> e <strong>vigência</strong>. Abra o registro no serviço oficial, identifique quem assinou e leia o início do instrumento. Depois localize a cláusula e verifique exceções, datas, tabelas e termos aditivos. Um trecho encaminhado por mensagem pode estar correto e ainda assim pertencer a outra cidade, período ou categoria.</p>
<p>Guarde o número do instrumento, a URL consultada e a página. Se RH e entidade indicarem documentos diferentes, peça que cada um identifique a base usada. Não some benefícios de instrumentos distintos nem aplique piso de categoria semelhante sem confirmação.</p>
<h2>Diferencie entidade de trabalhadores e entidade patronal</h2>
<p>Nomes próximos podem representar lados diferentes da relação coletiva. No CNES, confira natureza da entidade, denominação, CNPJ, base territorial e categoria. O logotipo ou a palavra “sindicato” não informa sozinho quem é representado. Para atendimento individual, confirme se o canal recebe trabalhadores daquela base e qual documentação mínima precisa.</p>
<p>Se a dúvida envolver cobrança, peça fundamento, forma de autorização, período e canal de contestação. Não faça pagamento por chave recebida em mensagem antes de validar CNPJ e contato. Para prazo judicial, acidente, risco grave, assédio ou rescisão com divergência, uma consulta genérica pode não bastar; procure assistência jurídica ou órgão competente sem esperar resposta de rede social.</p>
    `.trim()
  },
  "transferencia-interna-emprego-como-pedir": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Transferência interna pode significar mudança de equipe, turno, função, unidade ou cidade. Antes de pedir, defina qual dessas mudanças você quer e que problema ela resolve para a organização sem ocultar os impactos para você.</p>
<h2>Monte uma proposta verificável</h2>
<ul>
<li><strong>Objetivo:</strong> função, equipe ou unidade desejada.</li>
<li><strong>Evidência:</strong> tarefas já realizadas, resultados e competências transferíveis.</li>
<li><strong>Transição:</strong> entregas em aberto, documentação e prazo de passagem.</li>
<li><strong>Condições:</strong> jornada, remuneração, benefícios, gestor, local e data de início.</li>
<li><strong>Alternativa:</strong> treinamento ou projeto temporário antes da mudança definitiva.</li>
</ul>
<p><strong>Exemplo ilustrativo:</strong> uma atendente quer migrar para apoio administrativo. Em vez de dizer apenas que está insatisfeita, apresenta experiência com planilhas, registro de chamados e organização de documentos; propõe duas semanas para transferir a fila e pede a descrição formal da nova função.</p>
<h2>Conversa e registro</h2>
<p>Marque uma conversa com a liderança e depois resuma por e-mail: pedido, condições discutidas e próximos passos. Não anuncie a mudança a clientes ou colegas antes da confirmação. Se houver processo interno, respeite os critérios e evite acessar dados da nova área sem autorização.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> contém regras sobre alteração contratual e transferência de localidade, especialmente nos artigos 468 e 469. Uma troca de equipe no mesmo endereço não é automaticamente igual a uma transferência geográfica. Mudança de cidade, prejuízo contratual, adicional, despesas e necessidade do serviço exigem análise dos fatos e do instrumento coletivo aplicável.</p>
<h2>Confirme antes de aceitar</h2>
<ol>
<li>receba a função e as responsabilidades por escrito;</li>
<li>compare salário, jornada, metas e benefícios;</li>
<li>teste o novo deslocamento e seu custo;</li>
<li>confirme período de experiência interna e critério de retorno, se houver;</li>
<li>pergunte quando a alteração aparecerá no sistema e nos registros.</li>
</ol>
<h2>Se houver mudança de cidade</h2>
<p>Peça por escrito endereço, duração, motivo, data, despesas cobertas e condição de retorno. Calcule moradia, transporte, tempo de deslocamento e impacto familiar; não aceite a frase “depois acertamos”. Verifique o instrumento coletivo e a política interna antes de assinar aditivo.</p>
<h2>Se houver mudança de função</h2>
<p>Compare tarefas novas com cargo, salário, metas, acesso a sistemas e responsabilidade por pessoas ou valores. Uma promoção verbal sem data, remuneração ou descrição pode criar expectativa impossível de conferir. Se for movimento temporário, defina início, fim, avaliação e quem decide a efetivação.</p>
<p>Uma negativa também pode gerar plano útil. Peça os critérios que faltam, uma atividade de desenvolvimento e uma data realista para nova conversa. Evite ameaça de saída que você não pretende cumprir; preserve relação e mantenha busca externa separada dos sistemas da empresa.</p>
<h2>Acompanhe sem pressionar</h2>
<p>Combine quando haverá retorno e faça um único acompanhamento na data marcada. Enquanto isso, continue entregando o trabalho atual e organize evidências das competências pedidas. Se a vaga interna for publicada, candidate-se pelo processo oficial mesmo que já tenha conversado com a liderança.</p>
<p>Não use acesso privilegiado para descobrir remuneração de colegas ou detalhes de outros candidatos. Compare apenas as condições que a empresa apresentou a você. Se houver potencial conflito com seu gestor atual, pergunte ao RH como funciona a confidencialidade do processo antes de formalizar.</p>
<h2>Compare também a norma coletiva aplicável</h2>
<p>Uma mudança de unidade, função ou jornada pode ser alcançada por regras da categoria que não aparecem no comunicado individual. O serviço oficial para <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">consultar instrumentos coletivos no Sistema Mediador</a> permite pesquisar convenções e acordos registrados. Confirme sindicato, categoria, município e vigência; um instrumento de outra empresa ou período não resolve o seu caso.</p>
<p>Monte uma tabela “antes e depois” com endereço, cargo, tarefas, gestor, jornada, salário fixo, parcelas variáveis, benefícios, data e duração. Marque cada item como confirmado, pendente ou não aplicável. Isso evita decidir apenas pelo título da função e deixa visível o que precisa constar de aditivo ou comunicação formal.</p>
<h2>Roteiro para a reunião</h2>
<ol><li>Explique a mudança pretendida em uma frase, sem depreciar a equipe atual.</li><li>Apresente duas evidências ligadas à nova função.</li><li>Pergunte critérios, responsável pela decisão e prazo.</li><li>Confirme como serão tratados acesso, treinamento e entregas atuais.</li><li>Envie resumo factual e peça correção se algo estiver errado.</li></ol>
<p>Se a transferência envolve São Luís e outro município, simule o trajeto no horário real, visite a região quando possível e estime moradia ou deslocamento com valores próprios. Não trate ajuda de custo verbal como renda garantida nem entregue pedido de demissão antes de receber condições formais.</p>
<p>Se a mudança for imposta, não assine documento que você não entendeu. Peça tempo razoável para leitura e guarde a versão recebida. Pressão, redução indevida ou deslocamento relevante podem demandar sindicato ou orientação jurídica. Este guia ajuda a estruturar o pedido; não garante aprovação nem define a legalidade de um caso concreto.</p>
`.trim()
  },
  "vale-alimentacao-ou-refeicao-diferenca": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Vale-alimentação e vale-refeição não devem ser comparados só pelo valor mensal. Rede aceita, frequência de crédito, regras do empregador, eventual participação do trabalhador e rotina de alimentação podem mudar a utilidade real em São Luís.</p>
<h2>O que cada nome costuma indicar</h2>
<p>O vale-refeição costuma ser direcionado a refeições prontas; o vale-alimentação, à compra de gêneros alimentícios. A aceitação concreta depende do arranjo e da rede credenciada. Não prometa que todo mercado ou restaurante aceitará: consulte o aplicativo ou canal oficial do emissor antes de contar com o saldo.</p>
<p>O <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/programa-de-alimentacao-do-trabalhador-pat/programa-de-alimentacao-do-trabalhador-pat-1/" target="_blank" rel="noopener noreferrer">Programa de Alimentação do Trabalhador</a> e a <a href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14442.htm" target="_blank" rel="noopener noreferrer">Lei nº 14.442/2022</a> tratam do benefício alimentar e de sua finalidade. O Ministério do Trabalho também publica <a href="https://www.gov.br/trabalho-e-emprego/pt-br/noticias-e-conteudo/2026/julho/regras-do-auxilio-alimentacao-e-do-auxilio-refeicao-passam-a-valer-para-todas-as-empresas" target="_blank" rel="noopener noreferrer">orientações atuais sobre as regras do auxílio-alimentação e refeição</a>. Benefício, valor e condições do seu vínculo devem ser confirmados no contrato, política e instrumento coletivo; não presuma obrigação universal a partir de um resumo.</p>
<h2>Compare uma proposta</h2>
<ul>
<li>valor e data do crédito;</li>
<li>desconto informado no holerite;</li>
<li>rede próxima de casa, trabalho e rota diária;</li>
<li>uso em dias de ausência, férias ou admissão no meio do mês;</li>
<li>procedimento para cartão perdido e prazo de substituição;</li>
<li>regra para saldo e mudança de modalidade.</li>
</ul>
<p><strong>Exemplo ilustrativo:</strong> duas propostas informam o mesmo valor. A primeira tem rede próxima ao terminal usado pelo candidato; a segunda exige deslocamento adicional. Ele consulta a rede oficial, estima refeições reais e pergunta por escrito sobre desconto e calendário de crédito antes de decidir.</p>
<h2>Evite fraude e surpresa</h2>
<p>Não pague “taxa de liberação” por Pix nem entregue senha do aplicativo a recrutador. Em admissão, confirme o emissor pelo canal da empresa. Se o valor ou desconto divergir, guarde proposta, política, holerite e extrato do benefício e peça explicação ao RH.</p>
<h2>Teste a rede antes do primeiro dia</h2>
<p>Abra o mapa oficial do emissor e pesquise pontos próximos ao local de trabalho e ao trajeto que você realmente usa. Confirme endereço e horário diretamente com o estabelecimento, porque cadastros podem mudar. Faça uma simulação de cinco dias: preço de uma refeição compatível, distância a pé e tempo de intervalo.</p>
<p>Se o cartão oferece modalidades separadas, pergunte se o valor pode ser dividido e quem define a proporção. Não presuma portabilidade, saque, transferência ou uso fora da finalidade alimentar. Recursos e regras devem ser confirmados no canal oficial vigente.</p>
<h2>Registre a oferta corretamente</h2>
<p>Guarde a proposta que informa o benefício e a política entregue na admissão. No primeiro crédito, confira competência, valor e desconto no holerite. Se a rede prometida não existe na região, relate com exemplos verificáveis em vez de apenas dizer que “não funciona”.</p>
<h2>Perguntas que evitam comparação errada</h2>
<p>O crédito começa no primeiro dia ou segue calendário? Há valor proporcional na admissão? Existe desconto e onde ele aparece? A rede é consultada por aplicativo, site ou central? O cartão físico chega antes do início? Essas respostas importam mais do que tratar o benefício como dinheiro livre.</p>
<p>Se você prepara comida em casa, o vale-alimentação pode ter uso diferente do de quem almoça perto do trabalho. Se a jornada muda entre unidades, teste mais de uma região. A melhor modalidade depende da rotina e das regras confirmadas, não de uma resposta universal.</p>
<p>Para avaliar o pacote total, some salário líquido estimado, benefícios confirmados e custo do trajeto; não converta benefício em dinheiro na sua planilha como se a rede fosse irrestrita. Dúvidas sobre natureza da parcela, instrumento coletivo ou desconto exigem orientação individual. Este guia apoia a comparação, não interpreta seu contrato.</p>
`.trim()
  },
  "documentos-admissao-emprego-maranhao": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Não existe uma lista única que sirva para toda admissão. Os documentos necessários dependem do vínculo, da função e dos registros que o empregador precisa realizar. A empresa deve informar a relação e um canal seguro; o candidato deve evitar enviar dados extras “por garantia”.</p>
<h2>Confirme primeiro a contratação</h2>
<ul>
<li>razão social e contato oficial do empregador;</li>
<li>cargo, local, jornada, remuneração e data prevista;</li>
<li>responsável pelo recebimento e finalidade dos documentos;</li>
<li>canal protegido e prazo para envio;</li>
<li>como corrigir dado ou substituir arquivo ilegível.</li>
</ul>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho/perguntas-frequentes-carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">orientação oficial da Carteira de Trabalho Digital</a> informa que o empregador deve enviar ao eSocial o S-2200 antes do início das atividades ou, quando ainda faltarem dados, o S-2190 preliminar e depois a complementação no prazo do manual. O serviço para <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">obter a Carteira de Trabalho Digital</a> explica o acesso oficial. O candidato nunca precisa entregar sua senha gov.br para que a empresa faça o registro.</p>
<h2>Organize sem expor demais</h2>
<ol>
<li>peça a lista específica por escrito;</li>
<li>digitalize apenas o documento solicitado, com boa leitura;</li>
<li>nomeie os arquivos sem incluir informação sensível desnecessária;</li>
<li>envie pelo canal confirmado e guarde o protocolo;</li>
<li>apague cópias de computador público e não deixe documentos em grupo de mensagem.</li>
</ol>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados</a> estabelece princípios como finalidade, adequação e necessidade. Isso ajuda a formular uma pergunta legítima: “Para qual registro este documento será usado e é necessário enviar todas as páginas?” Não autoriza, por si só, recusar qualquer exigência sem analisar a finalidade legal.</p>
<h2>Exemplo em São Luís</h2>
<p>Um candidato recebe mensagem de número desconhecido pedindo foto de cartão bancário, senha e pagamento de exame. Ele não envia. Confirma a vaga no canal oficial da empresa, solicita a lista formal e pergunta quem realiza o exame e como será custeado. Documento bancário, quando realmente necessário para crédito salarial, não inclui senha, código de segurança ou acesso ao aplicativo.</p>
<h2>Sinais de golpe</h2>
<ul>
<li>cobrança para reservar vaga, liberar uniforme ou acelerar admissão;</li>
<li>pedido de código recebido por SMS ou acesso remoto ao celular;</li>
<li>urgência para enviar documentos antes de confirmar empresa e cargo;</li>
<li>link encurtado ou domínio que imita portal oficial;</li>
<li>pedido de dados de familiares sem finalidade explicada.</li>
</ul>
<h2>Antes de enviar, revise a pasta</h2>
<p>Abra cada arquivo e confirme legibilidade, frente e verso quando solicitado e correspondência com a lista. Não reúna documentos de várias pessoas em um único PDF. Se houver dependente, pergunte qual comprovação é necessária e para qual finalidade. Use senha diferente da sua conta pessoal quando o canal oferecer proteção própria; nunca envie essa senha junto do arquivo.</p>
<p>Depois da admissão, consulte seus registros pela Carteira de Trabalho Digital e compare empregador, data e função com o que foi acordado. Uma divergência deve ser comunicada pelo canal formal, sem editar captura de tela nem publicar dados pessoais em rede social.</p>
<h2>Exame ocupacional não é cobrança de seleção</h2>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-7-nr-7" target="_blank" rel="noopener noreferrer">NR-7 trata do Programa de Controle Médico de Saúde Ocupacional</a> e dos exames ocupacionais. Confirme com o empregador qual clínica, data, endereço e procedimento foram autorizados. Não pague boleto enviado por contato não verificado para “garantir” exame ou vaga. O resultado clínico deve seguir os limites de acesso e confidencialidade aplicáveis; recrutamento não autoriza circulação irrestrita de prontuário.</p>
<h2>Use uma matriz documento–finalidade</h2>
<table><thead><tr><th>Pedido</th><th>O que confirmar</th><th>O que nunca acompanha</th></tr></thead><tbody><tr><td>Identificação</td><td>registro e destinatário</td><td>senha ou código gov.br</td></tr><tr><td>Dados bancários</td><td>crédito salarial e titularidade</td><td>senha, token ou código do cartão</td></tr><tr><td>Dependentes</td><td>benefício ou obrigação informada</td><td>arquivo de familiar sem necessidade explicada</td></tr><tr><td>Comprovante</td><td>qual dado precisa ser demonstrado</td><td>páginas extras sem relação com a finalidade</td></tr></tbody></table>
<p>Marque cada item como solicitado, enviado ou corrigido e guarde a confirmação do canal. Se precisar reenviar, pergunte se a cópia anterior será descartada. Evite mandar a mesma pasta completa para vários contatos, pois isso amplia exposição sem melhorar o registro.</p>
<h2>Confira o vínculo no início, não meses depois</h2>
<p>No primeiro dia, confirme cargo, local, jornada, gestor e canal de RH. Depois, consulte a Carteira de Trabalho Digital e compare os dados quando o registro estiver disponível. Se a empresa pediu informação preliminar, isso não autoriza entregar senha para “terminar o cadastro”. Uma divergência deve ser descrita com data e documento, sem alterar imagem ou publicar dados em grupo.</p>
<h2>O que não enviar</h2>
<p>Nunca envie senha gov.br, código de autenticação, senha de banco, número completo de cartão com código de segurança ou acesso remoto ao celular. Uma empresa pode precisar de dados cadastrais e bancários, mas não precisa assumir suas contas pessoais.</p>
<p>Se houver dúvida, não comece atividade sem confirmação do vínculo e dos responsáveis. Divergência no registro, exigência discriminatória ou uso indevido de dados deve ser documentado e levado ao canal de privacidade, sindicato, inspeção do trabalho ou orientação jurídica conforme o caso. Este guia não cria uma lista universal nem substitui a instrução formal do empregador.</p>
`.trim()
  },
  "auxiliar-administrativo-vagas-sao-luis": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Este é um guia de preparação para processos de auxiliar administrativo em São Luís. Ele não anuncia vaga aberta nem afirma que determinada empresa está contratando. O objetivo é ajudar você a transformar experiência real em exemplos verificáveis e a entender o posto antes de aceitar uma proposta.</p>
<h2>Leia o anúncio como um fluxo de trabalho</h2>
<p>“Organização” é uma palavra ampla. Em uma rotina administrativa, ela pode significar localizar um documento sem atraso, registrar uma solicitação, conferir dados antes do envio, manter a agenda coerente ou encaminhar uma demanda à pessoa responsável. Marque no anúncio os verbos usados pela empresa e separe o que você já fez do que ainda precisaria aprender.</p>
<p>A página oficial da <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações (CBO)</a> explica que a classificação serve para reconhecer e codificar ocupações, mas não regulamenta profissão nem substitui a descrição do empregador. Use a CBO como referência de vocabulário; use o anúncio e a entrevista para confirmar as tarefas daquele posto.</p>
<h2>Converta experiência em evidência curta</h2>
<p>Escolha três situações que você consegue explicar sem exagero. Para arquivo, descreva o critério usado para nomear pastas, quem precisava acessar e como você conferia a versão correta. Para atendimento, conte como registrava nome, assunto, prazo e retorno. Para planilha, diga quais dados preenchia, que conferência fazia e a quem entregava o resultado. Não declare domínio de fórmula, ERP ou sistema que nunca utilizou.</p>
<p>Experiência informal também pode ser descrita com honestidade. Quem ajudou uma associação a organizar inscrições pode escrever “conferência de cadastros e separação de documentos para atendimento”, indicando o contexto e o período. Isso é mais útil que adotar um cargo que não existiu. Leve para a entrevista um exemplo hipotético sem dados pessoais: uma lista fictícia, um e-mail profissional ou uma estrutura de pastas.</p>
<h2>Prepare-se para um exercício prático</h2>
<p>Treine quatro ações: responder um e-mail com assunto claro; ordenar uma tabela; identificar um dado duplicado; e priorizar três solicitações com prazos diferentes. Ao explicar sua decisão, mencione o critério: prazo, impacto, dependência de outra pessoa e necessidade de confirmação. O objetivo não é adivinhar o sistema da empresa, mas mostrar raciocínio e cuidado.</p>
<p>Se o exercício usar dados de clientes ou empregados, pergunte se são fictícios. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados</a> define dado pessoal e inclui, entre os dados sensíveis, informações de saúde, origem racial ou étnica, religião, opinião política, filiação sindical, dados genéticos e biométricos. Em seleção, envie somente o necessário pelo canal confirmado; nunca compartilhe senha, código de autenticação ou planilha de outra organização.</p>
<h2>Perguntas que revelam a rotina real</h2><ul><li>Quais tarefas ocupam a maior parte do dia e quais são ocasionais?</li><li>Quem define prioridades quando chegam pedidos simultâneos?</li><li>Há treinamento para o sistema usado e quem valida lançamentos novos?</li><li>O atendimento ocorre por telefone, e-mail, balcão ou WhatsApp corporativo?</li><li>Qual é o horário efetivo, o local e a política para documentos confidenciais?</li></ul>
<p>Essas perguntas não garantem boa gestão, mas permitem comparar o anúncio com o trabalho oferecido. Em São Luís, calcule também o trajeto no horário de entrada e saída. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com a tarifa e a quantidade de viagens informadas por você; o portal não presume salário ou benefício.</p>
<h2>Revise a candidatura antes do envio</h2>
<p>No currículo, traga para o início tarefas relacionadas ao posto, mantendo datas e contextos verdadeiros. Nomeie o PDF de forma simples, abra o arquivo para conferir cortes e teste telefone e e-mail. Registre empresa, cargo, URL, data e versão enviada no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>. Não inclua CPF, RG, dados bancários ou documentos completos no currículo.</p>
<p>Desconfie de promessa de contratação, cobrança por material, curso obrigatório vendido pelo recrutador ou urgência para fornecer dados. Confira a origem no canal institucional e leia a página de <a href="/seguranca-candidatos">segurança do candidato</a>. Este guia não substitui instrução formal do empregador nem garante entrevista; ele oferece um método para apresentar o que você realmente sabe fazer.</p>
    `.trim()
  },

  "vaga-recepcionista-clinica-sao-luis": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Este texto orienta a preparação para processos de recepção em clínicas e consultórios. Não há afirmação de vaga aberta. Em saúde, atender bem inclui organizar fluxo e proteger informação: simpatia sozinha não demonstra como você agiria diante de agenda cheia, paciente ansioso ou dado confidencial.</p>
<h2>Entenda o percurso do paciente</h2><p>Leia o anúncio e desenhe um fluxo simples: primeiro contato, identificação, confirmação de horário, chegada, encaminhamento, retorno e registro de pendência. Pergunte quais etapas pertencem à recepção e quais são responsabilidade clínica ou financeira. Isso evita prometer tarefas para as quais você não foi treinado.</p>
<p>Prepare dois exemplos verdadeiros. Um pode mostrar como você organizou fila ou agenda sem apagar o histórico; outro pode explicar como manteve educação ao informar atraso. Se nunca trabalhou em clínica, use experiências transferíveis de escola, comércio ou atendimento, deixando claro o contexto. Não invente uso de prontuário eletrônico, convênio ou sistema de marcação.</p>
<h2>Dados de saúde exigem cuidado especial</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados</a> classifica informações referentes à saúde como dados pessoais sensíveis. Para a candidata, a aplicação prática é simples: não use nomes reais em exemplos, não fotografe tela ou ficha, não encaminhe prontuário para conta pessoal e não confirme detalhes de atendimento a terceiros sem o procedimento definido pela clínica.</p>
<p>Na entrevista, pergunte onde são registrados recados, quem pode consultar a agenda, como ocorre a identificação do paciente e qual canal deve ser usado para retorno. “Discrição” não significa decidir sozinha o que esconder; significa seguir acesso autorizado, confirmar destinatário e pedir orientação quando houver dúvida. A recepção não deve oferecer diagnóstico ou interpretar resultado de exame.</p>
<h2>Treine prioridades sem tratar pessoas como números</h2><p>Faça uma simulação com quatro eventos: o telefone toca, chega um paciente, há uma mensagem pendente e o profissional avisa atraso. Explique sua ordem de ação em voz alta. Uma resposta responsável reconhece quem está presente, registra o telefonema para retorno, comunica apenas o que foi autorizado e aciona a pessoa responsável por decisões clínicas.</p>
<p>Também vale treinar mensagens objetivas. Em vez de “doutor atrasou muito”, use algo como: “Seu atendimento está com atraso; posso confirmar com a equipe a nova previsão e retornar?”. O exemplo não cria um protocolo universal. Cada estabelecimento deve informar o que a recepção pode comunicar e como proceder em urgência.</p>
<h2>O que confirmar antes de aceitar</h2><ul><li>Qual é o horário real, incluindo abertura, fechamento, sábados e eventuais plantões?</li><li>Há treinamento para agenda, telefone, convênios e proteção de dados?</li><li>Quantas pessoas atendem presencialmente e por mensagem no mesmo turno?</li><li>Quem decide encaixes, prioridades clínicas e comunicação de atrasos?</li><li>O posto exige cobrança, caixa ou tarefas administrativas além da recepção?</li></ul>
<p>Peça uma descrição clara do cargo e compare com sua disponibilidade. Em São Luís, simule o deslocamento no horário de saída e calcule o custo com valores atuais informados por você na <a href="/ferramentas/custo-deslocamento">ferramenta do portal</a>. Não conclua que uma escala ou benefício existe apenas porque outra clínica oferece.</p>
<h2>Currículo e segurança no processo</h2><p>Destaque tarefas comprováveis: confirmação de agenda, registro de recados, atendimento telefônico, organização de documentos ou conciliação de fila. Acrescente ferramenta somente se souber explicar como a usava. Se a empresa pedir documento, confirme domínio, endereço e responsável antes do envio; currículo inicial não precisa conter CPF, RG, dado bancário ou laudo médico.</p>
<p>Uma cobrança para “liberar uniforme”, treinamento vendido como condição da entrevista ou pedido de senha é sinal para interromper. Consulte a página de <a href="/seguranca-candidatos">segurança do candidato</a> e guarde a URL do anúncio. Este guia é informativo, não substitui o treinamento da clínica nem promete contratação.</p>
    `.trim()
  },

  "vagas-call-center-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia ajuda a avaliar processos de teleatendimento e call center; não anuncia oportunidades nem presume que uma operação em São Luís esteja contratando. O trabalho pode ser ativo, receptivo ou misto, e as condições precisam ser confirmadas no anúncio, na entrevista e no contrato.</p>
<h2>Diferencie o serviço antes de preparar respostas</h2><p>Pergunte qual é o objetivo principal do contato: informar, registrar solicitação, prestar suporte, negociar ou vender. Descubra também os canais usados, porque atendimento por voz, chat e e-mail exigem ritmos diferentes. No currículo, descreva fatos: quantidade de canais que operava, tipo de registro realizado e exemplo de conflito resolvido. Não invente volume, meta ou indicador.</p>
<p>Para uma simulação, use uma situação fictícia e sem dados de cliente. Ouça até o fim, confirme o que entendeu, explique o próximo passo permitido e registre o protocolo. Evite prometer prazo que não controla. O recrutador consegue observar clareza, escuta e registro sem que você revele informações de empregos anteriores.</p>
<h2>Use a NR 17 para formular perguntas concretas</h2><p>O <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-17-atualizada-2022.pdf" target="_blank" rel="noopener noreferrer">Anexo II da NR 17</a> trata de teleatendimento e telemarketing, abrangendo centrais ativas e receptivas com telefone e sistema. O texto oficial estabelece requisitos de mobiliário, equipamentos, organização, capacitação e condições sanitárias.</p>
<p>Segundo o Anexo II, o tempo efetivo em teleatendimento é de no máximo seis horas diárias, com pausas incluídas, sem prejuízo de regras legais aplicáveis. Para a jornada prevista no anexo, há dois períodos contínuos de dez minutos fora do posto e intervalo de vinte minutos para repouso e alimentação; jornadas efetivas de até quatro horas têm uma pausa contínua de dez minutos. Não transforme esse resumo em cálculo do seu caso: confirme função, jornada e enquadramento com o empregador e consulte o texto vigente.</p>
<p>A mesma norma prevê pausa após operação com ameaça, abuso verbal, agressão ou desgaste especial e inclui treinamento sobre riscos à saúde, voz, audição, visão, mobiliário e equipamentos. Em vez de perguntar apenas “tem pausa?”, peça para saber como a escala é registrada, como o trabalhador acessa o registro e qual procedimento existe após atendimento agressivo.</p>
<h2>Checklist do posto presencial ou remoto</h2><ul><li>O serviço é ativo, receptivo ou misto e quais indicadores são acompanhados?</li><li>Como ocorre o treinamento inicial e a atualização de scripts e sistemas?</li><li>Quais equipamentos são fornecidos e quem responde por manutenção?</li><li>Como as pausas são programadas e registradas?</li><li>Existe canal para falha técnica, ameaça de cliente e problema de saúde?</li></ul>
<p>No trabalho remoto, não presuma que computador, headset, internet ou energia serão reembolsados. Peça a política por escrito e calcule o que ficaria sob sua responsabilidade. No presencial, confira endereço, transporte no horário de saída e local seguro para pertences.</p>
<h2>Mostre qualidade sem decorar frases</h2><p>Prepare uma resposta de noventa segundos com contexto, ação e resultado real. Exemplo: “Recebi uma reclamação sobre pedido; confirmei o número, consultei o status, expliquei o prazo disponível e registrei retorno”. Troque o exemplo pelos seus fatos. Se não houver experiência, pratique com um cenário fictício e diga que é simulação.</p>
<p>Leia qualquer política de variável antes de aceitar. Pergunte qual indicador entra no cálculo, período de apuração, acesso ao resultado e tratamento de contestação. Não presuma comissão ou desconto a partir de conversa informal. Registre a candidatura no <a href="/ferramentas/controle-candidaturas">controle gratuito</a> sem dados sensíveis.</p>
<p>Pedido de pagamento, instalação de aplicativo de acesso remoto ou compartilhamento de senha não faz parte de candidatura segura. Confira o canal e use a página de <a href="/seguranca-candidatos">segurança do candidato</a>. O conteúdo é geral e não substitui sindicato, inspeção do trabalho ou orientação jurídica.</p>
    `.trim()
  },

  "vagas-estoque-logistica-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este conteúdo ensina a avaliar processos para estoque e logística em São Luís. Não lista vagas abertas e não presume salário, turno ou atividade. “Estoque” pode envolver recebimento, conferência, separação, armazenagem, inventário, expedição ou apoio de loja; o anúncio precisa dizer qual combinação pertence ao posto.</p>
<h2>Traduza o cargo em etapas verificáveis</h2><p>Desenhe o caminho de uma mercadoria: chega com documento, é conferida, identificada, armazenada, separada e entregue ao destino. Marque as etapas em que você já trabalhou. No currículo, escreva verbos e objetos reais, como “conferia quantidade com pedido” ou “registrava entrada no sistema”. Evite declarar redução de perdas ou domínio de equipamento sem evidência.</p>
<p>Se sua experiência foi informal, indique o contexto. Organizar materiais de uma associação pode demonstrar contagem, identificação e registro, mas não autoriza afirmar operação de empilhadeira, inventário contábil ou responsabilidade por depósito. Em entrevista, explique como percebeu uma divergência, quem confirmou e qual registro foi corrigido.</p>
<h2>Segurança deve aparecer antes do primeiro turno</h2><p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-11-atualizada-2022.pdf" target="_blank" rel="noopener noreferrer">NR 11 do Ministério do Trabalho e Emprego</a> trata de transporte, movimentação, armazenagem e manuseio de materiais. A norma possui requisitos específicos para equipamentos e operações. Não use este guia como autorização para operar máquina: pergunte que treinamento, habilitação interna, supervisão e equipamento de proteção o posto exige.</p>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-17-atualizada-2022.pdf" target="_blank" rel="noopener noreferrer">NR 17</a> estabelece diretrizes ergonômicas e inclui levantamento, transporte e descarga individual de cargas. Peso, frequência, distância, altura e equipamento disponível mudam a tarefa. Pergunte isso antes de aceitar; “serviço leve” em anúncio não substitui descrição do trabalho.</p>
<h2>Monte uma evidência de conferência</h2><p>Treine com uma tabela fictícia de dez itens. Compare código, descrição, quantidade e condição; se houver diferença, separe o item e registre a pendência em vez de ajustar o número para “bater”. Explique qual documento acompanha a decisão e quem autoriza a correção. O objetivo é mostrar rastreabilidade, não velocidade teatral.</p>
<p>Para validade e lote, diga apenas o que já fez. Um exemplo honesto: “Durante a reposição, comparei a data do produto com a regra informada pelo encarregado e separei a unidade divergente”. Não transforme isso em afirmação de responsabilidade técnica. Cada estabelecimento define procedimento, sistema e cadeia de aprovação.</p>
<h2>Perguntas para comparar propostas</h2><ul><li>A atividade principal é recebimento, separação, inventário, expedição ou loja?</li><li>Há levantamento manual de carga; quais pesos, alturas e frequências?</li><li>Quais equipamentos são usados e qual treinamento precede a operação?</li><li>O turno inclui madrugada, fechamento, domingos ou transporte especial?</li><li>Como divergências e avarias são registradas e quem decide a correção?</li></ul>
<p>Em São Luís, confira o endereço do depósito, não apenas o bairro da empresa. Simule ida e volta no horário informado e registre seus próprios valores na <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a>. Não presuma vale-transporte, adicional ou refeição sem confirmação no anúncio ou contrato. Guarde uma lista das respostas para comparar propostas sem depender da memória.</p>
<h2>Envio seguro e limite do currículo</h2><p>Adapte o currículo para a etapa dominante do posto e inclua ferramentas apenas quando verdadeiras: leitor, planilha, sistema, carrinho ou equipamento específico. Certificado deve corresponder a curso concluído e verificável. Não envie documentos completos antes de confirmar empresa, vaga e canal.</p>
<p>Taxa para uniforme, curso ou liberação de crachá é sinal de risco. Guarde a URL, confira o responsável e consulte a página de <a href="/seguranca-candidatos">segurança do candidato</a>. Este guia não substitui treinamento de segurança, procedimento da empresa ou avaliação profissional das condições do posto.</p>
    
<h2>Compare o processo antes de comparar o nome do cargo</h2>
<p>“Auxiliar de estoque” em loja, centro de distribuição, hospital ou oficina pode lidar com unidades, riscos, documentos e ritmos diferentes. Monte uma tabela por anúncio com recebimento, endereço de armazenagem, tipo de item, separação, expedição, sistema, equipamento, peso informado e treinamento exigido. Campo ausente fica “a confirmar”; não transforme silêncio em requisito atendido.</p>
<h2>Descreva uma divergência do início ao fim</h2>
<p>Prepare um caso verdadeiro no formato: o que deveria chegar, o que foi observado, qual registro foi consultado, quem foi avisado e qual correção foi autorizada. Se nunca teve autonomia para alterar o sistema, diga isso. Uma resposta segura pode ser: “isolei o item, preservei a identificação e levei a diferença ao responsável”. Não declare descarte, ajuste contábil ou liberação de carga fora de sua função.</p>
<h2>Avalie turno e deslocamento em São Luís</h2>
<p>Anote bairro ou ponto de referência confirmado, início e fim do turno, escala declarada, transporte oferecido e canal de entrada fora do horário comercial. Teste o trajeto nos horários reais e tenha alternativa para retorno; duração estimada por aplicativo não é garantia. Para anúncio com base em outro município, não rotule como São Luís apenas porque o recrutamento ocorreu na capital.</p>
<h2>Leve perguntas objetivas para a entrevista</h2>
<ul><li>qual etapa ocupa a maior parte do turno;</li><li>quais equipamentos exigem autorização ou treinamento;</li><li>como divergências e avarias são registradas;</li><li>quem confere a correção no sistema;</li><li>qual é o local efetivo de trabalho e a escala.</li></ul>
<p>Se houver movimentação manual, compare a atividade descrita com as orientações de ergonomia da <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-17-atualizada-2022.pdf" target="_blank" rel="noopener noreferrer">NR 17</a> e peça informação sobre procedimento e treinamento.</p>
`.trim()
  },

  "vagas-motorista-entregador-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia é para analisar processos de motorista e entregador em São Luís; não anuncia vaga nem estima ganho. Antes de candidatar-se, identifique se haverá vínculo de emprego, trabalho por plataforma, prestação autônoma ou outra relação. Veículo, custos, riscos e forma de pagamento mudam completamente a comparação.</p>
<h2>Separe requisito legal de promessa comercial</h2><p>Leia no anúncio a categoria de habilitação exigida e compare com o documento que você possui. O serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-online-os-dados-de-sua-habilitacao-de-transito" target="_blank" rel="noopener noreferrer">Consultar on-line os dados da habilitação</a> permite ao próprio condutor verificar informações da CNH pelo canal governamental. Use somente o aplicativo ou endereço oficial; não forneça senha gov.br ou código de autenticação ao recrutador.</p>
<p>Não conclua que uma CNH válida basta para qualquer atividade. Tipo de veículo, carga, passageiros, atividade remunerada e exigências específicas precisam ser confirmados com o empregador e nos canais de trânsito competentes. Se o anúncio for vago, peça a descrição antes de enviar documento.</p>
<h2>Descubra quem fornece e quem paga</h2><p>Faça uma tabela com veículo, combustível, manutenção, pneus, seguro, telefone, dados móveis, estacionamento, pedágio e equipamento de proteção. Para cada item, marque “empresa”, “trabalhador” ou “a confirmar”. Não aceite um valor bruto como renda líquida antes de registrar custos previsíveis e variações de rota.</p>
<p>Se o veículo for da empresa, confirme retirada, devolução, abastecimento, vistoria e procedimento em pane ou colisão. Se for próprio, peça por escrito como o pagamento é calculado e quais despesas não são reembolsadas. Não invente uma média de entregas: volume, distância e tempo dependem da operação e do dia.</p>
<h2>Converta direção em evidência profissional</h2><p>Prepare exemplos verdadeiros sobre inspeção antes da saída, conferência de endereço, comunicação de imprevisto e registro de entrega. Um relato forte descreve contexto, decisão e consequência sem expor cliente: “identifiquei divergência no endereço, parei em local seguro, confirmei pelo canal da operação e atualizei o registro”.</p>
<p>Não use o celular dirigindo para demonstrar agilidade. Pergunte como a empresa espera que o condutor consulte rota, registre ocorrência e responda a mensagens com o veículo parado. Também confirme quem decide sobre tentativa de entrega em local inseguro e qual suporte existe após roubo, ameaça ou acidente.</p>
<h2>Perguntas antes do aceite</h2><ul><li>Qual é o tipo de contrato e quem é o responsável formal pela contratação?</li><li>O veículo é próprio ou fornecido; quais custos ficam com cada parte?</li><li>Qual área de atendimento e como são distribuídas as rotas?</li><li>Há carga, descarga, cobrança ou manuseio de dinheiro?</li><li>Qual é o procedimento para pane, sinistro, assalto e entrega não concluída?</li><li>Como jornada, intervalos, horas e resultados são registrados?</li></ul>
<p>Simule o trajeto no horário real, mas não prometa tempo impossível. Chuva, obras, fila e restrições do local alteram a rota. Registre no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> a URL, a empresa, a data e as respostas recebidas; não armazene senha, documento completo ou dado de cliente.</p>
<h2>Proteja documentos e dinheiro</h2><p>É legítimo que uma contratação confirmada solicite documentos necessários, mas isso deve ocorrer por canal identificável e na etapa adequada. O recrutador não precisa da sua senha gov.br, código de verificação ou acesso remoto ao telefone. Cobrança para liberar rota, aplicativo, uniforme ou cadastro é sinal para interromper e verificar.</p>
<p>Confira a empresa e leia a página de <a href="/seguranca-candidatos">segurança do candidato</a>. Este conteúdo não substitui orientação de trânsito, contrato, sindicato ou assessoria jurídica. Ele oferece perguntas para que custos e responsabilidades não apareçam apenas depois do primeiro dia.</p>
    
<h2>Confirme qual regra se aplica à atividade descrita</h2>
<p>O <a href="https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm" target="_blank" rel="noopener noreferrer">Código de Trânsito Brasileiro compilado</a> reúne disposições sobre habilitação e atividade remunerada, além de regras específicas para determinadas operações. Motorista contratado por empresa, motociclista em motofrete, entregador por plataforma e prestador com veículo próprio não são a mesma situação. Leia veículo, carga, vínculo e serviço do anúncio e confirme exigências no órgão de trânsito competente; este guia não classifica juridicamente o caso.</p>
<h2>Simule uma jornada completa, inclusive exceções</h2>
<p>Desenhe retirada do veículo ou mercadoria, vistoria, sequência de paradas, confirmação de entrega, devolução e fechamento. Depois inclua endereço não localizado, avaria e pane. Para cada exceção, anote quem autoriza mudança de rota, onde registrar evidência e qual canal usar. Não fotografe documento ou residência de cliente além do procedimento formal e não publique imagem da entrega.</p>
<h2>Calcule custo e risco sem chamar faturamento de renda</h2>
<p>Em veículo próprio, registre por semana combustível, manutenção reservada, pneus, seguro, dados móveis, estacionamento e tempo sem entrega. Separe valor recebido de reembolso e de incentivo condicionado. Não projete mês usando o melhor dia. Em veículo da empresa, confirme responsabilidade por abastecimento, multas, avarias, pernoite e franquia, sempre no documento ou canal oficial.</p>
<h2>Teste rota e turno em São Luís</h2>
<p>Confirme o ponto real de saída, bairros atendidos, horário de retorno, procedimento em chuva forte e apoio quando o veículo não puder prosseguir. Compare o trajeto nos horários informados e mantenha contato de emergência da operação. Se a vaga exigir acesso a porto, área industrial, condomínio ou outro local controlado, peça a lista de credenciais antes de deslocar-se; não pague taxa a intermediário para “liberar cadastro”.</p>
`.trim()
  },

  "vagas-restaurante-sao-luis-dicas": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Este é um guia para avaliar processos em restaurante, lanchonete, cozinha e salão. Não há anúncio de vaga aberta. As tarefas variam entre atendimento, preparo, apoio, limpeza, caixa, entrega e estoque; confirme a função em vez de presumir que toda equipe faz a mesma coisa.</p>
<h2>Observe o fluxo, não só o nome do cargo</h2><p>Peça ao recrutador que descreva um turno: preparação, abertura, pico, fechamento e limpeza. Pergunte em quais etapas o cargo atua e quem supervisiona. Uma pessoa candidata a auxiliar de cozinha, por exemplo, precisa saber se manipulará alimento, fará higienização de utensílio, receberá mercadoria ou apoiará montagem. “Ajudar em tudo” não é descrição suficiente.</p>
<p>No currículo, use experiências que consegue explicar: organização de bancada, conferência de pedido, atendimento de mesa, registro de comanda ou limpeza conforme orientação. Se ajudou em evento familiar ou comunitário, identifique esse contexto; não transforme apoio eventual em vínculo ou função profissional inexistente.</p>
<h2>Higiene é procedimento, não aparência</h2><p>A <a href="https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2004/res0216_15_09_2004.html" target="_blank" rel="noopener noreferrer">RDC 216/2004 da Anvisa</a> estabelece boas práticas para serviços de alimentação. O texto inclui capacitação, higiene e saúde dos manipuladores, limpeza, prevenção de contaminação e condições de equipamentos e instalações.</p>
<p>A resolução orienta que manipuladores lavem cuidadosamente as mãos ao chegar, antes e depois de manipular alimentos, após interrupções, contato com material contaminado e uso do sanitário. Também trata de uniformes compatíveis, cabelos protegidos, unhas curtas e retirada de adornos durante a manipulação. Esses pontos não autorizam diagnóstico ou exigência inventada: pergunte qual treinamento, uniforme e procedimento o estabelecimento fornece para a função.</p>
<p>Em uma entrevista prática, não improvise técnica que você não conhece. Diga o que faria para evitar contaminação cruzada e a quem pediria orientação. Não leve alimento de casa nem use produto de limpeza sem autorização. Segurança alimentar depende do processo completo, não de uma resposta decorada.</p>
<h2>Como avaliar o turno e a remuneração</h2><ul><li>Qual é o horário de entrada, encerramento e saída efetiva após a limpeza?</li><li>Como funciona a escala de fins de semana e feriados?</li><li>Existe intervalo, refeição e local definido para a equipe?</li><li>Uniforme e equipamentos são fornecidos; quem cuida da lavagem?</li><li>Há gorjeta ou taxa de serviço; como são registradas e distribuídas?</li><li>O posto acumula caixa, entrega, limpeza ou recebimento de mercadoria?</li></ul>
<p>Não some gorjeta ao salário antes de entender o critério e a variação. Peça que remuneração, benefícios, escala e atribuições sejam apresentados com clareza. Para comparar propostas, anote valores confirmados e use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com os dados que você conhece.</p>
<h2>Prepare um exemplo para horário de pico</h2><p>Escolha uma situação verdadeira em que várias solicitações chegaram ao mesmo tempo. Explique como confirmou prioridade, comunicou espera e manteve o registro. Se não tem experiência, use cenário fictício e diga que é simulação. Uma resposta responsável não promete rapidez ilimitada nem ignora higiene para “dar conta”.</p>
<p>Confirme também como erros de pedido, quebra de equipamento e acidente são comunicados. O objetivo é entender se existe liderança e procedimento, não avaliar o estabelecimento por uma fotografia ou postagem de rede social.</p>
<h2>Candidatura sem custo e sem atalho</h2><p>Guarde URL, empresa, cargo e data. Não pague por uniforme, exame, curso ou reserva de entrevista a um contato não verificado. Não envie documento completo na primeira mensagem e nunca compartilhe senha ou código. Consulte a página de <a href="/seguranca-candidatos">segurança do candidato</a> quando houver pressão ou cobrança.</p>
<p>Este guia não substitui treinamento de boas práticas, norma local, contrato, sindicato ou orientação jurídica. As regras do estabelecimento e a legislação podem mudar; confirme sempre a fonte vigente e as condições específicas da proposta.</p>
    `.trim()
  },

  "vaga-sazonal-comercio-sao-luis": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Este guia diferencia aumento sazonal de movimento e contrato de trabalho temporário. Ele não anuncia vaga nem prevê efetivação. Uma empresa pode reforçar a equipe em período de maior demanda por diferentes formas de contratação; somente o anúncio, a proposta e o contrato identificam a relação oferecida.</p>
<h2>Sazonalidade não define sozinha o contrato</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l6019.htm" target="_blank" rel="noopener noreferrer">Lei nº 6.019/1974</a> define trabalho temporário como aquele em que uma empresa de trabalho temporário coloca o trabalhador à disposição de uma tomadora para substituir pessoal permanente de forma transitória ou atender demanda complementar de serviços. A lei inclui demanda previsível de natureza intermitente, periódica ou sazonal.</p>
<p>Isso não significa que todo anúncio “de fim de ano” seja automaticamente contrato temporário nos termos da lei. Antes de aceitar, identifique quem será o empregador, qual empresa é a tomadora, qual o motivo, o prazo e a forma de registro. A lei determina contrato escrito entre a empresa de trabalho temporário e o trabalhador e proíbe a empresa de trabalho temporário de cobrar qualquer importância do trabalhador, salvo descontos previstos em lei.</p>
<h2>Leia prazo e condições sem contar com promessa</h2><p>A lei prevê, para o mesmo empregador, limite de até 180 dias, consecutivos ou não, com possibilidade de prorrogação por até 90 dias quando persistirem as condições que justificaram o trabalho temporário. Esse teto não é duração obrigatória. Seu contrato pode ser mais curto; leia a data, o motivo e as regras de término.</p>
<p>Não trate “chance de efetivação” como renda futura. Pergunte se existe processo posterior, mas planeje suas despesas com o que está documentado. A proibição legal de cláusula que impeça contratação posterior pela tomadora não cria obrigação de efetivar ninguém.</p>
<h2>O que confirmar no processo</h2><ul><li>Qual é a razão social da empresa que assinará o contrato?</li><li>Existe empresa de trabalho temporário e ela está identificada?</li><li>Qual o início, o prazo e o motivo da demanda temporária?</li><li>Qual atividade, local, jornada, remuneração e benefício constam da proposta?</li><li>Como horas, folgas, comissões e término serão registrados?</li><li>Há alguma cobrança? Se houver, interrompa e verifique a legalidade.</li></ul>
<p>Se o posto for em comércio, pergunte sobre atendimento, caixa, estoque, embalagem e fechamento. Um contrato curto não elimina a necessidade de treinamento, segurança e descrição clara. Também não autoriza o candidato a inventar experiência para “entrar rápido”.</p>
<h2>Prepare currículo para o pico sem conteúdo genérico</h2><p>Mostre tarefas que ajudam em demanda concentrada: atendimento com fila, reposição organizada, conferência de preço, registro de pedido ou apoio de estoque. Dê um exemplo real de prioridade sob pressão. Se nunca trabalhou no setor, use experiência transferível e diga de onde ela veio.</p>
<p>Mantenha disponibilidade exata. Quem estuda à noite não deve marcar turno integral esperando negociar depois. Em São Luís, verifique o transporte no horário de fechamento e calcule o custo real na <a href="/ferramentas/custo-deslocamento">ferramenta do portal</a>.</p>
<h2>Acompanhe registro e encerramento</h2><p>A <a href="https://www.gov.br/pt-br/temas/carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> é o canal oficial para consultar informações da vida laboral. Depois da admissão, confira os registros disponíveis e comunique divergência pelos canais formais. Guarde contrato, comprovantes e contatos sem publicar dados pessoais em rede social.</p>
<p>Nas últimas semanas, atualize seu controle de candidaturas e continue a busca de forma compatível com o horário contratado. Não use informação interna da empresa nem abandone obrigações. Se houver dúvida sobre pagamento, encerramento ou registro, procure sindicato, inspeção do trabalho ou orientação jurídica.</p>
<p>Cobrança por seleção, promessa de efetivação garantida ou pedido de senha gov.br são sinais de risco. Leia a página de <a href="/seguranca-candidatos">segurança do candidato</a>. Este conteúdo é geral e não substitui análise do seu contrato.</p>
    `.trim()
  },

  "vagas-pcd-inclusao-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia apoia pessoas com deficiência na avaliação de processos seletivos e postos de trabalho. Não anuncia vaga, não interpreta laudo e não promete contratação. Acessibilidade deve ser verificada na prática: deslocamento, comunicação, seleção, ferramentas, banheiro, circulação, treinamento e rotina.</p>
<h2>Comece pelas funções essenciais do posto</h2><p>Peça uma descrição clara das tarefas, do ambiente e dos equipamentos. Separe requisito essencial de preferência genérica. A pergunta central não é “você consegue fazer tudo sem apoio?”, mas quais atividades compõem o trabalho e que condições permitem realizá-las com autonomia, segurança e igualdade.</p>
<p>Prepare exemplos verdadeiros sobre sua experiência e sobre recursos que já funcionam para você. Não é necessário transformar deficiência em narrativa inspiradora. Fale de trabalho: como acessa informação, executa tarefa, se comunica e resolve barreira. Se ainda não conhece o recurso adequado, diga que precisa entender o posto antes de definir.</p>
<h2>O que a legislação oferece como referência</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm" target="_blank" rel="noopener noreferrer">Lei Brasileira de Inclusão</a> trata do direito ao trabalho em ambiente acessível e inclusivo, em igualdade de oportunidades, e veda discriminação nas etapas de recrutamento, seleção, contratação, permanência e ascensão. O texto legal também aborda acessibilidade e adaptação razoável; a aplicação ao caso concreto pode exigir orientação especializada.</p>
<p>O <a href="https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm" target="_blank" rel="noopener noreferrer">artigo 93 da Lei nº 8.213/1991</a> estabelece reserva de 2% a 5% dos cargos para beneficiários reabilitados ou pessoas com deficiência habilitadas em empresas com 100 ou mais empregados, conforme o número total de empregados. A existência da cota não substitui análise de acessibilidade nem autoriza anúncio impreciso.</p>
<h2>Perguntas para a seleção e para o local</h2><ul><li>Como será cada etapa e existe alternativa acessível para prova, vídeo ou dinâmica?</li><li>Qual é o endereço exato e o trajeto desde a entrada até o posto?</li><li>Há degraus, elevador, sinalização, banheiro e circulação adequados à necessidade informada?</li><li>Quais tecnologias, formatos de comunicação ou ajustes já estão disponíveis?</li><li>Quem conversa sobre adaptação e como a solicitação fica registrada?</li><li>O anúncio é afirmativo para PcD ou de ampla concorrência, e qual documentação será solicitada?</li></ul>
<p>Em São Luís, avalie também a acessibilidade do transporte e o horário real de entrada e saída. Uma fachada acessível não comprova o percurso completo. Se for possível, peça descrição, foto institucional do acesso ou visita combinada; não se exponha a deslocamento sem confirmar endereço e responsável.</p>
<h2>Documentos e privacidade</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> classifica informação referente à saúde como dado pessoal sensível. Pergunte por que o documento é necessário, em qual etapa, por qual canal será recebido e quem terá acesso. Não envie laudo em grupo, perfil público ou contato sem identidade confirmada. Senha, código gov.br e acesso ao telefone nunca devem ser compartilhados.</p>
<p>Se o formulário não for acessível, registre o problema e peça canal alternativo. Isso não é favor nem prova de incapacidade; é uma condição para participar. Guarde data, URL e resposta recebida. Evite publicar o documento ou dados médicos para cobrar retorno.</p>
<h2>Avalie a resposta, não apenas o discurso</h2><p>Uma resposta útil identifica responsável, prazo e medida concreta. Frases como “depois a gente vê” deixam risco para o primeiro dia. Peça que ajustes combinados constem no fluxo de admissão ou em comunicação formal. Se houver recusa, exposição indevida ou requisito discriminatório, documente os fatos e procure os canais oficiais, sindicato, Ministério Público do Trabalho ou orientação jurídica conforme o caso.</p>
<p>No currículo, destaque formação, experiência e tarefas relevantes; não precisa inserir diagnóstico. Use o <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> sem anexar dados sensíveis. Este guia oferece perguntas práticas e fontes primárias, mas não substitui análise individual, laudo profissional ou assessoria jurídica.</p>
    `.trim()
  },

  "golpe-vaga-emprego-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia explica como verificar uma oferta antes de enviar documentos ou dinheiro. Não anuncia vaga e não afirma que um contato específico é fraudulento. O objetivo é transformar a urgência em uma sequência curta de checagens.</p>
<h2>Pare antes do pagamento</h2><p>Uma mensagem promete contratação rápida, mas exige PIX para uniforme, exame, curso, cadastro ou “reserva da vaga”. Não pague enquanto tenta descobrir quem está do outro lado. Alertas de órgãos públicos mostram que falsas seleções podem combinar promessa de emprego, pedido de documento e cobrança. O <a href="https://www.gov.br/ibama/pt-br/assuntos/notas/2026/alerta-sobre-tentativas-de-golpe-fique-atento-a-falsas-divulgacoes-de-concursos-publicos" target="_blank" rel="noopener noreferrer">alerta do Ibama sobre falsos processos seletivos</a> recomenda desconfiar de recadastramento, envio de documentos e pagamento de taxas. A <a href="https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/cuidado-com-o-golpe-a-anvisa-nao-vende-certificados-para-quem-busca-recolocacao-profissional" target="_blank" rel="noopener noreferrer">Anvisa também documentou fraude contra pessoas em recolocação</a>, com material adulterado e certificado vendido por mensagem.</p>
<p>Gratuidade, sozinha, não prova legitimidade. Compare o endereço do site, o domínio do e-mail e o telefone com os canais publicados pela própria empresa. Não use o número enviado pelo suposto recrutador para “confirmar” a história; encontre o contato por fonte independente. Busque razão social e nome do responsável, mas não conclua que duas empresas são iguais apenas porque têm nomes parecidos.</p>
<h2>Faça uma checagem em quatro camadas</h2><ol><li><strong>Anúncio:</strong> cargo, local, jornada, requisitos e canal devem formar uma descrição coerente. Salário muito alto sem função definida merece pausa, não entusiasmo automático.</li><li><strong>Empresa:</strong> abra o site institucional digitado por você e procure a área de carreiras. Se a marca não publicar a vaga, pergunte ao canal oficial se aquele recrutamento existe.</li><li><strong>Contato:</strong> e-mail corporativo ajuda, mas pode ser falsificado. Confirme o nome do recrutador no telefone geral ou atendimento oficial.</li><li><strong>Pedido:</strong> senha, código de autenticação, acesso ao aparelho e transferência de dinheiro não são documentos de candidatura.</li></ol>
<p>Para uma oportunidade publicada no Empregos São Luís, use apenas o canal indicado na página da vaga e confira a nossa <a href="/seguranca-candidatos">política de segurança do candidato</a>. O portal não vende posição na fila nem garante contratação.</p>
<h2>Proteja documentos e contas</h2><p>Currículo já reúne telefone, e-mail, histórico e localização aproximada. Envie somente o necessário para a etapa informada. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> adota princípios de finalidade, adequação e necessidade para o tratamento de dados. Isso é uma referência útil para perguntar por que CPF, documento ou dado bancário seria necessário naquele momento. Não envie selfie com documento em grupo, link encurtado ou perfil sem identidade verificável.</p>
<p>Se você já transferiu dinheiro, não negocie “taxa de devolução”. Guarde URL, número, chave, comprovante, horários e capturas da conversa; contate imediatamente a instituição financeira pelos canais oficiais e registre ocorrência na Polícia Civil. O alerta oficial não garante recuperação, mas agir cedo preserva evidências.</p>
<h2>Mensagem de verificação</h2><p>Use uma pergunta objetiva: “Antes de continuar, poderia informar razão social, endereço, nome do responsável, etapas do processo e o link da vaga no site oficial? Não realizo pagamentos nem compartilho códigos de acesso.” Uma seleção legítima pode responder com clareza. Pressão, ameaça, mudança contínua de história ou recusa em identificar a empresa são motivos suficientes para interromper.</p>
<p>Também observe a forma de pagamento prometida. Cheque, vale-compras, crédito em aplicativo desconhecido ou movimentação de valores de terceiros podem transformar a vítima em intermediária do golpe. Não aceite receber dinheiro para repassar e não empreste conta bancária, chave PIX ou aparelho. Se a “tarefa” exige movimentar recursos antes do contrato, encerre e procure o canal policial.</p><p>Este conteúdo é preventivo, não substitui investigação policial ou orientação jurídica. A regra operacional é simples: valide por um canal independente, limite dados à etapa e nunca compre uma promessa de contratação.</p>
    `.trim()
  },

  "seguranca-candidatas-entrevista-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia oferece um plano prático para candidatas verificarem entrevista, endereço e tratamento de dados. Não presume que entrevistas noturnas ou locais incomuns sejam criminosos; ensina a reduzir exposição antes do deslocamento.</p>
<h2>Confirme quem, onde e para quê</h2><p>Peça por escrito o nome da empresa, a função, o endereço completo, o horário, a duração prevista e o nome de quem receberá você. Depois confirme esses dados em canal institucional encontrado por conta própria. Um mapa mostra que o endereço existe, mas não comprova que o recrutador ocupa o local. Se for coworking, evento ou espaço compartilhado, peça o nome da sala e a recepção responsável.</p>
<p>Avise uma pessoa de confiança sobre o trajeto e combine um horário de contato. Compartilhe apenas o necessário com essa pessoa, não em grupos públicos. Se a entrevista terminar tarde, verifique antecipadamente as opções reais de retorno. Em São Luís, o tempo de travessia e a frequência do transporte variam conforme o ponto de partida; faça a conta para o seu endereço e horário, sem aceitar estimativa genérica.</p>
<h2>Sinais que justificam cancelar ou sair</h2><ul><li>mudança de endereço de última hora sem explicação verificável;</li><li>pedido para entrar em residência, quarto ou veículo sem relação clara com o trabalho;</li><li>tentativa de reter documento ou telefone;</li><li>perguntas ou “testes” sexuais, íntimos ou humilhantes;</li><li>pressão para ficar sozinha ou impedir contato com terceiros;</li><li>cobrança de taxa, senha, código ou acesso à conta.</li></ul>
<p>Ser cordial não obriga ninguém a permanecer em situação insegura. Você pode encerrar com uma frase curta: “Não vou continuar esta etapa. Por favor, registre o cancelamento por escrito.” Saia para local público e, se houver risco imediato, acione os serviços de emergência.</p>
<h2>Entrevista deve avaliar capacidade profissional</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l9029.htm" target="_blank" rel="noopener noreferrer">Lei nº 9.029/1995</a> proíbe práticas discriminatórias para acesso ou manutenção da relação de trabalho. O <a href="https://www.prt10.mpt.mp.br/comunicacao/noticias-do-mpt-df-to/2742-empresa-que-ofertava-vagas-de-emprego-de-forma-discriminatoria-firma-acordo-extrajudicial-com-o-mpt-df" target="_blank" rel="noopener noreferrer">MPT registrou acordo em caso de anúncio e entrevista discriminatórios</a>, destacando que procedimentos seletivos não devem incluir perguntas alheias à capacidade profissional.</p>
<p>Pergunte como cada informação se relaciona com a função. Disponibilidade de horário pode ser essencial; plano de ter filhos, estado civil ou opinião pessoal não mede competência. Anote pergunta, resposta, data e contexto sem publicar acusações antes de verificar os fatos. Para denúncia ou análise individual, procure o Ministério Público do Trabalho, sindicato ou orientação jurídica.</p>
<h2>Documentos e vídeo</h2><p>Na triagem, currículo e dados de contato costumam bastar. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> classifica informações de saúde, origem racial ou étnica e vida sexual como dados pessoais sensíveis. Pergunte qual é a finalidade, quem recebe, por quanto tempo guarda e qual canal protege o arquivo. Não envie senha, código gov.br, dado bancário ou imagem íntima.</p>
<p>Em entrevista por vídeo, confirme a plataforma e o domínio do convite. Você não precisa instalar aplicativo fora da loja oficial, compartilhar a tela inteira nem abrir acesso remoto ao computador. Organize o enquadramento para não expor documentos, crianças, endereço ou rotina doméstica.</p>
<p>Se houver acompanhante, combine se ele aguardará na recepção ou próximo ao local; não confronte o recrutador nem exponha terceiros. A finalidade é manter referência e rota de saída. Para dinâmica coletiva, confirme previamente quantidade aproximada de participantes e responsável pela atividade. Mudança legítima pode ocorrer, mas precisa ser explicada e verificável.</p><h2>Checklist de saída</h2><p>Leve telefone carregado, endereço salvo, dinheiro ou alternativa de transporte e apenas os documentos necessários. Não deixe original sem recibo. Ao sair, registre o horário e o nome de quem a atendeu. Segurança não é “frescura” nem prova contra uma empresa: é gestão de risco diante de informação incompleta.</p>
    `.trim()
  },

  "home-office-remoto-checklist-vaga": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> “Remoto” descreve onde parte do trabalho acontece, não o contrato inteiro. Antes de aceitar, transforme o anúncio em perguntas sobre presença, jornada, equipamento, despesas, segurança e resultado. Este guia não define direitos para todo caso; contrato, convenção coletiva e situação concreta podem mudar a resposta.</p>
<h2>Descubra o que a empresa chama de remoto</h2><p>Pergunte se o posto é remoto desde a admissão, se exige treinamento presencial, quantos comparecimentos podem ocorrer e qual é o endereço de referência. Confirme se a contratação aceita residência em São Luís ou se existe restrição geográfica. “100% remoto” não deveria esconder viagens frequentes, mas uma reunião presencial ocasional pode fazer parte de um acordo claramente informado.</p>
<p>A CLT trata o teletrabalho nos artigos 75-A e seguintes. O <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm" target="_blank" rel="noopener noreferrer">texto consolidado oficial</a> prevê que a prestação em regime de teletrabalho conste expressamente do contrato individual e que aquisição, manutenção ou fornecimento de equipamentos, infraestrutura e reembolso de despesas sejam previstos em contrato escrito. Leia o documento; não presuma que notebook, internet ou cadeira serão pagos.</p>
<h2>Perguntas antes do aceite</h2><ul><li>Qual é o horário e como a disponibilidade será registrada?</li><li>Há metas por entrega, controle de jornada ou plantão? Como funciona cada um?</li><li>Quem fornece notebook, headset, licenças e suporte técnico?</li><li>Quais despesas são reembolsadas e como comprovar?</li><li>Qual canal recebe incidentes de segurança e falhas de equipamento?</li><li>Existem comparecimentos presenciais e com quanto aviso?</li><li>O retorno ao presencial está previsto? Em quais condições?</li></ul>
<p>Peça as respostas por e-mail ou no contrato. Uma promessa verbal de ajuda de custo não permite comparar propostas. Se a empresa disser que “todos usam computador próprio”, confirme requisitos, suporte, separação de dados pessoais e procedimento quando o equipamento falhar.</p>
<h2>Faça um teste doméstico realista</h2><p>Meça conexão no horário em que trabalhará, observe ruído, calor, iluminação e privacidade e identifique um plano para interrupção de energia. Não prometa ambiente que não existe. Você pode negociar solução, mas precisa informar limitação relevante antes de assumir tarefas que dependem de chamada contínua ou sistema pesado.</p>
<p>Calcule custo incremental, não a conta inteira da casa: pacote de internet, energia adicional, manutenção, mobiliário e eventual ida presencial. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> para os dias de comparecimento, preenchendo seus próprios valores. Ela não define benefício nem substitui cláusula contratual.</p>
<h2>Proteja conta e aparelho</h2><p>Use perfil separado para trabalho, bloqueio de tela e autenticação em dois fatores quando oferecida. Não instale software de acesso remoto a pedido de contato não verificado. Pergunte quais dados a empresa coleta do aparelho e se existe equipamento corporativo. Nunca compartilhe senha, código de autenticação ou acesso ao internet banking em “teste”.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> reforça finalidade, necessidade e segurança no tratamento de dados pessoais. Isso vale como referência tanto para arquivos de clientes quanto para dados do trabalhador. Incidente deve ser reportado pelo canal formal, não escondido.</p>
<h2>Peça transparência sobre controle e ergonomia</h2>
<p>Descubra quais ferramentas registram horário, atividade, chamadas, tela ou localização, qual é a finalidade e quem acessa os dados. Não aceite instalar programa desconhecido em aparelho pessoal antes de confirmar empresa, contrato e política. Controle de jornada, monitoramento de segurança e avaliação de desempenho são finalidades diferentes e precisam ser explicadas de forma coerente.</p>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-17-nr-17" target="_blank" rel="noopener noreferrer">NR-17 sobre ergonomia</a> reúne requisitos relacionados à adaptação das condições de trabalho. Para o remoto, peça as orientações de organização, mobiliário, pausas e comunicação de desconforto aplicáveis ao posto. Não compre item caro antes de saber quem fornece, reembolsa ou aprova.</p>
<h2>Faça um teste de processo antes do primeiro dia</h2>
<ol><li>Confirme o remetente e o domínio do convite.</li><li>Instale apenas aplicativos indicados no canal oficial.</li><li>Teste áudio e acesso sem expor documentos pessoais na tela.</li><li>Anote suporte, plano para falha de conexão e procedimento de incidente.</li><li>Separe ambiente e arquivos pessoais do perfil de trabalho.</li></ol>
<p>Um teste técnico legítimo avalia requisito da função; ele não exige senha bancária, código de autenticação ou pagamento. Se houver comparecimento, confirme endereço e responsável antes de viajar. Guarde contrato e política fornecidos, pois a palavra “remoto” no anúncio não substitui essas condições.</p>
<h2>Compare a proposta inteira</h2><p>Salário, benefícios, jornada, equipamento, deslocamento eventual e previsibilidade importam juntos. Uma vaga remota pode ser boa sem auxílio; outra pode transferir custo incompatível com a remuneração. Não existe resposta universal. Registre o combinado, leia a convenção coletiva aplicável no <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Sistema Mediador</a> e procure orientação especializada se o contrato divergir da prática.</p>
<p>Se a seleção cobrar equipamento, certificado ou taxa para “liberar o acesso”, interrompa e valide a empresa. Trabalho remoto legítimo não elimina a necessidade de identificação, contrato claro e canal de suporte.</p>
    `.trim()
  },

  "trabalho-hibrido-sao-luis-checklist": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Um anúncio “híbrido” pode significar dois dias em casa, comparecimento variável ou apenas flexibilidade eventual. A palavra não basta. Este roteiro ajuda a converter o rótulo em calendário, custo e cláusulas verificáveis antes de aceitar.</p>
<h2>Desenhe uma semana comum</h2><p>Peça um exemplo de semana: dias presenciais, dias remotos, horário, reuniões obrigatórias e local de trabalho. Pergunte se a equipe escolhe os dias ou se a liderança define uma escala. Depois trate as exceções: treinamento, fechamento, visita de cliente, manutenção do sistema e eventos. Não negocie apenas a “média mensal”; sua rotina depende de quais dias e horários exigem deslocamento.</p>
<p>Para quem mora em São Luís ou na região metropolitana, teste o trajeto no horário da jornada e também a volta. Registre tempo, integrações e alternativa quando chover ou o turno terminar tarde. Use valores atuais informados por você na <a href="/ferramentas/custo-deslocamento">calculadora do portal</a>; o guia não publica tarifa nem presume um bairro de origem.</p>
<h2>O que precisa ficar escrito</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm" target="_blank" rel="noopener noreferrer">CLT consolidada</a> disciplina teletrabalho nos artigos 75-A e seguintes. O regime deve constar expressamente do contrato individual; equipamento, infraestrutura e reembolso devem ser previstos em contrato escrito. Pergunte como a empresa registra a combinação presencial/remota e como comunica alterações.</p>
<ul><li>quantidade e escolha dos dias presenciais;</li><li>endereço de referência e possibilidade de outras unidades;</li><li>equipamento fornecido e suporte;</li><li>despesas reembolsadas e procedimento;</li><li>horário, controle ou metas;</li><li>prazo e regra para mudança do regime.</li></ul>
<p>Uma conversa de recrutamento ajuda, mas não substitui leitura do contrato. Se a cláusula disser algo diferente do anúncio, pare antes de assinar e peça correção ou explicação.</p>
<h2>Compare custo e previsibilidade</h2><p>Some transporte, alimentação fora de casa, tempo de trajeto e estrutura doméstica. O custo não serve apenas para pedir aumento: ele mostra se a proposta cabe na rotina. Considere também quem cuida de criança ou familiar, curso presencial e limite de horário. Não prometa flexibilidade total quando ela não existe.</p>
<p>Faça três cenários: semana anunciada; uma semana com comparecimento extra; e retorno integral ao presencial se essa hipótese estiver prevista. Se o terceiro cenário inviabiliza a vaga, pergunte agora. O objetivo não é exigir garantia impossível, mas conhecer o risco.</p>
<h2>Como negociar sem transformar tudo em confronto</h2><p>Leve uma proposta específica: “Consigo comparecer terça e quinta; mudanças adicionais precisam de aviso mínimo para eu ajustar o transporte.” Explique a necessidade operacional, não detalhes íntimos desnecessários. Pergunte quem aprova exceção e onde o combinado fica registrado.</p>
<p>Se a empresa não puder fixar dias, você pode negociar teto de comparecimentos ou janela de aviso. Se nada for previsível, avalie a vaga como predominantemente presencial. Um “não” claro antes do aceite é mais útil do que uma surpresa na segunda semana.</p>
<p>Na experiência inicial, revise o combinado ao fim de cada semana: dias efetivamente presenciais, reuniões fora da escala, falhas de equipamento e despesas. Não espere meses para mostrar divergência. Relate por canal interno com exemplos e peça correção. Isso cria uma base factual sem transformar todo ajuste operacional em acusação.</p><h2>Verifique a norma coletiva</h2><p>Convenções e acordos podem trazer regras da categoria. O serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a> permite pesquisar documentos registrados no Sistema Mediador. Confirme categoria, território e vigência; não use uma convenção de outro setor ou estado.</p>
<p>Este guia é orientação geral. Dúvida sobre alteração contratual, jornada ou reembolso exige leitura do documento e, quando necessário, sindicato, inspeção do trabalho ou assessoria jurídica.</p>
    
<h2>Classifique cada presença antes de aceitar a rotina</h2>
<p>Separe dias fixos, convocações ocasionais, treinamento, plantão e visita externa. Para cada tipo, registre local, antecedência, duração e quem confirma. Uma reunião presencial mensal tem impacto diferente de comparecimento variável três vezes por semana. Se o anúncio usa “híbrido” mas não consegue descrever uma semana típica, avalie a proposta pelo cenário mais presencial que foi confirmado.</p>
<h2>Planeje falha de internet, energia e equipamento</h2>
<p>Pergunte qual canal comunica indisponibilidade, se existe suporte, onde o equipamento é reparado e se a ida emergencial ao escritório é prevista. Não instale programa em computador pessoal sem saber finalidade e política. Quando a empresa fornece equipamento, confira termo de entrega, acessórios e procedimento de devolução; registre avaria existente antes do uso.</p>
<h2>Reconcilie o combinado com a prática</h2>
<p>Nas quatro primeiras semanas, mantenha um quadro com dia previsto, local efetivo, motivo da mudança, aviso recebido e despesa. Em São Luís, inclua tempo real de ida e volta nos horários praticados, sem transformar uma viagem em média universal. Ao notar repetição, leve o quadro à liderança e pergunte se o regime precisa ser formalmente ajustado.</p>
<p>Não use teletrabalho para esconder jornada extra nem aceite que todo custo doméstico é automaticamente reembolsável. Compare contrato, política e instrumento coletivo. A decisão deve considerar o cenário escrito e o que a rotina demonstrou, sem promessas de permanência do regime.</p>
`.trim()
  },

  "pretensao-salarial-entrevista-dicas": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Pretensão salarial não deve nascer de um número copiado sem contexto. Cargo, senioridade, jornada, benefícios, deslocamento e norma coletiva mudam a comparação. Este guia ensina a construir uma faixa própria sem inventar proposta concorrente ou dado de mercado.</p>
<h2>Defina três referências diferentes</h2><p>A primeira é o <strong>mínimo viável</strong>: remuneração e pacote abaixo dos quais a vaga não fecha para sua rotina. A segunda é a <strong>faixa de comparação</strong>, obtida em anúncios realmente semelhantes. A terceira é o <strong>alvo de negociação</strong>, que considera o escopo específico daquela empresa. Não revele todas como se fossem o mesmo número.</p>
<p>Compare apenas funções compatíveis. “Assistente administrativo” pode significar arquivo e atendimento em uma empresa, mas incluir financeiro, compras e fechamento em outra. Leia tarefas, jornada e responsabilidade. Evite sites que misturam cidade, data e senioridade sem explicar a amostra.</p>
<h2>Consulte pisos e cláusulas aplicáveis</h2><p>Antes da entrevista, verifique se a categoria possui instrumento coletivo. O serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a> dá acesso a acordos e convenções registrados no Sistema Mediador. Pesquise por sindicato, categoria, UF e vigência; confirme que o documento alcança o empregador e a função.</p>
<p>Piso coletivo não é sinônimo de salário típico nem define automaticamente sua pretensão. Ele é uma referência normativa quando aplicável. Não copie valor de convenção de outro estado ou setor. Se tiver dúvida sobre enquadramento, procure sindicato ou orientação profissional.</p>
<h2>Calcule o pacote que chega à rotina</h2><p>Anote salário bruto oferecido, benefícios, descontos conhecidos, escala e despesas do trabalho. Transporte merece um cálculo próprio: quantidade de idas, custo por dia e tempo. A <a href="/ferramentas/custo-deslocamento">ferramenta de deslocamento</a> usa valores que você informa e não presume tarifa. Alimentação, uniforme e equipamento também podem mudar a comparação.</p>
<p>Não transforme uma estimativa de líquido em promessa. Descontos dependem do vínculo e do caso. Se precisar de precisão, peça uma simulação ao RH ou consulte profissional habilitado.</p>
<h2>Como responder na entrevista</h2><p>Quando ainda não conhece o escopo: “Para responder com responsabilidade, gostaria de confirmar jornada, responsabilidades e pacote. A empresa trabalha com qual faixa para a posição?” Se pedirem um valor, explique sua base: “Considerando as tarefas descritas e o pacote informado, minha referência está entre X e Y; posso avaliar a proposta completa.” Substitua X e Y por números realmente sustentáveis para você.</p>
<p>Uma faixa excessivamente ampla não comunica pesquisa. Um número único cedo demais tira espaço para avaliar benefícios. Também não invente salário anterior ou outra oferta; a negociação pode continuar sem esse teatro.</p>
<p>Se o formulário exigir um único valor antes de explicar a vaga, use uma referência que você realmente aceitaria e registre que depende do pacote, quando houver campo de observação. Não coloque “a combinar” se o sistema só aceita número e depois finja que não respondeu. Transparência começa na candidatura.</p><h2>Registre a proposta final</h2><p>Depois da conversa, confirme por escrito salário, benefícios, jornada, local, data prevista e condição de experiência. Oferta verbal não é folha de pagamento. Leia o contrato antes de pedir desligamento ou assumir despesa.</p>
<p>Se o valor ficar abaixo do mínimo viável, recuse com respeito: “Agradeço a proposta. Com o pacote e o deslocamento atuais, não consigo assumir a posição por esse valor.” Você não precisa expor dívida, saúde ou situação familiar para justificar.</p>
<h2>Erros comuns</h2><ul><li>usar custo pessoal como único argumento de valor profissional;</li><li>comparar remuneração de cargos diferentes;</li><li>ignorar jornada, escala e presença;</li><li>tratar benefício condicionado como dinheiro garantido;</li><li>aceitar imediatamente sem pedir a proposta escrita.</li></ul>
<p>Pretensão é uma decisão, não uma prova de lealdade. Prepare dados verificáveis, faça perguntas e preserve a possibilidade de dizer não.</p>
    `.trim()
  },

  "como-pedir-aumento-salario": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Pedir aumento é uma negociação sobre escopo, resultado e orçamento; não existe frase que garanta aprovação. Este guia ajuda a preparar evidências, entender limites coletivos e sair da conversa com um próximo passo verificável.</p>
<h2>Separe reajuste coletivo de aumento individual</h2><p>Reajuste previsto em convenção ou acordo coletivo e aumento por desempenho, promoção ou retenção não são a mesma coisa. Antes da reunião, consulte a norma aplicável no serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>. Confirme categoria, empresa, território e período de vigência. Se houver cláusula salarial, leve o documento; não trate boato de grupo como regra.</p>
<p>Para aumento individual, verifique se a empresa possui ciclo de avaliação, faixa salarial ou processo de promoção. Pergunte ao RH como funciona. A ausência de política formal não impede conversa, mas muda a forma de documentar.</p>
<h2>Monte um dossiê de uma página</h2><p>Escolha três a cinco entregas recentes e descreva situação, ação e efeito. Prefira evidência que a liderança reconheça: prazo cumprido, erro reduzido, cliente atendido, processo organizado, volume assumido, treinamento concluído ou responsabilidade incorporada. Não use números inventados. Quando o resultado não foi medido, descreva o antes e o depois de forma observável.</p>
<p>Liste também mudanças de escopo: tarefas que entraram, cobertura de ausência, responsabilidade por caixa, equipe, sistema ou fechamento. Diferencie ajuda ocasional de atribuição permanente. Anexe elogio ou relatório somente se puder compartilhar e sem expor dados de cliente ou colega.</p>
<h2>Escolha o pedido</h2><p>Defina o que quer: percentual, valor, mudança de cargo, revisão em data certa ou plano com critérios. Se não conhece a faixa interna, pergunte antes de chutar. Use anúncios comparáveis como contexto, não como prova absoluta. Normas coletivas registradas no Mediador podem mostrar piso e reajuste, mas não revelam toda a política da empresa.</p>
<p>Uma abertura possível: “Gostaria de revisar minha remuneração à luz destas entregas e do escopo que passei a assumir. Como meu cargo está posicionado na faixa e qual é o processo para ajuste?” Depois apresente o pedido. Evite ameaçar saída que não pretende cumprir ou expor salário de colega.</p>
<h2>Conduza a conversa</h2><p>Marque horário e envie o tema com antecedência. Na reunião, faça a ligação entre trabalho e pedido. Não transforme dificuldade pessoal em argumento central; ela é real, mas a decisão empresarial costuma passar por orçamento, escopo e consistência. Pergunte quem decide, qual prazo e quais documentos faltam.</p>
<p>Se a resposta for “agora não”, peça precisão: é restrição orçamentária, avaliação insuficiente ou ausência de vaga na faixa? Que entregas seriam necessárias? Em qual data haverá nova decisão? Registre por e-mail: “Obrigado pela conversa. Combinamos revisar em X, considerando A, B e C.” Não invente uma data; use a que a liderança efetivamente aceitou.</p>
<h2>Quando o pedido envolve equiparação</h2><p>A CLT contém regras sobre igualdade salarial e trabalho de igual valor. Consulte o <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm" target="_blank" rel="noopener noreferrer">texto consolidado oficial</a>, mas não conclua sozinho que dois cargos são juridicamente idênticos. Tempo, função, produtividade, plano de cargos e outros elementos podem importar. Para situação concreta, busque sindicato ou orientação jurídica.</p>
<h2>Depois da resposta</h2><p>Se houver aprovação, confirme valor, vigência, cargo e reflexo em benefícios por escrito e confira os registros posteriores. Se houver plano, acompanhe os critérios. Se houver negativa definitiva, decida com calma entre permanecer, buscar transferência ou iniciar procura externa sem usar dados confidenciais.</p>
<p>Não pague intermediário que promete “garantir” aumento e não falsifique proposta de outra empresa. Uma boa negociação pode terminar em não; o resultado útil é clareza sobre valor, processo e próximos passos.</p>

<h2>Converta o pedido em uma tabela verificável</h2>
<p>Use quatro colunas: responsabilidade atual, evidência, frequência e diferença em relação ao escopo original. “Apoiei o fechamento” é vago; “faço a conferência final toda sexta-feira desde determinado mês” permite confirmar continuidade. Para resultado, indique a fonte interna disponível — relatório, prazo, aceite ou redução observada — e não anexe informação confidencial que a liderança já consegue consultar.</p>
<p>Acrescente uma coluna de dependências. Uma entrega pode ter resultado do time, de sistema ou de outra área; reconhecer isso aumenta a credibilidade. O objetivo é demonstrar contribuição e ampliação de responsabilidade, não reivindicar sozinho o trabalho coletivo.</p>
<h2>Prepare três respostas possíveis antes da reunião</h2>
<ul><li><strong>Aprovação:</strong> confirmar valor, cargo, vigência, registro e quem formaliza.</li><li><strong>Plano:</strong> transformar critérios em entregas observáveis, responsável pela avaliação e data realmente acordada.</li><li><strong>Negativa:</strong> identificar se a barreira é orçamento, faixa, desempenho ou estrutura e decidir o próximo passo sem ameaça improvisada.</li></ul>
<p>Se a empresa oferecer apenas benefício, título ou promessa futura, compare a proposta com o pedido original. Não trate “vamos ver” como compromisso. Envie um resumo curto e permita correção: “Entendi que a decisão ficou pendente e que voltaremos ao tema quando ocorrer X; está correto?”. Se não houver marco aceito, registre que não existe nova data confirmada.</p>
<p>Negociação salarial não autoriza divulgar remuneração de colega, documento interno ou proposta falsa. Quando a questão for cumprimento de piso, reajuste coletivo ou possível desigualdade protegida por lei, separe-a da conversa de mérito e busque o instrumento ou orientação aplicável.</p>
    `.trim()
  },

  "negociar-horario-deslocamento-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Um trajeto incompatível pode transformar uma boa vaga em atraso recorrente, gasto inesperado ou risco na volta. Negociar horário exige dados do caminho e entendimento da operação. Este guia não promete flexibilidade nem define vale-transporte para casos individuais.</p>
<h2>Teste o trajeto no horário real</h2><p>Planejar às 14h não mostra o que acontece na entrada das 8h ou na saída das 22h. Faça ao menos um teste em faixa semelhante à jornada. Anote hora de saída, espera, integrações, caminhada, chegada e alternativa. Se o emprego ainda não foi oferecido, use estimativa conservadora sem faltar a outro compromisso.</p>
<p>Em São Luís e municípios próximos, o percurso depende do bairro, do sentido e da conexão. Evite afirmar que “sempre leva uma hora”. Leve seu registro: “No teste de terça, saí às 6h20 e cheguei às 7h42; a segunda opção chegou depois.” Um dia não prevê todos, mas é melhor que palpite.</p>
<h2>Calcule custo com seus próprios valores</h2><p>Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> para registrar passagens, combustível, estacionamento ou transporte alternativo. A ferramenta não publica tarifa oficial e não decide benefício. Faça cenários para dias normais, fechamento tardio e perda de conexão.</p>
<p>O vale-transporte possui regras próprias. Para uma fonte oficial de orientação, consulte o <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/vale-transporte" target="_blank" rel="noopener noreferrer">serviço do Ministério do Trabalho e Emprego sobre vale-transporte</a>, quando disponível, e verifique contrato e norma coletiva. Se a informação oficial mudar ou a página não responder, procure o RH, sindicato ou inspeção do trabalho.</p>
<h2>Faça um pedido específico</h2><p>“O trânsito é ruim” não indica solução. Escolha uma alternativa compatível com o posto: entrada e saída deslocadas, tolerância ligada a compensação formal, unidade mais próxima, dias presenciais definidos ou transporte empresarial existente. Não ofereça trabalho fora da jornada para compensar informalmente sem entender como será registrado.</p>
<p>Exemplo: “Testei o trajeto e, com a primeira conexão disponível, a chegada segura fica em torno de 8h15. Existe possibilidade de jornada das 8h30 às 17h30, mantendo a carga e as entregas? Se não, há outra escala ou unidade?” Ajuste horários à situação real; os números acima são apenas estrutura de fala.</p>
<h2>Entenda o limite da função</h2><p>Atendimento de abertura, troca de turno, caixa e operação presencial podem exigir horário fixo. Pergunte qual atividade impede a mudança. Talvez exista solução parcial; talvez não exista. Recusar uma proposta inviável antes da admissão é mais profissional do que aceitar contando com alteração não aprovada.</p>
<p>Se houver acordo, peça registro escrito com jornada, intervalo, local, data de início e quem autorizou. A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm" target="_blank" rel="noopener noreferrer">CLT consolidada</a> é a fonte legal geral sobre duração do trabalho, mas contrato e convenção coletiva precisam ser lidos para o caso. Não confunda mensagem informal com alteração contratual definitiva.</p>
<h2>Inclua segurança e acessibilidade</h2><p>Considere iluminação, espera em ponto, última conexão, acessibilidade do percurso e chegada ao local. Se uma condição de saúde ou deficiência exige ajuste, você pode explicar a barreira funcional sem divulgar diagnóstico além do necessário. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm" target="_blank" rel="noopener noreferrer">Lei Brasileira de Inclusão</a> trata de igualdade de oportunidades e adaptação razoável; a aplicação concreta pode requerer orientação.</p>
<h2>Decida pelo cenário aprovado</h2><p>Não compare a vaga com o horário que gostaria de obter. Compare com o que a empresa confirmou. Se o acordo não for registrado, trate o cenário original como vigente. Guarde a proposta e reveja a conta após o primeiro mês, sem faltar ou alterar jornada por conta própria.</p>
<p>Negociação útil é verificável: trajeto medido, pedido claro, impacto operacional discutido e resposta escrita.</p>
    
<h2>Compare três cenários antes da conversa</h2>
<p>Monte uma linha para jornada original, alternativa solicitada e plano de contingência. Em cada uma, registre saída de casa, chegada, custo, última conexão, margem e impacto na atividade. Use seus próprios testes e datas. Uma rota medida em dia tranquilo não deve ser apresentada como duração garantida.</p>
<h2>Relacione o pedido à operação</h2>
<p>Mostre como manterá abertura, passagem de turno, reunião ou atendimento. Se a função exige presença às 8h, uma entrada às 8h30 pode não ser possível, mas talvez outra escala ou unidade exista. Pergunte antes de oferecer compensação: alteração informal pode criar jornada não registrada e não resolve transporte na saída.</p>
<h2>Registre o que foi aprovado e por quanto tempo</h2>
<p>Confirme jornada, intervalo, unidade, data de início, período de teste e responsável pela aprovação. Se o ajuste será revisto após experiência, anote a data e o cenário que volta a valer caso não seja mantido. Não trate silêncio ou resposta vaga como autorização.</p>
<h2>Reavalie com dados da primeira semana</h2>
<p>Compare horários reais, atrasos, custo e segurança. Em dias de chuva forte ou alteração de rota em São Luís, registre o evento sem transformar exceção em regra. Se o combinado ficou inviável, leve evidência e uma proposta antes de mudar a jornada por conta própria. A decisão final deve considerar o horário formalmente confirmado, não apenas a melhor simulação.</p>
`.trim()
  },

  "vagas-afirmativas-como-candidatar": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Vaga afirmativa é um processo com público definido e finalidade de ampliar oportunidades; não é licença para coletar dados sem explicação nem promessa automática de contratação. Leia o critério, verifique o canal e prepare sua experiência profissional como em qualquer seleção.</p>
<h2>Entenda qual ação está sendo anunciada</h2><p>O texto deve dizer para quem a iniciativa é destinada e, idealmente, por quê. Pode envolver pessoas negras, mulheres, pessoas com deficiência ou outro grupo sub-representado, mas cada caso tem fundamento e desenho próprios. Não presuma que toda preferência é legal ou que toda ação afirmativa é discriminação.</p>
<p>O <a href="https://prt2.mpt.mp.br/informe-se/calendario-de-contratacoes-2026/2-uncategorised/824-mpt-rejeita-denuncias-de-suposto-racismo-contra-empresa" target="_blank" rel="noopener noreferrer">MPT já registrou entendimento favorável a ação afirmativa racial em processo seletivo específico</a>, com referência à Constituição, ao Estatuto da Igualdade Racial e a convenção internacional. Isso não valida automaticamente qualquer anúncio. A <a href="https://www.planalto.gov.br/ccivil_03/leis/l9029.htm" target="_blank" rel="noopener noreferrer">Lei nº 9.029/1995</a> continua sendo referência contra práticas discriminatórias no acesso ao trabalho.</p>
<h2>Leia critérios e etapas</h2><ul><li>O público-alvo está claro e relacionado a uma política identificável?</li><li>A empresa, o cargo, o local e a jornada estão descritos?</li><li>O canal pertence à empresa ou plataforma reconhecida?</li><li>Que autodeclaração ou documento será pedido, em qual etapa e por quê?</li><li>Existe contato para acessibilidade e privacidade?</li></ul>
<p>Salve o anúncio e a data. Se o texto mudar, você terá o registro do que orientou a candidatura. Não publique documento pessoal para provar que participou.</p>
<h2>Dados sensíveis pedem cuidado adicional</h2><p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> considera sensíveis dados sobre origem racial ou étnica, saúde, vida sexual e outros previstos em lei. Antes de enviar, pergunte finalidade, base legal, acesso, retenção e canal de segurança. Autodeclaração em formulário oficial é diferente de foto de documento enviada a número anônimo.</p>
<p>Para processos de pessoas com deficiência, a <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm" target="_blank" rel="noopener noreferrer">Lei Brasileira de Inclusão</a> trata de direito ao trabalho em ambiente acessível e inclusivo e veda discriminação nas etapas de recrutamento, seleção, contratação e permanência. O <a href="https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm" target="_blank" rel="noopener noreferrer">artigo 93 da Lei nº 8.213/1991</a> estabelece reserva de cargos em empresas com 100 ou mais empregados, nos percentuais legais. Isso não dispensa acessibilidade nem transforma laudo em requisito para o primeiro contato anônimo.</p>
<p>Também verifique se a empresa explica o uso estatístico das respostas de diversidade. Formulário demográfico opcional pode ser separado da avaliação; o candidato deve entender essa separação. Se a recusa em responder bloquear a candidatura sem explicação, registre a tela e peça esclarecimento ao canal de privacidade.</p><h2>Prepare uma candidatura profissional</h2><p>Responda ao critério solicitado sem reduzir seu currículo à identidade. Mostre tarefas realizadas, resultado, ferramentas, formação e disponibilidade. Se precisa de adaptação para a seleção, peça cedo e de forma funcional: intérprete, formato acessível, tempo adicional, rota sem barreira ou alternativa ao vídeo, conforme a necessidade real.</p>
<p>Uma frase possível: “Atendo ao público indicado no anúncio e gostaria de confirmar as etapas e o canal seguro para a informação solicitada. Para participar em igualdade, preciso de X na entrevista.” Não envie diagnóstico ou detalhe íntimo além do necessário.</p>
<h2>Diferencie inclusão de golpe</h2><p>Discurso inclusivo não torna legítima cobrança de taxa, curso obrigatório vendido pelo recrutador ou pedido de senha. Valide empresa e anúncio em canal independente. Leia a página de <a href="/seguranca-candidatos">segurança do candidato</a> e interrompa contato que peça PIX para garantir vaga.</p>
<h2>Quando houver problema</h2><p>Guarde anúncio, URL, data, perguntas e respostas. Dúvidas sobre discriminação podem ser levadas ao Ministério Público do Trabalho, sindicato ou orientação jurídica. Incidente com dados deve ser tratado também pelos canais de privacidade da empresa e, conforme o caso, pela Autoridade Nacional de Proteção de Dados.</p>
<p>Este guia é orientação geral. A candidatura afirmativa deve combinar critério transparente, seleção profissional, privacidade e acessibilidade concreta.</p>
    `.trim()
  },

  "candidatura-whatsapp-emprego-mensagem": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Candidatura por WhatsApp pede duas coisas ao mesmo tempo: clareza para quem faz a triagem e cautela com seus dados. Este guia ensina a responder a um anúncio verificado; não autoriza envio para números copiados de comentários nem substitui as instruções da vaga.</p>
<h2>Antes da mensagem, valide o caminho</h2>
<p>Volte ao anúncio e confira cargo, empresa, cidade, prazo e número indicado. Salve a URL ou uma captura que mostre a origem. Se o contato chegou por encaminhamento, procure a oportunidade no site da empresa ou em outro canal institucional encontrado por você. O <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">CERT.br reúne orientações sobre golpes em aplicativos de mensagem</a>, links desconhecidos e códigos de verificação. Nome e foto de perfil não comprovam identidade.</p>
<p>Não inicie pagando taxa, comprando curso do recrutador ou enviando código recebido por SMS. Também não compartilhe senha, acesso remoto ao aparelho, dado bancário ou foto segurando documento. Se o anúncio for do Empregos São Luís, compare o contato com a página publicada e use a nossa <a href="/seguranca-candidatos">política de segurança do candidato</a>.</p>
<h2>Uma primeira mensagem que a pessoa consegue triar</h2>
<p>Em vez de “oi” isolado, reúna contexto em quatro linhas. Exemplo adaptável: “Olá, meu nome é Ana Silva. Vi a vaga de auxiliar administrativo publicada em [origem] no dia [data do anúncio]. Tenho experiência com atendimento e planilhas e gostaria de participar. Segue meu currículo em PDF. Posso confirmar o nome da empresa e as próximas etapas?”</p>
<p>Troque os colchetes por fatos verdadeiros. Se você não tem a experiência citada, use outra evidência: curso concluído, tarefa informal ou disponibilidade exigida. Não copie a mesma frase para cargos incompatíveis. Uma mensagem curta é útil porque permite identificar imediatamente candidato, vaga e anexo; não porque exista uma fórmula que garanta resposta.</p>
<h2>Prepare o arquivo e limite os dados</h2>
<ul><li>Nomeie o PDF com nome e cargo, por exemplo <em>Ana-Silva-Auxiliar-Administrativo.pdf</em>.</li><li>Abra o arquivo no celular antes de enviar e confirme se o texto está legível.</li><li>Use telefone e e-mail próprios, mas evite endereço residencial completo, documentos, dados bancários e assinaturas digitalizadas na primeira etapa.</li><li>Envie um currículo, não uma sequência de fotos, certificados e documentos sem solicitação.</li></ul>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> inclui finalidade, necessidade, transparência e segurança entre os princípios do tratamento de dados. Para o candidato, isso vira uma pergunta prática: “por que este dado é necessário agora e quem o receberá?”. A lei não significa que toda solicitação seja ilegal; significa que o contexto e a finalidade importam.</p>
<h2>Conduza a conversa sem perder o registro</h2>
<p>Se houver resposta, peça confirmação de cargo, local, etapa e responsável. Prefira texto para informações essenciais. Áudio pode complementar, mas dificulta conferir endereço, horário e instruções. Não apague o anúncio antes do processo terminar. Guarde os dados da vaga separadamente para não misturar conversas.</p>
<p>Se pedirem disponibilidade, responda com intervalo real: “Posso conversar amanhã entre 9h e 11h ou depois das 15h”. Se o trabalho for presencial, não declare disponibilidade irrestrita antes de conferir escala e deslocamento. Use a <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a> com a tarifa informada por você.</p>
<h2>Faça um acompanhamento sóbrio</h2>
<p>Quando o anúncio não der prazo, uma mensagem de acompanhamento pode ser enviada depois de alguns dias úteis: “Olá, enviei meu currículo para a vaga de [cargo] em [data]. Gostaria de confirmar o recebimento e saber se há previsão para a próxima etapa. Obrigado.” Evite mensagens repetidas no mesmo dia, chamadas sucessivas ou cobrança agressiva. Ausência de resposta não autoriza insistência indefinida.</p>
<p>Encerre imediatamente se o contato mudar a vaga sem explicação, pedir dinheiro, tentar obter código de autenticação ou recusar identificação mínima. Registre número, URL, horário e conteúdo e procure os canais oficiais adequados. Candidatura cuidadosa é objetiva, verificável e proporcional à etapa.</p>
    `.trim()
  },

  "email-candidatura-emprego-modelo": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Um e-mail de candidatura não precisa contar sua vida inteira. Ele precisa permitir que a pessoa identifique a vaga, entenda sua aderência e abra um arquivo confiável. O modelo abaixo é ponto de partida, não garantia de entrevista.</p>
<h2>Leia o anúncio como instrução</h2>
<p>Use exatamente o canal informado. Se a vaga pede formulário, não suponha que um e-mail paralelo substituirá a inscrição. Confira endereço do destinatário, prazo, formato do arquivo e itens solicitados. Endereço parecido com o da empresa pode ser falso; confirme o domínio no site institucional encontrado por você.</p>
<p>O assunto deve sobreviver a uma caixa cheia. Uma forma simples é “Candidatura — cargo — nome completo”. Quando o anúncio traz código da vaga, inclua-o sem inventar outro: “Candidatura — Auxiliar de Estoque — REF 123 — João Lima”. Não escreva apenas “currículo”, “vaga” ou “urgente”.</p>
<h2>Monte um corpo de três blocos</h2>
<p><strong>Abertura:</strong> diga quem é, qual vaga busca e onde a encontrou. <strong>Aderência:</strong> escolha duas evidências verificáveis relacionadas ao anúncio. <strong>Fechamento:</strong> indique o anexo e um meio de contato. Exemplo:</p>
<blockquote><p>Olá, equipe de recrutamento. Meu nome é João Lima e envio minha candidatura à vaga de auxiliar de estoque divulgada em [origem]. Atuei com conferência de mercadorias e registro de entrada em planilha; também tenho disponibilidade para a escala descrita no anúncio. Anexo meu currículo em PDF. Fico disponível pelo telefone [número] para esclarecer informações ou participar das próximas etapas. Atenciosamente, João Lima.</p></blockquote>
<p>Substitua os campos e só mantenha o que for verdadeiro. “Sou perfeito para a vaga”, listas de adjetivos e texto copiado da empresa não demonstram trabalho. Uma evidência pequena — tarefa, ferramenta ou resultado que você consegue explicar — vale mais que uma apresentação grandiosa.</p>
<h2>Revise o anexo como o destinatário</h2>
<ul><li>Abra o PDF em outro aparelho e selecione uma linha para confirmar que não virou foto.</li><li>Use nome de arquivo claro, sem “currículo-final-agora-v3”.</li><li>Não envie link com permissão restrita se a vaga pede anexo.</li><li>Não compacte o currículo em arquivo executável e não inclua vários certificados sem pedido.</li><li>Confirme que telefone, e-mail e datas do currículo correspondem ao corpo.</li></ul>
<p>Na primeira etapa, evite anexar RG, CPF, comprovante de residência, dado bancário ou documento médico. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> prevê finalidade, necessidade e transparência no tratamento de dados pessoais. Perguntar por que um documento é necessário e como será usado é compatível com uma candidatura profissional.</p>
<h2>Proteja o caminho de resposta</h2>
<p>Mensagens de phishing podem imitar recrutamento. O <a href="https://cartilha.cert.br/dicas-rapidas/" target="_blank" rel="noopener noreferrer">CERT.br recomenda desconfiar de mensagens mesmo quando parecem vir de conhecidos</a> e cuidar de links, contas e dados. Antes de abrir convite ou formulário recebido em resposta, confira domínio, remetente e relação com a vaga. Não envie senha nem código de verificação por e-mail.</p>
<p>Se o processo migrar para WhatsApp, registre qual pessoa fez a mudança e confirme o número. Se pedirem pagamento para liberar entrevista, material ou contratação, interrompa e verifique com a empresa por canal independente.</p>
<h2>Quando acompanhar</h2>
<p>Se o anúncio trouxer calendário, respeite-o. Sem prazo, um acompanhamento curto após alguns dias úteis pode confirmar o recebimento: “Enviei minha candidatura à vaga X em [data] e gostaria de confirmar o recebimento. Permaneço disponível.” Responda no mesmo tópico para preservar o histórico. Não reenvie o anexo diariamente nem marque várias pessoas que não participam da seleção.</p>
<p>Antes de clicar em enviar, verifique destinatário, assunto, cargo, empresa, anexo e telefone. Essa revisão de trinta segundos evita os erros que realmente impedem a leitura. Depois, registre a candidatura em uma lista simples com data, canal e retorno.</p>
    `.trim()
  },

  "entrevista-por-video-emprego": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Entrevista por vídeo combina conteúdo, tecnologia e privacidade. Preparar o aparelho reduz ruído, mas não transforma conexão instável em falta de competência. Este roteiro organiza teste, ambiente, resposta e plano alternativo.</p>
<h2>Confirme o convite antes de instalar qualquer coisa</h2>
<p>Leia remetente, empresa, data, fuso, duração, plataforma e nome do entrevistador. Compare o domínio do convite com o canal institucional. Aplicativo baixado por link desconhecido, extensão sem necessidade ou pedido de acesso remoto ao computador são motivos para parar e verificar. Consulte as recomendações do <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">CERT.br sobre links, aplicativos de mensagem e proteção de contas</a>.</p>
<p>Pergunte se haverá gravação, teste técnico, compartilhamento de tela ou dinâmica em grupo. Se a gravação for informada, você pode solicitar finalidade, acesso e prazo de retenção. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> trata imagem e voz identificáveis como dados pessoais e exige transparência e segurança no tratamento.</p>
<h2>Teste no mesmo conjunto que será usado</h2>
<p>Não basta a câmera funcionar em outro aplicativo. Abra a plataforma, autorize somente câmera e microfone necessários e confira entrada, saída, enquadramento e nome exibido. O <a href="https://zoom.us/test" target="_blank" rel="noopener noreferrer">Zoom mantém uma reunião oficial de teste</a>; em outra plataforma, use o recurso equivalente ou crie uma chamada curta com alguém conhecido.</p>
<ul><li>Posicione a câmera na altura dos olhos e a luz à frente, sem filtro que altere o rosto.</li><li>Teste o microfone com ventilador e ruído reais; fone simples pode reduzir eco.</li><li>Conecte o carregador e feche downloads, jogos e abas que consomem rede.</li><li>Desative notificações com nomes, mensagens ou dados que possam aparecer.</li><li>Deixe o telefone do contato e o currículo acessíveis sem cobrir a tela.</li></ul>
<p>Em São Luís, a qualidade da conexão varia por endereço e horário. Não prometa “dados móveis como plano B” sem testar sinal e franquia no cômodo. Se não houver alternativa, avise antes: “Minha conexão pode oscilar; se cair, retorno pelo mesmo link e envio mensagem para este número”.</p>
<h2>Organize o espaço sem expor a casa</h2>
<p>Escolha fundo simples e enquadramento que não mostre documentos, endereço, medicamentos, crianças ou rotina de terceiros. Fundo virtual pode ajudar, mas consome recursos e recorta a imagem em aparelhos fracos. O que importa é áudio compreensível e postura profissional, não uma decoração sofisticada.</p>
<p>Avise quem estiver no local sobre o horário e use fone quando necessário. Se precisar de acessibilidade, peça legenda, intérprete, tempo adicional ou outra plataforma com antecedência. A adaptação deve permitir participação, não exigir exposição de diagnóstico além do necessário.</p>
<h2>Prepare respostas que cabem na conversa</h2>
<p>Tenha três exemplos verdadeiros no formato situação, ação e resultado: uma prioridade conflitante, um problema resolvido e uma aprendizagem. Escreva palavras-chave, não um discurso para ler. Olhar constantemente para outro monitor parece desconexão; consultar uma data no currículo é diferente.</p>
<p>No início, confirme cargo e etapa. Durante a conversa, peça esclarecimento quando a pergunta for vaga. No fim, pergunte próximos passos, prazo de retorno e canal oficial. Não compartilhe a tela inteira se basta mostrar um portfólio; feche arquivos e contas pessoais antes.</p>
<h2>Quando a conexão falhar</h2>
<p>Espere alguns segundos, tente retornar uma vez e envie uma mensagem objetiva: “A conexão caiu às 10h18. Estou entrando novamente; se preferir, posso continuar por áudio ou reagendar.” Não transforme a falha em longa justificativa. Depois, registre o ocorrido e o combinado.</p>
<p>Se o entrevistador pedir senha, código, pagamento, acesso remoto ou documento sem explicar finalidade, encerre a etapa e valide a empresa. Uma entrevista segura avalia experiência e aderência; não precisa controlar o aparelho do candidato.</p>
    `.trim()
  },

  "entrevista-presencial-sao-luis-dicas": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Entrevista presencial começa antes da sala: endereço confirmado, deslocamento possível e identidade do processo verificada. Este guia não promete que chegar cedo gere contratação; ajuda a evitar improvisos que escondem sua preparação.</p>
<h2>Confirme o local por um canal independente</h2>
<p>Peça nome da empresa, cargo, endereço completo, ponto de referência, nome de quem receberá você e duração aproximada. Compare com o site institucional ou telefone geral encontrado por você. Um pino no mapa prova que o endereço existe, não que aquele recrutador está autorizado a usá-lo.</p>
<p>Se houver mudança de última hora para residência, quarto, veículo ou lugar isolado, não siga automaticamente. Pergunte o motivo e confirme com a empresa. Consulte também a <a href="/seguranca-candidatos">política de segurança do candidato</a>. Não leve dinheiro para “garantir” vaga e não aceite retenção do telefone ou documento.</p>
<h2>Faça dois cálculos de deslocamento</h2>
<p>Primeiro, simule o trajeto no mesmo dia e horário da entrevista. Identifique ponto de embarque, integração, caminhada final e entrada correta do prédio. Segundo, calcule se o deslocamento seria sustentável na escala da vaga. Use a <a href="/ferramentas/custo-deslocamento">ferramenta de custo de deslocamento</a> com tarifa, quantidade de viagens e dias informados por você.</p>
<p>Planeje margem para trânsito e chuva, mas não chegue tão cedo a ponto de pressionar a recepção. Se o prédio tiver controle de acesso, considere o tempo de cadastro. Em atraso inevitável, avise antes com horário estimado honesto; não invente uma desculpa detalhada.</p>
<h2>Leve o necessário, não uma pasta de dados</h2>
<ul><li>currículo impresso ou arquivo acessível no telefone;</li><li>documento de identificação para acesso ao prédio, quando solicitado;</li><li>caneta e anotação com endereço, contato e perguntas;</li><li>água e alternativa de retorno compatível com o horário.</li></ul>
<p>Não entregue original sem saber por quê e como será devolvido. Na seleção, CPF, dados bancários, prontuário e comprovante de residência merecem pergunta específica sobre finalidade. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> inclui necessidade, transparência e segurança entre os princípios aplicáveis ao tratamento de dados pessoais.</p>
<h2>Responda com cenas de trabalho</h2>
<p>Prepare exemplos curtos: tarefa, dificuldade, ação e resultado. Para atendimento, descreva como resolveu uma reclamação; para estoque, como conferiu divergência; para administração, como organizou prazo. Não invente números. Se não lembrar a medida exata, diga “aproximadamente” ou explique o efeito observado.</p>
<p>Faça perguntas sobre rotina: equipe, jornada, treinamento, critérios da etapa e prazo de retorno. Salário e benefícios podem ser abordados quando o processo permitir; perguntar com educação não é desinteresse. Anote o que foi realmente informado para comparar depois.</p>
<h2>Reconheça limites da entrevista</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l9029.htm" target="_blank" rel="noopener noreferrer">Lei nº 9.029/1995</a> proíbe práticas discriminatórias para acesso e manutenção da relação de trabalho. Estado civil, plano de ter filhos, religião e outras informações alheias à capacidade profissional não devem substituir avaliação do cargo. Disponibilidade de horário pode ser legítima; pergunta íntima sem relação com a função exige cautela.</p>
<p>Você pode responder: “Posso explicar minha disponibilidade para a escala, mas prefiro manter informações pessoais que não interferem no trabalho.” Se houver discriminação ou constrangimento, registre pergunta, data, local e participantes e procure orientação adequada, como Ministério Público do Trabalho, sindicato ou profissional jurídico.</p>
<h2>Saída e acompanhamento</h2>
<p>Antes de sair, confirme próximo passo e canal. Avise uma pessoa de confiança de que encerrou o compromisso. No mesmo dia, anote impressões factuais: função, jornada, local, pontos pendentes. Um agradecimento curto pode ser enviado pelo canal usado, sem insistência.</p>
<p>Roupa limpa e compatível com a função é suficiente; não existe uniforme universal de entrevista. Preparação visível é saber onde vai, o que pode demonstrar e quais limites precisa manter.</p>

<h2>Use um protocolo de chegada e saída segura</h2>
<p>Compartilhe com alguém de confiança endereço, horário, empresa e previsão de término. Combine uma mensagem de chegada e outra de saída. Se a entrevista mudar para local isolado, transporte particular do contato ou horário muito diferente do confirmado, pause e valide pelo canal institucional. Segurança não deve ser abandonada para demonstrar interesse.</p>
<p>Na recepção, informe apenas o necessário para acesso. Se pedirem que entregue o documento original, pergunte se a conferência visual basta e mantenha o item sob acompanhamento. Não permita fotografia ou retenção sem entender finalidade e responsável. Para formulário digital em aparelho alheio, confira o domínio e saia da conta antes de devolver.</p>
<h2>Faça uma ficha pós-entrevista em quinze minutos</h2>
<p>Registre o que foi informado sobre cargo, tarefas, unidade, jornada, escala, remuneração, benefícios, próxima etapa e prazo. Separe três estados: confirmado, pendente e inferido. Apague a coluna “inferido” antes de tomar decisão; transforme cada item em pergunta para o canal responsável.</p>
<p>Anote também as perguntas que você recebeu e quais exemplos conseguiu explicar. Não grave escondido nem copie nome de outros candidatos. A ficha serve para preparar acompanhamento, comparar propostas e reconhecer mudança de condição, não para avaliar pessoas presentes.</p>
<h2>Trate mudança de condição como nova verificação</h2>
<p>Se depois da conversa mudarem unidade, turno, vínculo ou forma de candidatura, confirme novamente deslocamento e canal. Em São Luís, uma troca de bairro ou horário pode alterar integrações e retorno. Use valores atuais informados por você e não aceite promessa verbal de mudança futura como condição garantida.</p>
<p>Quando houver pergunta discriminatória ou constrangimento, registre palavras lembradas, contexto, data, local e participantes sem publicar acusação em rede social. Procure MPT, sindicato ou orientação jurídica para avaliar o canal adequado. O registro factual é mais útil que uma interpretação ampliada.</p>
    `.trim()
  },

  "referencias-profissionais-emprego": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Referência profissional é uma pessoa que presenciou seu trabalho e aceitou falar sobre ele. Não é favor para preencher campo, nem autorização para divulgar telefone alheio sem aviso. Uma referência coerente sustenta fatos que já aparecem no currículo.</p>
<h2>Escolha quem viu uma entrega</h2>
<p>Prefira liderança, colega experiente, cliente institucional, professor de projeto ou responsável por trabalho voluntário que consiga descrever contexto e comportamento. Cargo famoso não substitui convivência. Parente pode conhecer seu esforço, mas costuma ter menos independência para avaliar desempenho profissional.</p>
<p>Faça uma lista de três pessoas e, para cada uma, anote: onde trabalharam juntas, qual período, quais tarefas ela observou e qual contato ainda funciona. Se ninguém acompanhou seu trabalho formal, considere responsável por atividade informal, curso prático ou projeto. A referência deve dizer o que viu, não inventar vínculo.</p>
<h2>Peça autorização com contexto</h2>
<p>Mensagem possível: “Olá, Carla. Estou participando de uma seleção para auxiliar administrativo e a empresa pode pedir referência. Você acompanhou meu trabalho com atendimento e planilhas na Loja X entre março e agosto. Posso informar seu nome, cargo à época e telefone? Envio a descrição da vaga para você decidir.”</p>
<p>A resposta precisa ser livre. Se a pessoa recusar ou não responder, não use o número. Quando aceitar, confirme canal preferido e horários razoáveis. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> define telefone e informações ligadas a pessoa identificável como dados pessoais e estabelece finalidade, necessidade e transparência. Isso reforça uma prática simples: compartilhe só o necessário, com conhecimento da referência.</p>
<h2>Prepare fatos, não um roteiro combinado</h2>
<p>Envie cargo, empresa, anúncio e versão do currículo usada. Relembre projetos reais, mas não peça elogio pronto. A referência pode dizer que não sabe responder a determinado ponto. Tentar controlar a fala ou combinar informação falsa cria incoerência que aparece na checagem.</p>
<ul><li>Confirme datas aproximadas e relação profissional.</li><li>Explique quais tarefas do novo cargo se conectam ao trabalho anterior.</li><li>Avise quando a empresa informar que fará contato.</li><li>Atualize a pessoa se o processo terminar para que ela não espere ligação indefinidamente.</li></ul>
<h2>O que colocar no currículo</h2>
<p>Em geral, não inclua lista de referências e telefones no PDF público. Use “referências disponíveis mediante solicitação” apenas se fizer sentido; muitas vezes nem essa frase é necessária. Quando o formulário pedir, forneça nome, relação profissional, organização à época e contato autorizado. Não publique CPF, endereço ou dado pessoal excessivo.</p>
<p>Se a empresa solicitar contato do emprego atual e isso puder expor uma busca confidencial, explique: “Meu empregador atual ainda não sabe da candidatura. Posso oferecer referências de experiências anteriores e autorizar o contato atual após a etapa X.” A empresa pode manter seu requisito, mas você terá registrado o risco e proposto alternativa.</p>
<h2>Experiência informal também pode ser verificável</h2>
<p>Uma pessoa que acompanhou vendas por encomenda, cuidado remunerado, apoio em comércio familiar ou projeto comunitário pode validar tarefas e período, desde que a relação seja descrita honestamente. Use títulos funcionais, não cargos que não existiram. A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/mais-acoes/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações do MTE</a> pode ajudar a identificar nomes e tarefas, mas consultar a CBO não transforma atividade informal em vínculo registrado.</p>
<h2>Quando a checagem der errado</h2>
<p>Número desatualizado não precisa encerrar uma seleção se você agir cedo. Avise o recrutador, substitua por contato autorizado e explique a relação. Se a referência trouxe crítica, peça ao recrutador que avalie evidências do trabalho; não ataque a pessoa.</p>
<p>Depois, agradeça sem pedir detalhes confidenciais da conversa. Uma boa rede se mantém com respeito. O objetivo da referência é acrescentar contexto verificável, não garantir contratação.</p>
    `.trim()
  },

  "experiencia-informal-curriculo-como-colocar": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Trabalho informal pode demonstrar competência quando o currículo descreve tarefa, contexto e período com honestidade. O erro não é ter experiência sem registro; é transformá-la em cargo, empresa ou vínculo que nunca existiu.</p>
<h2>Comece por um inventário de trabalho real</h2>
<p>Liste atividades realizadas, para quem, com que frequência, quais ferramentas e como a entrega era conferida. Exemplos: vender refeições por encomenda, atender em comércio familiar, organizar agenda de profissional autônomo, cuidar de crianças, fazer manutenção, editar peças ou separar mercadorias. Não comece pelo título; comece pelo que você conseguia fazer.</p>
<p>Depois, compare essas tarefas com o anúncio. Se a vaga pede atendimento, procure situações de dúvida, reclamação e pagamento. Se pede estoque, identifique contagem, armazenamento e conferência. Se pede organização, mostre prazo, lista ou rotina usada. Só leve para o currículo o que ajuda a entender sua aderência.</p>
<h2>Escolha um título funcional e transparente</h2>
<p>Use rótulo que descreva o trabalho: “Atendimento e vendas por encomenda — atividade autônoma”, “Auxílio em loja familiar — experiência informal” ou “Cuidadora infantil — trabalhos eventuais”. Evite “gerente” quando você não tinha decisão sobre equipe, caixa ou operação.</p>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/mais-acoes/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações (CBO)</a> organiza nomes e descrições de ocupações e pode ajudar a reconhecer a linguagem do mercado. Use-a como referência de vocabulário, não como certificado nem prova de vínculo.</p>
<h2>Escreva período e frequência sem fabricar precisão</h2>
<p>Se você lembra mês e ano, informe. Se a atividade foi eventual, deixe isso claro: “2024–2025, demandas mensais” ou “finais de semana entre março e junho de 2026”. Não preencha lacunas com datas exatas inventadas. Prepare uma explicação simples para períodos alternados.</p>
<p>A <a href="https://www.gov.br/pt-br/temas/carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> permite consultar contratos formais informados nos sistemas oficiais. Uma atividade informal não aparecer ali como vínculo; por isso, o currículo deve separar experiência profissional demonstrável de registro trabalhista.</p>
<h2>Transforme a tarefa em evidência</h2>
<p>Use de duas a quatro linhas por experiência. Estrutura: verbo + objeto + contexto + resultado observável. Exemplos honestos:</p>
<ul><li>“Atendi pedidos por WhatsApp, confirmei endereço e organizei entregas por bairro.”</li><li>“Conferi entradas e saídas em planilha simples e sinalizei falta de produtos ao responsável.”</li><li>“Organizei agenda semanal e confirmei horários com clientes antes do atendimento.”</li><li>“Preparei alimentos sob encomenda seguindo quantidade e horário combinados.”</li></ul>
<p>Número ajuda quando é lembrado e defensável: quantidade média de pedidos, frequência semanal ou prazo. Se você não registrou, não invente. “Atendia volume alto” pode ser explicado; “cresci vendas em 47%” exige base.</p>
<h2>Separe portfólio, referência e documento pessoal</h2>
<p>Guarde fotos, planilhas sem dados de clientes, cardápios, peças ou depoimentos autorizados que demonstrem a atividade. Não publique nomes, telefones ou pedidos de terceiros. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> reforça finalidade e necessidade no uso de dados pessoais.</p>
<p>Peça referência a quem viu o trabalho: cliente recorrente, responsável pelo comércio ou parceiro de projeto. Solicite autorização antes de compartilhar contato e explique para qual vaga. A referência valida contexto; não transforma atividade informal em emprego formal.</p>
<h2>Prepare a resposta da entrevista</h2>
<p>Explique por que começou, como organizava a rotina, um problema que resolveu e o que aprendeu. Exemplo: “Eu ajudava na loja da família aos sábados. Percebi que faltava registro dos pedidos, criei uma planilha simples e passei a confirmar retirada. Não era gerente e não tinha equipe; eu cuidava dessa rotina.”</p>
<p>Essa precisão gera confiança. Se a vaga exigir experiência formal específica, não tente esconder a diferença. Mostre habilidades transferíveis e pergunte se a empresa aceita experiência equivalente. Currículo bom torna o trabalho compreensível sem mudar sua natureza.</p>

<h2>Monte prova em três camadas sem expor terceiros</h2>
<p>A primeira camada é a descrição: período, frequência, tarefa e contexto. A segunda é uma amostra segura, como planilha fictícia com a mesma estrutura, foto de produto autorizado ou peça sem dados de cliente. A terceira é uma referência que aceitou ser contatada. Não dependa de uma captura de conversa privada para demonstrar trabalho; ela pode revelar telefone, endereço, preço e informação de terceiros.</p>
<p>Para cada item, anote quem autorizou o uso e o que pode ser mostrado. Se a pessoa retirar a autorização, substitua a evidência. A LGPD não impede portfólio, mas exige finalidade, necessidade e cuidado com dados pessoais. Quando bastar explicar o processo, use exemplo reconstruído e identifique que é demonstração, não entrega real de cliente.</p>
<h2>Cheque consistência entre currículo, entrevista e cadastro</h2>
<p>O mesmo período não deve aparecer como emprego formal em um documento e atividade autônoma em outro. Antes de enviar, compare título, natureza da relação, datas e tarefas em todas as versões. Se um formulário oferece apenas “emprego”, procure campo de observação ou pergunte ao recrutador como registrar atividade informal; não selecione vínculo falso para avançar.</p>
<p>Exemplo hipotético: alguém produziu bolos sob encomenda em fins de semana. No currículo escreve “Produção e atendimento por encomenda — atividade autônoma”, informa período aproximado e descreve compra de insumos, confirmação de pedidos e organização de entrega. Na entrevista explica que não havia empresa empregadora nem equipe subordinada. A precisão permite avaliar competências sem transformar a experiência em registro inexistente.</p>
    `.trim()
  },

  "curriculo-ats-palavras-chave-sao-luis": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> ATS é uma categoria de sistemas usados para organizar candidaturas; não existe um leitor único nem uma lista universal de palavras que “libera” o currículo. A estratégia segura é alinhar linguagem verdadeira ao anúncio e manter o arquivo legível também para pessoas.</p>
<h2>Extraia o vocabulário da própria vaga</h2>
<p>Copie o anúncio para uma folha e marque quatro grupos: cargo, tarefas, ferramentas e requisitos. Para auxiliar administrativo, por exemplo, podem aparecer atendimento, arquivo, planilha, emissão de documento e sistema interno. Só use termos que correspondam ao seu histórico.</p>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/mais-acoes/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações do Ministério do Trabalho e Emprego</a> ajuda a conferir nomes de ocupações e famílias de tarefas. Ela não informa se uma empresa usa ATS e não substitui o texto do anúncio; serve para padronizar linguagem quando o seu título anterior era muito local ou informal.</p>
<h2>Crie uma base e uma versão adaptada</h2>
<p>Mantenha um currículo-base com todas as experiências comprováveis. Para cada candidatura relevante, duplique e reorganize: título-alvo, resumo curto, competências realmente exigidas e experiências mais próximas. Adaptar é escolher ênfase, não criar habilidade.</p>
<p>Em vez de “proativo e comunicativo”, escreva “atendimento presencial e por WhatsApp; registro de pedidos em planilha”. Em vez de repetir “Excel” dez vezes, cite onde usou: “controle de entrada e saída em planilha com filtros e soma”. A palavra aparece em contexto que você consegue explicar na entrevista.</p>
<h2>Use uma estrutura que continue legível fora do seu editor</h2>
<ul><li>Nome e contato em texto comum.</li><li>Título profissional específico.</li><li>Experiência com organização, período e tarefas.</li><li>Formação e cursos relevantes.</li><li>Ferramentas e idiomas com nível honesto.</li></ul>
<p>Evite esconder informação essencial apenas em cabeçalho, rodapé, imagem, gráfico de barras ou caixa de texto. Salve em PDF quando o anúncio aceitar e teste: selecione e copie uma frase para um editor simples. Se a ordem ficar embaralhada, reduza colunas e elementos decorativos. Quando a empresa exigir outro formato, siga a instrução.</p>
<p>O <a href="https://europass.europa.eu/en/create-europass-cv" target="_blank" rel="noopener noreferrer">Europass, serviço oficial da União Europeia, orienta adaptar o CV à oportunidade</a> e descrever habilidades e experiências de forma estruturada. O modelo europeu não é requisito para vagas de São Luís; a utilidade da fonte está no princípio de conteúdo organizado e ajustado ao objetivo.</p>
<h2>Audite palavras-chave sem “encher” o documento</h2>
<p>Faça uma tabela com três colunas: termo do anúncio, evidência que você possui e seção do currículo. “PDV” só entra se você operou ponto de venda ou concluiu prática que consiga demonstrar. “Disponibilidade de horário” não deve ser copiada se conflita com sua realidade. “CNH B” exige habilitação válida.</p>
<p>Sinônimos ajudam quando são naturais: “atendimento ao cliente” e “suporte ao público”. Não crie bloco invisível, texto branco ou repetição mecânica. Mesmo que um sistema aceite o arquivo, a entrevista revela contradição.</p>
<h2>Considere o canal de São Luís</h2>
<p>Algumas vagas locais recebem PDF por e-mail ou WhatsApp; outras usam formulário ou plataforma. Não conclua que há filtro automático sem evidência. Em canal direto, assunto, nome do arquivo e mensagem de contexto também influenciam a organização da triagem. Em plataforma, preencha os campos porque eles podem ser a principal fonte de busca.</p>
<p>Nomeie o arquivo com nome e cargo, abra no celular e confirme telefone. Não inclua CPF, RG, endereço completo ou dado bancário no currículo inicial. Se houver pedido de pagamento ou código de autenticação, use a <a href="/seguranca-candidatos">página de segurança</a> e valide a empresa.</p>
<h2>Checklist final</h2>
<p>Compare cada requisito com uma evidência; remova palavras sem prova; teste seleção de texto; verifique datas; mantenha tamanho razoável; peça a alguém para ler em trinta segundos. O objetivo não é derrotar um robô imaginário. É criar um documento encontrável, compreensível e consistente com a conversa seguinte.</p>
    `.trim()
  },

  "ingles-no-curriculo-nivel-honesto": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> “Básico”, “intermediário” e “fluente” significam coisas diferentes para pessoas diferentes. Um currículo útil informa o que você consegue fazer no idioma, em qual contexto e com que segurança. Honestidade evita uma expectativa que a entrevista pode testar imediatamente.</p>
<h2>Comece pela tarefa da vaga</h2>
<p>Leia por que o inglês aparece no anúncio. Pode ser leitura de manual, resposta a e-mail, atendimento oral, reunião ou contato diário com equipe estrangeira. Pergunte quando não estiver claro. A mesma pessoa pode ler documentação bem e ainda precisar de apoio para conversar ao vivo.</p>
<p>Não coloque o idioma no centro do currículo se a vaga não usa inglês. Para posição que exige uso diário, leve a informação para uma seção visível e descreva evidência. Certificado antigo sem prática recente deve ser apresentado como formação, não como prova automática de desempenho atual.</p>
<h2>Use uma referência compreensível</h2>
<p>O <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions" target="_blank" rel="noopener noreferrer">Quadro Europeu Comum de Referência para Línguas, do Conselho da Europa</a>, organiza níveis de A1 a C2 e descreve capacidades de compreensão, fala e escrita. Ele é referência, não certificado individual. Só escreva “B2” se você entende o descritor e possui avaliação ou autoavaliação consistente que possa explicar.</p>
<p>Se não usa CEFR, prefira descrição concreta: “inglês para leitura de manuais; escrita de e-mails simples com revisão; conversação básica”. Isso é mais informativo que “intermediário” isolado. Evite porcentagens como “inglês 80%”: elas não revelam tarefa nem critério.</p>
<h2>Faça um teste ligado ao trabalho</h2>
<p>Escolha três atividades do anúncio e simule sem ferramenta automática no primeiro momento:</p>
<ul><li>ler uma página de manual e resumir o procedimento em português;</li><li>escrever um e-mail curto confirmando prazo e pedido;</li><li>apresentar-se por dois minutos e explicar uma experiência;</li><li>ouvir uma instrução e repetir os pontos principais.</li></ul>
<p>Marque o que faz sozinho, com consulta e somente com tradução. Depois, atualize o currículo. Aplicativo de tradução pode fazer parte do trabalho real, mas não deve ser escondido quando a empresa pergunta por autonomia.</p>
<h2>Escreva uma linha que aguente a entrevista</h2>
<p>Exemplos: “Inglês: leitura de documentação técnica; conversação básica”; “Inglês B1 — curso concluído em 2025; uso em e-mails simples”; “Inglês avançado para reuniões e relatórios — uso semanal no projeto X”. Remova certificado sem relação com sua capacidade atual ou deixe claro o ano.</p>
<p>Não invente intercâmbio, curso, nota ou uso profissional. Se aprendeu sozinho, diga “estudo autônomo” e mostre o que consegue fazer. Portfólio traduzido, atendimento real ou projeto bilíngue podem ser evidência, desde que não exponham dados de terceiros.</p>
<h2>Prepare a etapa em outro idioma</h2>
<p>Se o anúncio menciona entrevista em inglês, pergunte formato e duração. Treine apresentação, experiência relevante, disponibilidade e uma pergunta sobre a função. Memorize ideias, não um texto inteiro; pergunta fora do roteiro exige compreensão.</p>
<p>Quando não entender, peça repetição: “Could you please repeat or rephrase the question?” Se precisar de alguns segundos, diga. Fingir compreensão pode gerar resposta incoerente. Se o nível exigido excede o seu, ainda é possível candidatar-se quando o anúncio admite desenvolvimento, mas registre a diferença com clareza.</p>
<h2>Revise sem diminuir sua experiência</h2>
<p>Idioma é uma competência entre outras. Para vagas de atendimento local, estoque, administração ou serviços em São Luís, as tarefas principais podem pesar mais. Não elimine experiência relevante para abrir espaço a uma longa lista de cursos de inglês.</p>
<p>Atualize a descrição quando sua prática mudar. Um nível honesto não é fraqueza: ele permite que a empresa avalie treinamento e que você entre sabendo o que será cobrado. A decisão final deve se apoiar em capacidade demonstrável, não em adjetivo inflado.</p>
    `.trim()
  },

  "alfabetizacao-digital-emprego-basico": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Alfabetização digital para procurar emprego não é saber usar todo aplicativo. É conseguir ler um anúncio, confirmar o canal, preparar um arquivo, preencher um formulário e proteger a própria conta. Este guia propõe um treino prático no celular ou computador, sem prometer contratação.</p>
<h2>Faça um diagnóstico com uma candidatura simulada</h2>
<p>Crie uma pasta de treino e tente concluir cinco tarefas: abrir um anúncio em outra aba; salvar a URL e a data; escrever uma mensagem curta; anexar um PDF; e localizar o arquivo enviado. Marque onde precisou de ajuda. O ponto fraco pode ser nomear arquivos, recuperar senha, alternar entre aplicativos ou entender um campo obrigatório.</p>
<p>Use dados fictícios no ensaio. Não coloque CPF, RG, endereço completo, senha ou documento de outra pessoa. Quando repetir o exercício com uma vaga real, confira se o destinatário é o mesmo informado no canal institucional.</p>
<h2>Domine o ciclo do arquivo</h2>
<p>Mantenha um currículo-base editável e uma cópia em PDF. Nomeie a versão enviada com nome, cargo e mês, por exemplo <em>ana-silva-auxiliar-out-2026.pdf</em>. Abra o arquivo depois de salvar: confira telefone, e-mail, quebras de página e se o texto pode ser selecionado. Foto da tela não substitui PDF quando o anúncio pede documento.</p>
<p>Crie pastas simples: “currículo-base”, “versões enviadas”, “certificados” e “anúncios”. Dentro do controle de candidaturas, registre empresa, cargo, URL, data, canal e próxima ação. Não armazene senhas na mesma planilha.</p>
<h2>Treine e-mail e formulário antes do prazo</h2>
<p>No e-mail, pratique assunto identificável, saudação, duas linhas de contexto e assinatura. Antes de enviar, confirme anexo e destinatário. Em formulário, leia todos os campos antes de começar, separe arquivos aceitos e observe limite de tamanho. Se a conexão cair, verifique se houve confirmação antes de repetir o envio.</p>
<p>A <a href="https://www.escolavirtual.gov.br/catalogo" target="_blank" rel="noopener noreferrer">Escola Virtual de Governo</a> mantém catálogo gratuito com filtros de carga horária e temas como mentalidade digital e segurança da informação. Escolha formação pelo obstáculo identificado, não pela promessa de “emprego garantido”. Curso é apoio; a candidatura ainda depende de requisitos e seleção.</p>
<h2>Proteja as contas usadas na busca</h2>
<p>Use senhas diferentes e ative verificação em duas etapas quando disponível. Nunca entregue código recebido por SMS ou aplicativo autenticador. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne orientações sobre senhas, autenticação, phishing, privacidade e dispositivos móveis.</p>
<p>Desconfie de urgência artificial, cobrança, link encurtado sem contexto e pedido de instalação de aplicativo para “liberar” vaga. Digite o endereço oficial no navegador em vez de entrar pelo link da mensagem. Se alguém pedir pagamento ou controle remoto do aparelho, interrompa.</p>
<h2>Plano de sete dias</h2>
<ol><li>Dia 1: organizar pastas e contatos.</li><li>Dia 2: revisar e exportar o currículo.</li><li>Dia 3: enviar um e-mail de teste a si mesmo.</li><li>Dia 4: preencher um formulário fictício.</li><li>Dia 5: recuperar um arquivo e uma senha com segurança.</li><li>Dia 6: conferir um anúncio e seu canal oficial.</li><li>Dia 7: repetir o ciclo sem ajuda e anotar dúvidas.</li></ol>
<p>Peça apoio a uma pessoa de confiança apenas para observar o processo; não compartilhe senha. O objetivo é sair do “não sei mexer” para uma lista concreta de tarefas já praticadas e pontos que ainda precisam de treino.</p>
<p>Repita o exercício no aparelho que costuma usar. No celular, pratique alternar entre navegador, e-mail e arquivos sem perder o formulário. No computador, localize downloads e anexos. Anote o caminho de cada tarefa com suas próprias palavras para conseguir repetir depois sem depender da memória.</p>
    
<h2>Confirme o endereço antes de preencher qualquer dado</h2>
<p>Abra o anúncio pelo site institucional, confira domínio, cadeado e caminho da candidatura. Domínio parecido, página traduzida de forma estranha ou formulário que pede senha são sinais para interromper. O cadeado indica conexão protegida, não prova que a empresa é legítima; confirme a oportunidade por outro canal oficial.</p>
<h2>Treine permissões e tamanho de arquivo</h2>
<p>No celular, pratique conceder acesso somente ao arquivo escolhido, localizar downloads e remover permissão desnecessária depois. Antes do envio, confira formato, tamanho e nome solicitados. Se o portal rejeitar o PDF, faça uma cópia otimizada sem converter páginas em fotografia e abra novamente para garantir que telefone, e-mail e texto continuam legíveis.</p>
<h2>Registre a confirmação sem duplicar candidatura</h2>
<p>Depois do envio, anote data, URL, cargo e mensagem de confirmação. Salve protocolo ou e-mail, mas não repita o formulário apenas porque a página demorou. Primeiro consulte a área de candidaturas ou caixa de entrada. Envios duplicados podem gerar versões diferentes e confusão sobre qual currículo vale.</p>
<h2>Crie um teste mensal de autonomia</h2>
<p>Use uma vaga encerrada ou cenário fictício e execute o ciclo inteiro sem ajuda: verificar origem, adaptar currículo, exportar PDF, anexar, revisar e registrar. Marque cada etapa como “sozinho”, “com consulta” ou “com ajuda”. O objetivo é escolher o próximo treino, não se comparar com outra pessoa. Nunca entregue acesso remoto ao aparelho para alguém completar a candidatura em seu nome.</p>
`.trim()
  },

  "certificado-ou-experiencia-curriculo": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Certificado registra uma atividade formativa; experiência descreve trabalho realizado. Um não substitui automaticamente o outro. O anúncio define se determinado documento é obrigatório, desejável ou apenas complementar.</p>
<h2>Separe exigência formal de evidência prática</h2>
<p>Leia cada requisito e classifique em quatro grupos: formação obrigatória, habilitação ou registro, conhecimento técnico e experiência. Se a vaga exige documento específico por norma ou política da empresa, prática informal não elimina a exigência. Se pede “experiência com atendimento”, um exemplo bem explicado pode ser mais útil que uma lista de cursos genéricos.</p>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/mais-acoes/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações do Ministério do Trabalho e Emprego</a> ajuda a reconhecer nomes e famílias de ocupações. Ela serve como referência de vocabulário; não certifica a pessoa nem comprova vínculo.</p>
<h2>Transforme curso em competência demonstrável</h2>
<p>Para cada curso relevante, responda: o que aprendi, o que pratiquei e qual produto consigo mostrar ou explicar? Um curso de planilha pode resultar em controle fictício de estoque; atendimento pode virar roteiro de registro e encaminhamento; escrita pode produzir um e-mail claro. Use dados inventados no exercício, nunca informações reais de clientes.</p>
<p>No currículo, registre nome do curso, instituição, ano e carga horária quando constarem no documento. Não altere duração, nível ou entidade emissora. Se está cursando, escreva “em andamento” e a previsão real, sem antecipar conclusão.</p>
<h2>Escolha a ordem conforme a vaga</h2>
<p>Experiência recente e relacionada costuma merecer mais espaço do que certificado antigo sem conexão com a função. Para quem ainda não trabalhou na área, um curso acompanhado de projeto pode aparecer antes. Exemplo: “Excel básico, 20 h, concluído em 2026 — prática com soma, filtro e controle fictício de entradas”.</p>
<p>A <a href="https://www.escolavirtual.gov.br/catalogo" target="_blank" rel="noopener noreferrer">Escola Virtual de Governo</a> permite consultar catálogo, carga horária, tema e instituição conteudista. Use a página do próprio emissor para confirmar conteúdo e validação. Captura de tela, selo em rede social ou arquivo sem origem identificável merece checagem antes de entrar no currículo.</p>
<h2>Prepare duas provas para a entrevista</h2>
<p>Para experiência, use uma situação real: contexto, tarefa, ação e resultado observável. Para curso, escolha um exercício que mostre aplicação. Se o recrutador perguntar por algo que você só estudou, diga isso. “Pratiquei em atividade simulada, mas ainda não usei no trabalho” é preciso e evita expectativa falsa.</p>
<p>Não leve pasta inteira no primeiro contato. Envie certificado apenas quando solicitado e pelo canal confirmado. O currículo pode mencionar a formação; documentos pessoais e comprovações ficam para etapa legítima do processo.</p>
<p>Exemplo hipotético: uma candidata a recepção possui curso recente de atendimento e ajudou na organização de agenda de uma associação. No currículo, ela pode separar “formação complementar” da experiência voluntária e explicar o que fez em cada uma. Não deve transformar a associação em emprego, nem afirmar que o certificado prova domínio de um sistema que não utilizou.</p>
<h2>Critério de decisão</h2>
<ul><li>É requisito obrigatório? Confirme documento e validade.</li><li>É conhecimento desejável? Mostre prática proporcional ao nível.</li><li>É experiência? Descreva tarefa, contexto e período.</li><li>É curso sem relação? Retire da versão adaptada.</li><li>Não possui o requisito? Não invente; avalie se a vaga aceita desenvolvimento.</li></ul>
<p>O melhor currículo não escolhe entre papel e prática como se fossem rivais. Ele apresenta cada evidência pelo que realmente comprova.</p>
<p>Antes do envio, peça a alguém que leia apenas trinta segundos e diga o que entendeu como habilidade principal. Se a resposta for apenas “tem muitos cursos”, reorganize. A mensagem desejada é qual tarefa você consegue executar, qual formação sustenta isso e onde ainda está aprendendo.</p>
    `.trim()
  },

  "cursos-no-curriculo-sem-enchimento": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> A seção de cursos deve ajudar o recrutador a entender preparação para aquela função. Quantidade não compensa falta de relação, data ou aplicação. Faça uma seleção diferente para cada cargo-alvo, sem apagar o histórico do seu arquivo-base.</p>
<h2>Crie um inventário antes de cortar</h2>
<p>Em uma folha separada, liste curso, instituição, situação, ano, carga horária, conteúdo principal e onde aplicou. Inclua somente dados que consegue confirmar. Depois marque A para diretamente relacionado à vaga, B para complementar e C para sem relação atual.</p>
<p>Na versão enviada, comece pelos cursos A e use B apenas se acrescentarem informação. Os C podem permanecer no arquivo-base, mas não precisam ocupar o currículo de uma página. Curso abandonado não deve aparecer como concluído; registre “em andamento” apenas se houver atividade real.</p>
<h2>Leia o anúncio como matriz de seleção</h2>
<p>Separe tarefas, ferramentas e requisitos. Para atendimento, por exemplo, um curso de comunicação pode ser relevante se você consegue relacioná-lo a registro de demanda, escuta ou resposta. Para estoque, planilha, conferência e segurança podem fazer sentido. Não afirme que “empresas de São Luís preferem” certo certificado sem pesquisa e sem anúncio verificável.</p>
<p>A <a href="https://europass.europa.eu/pt/create-europass-cv" target="_blank" rel="noopener noreferrer">orientação oficial do Europass para criar currículo</a> organiza formação, competências e experiências em campos distintos. O formato europeu não é exigência local; a utilidade está em separar informação e adaptar o documento à oportunidade.</p>
<h2>Escreva cada item com precisão</h2>
<p>Um padrão suficiente é: “Nome do curso — instituição, carga horária, ano”. Se a relação não estiver clara, acrescente uma linha curta de aplicação, como “prática de filtros e soma em controle fictício de estoque”. Evite copiar a ementa inteira ou usar adjetivos como “completo” e “avançado” quando o documento não diz isso.</p>
<p>O catálogo da <a href="https://www.escolavirtual.gov.br/catalogo" target="_blank" rel="noopener noreferrer">Escola Virtual de Governo</a> mostra filtros por tema, competência e carga horária. Ele é um exemplo de como conferir detalhes na fonte. Para qualquer instituição, volte ao site emissor e verifique nome, conteúdo, duração e forma de validação antes de registrar.</p>
<h2>Use um teste de relevância</h2>
<ol><li>O curso aparece como requisito ou ajuda em uma tarefa do anúncio?</li><li>Foi concluído ou a situação está descrita corretamente?</li><li>Você consegue explicar um conceito ou exercício sem ler o certificado?</li><li>Há item mais recente e relacionado ocupando menos espaço?</li><li>O recrutador precisa do certificado agora ou só da informação?</li></ol>
<p>Se a resposta à primeira e à terceira perguntas for não, retire da versão adaptada. Um curso pode ter valor pessoal sem ser útil para aquela seleção.</p>
<h2>Exemplo de antes e depois</h2>
<p>Antes: “Informática, liderança, empreendedorismo, vendas, marketing, atendimento, inglês”. Depois: “Excel básico — instituição X, 20 h, 2026; prática com filtros e soma” e “Atendimento ao público — instituição Y, 12 h, 2025; registro e encaminhamento de solicitações”. O segundo formato permite perguntas e verificação.</p>
<p>Guarde certificados em pasta organizada e envie somente quando solicitado. Não anexe vários documentos ao primeiro e-mail nem exponha CPF, assinatura ou código de validação em portfólio público. O objetivo da seção é facilitar a triagem, não decorar margem.</p>
<p>Revise também o espaço consumido. Se seis cursos empurram a experiência relacionada para a segunda página, reduza a lista. O recrutador precisa localizar primeiro o que responde ao anúncio. Formação complementar pode ter três ou quatro itens fortes; o inventário completo fica guardado para outras vagas ou para comprovação quando houver pedido legítimo.</p>
    
<h2>Dê uma nota que possa ser explicada</h2>
<p>Para cada curso, avalie quatro perguntas: aparece como requisito ou tarefa do anúncio? Você concluiu e consegue provar? O conteúdo ainda é aplicável à ferramenta citada? Consegue contar uma situação em que usou o aprendizado? Use 0 para “não”, 1 para “parcial” e 2 para “sim”. A soma não é ciência nem regra de recrutamento; é um filtro pessoal para comparar itens com o mesmo critério.</p>
<p>Um curso curto pode ficar acima de outro mais longo quando responde diretamente à tarefa. Para atendimento, “registro de solicitações e resposta ao cliente” é mais informativo do que listar dez certificados genéricos. Para estoque, um curso de planilha ganha valor quando você explica que treinou cadastro, filtro e conferência com dados fictícios.</p>
<h2>Trate pendência, validade e comprovação sem maquiar</h2>
<p>Curso interrompido não deve ser marcado como concluído. Se você retomou uma formação, escreva “em andamento” e uma previsão apenas quando a instituição a fornece ou você mantém um plano real. Certificação vencida deve conservar a data; não use “válida” sem conferir a regra do emissor. Quando não há certificado, descreva o aprendizado como estudo ou prática, sem inventar instituição, carga horária ou credencial.</p>
<h2>Teste a versão enviada</h2>
<p>Abra o currículo no celular e no computador, confira se o link é legível e se não exige acesso à sua conta. O catálogo da <a href="https://www.escolavirtual.gov.br/catalogo" target="_blank" rel="noopener noreferrer">Escola Virtual.Gov</a> mostra instituição, conteúdo e carga horária dos cursos ofertados; use a página específica do curso como referência, não a página inicial como prova genérica. Antes do envio, peça a alguém para responder em 30 segundos: qual curso se relaciona à vaga e o que você sabe fazer por causa dele? Se a resposta não aparece, reescreva ou remova o item.</p>
`.trim()
  },

  "excel-basico-vagas-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> “Excel básico” ou “intermediário” varia entre anúncios e empresas. Em vez de adivinhar o nível, leia as tarefas e treine operações que correspondem ao cargo. Este roteiro usa dados fictícios e não afirma o conteúdo de testes específicos.</p>
<h2>Traduza o anúncio em tarefas de planilha</h2>
<p>Se a vaga menciona estoque, pratique cadastro de item, quantidade, entrada, saída e alerta de reposição. Para administrativo, organize data, documento, responsável e status. Em atendimento, monte lista de solicitações sem dados pessoais reais. Cada cenário deve caber em uma tabela simples.</p>
<p>Comece com digitação consistente: uma informação por coluna, datas como datas, valores como números e cabeçalhos claros. Uma planilha visualmente bonita, mas com texto e número misturados, dificulta filtro e cálculo.</p>
<h2>Treine o núcleo antes das funções avançadas</h2>
<p>A página oficial de <a href="https://support.microsoft.com/pt-br/excel/" target="_blank" rel="noopener noreferrer">ajuda e aprendizado do Excel</a> organiza conteúdos de introdução, fórmulas e funções, importação, análise e formatação. Use a documentação compatível com sua versão; menus podem mudar entre navegador, celular e computador.</p>
<ul><li>ordenar por texto, data e número;</li><li>aplicar e limpar filtros;</li><li>formatar data, moeda e porcentagem;</li><li>usar SOMA, MÉDIA, MÍNIMO e MÁXIMO;</li><li>criar referências simples entre células;</li><li>localizar erro e desfazer uma alteração;</li><li>salvar cópia e exportar quando solicitado.</li></ul>
<p>Não pule direto para macro, PROCX ou tabela dinâmica porque parecem mais valiosos. Eles só entram no currículo se você realmente utiliza e consegue explicar.</p>
<h2>Monte um exercício de 30 minutos</h2>
<p>Crie uma tabela fictícia com vinte produtos, categorias, quantidades e preços. Calcule o total por linha, some o estoque, filtre uma categoria e ordene do menor para o maior valor. Depois altere três entradas e confirme se os resultados mudaram.</p>
<p>Em outro arquivo, registre dez atendimentos fictícios com data, assunto, responsável e status. Filtre os pendentes e conte manualmente para conferir. Essa verificação mostra se a fórmula e o filtro produziram resultado coerente.</p>
<h2>Descreva o nível pelo que você faz</h2>
<p>No currículo, prefira “Excel: tabelas, filtros, ordenação e fórmulas básicas” a “Excel 80%”. Se usa tabela dinâmica ou procura valores, cite somente quando praticou. Se aprendeu em curso e ainda não aplicou no trabalho, deixe a situação transparente.</p>
<p>Em entrevista, prepare uma explicação curta: objetivo da planilha, colunas, fórmula e conferência. Não leve arquivo de emprego anterior com nomes, vendas ou dados de clientes. Recrie o exemplo com informações fictícias.</p>
<p>Um exemplo de resposta honesta seria: “Usei planilha em atividade escolar para organizar materiais. Sei criar tabela, filtrar e somar; ainda não usei Excel em estoque profissional.” A frase diferencia prática real de experiência de trabalho e permite que a empresa decida se o nível atende à função ou se haverá treinamento.</p>
<h2>Antes de um teste</h2>
<ul><li>Confirme versão, duração, formato e regras informadas.</li><li>Teste teclado, mouse, navegador e conexão.</li><li>Leia a questão inteira antes de editar.</li><li>Salve quando o sistema permitir.</li><li>Se houver falha técnica, registre horário e mensagem sem fotografar conteúdo proibido.</li></ul>
<p>Treinar o básico com conferência vale mais que decorar atalhos. A afirmação mais forte no currículo é aquela que você consegue repetir diante de uma planilha vazia.</p>
<p>Faça o exercício novamente depois de dois dias, sem seguir passo a passo escrito. Compare o resultado com a primeira versão: fórmulas corretas, filtros removidos, datas consistentes e arquivo salvo no local certo. Se errar, documente o caminho da correção. Saber conferir e recuperar um erro também faz parte do uso cotidiano.</p>
    
<h2>Valide a planilha como se outra pessoa fosse recebê-la</h2>
<p>Depois de terminar o exercício, faça uma cópia e siga uma rotina: remova filtros, confirme o intervalo das fórmulas, procure células vazias inesperadas, compare totais com uma contagem manual pequena e ordene novamente para verificar se linhas não se separaram. Erro escondido por formatação continua sendo erro. Registre em uma nota o que foi conferido, sem afirmar domínio além do que o arquivo demonstra.</p>
<h2>Tenha cuidado ao importar CSV e trocar de versão</h2>
<p>Arquivo CSV guarda valores separados por delimitador e pode interpretar datas, zeros à esquerda e acentos de modo diferente conforme idioma e configuração. A orientação oficial da Microsoft sobre <a href="https://support.microsoft.com/pt-br/office/importar-ou-exportar-arquivos-de-texto-txt-ou-csv-5250ac4c-663c-47ce-937b-339e391393ba" target="_blank" rel="noopener noreferrer">importar ou exportar texto e CSV</a> mostra caminhos de importação e opções de tratamento. Trabalhe sobre uma cópia, confira a prévia e compare quantidade de linhas antes e depois.</p>
<p>Abra o exercício no ambiente que será usado na seleção, quando informado. Função disponível no aplicativo de computador pode ter nome, separador ou comportamento diferente no navegador. Se a empresa não disser a versão, peça confirmação em vez de instalar programa ou complemento enviado por link desconhecido.</p>
<h2>Monte um exemplo pequeno, verificável e sem dados reais</h2>
<p>Crie uma tabela fictícia com item, data, quantidade, responsável genérico e status. Produza uma visão filtrada, um total e uma coluna calculada simples. Inclua uma aba curta chamada “Leia-me” com objetivo, fonte sintética dos dados e operações praticadas. Esse arquivo não prova nível universal de Excel, mas permite explicar seu processo. Nunca use cadastro de cliente, funcionário ou empresa anterior como portfólio.</p>
`.trim()
  },

  "gap-habilidades-candidatura-como-fechar": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Uma lacuna de habilidade é a diferença entre o que a função pede e o que você consegue demonstrar hoje. Ela não deve ser escondida nem transformada em lista aleatória de cursos. O caminho é classificar o requisito, estimar o esforço e produzir evidência proporcional.</p>
<h2>Compare anúncios do mesmo cargo</h2>
<p>Reúna de cinco a dez anúncios atuais com origem confirmada. Em uma tabela, registre tarefa, ferramenta, requisito obrigatório, item desejável e frequência. Não misture cargos diferentes. O que aparece uma vez pode ser particular de uma empresa; o que se repete ajuda a definir prioridade, sem provar uma regra para todo o mercado.</p>
<p>Use a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/mais-acoes/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> para entender nomes de ocupações e famílias relacionadas. A CBO não substitui o anúncio nem certifica competência; ela ajuda a comparar linguagem.</p>
<h2>Classifique a lacuna antes de estudar</h2>
<ul><li><strong>Legal ou documental:</strong> habilitação, registro ou formação exigida. Não se resolve com tutorial.</li><li><strong>Técnica:</strong> ferramenta, procedimento ou conhecimento que pode ser praticado.</li><li><strong>Experiência:</strong> uso em contexto real, estágio, projeto ou atividade informal.</li><li><strong>Comportamental:</strong> conduta observável em situação, não adjetivo.</li><li><strong>Logística:</strong> horário, deslocamento ou equipamento; não é curso.</li></ul>
<p>Essa separação evita estudar Excel quando o verdadeiro impeditivo é disponibilidade de turno, ou buscar certificado curto quando a vaga exige habilitação formal.</p>
<h2>Escolha uma entrega verificável</h2>
<p>Para ferramenta, construa exercício com dados fictícios. Para atendimento, escreva roteiro e simule registro. Para comunicação, produza e revise um e-mail. Para organização, monte cronograma com prioridade e prazo. A entrega precisa mostrar o nível atual e respeitar dados de terceiros.</p>
<p>O catálogo da <a href="https://www.escolavirtual.gov.br/catalogo" target="_blank" rel="noopener noreferrer">Escola Virtual de Governo</a> permite filtrar temas, competências e carga horária. Use esse ou outro catálogo confiável depois de definir a lacuna. Antes de se inscrever, confirme ementa, instituição, duração, custo e se a prática corresponde ao objetivo.</p>
<h2>Use um ciclo curto de aprendizagem</h2>
<ol><li>Defina uma habilidade e uma tarefa-alvo.</li><li>Faça um diagnóstico sem consulta.</li><li>Estude o conteúdo necessário.</li><li>Repita a tarefa em cenário diferente.</li><li>Peça revisão específica.</li><li>Registre o que já faz sozinho e o que ainda exige apoio.</li></ol>
<p>Ao final, decida entre candidatar-se agora, buscar vaga de entrada ou adiar. Se o requisito é desejável e você cobre o núcleo da função, pode fazer sentido enviar currículo informando “em desenvolvimento”. Se é obrigatório e você não possui, não marque como concluído.</p>
<p>Registre a decisão em uma linha: “candidatar agora”, “reavaliar em sete dias” ou “não elegível”. Junte a URL e a data do anúncio. Isso evita que uma exigência antiga continue guiando estudo depois que o processo encerrou e ajuda a comparar novas vagas sem reconstruir a análise toda vez.</p>
<h2>Explique sem se diminuir</h2>
<p>Na entrevista: “Ainda não usei a ferramenta em emprego. Concluí o módulo X e montei este exercício; consigo fazer A e B, mas ainda preciso de apoio em C.” Essa resposta oferece limite e evidência. Evite “aprendo qualquer coisa rápido” sem exemplo.</p>
<p>Revise a matriz a cada duas semanas e arquive anúncios encerrados. O objetivo não é zerar toda lacuna, mas direcionar tempo para aquilo que aparece no cargo escolhido e que pode ser comprovado honestamente.</p>
<p>Evite comprar curso sob pressão de anúncio que expira. Primeiro confirme se a exigência se repete e se a formação tem conteúdo, instituição e suporte identificáveis. Nenhum curso legítimo pode prometer que a seleção vai aprovar você; ele só pode oferecer aprendizagem e, quando previsto, documento de participação ou conclusão.</p>
    
<h2>Priorize por frequência, necessidade e possibilidade de prova</h2>
<p>Para cada requisito repetido, dê três notas de 0 a 2: frequência nos anúncios comparáveis, impacto na tarefa principal e possibilidade de produzir evidência segura. Uma exigência legal frequente pode ser decisiva, mas não vira prioridade de curso curto; precisa do caminho formal correspondente. Uma ferramenta desejável e praticável pode entrar no plano mesmo com pontuação menor.</p>
<p>Registre também o que já possui. Se você sabe filtrar planilhas, mas ainda erra referências de célula, a lacuna é específica; não recomece um curso inteiro sem diagnóstico. Quando o anúncio usa uma palavra ampla, como “sistema”, peça exemplo da tarefa em vez de inventar a plataforma.</p>
<h2>Defina critério de conclusão antes do estudo</h2>
<p>Escreva uma entrega e um teste: “montar uma planilha fictícia com cadastro, filtro e total; depois refazer com dados diferentes sem consultar o passo a passo”. Para comunicação, pode ser redigir resposta, revisar tom e explicar por que cada informação foi incluída. Arquivo bonito sem critério não demonstra autonomia.</p>
<h2>Use uma regra de parada</h2>
<p>Revise a matriz após duas semanas ou quando reunir novos anúncios equivalentes. Pare de investir quando o requisito deixa de aparecer, quando depende de licença que você não pode obter agora ou quando outra lacuna bloqueia a candidatura primeiro. Guarde versões do exercício e anote feedback recebido, mas não publique dados reais de empresa, cliente ou colega.</p>
`.trim()
  },

  "soft-skills-hard-skills-curriculo": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> “Soft skill” e “hard skill” são rótulos úteis apenas quando ligados a uma tarefa. No currículo, uma ferramenta pode ser demonstrada por uso; um comportamento precisa de situação observável. Listas de adjetivos sem contexto não permitem avaliação.</p>
<h2>Comece pelas tarefas, não pelos rótulos</h2>
<p>Copie três tarefas centrais do anúncio. Para cada uma, pergunte: que conhecimento técnico é necessário e que comportamento ajuda a executá-la? Atender reclamação pode exigir uso do sistema e escrita, além de escuta e autocontrole. Conferir estoque pede planilha e método, além de atenção e comunicação de divergência.</p>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/mais-acoes/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">CBO do Ministério do Trabalho e Emprego</a> reúne títulos e descrições de ocupações. Consulte-a para entender vocabulário, mas use o anúncio e sua experiência como base. A classificação não prova que você possui as competências.</p>
<h2>Prove habilidade técnica em contexto</h2>
<p>Em vez de “Pacote Office”, escreva “planilhas com filtros e soma para controle de entradas”. Em vez de “sistema de vendas”, informe o tipo de tarefa: cadastro, fechamento ou consulta, sem revelar senha ou dado empresarial. Curso pode apoiar a evidência, mas não substitui prática quando a vaga pede experiência.</p>
<p>Se a habilidade está em desenvolvimento, declare o limite. “Excel básico: filtros, ordenação e SOMA” é mais claro que “intermediário” quando você ainda não usa tabela dinâmica.</p>
<h2>Conte comportamento como cena verificável</h2>
<p>Escolha uma situação real e use quatro partes: contexto, responsabilidade, ação e resultado observável. Para organização: “Durante uma semana de pedidos, mantive lista com prazo e confirmei retirada; os pedidos ficaram identificados até a entrega.” Para colaboração: “Percebi divergência no estoque, conferi com a colega e avisei o responsável antes da venda.”</p>
<p>Não transforme participação em liderança. Se coordenou apenas uma tarefa, descreva isso. Se o resultado não foi medido, não invente percentual. Resultado pode ser prazo cumprido, erro identificado ou demanda encaminhada.</p>
<h2>Distribua as evidências pelo currículo</h2>
<p>Use resumo curto para duas ou três forças ligadas ao cargo. Nas experiências, mostre onde elas apareceram. Na seção de cursos, registre formação relevante. Um bloco com vinte palavras — “proativo, resiliente, líder, comunicativo” — ocupa espaço sem explicar nada.</p>
<p>O <a href="https://europass.europa.eu/pt/create-europass-cv" target="_blank" rel="noopener noreferrer">Europass</a> separa experiências, formação e competências ao estruturar um currículo. Ele não é requisito para São Luís; serve como referência de organização e adaptação.</p>
<h2>Prepare a entrevista com pares de prova</h2>
<p>Para cada habilidade destacada, leve um exemplo e um limite. “Consigo organizar agenda de atendimento; ainda não administrei escala de equipe.” “Uso filtros e soma; ainda estou aprendendo tabela dinâmica.” Isso permite avaliar aderência sem exagero.</p>
<p>Exemplo hipotético: quem ajudou em comércio familiar pode demonstrar comunicação ao explicar como registrava pedido, confirmava preço com o responsável e orientava retirada. A hard skill pode ser o uso da planilha ou do aplicativo; a soft skill aparece na sequência de ações, não na palavra “comunicativo”. Deixe claro que a atividade foi informal.</p>
<ul><li>A habilidade aparece em tarefa real?</li><li>Há exemplo que você consegue explicar?</li><li>O nível está descrito sem porcentagem inventada?</li><li>Curso e experiência estão separados?</li><li>O texto evita dado confidencial?</li></ul>
<p>Currículo forte não precisa escolher entre técnica e comportamento. Ele mostra como as duas se encontram no trabalho e onde começa a aprendizagem necessária.</p>
<p>Revise a linguagem para não discriminar experiências informais, escolares ou voluntárias. Elas podem demonstrar comportamento e técnica quando o contexto está claro. O que não podem é aparecer como emprego formal, cargo de chefia ou resultado comercial inexistente. Transparência aumenta a consistência entre currículo, portfólio e entrevista.</p>
    `.trim()
  },

  "portfolio-simples-candidato-emprego": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Portfólio não é exclusivo de design. Ele pode demonstrar organização, escrita, planilha, atendimento ou procedimento, desde que a amostra tenha contexto e não exponha dados. Nem toda vaga precisa desse material; envie quando o anúncio pedir ou quando a prova esclarecer uma competência central.</p>
<h2>Escolha três evidências alinhadas ao cargo</h2>
<p>Para administrativo, use planilha fictícia, modelo de e-mail e fluxo de arquivo. Para atendimento, apresente roteiro de registro, resposta a caso simulado e organização de fila. Para estoque, mostre tabela de entradas e saídas com dados inventados. Se o trabalho pertence a empregador ou cliente, obtenha autorização ou recrie do zero.</p>
<p>Cada peça precisa responder: qual era o problema, o que você fez, qual ferramenta usou e o que a amostra demonstra. Sem essa legenda, o recrutador vê arquivo, não competência.</p>
<h2>Remova dados e direitos que não são seus</h2>
<p>Apague nomes, telefones, endereços, documentos, matrículas, vendas e informações internas. Cobrir com retângulo pode não remover o texto embutido; recriar a amostra com conteúdo fictício é mais seguro. Não publique foto de colega, cliente ou estabelecimento sem autorização.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados</a> estabelece princípios como finalidade, adequação e necessidade no tratamento de dados pessoais. O portfólio deve usar apenas o indispensável — na maioria dos casos, nenhum dado real.</p>
<h2>Monte um PDF curto e acessível</h2>
<p>Abra com nome, cargo-alvo, contato profissional e uma frase de escopo. Depois, dedique uma página por projeto: título, contexto, ação, imagem ou tabela e aprendizado. Use fonte legível, contraste, texto alternativo quando a plataforma aceitar e links descritivos.</p>
<p>Exporte, abra no celular e confirme peso, páginas, ortografia e links. Nomeie o arquivo de forma clara. Se usar site, ofereça também PDF, pois conexão, bloqueio de plataforma ou login podem impedir acesso.</p>
<h2>Explique o que é simulação</h2>
<p>Projeto criado para treinar deve aparecer como “exercício autoral” ou “caso simulado”. Não invente cliente, contratação ou resultado. Exemplo: “Controle fictício de estoque com 30 itens, criado para praticar validação, filtro e alerta de reposição”. Isso demonstra iniciativa sem fabricar experiência.</p>
<p>O <a href="https://europass.europa.eu/pt/create-europass-cv" target="_blank" rel="noopener noreferrer">Europass</a> permite organizar experiências, competências e documentos de apoio. Não é exigência local, mas ajuda a entender que portfólio complementa — e não substitui — o currículo adaptado.</p>
<h2>Envie com contexto e controle de acesso</h2>
<p>No e-mail, diga por que o material é relevante e quantas páginas possui. Se o anúncio não pede link, não force. Em armazenamento compartilhado, teste permissão em janela anônima e evite dar acesso de edição. Não use encurtador desconhecido.</p>
<p>Faça ainda uma revisão de autoria. Identifique o que foi produzido sozinho, em grupo ou adaptado de modelo. Em trabalho coletivo, descreva sua parte. Template público pode ser citado como ponto de partida, mas não deve ser apresentado como criação integral. Guarde versão e data para saber qual arquivo acompanhou cada candidatura.</p>
<ul><li>Três peças relacionadas à vaga.</li><li>Dados fictícios ou autorização documentada.</li><li>Legenda com contexto, ação e aprendizado.</li><li>Arquivo leve, legível e sem login obrigatório.</li><li>Nenhuma senha, documento ou informação confidencial.</li></ul>
<p>Atualize o conjunto quando mudar de cargo-alvo. Portfólio curto e explicável é melhor que pasta extensa sem autoria, contexto ou proteção de dados.</p>
<p>Antes de publicar, abra o link sem estar conectado, no celular e em conexão comum. Confira se o arquivo não revela histórico de edição, comentários, nome de cliente ou versões antigas. Se houver dúvida sobre autorização ou propriedade intelectual, mantenha a peça privada e substitua por exercício autoral claramente identificado.</p>
    `.trim()
  },

  "teste-online-processo-seletivo-dicas": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Testes on-line variam: podem avaliar raciocínio, escrita, ferramenta, idioma ou situação de trabalho. A regra válida é a informada pela empresa ou plataforma. Este guia ajuda a preparar ambiente, segurança e registro de falha sem ensinar a burlar avaliação.</p>
<h2>Confirme o convite antes de abrir</h2>
<p>Compare remetente, empresa, cargo e processo ao qual você se candidatou. Volte ao canal oficial por um endereço digitado por você e confirme se houver divergência. Desconfie de cobrança, instalação de programa de acesso remoto, pedido de senha, código de autenticação ou documento bancário.</p>
<p>A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne orientações sobre phishing, senhas, autenticação, privacidade e dispositivos móveis. Use essas práticas também em processos seletivos.</p>
<h2>Leia regras e prazo antes do cronômetro</h2>
<p>Anote data limite, duração, número de tentativas, navegador compatível, documentos permitidos e política de pausa. Verifique se câmera ou microfone são exigidos e qual finalidade foi informada. Se houver necessidade de acessibilidade, procure o contato do processo antes de iniciar.</p>
<p>Não presuma que captura de tela, calculadora, consulta ou ajuda externa são permitidas. Siga a regra escrita. Se algo não estiver claro, pergunte ao responsável e guarde a resposta.</p>
<h2>Faça um ensaio técnico</h2>
<ul><li>Reinicie o aparelho e feche atualizações pendentes.</li><li>Teste conexão, carregador, teclado, câmera e áudio.</li><li>Abra o navegador indicado e permita somente acessos necessários.</li><li>Escolha local silencioso e avise quem mora com você.</li><li>Tenha o contato de suporte e o identificador da candidatura.</li></ul>
<p>Plano B não significa duas pessoas respondendo. Pode ser carregador, outro ponto de conexão permitido ou orientação prévia de suporte. Trocar de dispositivo durante a prova pode invalidar a sessão; confirme antes.</p>
<h2>Gerencie tempo sem inventar resposta</h2>
<p>Leia o enunciado e identifique o que precisa ser entregue. Em prova com navegação livre, resolva primeiro o que entende e reserve tempo para revisão. Em sequência fixa, não gaste metade do período em uma única questão. Só chute quando a regra não penalizar e quando não houver alternativa melhor.</p>
<p>Em teste de planilha ou escrita, salve conforme o sistema permite e revise formato. Em teste comportamental, responda com consistência e sem tentar adivinhar “perfil perfeito”. A etapa seguinte pode explorar as mesmas situações.</p>
<h2>Registre falha de forma adequada</h2>
<p>Se o sistema travar, anote horário, etapa e mensagem. Capture apenas erro técnico quando as regras permitirem; não copie questão confidencial. Contate o suporte com descrição objetiva e peça orientação sobre reabertura. Não crie várias contas ou repita por conta própria.</p>
<p>Quando o teste coleta imagem, voz ou outros dados, leia o aviso apresentado. A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">LGPD</a> prevê princípios como finalidade, adequação e necessidade. Você pode buscar esclarecimento sobre controlador, finalidade e canal de atendimento, sem concluir automaticamente que toda coleta é irregular.</p>
<p>Se o ambiente não permite cumprir uma exigência técnica, informe antes do prazo. Exemplo: câmera indisponível, incompatibilidade do leitor de tela ou internet interrompida no bairro. Peça instrução, não garantia de nova tentativa. Guarde protocolo e siga a resposta do responsável; não tente contornar o sistema com conta de outra pessoa.</p>
<h2>Depois do envio</h2>
<p>Guarde confirmação, data e contato de suporte. Não publique perguntas ou respostas. Registre quais competências apareceram e prepare exemplos verdadeiros para a entrevista. Se não avançar, o resultado não revela sozinho o motivo; evite inventar explicações sobre algoritmo ou nota de corte.</p>
<p>A preparação correta reduz falhas evitáveis, mas não garante aprovação. Segurança, honestidade e respeito às regras preservam a candidatura e os seus dados.</p>
    `.trim()
  },

  "como-usar-empregos-sao-luis": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> O Empregos São Luís é um ponto de pesquisa e orientação, não a empresa contratante. Usar o portal com segurança significa localizar uma oportunidade, conferir os requisitos e seguir apenas o canal de candidatura indicado. Nenhum anúncio, filtro ou cadastro garante entrevista.</p>
<h2>Comece pelo cargo e pela rotina possível</h2>
<p>Pesquise o nome da função e variações próximas, como “auxiliar administrativo” e “assistente administrativo”. Antes de abrir o anúncio, defina os bairros ou municípios que consegue alcançar, os turnos disponíveis e o tipo de atividade que sabe explicar. O filtro reduz ruído; ele não confirma que você atende a todos os requisitos.</p>
<p>Leia a página inteira. Separe requisitos obrigatórios, itens desejáveis, horário, local informado, atividades e forma de candidatura. Se o anúncio não traz dado essencial, não complete com suposição. Guarde a URL e a data da consulta porque uma vaga pode ser alterada ou encerrada.</p>
<h2>Confira o canal antes de enviar dados</h2>
<p>O botão pode encaminhar para site, formulário, e-mail ou WhatsApp informado pelo anunciante. Compare empresa, cargo e endereço do destino com o texto que você acabou de ler. Se houver divergência, pare e procure o canal institucional da organização. Não pague taxa para liberar entrevista, prioridade ou material.</p>
<p>A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> oferece orientações sobre phishing, senhas, autenticação e privacidade. Nunca forneça senha, código recebido por SMS ou controle remoto do aparelho. Documento pessoal só deve ser enviado quando houver motivo claro e destinatário confirmado.</p>
<h2>Use também o serviço público de emprego</h2>
<p>Não dependa de uma única fonte. O serviço federal <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> explica que o trabalhador pode consultar vagas pelo Portal Emprega Brasil, pelo aplicativo da Carteira de Trabalho Digital ou em postos da rede. Consulte diretamente o serviço oficial e mantenha os dados atualizados.</p>
<p>No portal Empregos São Luís, volte à busca depois de concluir uma candidatura, em vez de enviar o mesmo currículo para tudo. Uma vaga de atendimento e outra de estoque podem exigir versões diferentes do resumo e da ordem das experiências, sem mudar fatos.</p>
<h2>Registre o que realmente aconteceu</h2>
<p>Use o <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> ou uma planilha própria com cargo, empresa, URL, data, canal, versão do currículo e próximo passo. Não registre CPF, RG, senha ou dados bancários. Marque “enviado” somente depois de receber confirmação do formulário, e-mail ou aplicativo.</p>
<p>Exemplo hipotético: uma candidata encontra vaga de recepção com turno incompatível. Ela não envia “para ver no que dá”; registra o motivo e procura outra escala. Em outra vaga compatível, adapta o resumo, confirma o domínio do formulário e salva a confirmação. O método reduz repetição e evita follow-up para processo errado.</p>
<p>Se o portal não mostra oportunidade compatível, o resultado correto naquele momento é zero candidatura. Não use filtro amplo para transformar qualquer anúncio em opção. Revise palavras-chave, consulte novamente em outro dia e mantenha outras fontes oficiais. Uma busca sem resultado não autoriza copiar contato de postagem encerrada nem enviar currículo a número que não foi publicado para recrutamento.</p>
<h2>Quando desconfiar</h2>
<ul><li>cobrança para participar ou receber treinamento obrigatório antes da contratação;</li><li>pedido de senha, código de autenticação ou acesso ao celular;</li><li>empresa e cargo diferentes no link de destino;</li><li>pressão para enviar documento sensível antes de explicar a etapa;</li><li>promessa de contratação sem entrevista, análise ou identificação verificável.</li></ul>
<p>Se encontrar risco, não prossiga. Consulte a página de <a href="/seguranca-candidatos">segurança do candidato</a> e confirme a empresa por endereço digitado por você. O portal ajuda a organizar a busca; a decisão segura continua dependendo da leitura do anúncio e da verificação do canal.</p>
    `.trim()
  },

  "vagas-vendedor-loja-comissao-dicas": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Uma vaga de vendas pode combinar salário fixo, comissão, prêmio e benefícios. Esses itens não significam a mesma coisa. Antes de comparar propostas, peça a regra escrita e faça uma simulação com valores hipotéticos; não trate o melhor mês de alguém como renda garantida.</p>
<h2>Separe as partes da remuneração</h2>
<p>Anote salário-base, percentual ou faixa de comissão, produto sobre o qual o cálculo incide, momento de apuração, data de pagamento e possíveis ajustes por cancelamento ou devolução. Pergunte se a comissão é individual, por equipe, por loja ou por meta. “Até determinado valor” não informa a média nem o mínimo.</p>
<p>O texto oficial da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">Consolidação das Leis do Trabalho</a>, no artigo 457, inclui as comissões pagas pelo empregador na remuneração do empregado. Isso não permite calcular uma proposta sem conhecer contrato, política comercial e instrumento coletivo. Em dúvida sobre reflexos ou descontos, busque orientação profissional ou sindical.</p>
<h2>Monte três cenários sem inventar histórico</h2>
<p>Peça um exemplo de cálculo com regra e período identificados. Depois, simule um mês abaixo da meta, um mês na meta e um acima. Use números fictícios ou dados que a empresa forneceu formalmente. Inclua transporte, alimentação, jornada, domingos e feriados ao comparar duas vagas.</p>
<p>Exemplo hipotético: a comissão incide apenas sobre vendas faturadas e pode ser ajustada quando há cancelamento. A candidata registra as perguntas, mas não afirma quanto receberá até saber a base, o percentual e o fechamento. Se a empresa não explica a política antes da contratação, ela trata a incerteza como risco, não como promessa.</p>
<h2>Perguntas objetivas para a entrevista</h2>
<ul><li>Qual é o salário-base e qual parte depende de resultado?</li><li>Como a comissão é calculada e quando é paga?</li><li>A meta é individual, coletiva ou acumulada?</li><li>Como trocas, devoluções e cancelamentos entram no cálculo?</li><li>Há treinamento, período de adaptação e acompanhamento?</li><li>Qual é a escala real, inclusive fins de semana e feriados?</li></ul>
<p>Evite perguntar pelo “máximo que alguém já ganhou” como única referência. Prefira regra, faixa, período e quantidade de pessoas que alcançam a meta, caso a empresa possa informar. Não publique planilha interna, ranking ou dados de colegas.</p>
<h2>Prepare exemplos de venda responsável</h2>
<p>Na entrevista, descreva uma situação real: como identificou a necessidade, apresentou opção, respondeu dúvida e registrou o atendimento. Não invente percentual de conversão ou carteira de clientes. Se a experiência foi informal, diga onde ocorreu e quais tarefas você realizou.</p>
<p>Uma boa resposta não precisa defender pressão agressiva. Pode mostrar escuta, conhecimento do produto, conferência de preço e encaminhamento de reclamação. Para cargo sem experiência, crie uma simulação transparente: atendimento fictício, comparação de duas opções e fechamento sem prometer o que o produto não entrega.</p>
<h2>Antes de aceitar</h2>
<p>Leia a proposta e confirme se remuneração, função, jornada e local correspondem ao que foi conversado. Depois da admissão, consulte os dados do vínculo na <a href="https://www.gov.br/pt-br/apps/ctps-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. Guarde documentos próprios e demonstrativos de pagamento; não leve cadastro de clientes para uso pessoal.</p>
<p>Meta e comissão podem fazer parte do trabalho comercial, mas precisam ser compreendidas como regra, não como slogan. A comparação honesta considera o cenário conservador e os custos da rotina, não apenas o anúncio do melhor resultado possível.</p>
<p>Quando receber o primeiro pagamento, compare o demonstrativo com a regra informada: período, vendas consideradas, ajustes e valor lançado. Faça a pergunta pelo canal interno antes de concluir que houve erro. Se a explicação não resolver, guarde seus registros e busque orientação adequada. Não exponha contracheque, CPF ou dados de venda em grupo público para pedir opinião.</p>
    `.trim()
  },

  "saude-mental-trabalho-limites": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este conteúdo é educativo e não substitui avaliação de profissional de saúde. Cansaço depois de um dia difícil não permite diagnóstico. O que merece atenção é a persistência, a intensidade e o impacto no sono, na alimentação, na segurança, nas relações e na capacidade de trabalhar.</p>
<h2>Observe padrões sem se diagnosticar</h2>
<p>Durante duas semanas, registre horário, situação, reação física ou emocional e quanto tempo levou para se recuperar. Use linguagem concreta: “acordei três vezes”, “chorei antes do turno”, “não consegui concluir a tarefa”. Evite rótulos clínicos retirados de vídeo ou postagem.</p>
<p>A <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental" target="_blank" rel="noopener noreferrer">página de Saúde Mental do Ministério da Saúde</a> apresenta a rede de cuidado do SUS e orientações de acesso. Procure uma Unidade Básica de Saúde, CAPS ou outro serviço indicado na sua região quando os sintomas persistirem ou prejudicarem a rotina.</p>
<h2>Burnout não é sinônimo de qualquer estresse</h2>
<p>A <a href="https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" target="_blank" rel="noopener noreferrer">Organização Mundial da Saúde</a> classifica o burnout como fenômeno ocupacional, não como condição médica, ligado a estresse crônico no trabalho que não foi administrado com sucesso. A descrição inclui exaustão, distanciamento mental ou cinismo em relação ao trabalho e redução da eficácia profissional.</p>
<p>Essa referência não serve para autodiagnóstico. Sintomas parecidos podem ter causas diferentes. Só um atendimento adequado pode avaliar contexto, duração, outras condições e necessidade de afastamento ou tratamento.</p>
<h2>Defina um limite que possa ser explicado</h2>
<p>Escolha um problema observável: mensagem fora do expediente, intervalo interrompido, acúmulo de tarefas sem prioridade ou humilhação em público. Formule pedido específico: “Preciso confirmar qual entrega vem primeiro” ou “Posso responder essa demanda no início do próximo turno?”. Registre combinados importantes sem gravar pessoas às escondidas ou divulgar conversa privada.</p>
<p>Nem todo limite pode ser resolvido individualmente. Quando há risco, violência, discriminação ou assédio, priorize segurança e procure canal interno confiável, representação sindical, serviço público ou orientação jurídica conforme o caso.</p>
<h2>Inclua a rotina na comparação de vagas</h2>
<p>Ao avaliar proposta em São Luís, some tempo de deslocamento, espera, escala, intervalo e custo informado por você. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> ajuda a visualizar gasto, mas não define se a vaga é saudável. Observe previsibilidade da jornada, apoio, treinamento e possibilidade real de descanso.</p>
<p>Exemplo hipotético: uma trabalhadora percebe que o celular toca durante todo intervalo. Em vez de apenas silenciar e acumular conflito, ela registra a frequência, pergunta qual é a regra e propõe um responsável de plantão. Se houver retaliação ou risco, busca orientação antes de agir sozinha.</p>
<h2>Quando buscar ajuda imediata</h2>
<p>Se houver risco de ferir a si ou outra pessoa, desorientação, violência ou emergência, procure atendimento urgente da sua localidade ou acione o SAMU pelo 192. Não espere a próxima avaliação de desempenho. Peça apoio a alguém de confiança para chegar ao serviço.</p>
<p>Cuidar da saúde não é falha profissional. O objetivo deste guia é transformar mal-estar difuso em observações que possam ser levadas a um serviço de saúde ou conversa segura, sem minimizar sintomas nem prometer solução rápida.</p>
<p>Para uma consulta, leve a linha do tempo dos sintomas, medicamentos em uso, mudanças recentes e o que piora ou alivia. Não interrompa tratamento por conselho de colega ou conteúdo on-line. Se receber documento ou orientação profissional, confirme como entregar à empresa sem publicar diagnóstico para pessoas que não precisam dessa informação.</p>
<p>Também registre fatores fora do trabalho, como luto, cuidado familiar ou mudança de medicação, porque eles ajudam o profissional a avaliar o conjunto. A anotação organiza a conversa; não substitui exame, diagnóstico ou conduta clínica.</p>

<h2>Separe cuidado individual de risco na organização</h2>
<p>Dormir melhor, fazer pausa e procurar atendimento podem ajudar a pessoa, mas não corrigem sozinhos sobrecarga permanente, assédio, baixa autonomia ou jornada mal organizada. A <a href="https://www.ilo.org/pt-pt/resource/noticias/mais-de-840-mil-mortes-por-ano-ligadas-riscos-psicossociais-no-trabalho-diz" target="_blank" rel="noopener noreferrer">OIT descreve riscos psicossociais</a> como fatores ligados à forma como o trabalho é definido, organizado e gerido. Use essa referência para reconhecer que prevenção também exige medidas organizacionais, não para atribuir diagnóstico ou causa médica sem avaliação.</p>
<p>Quando for seguro, registre demanda, recursos disponíveis, interrupções, apoio solicitado e resposta recebida. Leve ao canal adequado uma questão observável: volume sem prioridade, ameaça, violência, ausência de pausa ou tarefa incompatível com treinamento. Não publique nome de colega, prontuário ou conversa privada para pressionar resposta.</p>
<h2>Crie um plano de escalonamento antes da crise</h2>
<ol><li>Escolha uma pessoa de confiança e um serviço de saúde que você consiga localizar.</li><li>Liste sinais pessoais que indicam piora e situações que exigem interromper a atividade.</li><li>Registre os canais internos, sindicais ou públicos adequados ao problema.</li><li>Defina como chegar a atendimento urgente e quem pode acompanhar você.</li></ol>
<p>Se houver risco imediato, use serviço de emergência; se os sintomas persistirem, procure avaliação profissional. O plano serve para reduzir improviso. Ele não obriga revelar diagnóstico à equipe nem substitui orientação clínica, documento profissional ou procedimento formal da empresa.</p>
    `.trim()
  },

  "esgotamento-busca-emprego-sinais": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Procurar emprego exige atenção, repetição e tolerância à incerteza. Quando a busca invade sono, alimentação e relações, aumentar o volume pode piorar decisões. Pausa não é abandono: pode ser parte de um plano que protege saúde e qualidade das candidaturas.</p>
<h2>Troque a palavra “fraqueza” por observações</h2>
<p>Registre por sete dias o horário de início e fim da busca, quantas vagas foram lidas, quantas eram compatíveis e como você terminou o bloco. Irritação, choro, insônia, dificuldade de concentração e sensação constante de ameaça merecem atenção, especialmente quando persistem ou impedem atividades básicas.</p>
<p>Este guia não diagnostica burnout, ansiedade ou depressão. A <a href="https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" target="_blank" rel="noopener noreferrer">OMS</a> descreve burnout no contexto ocupacional; estar desempregado e esgotado exige olhar mais amplo, não adaptação automática desse rótulo.</p>
<h2>Faça uma pausa com começo, fim e apoio</h2>
<p>Se o material está saindo com erro e toda mensagem parece urgente, interrompa por algumas horas ou um dia. Defina quando voltará e o que ficará de fora. Pausa não precisa virar culpa nem desaparecer por prazo indefinido. Se há conta urgente, combine com alguém de confiança qual tarefa administrativa realmente precisa ser feita.</p>
<p>Ao retornar, escolha no máximo três anúncios compatíveis. Leia, adapte e registre. Não tente compensar o descanso enviando dezenas de currículos genéricos. Use o <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> para separar envio concluído, retorno, entrevista e encerramento sem armazenar documento sensível.</p>
<h2>Reduza decisões repetidas</h2>
<ul><li>Defina dois cargos-alvo por ciclo.</li><li>Guarde currículo-base e versões enviadas.</li><li>Separe um horário curto para pesquisar e outro para responder.</li><li>Desative notificações de grupos que só repetem anúncio.</li><li>Tenha um dia sem candidatura.</li></ul>
<p>Consulte também fontes oficiais em vez de depender de corrente. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> mostra os canais públicos disponíveis. Confirmar a fonte reduz o esforço desperdiçado com vaga encerrada ou mensagem falsa.</p>
<h2>Leia o funil sem transformar silêncio em julgamento</h2>
<p>Ausência de resposta não prova incapacidade. Registre o que pode ser verificado: candidatura concluída, confirmação, contato e entrevista. Se não há retorno após um conjunto de vagas realmente compatíveis, revise cargo, clareza do currículo e canal. Não aumente o volume antes de saber se o problema é filtro, material ou oportunidade.</p>
<p>Exemplo hipotético: um candidato percebe que envia currículos depois da meia-noite, erra anexos e passa o dia seguinte exausto. Ele limita a busca a três blocos semanais, revisa o PDF pela manhã e pede a uma pessoa que confira apenas ortografia. O objetivo não é produzir número bonito, mas reduzir erro evitável.</p>
<h2>Procure cuidado quando a pausa não basta</h2>
<p>A <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental" target="_blank" rel="noopener noreferrer">rede de saúde mental apresentada pelo Ministério da Saúde</a> inclui atenção básica e serviços especializados. Busque atendimento quando os sintomas são intensos, persistentes ou afetam segurança e funcionamento. Em emergência, acione o serviço urgente da sua localidade ou o SAMU 192.</p>
<p>Uma rotina sustentável não garante contratação, mas preserva capacidade de ler, decidir e conversar. A meta útil é candidatura compatível e verificável, não atividade contínua até o esgotamento.</p>
<p>Se a pressão financeira impede uma pausa completa, reduza o escopo: uma fonte confiável, um cargo e um bloco curto. Peça ajuda para tarefa definida, como revisar um PDF, não para outra pessoa se passar por você. Mantenha alimentação, sono e obrigações essenciais no plano; eles não são prêmio a ser recebido somente depois da contratação.</p>
<p>Combine com quem mora com você um horário sem interrupção e outro em que a busca termina. Limite mensagens de grupos e silencie notificações fora do bloco. Essa organização não elimina preocupação financeira, mas cria uma fronteira que pode ser revista com apoio.</p>
    `.trim()
  },

  "conflito-com-chefe-trabalho-dicas": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Discordar de prioridade, prazo ou método não é automaticamente assédio. O primeiro passo é identificar o fato: o que foi pedido, quando, qual orientação anterior existia e qual impacto ocorreu. Situação de violência, ameaça ou discriminação exige cuidado e apoio, não confronto improvisado.</p>
<h2>Prepare a conversa com fatos</h2>
<p>Escreva uma linha para cada evento: data, tarefa, instrução, resposta e consequência. Separe interpretação de observação. “Ele quer me prejudicar” é interpretação; “o prazo mudou às 16h e não houve redefinição das outras entregas” é um fato que permite conversa.</p>
<p>Peça encontro privado e leve uma pergunta concreta: “Qual das duas demandas tem prioridade?” ou “Podemos registrar o procedimento atualizado?”. Evite áudio longo, indireta em grupo e exposição de colega. Seu objetivo é esclarecer trabalho e próximo passo.</p>
<h2>Diferencie conflito de violência ou assédio</h2>
<p>O <a href="https://mpt.mp.br/pgt/publicacoes?td=cartilhas" target="_blank" rel="noopener noreferrer">Ministério Público do Trabalho</a> disponibiliza cartilhas, incluindo material de perguntas e respostas sobre violência e assédio moral no trabalho. Consulte conceitos e canais antes de classificar o caso. Cobrança firme ou avaliação negativa pode ser desagradável sem, por si só, constituir assédio; humilhação repetida, ameaça ou discriminação exigem análise cuidadosa.</p>
<p>Se houver risco imediato, não fique sozinho para “produzir prova”. Priorize sair do local seguro, procurar apoio e contatar serviço competente. Não publique nomes, prints ou acusações em rede social enquanto busca orientação.</p>
<h2>Use o canal adequado</h2>
<p>Quando a conversa direta é segura e possível, registre o combinado por e-mail ou sistema. Se não resolve, procure RH, ouvidoria, canal de ética, representação sindical ou responsável acima na estrutura. Leve cronologia curta e documentos que você pode usar legitimamente; não copie banco de clientes, prontuários ou dados pessoais.</p>
<p>O <a href="https://mpt.mp.br/pgt/servicos/servico-denuncie" target="_blank" rel="noopener noreferrer">serviço de denúncia do MPT</a> explica o escopo de atuação em violações trabalhistas de relevância coletiva. Uma denúncia exige informações verdadeiras e documentos pertinentes. Caso individual pode também demandar orientação sindical, advocacia ou Justiça do Trabalho.</p>
<h2>Proteja a execução do trabalho</h2>
<p>Enquanto o conflito é tratado, confirme prioridades, prazos e responsáveis. Peça ajuda quando duas ordens forem incompatíveis. Não reduza qualidade de propósito nem use informação da empresa como moeda de pressão. Se precisar procurar outro emprego, faça isso fora dos recursos corporativos e sem levar material confidencial.</p>
<p>Exemplo hipotético: uma funcionária recebe duas tarefas urgentes de líderes diferentes. Ela envia mensagem objetiva com prazos e pede definição. A resposta é registrada. Se um gestor a humilha publicamente de forma repetida, ela anota datas, testemunhas e procura o canal interno e orientação externa, sem divulgar clientes envolvidos.</p>
<h2>Revise o resultado</h2>
<ul><li>Houve definição de prioridade ou comportamento esperado?</li><li>O combinado foi registrado?</li><li>A situação se repetiu ou piorou?</li><li>Existe risco à saúde ou segurança?</li><li>Qual canal pode analisar o caso com imparcialidade?</li></ul>
<p>Objetividade não significa aceitar abuso. Ela ajuda a apresentar o problema de forma compreensível e escolher entre ajuste, mediação, denúncia ou saída planejada. Se o impacto emocional persistir, procure também cuidado em saúde.</p>
<p>Evite três atalhos: gravar ou acessar conta alheia sem entender os limites legais, ameaçar divulgar conteúdo confidencial e pedir que colegas escolham “um lado” em grupo. Essas ações podem ampliar o dano e desviar a análise do fato original. Busque orientação antes de coletar ou compartilhar evidências sensíveis.</p>
<p>Se a saída se tornar necessária, confira aviso, documentos e canais antes de tomar decisão impulsiva. Não assine texto que não compreende sob pressão. Peça tempo para ler e orientação qualificada quando houver dúvida sobre consequência trabalhista.</p>
    
<h2>Escolha uma frase que peça decisão</h2>
<p>Quando duas orientações entram em conflito, use estrutura curta: fato, impacto e pergunta. Exemplo: “A tarefa A foi marcada para hoje e a B chegou com o mesmo prazo. Consigo concluir uma delas com qualidade. Qual deve vir primeiro?” Evite transformar o pedido em julgamento sobre intenção ou competência da liderança.</p>
<h2>Monte uma cronologia que preserve origem</h2>
<p>Guarde mensagens e documentos próprios no sistema autorizado, com data e contexto. Não recorte trechos de modo que altere sentido e não encaminhe arquivo confidencial para e-mail pessoal sem permissão. Em anotação particular, diferencie o que você viu, o que ouviu de terceiros e o que concluiu. Testemunho de colega não deve ser escrito como fato confirmado sem consentimento.</p>
<h2>Use uma escala de resposta</h2>
<ul><li><strong>Divergência operacional:</strong> alinhar prioridade e procedimento.</li><li><strong>Repetição sem solução:</strong> registrar e procurar liderança ou RH.</li><li><strong>Humilhação, ameaça ou discriminação:</strong> preservar segurança e buscar canal interno ou orientação externa.</li><li><strong>Risco imediato:</strong> afastar-se da situação e acionar apoio competente.</li></ul>
<p>A escala organiza o próximo passo, mas não determina juridicamente o caso. Se o conflito afeta sono, alimentação, ansiedade ou segurança, procure cuidado em saúde e orientação apropriada. Não espere a situação se agravar para registrar o impacto.</p>
`.trim()
  },

  "avaliacao-de-desempenho-preparacao": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Uma avaliação de desempenho útil compara expectativa, evidência e próximo passo. Não é concurso de adjetivos nem momento para inventar números. Mesmo quando a empresa não tem formulário formal, você pode preparar exemplos e pedir critérios claros.</p>
<h2>Descubra o que será avaliado</h2>
<p>Antes da conversa, peça critérios, período e participantes. Separe metas, entregas, comportamento, aprendizagem e condições que afetaram o trabalho. Se não há documento, leve uma lista curta das responsabilidades combinadas e pergunte se ela corresponde à expectativa da liderança.</p>
<p>A <a href="https://repositorio.enap.gov.br/items/d1dc6e7e-98b1-4941-9c8c-985215c3944e" target="_blank" rel="noopener noreferrer">Enap</a> mantém material sobre gestão do desempenho e modelos de feedback. É uma referência de aprendizagem, não regra para empresas privadas. O procedimento válido é o definido pela organização, respeitando contrato, políticas e direitos.</p>
<h2>Monte uma página de evidências</h2>
<p>Para cada responsabilidade, escreva contexto, ação e resultado observável. Resultado não precisa ser percentual: pode ser prazo cumprido, fila organizada, divergência identificada, cliente encaminhado ou procedimento documentado. Se não houve medição, não invente número.</p>
<p>Inclua também um erro ou dificuldade e o que mudou depois. “Perdi um prazo porque não confirmei a prioridade; passei a registrar as entregas e pedir definição quando há conflito” demonstra aprendizagem melhor que “sou perfeccionista”. Não atribua a si trabalho feito pela equipe inteira.</p>
<h2>Prepare perguntas para pontos subjetivos</h2>
<p>Se ouvir “falta postura” ou “precisa ser mais estratégico”, peça comportamento observável: “Em qual situação isso ocorreu?” e “O que eu deveria fazer diferente?”. Repita o entendimento e combine como será acompanhado. Discordar pode ser feito sem interromper: apresente fato, documento e contexto.</p>
<p>Exemplo hipotético: uma recepcionista recebe nota baixa em organização. Ela mostra o controle usado, pergunta qual erro foi observado e combina conferir a agenda em dois horários. Se a avaliação ignora falta de acesso ao sistema, registra essa dependência sem transformar a conversa em acusação.</p>
<h2>Converta feedback em plano curto</h2>
<ul><li>uma habilidade ou processo prioritário;</li><li>uma ação que cabe na rotina;</li><li>um apoio necessário, como treinamento ou acesso;</li><li>uma evidência de progresso;</li><li>uma data de revisão.</li></ul>
<p>Evite plano com dez metas vagas. “Até o fim do mês, registrar cada devolução no sistema e revisar o relatório semanalmente” é verificável. “Ser mais proativo” não informa ação nem medida.</p>
<h2>Registre sem expor pessoas</h2>
<p>Depois da conversa, envie resumo dos combinados pelo canal usado pela empresa. Guarde documentos aos quais você tem direito, mas não copie avaliação de colegas nem dados confidenciais. Se houver erro factual, peça correção por escrito e anexe evidência pertinente.</p>
<p>A avaliação pode influenciar desenvolvimento, movimentação ou decisões internas, mas este guia não promete promoção nem define validade jurídica. Se houver discriminação, retaliação ou violação de direito, procure o canal interno, sindicato ou orientação jurídica adequada.</p>
<p>Chegue preparado para ouvir e perguntar. O resultado mais útil é sair sabendo o que manter, o que mudar, qual apoio existe e quando o avanço será revisto — sem teatro e sem apagar condições reais de trabalho.</p>
<p>Mantenha um registro semanal simples até a próxima conversa: tarefa, evidência, dificuldade e apoio solicitado. Isso evita reconstruir meses de memória na véspera e permite corrigir o plano cedo. O registro não deve incluir dados pessoais de cliente, avaliação de colega ou documento que você não esteja autorizado a guardar.</p>
<p>Se não houver nova data, proponha uma revisão breve e realista. Confirme quem acompanhará e qual evidência será observada. Sem acompanhamento, o plano vira lista esquecida e a próxima avaliação repete a mesma surpresa.</p>
    
<h2>Faça uma tabela de expectativa, fato e dependência</h2>
<p>Use uma linha por responsabilidade. Na primeira coluna, copie a expectativa confirmada; na segunda, registre entrega ou comportamento observável; na terceira, anote dependências como acesso, equipe, estoque ou aprovação. A dependência não apaga sua responsabilidade, mas evita avaliar como falha individual aquilo que o processo não permitiu executar.</p>
<p>O estudo da Enap sobre <a href="https://repositorio.enap.gov.br/bitstream/1/7439/1/v.%2073%20n.%20a%20%282022%29%20Inova%C3%A7%C3%A3o%20e%20Moderniza%C3%A7%C3%A3o%20Administrativa%20para%20os%20Estados.pdf" target="_blank" rel="noopener noreferrer">gestão do desempenho no setor público</a> relaciona resultado esperado, feedback e plano de desenvolvimento. É referência de aprendizagem, não modelo obrigatório para empresa privada. Use a lógica de clareza e acompanhamento sem importar regras administrativas que não se aplicam ao vínculo.</p>
<h2>Teste se o feedback pode virar ação</h2>
<p>Depois de ouvir cada ponto, complete a frase: “Na próxima situação X, farei Y e registrarei Z”. Se não consegue preencher, peça exemplo e critério. Para “melhorar comunicação”, uma ação verificável pode ser confirmar prioridade e prazo ao receber duas demandas; a evidência pode ser o resumo enviado pelo canal corporativo.</p>
<h2>Feche a conversa com um registro equilibrado</h2>
<p>Envie um resumo com entregas mantidas, ponto de melhoria, apoio combinado, responsável e data de revisão. Dê espaço para correção do gestor. Não escreva concordância com fatos que contesta; registre a divergência de modo objetivo e anexe apenas documento autorizado. Se o formulário exigir ciência, confirme se ciência significa recebimento ou concordância antes de interpretar o campo.</p>
`.trim()
  },

  "primeira-semana-emprego-novo": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Na primeira semana, a prioridade é entender segurança, horário, responsabilidades e canais. Você não precisa decorar tudo nem propor mudança no segundo dia. Anote processos, confirme dúvidas e preserve dados da empresa e de clientes.</p>
<h2>Confirme o básico antes da primeira tarefa</h2>
<p>Pergunte horário de entrada, intervalo, registro de ponto, uniforme ou equipamento, local de trabalho e quem deve ser avisado em atraso ou emergência. Saiba onde ficam saídas, itens de segurança e contatos essenciais. Não opere máquina, veículo ou sistema crítico sem orientação e autorização.</p>
<p>Consulte os dados do vínculo na <a href="https://www.gov.br/pt-br/apps/ctps-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. O Ministério do Trabalho também mantém <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho/perguntas-frequentes-carteira-de-trabalho-digital/" target="_blank" rel="noopener noreferrer">perguntas frequentes</a> sobre visualização do contrato. Se informação relevante divergir do combinado, peça esclarecimento ao empregador; não altere registro por conta própria.</p>
<h2>Faça um mapa de pessoas e processos</h2>
<p>Anote quem orienta a atividade, quem aprova exceções e onde registrar problema. Use nomes profissionais e funções; não guarde senha de colega. Para cada tarefa, escreva entrada, passos, conferência e destino. Depois, repita com supervisão até saber onde pode decidir e onde precisa pedir autorização.</p>
<p>Exemplo hipotético: em uma loja, duas pessoas explicam devolução de formas diferentes. O novo funcionário não escolhe a versão mais fácil. Ele registra a diferença e pergunta ao responsável qual procedimento está vigente antes de atender o próximo caso.</p>
<h2>Proteja senhas e informações</h2>
<p>Use credencial própria e troque senha inicial quando orientado. Não fotografe tela, cadastro, prontuário, pedido ou planilha para estudar em casa. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne boas práticas de senhas, autenticação, privacidade e dispositivos.</p>
<p>Seu caderno pode conter etapas e termos, mas não CPF, telefone de cliente, cartão, segredo comercial ou senha. Ao sair da mesa, bloqueie o equipamento conforme a regra local.</p>
<h2>Faça perguntas que economizam erro</h2>
<ul><li>Qual tarefa vem primeiro quando duas chegam juntas?</li><li>Onde encontro o procedimento atualizado?</li><li>Quem autoriza desconto, troca, ausência ou exceção?</li><li>Como registro um erro ou incidente?</li><li>Quando meu treinamento será revisto?</li></ul>
<p>Leve o que já tentou antes de pedir ajuda: “Segui as etapas A e B, mas o sistema mostrou esta mensagem”. Perguntar cedo não é incapacidade; repetir erro sem registrar orientação é que prolonga o problema.</p>
<h2>Revise a semana sem se comparar</h2>
<p>No fim de cada dia, registre três pontos: o que aprendeu, o que precisa confirmar e qual tarefa fará novamente. No fim da semana, peça dez minutos de alinhamento. Confirme prioridades e corrija anotações. Não use velocidade de colega antigo como medida do seu primeiro dia.</p>
<p>Guarde contracheques e comunicados próprios quando forem emitidos. Não leve arquivo interno ao sair da empresa. Se houver risco, humilhação, discriminação ou divergência séria, documente fatos e procure canal confiável.</p>
<p>A primeira semana não define toda a carreira. Ela serve para construir um mapa seguro do trabalho: quem orienta, como executar, onde conferir e quando pedir ajuda.</p>
<p>Quando pedirem dados bancários ou documentos admissionais, confirme o canal e a pessoa responsável. Não envie por número pessoal desconhecido apenas porque alguém conhece o seu nome. Guarde protocolo ou confirmação, mas não mantenha cópias desnecessárias em aparelho compartilhado. Dúvida sobre documento deve ser resolvida com RH ou responsável identificado.</p>
<p>Reserve ainda alguns minutos para conferir o trajeto de volta, especialmente em treinamento que termina fora do horário habitual. Informe alguém de confiança quando a rota mudar. Segurança no deslocamento faz parte da adaptação e deve ser considerada antes de aceitar troca de turno.</p>
    
<h2>Use as primeiras 72 horas para mapear riscos</h2>
<p>No primeiro dia, confirme emergência, ponto, responsável e limites da função. No segundo, repita tarefas com supervisão e anote divergências de orientação. No terceiro, revise o mapa com quem treina você. Não use esse prazo como meta de produtividade universal; funções e treinamentos têm ritmos diferentes.</p>
<h2>Classifique tarefas por autonomia</h2>
<p>Marque cada atividade como “observar”, “executar acompanhado”, “executar e conferir” ou “executar sozinho”. Equipamento, direção, movimentação de carga, atendimento sensível e operação financeira não devem avançar apenas porque você viu outra pessoa fazendo. Pergunte qual autorização ou treinamento libera cada etapa.</p>
<h2>Registre erro e incidente sem esconder</h2>
<p>Ao perceber erro, interrompa a propagação, preserve o registro e avise o responsável. Informe o que aconteceu, quais itens podem ter sido afetados e o que já foi feito; não altere sistema para apagar rastros. Se houver risco à saúde ou segurança, siga o procedimento de emergência antes de discutir culpa.</p>
<h2>Feche a semana com cinco confirmações</h2>
<ul><li>jornada e ponto correspondem ao combinado;</li><li>tarefas e responsáveis estão claros;</li><li>acessos são individuais e funcionam;</li><li>treinamentos pendentes têm responsável;</li><li>dúvidas possuem canal e prazo de resposta.</li></ul>
<p>Envie resumo curto ao responsável e corrija sua anotação com a resposta. Não peça acesso a documento de colega para comparar. Se a Carteira de Trabalho Digital ainda não exibe informação esperada, registre a dúvida com RH e consulte o canal oficial, sem concluir irregularidade apenas por atraso de visualização.</p>
`.trim()
  },

  "plano-90-dias-emprego-sao-luis": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Noventa dias são uma janela de organização, não prazo para conseguir emprego. O plano divide pesquisa, material, candidaturas e revisão em ciclos curtos. Ele deve caber na sua renda, saúde, cuidado familiar e deslocamento.</p>
<h2>Semana zero: defina limites e duas funções</h2>
<p>Escolha até dois cargos relacionados a tarefas que consegue demonstrar. Registre turnos possíveis, distância máxima, renda mínima e impedimentos documentais. Leia anúncios atuais antes de editar o currículo; não use lista antiga para concluir que existe contratação hoje.</p>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> informa os canais públicos de consulta. O <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/sistema-nacional-de-emprego-sine/portal-emprega-brasil" target="_blank" rel="noopener noreferrer">Portal Emprega Brasil</a> permite registrar perfil e procurar vagas compatíveis no município. Use também páginas institucionais de empresas e anúncios com origem confirmável.</p>
<h2>Dias 1 a 30: arrume a base</h2>
<p>Crie currículo-base e uma versão para cada cargo-alvo. Organize documentos sem enviar todos de uma vez. Prepare três exemplos de experiência: tarefa, ação e resultado observável. Se nunca trabalhou na área, use projeto escolar, voluntariado ou exercício, identificado corretamente.</p>
<p>Faça de três a cinco candidaturas compatíveis por semana, ou quantidade menor que consiga revisar. Registre cada envio no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>: empresa, cargo, URL, data, canal e versão do currículo. O número é exemplo de ritmo, não meta universal nem promessa de retorno.</p>
<h2>Dias 31 a 60: leia o funil</h2>
<p>Separe anúncios lidos, candidaturas concluídas, contatos e entrevistas. Se muitos anúncios são incompatíveis, reveja função ou filtros. Se há candidatura sem confirmação, confira o canal. Se há entrevista e nenhuma proposta, treine respostas e revise condições que impedem o aceite.</p>
<p>Não conclua que o currículo falhou por uma semana silenciosa. Compare um conjunto de oportunidades realmente aderentes. Arquive vagas encerradas e nunca invente empresa, salário ou requisito para preencher a planilha.</p>
<h2>Dias 61 a 90: ajuste uma coisa por vez</h2>
<p>Escolha o principal gargalo: poucas vagas compatíveis, currículo pouco claro, falta de habilidade verificável, entrevista ou logística. Faça uma intervenção e acompanhe. Curso só entra quando o conteúdo corresponde a uma lacuna observada; nenhuma formação legítima garante contratação.</p>
<p>Em São Luís, use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com tarifas e viagens informadas por você. Compare custo e tempo com a escala da vaga. Não presuma benefício, último ônibus ou local exato quando o anúncio não informa.</p>
<h2>Agenda semanal sustentável</h2>
<ul><li>um bloco para pesquisar e arquivar anúncios;</li><li>dois blocos para adaptar e enviar;</li><li>um bloco para follow-up e treino;</li><li>um período sem busca;</li><li>quinze minutos para revisar métricas e segurança.</li></ul>
<p>Exemplo hipotético: uma candidata alterna auxiliar administrativo e recepção. Após 30 dias, percebe que a maioria das vagas de recepção exige turno incompatível. Em vez de aumentar o volume, concentra-se no cargo e nos bairros possíveis, mantendo a outra função apenas quando a escala é clara.</p>
<h2>Fechamento do ciclo</h2>
<p>No dia 90, escreva uma página: fontes usadas, vagas compatíveis, respostas, entrevistas, impedimentos e próximo teste. Continue, pause ou mude o plano com base nisso. Se a busca estiver prejudicando sono e funcionamento, reduza o ritmo e procure apoio de saúde quando necessário.</p>
<p>O valor dos 90 dias é permitir comparação e correção. A contratação depende de processos externos; o plano mede apenas ações e evidências sob seu controle.</p>
<p>Faça revisões nos dias 15, 30, 60 e 90. Em cada uma, altere apenas o que a evidência sustenta. Se passou a receber contatos depois de esclarecer o cargo no currículo, mantenha a mudança. Se o retorno não mudou, confira anúncios e canais antes de concluir que precisa comprar curso, foto profissional ou serviço de candidatura.</p>
    `.trim()
  },

  "agradecimento-pos-entrevista-mensagem": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial: 13 de outubro de 2026.</strong> A mensagem de agradecimento não é cobrança disfarçada nem garantia de vantagem. Ela serve para confirmar interesse, registrar um ponto relevante da conversa e manter um canal profissional aberto. Deve ser curta, verdadeira e enviada apenas a um contato que participou do processo ou foi indicado pela empresa.</p>
<h2>Escolha o canal e o momento</h2>
<p>Use o mesmo canal pelo qual a entrevista foi organizada, salvo orientação diferente. Se recebeu e-mail corporativo, prefira responder à conversa existente; se o contato ocorreu por plataforma, mantenha-se nela. Não procure telefone pessoal do entrevistador nem envie a mesma mensagem para várias pessoas.</p>
<p>Enviar no mesmo dia ou no próximo dia útil costuma ser suficiente. Se a empresa informou prazo de retorno, agradeça sem pedir resposta imediata. Para acompanhar a seleção depois, use um <a href="/blog/follow-up-apos-entrevista-mensagem">follow-up separado</a> e respeite o prazo combinado.</p>
<h2>Escreva quatro partes específicas</h2>
<ol><li>cumprimento com o nome correto;</li><li>agradecimento pela conversa e identificação da vaga;</li><li>um ponto real que aumentou seu interesse;</li><li>disponibilidade para complementar informações.</li></ol>
<p>Exemplo adaptável: “Olá, Ana. Obrigado pela conversa de hoje sobre a vaga de auxiliar administrativo. A explicação sobre a conferência diária de pedidos ajudou a entender a prioridade da função. Minha experiência organizando documentos e registrando pendências pode contribuir nesse fluxo. Fico disponível caso precisem de outra informação.”</p>
<p>Não copie o exemplo palavra por palavra. Troque o detalhe pelo que realmente foi discutido. Se você não lembra de um ponto específico, limite-se a agradecer e confirmar interesse; inventar processo, nome de sistema ou desafio prejudica a credibilidade.</p>
<h2>Quando houve algo a corrigir</h2>
<p>Uma mensagem pode corrigir informação objetiva e curta: “Na conversa, mencionei que o curso terminou em maio; conferi o certificado e a data correta é junho.” Não reescreva todas as respostas nem envie arquivos não solicitados. Para portfólio ou certificado pedido, use o formato e o canal indicados e confirme o destinatário.</p>
<p>Se concluiu que a vaga não é compatível, agradeça e retire a candidatura com clareza: “Após revisar a escala informada, não conseguirei cumprir o horário. Agradeço a conversa e peço que desconsiderem minha candidatura.” Isso evita silêncio e não exige justificativa pessoal detalhada.</p>
<h2>Proteja dados e reconheça golpes</h2>
<p>Uma resposta legítima não depende de pagamento, senha ou código recebido por SMS. O <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">CERT.br</a> mantém orientações públicas sobre phishing, autenticação e privacidade. Se a conversa mudar para número desconhecido, confirme o domínio, a vaga e o contato antes de abrir link ou enviar documento.</p>
<h2>O que evitar</h2>
<ul><li>elogios exagerados que não correspondem à conversa;</li><li>pressão por decisão ou sequência de mensagens;</li><li>informação confidencial de emprego anterior;</li><li>promessa de disponibilidade que você não pode cumprir;</li><li>anexo pesado ou documento pessoal não solicitado.</li></ul>
<h2>Assunto e versões para situações diferentes</h2>
<p>Em e-mail novo, use assunto identificável: “Agradecimento — entrevista para [cargo] — [seu nome]”. Em resposta, preserve o assunto existente para manter o histórico. Para entrevista coletiva, agradeça à equipe sem listar pessoas que você não conheceu. Para conversa muito curta de triagem, duas ou três frases bastam. Para etapa técnica, mencione uma dúvida esclarecida ou um aspecto do desafio, sem reenviar a solução inteira.</p>
<p>Se a empresa avisou que não seguirá com a candidatura, você ainda pode agradecer e pedir autorização para acompanhar futuras vagas, mas não conteste a decisão em sequência. Se houve comportamento inadequado, não é obrigatório enviar agradecimento; registre o ocorrido pelo canal apropriado.</p>
<p>Revise nome, cargo, empresa e ortografia antes de enviar. Guarde a mensagem no seu <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>, junto com a data e o prazo informado. A ausência de resposta não prova rejeição nem autoriza contato diário; o objetivo é deixar um registro respeitoso e verificável.</p>
    `.trim()
  },

  "carta-apresentacao-emprego-curta": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial: 13 de outubro de 2026.</strong> Carta de apresentação não é autobiografia nem cópia do currículo. Ela conecta uma necessidade explícita da vaga a uma evidência real da sua experiência. Só envie quando o anúncio solicitar, quando houver campo próprio ou quando a candidatura por e-mail permitir uma apresentação breve.</p>
<h2>Leia a vaga antes de escrever</h2>
<p>Marque função, tarefas, requisitos obrigatórios, local, escala e forma de candidatura. Escolha no máximo duas evidências que respondam ao trabalho. Se o anúncio pede atendimento e organização de agenda, não ocupe a carta inteira com um curso sem relação.</p>
<p>Para conferir o significado de uma ocupação sem inventar atribuições, consulte a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações do Ministério do Trabalho e Emprego</a>. A CBO ajuda a entender famílias ocupacionais, mas o anúncio e o contrato definem a vaga concreta.</p>
<h2>Use três parágrafos, cada um com função</h2>
<p><strong>Abertura:</strong> diga qual é a vaga, onde a encontrou e por que seu perfil é pertinente. <strong>Evidência:</strong> descreva uma tarefa executada, o contexto e um resultado observável. <strong>Fechamento:</strong> confirme disponibilidade compatível e informe que o currículo segue anexado ou cadastrado.</p>
<p>Modelo para adaptar: “Prezada equipe de recrutamento, candidato-me à vaga de recepcionista publicada no canal oficial da empresa. Em meu trabalho anterior, organizei agenda, confirmei atendimentos e registrei pendências para a equipe do turno seguinte. Essa prática se relaciona às rotinas descritas no anúncio. Tenho disponibilidade para a escala informada e fico à disposição para conversar. Meu currículo segue em anexo.”</p>
<p>Resultado observável não precisa ser número. Pode ser uma planilha conferida, uma fila organizada, um procedimento documentado ou uma divergência identificada. Se não mediu tempo ou volume, não invente porcentagem.</p>
<h2>Quando falta experiência formal</h2>
<p>Use projeto, trabalho autônomo, atividade escolar ou voluntariado, identificado como tal. Exemplo: “Em projeto escolar, fui responsável por receber inscrições, conferir nomes e orientar participantes.” Não transforme atividade eventual em emprego registrado. Veja também como registrar <a href="/blog/experiencia-informal-curriculo-como-colocar">experiência informal no currículo</a>.</p>
<h2>Formato e envio seguro</h2>
<p>Se a plataforma possui campo de texto, escreva nele. Em e-mail, a própria mensagem pode cumprir o papel da carta. Quando pedirem arquivo, use PDF com nome profissional e confira se abre. O <a href="https://europass.europa.eu/pt/create-europass-cover-letter" target="_blank" rel="noopener noreferrer">Europass</a>, serviço oficial da União Europeia, apresenta uma ferramenta de estruturação de carta; use como referência de organização, não como modelo obrigatório no Brasil.</p>
<p>Não inclua CPF, RG, endereço completo, estado civil, foto ou pretensão salarial sem necessidade. Não envie documento para endereço diferente do divulgado sem confirmar a origem. Uma carta curta e específica é melhor que texto longo cheio de adjetivos: troque “sou proativo e excelente” por uma ação que o leitor possa compreender e verificar.</p>
<h2>Checklist antes de enviar</h2>
<ul><li>vaga e empresa estão corretas;</li><li>as duas evidências são verdadeiras;</li><li>horário e local são compatíveis;</li><li>não há dado pessoal desnecessário;</li><li>currículo e carta não se contradizem;</li><li>o canal pertence à empresa ou plataforma anunciada.</li></ul>
<h2>Adapte ao tipo de candidatura</h2>
<p>Para indicação, cite a pessoa somente com autorização: “Soube da vaga por ___, que autorizou mencionar seu nome.” Para candidatura espontânea, diga a área de interesse e por que escolheu aquela organização, sem afirmar que existe vaga aberta. Para mudança de carreira, conecte uma habilidade transferível a uma tarefa: conferência, atendimento, manutenção, registro ou organização. Não diga “aceito qualquer cargo”, pois isso impede o leitor de entender onde seu perfil se encaixa.</p>
<p>Leia a carta em voz alta e retire frases que serviriam para qualquer empresa. Se um parágrafo só repete “dedicado, pontual, comunicativo”, substitua por situação real ou apague. Uma página é limite, não meta; muitas candidaturas ficam claras em 150 a 250 palavras.</p>
<p>Guarde a versão enviada e o link da oportunidade. Personalizar não significa reescrever sua história; significa selecionar apenas o que responde àquela vaga.</p>
    `.trim()
  },

  "comparar-beneficios-vaga-emprego": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial: 13 de outubro de 2026.</strong> “Salário mais benefícios” não informa sozinho o valor nem as condições de uma vaga. Para comparar, transforme cada item em perguntas concretas: quem pode usar, quando começa, qual desconto existe, onde é aceito e o que ocorre em afastamento, férias ou término do contrato.</p>
<h2>Separe remuneração, benefício e reembolso</h2>
<p>Registre salário bruto, periodicidade e forma de pagamento em uma linha. Em outras, liste vale-transporte, alimentação, refeição, plano de saúde, seguro, bônus, comissão e ajuda de custo. Não some tudo como se fosse dinheiro disponível: há itens condicionais, coparticipações, regras internas e despesas que só são reembolsadas mediante comprovante.</p>
<p>O vale-transporte tem finalidade específica de deslocamento residência-trabalho e vice-versa, conforme a <a href="https://www.planalto.gov.br/ccivil_03/leis/l7418.htm" target="_blank" rel="noopener noreferrer">Lei nº 7.418/1985</a>. Confirme com a empresa o procedimento e o desconto aplicável ao caso; não deduza a regra apenas pelo nome “auxílio transporte”.</p>
<h2>Faça uma ficha para cada item</h2>
<ul><li><strong>Valor ou cobertura:</strong> o anúncio informa ou depende de política interna?</li><li><strong>Início:</strong> começa na admissão, após período definido ou mediante adesão?</li><li><strong>Custo do trabalhador:</strong> há desconto, coparticipação ou mensalidade por dependente?</li><li><strong>Uso real:</strong> a rede atende seu bairro, trajeto e rotina?</li><li><strong>Condição:</strong> depende de presença, meta, resultado coletivo ou comprovante?</li><li><strong>Documento:</strong> a condição aparece na proposta, política ou instrumento coletivo?</li></ul>
<p>Em plano de saúde, pergunte operadora, tipo de cobertura, acomodação, rede, carência quando aplicável, coparticipação e dependentes. A <a href="https://www.gov.br/ans/pt-br/assuntos/consumidor" target="_blank" rel="noopener noreferrer">Agência Nacional de Saúde Suplementar</a> reúne informações ao consumidor; a página pública ajuda a formular perguntas, mas não substitui a proposta específica do plano empresarial.</p>
<h2>Calcule o que muda no mês</h2>
<p>Use valores fornecidos pela empresa e custos seus. Exemplo hipotético: uma proposta oferece alimentação, mas exige duas integrações extras no trajeto; outra paga menos nominalmente, porém fica perto de casa. Registre transporte, refeições não cobertas, cuidado de dependente e tempo de deslocamento. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> permite inserir tarifa e quantidade de viagens sem presumir preço local.</p>
<p>Não atribua preço fictício a ambiente, estabilidade ou chance de promoção. Trate-os como critérios separados: clareza da função, segurança, escala, treinamento, duração do contrato e qualidade da comunicação.</p>
<h2>Benefício prometido precisa de condição clara</h2>
<p>Se o anúncio diz apenas “comissão”, pergunte base, momento de pagamento, estorno, meta e existência de garantia prevista na proposta. Para bônus, confirme se é fixo, variável ou discricionário. Para alimentação, verifique modalidade, dias creditados, desconto e rede. Para trabalho híbrido, confirme frequência presencial e equipamentos.</p>
<p>Não pressione atendente a enviar documento confidencial. Peça uma proposta com salário, jornada, local, tipo de contrato e benefícios aplicáveis. Se a resposta permanecer vaga, registre a incerteza em vez de completar a planilha com suposição.</p>
<h2>Compare sem reduzir tudo a um número</h2>
<p>Monte três colunas: confirmado por escrito, informado verbalmente e ainda pendente. Só a primeira deve sustentar decisão financeira. Depois, use o guia para <a href="/blog/comparar-duas-propostas-emprego">comparar duas propostas</a> considerando função, risco e compatibilidade. O melhor pacote é o que atende necessidades reais com regras compreendidas — não o que reúne mais nomes de benefícios no anúncio.</p>
<h2>Atualize a comparação quando chegar a proposta</h2>
<p>O anúncio pode resumir condições que mudam por unidade, cargo ou jornada. Ao receber proposta, refaça a ficha e marque a origem de cada informação. Se houver convenção ou acordo coletivo aplicável, peça qual instrumento e vigência, sem presumir que uma regra de outro setor vale para você. Guarde cópia do que foi destinado ao candidato.</p>
<p>Faça um cenário mensal comum e outro de maior gasto, por exemplo com mais dias presenciais ou coparticipação de saúde. Não desconte imposto ou contribuição com tabela antiga; para estimativa financeira, use fonte oficial vigente ou aguarde o demonstrativo. O objetivo é enxergar dependências, não prever o primeiro contracheque com falsa exatidão.</p>
    `.trim()
  },

  "comparar-duas-propostas-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Duas conversas positivas não são necessariamente duas propostas. Antes de escolher, confirme se cada empresa apresentou cargo, remuneração, jornada, local, tipo de contrato, data prevista e benefícios. Não peça demissão nem recuse outra oportunidade com base apenas em promessa informal.</p>
<h2>Crie uma folha de evidências</h2>
<p>Para cada opção, separe três estados: confirmado por escrito, informado em conversa e não esclarecido. Copie apenas os dados recebidos; não complete lacunas com estimativa. Se o recrutador não puder formalizar naquele momento, pergunte quando a informação estará disponível e até quando precisa responder.</p>
<p>A <a href="https://www.gov.br/pt-br/apps/ctps-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> permite acompanhar vínculos e dados do contrato quando registrados. Ela não substitui a conferência da proposta antes da admissão nem transforma conversa em vínculo.</p>
<h2>Compare cinco dimensões</h2>
<ol><li><strong>Trabalho:</strong> tarefas, autonomia, treinamento, ferramentas e liderança.</li><li><strong>Tempo:</strong> jornada, escala, intervalo, início e deslocamento.</li><li><strong>Dinheiro:</strong> salário, parte variável, descontos conhecidos e despesas para trabalhar.</li><li><strong>Proteção:</strong> tipo e duração do contrato, segurança e clareza dos procedimentos.</li><li><strong>Vida real:</strong> saúde, cuidado familiar, estudo e transporte no horário exigido.</li></ol>
<p>Dê peso de zero a três apenas para organizar sua preferência, não para criar falsa precisão. Um critério impeditivo, como escala incompatível, não deve ser compensado por café gratuito ou promessa vaga de crescimento.</p>
<h2>Faça perguntas equivalentes às duas empresas</h2>
<ul><li>Qual é a jornada e como funciona a escala?</li><li>Qual será o local habitual e há deslocamentos?</li><li>O valor informado é bruto? Existe parcela variável?</li><li>Quais benefícios, descontos e datas de início?</li><li>Qual é o tipo de contrato e a previsão de admissão?</li><li>Quem orientará os primeiros dias?</li></ul>
<p>Para benefícios, use a <a href="/blog/comparar-beneficios-vaga-emprego">ficha de comparação</a>. Para transporte em São Luís, insira as tarifas e viagens que você confirmou na <a href="/ferramentas/custo-deslocamento">calculadora</a>.</p>
<h2>Peça tempo sem inventar outra oferta</h2>
<p>Mensagem possível: “Obrigado pela proposta para a função de ___. Gostaria de revisar as condições com cuidado. Posso confirmar minha decisão até ___? Antes disso, poderia esclarecer ___?” Use uma data realista e cumpra-a. Não alegue proposta inexistente para pressionar aumento; a mentira pode encerrar o processo.</p>
<p>Se a empresa exigir resposta imediata, registre que não houve tempo para conferir. Isso é informação relevante para sua decisão. Evite enviar a proposta completa de uma empresa para a concorrente; você pode mencionar que está avaliando outra oportunidade sem expor documento ou pessoa.</p>
<h2>Aceite uma e encerre a outra</h2>
<p>Após decidir, confirme por escrito as condições e os próximos passos. Para recusar: “Agradeço a proposta e o tempo da equipe. Após comparar as condições, decidi seguir outra opção e retiro minha candidatura.” Não precisa explicar salário da concorrente ou criticar o processo.</p>
<h2>Verifique sinais de risco antes de decidir</h2>
<p>Proposta não deve exigir pagamento para exame, material, uniforme, cadastro ou liberação de salário. Confirme CNPJ, domínio de e-mail e canal institucional, especialmente quando a conversa migra para aplicativo de mensagens. Não entregue senha gov.br nem código de autenticação. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha do CERT.br</a> reúne orientações de prevenção a golpes e proteção de contas.</p>
<p>Também registre o que falta: endereço exato, gestor, equipamento, treinamento e data de início. Uma condição não esclarecida não precisa encerrar a negociação, mas deve permanecer visível na decisão. Se a empresa se recusa a identificar função ou contrato, trate essa incerteza como risco real.</p>
<p>Se ainda houver exame, documento ou etapa condicional, pergunte explicitamente o que falta antes de tratar a contratação como concluída. Uma decisão responsável preserva prova, prazo e respeito; não existe fórmula universal que torne uma proposta melhor para todas as pessoas.</p>
    `.trim()
  },

  "dinamica-de-grupo-entrevista-dicas": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial: 13 de outubro de 2026.</strong> Dinâmica de grupo não tem um roteiro universal. Pode envolver apresentação, discussão de caso, priorização ou construção coletiva. O objetivo do candidato não é falar mais nem assumir liderança a qualquer custo, e sim compreender a tarefa, contribuir com clareza e permitir que o grupo trabalhe.</p>
<h2>Confirme a instrução antes de agir</h2>
<p>Ouça tempo, entrega esperada, materiais e restrições. Se algo estiver ambíguo, faça pergunta curta: “Devemos apresentar uma única decisão do grupo ou alternativas?” Não comece a resolver enquanto o facilitador ainda explica. Anote o enunciado e o horário final.</p>
<p>A <a href="https://suap.enap.gov.br/vitrine/curso/2687/" target="_blank" rel="noopener noreferrer">Enap</a> relaciona escuta ativa, assertividade e empatia às relações de trabalho. É uma referência de desenvolvimento, não uma regra secreta de seleção. A empresa deve explicar a atividade e avaliar conforme seus critérios.</p>
<h2>Escolha uma contribuição útil</h2>
<p>No começo, o grupo pode precisar de alguém para repetir o objetivo, controlar tempo, registrar opções ou organizar a apresentação. Ofereça-se sem impor: “Posso anotar as alternativas; alguém acompanha o tempo?” Se outra pessoa já assumiu, procure uma lacuna diferente.</p>
<p>Ao discordar, ataque a ideia, não a pessoa: “Essa opção atende o prazo, mas ainda não considerou o custo. Podemos comparar os dois critérios?” Dê espaço para quem foi interrompido e não transforme toda fala em disputa.</p>
<h2>Use evidência sem inventar autoridade</h2>
<p>Quando o caso trouxer números, faça conta visível e diga a hipótese. Quando faltar informação, sinalize: “Com os dados disponíveis, esta é uma possibilidade; precisaríamos confirmar ___.” Não alegue que já liderou equipe, operou sistema ou resolveu crise se isso não aconteceu.</p>
<p>Exemplo hipotético: o grupo precisa priorizar entregas de uma loja com atraso. Uma candidata organiza os pedidos por prazo e dependência, outro participante verifica capacidade e uma terceira prepara a apresentação. O valor não está em “mandar”; está em tornar o raciocínio compreensível e incluir contribuições.</p>
<h2>Quando a atividade incomoda ou exclui</h2>
<p>Se houver necessidade de acessibilidade, informe ao contato do processo com antecedência quando possível. Durante a tarefa, peça ajuste concreto: leitura do material, mais contraste, espaço de circulação ou instrução escrita. Não é necessário revelar diagnóstico além do necessário para solicitar a condição.</p>
<p>Você pode recusar atividade que exponha dado sensível, cause risco físico ou exija comportamento humilhante. Peça alternativa e registre o fato. Em processo remoto, não compartilhe tela com mensagens, documentos ou senhas; feche janelas antes.</p>
<h2>Prepare-se com prática, não personagem</h2>
<ul><li>treine apresentação de 40 segundos com nome, foco e uma evidência;</li><li>resolva um caso simples em grupo observando tempo;</li><li>pratique resumir uma fala antes de discordar;</li><li>prepare perguntas sobre função e critérios;</li><li>revise o anúncio e pesquise a empresa por fonte oficial.</li></ul>
<h2>Cuidados em dinâmica remota</h2>
<p>Teste áudio, câmera quando solicitada, nome exibido e conexão antes do horário. Entre pelo link confirmado e mantenha documento pessoal fora da câmera. Use o recurso de levantar a mão ou uma frase curta para pedir turno; silêncio de internet pode parecer interrupção, então confirme se sua fala foi ouvida. Tenha papel para anotar o enunciado, mas não grave participantes sem autorização.</p>
<p>Se a plataforma falhar, registre a tela de erro sem capturar dados de terceiros e avise o contato pelo canal oficial. Não conclua que foi eliminado nem entre em links alternativos enviados por perfil desconhecido. A avaliação deve considerar a atividade, não a sua capacidade de adivinhar instruções ausentes.</p>
<p>Depois, anote o que fez, onde interrompeu e como lidou com a decisão. Se houver contato, use o guia de <a href="/blog/pedir-feedback-entrevista-emprego">pedido de feedback</a> sem pressionar. A dinâmica avalia uma situação limitada; ela não mede todo o seu valor profissional.</p>
    `.trim()
  },

  "empatia-atendimento-cliente-entrevista": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Em entrevista para atendimento, “ter empatia” não significa concordar com tudo nem prometer solução fora da regra. Significa compreender a demanda, mostrar que ouviu, separar fato de emoção e encaminhar o que está dentro da sua responsabilidade.</p>
<h2>Responda com uma situação verificável</h2>
<p>Escolha um episódio real e organize em quatro partes: demanda recebida, informação que você confirmou, ação dentro do procedimento e resultado observável. Se nunca trabalhou com clientes, use atividade escolar, voluntária ou familiar, identificando o contexto corretamente.</p>
<p>A <a href="https://repositorio.enap.gov.br/items/391a0d4d-f3ca-4667-b63e-8e1b401748c1" target="_blank" rel="noopener noreferrer">Enap</a> disponibiliza material sobre atendimento ao cidadão que diferencia tratamento e qualidade do serviço e trabalha comunicação, cortesia e responsabilidade. O conteúdo é voltado ao serviço público, mas ajuda a compreender que falar com educação não substitui resolver ou encaminhar a demanda.</p>
<h2>Use a sequência ouvir, confirmar, agir</h2>
<ol><li><strong>Ouvir:</strong> deixe a pessoa concluir e identifique a necessidade central.</li><li><strong>Confirmar:</strong> resuma sem ironia: “Entendi que o pedido chegou incompleto e você precisa saber o prazo de correção.”</li><li><strong>Agir:</strong> explique o que pode fazer, o que depende de outra área e qual será o próximo contato.</li></ol>
<p>Evite frases automáticas como “entendo perfeitamente” quando não entendeu. Pergunte o dado que falta e não repita coleta que já está registrada. Se não souber, diga que verificará; não invente política para encerrar a fila.</p>
<h2>Exemplo de resposta de entrevista</h2>
<p>“Em uma recepção, uma pessoa chegou para atendimento sem constar na agenda. Primeiro conferi nome e horário no sistema e no comprovante, sem expor seus dados na frente da fila. Expliquei que havia divergência e pedi apoio à responsável pela agenda. Enquanto ela verificava, informei a previsão realista e ofereci as opções autorizadas. O atendimento foi remarcado conforme a decisão da responsável e deixei a ocorrência registrada para evitar nova informação desencontrada.”</p>
<p>O exemplo mostra limite, privacidade e encaminhamento. Adapte apenas se tiver vivido situação comparável. Não transforme atraso alheio em heroísmo nem atribua a si decisão do supervisor.</p>
<h2>Empatia também tem limites</h2>
<p>Ofensa, ameaça e assédio não são parte normal do atendimento. Siga o protocolo, chame supervisão e preserve a segurança. Não forneça telefone pessoal, senha, cadastro de outro cliente ou informação que a função não autoriza. Em caso de erro da empresa, reconheça o fato conhecido e indique o canal de correção; não prometa indenização ou prazo sem autorização.</p>
<h2>Perguntas para fazer ao recrutador</h2>
<ul><li>Quais canais e tipos de demanda a função atende?</li><li>Existe roteiro e autonomia para exceções?</li><li>Como registrar e escalar um caso?</li><li>Quais dados podem ser consultados e compartilhados?</li><li>Há treinamento para conflito e segurança?</li></ul>
<h2>Treine três variações sem decorar discurso</h2>
<p>Prepare um caso com pessoa confusa, outro com erro operacional e um terceiro em que você precisou dizer “não” com respeito. Em cada um, identifique qual informação confirmou e quem tinha autoridade para decidir. Isso ajuda a responder perguntas diferentes sem repetir uma história genérica.</p>
<p>Se o entrevistador perguntar por um erro seu, não transfira culpa ao cliente. Explique o que fez, como corrigiu e qual barreira adicionou. Exemplo: registrou o número errado, avisou a supervisão, corrigiu no sistema autorizado e passou a repetir o dado antes de concluir. Só use se for verdadeiro e sem revelar a identidade de quem foi atendido.</p>
<p>Na entrevista, combine empatia com procedimento. Para outras respostas baseadas em fatos, veja <a href="/blog/entrevista-comportamental-exemplos">entrevista comportamental</a>. Uma boa resposta não é “eu trato todo mundo bem”; é uma sequência concreta que respeita pessoa, dado, limite e solução possível.</p>
    
<h2>Use apenas o dado necessário para resolver</h2>
<p>Antes de pedir informação, pergunte qual decisão depende dela. Nome e número do pedido podem bastar; documento completo, endereço ou dados bancários não devem ser coletados por rotina sem finalidade e autorização. A ANPD explica no conteúdo para <a href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados" target="_blank" rel="noopener noreferrer">titulares de dados</a> o que é dado pessoal e recomenda limitar o fornecimento aos casos necessários.</p>
<h2>Demonstre empatia sem criar prazo falso</h2>
<p>Troque “vou resolver agora” por uma sequência verificável: o que foi conferido, qual área decide, qual protocolo foi gerado e quando haverá atualização confirmada. Se não há prazo, diga isso e informe o canal de acompanhamento. Reconhecer frustração não autoriza assumir culpa, indenização ou decisão que pertence a outro setor.</p>
<h2>Prepare uma resposta para dizer não</h2>
<p>Escolha um caso real em que a solicitação contrariava regra ou estava fora de sua autonomia. Explique como confirmou a regra, apresentou alternativa permitida, acionou supervisão quando necessário e registrou o contato. Uma boa resposta preserva dignidade sem ceder informação, desconto ou acesso indevido.</p>
<h2>Avalie seu exemplo antes da entrevista</h2>
<p>Verifique se a história identifica demanda, confirmação, ação, limite e resultado. Remova nome de cliente, número de pedido e detalhes que permitam reconhecer a pessoa. Se o resultado dependeu da equipe, diga “encaminhamos” ou descreva sua parte; não transforme solução coletiva em desempenho individual.</p>
`.trim()
  },

  "emprego-apos-40-anos-curriculo": {
    reviewedAt: "2026-10-13",
    contentHtml: `
<p><strong>Revisão editorial: 13 de outubro de 2026.</strong> Um currículo após os 40 não precisa esconder idade nem narrar toda a vida profissional. O objetivo é mostrar o que você sabe fazer hoje, quais problemas já resolveu e por que isso se relaciona à vaga. Data de nascimento, estado civil e foto não devem ser incluídos automaticamente.</p>
<h2>Comece pelo cargo possível agora</h2>
<p>Escolha uma ou duas funções compatíveis com sua experiência, saúde, horário e deslocamento. Leia anúncios atuais e liste tarefas recorrentes. Use a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> para entender a família ocupacional, sem copiar descrições como se fossem atividades que você executou.</p>
<p>No título, prefira “Auxiliar administrativo | atendimento e controle de documentos” a “profissional experiente em busca de oportunidade”. O primeiro orienta a leitura; o segundo não informa função.</p>
<h2>Selecione trajetória, não apague contexto</h2>
<p>Nas experiências recentes ou mais relacionadas, registre empresa, função, período e três a cinco realizações verdadeiras. Experiências antigas podem ser resumidas em uma seção curta quando ainda ajudam a comprovar habilidade. Não é obrigatório detalhar cada emprego de décadas anteriores, mas datas informadas devem ser corretas.</p>
<p>Troque “responsável por tudo” por evidência: “conferia pedidos e separava divergências para o fechamento”; “organizava agenda e repassava pendências ao turno seguinte”. Sem medição, não crie percentuais. Conhecimento de processo, cliente ou equipamento continua útil quando ligado à vaga atual.</p>
<h2>Atualize ferramentas com demonstração</h2>
<p>Não escreva “informática” de forma genérica. Indique o que faz: editar documento, preencher planilha, anexar arquivo, participar de chamada ou usar sistema específico. Se está aprendendo, informe “curso em andamento” com instituição e conteúdo real. O guia de <a href="/blog/alfabetizacao-digital-emprego-basico">alfabetização digital</a> ajuda a montar uma prática básica sem comprar certificado desnecessário.</p>
<p>Exemplo hipotético: uma profissional de comércio retoma a busca para estoque. Ela mantém experiência com recebimento e conferência, acrescenta uso recente de planilha e retira um curso antigo sem relação. Não afirma dominar o sistema da empresa antes de conhecê-lo.</p>
<h2>Idade não pode ser critério discriminatório</h2>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/combate_a_discriminacao" target="_blank" rel="noopener noreferrer">Secretaria de Inspeção do Trabalho</a> inclui idade entre critérios discriminatórios e referencia a Lei nº 9.029/1995. A <a href="https://legis.senado.gov.br/norma/550905/publicacao/34619617" target="_blank" rel="noopener noreferrer">lei publicada pelo Senado</a> proíbe prática discriminatória e limitativa no acesso ou manutenção da relação de trabalho por idade, entre outros motivos.</p>
<p>Isso não significa aprovação automática nem elimina requisitos reais da função. Se uma pergunta sobre idade desviar do trabalho, você pode redirecionar: “Posso explicar minha disponibilidade e como executo as tarefas da vaga.” Registre anúncio ou mensagem discriminatória e procure orientação da Inspeção do Trabalho, sindicato ou profissional jurídico quando necessário.</p>
<h2>Revise o documento final</h2>
<ul><li>até duas páginas quando a trajetória exigir, sem enchimento;</li><li>contato profissional e cidade, sem endereço completo;</li><li>resumo alinhado ao cargo;</li><li>experiências com fatos, não estereótipos de “maturidade”;</li><li>cursos recentes e relevantes;</li><li>PDF legível, sem informação sensível desnecessária.</li></ul>
<h2>Prepare a conversa sobre transições</h2>
<p>Se mudou de área, explique o movimento em uma frase e apresente evidência da nova direção: prática, curso relevante ou projeto. Se ficou um período fora, indique a atividade que deseja mencionar sem fornecer detalhes pessoais: “Fiquei fora do mercado formal por responsabilidade familiar e agora tenho disponibilidade para esta escala.” Não crie trabalho autônomo para preencher o intervalo.</p>
<p>Treine respostas sobre tecnologia e aprendizagem com exemplos atuais. “Aprendi a anexar documentos e organizar dados em planilha durante ___” é mais convincente que “aprendo qualquer coisa”. Pergunte sobre treinamento, ferramentas e esforço físico real da função; adequação é uma via de mão dupla, não teste de juventude.</p>
<p>Use também o guia de <a href="/blog/retorno-mercado-trabalho-gap-curriculo">retorno ao mercado</a> se houver intervalo. O currículo deve tornar a competência visível no presente; não pedir desculpas pela idade nem prometer que experiência resolve tudo.</p>
    `.trim()
  },

  "entrevista-desligamento-o-que-falar": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Entrevista de desligamento é uma conversa sobre a saída, não substitui documentos rescisórios, devolução de bens ou conferência do vínculo. Prepare fatos que você presenciou, escolha o que deseja registrar e não assine declaração que não compreendeu.</p>
<h2>Separe quatro assuntos antes da reunião</h2>
<ol><li><strong>motivo informado:</strong> o que a empresa comunicou e o que você deseja esclarecer;</li><li><strong>trabalho:</strong> processos que funcionavam, falhas observadas e sugestões;</li><li><strong>pendências:</strong> equipamento, acesso, documento, reembolso e contato responsável;</li><li><strong>próximos passos:</strong> datas, canais e comprovantes que serão entregues.</li></ol>
<p>Leve anotações curtas. Datas, tarefa, impacto e tentativa de solução são mais úteis que “era tudo desorganizado”. Não fale por colegas nem revele dado de cliente para provar um ponto.</p>
<h2>Dê feedback sem apagar o problema</h2>
<p>Estrutura possível: “Em três fechamentos, recebi a planilha depois do horário combinado. Avisei a supervisão nos dias correspondentes e propus antecipar a conferência. A entrega continuou chegando tarde, o que reduziu o tempo de revisão.” Se não houver contagem ou registro, diga “em algumas ocasiões” e descreva um exemplo verdadeiro.</p>
<p>Para reconhecer algo positivo, seja igualmente específico: treinamento acompanhado, instrução escrita, equipamento adequado ou retorno rápido. Evite elogio automático em troca de promessa de referência.</p>
<h2>Defina limites para perguntas pessoais</h2>
<p>Você pode responder de forma profissional sobre o trabalho e recusar especulação sobre colegas, diagnóstico de saúde ou vida privada. Se a saída envolve assédio, discriminação ou risco, registre fatos, datas, canais usados e documentos existentes. Não confronte pessoa envolvida sozinho se houver ameaça; busque canal interno, sindicato, Inspeção do Trabalho ou orientação jurídica.</p>
<h2>Confira o que é operacional</h2>
<p>Peça uma lista de itens a devolver e protocolo de recebimento. Encerre acesso conforme orientação; não copie banco de clientes, arquivos internos ou senha. Informe um contato pessoal apenas pelo canal autorizado para receber documentos seus.</p>
<p>Depois, consulte o vínculo na <a href="https://www.gov.br/pt-br/apps/ctps-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. O Ministério do Trabalho mantém <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho/perguntas-frequentes-carteira-de-trabalho-digital/" target="_blank" rel="noopener noreferrer">perguntas frequentes</a> sobre acesso e visualização de contratos. Se houver divergência, peça esclarecimento formal; este guia não calcula verbas nem determina qual modalidade de desligamento se aplica.</p>
<h2>Frases úteis para situações difíceis</h2>
<ul><li>“Posso relatar o fato que presenciei, mas não avaliar a intenção da pessoa.”</li><li>“Não tenho essa informação; prefiro não supor.”</li><li>“Gostaria de receber por escrito a data e o canal para essa pendência.”</li><li>“Preciso ler o documento antes de confirmar que concordo.”</li><li>“Este ponto envolve informação pessoal e não quero detalhá-lo nesta conversa.”</li></ul>
<h2>Faça um fechamento por escrito</h2>
<p>Após a reunião, envie ou guarde um resumo com data, participantes, bens devolvidos e responsáveis pelas pendências. Se a empresa fornecer protocolo, confira descrição e quantidade. Não leve equipamento até outra unidade sem confirmação do destino e não deixe item na recepção sem recibo.</p>
<p>Mantenha somente documentos pessoais e comprovantes que você está autorizado a guardar. Arquivos de cliente, listas internas, código, proposta comercial e conversa de colega continuam protegidos após a saída. Se precisar comprovar um fato em disputa, procure orientação antes de copiar material confidencial por conta própria.</p>
<p>Se pedirem assinatura, leia, solicite cópia e peça explicação do que não entendeu. Assinar presença em reunião é diferente de concordar com toda narrativa; verifique o texto concreto. Para uma saída iniciada pelo trabalhador, consulte também o guia sobre <a href="/blog/pedido-demissao-aviso-previo-acerto">pedido de demissão e aviso</a>.</p>
<p>Encerre confirmando quem responde por cada pendência e como você receberá comprovantes. Uma entrevista de desligamento útil deixa registro claro; ela não exige gratidão forçada, ataque pessoal nem renúncia a direitos.</p>

<h2>Monte uma matriz de pendências, documentos e responsáveis</h2>
<p>Antes da conversa, crie quatro colunas: item, evidência que você já possui, responsável indicado e próxima confirmação. Separe devolução de equipamento, bloqueio de acesso, reembolso, recibos, documentos rescisórios e atualização do vínculo. A matriz não calcula direito nem substitui orientação; ela impede que uma pergunta operacional desapareça dentro de uma discussão sobre desempenho.</p>
<p>Ao receber uma resposta, registre o canal e a data prometida pela própria empresa. Se não houver prazo, escreva “sem prazo confirmado” em vez de preencher uma data desejada. Para documento que contém dados pessoais, confirme destinatário e forma de envio; não encaminhe cópia integral para grupo ou endereço não verificado.</p>
<h2>Diferencie relato, opinião e solicitação</h2>
<p>Revise cada ponto com três etiquetas. <strong>Relato:</strong> fato que você presenciou e consegue situar. <strong>Opinião:</strong> sua leitura sobre processo ou ambiente, apresentada como percepção. <strong>Solicitação:</strong> documento, correção ou resposta que ainda precisa de responsável. Essa separação reduz acusações imprecisas e deixa claro o que depende de ação posterior.</p>
<p>Exemplo: “Recebi o aviso nesta data” é relato; “o fluxo me pareceu confuso” é opinião; “peço confirmação do canal que enviará o comprovante” é solicitação. Não assine texto preparado por outra pessoa como se fosse sua narrativa sem ler, pedir explicação e solicitar cópia. Quando houver possível violação de direito, discriminação, assédio ou divergência de verba, preserve documentos próprios e procure sindicato, Inspeção do Trabalho ou profissional habilitado.</p>
    `.trim()
  },

  "follow-up-apos-entrevista-mensagem": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Follow-up é uma mensagem de acompanhamento depois da entrevista. Ele não acelera a decisão nem cria obrigação de resposta. A função é identificar o processo, respeitar o prazo informado e deixar claro que você continua disponível.</p>
<h2>Antes de escrever, recupere o combinado</h2>
<p>Consulte a anotação feita ao final da entrevista: cargo, data, canal, nome do contato e prazo de retorno. Se a empresa disse “até sexta”, aguarde o fim desse prazo. Se não houve data, não transforme silêncio de poucas horas em cobrança. Escolha um momento razoável e envie uma única mensagem objetiva pelo canal já usado pela seleção.</p>
<p>O <a href="https://www.linkedin.com/help/linkedin/answer/a8684146" target="_blank" rel="noopener noreferrer">rastreador de oportunidades do LinkedIn</a> permite organizar vagas por etapa e incluir notas. Você pode obter o mesmo resultado em uma planilha própria: anúncio, candidatura, entrevista, prazo e próxima ação. Não guarde documento pessoal ou conversa confidencial nessa planilha.</p>
<h2>Monte a mensagem com cinco informações</h2>
<ol><li>nome da pessoa, se confirmado;</li><li>cargo e data da entrevista;</li><li>referência ao prazo, quando existiu;</li><li>pergunta curta sobre o andamento;</li><li>disponibilidade para complementar informação.</li></ol>
<p>Modelo quando o prazo terminou: “Olá, Carla. Participei da entrevista de terça-feira para a vaga de atendente. Como o retorno estava previsto para esta semana, gostaria de saber se há atualização sobre a etapa. Continuo interessado e disponível caso precisem de outra informação. Obrigado.”</p>
<p>Sem nome confirmado: “Olá, equipe de recrutamento. Participei em 8 de outubro da entrevista para auxiliar administrativo. Gostaria de confirmar se o processo segue em andamento e se existe previsão para a próxima etapa. Fico disponível. Obrigado.” Não invente intimidade, não use áudio longo e não acrescente urgência pessoal para pressionar.</p>
<h2>Adapte ao canal sem perder o registro</h2>
<p>No e-mail, responda à conversa original e mantenha o assunto. Em aplicativo de mensagem, escreva em horário comercial e cite a vaga logo no início. Em plataforma de recrutamento, use a área de mensagens, se existir. Evite procurar perfil pessoal do entrevistador quando a empresa forneceu outro canal.</p>
<p>Se a candidatura veio do SINE, acompanhe pelo canal indicado no próprio serviço ou encaminhamento. A página oficial <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> descreve consulta e candidatura; ela não autoriza contato por números encontrados fora do anúncio.</p>
<h2>Leia cada tipo de resposta</h2>
<ul><li><strong>processo em andamento:</strong> agradeça e anote a nova data;</li><li><strong>pedido de informação:</strong> envie apenas o solicitado pelo canal validado;</li><li><strong>vaga encerrada:</strong> agradeça e arquive, sem discutir a decisão;</li><li><strong>nenhuma resposta:</strong> registre a tentativa e continue outras candidaturas;</li><li><strong>pedido de pagamento ou dado sensível inesperado:</strong> interrompa e confirme a identidade da empresa.</li></ul>
<p>Uma segunda mensagem só faz sentido quando o recrutador indicou nova janela ou deixou uma pendência concreta. Repetir “alguma novidade?” todos os dias não produz evidência nova e pode dificultar a comunicação.</p>
<h2>Proteja seus dados no acompanhamento</h2>
<p>Não reenvie RG, CPF, dados bancários ou foto de documento “para agilizar” sem saber quem pediu, por que precisa e qual é o canal autorizado. O <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">CERT.br</a> reúne orientações sobre privacidade, perfis falsos e verificação em duas etapas. Desconfie de mudança repentina de número, domínio parecido ou link encurtado.</p>
<p>Feche o ciclo na sua lista com data e resultado. Follow-up profissional é um registro curto, não uma tentativa de convencer depois da entrevista. Enquanto espera, mantenha outras candidaturas compatíveis ativas e não interprete silêncio como aprovação ou reprovação.</p>
    
<h2>Use uma linha do tempo, não a ansiedade, para decidir</h2>
<p>Crie quatro campos: data da entrevista, prazo informado, primeiro dia útil depois do prazo e ação tomada. Se o recrutador alterou a previsão, registre a nova data e não some os dois prazos. Quando não houve previsão, prefira uma única consulta curta depois de um intervalo razoável, sempre pelo canal já usado. A linha do tempo serve para impedir mensagens sucessivas, não para calcular uma regra universal.</p>
<h2>Adapte a mensagem ao resultado que você precisa</h2>
<ul><li><strong>Prazo vencido:</strong> confirme cargo e entrevista, mencione a previsão e pergunte se há atualização.</li><li><strong>Pedido de documento:</strong> confirme exatamente o item solicitado e envie apenas pelo canal verificado; não junte documento que não foi pedido.</li><li><strong>Nova etapa:</strong> responda com disponibilidade objetiva e peça endereço ou link oficial quando necessário.</li><li><strong>Recusa recebida:</strong> agradeça e encerre; pedir retorno sobre pontos de melhoria é opcional e não cria dever de resposta.</li></ul>
<p>Se a resposta for automática, não presuma que a pessoa leu a mensagem. Registre o envio e aguarde. Depois de um acompanhamento sem retorno, encerre a ação no rastreador e continue outras candidaturas, salvo se a empresa indicar outro prazo.</p>
<h2>Guarde prova sem montar um arquivo de dados pessoais</h2>
<p>Salve o texto enviado, data, canal e resultado em nota própria. Não copie CPF, endereço, documento de terceiros ou conversa confidencial para planilha de candidaturas. O <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">CERT.br</a> reúne orientações sobre autenticação, fraudes e privacidade que ajudam a reconhecer pedidos inadequados. Se a mensagem exigir senha, código de autenticação, pagamento ou instalação de aplicativo fora da loja oficial, pare e valide a identidade do contato por um canal independente.</p>
`.trim()
  },

  "gestao-de-tempo-trabalho-dicas": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> No emprego novo, administrar o tempo começa por entender o que precisa ser entregue, quem define a prioridade e quais interrupções não podem esperar. Aplicativo nenhum resolve uma fila contraditória sem alinhamento com a liderança.</p>
<h2>Transforme pedidos soltos em uma fila visível</h2>
<p>Para cada demanda, anote: resultado esperado, responsável pela aprovação, prazo, dependência e próximo passo. “Ver pedidos” é vago; “conferir número, forma de pagamento e endereço dos pedidos recebidos até 14h” permite estimar e conferir. Não copie dados de cliente para caderno pessoal: use o sistema ou registro autorizado.</p>
<p>A Escola Virtual de Governo apresenta, no curso <a href="https://www.escolavirtual.gov.br/curso/468" target="_blank" rel="noopener noreferrer">Produtividade e Gestão do Tempo</a>, temas como autoconhecimento, desempenho e atitudes produtivas. Use materiais assim para experimentar métodos, não para concluir que todo atraso é falha individual. Volume excessivo, sistema indisponível e prioridade conflitante precisam ser comunicados.</p>
<h2>Negocie prioridade com dados curtos</h2>
<p>Quando duas tarefas urgentes chegam juntas, não escolha em silêncio. Diga o que está fazendo, o tempo restante e a consequência: “Estou fechando o relatório que vence às 11h; o cadastro novo leva cerca de 30 minutos. Qual deve vir primeiro?” A decisão fica com quem coordena o trabalho e você registra a ordem.</p>
<p>Evite prometer horário que ainda não estimou. Quebre a tarefa, execute uma amostra e atualize a previsão. Se a atividade depende de outra pessoa, registre o pedido e o ponto bloqueado. Isso diferencia atraso de espera por insumo.</p>
<h2>Use blocos adequados ao tipo de trabalho</h2>
<ul><li><strong>atendimento:</strong> organize retorno, pendência e passagem de caso;</li><li><strong>estoque:</strong> separe recebimento, conferência, registro e armazenamento;</li><li><strong>administrativo:</strong> agrupe lançamentos semelhantes e reserve conferência;</li><li><strong>produção:</strong> respeite sequência, segurança e tempo técnico, sem acelerar etapa obrigatória;</li><li><strong>trabalho criativo:</strong> combine períodos sem interrupção com janelas de resposta.</li></ul>
<p>A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo/pagina-inicial/" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> descreve conteúdos de ocupações para fins classificatórios. Ela pode ajudar a entender famílias de tarefas, mas não substitui a descrição da vaga, o treinamento, o contrato ou o procedimento da empresa.</p>
<h2>Trate interrupções sem perder a tarefa original</h2>
<p>Antes de mudar de assunto, deixe uma marca: última etapa concluída, arquivo aberto e próximo passo. Se a interrupção puder esperar, registre e combine quando responderá. Se envolver segurança, cliente presente ou parada de operação, siga a prioridade definida no local. Depois, retome pela marca; confiar só na memória aumenta retrabalho.</p>
<h2>Avise risco antes do prazo</h2>
<p>Uma atualização útil contém quatro partes: entrega, estado, obstáculo e opção. Exemplo: “Conferi 18 de 25 cadastros. Sete dependem da planilha corrigida. Se ela chegar até 15h, concluo hoje; se não, posso finalizar os já válidos e entregar o restante amanhã.” Não espere o fim do turno para revelar bloqueio conhecido de manhã.</p>
<h2>Faça uma revisão de dez minutos</h2>
<p>No fim do dia, confira o que terminou, o que ficou bloqueado e o que precisa ser retomado. Apague lembretes com dados sensíveis e transfira o registro necessário ao sistema oficial. Uma vez por semana, identifique repetição que merece checklist, não vigilância permanente sobre cada minuto.</p>
<p>Gestão do tempo saudável não significa trabalhar sem pausa ou esconder sobrecarga. Significa tornar compromissos visíveis, confirmar prioridades e preservar qualidade e segurança. Se a demanda não cabe na jornada, leve evidências para o alinhamento em vez de compensar continuamente com trabalho não combinado.</p>
    
<h2>Separe urgência, importância e capacidade</h2>
<p>Prazo curto não significa que tudo cabe ao mesmo tempo. Para cada pedido, identifique consequência, esforço aproximado e dependência. Se três entregas excedem a capacidade do turno, apresente a fila e peça decisão. Trabalhar ocultando excesso pode produzir erro, retrabalho e risco; tornar a capacidade visível permite renegociar escopo ou prazo.</p>
<p>Use estimativa como intervalo, não promessa exata. Depois da primeira parte, compare tempo previsto e real e atualize quem depende da entrega. Quando surgir tarefa recorrente, registre duração e variações por algumas ocorrências. O objetivo é planejar melhor, não criar vigilância individual minuto a minuto.</p>
<h2>Faça uma passagem de turno completa</h2>
<p>Quando outra pessoa continuará o trabalho, registre o que foi concluído, onde está o arquivo ou item, qual pendência existe e quem precisa decidir. Evite mensagens como “já está quase pronto”. Em estoque, identifique lote e divergência; em atendimento, preserve o protocolo permitido; em administrativo, indique versão do documento. Não inclua dado pessoal fora do sistema autorizado.</p>
<h2>Analise falhas repetidas pelo processo</h2>
<p>Se uma tarefa sempre atrasa, verifique entrada incompleta, sistema lento, autorização tardia, sequência inadequada ou volume acima da capacidade. Um checklist pode resolver esquecimento; não resolve falta de pessoa, equipamento ou acesso. Leve exemplos com data e impacto para o alinhamento, sem atribuir culpa antes de confirmar a causa.</p>
<h2>Defina um encerramento de jornada</h2>
<p>Nos minutos finais, atualize o sistema, entregue pendências críticas e anote o primeiro passo do próximo turno. Trabalho fora do horário não deve virar correção silenciosa permanente da capacidade. Quando houver necessidade excepcional, confirme orientação, registro e compensação aplicáveis com a liderança ou RH. Organização saudável preserva descanso e não transforma disponibilidade contínua em requisito informal.</p>
`.trim()
  },

  "inteligencia-emocional-entrevista": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Em entrevista, inteligência emocional não é sorrir o tempo todo nem aceitar desrespeito. É perceber a própria reação, escutar a pergunta, escolher uma resposta profissional e estabelecer limite quando necessário.</p>
<h2>Prepare fatos antes de treinar a calma</h2>
<p>Selecione três situações verdadeiras: conflito de prioridade, erro corrigido e atendimento difícil. Para cada uma, anote contexto, sua responsabilidade, ação e resultado. Se o resultado não tiver número, descreva uma mudança observável: pedido entregue, registro corrigido, cliente encaminhado ou prazo renegociado.</p>
<p>O curso oficial <a href="https://www.escolavirtual.gov.br/curso/318" target="_blank" rel="noopener noreferrer">Inteligência Emocional</a>, da Escola Virtual de Governo, aborda gestão das próprias emoções e relações interpessoais. O conceito pode orientar preparação, mas não existe frase mágica que prove maturidade; a evidência está em como você relata decisões e limites.</p>
<h2>Use uma pausa com propósito</h2>
<p>Quando a pergunta surpreender, respire e confirme o foco: “Você gostaria de um exemplo de conflito com colega ou de pressão de prazo?” Essa pausa organiza a resposta e evita atacar alguém. Se não souber, diga o limite e explique como buscaria a informação. Inventar procedimento técnico para parecer calmo é mais arriscado que admitir a dúvida.</p>
<p>Exemplo hipotético: “Dois pedidos chegaram com o mesmo prazo. Confirmei com a supervisão qual impactava o cliente naquele turno, avisei a outra área e registrei a nova entrega. Ambos foram concluídos na ordem acordada.” O exemplo mostra ação; “sou equilibrado sob qualquer pressão” é apenas adjetivo.</p>
<h2>Responda ao conflito sem julgar pessoas</h2>
<p>Descreva comportamento e impacto, não personalidade. Troque “meu colega era irresponsável” por “a conferência não foi feita no horário combinado, então sinalizei a pendência e propus dupla checagem”. Conte também o que você faria diferente. A entrevista não é lugar para expor nome, diagnóstico, dado de cliente ou conversa privada.</p>
<h2>Na dinâmica, contribua sem dominar</h2>
<ul><li>confirme objetivo e tempo;</li><li>apresente uma ideia de cada vez;</li><li>convide quem ainda não falou;</li><li>registre decisão e divergência;</li><li>não se aproprie da proposta de outra pessoa;</li><li>se discordar, explique o critério usado.</li></ul>
<p>Falar menos pode ser adequado quando você está organizando informações ou ouvindo. A meta não é encenar liderança, mas ajudar o grupo a produzir uma resposta.</p>
<h2>Reconheça pergunta inadequada</h2>
<p>Você pode redirecionar pergunta pessoal para requisito da vaga: “Posso detalhar minha disponibilidade para a escala e viagens.” A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/combate_a_discriminacao" target="_blank" rel="noopener noreferrer">área de combate à discriminação do Ministério do Trabalho</a> reúne referências sobre práticas discriminatórias. Se houver humilhação, ameaça ou critério alheio à função, encerrar a conversa pode ser uma medida de proteção, não falta de controle emocional.</p>
<h2>Cuide do antes e do depois</h2>
<p>Planeje trajeto, água, documento e margem de chegada. Se o atraso acontecer, avise pelo canal oficial com estimativa real. Depois da entrevista, registre perguntas e respostas enquanto lembra, mas não publique acusação impulsiva nem exponha participantes. Se ocorreu fato grave, preserve evidências e procure canal adequado.</p>

<h2>Treine respostas para situações desconfortáveis</h2>
<p>Prepare frases que preservem a conversa sem aceitar premissa falsa. Para interrupção: “Posso concluir o passo que tomei e depois responder à próxima parte?” Para pergunta confusa: “Você pode esclarecer qual aspecto da situação gostaria de avaliar?” Para informação que não possui: “Não usei essa ferramenta; posso explicar a experiência mais próxima e como aprendo um processo novo.”</p>
<p>Essas frases não precisam ser decoradas palavra por palavra. O treino serve para reconhecer opções quando o corpo reage com pressa, silêncio ou vontade de se defender.</p>
<h2>Separe pressão legítima de desrespeito</h2>
<p>Pedir exemplo, prazo ou explicação de erro pode fazer parte da avaliação. Humilhação, ameaça, comentário discriminatório ou exigência de dado sem relação com a função são outra coisa. Você pode pedir que a pergunta seja conectada ao requisito, recusar exposição íntima ou encerrar a entrevista. Segurança e dignidade têm prioridade sobre a tentativa de parecer sempre disponível.</p>
<h2>Faça uma revisão que não transforme emoção em culpa</h2>
<ul>
  <li>Qual pergunta ficou clara somente depois?</li>
  <li>Em que momento você acelerou ou se perdeu?</li>
  <li>Qual fato deveria ter aparecido antes?</li>
  <li>Houve condição da vaga que precisa ser confirmada?</li>
  <li>O contato e o local eram verificáveis?</li>
</ul>
<p>Escolha um ajuste para o próximo treino. Pode ser reduzir a resposta, preparar um exemplo ou formular uma pergunta sobre escala. Nervosismo persistente não se resolve com cobrança; se o sofrimento ultrapassa a entrevista e interfere na rotina, buscar apoio profissional pode ser mais adequado que aumentar a quantidade de simulações.</p>
<p>Nervosismo não invalida competência. Você pode pedir alguns segundos, beber água e retomar. A melhor preparação combina histórias verdadeiras, escuta e limite — não a obrigação de parecer imperturbável.</p>
    `.trim()
  },

  "linkedin-emprego-sao-luis-perfil": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Um perfil do LinkedIn pode complementar o currículo, mas não é obrigatório para toda vaga e não substitui o canal indicado no anúncio. Atualize apenas informações que consegue comprovar e decida conscientemente o que ficará público.</p>
<h2>Defina o cargo-alvo antes do título</h2>
<p>Use a nomenclatura encontrada em anúncios compatíveis e confirme o significado na <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo/pagina-inicial/" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a>. A CBO ajuda a identificar ocupações, mas não regulamenta profissão nem prova que há vaga aberta. Um título possível é “Auxiliar administrativo | cadastro, atendimento e conferência de documentos”, desde que essas tarefas façam parte da sua experiência.</p>
<p>Evite “em busca de oportunidades” como única informação. Localização e preferência de trabalho devem refletir sua disponibilidade real; não prometa mudança ou turno que não consegue cumprir.</p>
<h2>Escreva o resumo em três blocos</h2>
<ol><li>função ou área desejada;</li><li>duas ou três tarefas que sabe executar;</li><li>tipo de oportunidade e cidade compatíveis.</li></ol>
<p>Exemplo: “Atuo com atendimento e organização de documentos. Já registrei pedidos, conferi dados e acompanhei pendências em planilhas. Busco funções administrativas presenciais ou híbridas em São Luís, conforme a escala informada.” Não inclua salário, documento, endereço completo ou justificativa íntima.</p>
<h2>Converta experiências em evidência</h2>
<p>Em cada trabalho, projeto ou atividade voluntária, informe contexto, tarefa e resultado observável. “Organizei arquivos digitais por cliente e data, reduzindo a procura manual da equipe” é melhor que copiar palavras-chave. Se não mediu redução, retire a promessa e descreva o processo. Curso em andamento precisa aparecer como em andamento.</p>
<p>O próprio LinkedIn explica que <a href="https://www.linkedin.com/help/linkedin/answer/a512279/" target="_blank" rel="noopener noreferrer">recomendações de vagas usam informações do perfil</a>, como título, resumo, experiência, educação e preferências. Isso não garante visibilidade nem contratação; serve para entender por que informação imprecisa também piora as recomendações recebidas.</p>
<h2>Configure alertas sem criar ruído</h2>
<p>Crie poucos alertas com cargo, localização e modalidade realistas. Compare o anúncio no site da empresa quando possível e registre candidatura. O guia oficial <a href="https://www.linkedin.com/help/linkedin/answer/a6208092" target="_blank" rel="noopener noreferrer">Primeiros passos no LinkedIn</a> reúne recursos de perfil e alertas. Desative alertas que só repetem funções incompatíveis, em vez de abrir todos por impulso.</p>
<h2>Revise privacidade e segurança</h2>
<p>Não publique telefone pessoal em seção aberta se o contato pela plataforma ou e-mail profissional for suficiente. Ative verificação em duas etapas, revise sessões e desconfie de recrutador que migra imediatamente para número desconhecido, pede pagamento ou envia arquivo inesperado. O <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">fascículo de Redes Sociais do CERT.br</a> orienta sobre exposição, perfis falsos e configurações de privacidade.</p>
<h2>Faça uma conferência cruzada</h2>
<ul><li>datas e cargos iguais aos do currículo;</li><li>nome usado profissionalmente consistente;</li><li>links funcionando;</li><li>experiências sem informação confidencial;</li><li>competências demonstradas no texto;</li><li>preferências de localização atualizadas.</li></ul>

<h2>Revise o perfil como uma sequência de respostas</h2>
<p>Quem abre o perfil precisa entender, sem adivinhar: qual função você procura, onde pode trabalhar, quais tarefas já executou e como essas experiências se conectam. O título apresenta o alvo; o resumo explica a proposta; as experiências mostram evidências; cursos e competências complementam o que é verificável.</p>
<ul>
  <li><strong>Título:</strong> cargo e duas tarefas reais, sem promessa de senioridade inexistente.</li>
  <li><strong>Sobre:</strong> contexto profissional, exemplos e disponibilidade relevante.</li>
  <li><strong>Experiência:</strong> datas coerentes, função, tarefas e limites de responsabilidade.</li>
  <li><strong>Formação:</strong> situação correta do curso e instituição identificável.</li>
  <li><strong>Competências:</strong> apenas ferramentas e atividades que consegue explicar.</li>
</ul>
<h2>Faça uma busca local sem afirmar que há contratação</h2>
<p>Teste o cargo com São Luís e, separadamente, municípios que realmente consegue alcançar. Leia a localização completa, porque a menção ao Maranhão no perfil da empresa não prova que a unidade da vaga seja na capital. Para trabalho remoto ou híbrido, confira onde a pessoa contratada deve residir e quantos encontros presenciais foram informados.</p>
<p>Salve o anúncio, não apenas a página da empresa. Antes de adaptar o perfil, confirme se a oportunidade continua aberta e se o botão leva ao domínio esperado. A rede pode ajudar a descobrir o processo, mas a decisão de enviar deve usar a descrição completa.</p>
<h2>Verifique convites de recrutadores sem transferir confiança</h2>
<p>Compare nome, vínculo declarado, histórico do perfil, domínio do e-mail e existência da vaga em canal institucional. Um perfil com foto e conexões não substitui essa conferência. Não instale programa de acesso remoto, não envie código de autenticação e não faça pagamento para marcar entrevista. Se o contato legítimo pedir mudança de canal, registre a vaga e confirme o endereço por fonte independente.</p>
<p>Foto, capa e publicações são opcionais; não invente rotina de conteúdo para “alimentar algoritmo”. Um perfil simples, coerente e seguro é mais útil que atividade diária genérica. Candidate-se sempre pelo canal oficial da vaga e trate convite recebido na rede como início de verificação, não como contratação.</p>
    `.trim()
  },

  "marca-pessoal-candidatura-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Marca pessoal para candidatura não exige logotipo, ensaio fotográfico ou postagem diária. É a coerência entre o que você diz que faz, as evidências apresentadas e a forma como mantém contato.</p>
<h2>Comece por uma frase verificável</h2>
<p>Complete: “Posso ajudar uma equipe de ___ executando ___ e ___.” Um candidato a estoque pode citar recebimento, separação e conferência se realmente fez essas tarefas. Um candidato a atendimento pode mencionar registro de pedidos e encaminhamento de dúvidas. Troque adjetivos vagos por atividades.</p>
<p>Consulte anúncios atuais e a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo/pagina-inicial/" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> para entender nomes e conteúdos de ocupações. A CBO é classificatória: não use o código como certificado de competência nem como prova de que uma profissão é regulamentada.</p>
<h2>Monte um conjunto mínimo de apresentação</h2>
<ul><li>currículo-base sem dados excessivos;</li><li>versão adaptada ao cargo;</li><li>e-mail com nome reconhecível;</li><li>mensagem curta de candidatura;</li><li>até três exemplos de trabalho, quando a função permite;</li><li>registro das vagas e versões enviadas.</li></ul>
<p>Os exemplos podem ser planilha fictícia sem dados de terceiros, foto de peça produzida com autorização, certificado verificável ou breve descrição de projeto. Nunca publique material de cliente, tela interna, uniforme com informação sensível ou documento da empresa para provar experiência.</p>
<h2>Alinhe seus pontos de contato</h2>
<p>Use o mesmo nome profissional no currículo, e-mail e perfil. Confira mensagem da caixa postal e foto do aplicativo usado com recrutadores. Isso não significa apagar identidade, crença ou vida pessoal; significa escolher o que pertence ao canal profissional. Não forneça endereço completo, CPF ou documento na apresentação pública.</p>
<p>O <a href="https://cartilha.cert.br/dicas-rapidas/" target="_blank" rel="noopener noreferrer">CERT.br</a> recomenda pensar antes de publicar e usar configurações de privacidade. Revise o que está aberto, mas não tente criar uma biografia artificial. Se alguém pedir senha, código de verificação ou pagamento, interrompa o contato.</p>
<h2>Demonstre consistência sem virar influenciador</h2>
<p>Você não precisa produzir conteúdo. Pode manter o perfil atualizado, comentar apenas quando tem algo útil e enviar materiais diretamente na candidatura. Se decidir publicar, descreva aprendizado ou projeto sem copiar texto de terceiros. Uma atualização mensal verdadeira vale mais que frases motivacionais diárias que não mostram trabalho.</p>
<h2>Teste a mensagem em uma vaga real</h2>
<p>Escolha um anúncio compatível e marque cada requisito como: comprovado, parcialmente comprovado ou ausente. Ajuste o currículo para destacar evidências verdadeiras; não adicione ferramenta só porque aparece na vaga. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> é um canal público para consulta e candidatura, além dos sites institucionais das empresas.</p>
<h2>Evite custos sem problema definido</h2>
<p>Antes de pagar foto, curso, domínio ou consultoria, escreva qual lacuna pretende resolver e qual evidência mostrará melhora. Muitas vezes basta corrigir contato, simplificar o PDF ou preparar exemplos. Nenhum serviço legítimo pode prometer contratação.</p>

<h2>Monte uma relação entre afirmação e prova</h2>
<p>Para cada frase de apresentação, anote uma evidência que poderia explicar em entrevista. “Organização de estoque” pode apontar para conferência de entrada, separação por pedido ou inventário realizado. “Atendimento” pode apontar para registro de solicitação, orientação ao cliente ou encaminhamento de problema. Se não houver exemplo, retire ou reformule a afirmação.</p>
<p>Essa relação também mostra lacunas. Se a vaga pede planilha e você só conhece o conceito, apresente o curso ou exercício como aprendizado, não como domínio profissional. A coerência vale mais que uma lista longa de competências.</p>
<h2>Escolha provas adequadas ao tipo de trabalho</h2>
<ul>
  <li><strong>Administrativo:</strong> planilha fictícia, organização de agenda ou modelo de controle sem dados reais.</li>
  <li><strong>Estoque e logística:</strong> descrição de rotina, checklist criado ou resultado que consiga contextualizar.</li>
  <li><strong>Atendimento:</strong> exemplo escrito de resposta, fluxo de encaminhamento ou situação resolvida sem identificar cliente.</li>
  <li><strong>Função criativa:</strong> portfólio autorizado, com sua participação explicada.</li>
</ul>
<p>Não há obrigação de produzir portfólio quando a função não pede. O material existe para esclarecer competência, não para expor documentos ou criar uma aparência sofisticada sem conteúdo.</p>
<h2>Faça uma auditoria de consistência antes do envio</h2>
<p>Compare currículo, perfil, mensagem e portfólio. Datas, cargos e formação precisam contar a mesma história. O e-mail deve funcionar; o telefone deve receber contato; links precisam abrir sem pedir acesso privado. Se usa uma versão curta do nome, mantenha-a reconhecível nos canais. Corrija divergência factual antes de investir em nova identidade visual.</p>
<p>Revise o conjunto a cada mudança real de experiência ou cargo-alvo. Marca pessoal útil é a repetição coerente de fatos: mesma trajetória, exemplos compreensíveis e contato seguro. Ela não substitui qualificação, processo seletivo ou disponibilidade para a vaga.</p>
    `.trim()
  },

  "mudanca-de-carreira-sao-luis-curriculo": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Mudar de carreira não exige apagar empregos anteriores. O currículo precisa mostrar a ponte entre o que você já fez, as tarefas da área nova e as evidências que ainda está construindo.</p>
<h2>Defina a transição em termos de trabalho</h2>
<p>Escolha um ou dois cargos-alvo e reúna anúncios verdadeiros. Liste tarefas recorrentes, ferramentas, formação exigida e condições. A <a href="https://www.gov.br/pt-br/servicos/consultar-quadro-brasileiro-de-qualificacoes" target="_blank" rel="noopener noreferrer">consulta ao Quadro Brasileiro de Qualificações</a> ajuda a mapear conhecimentos, habilidades e atitudes relacionados às ocupações da CBO. Use a descrição como referência, não como promessa de vaga.</p>
<p>Exemplo: quem trabalhou no comércio e busca apoio administrativo pode ter evidência de atendimento, conferência, registro, organização e fechamento. Isso não prova domínio de sistema contábil; a lacuna deve permanecer visível até existir aprendizado real.</p>
<h2>Crie uma matriz de ponte</h2>
<table><thead><tr><th>Requisito do anúncio</th><th>Evidência atual</th><th>Lacuna</th><th>Próxima ação</th></tr></thead><tbody><tr><td>planilha básica</td><td>controle de pedidos</td><td>fórmulas simples</td><td>exercício próprio</td></tr><tr><td>atendimento</td><td>balcão e telefone</td><td>vocabulário do setor</td><td>ler procedimentos públicos</td></tr><tr><td>arquivo digital</td><td>documentos físicos</td><td>nomeação e pastas</td><td>projeto demonstrativo</td></tr></tbody></table>
<p>Preencha com sua realidade. Não crie resultado, cliente ou emprego “ponte” que não existiu. Curso entra somente quando responde a uma lacuna concreta e pode ser concluído dentro dos seus recursos.</p>
<h2>Reescreva o topo do currículo</h2>
<p>No objetivo, informe o cargo novo. No resumo, combine experiência transferível e direção atual: “Profissional de atendimento com experiência em registro de pedidos e conferência de caixa, em transição para apoio administrativo. Prática recente com organização de arquivos digitais e planilhas básicas.” Retire “especialista” se a experiência ainda é inicial.</p>
<p>Mantenha os empregos anteriores com datas e fatos. Reduza tarefas distantes do alvo, mas preserve entregas que mostram responsabilidade. Curso em andamento deve trazer situação e instituição; projeto de estudo deve ser identificado como projeto.</p>
<h2>Construa uma evidência pequena</h2>
<p>Para área administrativa, crie uma planilha fictícia sem dados reais e documente conferências. Para comunicação, produza um texto com briefing próprio e revisão. Para suporte, registre um roteiro de diagnóstico em ambiente de teste. O objetivo é demonstrar método, não fingir experiência comercial.</p>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> permite consultar oportunidades compatíveis com o cadastro. Compare também sites de empresas e outros canais identificáveis; nenhuma fonte isolada representa todo o mercado de São Luís.</p>
<h2>Explique a mudança sem rejeitar o passado</h2>
<p>Estrutura de entrevista: motivo profissional, habilidade transferível, ação de preparação e limite atual. “Quero migrar do atendimento para rotinas administrativas porque já trabalho com registro e conferência. Estou praticando planilhas e arquivo digital; ainda não usei o sistema da empresa e precisarei do treinamento previsto.”</p>
<p>Não prometa aceitar qualquer salário ou horário. Calcule deslocamento, renda mínima e responsabilidades antes de escolher uma vaga de entrada. Transição pode ser gradual; um cargo ponte só é útil quando suas condições são sustentáveis.</p>
<h2>Revise com evidência, não ansiedade</h2>
<p>A cada duas semanas, compare vagas lidas, requisitos compatíveis, candidaturas e retornos. Se a maioria exige algo ausente, decida entre aprender, mudar o cargo-alvo ou buscar função adjacente. Não compre curso novo apenas porque uma candidatura ficou sem resposta.</p>
<p>O currículo de transição precisa ser honesto sobre o presente e claro sobre a direção. A trajetória anterior oferece evidências; o plano de aprendizagem cobre lacunas; a contratação continua dependendo de oportunidade e seleção externas.</p>
    
<h2>Organize um ciclo de transição de duas semanas</h2>
<p>Na primeira semana, leia anúncios e selecione tarefas recorrentes; na segunda, produza uma evidência pequena e adapte o currículo para um cargo-alvo. Registre o que conseguiu demonstrar e o que permanece como lacuna. Ao final, decida entre repetir o ciclo, ajustar o cargo ou buscar uma função adjacente. Essa sequência evita comprar vários cursos antes de saber qual problema precisa resolver.</p>
<p>Exemplo hipotético: alguém de vendas quer migrar para compras. Os anúncios repetem cotação, conferência e planilha. A pessoa já compara preços e registra pedidos, mas não conduziu negociação com fornecedores. O currículo pode destacar comparação e registro; a negociação continua como lacuna. Um exercício fictício de cotação deve ser identificado como projeto, não como experiência de empresa.</p>
<h2>Compare a oportunidade com sua rotina em São Luís</h2>
<p>Transição frequentemente começa em cargo inicial ou adjacente, mas isso não obriga aceitar condição inviável. Confirme unidade, escala, remuneração informada e custos do trajeto. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com valores atuais fornecidos por você. Não presuma trabalho remoto, promoção rápida ou transferência futura.</p>
<h2>Ordene o currículo para explicar a ponte</h2>
<p>Depois do objetivo e do resumo, escolha a ordem que melhor prova o cargo-alvo: experiência relevante, projeto, curso concluído ou formação. Não esconda datas nem misture projeto com emprego. Cada item deve responder a pelo menos uma pergunta: o que você fez, em qual contexto, com qual ferramenta e qual resultado observável.</p>
<p>Na entrevista, use a mesma lógica do documento. Explique por que a nova área faz sentido, qual experiência se transfere, o que você já praticou e qual limite ainda existe. Coerência entre currículo e fala vale mais que palavras de tendência copiadas do anúncio.</p>
`.trim()
  },

  "networking-emprego-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Networking não é pedir emprego a toda pessoa conhecida. É manter relações profissionais, trocar informação verificável e fazer pedidos que o contato consegue entender, aceitar ou recusar sem constrangimento.</p>
<h2>Mapeie relações reais</h2>
<p>Comece por ex-colegas, professores, fornecedores, clientes com contato autorizado e pessoas de cursos ou projetos. Registre de onde você conhece cada pessoa e qual assunto profissional compartilham. Não importe agenda inteira para plataforma, adicione desconhecidos em massa nem use grupo alheio para propaganda.</p>
<p>O <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">CERT.br</a> orienta sobre exposição em redes sociais, perfis falsos e privacidade. Antes de responder a um novo contato, confirme identidade, vínculo com a empresa e domínio do link enviado.</p>
<h2>Faça um pedido específico</h2>
<p>Explique o cargo-alvo, a cidade, o tipo de ajuda e o limite. Exemplo: “Oi, Marcos. Trabalhamos juntos no atendimento da loja X. Estou buscando vagas de auxiliar administrativo em São Luís e atualizei meu currículo com experiência em cadastro e conferência. Se você souber de processo pelo canal oficial, poderia me enviar o link? Não precisa encaminhar meus dados sem me avisar.”</p>
<p>Outro pedido possível é informação: “Você atua em logística. Posso fazer duas perguntas sobre as tarefas de entrada e os conhecimentos mais usados?” Não peça informação confidencial, nome de candidato ou acesso a sistema.</p>
<h2>Prepare material fácil de encaminhar</h2>
<ul><li>uma frase de objetivo;</li><li>currículo em PDF legível;</li><li>e-mail profissional;</li><li>link de portfólio, se relevante;</li><li>disponibilidade verdadeira;</li><li>canal oficial para a vaga, quando já existe.</li></ul>
<p>Não envie CPF, RG, endereço completo, dado bancário ou certificado que não foi solicitado. Se o contato oferecer “garantia” em troca de dinheiro, interrompa. Indicação legítima não elimina a verificação da empresa e do anúncio.</p>
<h2>Converta informação em candidatura</h2>
<p>Ao receber um link, leia requisitos e candidate-se pelo canal indicado. Agradeça sem atribuir responsabilidade pelo resultado. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> é uma alternativa pública; páginas institucionais de empresas também ajudam a verificar processos.</p>
<p>Registre quem enviou a oportunidade e só mencione indicação se a pessoa autorizou. Escrever “fulano me indicou” sem consentimento pode expor o contato e não comprova vínculo.</p>
<h2>Ofereça reciprocidade sem moeda de troca</h2>
<p>Compartilhe edital público, curso oficial ou anúncio verificável que combine com o perfil da pessoa. Revise um currículo se você tiver disponibilidade e conhecimento. Não espere que cada ajuda retorne como vaga. Relação profissional se sustenta por respeito e atualização honesta, não contabilidade de favores.</p>
<h2>Acompanhe sem insistência</h2>
<p>Se alguém pediu seu currículo, confirme o envio uma vez. Se não respondeu, não cobre toda semana. Volte a conversar quando houver atualização real: curso concluído, mudança de alvo ou vaga específica. Respeite “não posso ajudar” e não adicione familiares do contato para contornar a resposta.</p>

<h2>Use um registro mínimo para respeitar o contexto</h2>
<p>Anote nome, origem do contato, assunto, data da última conversa e se a pessoa autorizou receber currículo. O registro evita mensagens repetidas e pedidos desconectados da relação. Não armazene dados pessoais além do necessário nem compartilhe essa lista.</p>
<p>Se a pessoa pediu material, envie uma versão compatível e identifique a vaga ou área. Se não houve convite, prefira uma pergunta curta. Um único retorno educado pode confirmar o recebimento; insistência ou mensagens em canais pessoais diferentes não aumentam a qualidade da relação.</p>
<h2>Participe de grupos e eventos com verificação</h2>
<p>Em grupo profissional, leia regras antes de publicar e confirme a origem de anúncios. Um logotipo, nome de empresa ou encaminhamento por conhecido não prova autenticidade. Abra o domínio oficial, compare o cargo e procure contato institucional. Em evento, explique seu objetivo sem pressionar a pessoa a decidir naquele momento.</p>
<p>Quando receber cartão, perfil ou e-mail, registre de onde veio. Ao escrever depois, mencione o contexto: “Conversamos na atividade sobre logística e você autorizou o envio do meu currículo.” Essa identificação ajuda o contato a entender a mensagem e permite que recuse sem constrangimento.</p>
<h2>Diferencie três tipos de conversa</h2>
<ul>
  <li><strong>Informação:</strong> perguntar sobre rotina, ferramentas ou canal público.</li>
  <li><strong>Apresentação:</strong> explicar brevemente o que busca e o que já fez.</li>
  <li><strong>Indicação:</strong> enviar material somente quando houver consentimento e vaga compatível.</li>
</ul>
<p>Não pule da apresentação para uma cobrança por indicação. Se a informação recebida não combina com seu perfil, agradeça e não force candidatura. Networking responsável também significa recusar anúncio duvidoso e proteger o contato de exposição.</p>
<p>Networking útil amplia acesso a informação, mas não garante seleção. Continue consultando canais abertos, adapte o currículo e preserve a autonomia de quem ajuda. O melhor pedido é curto, verificável e fácil de recusar.</p>
    `.trim()
  },

  "o-que-vestir-entrevista-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> A roupa da entrevista deve permitir que você chegue com segurança, participe da conversa e, se houver teste autorizado, execute a atividade prevista. Ela não substitui competência nem deve exigir gasto que comprometa sua renda.</p>
<h2>Descubra o contexto antes de escolher</h2>
<p>Confirme endereço, formato, duração e se haverá visita ou teste prático. Leia o anúncio e a página oficial da empresa para entender o ambiente, sem tentar imitar fotografias de campanha. Se a seleção não informa traje, uma pergunta objetiva é válida: “Haverá acesso à área operacional ou alguma orientação de vestimenta?”</p>
<p>Consulte a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo/pagina-inicial/" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> para conhecer conteúdos gerais da função, lembrando que a CBO é classificatória e não define o uniforme de uma empresa. Regras de segurança e treinamento devem vir do responsável pelo local.</p>
<h2>Priorize limpeza, ajuste e movimento</h2>
<p>Escolha peças limpas, íntegras e confortáveis para sentar, caminhar e esperar. Não existe cor universal de aprovação. Em São Luís, planeje o calor e o trajeto: tecido respirável e uma opção leve para ambiente climatizado podem evitar desconforto. Leve a peça protegida se parte do percurso puder sujá-la.</p>
<p>Calçado precisa ser seguro para o deslocamento. Não use equipamento de proteção improvisado. Se o processo inclui cozinha, oficina, estoque ou obra, pergunte se a empresa fornecerá EPI e instrução; não entre em área de risco só para demonstrar disposição.</p>
<h2>Ajuste ao tipo de encontro</h2>
<ul><li><strong>escritório ou atendimento:</strong> roupa simples e organizada, compatível com mobilidade;</li><li><strong>varejo:</strong> considere tempo em pé e regras informadas pela loja;</li><li><strong>área operacional:</strong> confirme segurança, acessórios e teste prático;</li><li><strong>vídeo:</strong> teste enquadramento, luz e áudio; vista-se como se pudesse levantar;</li><li><strong>dinâmica externa:</strong> peça detalhes do local, duração e esforço.</li></ul>
<p>Perfume forte pode incomodar em sala pequena; acessórios que prendem em equipamento podem ser inseguros. Essas são decisões funcionais, não julgamento sobre estilo pessoal.</p>
<h2>Não aceite mito discriminatório como regra</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l9029.htm" target="_blank" rel="noopener noreferrer">Lei nº 9.029/1995</a> proíbe práticas discriminatórias e limitativas no acesso e manutenção da relação de trabalho pelos motivos previstos no texto legal. Orientação sobre roupa não autoriza pergunta invasiva, humilhação ou critério sem relação com a função.</p>
<p>Se a empresa impõe requisito específico, pergunte a finalidade e como ele se relaciona à atividade. Registre anúncio ou mensagem problemática e procure orientação do Ministério do Trabalho, sindicato ou profissional jurídico quando necessário.</p>
<h2>Resolva o que tem sem comprar por impulso</h2>
<p>Separe duas combinações na véspera, experimente sentado e em movimento, confira botões e organize pequenos reparos. Empréstimo pode ser opção se não criar desconforto. Não compre terno, sapato ou maquiagem por promessa de contratação; nenhum item garante resultado.</p>
<h2>Checklist do dia</h2>
<ul><li>roupa adequada ao trajeto e ao local confirmado;</li><li>documentos e currículo apenas quando solicitados;</li><li>água e margem de chegada;</li><li>contato oficial da seleção;</li><li>alternativa simples para chuva ou climatização;</li><li>nenhum dado sensível visível em crachá antigo ou pasta.</li></ul>
<p>O objetivo é reduzir distrações e riscos para que a conversa trate da sua experiência. Se a seleção valoriza aparência acima das tarefas ou pede gasto prévio não explicado, verifique a legitimidade antes de continuar.</p>
    
<h2>Monte a escolha a partir das atividades previstas</h2>
<p>Para entrevista apenas conversada, a prioridade é chegar limpo, confortável e com mobilidade. Para visita a área operacional, confirme previamente restrições de calçado, acessórios e cabelo. Para teste que envolva alimento, máquina, altura ou produto químico, a empresa deve informar condições e segurança; roupa comum escolhida pelo candidato não substitui treinamento nem equipamento adequado.</p>
<p>Faça um teste doméstico: sente, caminhe, levante os braços e carregue a pasta que usará. Verifique transparência sob luz, etiqueta que incomoda, peça que exige ajuste constante e calçado que machuca. O problema a resolver é funcional. Marcas, preço e formalidade excessiva não demonstram competência.</p>
<h2>Considere acessibilidade e necessidade pessoal</h2>
<p>Órtese, calçado adaptado, apoio de mobilidade, cobertura religiosa e outras necessidades não devem ser escondidos para caber em um modelo genérico de “aparência profissional”. Se o local exige acesso específico, peça orientação de entrada ou acomodação pelo canal responsável. A página do Ministério do Trabalho sobre <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/combate_a_discriminacao" target="_blank" rel="noopener noreferrer">combate à discriminação</a> reúne diretrizes de proteção no acesso e na manutenção do trabalho.</p>
<h2>Prepare uma alternativa sem transformar isso em compra</h2>
<p>Separe a roupa, confira previsão e transporte e leve somente o necessário. Uma camiseta ou camisa reserva pode ser útil quando o trajeto é longo; um saco simples protege a peça de chuva ou sujeira. Se algo falhar no dia, priorize chegar com segurança e comunicar eventual atraso. Não aceite oferta de “kit obrigatório”, curso de etiqueta ou produto vendido pelo próprio contato como condição para participar da seleção.</p>
`.trim()
  },

  "pedir-feedback-entrevista-emprego": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Pedir feedback depois de um processo seletivo é solicitar informação que ajude a melhorar uma candidatura futura. Não é exigir justificativa, reabrir uma decisão nem pressionar alguém a revelar critérios internos.</p>
<h2>Escolha o momento e o canal</h2>
<p>Se a empresa informou uma data para o resultado, espere esse prazo terminar. Quando a resposta já confirmou que você não seguirá, agradeça primeiro e faça uma pergunta curta na mesma conversa. Se houve silêncio, use o guia de <a href="/blog/follow-up-apos-entrevista-mensagem">follow-up</a> antes de pedir avaliação.</p>
<p>O LinkedIn informa que algumas empresas podem enviar <a href="https://www.linkedin.com/help/linkedin/answer/a516878" target="_blank" rel="noopener noreferrer">atualizações sobre candidaturas</a> quando analisam o perfil ou o currículo. Isso depende da ferramenta e da decisão do recrutador; ausência de notificação não prova que ninguém leu seu material.</p>
<h2>Faça uma pergunta que possa ser respondida</h2>
<p>Modelo: “Obrigado pelo retorno e pela oportunidade de conversar sobre a vaga de auxiliar administrativo. Se for possível, você poderia indicar um ponto da minha apresentação ou experiência que eu deveria desenvolver para processos semelhantes? Entendo caso a empresa não forneça feedback individual.”</p>
<p>Outra opção é limitar a pergunta: “Minha experiência ficou clara para as tarefas da vaga?” ou “Houve requisito técnico que eu não consegui demonstrar?” Evite “por que escolheram outra pessoa?”, porque isso pede comparação com dados de terceiros.</p>
<h2>Separe resposta útil de opinião solta</h2>
<ul><li><strong>fato observável:</strong> faltou exemplo, documento, experiência ou resposta a uma pergunta;</li><li><strong>critério da vaga:</strong> disponibilidade, ferramenta, formação ou rotina necessária;</li><li><strong>preferência vaga:</strong> “não combinou com o perfil”, sem exemplo;</li><li><strong>comentário inadequado:</strong> observação invasiva ou sem relação com o trabalho.</li></ul>
<p>Registre as palavras exatas e não complete lacunas com suposição. Um retorno específico pode gerar uma ação; uma frase genérica não deve levar você a reconstruir todo o currículo.</p>
<h2>Transforme um ponto em teste pequeno</h2>
<p>Se disseram que faltou exemplo, prepare duas situações verdadeiras com contexto, ação e resultado. Se a lacuna foi planilha, confirme qual recurso era necessário antes de comprar curso. Se foi disponibilidade incompatível, ajuste os filtros de busca; não prometa um turno que não consegue cumprir.</p>
<p>Exemplo hipotético: o recrutador informou que a resposta sobre atendimento ficou abstrata. Em vez de decorar adjetivos, o candidato prepara um caso real: recebeu uma reclamação, confirmou o pedido, registrou a pendência e encaminhou ao responsável. O aprendizado é demonstrar processo, não inventar resultado.</p>
<h2>Proteja a relação e seus dados</h2>
<p>Não envie documento, pagamento ou informação bancária para “receber o feedback”. Use o canal oficial já validado. Não publique nome do entrevistador, print privado ou áudio da conversa. Se o retorno contiver humilhação ou possível discriminação, guarde o registro e procure orientação adequada em vez de discutir em rede social.</p>
<h2>Feche o contato sem insistência</h2>
<p>Agradeça mesmo quando a empresa disser que não fornece avaliação individual. Uma solicitação é suficiente. O próprio LinkedIn explica <a href="https://www.linkedin.com/help/linkedin/answer/a508716" target="_blank" rel="noopener noreferrer">o que acontece depois de uma candidatura</a> na plataforma, mas cada organização mantém seu processo e seus prazos.</p>
<p>Feedback ajuda quando aponta uma ação verificável. Ele não define seu valor profissional e não substitui a comparação entre o anúncio, as evidências do currículo e a resposta apresentada na entrevista.</p>
    
<h2>Registre o feedback sem reescrever a fala</h2>
<p>Anote a frase recebida, a etapa do processo e o exemplo que você apresentou. Depois separe três campos: fato mencionado, interpretação possível e ação sob seu controle. Se a resposta foi “faltou experiência com atendimento”, o fato é a frase; você ainda precisa confirmar qual atividade era essencial antes de concluir que toda a sua experiência foi insuficiente.</p>
<p>Não transforme um comentário isolado em diagnóstico definitivo. Compare-o com o anúncio e com outros processos semelhantes. Feedback sobre uma ferramenta específica pode indicar estudo ou prática; comentário sobre disponibilidade pode exigir filtro melhor; opinião genérica sem exemplo pode não produzir ação segura.</p>
<h2>Saiba quando não pedir</h2>
<ul><li>o anúncio informa que não haverá retorno individual;</li><li>você não participou de entrevista ou etapa avaliativa;</li><li>o único contato é um endereço automático sem resposta;</li><li>a empresa já respondeu à mesma pergunta;</li><li>o canal ou a identidade do remetente não estão confirmados.</li></ul>
<p>Nesses casos, faça autoavaliação usando o anúncio, o currículo enviado e suas anotações. Pedir feedback não deve exigir contornar bloqueio, localizar perfil pessoal ou expor a conversa em comentário público.</p>
<h2>Converta a resposta em uma mudança verificável</h2>
<p>Escolha uma única ação e um prazo curto. “Mostrar melhor a organização” pode virar preparar um exemplo real com situação, tarefa, ação e resultado. “Melhorar o currículo” precisa indicar campo, como título do cargo ou descrição de uma tarefa. Teste a alteração em vagas compatíveis e mantenha as informações verdadeiras em todas as versões.</p>
<h2>Reconheça limite, discriminação e conflito</h2>
<p>Feedback profissional deve tratar de requisitos, evidências ou comportamento relacionado ao processo. Comentário sobre característica pessoal sem relação com a função, humilhação ou pergunta invasiva não precisa ser aceito como orientação de carreira. Preserve o registro e consulte os canais adequados. A página do Ministério do Trabalho sobre <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/combate_a_discriminacao" target="_blank" rel="noopener noreferrer">combate à discriminação</a> reúne referências e diretrizes para o tema.</p>
`.trim()
  },

  "plano-semanal-vagas-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Um plano semanal de busca de emprego deve caber na rotina e produzir candidaturas rastreáveis. Não existe número obrigatório de envios: qualidade, compatibilidade e prazo do anúncio importam mais que uma meta usada para gerar culpa.</p>
<h2>Defina três resultados para a semana</h2>
<ol><li>vagas compatíveis lidas até o fim;</li><li>currículos adaptados e enviados pelo canal correto;</li><li>uma melhoria concreta em currículo, entrevista ou qualificação.</li></ol>
<p>Escolha quantidades possíveis para sua disponibilidade. Quem trabalha, estuda ou cuida de outra pessoa pode usar blocos menores. Uma semana com duas candidaturas fortes pode ser melhor que vinte envios para funções incompatíveis.</p>
<h2>Monte uma tabela simples</h2>
<p>Use as colunas: empresa, cargo, cidade, fonte, prazo, requisitos essenciais, versão do currículo, data do envio, canal e próxima ação. O <a href="https://www.linkedin.com/help/linkedin/answer/a8684146" target="_blank" rel="noopener noreferrer">rastreador de oportunidades do LinkedIn</a> organiza vagas salvas e etapas; para candidaturas fora da plataforma, uma planilha própria pode cumprir a mesma função.</p>
<p>Não coloque CPF, RG, endereço completo, senha ou dado bancário nessa tabela. Guarde somente o necessário para acompanhar a seleção.</p>
<h2>Distribua o trabalho por tipo</h2>
<ul><li><strong>buscar:</strong> localizar canais oficiais e salvar anúncios;</li><li><strong>conferir:</strong> validar empresa, prazo, local e requisitos;</li><li><strong>adaptar:</strong> escolher evidências verdadeiras para a vaga;</li><li><strong>enviar:</strong> usar o canal indicado e registrar comprovante;</li><li><strong>preparar:</strong> treinar entrevista ou fechar uma lacuna real;</li><li><strong>encerrar:</strong> atualizar respostas e arquivar vagas vencidas.</li></ul>
<p>Você pode executar esses blocos em dias diferentes. Não deixe toda adaptação para o último minuto e não envie candidatura depois do prazo fingindo que não viu a data.</p>
<h2>Use São Luís como filtro prático</h2>
<p>Confirme se a vaga é em São Luís, na Região Metropolitana, remota ou em outra cidade. Calcule deslocamento e horário antes de enviar. “Disponibilidade total” não deve esconder limite de transporte, estudo ou cuidado familiar. Se o anúncio não informa o local, procure o canal oficial e peça esclarecimento sem fornecer documentos.</p>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> permite consultar e se candidatar a oportunidades conforme o cadastro. Combine fontes, mas mantenha um único registro para não duplicar envio.</p>
<h2>Revise o funil sem inventar diagnóstico</h2>
<p>No fim da semana, conte anúncios lidos, candidaturas compatíveis, convites e respostas. Pouco retorno em sete dias não prova que o currículo falhou. Observe várias semanas e procure padrões concretos: contatos incorretos, requisitos ausentes, vagas vencidas ou mensagens sem identificação do cargo.</p>
<p>A Escola Virtual de Governo oferece o curso <a href="https://www.escolavirtual.gov.br/curso/468" target="_blank" rel="noopener noreferrer">Produtividade e Gestão do Tempo</a>. Use técnicas de planejamento para reduzir retrabalho, não para transformar a busca em jornada sem descanso.</p>
<h2>Preserve um período sem candidatura</h2>

<h2>Exemplo de distribuição para não misturar as etapas</h2>
<p>Uma rotina possível é usar o primeiro bloco para localizar e salvar anúncios, o segundo para verificar empresa e requisitos, e o terceiro para adaptar e enviar. Em outro dia, revise respostas e prepare entrevista. Isso reduz o risco de enviar no impulso enquanto ainda está pesquisando.</p>
<ul>
  <li><strong>Início da semana:</strong> limpar vagas vencidas e escolher cargos prioritários.</li>
  <li><strong>Bloco de leitura:</strong> abrir anúncios completos e separar obrigatórios de desejáveis.</li>
  <li><strong>Bloco de candidatura:</strong> adaptar currículo, revisar contato e seguir o canal informado.</li>
  <li><strong>Bloco de preparação:</strong> estudar a empresa e reunir exemplos reais.</li>
  <li><strong>Fechamento:</strong> atualizar status, guardar comprovantes e decidir o foco seguinte.</li>
</ul>
<p>Os dias e quantidades são ajustáveis. O ponto é concluir uma etapa antes de iniciar outra, mantendo espaço para trabalho, estudo, cuidado e descanso.</p>
<h2>Evite duplicidade entre portais</h2>
<p>A mesma vaga pode aparecer em redes diferentes. Compare empresa, cargo, local, descrição e canal antes de enviar outra vez. Registre a URL de origem e, quando existir, o endereço oficial da candidatura. Se duas publicações parecem iguais, mas apresentam contatos ou condições diferentes, não escolha pela pressa: confirme no site institucional ou pergunte à empresa.</p>
<h2>Termine a semana com uma decisão, não só com contagem</h2>
<p>Classifique o que encontrou em três grupos: continuar buscando, ajustar um item comprovado ou suspender aquele alvo por incompatibilidade real. Exemplo: se os anúncios exigem turno noturno e esse horário não cabe na sua rotina, alterar o filtro é mais útil do que aumentar o número de envios. Se o contato estava incorreto, corrija imediatamente. Se não há padrão claro, preserve o material e colete mais evidência.</p>
<p>Defina quando a busca termina naquele dia. Desative alertas que repetem vagas incompatíveis e retome no próximo bloco. O plano funciona quando ajuda a escolher, registrar e aprender; ele falha quando mede apenas quantidade e empurra a pessoa para anúncios duvidosos.</p>
    `.trim()
  },

  "produtividade-busca-emprego-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Produtividade na busca de emprego é concluir etapas úteis com qualidade: localizar uma vaga real, verificar compatibilidade, adaptar o material, enviar e registrar. Abrir muitas abas ou permanecer conectado o dia inteiro não mede avanço.</p>
<h2>Comece com uma decisão de entrada</h2>
<p>Antes de pesquisar, defina cargo, localização, modalidade e limite de deslocamento. Isso reduz anúncios irrelevantes. Mantenha uma lista curta de variações verdadeiras do cargo, como atendimento, recepção ou apoio administrativo; não misture funções que exigem experiências diferentes só para aumentar resultados.</p>
<h2>Use um bloco com começo e fim</h2>
<p>Exemplo adaptável de 50 minutos: dez para buscar, quinze para conferir anúncios, vinte para adaptar e enviar uma candidatura e cinco para registrar. Se não encontrar vaga compatível, encerre com os links verificados e retome depois. O bloco não promete entrevista; ele evita que pesquisa, envio e acompanhamento se confundam.</p>
<p>O curso <a href="https://www.escolavirtual.gov.br/curso/468" target="_blank" rel="noopener noreferrer">Produtividade e Gestão do Tempo</a>, da Escola Virtual de Governo, aborda desempenho e atitudes produtivas. Aplique o que reduzir erro e sobrecarga, sem concluir que demora de recrutamento depende do seu esforço.</p>
<h2>Leia o anúncio antes de adaptar</h2>
<p>Marque requisitos essenciais, desejáveis, tarefas, local, escala, prazo e candidatura. Só depois escolha a versão do currículo. Repita termos técnicos verdadeiros que aparecem no anúncio, mas não copie parágrafos nem adicione ferramenta que nunca usou.</p>
<p>Exemplo hipotético: uma vaga pede conferência de pedidos e planilha básica. A candidata destaca a experiência real em conferência e um exercício recente de planilha; ela não escreve “Excel avançado” para passar pelo filtro.</p>
<h2>Reduza trocas desnecessárias</h2>
<ul><li>mantenha um currículo-base e versões por família de cargo;</li><li>nomeie arquivos com cargo e data, sem CPF;</li><li>use uma mensagem curta que identifique a vaga;</li><li>registre onde enviou antes de abrir o próximo anúncio;</li><li>arquive vagas vencidas e duplicadas;</li><li>reserve outro bloco para cursos e portfólio.</li></ul>
<p>Não automatize envio em massa, não contorne limites da plataforma e não deixe extensão desconhecida acessar seus dados. O LinkedIn informa que impõe <a href="https://www.linkedin.com/help/linkedin/answer/a512348/" target="_blank" rel="noopener noreferrer">limites em candidaturas simplificadas</a> para incentivar envios cuidadosos; fora da plataforma, o mesmo princípio de compatibilidade continua útil.</p>
<h2>Acompanhe sem vigiar a caixa de entrada</h2>
<p>Escolha um ou dois horários para conferir respostas. Atualize a etapa e a próxima ação. O <a href="https://www.linkedin.com/help/linkedin/answer/a8684146" target="_blank" rel="noopener noreferrer">Job tracker</a> mostra uma forma de organizar oportunidades; uma tabela local também funciona quando inclui data, canal e status.</p>
<h2>Meça o que pode mudar</h2>
<p>Revise semanalmente: anúncios compatíveis encontrados, envios concluídos, retornos, entrevistas e erros detectados. Não use visualizações de perfil como prova isolada. Se o contato está errado, corrija. Se faltam exemplos, prepare-os. Se não há vaga compatível naquele período, amplie fontes ou cargos adjacentes sem inventar experiência.</p>

<h2>Limite o trabalho em andamento</h2>
<p>Evite manter dezenas de anúncios “para depois”. Use estados simples: salvar para verificar, pronta para adaptar, enviada, aguardando e encerrada. Só avance quando a etapa anterior estiver completa. Um anúncio sem empresa identificável, prazo ou canal verificável não deve ocupar o mesmo espaço de uma oportunidade pronta para candidatura.</p>
<p>Defina um limite pequeno para a fila de adaptação. Quando ela estiver cheia, termine ou descarte itens antes de buscar novos. Esse limite não é meta de contratação; é uma forma de impedir que a pesquisa substitua o envio e que vagas vencidas permaneçam abertas indefinidamente.</p>
<h2>Separe trabalho repetível de decisão individual</h2>
<p>Revisar telefone, nome do arquivo e ortografia pode usar um checklist fixo. Já o objetivo, a ordem das experiências e a mensagem exigem leitura daquela vaga. Automatizar ou copiar a parte que exige julgamento produz currículo genérico. Preserve um modelo-base, mas registre qual evidência foi escolhida para cada anúncio.</p>
<h2>Use um quadro de erros para reduzir retrabalho</h2>
<ul>
  <li>link vencido ou redirecionamento inesperado;</li>
  <li>arquivo errado anexado;</li>
  <li>contato incompleto;</li>
  <li>requisito obrigatório percebido somente no fim;</li>
  <li>vaga duplicada em outra fonte;</li>
  <li>mensagem sem identificação do cargo.</li>
</ul>
<p>No fechamento semanal, conte quais erros se repetiram e ajuste o processo. Se muitos anúncios são descartados pelo deslocamento, aplique o filtro antes de adaptar. Se o arquivo errado foi enviado, melhore o nome das versões. Produtividade cresce quando a próxima execução tem menos correções, não quando o candidato passa mais horas conectado.</p>
<p>Produtividade sustentável deixa tempo para descanso, trabalho atual e vida pessoal. O objetivo é manter um processo claro que possa ser repetido, não transformar cada hora livre em candidatura.</p>
    `.trim()
  },

  "rejeicao-processo-seletivo-como-reagir": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Uma rejeição informa somente que aquela candidatura não avançou naquela seleção. Ela não revela automaticamente o motivo e não autoriza concluir que você é incapaz, que a vaga era falsa ou que o currículo inteiro precisa ser refeito.</p>
<h2>Registre o que realmente aconteceu</h2>
<p>Anote cargo, empresa, etapas concluídas, data do retorno e texto objetivo da resposta. Separe fatos de interpretações. “Recebi e-mail de encerramento depois da entrevista” é fato; “o recrutador não gostou de mim” é hipótese sem evidência.</p>
<p>Em candidaturas pelo LinkedIn, a página <a href="https://www.linkedin.com/help/linkedin/answer/a508716" target="_blank" rel="noopener noreferrer">O que esperar depois de se candidatar</a> explica que o responsável pode analisar os dados enviados. A plataforma não garante resposta individual nem aprovação, e outros canais seguem processos próprios.</p>
<h2>Faça uma pausa antes de alterar materiais</h2>
<p>Evite reescrever currículo e perfil na mesma hora por impulso. Compare primeiro o anúncio salvo com a versão enviada. Confirme se havia requisito essencial ausente, informação confusa, erro de contato ou exemplo fraco. Sem evidência, mantenha o material e observe outros processos.</p>
<h2>Use três perguntas de revisão</h2>
<ol><li>Eu atendia aos requisitos obrigatórios ou apenas aos desejáveis?</li><li>Meu currículo mostrou evidência das tarefas principais?</li><li>Na entrevista, respondi com situações verdadeiras ou apenas adjetivos?</li></ol>
<p>Exemplo hipotético: a vaga exigia trabalho aos sábados e a pessoa só podia de segunda a sexta. A rejeição não pede curso novo; indica incompatibilidade de horário. Em outro caso, a experiência existia, mas não apareceu no currículo: a ação é tornar a evidência visível.</p>
<h2>Peça feedback sem tentar reverter o resultado</h2>
<p>Quando houver canal aberto, envie uma mensagem curta: “Obrigado pelo retorno. Se for possível, poderia indicar um ponto que eu deveria desenvolver para processos semelhantes? Entendo caso não forneçam avaliação individual.” Não cobre resposta, não peça comparação com o aprovado e não publique conversa privada.</p>
<h2>Mantenha o funil honesto</h2>
<p>Arquive a seleção e escolha a próxima oportunidade compatível. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> é uma das fontes possíveis. Consulte também páginas oficiais de empresas e outros portais identificáveis; nunca pague para liberar candidatura.</p>
<p>Não se candidate de novo à mesma vaga usando dados diferentes. Se ela reaparecer e seu perfil mudou de forma real, confira o prazo e o canal antes de novo envio.</p>
<h2>Reconheça quando precisa reduzir o ritmo</h2>
<p>Se a busca está impedindo sono, alimentação, trabalho atual ou cuidado básico, diminua blocos e procure apoio de pessoas de confiança ou serviço de saúde. Rejeição repetida pode ser difícil, mas conselho genérico de “ser positivo” não substitui descanso nem atendimento profissional quando necessário.</p>

<h2>Escolha o ajuste conforme a etapa em que o processo parou</h2>
<ul>
  <li><strong>Sem confirmação de envio:</strong> confira canal, prazo, arquivo anexado e endereço de contato; não presuma que houve avaliação.</li>
  <li><strong>Após triagem de currículo:</strong> compare requisitos obrigatórios com evidências visíveis nas primeiras seções.</li>
  <li><strong>Após entrevista:</strong> anote perguntas que exigiram exemplos, condições incompatíveis e respostas que ficaram vagas.</li>
  <li><strong>Após proposta recusada por você:</strong> registre salário informado, escala, local e o limite que impediu o aceite, sem tratar a decisão como fracasso.</li>
</ul>
<p>Essa separação evita respostas desproporcionais. Um telefone incorreto pede correção de contato; uma escala incompatível pede filtro de anúncio; uma pergunta mal respondida pede preparo. Nenhum desses sinais, isoladamente, exige refazer toda a trajetória profissional.</p>
<h2>Faça um pequeno teste antes de mudar tudo</h2>
<p>Escolha uma alteração que possa ser observada nas próximas candidaturas: tornar a tarefa principal mais visível, revisar o objetivo ou preparar dois episódios reais para entrevista. Mantenha o restante estável por algumas seleções compatíveis e registre o que ocorreu. Mudar cargo-alvo, currículo, perfil e mensagem ao mesmo tempo impede saber qual ajuste ajudou.</p>
<p>Quando não houver feedback, use critérios internos: o currículo representa o anúncio sem copiar? Datas e contatos estão certos? A vaga ainda estava aberta? O canal era oficial? Essa revisão não descobre o motivo da empresa, mas elimina erros sob seu controle sem inventar uma explicação.</p>
<h2>Encerre o registro com uma próxima ação concreta</h2>
<p>Marque a candidatura como encerrada, guarde apenas os documentos necessários e defina uma ação: corrigir contato, pesquisar outra vaga, praticar uma resposta ou não mudar nada por falta de evidência. Não compartilhe nome de recrutador, e-mail privado ou print de conversa em postagem pública. O aprendizado útil cabe em uma frase objetiva e não precisa expor terceiros.</p>
<p>A resposta mais útil combina registro, ajuste proporcional e continuidade. Não transforme uma decisão externa em sentença sobre sua carreira. Use apenas evidência verificável para mudar currículo, alvo ou preparação.</p>
    `.trim()
  },

  "retorno-mercado-trabalho-gap-curriculo": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Um intervalo sem vínculo formal pode ocorrer por cuidado familiar, saúde, estudo, busca de trabalho, mudança de cidade ou decisão pessoal. O currículo não precisa esconder a pausa nem expor detalhes íntimos; precisa apresentar datas corretas e o que você pode demonstrar agora.</p>
<h2>Confira primeiro o histórico objetivo</h2>
<p>Liste empregos, atividades autônomas verdadeiras, cursos e projetos com mês e ano. Consulte seus registros na <a href="https://www.gov.br/pt-br/apps/ctps-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> quando houver vínculo formal. Não altere datas para eliminar o intervalo e não crie trabalho informal que não existiu.</p>
<h2>Decida se a pausa precisa aparecer</h2>
<p>Um currículo cronológico já mostra o período entre experiências; não é obrigatório criar uma seção só para justificá-lo. Quando o intervalo é longo ou relevante para a conversa, uma linha pode bastar: “Pausa profissional por responsabilidade familiar, com retorno disponível a partir de outubro de 2026.” Informe apenas o que deseja e o que afeta a disponibilidade.</p>
<p>Não inclua diagnóstico, nome de dependente, processo judicial ou documento de saúde. Na entrevista, você pode dizer: “Estive fora do mercado formal por uma questão pessoal já organizada. Hoje tenho disponibilidade para a escala informada.”</p>
<h2>Reconstrua evidências atuais</h2>
<p>Escolha tarefas do cargo-alvo e produza provas pequenas e honestas: exercício de planilha com dados fictícios, organização de arquivos, atendimento voluntário autorizado ou curso concluído. Identifique cada item como estudo, projeto ou voluntariado; não o apresente como emprego.</p>
<p>O <a href="https://www.gov.br/pt-br/servicos/consultar-quadro-brasileiro-de-qualificacoes" target="_blank" rel="noopener noreferrer">Quadro Brasileiro de Qualificações</a> ajuda a consultar conhecimentos, habilidades e atitudes relacionados às ocupações. Use-o para mapear lacunas, não para copiar competências que ainda não desenvolveu.</p>
<h2>Atualize contato, disponibilidade e referências</h2>
<ul><li>telefone e e-mail funcionando;</li><li>cidade e modalidade de trabalho corretas;</li><li>turnos que realmente pode cumprir;</li><li>duas pessoas que conhecem trabalho anterior e autorizaram contato;</li><li>currículo em formato legível;</li><li>perfil profissional coerente com as mesmas datas.</li></ul>
<p>Avise a referência sobre o tipo de vaga. Não use contato de alguém sem consentimento e não peça que confirme cargo ou atividade inexistente.</p>
<h2>Prepare uma resposta curta para a entrevista</h2>
<p>Use três partes: fato que deseja compartilhar, situação atual e conexão com a vaga. Exemplo: “Fiquei dois anos fora do mercado formal para cuidar de um familiar. Essa rotina está reorganizada. Atualizei meus conhecimentos de planilha e busco voltar para apoio administrativo, área em que já trabalhei com cadastro e conferência.”</p>
<p>Se não fez curso durante a pausa, não peça desculpa. Mostre experiências anteriores e como pretende aprender a ferramenta da empresa. Retorno ao trabalho não exige uma história de produtividade permanente.</p>
<h2>Teste a volta com condições sustentáveis</h2>
<p>Antes de enviar, confira jornada, deslocamento, remuneração informada e responsabilidades. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> permite consultar oportunidades conforme o cadastro. Começar por função adjacente pode ser adequado, desde que as condições sejam reais e não haja promessa de crescimento inventada.</p>

<h2>Organize um plano de retorno em quatro frentes</h2>
<ol>
  <li><strong>Documentos:</strong> confira contatos, registros profissionais e arquivos que precisará apresentar somente nas etapas adequadas.</li>
  <li><strong>Evidências:</strong> escolha experiências anteriores e atividades recentes que tenham relação com o cargo.</li>
  <li><strong>Condições:</strong> defina jornada, local, deslocamento e data real de disponibilidade.</li>
  <li><strong>Busca:</strong> selecione canais oficiais e registre cada candidatura.</li>
</ol>
<p>Esse plano evita tentar compensar a pausa com curso aleatório ou disponibilidade impossível. A prioridade é tornar claro o que você consegue fazer agora e quais condições permitem sustentar o retorno.</p>
<h2>Adapte a explicação ao espaço disponível</h2>
<p>No currículo, datas corretas podem ser suficientes. No resumo, uma linha curta pode indicar retorno quando isso ajuda a entender a disponibilidade. Na entrevista, responda apenas o necessário e volte à função: experiência anterior, atualização relevante e condições atuais. Não transforme a pausa em pedido de desculpas nem forneça documento médico sem necessidade legítima.</p>
<h2>Compare oportunidades pelo retorno possível</h2>
<ul>
  <li>tarefas compatíveis com experiência ou aprendizado atual;</li>
  <li>jornada que cabe na rotina reorganizada;</li>
  <li>deslocamento viável na entrada e na saída;</li>
  <li>remuneração e benefícios informados de forma compreensível;</li>
  <li>empresa e canal verificáveis;</li>
  <li>possibilidade de cumprir a data de início.</li>
</ul>
<p>Uma função adjacente pode facilitar a volta, mas não deve ser aceita com promessa vaga de promoção. Peça condições por escrito e avalie a oportunidade atual. Se o anúncio exige experiência que não possui, procure outro alvo ou formação adequada; não elimine o intervalo criando cargo ou projeto fictício.</p>
<p>A pausa é uma informação da trajetória, não a identidade do candidato. Datas corretas, evidências atuais e limites claros permitem que o recrutador avalie a compatibilidade com a função sem exigir exposição desnecessária.</p>
    `.trim()
  },

  "transporte-entrevista-emprego-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Planejar o transporte para uma entrevista em São Luís reduz risco de atraso, gasto inesperado e chegada ao endereço errado. Como trânsito, clima e operação mudam, confirme as informações perto da data e mantenha contato oficial da seleção.</p>
<h2>Valide o destino antes de montar a rota</h2>
<p>Confirme nome da empresa, unidade, rua, número, ponto de referência, horário e pessoa ou setor responsável. Compare o endereço do convite com o site oficial. Não siga localização enviada por perfil desconhecido nem aceite mudança para residência, hotel ou local isolado sem verificar a empresa.</p>
<p>Se a entrevista for em área industrial, shopping, hospital ou condomínio, pergunte qual entrada deve usar e quanto tempo costuma levar da portaria ao setor. Chegar ao prédio não é o mesmo que estar na recepção correta.</p>
<h2>Pesquise ida e volta</h2>
<p>Monte a rota no horário aproximado do compromisso e anote linha, integração, ponto de descida e caminhada. A Prefeitura mantém uma página sobre o <a href="https://www.saoluis.ma.gov.br/bilhete-unico/" target="_blank" rel="noopener noreferrer">Bilhete Único de São Luís</a>, com regras gerais de integração. Consulte informação atual antes da viagem; este guia não informa tarifa nem garante horário de linha.</p>
<p>A página de <a href="https://www.saoluis.ma.gov.br/departamentos/smtt" target="_blank" rel="noopener noreferrer">departamentos da SMTT</a> identifica a área municipal responsável pelo planejamento, programação, gestão tarifária e fiscalização do transporte coletivo. Use canais oficiais para confirmar serviço quando houver alteração.</p>
<h2>Crie margem a partir de etapas reais</h2>
<ol><li>tempo até o ponto ou local de embarque;</li><li>espera prevista;</li><li>trajeto principal;</li><li>integração ou transbordo;</li><li>caminhada e acesso ao prédio;</li><li>margem para imprevisto.</li></ol>
<p>Faça um teste prévio quando o endereço for desconhecido e isso couber no orçamento. Caso contrário, confira imagens públicas do local e pergunte sobre a entrada. Não compartilhe localização em tempo real com o recrutador; envie apenas atualização necessária sobre chegada.</p>
<h2>Defina um plano B possível</h2>
<p>Liste outra linha, ponto alternativo ou pessoa que possa ajudar. Calcule antes quanto custaria transporte por aplicativo, sem assumir que estará disponível. Leve saldo ou meio de pagamento compatível e mantenha bateria no telefone. O plano B deve ser realista para sua renda.</p>
<h2>Se houver atraso, avise cedo</h2>
<p>Entre em contato pelo canal usado na convocação assim que perceber o risco: “Olá, sou Ana, candidata à vaga de recepcionista marcada para 9h. O transporte sofreu uma interrupção e minha previsão atual é 9h15. Posso manter a entrevista ou vocês preferem outra orientação?” Não invente acidente nem envie foto de terceiros para provar.</p>
<p>A orientação do <a href="https://sine.pb.gov.br/informacoes/documentos/dicas-para-entrevista" target="_blank" rel="noopener noreferrer">SINE-PB sobre entrevistas</a> destaca chegar antes do horário. Planejamento ajuda, mas um imprevisto comunicado não deve levar você a correr, atravessar em local inseguro ou aceitar motorista sem identificação.</p>
<h2>Avalie o deslocamento como parte da vaga</h2>
<p>Depois da entrevista, estime custo, duração, segurança e compatibilidade com a escala. Faça o cálculo para ida e volta durante o mês com os valores atuais que você confirmou. Se o trajeto inviabiliza a rotina, pergunte sobre unidade, horário ou modalidade; não aceite contando com mudança que a empresa não prometeu.</p>
<p>Guarde endereço e contato apenas enquanto forem necessários. Um bom plano de transporte protege pontualidade e segurança sem transformar uma estimativa em garantia.</p>
    
<h2>Faça a checagem em duas janelas de horário</h2>
<p>Uma rota observada no meio do dia pode funcionar de modo diferente no início da manhã ou à noite. Consulte a ida no horário da entrevista e a volta no horário estimado de término. Se a vaga prevê turnos, teste também a saída mais cedo e a mais tarde que aparecem no anúncio. Não presuma que a mesma linha, integração ou caminhada estará disponível em todos os horários.</p>
<p>Registre fonte e momento da consulta: aplicativo, página pública, atendimento ou placa no terminal. Horário projetado não é garantia; por isso, mantenha margem e uma alternativa real. Se o retorno noturno exige trecho isolado ou serviço que encerra antes, trate isso como condição da vaga a confirmar, não como problema para resolver depois da contratação.</p>
<h2>Calcule o deslocamento sem inventar tarifa ou benefício</h2>
<p>Use a <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a> com a tarifa, quantidade de embarques e dias informados por você. Faça cenários separados para entrevista e rotina mensal. Vale-transporte, ajuda de custo, fretado ou mudança de unidade só entram no cálculo quando a empresa confirmar a condição.</p>
<p>Exemplo hipotético: a entrevista exige dois embarques na ida e dois na volta, mas a vaga informa escala em unidade diferente. O candidato não deve multiplicar o custo da entrevista como se fosse o custo do emprego. Primeiro confirma endereço do posto, horário e benefício; depois refaz a conta com dados do trabalho.</p>
<h2>Proteja sua segurança durante a convocação</h2>
<p>Compartilhe o endereço e o horário com alguém de confiança, principalmente quando o local é desconhecido. Mantenha seus documentos guardados e não entregue o telefone desbloqueado para “confirmar cadastro”. Mudança de endereço em cima da hora precisa ser validada pelo canal oficial. Se o ponto indicado é incompatível com a empresa, isolado ou acompanhado de pedido de pagamento, interrompa o deslocamento e confirme antes de seguir.</p>
`.trim()
  },

  "perguntas-comuns-entrevista-emprego": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Uma entrevista não tem gabarito universal. A resposta útil conecta o que a vaga pede a uma situação que você realmente viveu, sem decorar frases, inventar resultados ou revelar informação pessoal desnecessária. Este roteiro ajuda a preparar evidências e perguntas; não promete aprovação.</p>
<h2>Leia o anúncio antes de ensaiar respostas</h2>
<p>Marque no anúncio tarefas, requisitos obrigatórios, horário, local e canal da seleção. Depois, escolha três experiências que possam demonstrar parte desse trabalho. Vale emprego formal, serviço autônomo, aprendizagem, voluntariado ou atividade escolar, desde que o contexto seja identificado corretamente. A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> ajuda a entender famílias ocupacionais, mas não substitui a descrição da vaga nem autoriza acrescentar tarefas que você nunca realizou.</p>
<p>Em São Luís, inclua na preparação o deslocamento e a escala. Se a vaga informa atendimento em shopping, hospital ou área industrial, confirme unidade e horário antes de afirmar disponibilidade. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com valores conferidos por você; o portal não presume tarifa, salário ou benefício.</p>
<h2>“Fale sobre você” sem contar a vida inteira</h2>
<p>Organize a resposta em três partes: situação profissional atual, duas evidências relacionadas à vaga e objetivo imediato. Um exemplo hipotético: “Trabalho com atendimento e organização de pedidos em comércio familiar. Aprendi a registrar solicitações e conferir entregas. Procuro uma vaga de atendimento em que essas tarefas sejam relevantes.” Retire qualquer parte que não corresponda à sua história.</p>
<p>Não informe estado civil, religião, endereço completo, documentos, diagnóstico ou situação financeira para preencher silêncio. Quando a pergunta não estiver ligada ao trabalho, você pode redirecionar: “Posso explicar minha disponibilidade para a escala e o deslocamento informado.”</p>
<h2>Por que esta vaga e esta empresa?</h2>
<p>Use elementos verificáveis do anúncio ou do site institucional: atividade, unidade, produto, público atendido ou tarefa. Evite elogio genérico. Uma resposta possível é: “A vaga combina atendimento com conferência de cadastro, duas atividades que já pratiquei. Quero entender como funciona o treinamento e quais sistemas são usados.”</p>
<p>Se você não conseguiu confirmar a empresa, não invente pesquisa. Procure o domínio institucional e compare o anúncio. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> é um canal público adicional; ele não valida automaticamente vagas vistas em redes sociais.</p>
<h2>Conte uma situação com começo, ação e resultado</h2>
<p>Escolha um caso curto. Primeiro descreva o contexto; depois diga o que você fez; por fim, informe o resultado que consegue sustentar. Se não registrou números, não crie percentuais. “Organizei a fila e avisei o responsável” é melhor que “aumentei a eficiência em 40%” sem prova.</p>
<ul><li><strong>Problema:</strong> o que precisava ser resolvido?</li><li><strong>Sua ação:</strong> qual parte você executou, sem tomar crédito pelo grupo inteiro?</li><li><strong>Resultado:</strong> o que mudou ou foi entregue?</li><li><strong>Aprendizado:</strong> o que faria igual ou diferente?</li></ul>
<p>Prepare exemplos de organização, atendimento, prazo, erro corrigido e trabalho em equipe. O mesmo caso pode responder perguntas diferentes, mas não force uma história sem relação com a vaga.</p>
<h2>Ponto forte e aspecto a desenvolver</h2>
<p>Para o ponto forte, cite uma habilidade e uma evidência. Para desenvolvimento, escolha algo real que não inviabilize requisito essencial e explique a ação em andamento. “Estou praticando planilhas básicas com exercícios próprios” é verificável; “sou perfeccionista” costuma esconder a resposta.</p>
<h2>Pretensão, horário e disponibilidade</h2>
<p>Quando o anúncio informa faixa e jornada, confirme se elas cabem na sua rotina. Se não há informação, pergunte antes de assumir. Não diga “qualquer horário” se transporte, estudo ou cuidado familiar impõem limite. Disponibilidade verdadeira evita avançar até uma proposta inviável.</p>
<h2>Perguntas que o candidato pode fazer</h2>
<ul><li>Quais são as tarefas prioritárias nos primeiros dias?</li><li>Como funciona treinamento e acompanhamento?</li><li>Qual é a unidade, jornada e escala real?</li><li>Quais são as próximas etapas e o canal de retorno?</li></ul>
<p>Não é necessário adiar toda pergunta sobre remuneração. Se a empresa não informou condições essenciais, peça esclarecimento com respeito antes de aceitar deslocamento, teste ou proposta.</p>
<h2>Segurança antes e depois da entrevista</h2>
<p>Não pague taxa, exame, material, cadastro ou liberação de vaga. Não entregue senha, código de autenticação ou acesso à conta gov.br. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne orientações sobre perfis falsos, phishing e proteção de contas.</p>
<p>Depois, registre data, canal e próximo passo no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>. Se o recrutador informou prazo, aguarde-o antes de fazer um contato curto. Entrevista bem preparada é aquela em que você entende a vaga, apresenta fatos e preserva seus limites — independentemente do resultado.</p>
    `.trim()
  },

  "objetivo-profissional-curriculo": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> O objetivo profissional é uma linha de orientação, não uma promessa. Ele deve ajudar quem lê a identificar o cargo ou a área pretendida e verificar se o restante do currículo sustenta essa direção. Não existe frase obrigatória nem palavra capaz de garantir entrevista.</p>
<h2>Comece pelo anúncio e pela sua experiência real</h2>
<p>Leia o título e as tarefas de oportunidades compatíveis. Separe o nome do cargo, o nível e duas atividades que você já executou ou estudou. A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> pode esclarecer nomes e famílias ocupacionais, mas é classificatória: não transforma curso em experiência e não prova que uma vaga está aberta.</p>
<p>Se o anúncio usa “auxiliar administrativo” e você procura essa função, use o mesmo título. Se sua experiência é apenas atendimento, não troque para “analista” para parecer mais qualificado. O currículo precisa continuar verdadeiro quando o recrutador perguntar onde, quando e como cada tarefa foi realizada.</p>
<h2>Uma estrutura curta que pode ser adaptada</h2>
<p>Combine três elementos: cargo-alvo, momento profissional e evidência breve. Exemplos ilustrativos:</p>
<ul><li>“Auxiliar de loja em primeiro emprego, com prática de atendimento em atividade familiar.”</li><li>“Assistente administrativo, com experiência em cadastro e conferência de documentos.”</li><li>“Estágio em atendimento, para estudante com disponibilidade no turno da manhã.”</li></ul>
<p>Use os exemplos somente se cada informação for verdadeira. “Em busca de novos desafios”, “profissional proativo” e “qualquer oportunidade” não ajudam a distinguir a candidatura. Um objetivo não precisa listar todas as competências nem explicar a trajetória inteira.</p>
<h2>Primeiro emprego, transição e retorno</h2>
<p>No primeiro emprego, cite formação, projeto, voluntariado ou atividade informal identificada como tal. Em transição, conecte tarefas transferíveis sem declarar que já exerceu o novo cargo. No retorno ao mercado, não é necessário explicar uma pausa no objetivo; datas corretas e uma resposta curta podem tratar disso quando for relevante.</p>
<p>Quem ainda não escolheu um cargo pode comparar anúncios e consultar o <a href="https://www.gov.br/pt-br/servicos/consultar-quadro-brasileiro-de-qualificacoes" target="_blank" rel="noopener noreferrer">Quadro Brasileiro de Qualificações</a>. Use conhecimentos, habilidades e atitudes como mapa de estudo, não como texto para copiar para o currículo.</p>
<h2>Adapte sem produzir versões contraditórias</h2>
<p>Mantenha um currículo-base com datas, contatos e experiências. Para cargos próximos, faça cópias identificadas e mude a ordem das informações verdadeiras. Se uma versão diz “atendimento” e outra “estoque”, ambas devem corresponder a atividades que você consegue explicar.</p>
<p>Registre qual arquivo foi enviado no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>. Isso evita apresentar objetivo diferente durante a entrevista. Não inclua CPF, RG, dados bancários ou senha no PDF.</p>
<h2>Quando o campo pode ser dispensado</h2>
<p>Se o formulário já obriga a escolher cargo e o currículo começa com um resumo específico, repetir a mesma frase pode ser desnecessário. Em candidaturas acadêmicas ou técnicas, portfólio, formação e experiências podem ter prioridade. O critério é clareza: a pessoa deve entender a direção sem percorrer o documento inteiro.</p>
<h2>Teste antes de enviar</h2>
<ol><li>O cargo existe no anúncio e combina com a sua trajetória?</li><li>A evidência citada aparece no restante do currículo?</li><li>A frase cabe em uma ou duas linhas sem adjetivos vazios?</li><li>Horário, cidade e modalidade não entram em conflito com sua disponibilidade?</li><li>Você consegue explicar cada palavra em uma entrevista?</li></ol>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> permite consultar oportunidades compatíveis com o cadastro. Compare anúncios atuais antes de definir o cargo-alvo; uma publicação antiga não confirma demanda presente.</p>
<p>Objetivo profissional útil é específico, curto e sustentado por evidência. Ele orienta a leitura, mas a decisão depende da vaga, dos requisitos, do processo e da avaliação da empresa.</p>
    `.trim()
  },

  "salario-custo-de-vida-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia não publica “salário ideal” nem estima custo de vida por bairro. Ele propõe uma conta individual para comparar propostas em São Luís usando valores confirmados pelo candidato. Preços, tarifas, benefícios e descontos mudam; não use número antigo como se fosse condição atual.</p>
<h2>Comece pelo que a proposta realmente informa</h2>
<p>Registre remuneração bruta, jornada, escala, local, benefícios, descontos informados e data prevista de início. Separe valor garantido de comissão, prêmio ou variável. Quando a proposta não detalhar uma condição, pergunte por escrito; não preencha a lacuna com média da internet.</p>
<p>Salário bruto não é o valor disponível para todas as despesas. O líquido depende de descontos e situações individuais. Este portal não calcula folha nem substitui o holerite. Depois da admissão, confira o vínculo e informações registradas na <a href="https://www.gov.br/pt-br/apps/ctps-digital" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> e peça esclarecimento ao empregador quando houver divergência.</p>
<h2>Calcule o deslocamento por cenário</h2>
<p>Use a <a href="/ferramentas/custo-deslocamento">calculadora gratuita de deslocamento</a> com tarifa, quantidade de viagens e dias informados por você. Faça ao menos três cenários: rotina normal, dia com integração diferente e alternativa de emergência. O resultado é uma estimativa pessoal, não uma tarifa oficial nem recomendação financeira.</p>
<p>Para transporte coletivo municipal, consulte a página do <a href="https://www.saoluis.ma.gov.br/bilhete-unico/" target="_blank" rel="noopener noreferrer">Bilhete Único de São Luís</a> e confirme as regras vigentes perto da data. A <a href="https://www.planalto.gov.br/ccivil_03/leis/l7418.htm" target="_blank" rel="noopener noreferrer">Lei nº 7.418/1985</a> trata do vale-transporte para deslocamento residência-trabalho e vice-versa; o enquadramento e o procedimento devem ser confirmados com a empresa.</p>
<h2>Monte uma planilha sem inventar médias</h2>
<ul><li><strong>Receitas confirmadas:</strong> remuneração fixa e benefícios com regra conhecida.</li><li><strong>Custos para trabalhar:</strong> transporte, alimentação não coberta, vestuário necessário e cuidado de dependentes quando aplicável.</li><li><strong>Tempo:</strong> deslocamento, espera, integração e caminhada.</li><li><strong>Riscos:</strong> variável incerta, escala ainda não confirmada e custo de emergência.</li></ul>
<p>Não desconte vale-alimentação como dinheiro livre se ele possui uso específico. Não some comissão máxima como renda certa. Não trate plano de saúde como valor em espécie; registre cobertura, coparticipação e custo para dependentes separadamente.</p>
<h2>Compare duas propostas na mesma base</h2>
<p>Use o mesmo mês de referência, quantidade de dias e premissas. Uma proposta com bruto maior pode exigir mais viagens ou alimentação; outra pode ter jornada incompatível. A comparação não determina qual é “melhor”: mostra quais perguntas ainda precisam de resposta.</p>
<p>Exemplo hipotético, sem valores: a proposta A tem unidade próxima e escala confirmada; a B informa remuneração maior, mas exige duas integrações e encerra após o horário de transporte que o candidato conhece. Antes de escolher, ele confirma o turno da B e calcula uma alternativa realista. Sem essa informação, não transforma o maior bruto em vantagem garantida.</p>
<h2>Use dados públicos apenas como contexto</h2>
<p>O perfil de <a href="https://www.ibge.gov.br/cidades-e-estados/ma/sao-luis.html" target="_blank" rel="noopener noreferrer">São Luís no IBGE</a> reúne indicadores municipais com anos de referência diferentes. Eles ajudam a entender o município, mas não informam o orçamento da sua casa nem comprovam salário de uma vaga. Para mercado formal, os painéis de <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho" target="_blank" rel="noopener noreferrer">estatísticas do Ministério do Trabalho e Emprego</a> oferecem RAIS e Novo Caged; ainda assim, dado agregado não substitui proposta individual.</p>
<h2>Checklist antes de aceitar</h2>
<ol><li>Recebi cargo, unidade, jornada, escala e remuneração por canal verificável?</li><li>Separei fixo de variável?</li><li>Calculei ida e volta com valores atuais?</li><li>Entendi benefícios, descontos e coparticipações?</li><li>O horário é compatível com transporte e responsabilidades pessoais?</li><li>Não há cobrança para liberar contratação, exame ou uniforme?</li></ol>
<p>Guarde a proposta e as premissas usadas na conta. Se alguma condição mudar, refaça o cenário. Decisão responsável usa valores confirmados, limites pessoais e tempo de deslocamento — não uma média genérica chamada “custo de vida”.</p>

<h2>Faça um teste de estresse do primeiro mês</h2>
<p>O primeiro mês pode concentrar custos antes do primeiro pagamento ou benefício: deslocamento, alimentação, uniforme autorizado, cuidado de dependente e alternativa para atraso no transporte. Liste apenas despesas que a proposta e sua rotina tornam plausíveis. Não compre material, curso ou exame porque um contato não verificado prometeu reembolso.</p>
<p>Monte três cenários: condição informada, condição ainda pendente e contingência. No cenário pendente, mantenha o campo vazio ou marcado “a confirmar”; não use média retirada de busca. No de contingência, calcule como chegaria ou voltaria se a rota habitual falhar. Essa reserva de planejamento não significa que a empresa seja obrigada a cobrir toda alternativa.</p>
<h2>Registre o custo de tempo separado do dinheiro</h2>
<p>Some deslocamento, espera, integração e caminhada em cada turno. Não converta automaticamente esse tempo em salário nem o chame de hora trabalhada; use-o para avaliar compatibilidade com estudo, descanso, cuidado familiar e segurança. Compare propostas na mesma semana de referência e repita a conta quando unidade ou escala mudar.</p>
<p>Para São Luís, guarde a data em que consultou a informação municipal e confirme a operação perto da entrevista ou início. A página do Bilhete Único explica regras gerais, mas não substitui verificação de linha, horário, integração e eventual alteração operacional. Se o anúncio não identifica a unidade, a conta de deslocamento ainda não está pronta.</p>
<h2>Feche a comparação com perguntas sem resposta</h2>
<p>Antes de aceitar, liste quem confirmou cada condição e por qual canal. Variável possui regra e período? O benefício começa quando? Há coparticipação? A escala é fixa? A unidade pode mudar? Uma proposta com mais campos em aberto não deve receber números inventados para parecer comparável. A melhor planilha mostra incerteza em vez de escondê-la.</p>
    `.trim()
  },

  "comparar-portais-emprego-seguranca": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Ver a mesma vaga em vários portais não aumenta sua autenticidade. A comparação útil identifica a origem, a data, o canal de candidatura e eventuais divergências. Este guia não certifica plataformas nem recomenda pagar para concorrer.</p>
<h2>Crie uma ficha para cada oportunidade</h2>
<p>Registre empresa, cargo, cidade, modalidade, data de publicação, prazo, URL e canal de candidatura. Acrescente um identificador do anúncio quando existir. Use o <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> ou uma planilha própria, sem guardar senhas ou documentos pessoais.</p>
<p>Quando dois anúncios parecem iguais, compare descrição, local, requisitos e destino do botão. Uma diferença de título pode ser apenas adaptação do portal; salário, prazo ou canal divergentes exigem confirmação na empresa ou no responsável identificado.</p>
<h2>Procure a fonte mais próxima do processo</h2>
<p>Priorize página de carreiras da empresa, sistema indicado por ela ou serviço público. O <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> descreve cadastro, consulta e candidatura pelo sistema público. Ele é uma fonte possível, não confirmação automática de qualquer anúncio que use o nome SINE.</p>
<p>Rede social, grupo ou agregador pode servir para descobrir a oportunidade. Antes de enviar documento, procure o mesmo processo no canal institucional. Se não encontrar, marque “origem não confirmada” e peça o endereço oficial; não transforme ausência de prova em acusação pública.</p>
<h2>Compare o destino, não apenas o logotipo</h2>
<ul><li>Leia o domínio completo antes de abrir ou preencher.</li><li>Desconfie de caracteres trocados, encurtadores e páginas que imitam login.</li><li>Não reutilize senha do e-mail em portal de vagas.</li><li>Não envie código de autenticação para recrutador.</li><li>Feche a página se a candidatura exigir pagamento inesperado.</li></ul>
<p>A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha de Segurança para Internet do CERT.br</a> reúne orientações sobre phishing, privacidade, autenticação e perfis falsos. Use essas verificações mesmo quando a mensagem contém nome e imagem de uma empresa conhecida.</p>
<h2>Identifique republicação antiga</h2>
<p>Uma captura de tela não mostra se o processo continua ativo. Abra a URL original e procure data, prazo ou indicação de encerramento. Quando o portal não informa validade, confirme no canal responsável. Não atualize a data por conta própria ao compartilhar.</p>
<p>Se a mesma oportunidade aparece com cidades diferentes, não escolha a versão mais conveniente sem confirmação. Pode haver unidades distintas, erro de republicação ou anúncio copiado. Guarde a evidência e use a informação mais próxima da fonte.</p>
<h2>Evite candidatura duplicada</h2>
<p>Antes de enviar, pesquise empresa e cargo no seu controle. Se já houve candidatura no canal oficial, outro portal não exige novo envio, salvo instrução clara da empresa. Duplicar pode criar cadastros divergentes ou dificultar o acompanhamento.</p>
<p>Se o processo mudou de sistema, confirme se deve reenviar. Registre a nova URL e preserve a data do primeiro envio. Não use dados diferentes para tentar contornar uma seleção.</p>
<h2>Proteja documentos e dados</h2>
<p>Currículo inicial geralmente não precisa de CPF, RG, dados bancários, senha ou foto de documento. Pergunte qual dado é necessário, para qual finalidade e quem receberá. Em caso de suspeita, interrompa o contato e use o canal oficial independente.</p>
<p>A página do <a href="https://www.gov.br/pt-br/perfil_usuario/trabalhador" target="_blank" rel="noopener noreferrer">Trabalhador no gov.br</a> reúne serviços oficiais de emprego, documentos e benefícios. Digite o endereço gov.br diretamente quando a mensagem recebida causar dúvida.</p>
<h2>Checklist de comparação</h2>
<ol><li>A empresa ou o responsável estão identificados?</li><li>O domínio pertence ao canal esperado?</li><li>Cargo, cidade, prazo e requisitos coincidem?</li><li>Já enviei candidatura para esse processo?</li><li>Há cobrança, urgência artificial ou pedido de credencial?</li><li>Guardei URL e data da verificação?</li></ol>
<p>Portal seguro não é o que promete mais vagas; é aquele cujo anúncio pode ser rastreado, comparado e usado sem exigir confiança cega. A decisão final deve se apoiar no canal verificável do processo.</p>
    `.trim()
  },

  "quantas-vagas-candidatar-por-semana": {
    reviewedAt: "2026-10-14",
    contentHtml: `
<p><strong>Revisão editorial: 14 de outubro de 2026.</strong> Não existe número universal de candidaturas por semana. A quantidade útil depende de vagas compatíveis, tempo para verificar anúncios, qualidade do material e condições pessoais. Este guia propõe medir o processo sem criar meta artificial nem prometer entrevistas.</p>
<h2>Conte somente candidaturas concluídas e verificadas</h2>
<p>Uma vaga salva não é candidatura. Um currículo enviado para endereço duvidoso também não deve ser contado como progresso. Registre empresa, cargo, URL, data, versão do currículo e confirmação recebida no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>.</p>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> oferece consulta e candidatura conforme o cadastro. Combine fontes, mas mantenha um registro único para reconhecer anúncios repetidos.</p>
<h2>Separe compatibilidade de volume</h2>
<p>Antes de enviar, classifique cada anúncio:</p>
<ul><li><strong>Compatível:</strong> requisitos obrigatórios, local e jornada cabem na sua realidade.</li><li><strong>A confirmar:</strong> falta informação essencial sobre escala, unidade ou canal.</li><li><strong>Incompatível:</strong> há requisito obrigatório ausente ou condição inviável.</li></ul>
<p>Envie primeiro as compatíveis. Não transforme “a confirmar” em candidatura só para aumentar a contagem. Para entender nomes de ocupações e tarefas, consulte a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a>, lembrando que ela não substitui o anúncio.</p>
<h2>Escolha uma capacidade sustentável</h2>
<p>Durante uma semana, cronometre três etapas: verificar a origem, adaptar o currículo e preencher a candidatura. Some o tempo de acompanhamento. A capacidade é o número que cabe sem pular essas etapas, não o máximo de cliques que a plataforma permite.</p>
<p>Exemplo hipotético: uma pessoa encontra quinze anúncios, confirma oito e identifica cinco realmente compatíveis. Ela conclui quatro envios e deixa um para o dia seguinte. O dado útil é quatro candidaturas completas, não quinze “vagas vistas”. Na semana seguinte, pode ajustar a rotina conforme o tempo e os retornos.</p>
<h2>Leia o funil sem inventar taxa ideal</h2>
<p>Acompanhe encontrados, confirmados, enviados, retornos e entrevistas. Compare períodos do mesmo tamanho, mas não trate poucos casos como estatística definitiva. Ausência de resposta pode resultar de concorrência, pausa ou encerramento do processo; não prova sozinha que o currículo está errado.</p>
<p>Se muitos anúncios são descartados por horário ou deslocamento, refine os filtros. Se as candidaturas são compatíveis, mas os documentos contêm erros ou informações genéricas, revise-os antes de aumentar volume. Se há entrevistas, analise preparação e condições das propostas, não apenas quantidade.</p>
<h2>Evite automação e envio em massa</h2>
<p>Não use extensão desconhecida para preencher formulários, coletar contatos ou contornar limites. Ela pode expor dados e produzir respostas incorretas. A <a href="https://cartilha.cert.br/fasciculos/" target="_blank" rel="noopener noreferrer">Cartilha do CERT.br</a> orienta sobre proteção de contas, privacidade e golpes.</p>
<p>Currículo adaptado não significa reescrever tudo. Ajuste título, resumo e ordem das experiências para destacar fatos relacionados à vaga. Datas, cargos, empresas e atividades precisam permanecer coerentes em todas as versões.</p>
<h2>Planeje a semana em blocos</h2>
<ol><li>Um bloco para localizar e verificar anúncios.</li><li>Um bloco para comparar requisitos e preparar documentos.</li><li>Um bloco para concluir candidaturas.</li><li>Um bloco curto para atualizar status e responder contatos.</li><li>Tempo sem busca para descanso e outras responsabilidades.</li></ol>
<p>Se a rotina prejudica sono, trabalho atual ou cuidado básico, reduza a meta. Procura de emprego é um processo, não uma obrigação de permanecer on-line o dia inteiro.</p>
<h2>Revisão quinzenal</h2>
<ul><li>Quantas candidaturas tinham origem e requisitos confirmados?</li><li>Quais foram descartadas e por quê?</li><li>Qual versão do currículo gerou conversa relevante?</li><li>Quais requisitos apareceram repetidamente?</li><li>A área de busca continua compatível com deslocamento e jornada?</li></ul>
<p>A meta adequada é aquela que preserva verificação, honestidade e acompanhamento. Aumente ou reduza com base no tempo real e nos obstáculos observados, nunca em promessa de que determinado número garante contratação.</p>
    `.trim()
  },

  "vagas-comercio-servicos-sao-luis-perfil": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Este guia não afirma que comércio ou serviços estejam contratando hoje. Ele ensina a ler anúncios desses setores em São Luís, comparar tarefas e decidir se o perfil e a rotina são compatíveis. A vaga concreta deve ser confirmada no canal responsável.</p>
<h2>Comece pela função, não pelo nome amplo do setor</h2>
<p>“Comércio” pode incluir caixa, estoque, vendas, reposição e atendimento; “serviços” reúne atividades muito diferentes. Leia as tarefas e identifique o que será feito no turno. A <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> ajuda a entender famílias ocupacionais, mas o anúncio e o contrato definem a função real.</p>
<p>Não copie a descrição da CBO para o currículo. Selecione apenas atividades que você executou e consiga explicar. Atendimento pode significar registrar pedido, orientar cliente ou organizar fila; estoque pode envolver conferência, endereçamento e separação. O nome sozinho não comprova experiência.</p>
<h2>Transforme requisito genérico em pergunta concreta</h2>
<ul><li>“Boa comunicação”: com qual público, por qual canal e para resolver quais demandas?</li><li>“Disponibilidade”: quais dias, horários e unidade?</li><li>“Informática”: quais sistemas ou tarefas?</li><li>“Organização”: de produtos, documentos, agenda ou caixa?</li><li>“Trabalho em equipe”: como se dividem responsabilidades e supervisão?</li></ul>
<p>Se o anúncio não esclarece, pergunte antes de afirmar compatibilidade. Não declare disponibilidade total quando transporte, estudo ou cuidado familiar impõem limite.</p>
<h2>Compare a escala com o deslocamento em São Luís</h2>
<p>Confirme endereço, entrada, saída e trabalho em fins de semana. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com valores atuais informados por você. A página municipal do <a href="https://www.saoluis.ma.gov.br/bilhete-unico/" target="_blank" rel="noopener noreferrer">Bilhete Único</a> reúne regras gerais; horários e operação devem ser confirmados perto da candidatura ou entrevista.</p>
<p>Uma vaga pode combinar com a experiência e ainda ser inviável por escala ou trajeto. Não aceite contando com mudança de unidade ou horário que a empresa não prometeu.</p>
<h2>Monte evidências para o currículo</h2>
<p>Para cada tarefa central, escreva uma situação verdadeira:</p>
<ol><li>onde aconteceu;</li><li>qual era sua responsabilidade;</li><li>que ação realizou;</li><li>qual resultado observável houve, sem número inventado.</li></ol>
<p>Exemplo hipotético: “Conferia pedidos e separava divergências para o responsável” é mais verificável que “excelente em logística”. Se a experiência foi informal ou familiar, identifique esse contexto sem criar vínculo empregatício.</p>
<h2>Use dados de mercado com cautela</h2>
<p>Os painéis de <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho" target="_blank" rel="noopener noreferrer">estatísticas do Ministério do Trabalho e Emprego</a> reúnem Novo Caged e RAIS. Eles ajudam a observar emprego formal por período e território, mas não provam que uma empresa esteja com seleção aberta. Confira recorte, competência e atualização antes de citar um dado.</p>
<p>O perfil de <a href="https://www.ibge.gov.br/cidades-e-estados/ma/sao-luis.html" target="_blank" rel="noopener noreferrer">São Luís no IBGE</a> oferece contexto municipal com anos de referência distintos. Não converta indicador agregado em salário, benefício ou quantidade de vagas de um anúncio.</p>
<h2>Verifique o processo antes de enviar documentos</h2>
<p>Compare empresa, cargo, cidade, prazo e canal. O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> é uma alternativa pública. Nenhum canal legítimo precisa da senha da sua conta gov.br ou de pagamento para liberar entrevista.</p>
<p>Registre a candidatura e o anúncio no <a href="/ferramentas/controle-candidaturas">controle gratuito</a>. Não inclua CPF, RG, dados bancários ou foto de documento no primeiro currículo.</p>
<h2>Checklist de compatibilidade</h2>
<ul><li>Entendi as tarefas, não apenas o título?</li><li>Consigo demonstrar os requisitos essenciais?</li><li>Unidade, jornada e escala cabem na rotina?</li><li>Remuneração e benefícios foram informados por canal verificável?</li><li>A candidatura está no site ou contato correto?</li><li>Não há cobrança, promessa ou pedido de credencial?</li></ul>
<p>O melhor alvo não é “o setor que mais contrata” sem fonte e data. É a oportunidade atual cuja função, condições e canal você consegue verificar e para a qual possui evidência real de compatibilidade.</p>
    `.trim()
  },

  "mapa-setores-vagas-sao-luis": {
    reviewedAt: "2026-10-15",
    contentHtml: `
<p><strong>Revisão editorial: 15 de outubro de 2026.</strong> Não existe um mapa fixo de setores “com vagas” em São Luís. O mercado muda por período, fonte e recorte. Este guia mostra como montar um mapa pessoal com estatísticas oficiais, anúncios atuais e limites de deslocamento, sem anunciar oportunidade inexistente.</p>
<h2>Defina setor, ocupação e vaga separadamente</h2>
<p>Setor descreve atividade econômica; ocupação descreve o trabalho; vaga é uma oportunidade concreta. Um hospital pertence a determinado setor, mas pode contratar funções administrativas, técnicas, de limpeza ou atendimento. Não conclua que experiência em uma função se transfere automaticamente para todas as outras.</p>
<p>Consulte a <a href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes" target="_blank" rel="noopener noreferrer">Classificação Brasileira de Ocupações</a> para entender famílias e conteúdos ocupacionais. Use como referência de nomenclatura; a CBO não regulamenta profissão, não certifica competência e não comprova vaga aberta.</p>
<h2>Leia estatísticas com data e território</h2>
<p>O Ministério do Trabalho e Emprego disponibiliza <a href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho" target="_blank" rel="noopener noreferrer">Novo Caged, RAIS e microdados</a>. Antes de comparar setores, anote período, município ou estado, tipo de vínculo e atualização. Saldo de emprego formal não equivale ao número de vagas disponíveis hoje.</p>
<p>O perfil de <a href="https://www.ibge.gov.br/cidades-e-estados/ma/sao-luis.html" target="_blank" rel="noopener noreferrer">São Luís no IBGE</a> oferece indicadores do município. Cada indicador possui ano de referência; não misture valores de períodos diferentes nem transforme contexto populacional em previsão de contratação.</p>
<h2>Monte seu mapa em três camadas</h2>
<ol><li><strong>Ocupações compatíveis:</strong> funções que você consegue demonstrar ou para as quais possui formação exigida.</li><li><strong>Território viável:</strong> bairros, municípios e horários alcançáveis com segurança.</li><li><strong>Anúncios confirmados:</strong> processos atuais com empresa ou canal identificável.</li></ol>
<p>Crie uma tabela com cargo, setor da organização, local, jornada, requisito principal, fonte e data. Depois de duas semanas, conte padrões sem generalizar além da amostra. Cinco anúncios vistos por você não representam todo o mercado da cidade.</p>
<h2>Use deslocamento como filtro real</h2>
<p>Compare entrada e saída com o transporte disponível. A página do <a href="https://www.saoluis.ma.gov.br/bilhete-unico/" target="_blank" rel="noopener noreferrer">Bilhete Único de São Luís</a> reúne regras gerais; confirme operação e valores atuais. Na <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a>, informe tarifa e viagens do seu cenário.</p>
<p>Não descarte setor inteiro por uma unidade distante. Procure outras localizações, horários ou funções próximas. Também não aceite processo apenas porque a empresa fica perto; requisitos, remuneração e segurança do canal continuam necessários.</p>
<h2>Classifique prioridades sem prometer resultado</h2>
<ul><li><strong>Prioridade alta:</strong> ocupação comprovável, jornada viável e anúncios atuais confirmados.</li><li><strong>Prioridade média:</strong> parte dos requisitos atendida e uma informação essencial ainda a confirmar.</li><li><strong>Formação necessária:</strong> requisito obrigatório legítimo que você ainda não possui.</li><li><strong>Fora do ciclo:</strong> deslocamento, horário ou requisito inviável neste momento.</li></ul>
<p>Reavalie a cada duas semanas. Mudar prioridade não significa reescrever experiências nem acrescentar curso inexistente. Significa concentrar tempo onde há compatibilidade verificável.</p>
<h2>Confirme oportunidades em canais identificáveis</h2>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> permite consulta conforme o cadastro. Compare também páginas institucionais e portais que mostram origem. Rede social pode alertar sobre um processo, mas não deve substituir a verificação.</p>
<p>Registre empresa, cargo, URL, data, cidade e próxima ação no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>. Não conte anúncio duplicado como nova oportunidade e não compartilhe documento com contato cuja identidade não foi confirmada.</p>
<h2>O que o mapa pode responder</h2>
<p>Ele pode mostrar onde sua experiência encontra anúncios verificáveis, quais requisitos se repetem e quais limites reduzem o campo. Ele não pode prever contratação, salário, abertura futura ou “melhor setor” para toda pessoa. Use estatística como contexto e cada vaga como decisão individual.</p>
    
<h2>Monte uma coleta de 14 dias que outra pessoa conseguiria repetir</h2>
<p>Escolha antes da busca três famílias ocupacionais, quatro fontes e um período fechado. Em cada dia de coleta, registre URL, data de acesso, título, município informado, tipo de contrato declarado, turno, requisito e situação do anúncio. Se a fonte não mostra São Luís de forma inequívoca, marque “local a confirmar”; não complete o campo por inferência.</p>
<p>Use uma linha por anúncio, não por captura de tela. Quando o mesmo texto aparecer em dois portais, compare empresa, cargo, local, jornada e canal de candidatura. Se esses elementos coincidirem, trate como possível duplicação e preserve a URL de cada origem em uma única linha. Essa limpeza evita chamar republicação de crescimento do mercado.</p>
<h2>Separe fluxo de anúncios de estoque de empregos</h2>
<p>RAIS e Novo Caged ajudam a observar vínculos formais e movimentações em períodos definidos; anúncios mostram apenas oportunidades que a fonte publicou e que você conseguiu localizar. São medidas diferentes. Um setor com muitos vínculos pode ter poucos anúncios na quinzena, e uma função muito anunciada pode repetir a mesma seleção. Anote essa diferença no cabeçalho do mapa para não transformar contexto estatístico em promessa de vaga.</p>
<h2>Transforme a observação em decisão pessoal</h2>
<p>Ao terminar a quinzena, conte requisitos repetidos somente depois de remover duplicidades. Compare cada requisito com três estados: “já demonstro”, “posso aprender” e “exige condição que não possuo”. Acrescente tempo e custo real de deslocamento para os turnos mencionados. O resultado útil não é um ranking universal de setores, mas uma lista curta de ocupações pesquisáveis, lacunas verificadas e anúncios compatíveis com seu limite de mobilidade.</p>
`.trim()
  }
};

export function getEditorialContentOverride(slug: string) {
  return overrides[slug] ?? null;
}
