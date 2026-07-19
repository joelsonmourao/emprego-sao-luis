import type { InstitutionalSlug } from "./site-pages";

const contactPlaceholder = (field: string) =>
  `<span data-admin-field="${field}">[configurável no painel administrativo]</span>`;

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
<h2>Outros canais</h2>
<p>E-mail institucional: ${contactPlaceholder("contactEmail")}</p>
<p>WhatsApp (quando disponível): ${contactPlaceholder("whatsapp")}</p>
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
<p>Você pode solicitar acesso, correção, exclusão ou revogação de consentimento pelo canal LGPD: ${contactPlaceholder("lgpdEmail")} ou pelo <a href="/contato">formulário de contato</a> (categoria Privacidade/LGPD).</p>
<h2>Encarregado</h2>
<p>Responsável LGPD: ${contactPlaceholder("lgpdOfficer")}</p>
<p><em>Última atualização: junho de 2026.</em></p>
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
<p>No primeiro acesso, o banner permite aceitar todos, recusar não essenciais ou personalizar categorias. Você pode alterar depois pelo link de cookies no rodapé.</p>
<p><em>Última atualização: junho de 2026.</em></p>
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
<p>Envie pedido pelo <a href="/contato">formulário</a> (categoria Privacidade/LGPD) ou e-mail ${contactPlaceholder("lgpdEmail")}. Responderemos em prazo razoável.</p>
<h2>Encarregado</h2>
<p>${contactPlaceholder("lgpdOfficer")}</p>
`,
  "politica-editorial": `
<p>Conteúdos de notícias e blog seguem critérios de clareza, fonte identificada e relevância para o mercado de trabalho em São Luís e Maranhão.</p>
<h2>Correções</h2>
<p>Erros podem ser reportados pelo contato. Alterações relevantes são datadas quando necessário.</p>
`,
  "politica-correcoes": `
<p>Reporte erros em vagas, links ou textos pelo formulário de contato. Indique URL, código da vaga (ES-000000) e descrição do problema.</p>
`,
  "politica-fontes": `
<p>Priorizamos fontes oficiais, empresas identificadas e evidências verificáveis. Vagas sem fonte clara podem ser retidas para revisão.</p>
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
<p>Quando houver vagas na operação do portal, divulgaremos nesta página e no Instagram. Envie perfil pelo contato com assunto “Trabalhe conosco”.</p>
`
};
