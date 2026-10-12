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
  }
};

export function getEditorialContentOverride(slug: string) {
  return overrides[slug] ?? null;
}

