/**
 * HTML público dos posts sl-local (sem menção a AdSense / meta interno).
 */
import { MIN_USEFUL_CHARS } from "./sl-local-editorial-catalog.mjs";

/** @param {import("./sl-local-editorial-catalog.mjs").CatalogItem} item */
export function buildArticleHtml(item) {
  const tips = item.tips.map((t) => `<li>${t}</li>`).join("");
  const paragraphs = [
    `<p>${item.lead}</p>`,
    `<p>${item.localAngle}</p>`,
    `<h2>O que observar antes de candidatar</h2>`,
    `<p>Leia o anúncio até o fim: cidade ou bairro, tipo de contrato, horário, requisitos e o canal oficial (e-mail, WhatsApp ou link). Se faltar informação essencial, pergunte pelo canal indicado — e desconfie de qualquer cobrança para “garantir” vaga, uniforme ou cadastro.</p>`,
    `<h2>Passo a passo</h2>`,
    `<ol>${tips}</ol>`,
    `<h2>Como se organizar na Grande Ilha</h2>`,
    `<p>Anote em uma lista simples: data, cargo, bairro ou região, empresa ou intermediário, canal usado e se houve retorno. Isso evita reenvio confuso e mostra quais tipos de vaga respondem melhor ao seu perfil em São Luís.</p>`,
    `<p>Para entrevista presencial, saia com margem para trânsito e chuva, leve documento com foto e uma cópia do currículo. No WhatsApp ou e-mail, use mensagem curta: nome, vaga, disponibilidade e currículo em PDF — sem dados bancários nem foto de documento no primeiro contato.</p>`,
    `<h2>Próximo passo</h2>`,
    `<p>Abra a <a href="/vagas">busca de vagas</a> no Empregos São Luís, filtre pelo seu perfil e candidate-se só pelos canais oficiais da publicação. Em dúvida sobre golpe, veja a página de <a href="/seguranca-candidatos">segurança do candidato</a>. A candidatura do trabalhador no portal continua gratuita e sem cadastro obrigatório.</p>`,
    `<p>Sobre <strong>${item.title}</strong>: use este guia como checklist prático, não como promessa de contratação. Priorize empresas identificáveis, combine por escrito o que for possível e mantenha ritmo constante de candidaturas bem lidas — qualidade rende mais do que volume sem critério.</p>`,
    `<p>Em São Luís e na Grande Ilha, deslocamento, horário de comércio e clareza do anúncio pesam tanto quanto o currículo. Revise este material quando mudar de área ou retomar a busca, e combine com candidaturas no <a href="/vagas">portal de vagas</a>.</p>`
  ];
  const html = paragraphs.join("\n");
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length < MIN_USEFUL_CHARS) {
    throw new Error(`HTML abaixo da meta (${plain.length} < ${MIN_USEFUL_CHARS}) para: ${item.title}`);
  }
  return html;
}
