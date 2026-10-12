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
  }
};

export function getEditorialContentOverride(slug: string) {
  return overrides[slug] ?? null;
}

