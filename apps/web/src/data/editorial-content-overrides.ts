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
    reviewedAt: "2026-10-12",
    contentHtml: `
      <p><strong>Revisão editorial: 12 de outubro de 2026.</strong> O LinkedIn pode ajudar quem procura o primeiro emprego a apresentar experiências reais, acompanhar organizações e descobrir anúncios. Ele não substitui currículo, entrevista, SINE ou o canal oficial da empresa; também não garante que um perfil será encontrado. Este guia mostra como usar a plataforma com método e segurança, sem inventar cargo, curso, competência ou contratação.</p>

      <h2>Escolha um objetivo que você consegue sustentar</h2>
      <p>Antes de editar o perfil, selecione um ou dois cargos compatíveis com sua formação, disponibilidade e atividades que já realizou. Em São Luís, considere também onde consegue trabalhar e em quais horários pode se deslocar. “Qualquer vaga” não ajuda o recrutador a entender sua direção e dificulta a criação de alertas úteis.</p>
      <p>Transforme atividades em evidências. Quem ajudou a organizar materiais em um projeto escolar pode mencionar inventário simples, conferência e registro, mas não deve se apresentar como analista de estoque. Quem atendeu pessoas em ação voluntária pode descrever recepção e orientação, sem criar vínculo empregatício. O limite é simples: você precisa conseguir explicar quando, onde e como realizou cada tarefa.</p>
      <p>Se ainda não definiu a direção, compare anúncios atuais e anote requisitos que se repetem. O guia de <a href="/blog/objetivo-profissional">objetivo profissional</a> ajuda a converter essa leitura em um texto curto e honesto.</p>

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
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Guia revisado em 12/10/2026.</strong> Entrar em contato com alguém da área de recrutamento não significa pedir uma vaga imediatamente. O objetivo pode ser descobrir o canal oficial de seleção ou confirmar se existe processo aberto. Uma mensagem curta e específica respeita mais o destinatário do que copiar o mesmo texto para dezenas de pessoas.</p>
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
<p>Registre a data e o próximo passo na <a href="/ferramentas/controle-candidaturas">ferramenta gratuita de candidaturas</a>. Se o contato não responder, continue usando fontes oficiais em vez de insistir diariamente. Para buscar oportunidades pelo serviço público, conheça o <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">SINE (gov.br)</a>. Mensagem privada não substitui candidatura feita no canal da empresa.</p>`.trim()
  },
  "acompanhar-candidatura-emprego": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial de 12/10/2026.</strong> Acompanhar uma candidatura significa ter informações organizadas, não enviar cobranças constantes. Com um registro simples, você sabe a qual anúncio respondeu, em qual data, qual etapa foi confirmada e quando é adequado verificar uma atualização.</p>
<h2>O que registrar em cada oportunidade</h2>
<ol><li><strong>Cargo e empresa:</strong> use o nome do anúncio original. Se for recrutamento confidencial, anote o portal e o identificador público.</li><li><strong>Canal:</strong> site da empresa, sistema de RH ou e-mail divulgado. Guarde o link, sem copiar senhas.</li><li><strong>Data:</strong> registre quando enviou o currículo e quando recebeu confirmação.</li><li><strong>Situação:</strong> enviada, recebida, entrevista marcada, em avaliação, encerrada ou contratada.</li><li><strong>Próximo passo:</strong> aguardar prazo informado, revisar documentos ou preparar entrevista.</li></ol>
<p>Abra a <a href="/ferramentas/controle-candidaturas">ferramenta de controle de candidaturas</a> e use o botão Baixar CSV antes de sair. Ela não exige conta e não envia os registros ao servidor. O arquivo é seu, então guarde-o em local privado.</p>
<h2>Quando pedir retorno</h2>
<p>Se o anúncio estabelece uma data, respeite esse prazo. Se não há previsão, uma pergunta educada depois de um intervalo razoável pode ser aceitável pelo canal de recrutamento divulgado. Não existe regra universal de número de dias: acompanhe o que foi comunicado pela empresa e não envie mensagens repetidas por várias redes.</p>
<blockquote><p>Olá, equipe de recrutamento. Participei do processo para [cargo] em [data], pelo canal [site/e-mail]. Gostaria de saber se existe previsão para atualização da etapa. Obrigado pela atenção.</p></blockquote>
<h2>Como interpretar o silêncio</h2>
<p>Não receber resposta não comprova falha do currículo. Pode haver prazo interno, encerramento de vaga ou volume alto de candidaturas. Seu registro ajuda a identificar padrões: quais canais enviam confirmação, quais cargos combinam com sua experiência e quais anúncios permanecem sem atualização. Ajuste uma variável de cada vez, sem inventar experiência no PDF.</p>
<p><strong>Segurança:</strong> não informe senha ou dados bancários para “liberar retorno”; suspeitas devem ser reportadas pelos canais oficiais. Veja <a href="/seguranca-candidatos">como reconhecer golpes de vaga</a>.</p>`.trim()
  },
  "pesquisar-empresa-antes-entrevista": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Guia revisado em 12/10/2026.</strong> Pesquisar uma empresa antes de uma entrevista serve para descobrir o que ela faz, como a vaga se relaciona com a operação e se o convite veio de um canal confiável. Isso ajuda a preparar perguntas e reduz risco de fraude.</p>
<h2>Pesquisa em 15 minutos, sem adivinhar</h2>
<ol><li>Abra o site institucional e identifique produto, serviço, região de atuação e canal de carreiras.</li><li>Confirme se a empresa e o local do anúncio coincidem com o convite recebido.</li><li>Leia novamente as atribuições e separe duas atividades que você consegue demonstrar.</li><li>Se houver entrevista remota, confira plataforma, horário e domínio do convite.</li><li>Prepare duas perguntas específicas sobre rotina, equipe ou treinamento.</li></ol>
<h2>Exemplo: uma vaga de recepção</h2>
<p>O anúncio pede atendimento ao público e pacote Office. Na pesquisa, você identifica que o estabelecimento atende por agendamento. Em vez de repetir “sou organizado”, prepare um exemplo real de como controla horários, confirma informação e evita dupla marcação. Pergunte qual sistema é utilizado e se haverá treinamento inicial.</p>
<h2>Exemplo: uma vaga de estoque</h2>
<p>Uma distribuidora descreve conferência e separação. Investigue a diferença entre recebimento, inventário e expedição. Se já trabalhou com contagem de itens ou planilhas, descreva exatamente a tarefa. Se não conhece o sistema mencionado, diga o que sabe e como pretende aprender; inventar domínio costuma causar problemas quando começa o treinamento.</p>
<h2>O que a pesquisa não consegue garantir</h2>
<p>Site bem apresentado e avaliações em redes não garantem contratação nem boas condições trabalhistas. Comentários isolados também não comprovam problemas estruturais. Compare informações por data e origem, faça perguntas sobre escala e contrato e mantenha postura profissional.</p>
<p>Se receber pedido de pagamento para realizar a entrevista, interrompa o processo e verifique o anunciante. Para consultar oportunidades pelo sistema público, veja <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a>. O serviço não atesta uma empresa específica; é uma alternativa oficial de busca.</p>`.trim()
  },
  "seguro-desemprego-checklist-documentos": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial de 12/10/2026.</strong> O seguro-desemprego tem requisitos próprios. Ser demitido não significa que toda pessoa terá direito ao benefício. O procedimento correto é verificar o enquadramento e usar o sistema oficial, sem compartilhar senhas com intermediários.</p>
