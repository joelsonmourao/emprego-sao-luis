import type { InstitutionalSlug } from "./site-pages";

export const INSTITUTIONAL_DEFAULTS_HTML: Record<InstitutionalSlug, string> = {
  "quem-somos": `
<p>O <strong>Empregos São Luís</strong> é o portal de vagas com foco em São Luís, Região Metropolitana e cidades do Maranhão. Nosso propósito é conectar empresas e candidatos com informação clara, gratuita para quem busca emprego e alinhada ao que já conhecem no Instagram <a href="https://www.instagram.com/empregosaoluis/" target="_blank" rel="noopener">@empregosaoluis</a>.</p>
<h2>O que fazemos</h2>
<p>Organizamos oportunidades publicadas por empresas, fontes oficiais e parceiros. Cada vaga indica empresa, local, tipo de contrato e link ou canal oficial de candidatura. O portal complementa o Instagram com busca, filtros, alertas por e-mail e páginas por cidade, categoria e empresa.</p>
<h2>Como as vagas são divulgadas</h2>
<ul>
<li>Vagas importadas de planilhas e fontes verificadas pela equipe editorial</li>
<li>Publicações pagas de empresas após confirmação de pagamento ou aprovação manual</li>
<li>Destaques também no Instagram, quando previsto no plano contratado</li>
</ul>
<h2>Independência do processo seletivo</h2>
<p>Não participamos da triagem, entrevistas ou contratação. O candidato é direcionado ao canal informado pela empresa. Não cobramos do candidato para visualizar ou se candidatar a vagas listadas no portal.</p>
<h2>Responsabilidade das empresas</h2>
<p>Empregadores e anunciantes são responsáveis pela veracidade das informações publicadas. Denúncias e correções podem ser enviadas pela página de <a href="/contato">contato</a> ou pela página de <a href="/seguranca-candidatos">segurança para candidatos</a>.</p>
<h2>Canais oficiais</h2>
<ul>
<li>Site: <a href="https://empregossaoluis.com.br">empregossaoluis.com.br</a></li>
<li>Instagram: <a href="https://www.instagram.com/empregosaoluis/" target="_blank" rel="noopener">@empregosaoluis</a></li>
<li>Contato: <a href="/contato">formulário oficial</a></li>
</ul>
<h2>Segurança</h2>
<p>Desconfie de cobranças para participar de seleção, pedidos de Pix suspeitos e mensagens fora dos canais da empresa. Consulte nossas orientações em <a href="/seguranca-candidatos">Segurança para candidatos</a>.</p>
`,
  sobre: `
<p>O Empregos São Luís é um portal independente de divulgação de vagas, com transparência sobre fontes e compromisso com a experiência do candidato na região de São Luís e Maranhão.</p>
<h2>Missão</h2>
<p>Facilitar o acesso a oportunidades de trabalho locais, com informação organizada e canais oficiais de candidatura.</p>
<h2>O que o portal entrega</h2>
<p>Reunimos vagas, notícias e guias de carreira em uma navegação comum. As páginas de oportunidade mostram os dados recebidos da fonte, o prazo informado e os canais disponíveis; conteúdos editoriais passam por cadastro de autoria, fontes e revisão antes da publicação.</p>
<h2>Para candidatos</h2>
<p>Pesquisar, filtrar, visualizar e acessar canais de candidatura é gratuito. Alertas, conteúdos e recursos destinados à procura de emprego também não exigem pagamento. O portal não vende destaque de currículo nem cobra para liberar contato de vaga.</p>
<h2>Para empresas</h2>
<p>A operação é financiada por publicidade e serviços destinados a empregadores, como publicação e destaque de vagas, perfis empresariais e campanhas patrocinadas claramente identificadas. A relação comercial não transforma publicidade em recomendação editorial.</p>
<h2>Limites e transparência</h2>
<p>Não somos a empresa contratante e não conduzimos processos seletivos. Informações podem mudar na fonte original; por isso mantemos canais para correções, denúncias e dúvidas em <a href="/contato">Contato</a>.</p>
`,
  contato: `
<p>Use o formulário abaixo para falar com a equipe do Empregos São Luís. Cada mensagem recebe um protocolo e é registrada no painel administrativo.</p>
<h2>Categorias de atendimento</h2>
<ul>
<li>Suporte ao candidato</li>
<li>Correção de vaga ou link quebrado</li>
<li>Denúncia de fraude ou vaga suspeita</li>
<li>Empresa e publicação de vagas</li>
<li>Publicidade e parcerias</li>
<li>Pagamento e planos comerciais</li>
<li>Privacidade e LGPD</li>
<li>Outros assuntos</li>
</ul>
<h2>Canal oficial de atendimento</h2>
<p>O canal principal é o <a href="/contato">formulário de contato</a>, que gera protocolo e registro no painel administrativo. Quando um e-mail ou WhatsApp institucional estiver publicado pela equipe, ele será informado nesta página sem placeholders.</p>
<p>Horário de resposta: em dias úteis, conforme disponibilidade da equipe.</p>
`,
  privacidade: `
<p>Esta Política de Privacidade descreve como o portal <strong>Empregos São Luís</strong> (empregossaoluis.com.br) coleta, usa e protege dados pessoais.</p>
<h2>Dados coletados</h2>
<ul>
<li>Formulário de contato: nome, e-mail, telefone opcional, assunto, categoria e mensagem</li>
<li>Alertas de vagas: e-mail e preferências de filtro</li>
<li>Conta de candidato (opcional): e-mail, nome e vagas salvas</li>
<li>Pedidos comerciais: dados da empresa, responsável, CNPJ quando informado e dados de cobrança</li>
<li>Dados técnicos: IP hasheado, navegador, páginas visitadas e eventos de consentimento</li>
</ul>
<h2>Finalidades</h2>
<p>Operar o portal, responder contatos, enviar alertas solicitados, processar pedidos de empresas, medir audiência (com consentimento), exibir publicidade (com consentimento), proteger o painel e cumprir obrigações legais.</p>
<h2>Base legal</h2>
<p>Execução de serviço solicitado, consentimento quando aplicável (cookies, alertas, marketing) e legítimo interesse em segurança e melhoria do portal.</p>
<h2>Compartilhamento</h2>
<p>Podemos usar provedores de hospedagem, e-mail, pagamento, análise e publicidade. Não vendemos dados pessoais. Links de candidatura levam a sites de terceiros com políticas próprias.</p>
<h2>Retenção</h2>
<p>Mantemos dados pelo tempo necessário às finalidades ou exigências legais. Contatos e pedidos comerciais permanecem em registros de auditoria conforme política interna.</p>
<h2>Direitos do titular</h2>
<p>Você pode solicitar acesso, correção, exclusão ou revogação de consentimento pelo <a href="/contato">formulário de contato</a> na categoria Privacidade/LGPD. A equipe registra o protocolo e responde em prazo razoável.</p>
<h2>Encarregado</h2>
<p>O responsável LGPD é indicado publicamente nesta página quando nomeado formalmente. Até lá, use o formulário de contato com a categoria Privacidade/LGPD.</p>
<p><em>Última atualização: julho de 2026.</em></p>
`,
  cookies: `
<p>Esta Política de Cookies explica como o Empregos São Luís utiliza cookies e tecnologias semelhantes.</p>
<h2>Cookies necessários</h2>
<p>Essenciais para segurança, sessão administrativa, preferências de consentimento e funcionamento de formulários.</p>
<h2>Preferências</h2>
<p>Armazenam escolhas do banner de cookies para não solicitar novamente em cada visita.</p>
<h2>Métricas</h2>
<p>Com seu consentimento, cookies analíticos ajudam a entender páginas mais acessadas e melhorar a experiência.</p>
<h2>Publicidade</h2>
<p>Com consentimento, cookies de publicidade podem apoiar exibição e medição de anúncios, incluindo Google AdSense quando ativo.</p>
<h2>Gerenciamento</h2>
<p>Quando a gestão de consentimento está ativa, o banner permite aceitar ou recusar cookies não essenciais. A escolha fica registrada no navegador e pode ser redefinida pelo link de cookies no rodapé.</p>
<p><em>Última atualização: agosto de 2026.</em></p>
`,
  termos: `
<p>Estes Termos de Uso regulam o acesso ao portal Empregos São Luís. Ao utilizar o site, você concorda com estas condições.</p>
<h2>Finalidade</h2>
<p>Portal de divulgação e agregação de vagas em São Luís e Maranhão. Não somos empregador das vagas listadas.</p>
<h2>Candidatura</h2>
<p>O candidato acessa o canal oficial informado na vaga. O portal não garante contratação nem participa da seleção.</p>
<h2>Empresas anunciantes</h2>
<p>Empresas devem fornecer informações verdadeiras, respeitar a legislação trabalhista e não publicar vagas fraudulentas. A publicação paga exige pagamento aprovado ou liberação manual autorizada.</p>
<h2>Proibições</h2>
<ul>
<li>Fraude, spam ou tentativa de acesso não autorizado</li>
<li>Coleta automatizada que prejudique o portal</li>
<li>Uso da marca sem autorização</li>
</ul>
<h2>Disponibilidade</h2>
<p>O portal pode passar por manutenção. Vagas expiradas são removidas de listagens e sitemaps conforme regras editoriais.</p>
<h2>Contato</h2>
<p>Dúvidas: <a href="/contato">página de contato</a>.</p>
<p><em>Última atualização: junho de 2026.</em></p>
`,
  lgpd: `
<p>O Empregos São Luís respeita a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).</p>
<h2>Titulares</h2>
<p>Candidatos, visitantes, assinantes de alertas e empresas que utilizam nossos serviços.</p>
<h2>Direitos</h2>
<ul>
<li>Confirmação e acesso aos dados</li>
<li>Correção de dados incompletos ou desatualizados</li>
<li>Anonimização, bloqueio ou eliminação</li>
<li>Portabilidade, quando aplicável</li>
<li>Revogação do consentimento</li>
<li>Informação sobre compartilhamento</li>
</ul>
<h2>Como solicitar</h2>
<p>Envie pedido pelo <a href="/contato">formulário</a> na categoria Privacidade/LGPD. Cada solicitação recebe protocolo e acompanhamento interno.</p>
<h2>Encarregado</h2>
<p>Quando houver encarregado nomeado, o nome e o canal oficial constarão nesta página. Enquanto isso, o atendimento LGPD é feito pelo formulário de contato.</p>
`,
  "politica-editorial": `
<p>Esta página explica como produzimos notícias, guias e análises sobre trabalho em São Luís e no Maranhão. Nosso objetivo é oferecer informação local útil, verificável e gratuita para quem procura emprego.</p>
<h2>Seleção de temas</h2>
<p>Priorizamos dúvidas práticas de candidatos, mudanças relevantes no mercado de trabalho local, dados públicos e assuntos que ajudem o leitor a avaliar oportunidades com mais segurança. Não publicamos um texto apenas para repetir uma palavra-chave ou aumentar artificialmente o número de páginas.</p>
<h2>Apuração e fontes</h2>
<p>Cada conteúdo deve registrar a origem das informações utilizadas. Notícias exigem referência verificável; guias distinguem orientação editorial de regras oficiais. Quando uma afirmação depende de órgão público, empresa ou pesquisa, procuramos indicar a fonte correspondente.</p>
<h2>Autoria e revisão</h2>
<p>Os artigos exibem a autoria cadastrada e as datas de publicação e atualização. O painel interno verifica estrutura, fontes, utilidade local, links, repetição e possível semelhança com outros textos. Alertas automáticos apoiam a revisão humana e não substituem a decisão editorial.</p>
<h2>Atualizações, correções e conteúdo patrocinado</h2>
<p>Alterações relevantes podem ser identificadas pela data de atualização. Erros podem ser reportados pelo <a href="/contato">contato</a> e seguem nossa <a href="/politica-correcoes">política de correções</a>. Conteúdo patrocinado, quando existir, deve ser claramente identificado e não pode condicionar o acesso de candidatos a vagas.</p>
`,
  "politica-correcoes": `
<p>Reporte erros em vagas, links ou textos pelo formulário de contato. Indique URL, código da vaga (ES-000000), descrição do problema e, quando possível, uma fonte que permita conferir a informação.</p>
<h2>Como o relato é avaliado</h2>
<p>A equipe compara o apontamento com a fonte registrada, o conteúdo publicado e o histórico disponível no painel. Um alerta automático pode indicar o problema, mas não substitui a conferência humana quando a correção altera fatos, datas, valores ou canais de candidatura.</p>
<h2>O que acontece depois</h2>
<p>Quando a correção é confirmada, a equipe atualiza o registro e mantém a alteração na trilha administrativa. Conteúdos editoriais exibem a data de atualização quando a mudança é relevante para a compreensão do leitor. Uma vaga sem confirmação suficiente pode ser pausada, encerrada ou encaminhada para revisão, sem inventar dados ausentes.</p>
<h2>Correções que dependem da fonte</h2>
<p>Se uma empresa ou órgão não oferece evidência verificável, o portal pode sinalizar a informação como inconclusiva. Respostas HTTP 403, 429 e falhas temporárias de rede não são tratadas isoladamente como prova de encerramento de uma vaga.</p>
<h2>Como acompanhar</h2>
<p>Use o protocolo gerado no <a href="/contato">formulário de contato</a>. Dados pessoais enviados para a apuração seguem a <a href="/privacidade">Política de Privacidade</a>.</p>
`,
  "politica-fontes": `
<p>Priorizamos fontes oficiais, empresas identificadas, órgãos públicos e evidências verificáveis. Vagas sem fonte clara podem ser retidas para revisão e não devem ser apresentadas como confirmadas.</p>
<h2>Hierarquia de fontes</h2>
<ul>
<li>Páginas oficiais de carreiras, concursos, seleções e comunicados de órgãos públicos</li>
<li>Sites, perfis e documentos publicados pela própria empresa responsável pela oportunidade</li>
<li>Plataformas de recrutamento quando identificam empresa, prazo e canal de candidatura</li>
<li>Fontes secundárias confiáveis, usadas como apoio e não como substituição de uma origem disponível</li>
</ul>
<h2>Como a informação é conferida</h2>
<p>O endereço de origem, o canal de candidatura, a identidade da empresa, a cidade e a validade são campos independentes. A presença de um link não confirma automaticamente todo o restante. O painel sinaliza ausência de fonte, dados inconsistentes e links inconclusivos para revisão.</p>
<h2>Notícias e guias</h2>
<p>Notícias devem registrar referência externa verificável e contexto local. Guias podem explicar práticas e dúvidas recorrentes, mas precisam separar orientação editorial de regras oficiais e indicar a fonte quando citam legislação, dados ou declarações.</p>
<h2>Fontes patrocinadas e conflitos</h2>
<p>Uma relação comercial não torna uma informação verdadeira nem garante publicação editorial. Conteúdo patrocinado é identificado, e a candidatura continua gratuita para o candidato.</p>
<h2>Correções</h2>
<p>Quando uma fonte muda ou um erro é confirmado, aplicamos a <a href="/politica-correcoes">Política de Correções</a>. Bloqueios temporários, como 403, 429 ou timeout, exigem cautela e não encerram uma vaga por si só.</p>
`,
  redacao: `
<p><strong>Redação Empregos São Luís</strong> é a assinatura institucional usada em conteúdos produzidos e revisados pela equipe do portal. Ela não representa um jornalista fictício e não substitui a identificação de um autor individual quando houver.</p>
<h2>Como as pautas são selecionadas</h2>
<p>Priorizamos dúvidas práticas de candidatos, fatos com impacto no mercado de trabalho local, informações públicas sobre São Luís e Maranhão e orientações que ajudem o leitor a avaliar oportunidades com segurança. Não criamos páginas apenas para repetir palavras-chave ou aumentar artificialmente o volume do site.</p>
<h2>Como a publicação é revisada</h2>
<p>O fluxo editorial registra tipo, autoria, fontes, datas, metadados, pilar e cluster. O painel sinaliza texto curto, repetição, similaridade, falta de contexto local, links ausentes e outros riscos. A classificação automática é um indicador interno; a decisão de manter, melhorar ou retirar temporariamente do índice exige revisão responsável.</p>
<h2>Fontes e apuração</h2>
<p>Notícias precisam de fonte verificável. Guias que citam dados, leis ou regras oficiais devem apontar a origem correspondente. Consulte a <a href="/politica-fontes">Política de Fontes</a> para entender a hierarquia e os limites dessa verificação.</p>
<h2>Atualizações e correções</h2>
<p>Os conteúdos exibem data de publicação e, quando aplicável, data de atualização. Relatos enviados pelo <a href="/contato">Contato</a> são comparados com as fontes e o histórico disponível. O procedimento completo está na <a href="/politica-correcoes">Política de Correções</a>.</p>
<h2>Independência e gratuidade</h2>
<p>Publicidade e conteúdo patrocinado são identificados. Nenhum pagamento de empresa condiciona o acesso de candidatos às vagas, aos links de candidatura ou aos conteúdos do portal.</p>
`,
  "seguranca-candidatos": `
<p><strong>Nunca pague para participar de processo seletivo.</strong> O Empregos São Luís não cobra candidatos. Desconfie de qualquer pedido de Pix, taxa de cadastro ou compra de uniforme antes da contratação formal.</p>
<h2>Golpes comuns</h2>
<ul>
<li>Pedido de depósito ou Pix para “garantir vaga”</li>
<li>Entrevistas apenas por mensagem, sem dados verificáveis da empresa</li>
<li>Solicitação de senha bancária, cartão ou documentos originais por WhatsApp</li>
<li>E-mails de domínios que não correspondem à empresa anunciante</li>
</ul>
<h2>Como verificar</h2>
<ul>
<li>Confirme o domínio do site de candidatura</li>
<li>Pesquise a empresa e compare telefones oficiais</li>
<li>Prefira canais informados na própria vaga do portal</li>
</ul>
<h2>Denunciar</h2>
<p>Vaga suspeita? Use o <a href="/contato">contato</a> (categoria Denúncia) informando o código ES da vaga.</p>
<h2>Papel do portal</h2>
<p>Divulgamos oportunidades e orientamos candidatos, mas a seleção é responsabilidade exclusiva da empresa anunciante.</p>
<div class="mt-6"><a class="es-btn es-btn-primary" href="/contato">Denunciar vaga suspeita</a></div>
`,
  "anunciar-vaga": `
<p>Esta página foi substituída pelo fluxo comercial em <a href="/publicar-vaga">Publicar vaga</a>. Lá você escolhe um plano, identifica a empresa e conclui o pagamento antes da liberação do crédito para cadastro da vaga.</p>
`,
  "area-empresas": `
<p>A <strong>área para empresas</strong> do Empregos São Luís oferece divulgação de vagas no site e, conforme o plano, destaque no Instagram @empregosaoluis.</p>
<h2>Benefícios</h2>
<ul>
<li>Alcance local em São Luís e Maranhão</li>
<li>Página da vaga com SEO e código ES rastreável</li>
<li>Integração com stories e feed (planos compatíveis)</li>
<li>Painel de acompanhamento de pedido e créditos</li>
</ul>
<h2>Como publicar</h2>
<ol>
<li>Acesse <a href="/publicar-vaga">Publicar vaga</a></li>
<li>Escolha o plano</li>
<li>Informe os dados da empresa</li>
<li>Conclua o pagamento ou aguarde aprovação manual</li>
<li>Cadastre a vaga após liberação do crédito</li>
</ol>
<h2>Plano personalizado</h2>
<p>Para pacotes maiores ou condições especiais, use “Falar com o comercial” no fluxo de publicação.</p>
`,
  "trabalhe-conosco": `
<p>Esta é a página oficial para oportunidades de trabalho na operação do Empregos São Luís.</p>
<h2>Vagas abertas</h2>
<p>No momento, não há processo seletivo próprio anunciado nesta página. Quando houver, cada oportunidade será publicada com atividade, requisitos, prazo e canal oficial de candidatura.</p>
<h2>Envio espontâneo</h2>
<p>Não solicitamos pagamento, compra de curso ou taxa para participar de seleção. Se desejar apresentar seu perfil para oportunidades futuras, use o <a href="/contato">formulário de contato</a> com o assunto “Trabalhe conosco”. O envio não garante abertura de vaga ou contratação.</p>
<h2>Segurança</h2>
<p>Confirme sempre se a comunicação aponta para este domínio ou para um canal publicado oficialmente pelo portal. Denuncie cobranças e mensagens suspeitas pela página de <a href="/seguranca-candidatos">Segurança para candidatos</a>.</p>
`
};
