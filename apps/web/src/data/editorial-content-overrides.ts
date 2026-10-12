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
};

export function getEditorialContentOverride(slug: string) {
  return overrides[slug] ?? null;
}