<h2>Confira primeiro a modalidade de desligamento</h2>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego" target="_blank" rel="noopener noreferrer">Solicitar o Seguro-Desemprego, no gov.br</a>, detalha requisitos, canais e documentos. Para o trabalhador formal, considera-se em geral a dispensa involuntária sem justa causa, além de critérios sobre período trabalhado e renda. Existem regras específicas para cada categoria e solicitação.</p>
<h2>Documentos e dados que vale separar</h2>
<ol><li>CPF e acesso pessoal à conta gov.br, sem fornecer sua senha a terceiros.</li><li>Documento de Requerimento do Seguro-Desemprego fornecido pelo empregador quando aplicável.</li><li>Dados dos vínculos e datas de admissão e desligamento.</li><li>Documentos e comunicações de rescisão recebidos do empregador.</li><li>Um local privado para acompanhar número de protocolo e resposta.</li></ol>
<p>A página do serviço oficial informa que o pedido pode ser feito por canais web ou pela Carteira de Trabalho Digital, entre outros atendimentos. Confirme no próprio portal qual canal está disponível na data da consulta e quais prazos se aplicam à sua situação.</p>
<h2>Como acompanhar sem cair em golpes</h2>
<p>Após solicitar, acompanhe diretamente no gov.br ou aplicativo oficial. Não clique em links recebidos de números desconhecidos prometendo “antecipar parcelas”. Nunca faça depósito para liberar benefício: cobrança desse tipo não faz parte do procedimento descrito pelo serviço público.</p>
<p><strong>Exemplo ilustrativo:</strong> uma pessoa recebeu dois vínculos no histórico profissional e foi desligada recentemente. Ela deve verificar os requisitos da sua solicitação e os comprovantes, sem presumir direito ou valor apenas porque colegas receberam o benefício em outro período.</p>
<p>Se houver indeferimento, o próprio portal informa como buscar revisão e recurso. Consulte o <a href="https://www.gov.br/pt-br/servicos/cadastrar-recurso-relativo-ao-seguro-desemprego" target="_blank" rel="noopener noreferrer">serviço de recurso</a>. Esta orientação não substitui análise individual por órgão competente.</p>`.trim()
  },
  "ctps-digital-carteira-trabalho-consultar": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisado em 12/10/2026.</strong> A Carteira de Trabalho Digital é um serviço público usado para consultar informações sobre vínculos profissionais e acessar funcionalidades relacionadas ao trabalho. Não confunda obter acesso ao aplicativo com garantir que uma vaga seja legítima.</p>
<h2>Como começar pelo canal oficial</h2>
<ol><li>Abra o serviço <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Obter a Carteira de Trabalho, no gov.br</a>.</li><li>Confira que está no domínio oficial antes de informar credenciais.</li><li>Tenha CPF e conta gov.br para autenticação conforme o procedimento do serviço.</li><li>Use o aplicativo oficial ou a opção web indicada no portal, conforme sua necessidade.</li><li>Consulte os vínculos e confira dados de empregadores e períodos trabalhados.</li></ol>
<p>O Ministério do Trabalho e Emprego mantém também o <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho/passo-a-passo-da-carteira-de-trabalho-digital" target="_blank" rel="noopener noreferrer">passo a passo da CTPS Digital</a>, que pode ajudar na navegação. Os nomes de menus podem mudar com atualizações do aplicativo; use a documentação oficial mais recente.</p>
<h2>Três situações práticas</h2>
<ul><li><strong>Você começou um emprego:</strong> confira se o vínculo aparece e se os dados correspondem ao documento de contratação. Diferenças devem ser esclarecidas com o empregador.</li><li><strong>Você vai montar o currículo:</strong> use o histórico como apoio para datas e nomes, mas descreva apenas atividades que realmente exerceu.</li><li><strong>Recebeu mensagem para “validar a carteira”:</strong> não envie senha nem código de autenticação por WhatsApp. Acesse o aplicativo ou portal diretamente.</li></ul>
<h2>Se um registro não aparece</h2>
<p>Uma divergência pode ter diferentes causas; esta página não identifica qual ocorreu no seu caso. Guarde comprovantes, consulte orientações oficiais e procure atendimento pelos canais disponibilizados no serviço. Dados sensíveis não devem ser publicados em comentários ou enviados a perfis desconhecidos.</p>`.trim()
  },
  "fgts-consultar-trabalhador-clt": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Atualizado em 12/10/2026.</strong> Para verificar informações do FGTS, priorize os canais oficiais e compare o extrato ao histórico de trabalho. Este guia não consulta sua conta, não promete saque e não pede dados pessoais.</p>
<h2>Separe dados antes de consultar</h2>
<p>Consulte o <a href="https://www.fgts.gov.br/Paginas/trabalhador/app-fgts.aspx" target="_blank" rel="noopener noreferrer">aplicativo FGTS no site oficial do Fundo</a> ou a página de <a href="https://www.fgts.gov.br/Paginas/subpaginas/outros-servicos-sub-extrato.aspx" target="_blank" rel="noopener noreferrer">consulta de extrato</a>, além do histórico profissional. Desconfie de páginas que reproduzem visual de banco e pedem senha, código de segurança ou pagamento para consultar extrato. Se estiver em dúvida, entre no endereço da instituição por navegação direta, não por link de mensagem.</p>
<h2>O que observar no extrato</h2>
<ol><li>Identifique cada vínculo empregatício exibido.</li><li>Compare os meses de referência com o período em que trabalhou.</li><li>Registre eventuais ausências ou divergências percebidas, com data.</li><li>Guarde comprovantes de pagamento e dados do contrato que possam ajudar a esclarecer o caso.</li><li>Procure os canais oficiais de atendimento antes de tomar qualquer medida.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> a pessoa trabalhou em duas empresas no mesmo ano e visualiza mais de uma conta vinculada. Isso não significa, por si, pagamento duplicado. É necessário relacionar cada conta ao empregador e aos meses correspondentes.</p>
<h2>Consulta não é autorização para saque</h2>
<p>As hipóteses de movimentação do FGTS têm regras próprias. Ver saldo não garante que ele esteja integralmente disponível para retirada. Verifique as modalidades no canal oficial e desconfie de pessoas prometendo liberação imediata mediante transferência ou taxa.</p>
<p>Para confirmar dados do vínculo, consulte também a <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. A checagem de depósitos e eventuais divergências deve ser feita por atendimento competente; o Empregos São Luís não tem acesso a contas de FGTS nem resolve lançamentos financeiros.</p>`.trim()
  },
  "ler-contrato-trabalho-clt": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial de 12/10/2026.</strong> Antes de iniciar uma atividade, confira se os termos que recebeu correspondem à vaga anunciada. Este roteiro de leitura não substitui orientação jurídica, mas ajuda a formular perguntas concretas ao empregador.</p>
<h2>Comece pelos dados que identificam o vínculo</h2>
<ol><li>Nome e identificação da empresa contratante.</li><li>Função, local principal de trabalho e possibilidade de deslocamento.</li><li>Data de admissão, modalidade contratual e informações sobre experiência ou prazo, quando houver.</li><li>Remuneração, composição de benefícios e periodicidade do pagamento.</li><li>Jornada, escala, intervalos, plantões e registro de horas.</li><li>Condições relacionadas a alteração de local, sigilo, equipamentos ou responsabilidades específicas.</li></ol>
<h2>Três dúvidas úteis para levar ao RH</h2>
<p><strong>Escala:</strong> “A vaga inclui finais de semana? Como receberei a escala e a antecedência de alterações?”</p>
<p><strong>Remuneração:</strong> “O valor anunciado corresponde ao salário fixo ou inclui componentes variáveis? Onde esses valores constam no documento?”</p>
<p><strong>Local:</strong> “Trabalharei somente nesta unidade? Em caso de mudança de local, como isso será comunicado?”</p>
<h2>O que confirmar em fonte oficial</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">Consolidação das Leis do Trabalho (CLT)</a> reúne a legislação trabalhista federal e suas alterações. Para registro de vínculos, veja o serviço da <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. Questões sobre convenção coletiva, modalidade especial e caso individual devem ser verificadas com profissionais competentes.</p>
<p><strong>Exemplo ilustrativo:</strong> um anúncio diz “comissão atrativa”, mas não explica critérios ou período. Antes de aceitar, peça a regra e a forma de apuração. Uma promessa verbal difícil de verificar pode criar expectativas distintas do contrato escrito.</p>
<p>Guarde cópia do documento que recebeu. Não entregue documentos ou assine contratos por links cuja origem não conseguiu verificar.</p>`.trim()
  },
  "curriculo-pdf-erros-triagem": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão de 12/10/2026.</strong> Um currículo em PDF pode facilitar a leitura, mas o arquivo não compensa informações genéricas, datas incorretas ou falta de relação com a vaga. O objetivo é apresentar sua trajetória de forma clara e verificável.</p>
<h2>Checklist antes de exportar</h2>
<ol><li>Use o nome pelo qual deseja ser chamado e um telefone/e-mail profissional que você realmente acompanha.</li><li>Resuma o cargo desejado sem frases vazias como “busco qualquer oportunidade”.</li><li>Organize experiências da mais recente para a mais antiga, com datas coerentes.</li><li>Descreva tarefas reais. “Conferi notas e registrei entrada de materiais” informa mais do que “responsável por tudo”.</li><li>Se ainda não trabalhou formalmente, inclua projetos, curso ou atividade informal com descrição honesta.</li><li>Revise ortografia, títulos, margens e se o PDF mantém texto selecionável.</li></ol>
<h2>Teste em duas telas</h2>
<p>Abra o PDF no celular e no computador. Confira se o título não quebra, se os dados de contato permanecem visíveis e se os itens não foram cortados. Se o arquivo ficou ilegível no telefone, reduza elementos decorativos e prefira hierarquia simples. Não há modelo único que garanta resultado em todos os sistemas de triagem.</p>
<h2>Exemplo de descrição objetiva</h2>
<p><strong>Vago:</strong> “Boa comunicação e muita experiência em atividades administrativas.”</p>
<p><strong>Específico:</strong> “Organização de agendas, atendimento telefônico e atualização semanal de planilhas de controle.”</p>
<p>Use somente a segunda versão se essas tarefas de fato fizerem parte da sua experiência.</p>
<h2>O que não precisa entrar</h2>
<p>CPF, número de conta, fotografia de documentos, senha e endereço residencial completo não são exigências universais de currículo. Compartilhe dados sensíveis apenas quando houver necessidade legítima e canal verificado.</p>
<p>Na dúvida sobre cargo e candidatura, confirme a oportunidade no sistema oficial divulgado e registre o envio na <a href="/ferramentas/controle-candidaturas">planilha gratuita de acompanhamento</a>. O portal não garante entrevistas por utilizar determinado formato de currículo.</p>`.trim()
  },
  "entrevista-comportamental-exemplos": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial de 12/10/2026.</strong> Questões comportamentais pedem episódios da sua experiência: uma situação, uma decisão e um resultado. O melhor preparo é organizar fatos reais, não decorar respostas que qualquer pessoa poderia repetir.</p>
<h2>Estrutura prática: contexto, ação e resultado</h2>
<ol><li><strong>Contexto:</strong> onde ocorreu e qual era o problema?</li><li><strong>Seu papel:</strong> qual responsabilidade você realmente tinha?</li><li><strong>Ação:</strong> o que fez, com quais recursos e limites?</li><li><strong>Resultado:</strong> o que melhorou, o que não funcionou e o que aprendeu?</li></ol>
<h2>Exemplo para atendimento</h2>
<p><strong>Pergunta:</strong> “Conte sobre uma pessoa insatisfeita que você atendeu.”</p>
<p><strong>Resposta-modelo ilustrativa, não experiência para copiar:</strong> “Durante um atendimento, um cliente contestou uma informação. Primeiro conferi o registro, depois expliquei a opção disponível e encaminhei ao responsável quando ultrapassava minha autorização. A conversa terminou com uma orientação clara, e passei a confirmar dados antes de responder.”</p>
<p>Se você nunca viveu algo semelhante, relate uma situação de estágio, atividade escolar, trabalho informal ou projeto voluntário, deixando claro o contexto. Não afirme resultados numéricos que não mediu.</p>
<h2>Exemplo para logística ou estoque</h2>
<p><strong>Pergunta:</strong> “Como você lidou com erro em uma tarefa?”</p>
<p>Uma resposta honesta descreve o momento em que percebeu diferença na conferência, como comunicou a supervisão e quais passos adotou para evitar repetição. O ponto não é parecer perfeito: é demonstrar atenção, comunicação e aprendizado.</p>
<h2>Treine com limite de tempo</h2>
<p>Escreva três episódios curtos: um desafio, uma colaboração e um erro corrigido. Conte cada um em cerca de um minuto, sem inventar cargos. Se a entrevista for para São Luís e exigir escala, prepare também perguntas sobre horário, unidade e deslocamento.</p>
<p>Depois, anote aprendizados na <a href="/ferramentas/controle-candidaturas">ferramenta de candidaturas</a>, mas não coloque dados pessoais de entrevistadores no arquivo. Nenhuma resposta-modelo garante aprovação.</p>`.trim()
  },
  "primeiro-emprego-sao-luis-checklist": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Guia revisado em 12/10/2026.</strong> O primeiro emprego exige comprovar disposição para aprender e capacidade de cumprir tarefas, não inventar experiência. Antes de sair enviando currículo, defina para quais funções você consegue demonstrar habilidades básicas.</p>
<h2>Primeira etapa: escolha três cargos possíveis</h2>
<p>Liste funções próximas de sua formação e rotina: atendimento, estoque, auxiliar administrativo, apoio de produção ou outras que apareçam em anúncios reais. Leia os requisitos obrigatórios de cada vaga. Um curso não substitui automaticamente experiência quando o anúncio a exige; também não desqualifica todo candidato iniciante quando ela é apenas desejável.</p>
<h2>Segunda etapa: monte provas simples de capacidade</h2>
<ol><li>Se deseja atendimento, prepare uma história verdadeira de organização ou resolução de dúvida.</li><li>Para escritório, demonstre uma planilha que você mesmo montou, sem dados de terceiros.</li><li>Para estoque, explique como faria uma contagem e reportaria divergência, sem fingir prática profissional.</li><li>Inclua cursos concluídos somente com nome e instituição corretos.</li><li>Confirme telefone, e-mail e disponibilidade antes de enviar.</li></ol>
<h2>Terceira etapa: encontre oportunidades confiáveis</h2>
<p>Use o <a href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine" target="_blank" rel="noopener noreferrer">Buscar Emprego no SINE</a> e páginas de carreiras de empresas. Confira cidade, horário, requisitos e validade. Publicação antiga em rede social não confirma processo ativo. Se o anúncio solicitar Pix ou taxa para concorrer, não prossiga.</p>
<h2>Quarta etapa: acompanhe sem ansiedade desnecessária</h2>
<p>Registre cargo, empresa, data e resposta recebida no <a href="/ferramentas/controle-candidaturas">controle gratuito</a>. Uma candidatura sem retorno não significa que seu esforço foi inútil; observe quais formatos de currículo e funções geram respostas reais antes de alterar tudo.</p>
<p><strong>Exemplo ilustrativo:</strong> alguém que mora no Cohatrac encontra vaga no outro lado da cidade com jornada cedo. Antes de enviar, precisa calcular tempo de viagem, custo e condições de transporte no horário. O salário do anúncio não revela sozinho se a oportunidade é viável.</p>
<p>Para documentação profissional, o serviço <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a> orienta o acesso ao documento. Nunca forneça senha da sua conta gov.br a recrutadores.</p>`.trim()
  },
  "acidente-de-trabalho-o-que-fazer": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Um acidente durante o trabalho ou no trajeto precisa ser tratado primeiro como questão de saúde e segurança. Este guia organiza ações práticas, mas não determina se um caso específico gera benefício, estabilidade ou indenização. Essas conclusões dependem dos fatos, dos documentos e da análise do órgão ou profissional competente.</p>
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
<p>Não publique prontuário, CPF ou fotos de lesão em redes abertas. Para reconhecer contatos falsos que tentam cobrar por benefício ou vaga, consulte também a página de <a href="/seguranca-candidatos">segurança do candidato</a>.</p>
`.trim()
  },
  "assedio-no-trabalho-o-que-fazer": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Violência e assédio no trabalho podem envolver humilhação, isolamento, ameaça, constrangimento sexual, perseguição ou outras condutas que afetam dignidade e segurança. Nem todo conflito ou cobrança profissional é assédio; por isso, é importante registrar fatos concretos e buscar orientação sem tentar fechar um diagnóstico jurídico sozinho.</p>
<h2>Descreva condutas, não rótulos</h2>
<p>Em vez de anotar apenas “meu chefe me assedia”, registre o que foi dito ou feito, em que dia, onde e diante de quem. Uma cobrança de prazo pode ser legítima; xingamentos, ameaças, exposição vexatória ou comentários sexualizados são fatos diferentes e precisam ser descritos com precisão.</p>
<p>O Ministério Público do Trabalho mantém as cartilhas oficiais <a href="https://mpt.mp.br/pgt/publicacoes?td=cartilhas" target="_blank" rel="noopener noreferrer">Violência e Assédio Moral no Trabalho</a> e <a href="https://mpt.mp.br/pgt/publicacoes?td=cartilhas" target="_blank" rel="noopener noreferrer">Violência e Assédio Sexual no Trabalho</a>. Consulte a edição e a data do material, porque conceitos e canais podem ser atualizados.</p>
<h2>Monte uma linha do tempo segura</h2>
<ol><li>Anote data, horário, local, participantes e palavras ou ações observáveis.</li><li>Preserve e-mails, mensagens, escalas ou documentos aos quais você tem acesso legítimo.</li><li>Não edite arquivos para “deixar mais claro”; mantenha o original e uma cópia.</li><li>Liste testemunhas sem combinar versões.</li><li>Guarde o material em conta pessoal protegida, respeitando sigilo de clientes e terceiros.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma atendente recebe comentários sobre o corpo em reuniões e mensagens privadas fora do expediente. A linha do tempo deve separar cada episódio e preservar o conteúdo original. Ela não deve expor colegas ou dados de clientes em uma postagem pública.</p>
<h2>Escolha o canal considerando sua segurança</h2>
<p>Se houver risco imediato, priorize sair do local e buscar apoio. Quando for seguro, verifique se a organização tem RH, ouvidoria, canal de ética, CIPA ou outro procedimento formal. Faça uma comunicação objetiva e guarde o protocolo. Um canal interno pode ajudar, mas não é a única alternativa e não deve ser usado de modo que aumente o risco para a pessoa afetada.</p>
<p>O <a href="https://mpt.mp.br/pgt/servicos/servico-denuncie" target="_blank" rel="noopener noreferrer">Serviço Denuncie do MPT</a> apresenta o encaminhamento por estado. A página pede informações para compreender a irregularidade; leia as orientações antes de enviar. Dependendo do caso, também podem ser relevantes sindicato, assistência jurídica, polícia, serviço de saúde ou outro órgão. Este guia não escolhe o canal por você.</p>
<h2>Cuide da saúde sem transformar sofrimento em prova pública</h2>
<p>Ansiedade, medo, insônia e queda de rendimento merecem atendimento. Procure suporte de saúde e alguém de confiança. Um relato público feito no momento de crise pode revelar dados pessoais, dificultar a proteção de provas e expor outras pessoas. Buscar ajuda não exige narrar tudo em uma rede social.</p>
<h2>Perguntas para organizar a decisão</h2>
<ul><li>Existe risco de ficar sozinho com a pessoa envolvida?</li><li>Quais fatos consigo datar e comprovar sem acessar conteúdo proibido?</li><li>Há um canal formal seguro e como obtenho protocolo?</li><li>Preciso de acompanhamento de saúde ou apoio emocional agora?</li><li>Qual órgão ou profissional pode analisar o meu caso individual?</li></ul>
<p>Não assine retratação, pedido de demissão ou declaração que não compreendeu. Peça cópia e tempo para orientação. Se o problema começou ainda no recrutamento, interrompa pedidos impróprios e consulte a página de <a href="/seguranca-candidatos">segurança para candidatos</a>.</p>
`.trim()
  },
  "atestado-medico-trabalho-como-entregar": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Um documento médico deve ser entregue de forma íntegra, legível e pelo canal correto. Não existe um único procedimento interno para todas as empresas. O trabalhador precisa separar o que consta da lei e das normas profissionais do que é prazo, sistema ou rotina administrativa do empregador.</p>
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
<h2>Checklist de entrega responsável</h2>
<ul><li>Documento original conferido, sem alteração.</li><li>Canal e prazo confirmados no regulamento aplicável.</li><li>Somente destinatários necessários receberam o arquivo.</li><li>Comprovante de entrega guardado.</li><li>Rejeição ou falha de sistema registrada e comunicada.</li><li>Dúvida individual levada à medicina do trabalho, sindicato ou orientação competente.</li></ul>
<p>Não compre atestado e não compartilhe senha, CPF ou documento médico com perfis que prometem “abonar falta”. Suspeitas de fraude também podem colocar a própria pessoa em risco disciplinar e criminal.</p>
`.trim()
  },
  "banco-de-horas-direitos-trabalhador": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Banco de horas é uma forma de compensar variações de jornada; não é um saldo informal controlado apenas pela memória do supervisor. A validade, o prazo de compensação e a forma do acordo dependem da legislação e do instrumento aplicável ao vínculo.</p>
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
<h2>Checklist mensal</h2>
<ul><li>Regra aplicável e vigência identificadas.</li><li>Espelho de ponto conferido antes do fechamento.</li><li>Saldo positivo e negativo compreendidos.</li><li>Compensações registradas com data.</li><li>Divergências comunicadas por escrito.</li><li>Documentos guardados fora do dispositivo corporativo.</li></ul>
<p>Este guia não calcula horas nem declara que um banco específico é válido ou inválido. Para entender também os lançamentos pagos, leia o guia de <a href="/blog/hora-extra-holerite-como-conferir">conferência de horas extras no holerite</a>.</p>
`.trim()
  },
  "convencao-coletiva-holerite-trabalhador": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Convenção coletiva e acordo coletivo podem estabelecer regras relevantes para remuneração, jornada, benefícios e procedimentos. O nome da empresa ou do cargo, sozinho, não identifica qual instrumento se aplica. É preciso conferir categoria, partes, abrangência territorial e período de vigência.</p>
<h2>Entenda a diferença prática</h2>
<p>De forma geral, a convenção é negociada entre entidades sindicais e o acordo envolve sindicato de trabalhadores e uma ou mais empresas. Essa distinção não resolve automaticamente qual texto vale para você. A fonte correta é o instrumento registrado e vigente, combinado com o vínculo concreto.</p>
<p>O Ministério do Trabalho e Emprego explica o registro de <a href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/mediacao/registro-de-convencoes-e-acordo-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">convenções e acordos coletivos</a> e informa que os documentos ficam disponíveis para consulta. Use também o serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>.</p>
<h2>Como localizar o documento certo</h2>
<ol><li>Identifique o CNPJ e a atividade principal do empregador.</li><li>Confirme sua função e a categoria informada nos documentos de admissão.</li><li>Pesquise estado, município, sindicatos e partes envolvidas.</li><li>Confira datas de início e fim da vigência.</li><li>Leia termos aditivos e instrumentos posteriores.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> duas recepcionistas trabalham em empresas diferentes em São Luís. O título do cargo é igual, mas uma atua em clínica e a outra em hotel. Não é seguro copiar o piso ou benefício encontrado para a primeira sem confirmar a categoria e o instrumento da segunda.</p>
<h2>Compare o texto com o holerite</h2>
<p>Separe salário-base, adicionais, descontos e benefícios. Procure no instrumento a cláusula correspondente e leia definições, datas e condições, não apenas o valor destacado. Uma cláusula pode ter exceções, faixas ou requisitos que mudam a comparação.</p>
<p>Se houver divergência, leve ao RH o holerite, a competência e a cláusula completa. Pergunte qual enquadramento foi usado. Se a resposta não esclarecer, procure o sindicato da categoria ou orientação profissional. Este portal não substitui essa análise.</p>
<h2>Evite cinco erros comuns</h2>
<ul><li>Usar instrumento vencido porque o PDF aparece primeiro na busca.</li><li>Confundir proposta interna com direito coletivo registrado.</li><li>Aplicar convenção de outra categoria por semelhança de cargo.</li><li>Ignorar termo aditivo ou data-base.</li><li>Compartilhar recorte sem cabeçalho, vigência e partes.</li></ul>
<h2>Organize uma pasta mínima</h2>
<p>Guarde contrato, holerites, espelhos de ponto e o PDF do instrumento com o endereço e a data de consulta. Nomeie o arquivo com categoria e vigência. Assim, uma dúvida sobre piso, adicional ou benefício pode ser discutida com documento completo.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT atualizada</a> reúne normas gerais sobre negociação coletiva. A lei e o instrumento precisam ser lidos de forma coordenada; um resumo editorial não determina o resultado de um caso individual.</p>
`.trim()
  },
  "escala-6x1-o-que-perguntar": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> “6x1” descreve uma sequência de seis dias de trabalho e um de descanso, mas não informa sozinho a duração diária, os intervalos, a folga dominical, o trabalho em feriados ou o modo de compensação. Antes de aceitar uma vaga, transforme o nome da escala em horários concretos.</p>
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
<h2>Sinais de que ainda faltam informações</h2>
<ul><li>A empresa não informa horário de entrada ou saída.</li><li>A folga depende apenas de aviso verbal no dia anterior.</li><li>O intervalo é descrito de forma contraditória.</li><li>Horas além da escala são tratadas como “ajuda” sem registro.</li><li>Unidade e deslocamentos entre locais não estão claros.</li></ul>
<p>Esses sinais não provam irregularidade, mas justificam pedir esclarecimento antes do aceite. Nenhum guia substitui a leitura do contrato ou a orientação sobre uma escala concreta. Registre a oportunidade no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a> e compare alternativas com os mesmos critérios.</p>
`.trim()
  },
  "hora-extra-holerite-como-conferir": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Conferir hora extra exige comparar jornada registrada, regra aplicável e lançamentos do holerite. Um valor isolado não permite concluir se o pagamento está correto, porque podem existir banco de horas, períodos de fechamento, adicionais previstos em norma coletiva e outros componentes.</p>
<h2>Reúna documentos do mesmo período</h2>
<ol><li>Espelho de ponto ou registro de jornada.</li><li>Escala e alterações comunicadas.</li><li>Holerite da competência correspondente.</li><li>Contrato e política de banco de horas, se houver.</li><li>Acordo ou convenção coletiva vigente.</li></ol>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> reúne regras gerais sobre duração do trabalho, horas suplementares e compensação. A Constituição também prevê remuneração do serviço extraordinário; consulte o texto oficial e o instrumento da categoria em vez de usar calculadora sem contexto.</p>
<h2>Leia o espelho antes do holerite</h2>
<p>Marque os dias em que a saída, a entrada ou o intervalo diferem da escala. Verifique se houve correção manual e se você reconhece o motivo. Não some apenas “tempo dentro da empresa”: deslocamento, espera, intervalo e atividade efetiva podem ter tratamentos distintos conforme os fatos e a regra aplicável.</p>
<p><strong>Exemplo ilustrativo:</strong> o ponto de uma auxiliar mostra saída posterior em dois dias, mas o holerite fecha antes do fim do mês. Antes de afirmar que faltou pagamento, ela confirma o período de apuração e se as horas foram para banco. Se a explicação não aparecer nos documentos, pergunta ao RH por escrito.</p>
<h2>Localize as rubricas no demonstrativo</h2>
<p>Procure descrição, quantidade, referência e valor. Algumas folhas separam hora extra e reflexos; outras usam nomes internos. Não presuma o significado de uma sigla. Peça a legenda ou memória de cálculo e compare com o salário-base, a jornada contratual e o percentual previsto para o caso.</p>
<p>O serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a> ajuda a localizar convenções e acordos registrados. Confirme partes e vigência antes de usar uma cláusula.</p>
<h2>Como perguntar sem fazer acusação precipitada</h2>
<blockquote><p>Olá. No espelho de ponto da competência [mês], identifiquei os registros dos dias [datas]. Não localizei no holerite a rubrica correspondente nem a movimentação no banco de horas. Poderiam informar o período de fechamento e a regra aplicada?</p></blockquote>
<p>Anexe somente documentos necessários e use o canal oficial. Guarde protocolo e resposta. Se houver erro reconhecido, peça a previsão e a forma de correção.</p>
<h2>Não comprometa o próprio registro</h2>
<ul><li>Não bata ponto por colega.</li><li>Não altere captura de tela.</li><li>Não deixe de registrar saída por ordem apenas verbal sem pedir orientação formal.</li><li>Não publique holerite completo com CPF, matrícula ou dados bancários.</li><li>Não aceite cálculo de perfil desconhecido como decisão final.</li></ul>
<p>Se a divergência persistir, leve o conjunto de documentos ao sindicato, à inspeção do trabalho ou a profissional competente. Este guia ensina a conferir e formular perguntas; ele não calcula crédito trabalhista nem substitui perícia contábil.</p>
`.trim()
  },
  "pedido-demissao-aviso-previo-acerto": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Pedir demissão é encerrar o contrato por iniciativa do trabalhador. A decisão pode afetar aviso prévio, datas, descontos e verbas do acerto. Antes de entregar a carta, organize documentos e confirme as consequências para a sua situação; não use um modelo genérico como cálculo definitivo.</p>
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
<h2>Evite decisões sob pressão</h2>
<ul><li>Não assine pedido de demissão escrito por outra pessoa sem conferir se representa sua vontade.</li><li>Não entregue carta em branco ou sem data.</li><li>Não apague mensagens ou comprovantes necessários para entender o acerto.</li><li>Não publique acusações ou dados internos durante a negociação.</li><li>Não pague intermediário que promete “aumentar a rescisão”.</li></ul>
<h2>Quando buscar ajuda</h2>
<p>Se houver coação, doença, acidente, estabilidade, gravidez, afastamento, acordo especial ou divergência relevante, procure o sindicato, assistência jurídica ou profissional habilitado antes de concluir. Esses elementos podem mudar a análise.</p>
<p>Para organizar a mudança sem interromper sua busca, registre propostas reais no <a href="/ferramentas/controle-candidaturas">controle de candidaturas</a>. O Empregos São Luís não recebe cartas de demissão nem calcula verbas rescisórias.</p>
`.trim()
  },
  "abono-pecuniario-ferias-holerite": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Abono pecuniário é a conversão em dinheiro de até um terço do período de férias a que o trabalhador tem direito. Não é a venda informal de dias decidida no corredor, nem significa trabalhar durante todas as férias. A escolha precisa ser documentada e comparada com a necessidade real de descanso.</p>
<h2>O que a CLT estabelece</h2>
<p>O artigo 143 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">Consolidação das Leis do Trabalho</a> permite ao empregado converter um terço do período de férias em abono. O pedido deve ser feito até quinze dias antes do fim do período aquisitivo. Em férias coletivas, a conversão depende de acordo coletivo, não de pedidos individuais isolados.</p>
<p>O artigo 145 prevê que a remuneração das férias e o abono solicitado sejam pagos até dois dias antes do início do descanso. Consulte sempre a versão atualizada da lei e o instrumento coletivo aplicável; este guia não calcula valores.</p>
<h2>Como decidir sem olhar apenas o dinheiro</h2>
<p>Primeiro confirme quantos dias de férias constam do aviso. Depois simule a rotina com menos dias de repouso. O abono pode ajudar em uma despesa planejada, mas não substitui a recuperação física e mental. Pressão da empresa para converter dias ou promessa verbal de pagamento são sinais para pedir esclarecimento formal.</p>
<p><strong>Exemplo ilustrativo:</strong> uma atendente recebe aviso de trinta dias de férias e avalia converter dez. Antes de decidir, verifica a data-limite do pedido, o período efetivo de descanso e como as rubricas aparecerão no recibo. Ela não assina documento retroativo nem trabalha nos dias registrados como férias.</p>
<h2>Documentos para conferir</h2>
<ol><li>Data de admissão e término do período aquisitivo.</li><li>Pedido de abono com data e comprovante de recebimento.</li><li>Aviso de férias com início e fim do descanso.</li><li>Recibo de férias e comprovante do pagamento.</li><li>Holerite da competência, observando rubricas separadas.</li></ol>
<p>Os nomes das rubricas variam entre sistemas. Peça ao RH a memória de cálculo quando não entender a separação entre remuneração de férias, adicional constitucional e abono. Não conclua que houve erro apenas porque a folha usa uma sigla interna.</p>
<h2>Perguntas objetivas ao RH</h2>
<ul><li>Qual é a data final para protocolar o pedido neste período?</li><li>Quantos dias de descanso e quantos dias de abono constarão do aviso?</li><li>Quando o pagamento será feito e onde ficará o recibo?</li><li>Existe férias coletiva ou regra prevista em instrumento coletivo?</li><li>Quem corrige divergência entre aviso, recibo e depósito?</li></ul>
<p>Guarde cópias fora do aparelho corporativo, sem divulgar CPF, conta bancária ou holerite completo. Se houver pressão, documento retroativo ou divergência persistente, procure sindicato, inspeção do trabalho ou orientação jurídica individual. Para entender o ciclo anterior ao pedido, leia também o guia sobre <a href="/blog/ferias-clt-periodo-aquisitivo">período aquisitivo de férias</a>.</p>
`.trim()
  },
  "ferias-clt-periodo-aquisitivo": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Período aquisitivo é o intervalo usado para formar o direito às férias; período concessivo é o prazo seguinte em que o empregador deve concedê-las. Saber essa diferença evita confundir aniversário do contrato com escolha automática da data de descanso.</p>
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
<h2>Se as datas não fecharem</h2>
<p>Peça por escrito a indicação do período aquisitivo, do período programado e do documento que sustenta eventual ajuste. Não assine aviso com data que não corresponde ao que recebeu sem pedir correção. Também não publique recibos com matrícula, CPF ou dados bancários.</p>
<p>Este guia não calcula indenização nem determina a validade de uma concessão. Em caso de atraso, afastamento, rescisão ou divergência relevante, leve contrato, avisos e recibos ao sindicato, à inspeção do trabalho ou a profissional habilitado. Se considerar converter parte do descanso, consulte o guia de <a href="/blog/abono-pecuniario-ferias-holerite">abono pecuniário</a> antes de protocolar o pedido.</p>
`.trim()
  },
  "periodo-experiencia-clt-o-que-saber": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Contrato de experiência é um contrato por prazo determinado usado para que empresa e trabalhador avaliem a relação. Ele não cria um período sem registro, sem salário ou sem regras. As condições essenciais precisam estar claras desde o início.</p>
<h2>Limite legal e documento</h2>
<p>O parágrafo único do artigo 445 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> determina que o contrato de experiência não pode exceder noventa dias. O documento deve permitir identificar início, término e condições pactuadas. Prazo menor pode existir; o limite de noventa dias não autoriza renovações indefinidas.</p>
<p>Não aceite “alguns dias de teste” trabalhando normalmente sem registro e sem definição de pagamento. Processo seletivo, prova prática e contrato de trabalho não são a mesma coisa; quando houver prestação de trabalho real, procure orientação se o vínculo estiver disfarçado.</p>
<h2>Checklist antes de assinar</h2>
<ol><li>Leia datas de início e término e peça uma via.</li><li>Confira cargo, unidade, jornada, intervalo, salário e benefícios.</li><li>Pergunte como será comunicada eventual prorrogação dentro do limite legal.</li><li>Entenda quais tarefas e critérios serão observados.</li><li>Confirme o canal para ponto, atestado, segurança e dúvidas.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> uma auxiliar recebe contrato de quarenta e cinco dias, com possibilidade de prorrogação. Ela anota a data final, guarda a via assinada e pede que qualquer extensão seja formalizada antes do vencimento. Não se orienta apenas por “depois o RH renova”.</p>
<h2>A empresa também está sendo avaliada</h2>
<p>Observe se a escala corresponde à proposta, se há treinamento para tarefas e equipamentos, se o ponto registra a jornada efetiva e se pagamentos e benefícios chegam como combinado. Registre dúvidas por canal oficial. Cobrar clareza não significa recusar avaliação de desempenho.</p>
<p>Acompanhe o vínculo na <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>, lembrando que a atualização depende das informações transmitidas pelo empregador e pode não ser instantânea. Divergência deve ser comunicada com documentos, não corrigida por aplicativos de terceiros.</p>
<h2>No encerramento</h2>
<p>O término na data prevista, a saída antecipada e a continuidade após o prazo podem produzir efeitos diferentes. Não aplique uma tabela genérica para calcular verbas. Peça termo, recibos, comprovantes e explicação das rubricas. Se houver cláusula sobre rescisão antecipada, leia antes de decidir sair.</p>
<ul><li>Não pague taxa para “efetivação”.</li><li>Não entregue senha da conta gov.br.</li><li>Não assine documento em branco ou retroativo.</li><li>Não devolva uniforme ou equipamento sem recibo.</li><li>Não presuma que o silêncio significa prorrogação.</li></ul>
<p>Se o prazo ultrapassar noventa dias, os documentos não coincidirem ou houver trabalho sem registro, procure sindicato, inspeção do trabalho ou orientação jurídica. Para conferir a rotina já iniciada, use também o guia de <a href="/blog/ponto-eletronico-atraso-trabalho">registro de ponto</a>.</p>
`.trim()
  },
  "ponto-eletronico-atraso-trabalho": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Registro de ponto deve refletir a jornada realmente cumprida. Atraso, falha de equipamento e ajuste manual são situações diferentes. Pedir que um colega registre por você ou alterar horário para “fechar a folha” transforma uma dúvida simples em problema de confiabilidade.</p>
<h2>O que a CLT diz sobre pequenas variações</h2>
<p>O artigo 58, §1º, da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> estabelece que variações de até cinco minutos em cada marcação, observado o máximo de dez minutos diários, não são descontadas nem computadas como jornada extraordinária. Isso não é autorização para atrasar todos os dias: trata-se do tratamento da marcação para cálculo da jornada, enquanto assiduidade e disciplina seguem regras próprias e proporcionais.</p>
<p>O artigo 74 determina registro de entrada e saída para estabelecimentos com mais de vinte trabalhadores. A marcação por exceção depende de acordo individual escrito, convenção ou acordo coletivo. O empregado deve saber qual sistema se aplica, sem assumir que toda empresa usa relógio eletrônico.</p>
<h2>Quando o equipamento falha</h2>
<ol><li>Registre a tentativa ou a mensagem de erro sem manipular a tela.</li><li>Avise imediatamente o canal indicado pelo RH.</li><li>Informe horário real e motivo do ajuste.</li><li>Confira o espelho antes do fechamento.</li><li>Guarde protocolo e resposta.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> ao chegar para a abertura de uma loja, a funcionária encontra o terminal fora do ar. Ela fotografa apenas a mensagem do equipamento, sem dados de colegas, avisa a liderança e solicita ajuste com o horário efetivo. Não pede ao próximo turno que bata o ponto em seu lugar.</p>
<h2>Planeje o deslocamento sem inventar justificativa</h2>
<p>Chuva, obras e mudança de linha podem afetar o trajeto em São Luís, mas o mapa consultado fora do horário da escala não mede toda a rotina. Teste o caminho no período real, identifique alternativa e avise assim que perceber que não chegará no horário. Uma justificativa pode explicar o fato; não apaga automaticamente o registro.</p>
<p>Use a <a href="/ferramentas/custo-deslocamento">calculadora de custo de deslocamento</a> com tarifas informadas por você e separe custo de tempo. Para escala noturna, confirme transporte e segurança antes do aceite.</p>
<h2>Como contestar um espelho</h2>
<p>Indique data, marcação exibida, horário que você afirma ter cumprido e documento de apoio. Evite acusação genérica. Uma mensagem objetiva permite localizar o evento: “No dia 14, o sistema mostra saída às 18h, mas permaneci até 18h35 por solicitação registrada no chamado X. Como solicito a correção?”</p>
<ul><li>Não assine espelho que não conferiu.</li><li>Não compartilhe senha ou biometria.</li><li>Não registre jornada de outra pessoa.</li><li>Não apague comprovantes após a correção.</li><li>Não publique tela com nomes e matrículas de colegas.</li></ul>
<p>Se ajustes são recorrentes, negados sem explicação ou não correspondem à jornada, reúna espelhos, escalas e holerites e procure RH, sindicato, inspeção do trabalho ou orientação jurídica. O guia de <a href="/blog/hora-extra-holerite-como-conferir">horas extras no holerite</a> ajuda a comparar documentos do mesmo período.</p>
`.trim()
  },
  "trabalhador-terceirizado-direitos": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Na terceirização, a empresa prestadora contrata e remunera os trabalhadores; a contratante recebe o serviço definido em contrato. Trabalhar dentro da unidade da contratante ou usar crachá de acesso não muda sozinho quem é o empregador formal.</p>
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
<p>Atraso de salário, falta de segurança, rescisão ou continuidade do serviço exigem análise dos fatos e contratos. Leve documentos ao sindicato, à inspeção do trabalho ou a profissional habilitado. Este guia organiza perguntas; não determina responsabilidade em um caso concreto.</p>
`.trim()
  },
  "trabalhar-fim-de-semana-folga-adicional": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Trabalhar no sábado ou no domingo não gera, por si só, um adicional chamado “de fim de semana”. O resultado depende da jornada contratual, do repouso semanal, de feriados, de horas extras e do instrumento coletivo. Misturar essas categorias produz cálculo errado.</p>
<h2>Repouso semanal não é a mesma coisa que feriado</h2>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/leis/l0605.htm" target="_blank" rel="noopener noreferrer">Lei nº 605/1949</a> assegura repouso semanal remunerado de vinte e quatro horas consecutivas, preferencialmente aos domingos. A mesma lei trata separadamente do trabalho em feriados e prevê pagamento em dobro, salvo concessão de outro dia de folga. Não conclua que todo domingo será pago em dobro nem que uma folga compensa qualquer situação.</p>
<p>A <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> reúne regras gerais sobre jornada e descanso. Categoria, atividade e convenção coletiva podem acrescentar escalas, folgas e adicionais específicos.</p>
<h2>Transforme a escala em calendário</h2>
<ol><li>Marque cada dia de trabalho e horário completo.</li><li>Identifique o repouso de vinte e quatro horas.</li><li>Separe domingos de feriados oficiais.</li><li>Registre trocas de folga e quem autorizou.</li><li>Compare com ponto, holerite e banco de horas.</li></ol>
<p><strong>Exemplo ilustrativo:</strong> um atendente trabalha no domingo e descansa na terça-feira. Antes de exigir “adicional de domingo”, ele verifica a escala, o repouso concedido, a existência de feriado e a convenção da categoria. Se trabalhou em feriado sem folga compensatória, registra o dia de forma separada para pedir a memória de cálculo.</p>
<h2>Perguntas na entrevista</h2>
<ul><li>A folga é fixa ou rotativa?</li><li>Com quanta antecedência a escala é divulgada?</li><li>Como funcionam domingos e feriados?</li><li>Existe acordo coletivo ou convenção aplicável?</li><li>Como horas além da escala são registradas?</li><li>Qual o horário real de saída e o transporte disponível?</li></ul>
<p>Para localizar o instrumento registrado, use o serviço oficial <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>. Confira sindicato, empresa ou categoria, município, vigência e eventuais aditivos.</p>
<h2>Deslocamento também entra na decisão</h2>
<p>Uma saída no fechamento de shopping, restaurante ou hotel pode exigir rota diferente da usada durante o dia. Teste o trajeto no horário da escala e confirme como chegar e voltar com segurança. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> usa a tarifa e o número de viagens inseridos por você; ela não presume preço nem benefício.</p>
<p>Se a escala muda sem registro, o repouso não aparece ou o holerite não explica feriado e hora extra, peça esclarecimento por escrito. Leve calendário, ponto, holerite e instrumento coletivo ao sindicato, à inspeção do trabalho ou a profissional habilitado. Este texto não calcula adicional e não substitui análise jurídica.</p>
`.trim()
  },
  "trabalho-noturno-adicional-o-que-perguntar": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Trabalho noturno altera cálculo da jornada e também sono, transporte, alimentação e convivência familiar. Antes de aceitar, peça horário completo e condições práticas; a expressão “turno da noite” não informa quando começa, termina ou como será pago.</p>
<h2>Regra urbana da CLT</h2>
<p>O artigo 73 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> considera noturno, para trabalho urbano, o período entre 22h e 5h. A remuneração tem acréscimo de pelo menos vinte por cento e a hora noturna é computada como cinquenta e dois minutos e trinta segundos. A lei também trata de horários mistos e da prorrogação do trabalho noturno.</p>
<p>Essas regras não devem ser copiadas automaticamente para trabalho rural ou situações com disciplina própria. Norma coletiva pode trazer condições adicionais. Consulte a legislação atualizada e o instrumento aplicável.</p>
<h2>Peça uma escala completa</h2>
<ul><li>Hora de entrada, saída e intervalo.</li><li>Dias trabalhados, folgas e rotação.</li><li>Trechos que atravessam 22h ou 5h.</li><li>Rubrica do adicional no holerite.</li><li>Transporte no início e no fim do turno.</li><li>Refeição, local de descanso e protocolo de segurança.</li></ul>
<p><strong>Exemplo ilustrativo:</strong> uma recepcionista recebe proposta das 21h às 5h20. Ela pede que o RH explique quais horas entram no período noturno, como o intervalo aparece no ponto e se há transporte após a saída. Não calcula o salário final apenas multiplicando horas do relógio, porque a hora reduzida e outras regras precisam estar na memória de cálculo.</p>
<h2>Compare quatro documentos</h2>
<p>Use contrato, escala, espelho de ponto e holerite do mesmo período. Marque plantões trocados e extensões após 5h. Pergunte por escrito sobre rubricas que não reconhece e guarde a resposta. Para norma coletiva, consulte o serviço <a href="https://www.gov.br/pt-br/servicos/consultar-instrumento-coletivo-de-trabalho" target="_blank" rel="noopener noreferrer">Consultar Instrumento Coletivo de Trabalho</a>.</p>
<h2>Proteja o sono e o trajeto</h2>
<p>Verifique se consegue manter período regular de descanso em ambiente escuro e silencioso. Planeje refeições e evite dirigir ou operar equipamento se estiver sonolento. Se a mudança de turno produzir sintomas persistentes, procure atendimento de saúde; um artigo não substitui avaliação clínica.</p>
<p>Em São Luís, confirme a rota exatamente no horário de saída. Não presuma que a linha usada durante o dia circula na madrugada. Use a <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> com os valores que você verificou e considere alternativa segura para falhas do transporte.</p>
<h2>Sinais de informação incompleta</h2>
<ul><li>O anúncio diz apenas “disponibilidade total”.</li><li>O adicional é prometido sem explicar a jornada.</li><li>A saída varia sem escala ou ponto.</li><li>A troca de plantão ocorre só por mensagem informal.</li><li>Não há orientação sobre emergência e trabalho isolado.</li></ul>
<p>Esses sinais pedem esclarecimento, não provam irregularidade por si mesmos. Se ponto e holerite divergirem ou houver risco à saúde e segurança, reúna documentos e procure RH, sindicato, inspeção do trabalho ou orientação profissional.</p>
`.trim()
  },
  "retorno-trabalho-apos-maternidade": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Voltar ao emprego após licença-maternidade e retomar a busca por trabalho são situações diferentes. Em ambas, maternidade não precisa ser tratada como culpa nem como informação a ser escondida; o foco deve ser o que a pessoa precisa para exercer a função com segurança e quais direitos se aplicam ao vínculo.</p>
<h2>Se o retorno é ao mesmo emprego</h2>
<p>Antes da data prevista, confirme por canal oficial o dia, horário, unidade, escala e eventual exame ocupacional. Peça orientação sobre acesso, ponto e mudanças ocorridas durante a licença. Não assine pedido de demissão ou alteração contratual que não compreendeu.</p>
<p>O artigo 396 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer">CLT</a> prevê, até que a criança complete seis meses, dois descansos especiais de meia hora durante a jornada para amamentação, inclusive em caso de adoção. Os horários devem ser definidos em acordo individual entre a mulher e o empregador, e o período pode ser ampliado quando a saúde do filho exigir.</p>
<p>A proteção à maternidade também aparece na <a href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" target="_blank" rel="noopener noreferrer">Constituição Federal e no ADCT</a>. Estabilidade, afastamento, adoção, saúde e situação contratual exigem leitura do caso concreto; não use um resumo para calcular datas ou decidir uma rescisão.</p>
<h2>Converse sobre logística sem expor a criança</h2>
<p><strong>Exemplo ilustrativo:</strong> uma trabalhadora retorna a uma loja com escala rotativa. Ela solicita por escrito a definição dos intervalos do artigo 396 e confirma quem pode ajustar o ponto. Não precisa enviar fotografia, certidão ou informação médica além do documento necessário ao procedimento formal.</p>
<ul><li>Quem confirma a escala da primeira semana?</li><li>Como serão registrados os descansos especiais?</li><li>Existe local apropriado e orientação interna?</li><li>Qual canal atende necessidade de saúde ou adaptação?</li><li>Como comunicar emergência familiar sem divulgar dados em grupo?</li></ul>
<h2>Se o objetivo é voltar ao mercado</h2>
<p>No currículo, descreva experiências, tarefas e resultados verdadeiros. Uma pausa pode ser indicada de forma breve quando necessário para tornar a cronologia compreensível, mas não invente trabalho informal, curso ou cargo para preencher datas. Na entrevista, responda sobre disponibilidade real e condições da vaga; detalhes íntimos da criança não demonstram competência.</p>
<p>Atualize telefone, e-mail e acesso à <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho" target="_blank" rel="noopener noreferrer">Carteira de Trabalho Digital</a>. Pesquise jornada, unidade e deslocamento antes de candidatar. A <a href="/ferramentas/custo-deslocamento">calculadora de deslocamento</a> ajuda a comparar propostas com valores informados por você.</p>
<h2>Planeje uma primeira semana realista</h2>
<ol><li>Teste o trajeto no horário efetivo.</li><li>Defina contatos de emergência e limites de compartilhamento.</li><li>Revise documentos e acessos necessários ao trabalho.</li><li>Reserve margem para adaptação da rotina.</li><li>Registre qualquer combinação relevante com o RH.</li></ol>
<p>Se houver pressão para pedir demissão, discriminação, recusa de direito, risco à saúde ou divergência sobre estabilidade, preserve mensagens e documentos e procure sindicato, inspeção do trabalho, assistência jurídica ou profissional habilitado. Este guia oferece organização prática; não substitui avaliação jurídica ou médica.</p>
`.trim()
  },

  "como-ler-holerite-descontos": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> O holerite é um registro para conferir, não uma conta que o trabalhador precisa aceitar sem entender. Compare o documento com o contrato, o controle de jornada e o valor que entrou na conta. Não use uma tabela antiga da internet para concluir que há erro: alíquotas, bases e regras podem mudar.</p>
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
<p>Não compare apenas dois líquidos: férias, afastamento, adiantamento, início ou término no meio do mês e fechamento de ponto podem alterar o resultado. Compare primeiro as rubricas e bases. Se receber folha retificadora, preserve também a versão anterior e a resposta que explica o motivo.</p>
<p>Guarde holerites, espelhos de ponto, contrato e comprovantes em local pessoal seguro. Se a diferença persistir, peça memória de cálculo ao empregador e consulte o sindicato da categoria ou profissional habilitado. Este guia ajuda a organizar a conferência; não calcula tributos nem substitui análise contábil ou jurídica.</p>
`.trim()
  },
  "freelancer-ou-clt-vantagens": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> “Freelancer” descreve uma forma comum de prestar serviços, mas não resolve sozinho se existe ou não vínculo de emprego. A escolha prática deve considerar autonomia real, previsibilidade de renda, custos, proteção previdenciária e o contrato proposto — não apenas o valor anunciado.</p>
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
<p>Não abra CNPJ, pague taxa ou entregue senha gov.br só porque um anúncio exige urgência. Se a rotina real divergir do contrato ou houver dúvida sobre vínculo, tributação ou contribuição, leve os documentos a profissional habilitado. Este conteúdo é um roteiro de decisão, não enquadramento jurídico automático.</p>
`.trim()
  },
  "mitos-direitos-trabalhistas-whatsapp": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Mensagens virais misturam regra geral, exceção, decisão sobre um caso específico e informação já superada. Em vez de responder “verdadeiro” ou “falso” sem contexto, verifique a fonte, a data, a categoria profissional e o documento aplicável.</p>
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
<p>Ao compartilhar uma correção, envie o link oficial e uma frase limitada: “esta fonte diz X; é preciso confirmar se se aplica ao seu contrato”. Não exponha holerite, atestado ou dados de colegas em grupo. Se houver prazo, desconto, dispensa ou risco à saúde, preserve os documentos e procure orientação individual. Este guia combate desinformação; não oferece parecer jurídico.</p>
`.trim()
  },
  "servicos-gerais-epi-vaga": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Em uma vaga de serviços gerais, perguntar sobre risco e proteção é parte da avaliação profissional. “Usa luva” não basta: o equipamento precisa corresponder ao risco da tarefa, ter orientação de uso e estar integrado às medidas de prevenção do local.</p>
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
<p>Não compre EPI exigido pela vaga como condição para participar de seleção e não aceite pagamento para “kit obrigatório” enviado por desconhecido. Em risco imediato, falta de orientação ou recusa de substituição, procure a supervisão e os canais de segurança do trabalho; conforme o caso, sindicato, inspeção do trabalho ou atendimento de saúde. O guia não substitui avaliação técnica do ambiente.</p>
`.trim()
  },
  "sindicato-trabalhador-direitos-basico": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Para procurar um sindicato, comece pela categoria e pela base territorial, não pelo nome que apareceu em uma mensagem. Entidades diferentes podem representar trabalhadores e empregadores, categorias distintas ou regiões diferentes.</p>
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
<p>O sindicato pode orientar e negociar, mas a resposta para um caso individual depende dos fatos e documentos. Em prazo de rescisão, risco à saúde, assédio ou conflito relevante, busque também assistência jurídica ou o órgão competente. Este guia ensina a verificar identidade e fonte; não indica entidade específica nem presume filiação.</p>
`.trim()
  },
  "transferencia-interna-emprego-como-pedir": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Transferência interna pode significar mudança de equipe, turno, função, unidade ou cidade. Antes de pedir, defina qual dessas mudanças você quer e que problema ela resolve para a organização sem ocultar os impactos para você.</p>
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
<p>Para avaliar o pacote total, some salário líquido estimado, benefícios confirmados e custo do trajeto; não converta benefício em dinheiro na sua planilha como se a rede fosse irrestrita. Dúvidas sobre natureza da parcela, instrumento coletivo ou desconto exigem orientação individual. Este guia apoia a comparação, não interpreta seu contrato.</p>
`.trim()
  },
  "documentos-admissao-emprego-maranhao": {
    reviewedAt: "2026-10-12",
    contentHtml: `
<p><strong>Revisão editorial: 12 de outubro de 2026.</strong> Não existe uma lista única que sirva para toda admissão. Os documentos necessários dependem do vínculo, da função e dos registros que o empregador precisa realizar. A empresa deve informar a relação e um canal seguro; o candidato deve evitar enviar dados extras “por garantia”.</p>
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
<p>Se houver dúvida, não comece atividade sem confirmação do vínculo e dos responsáveis. Divergência no registro, exigência discriminatória ou uso indevido de dados deve ser documentado e levado ao canal de privacidade, sindicato, inspeção do trabalho ou orientação jurídica conforme o caso. Este guia não cria uma lista universal nem substitui a instrução formal do empregador.</p>
`.trim()
  },
};

export function getEditorialContentOverride(slug: string) {
  return overrides[slug] ?? null;
}

