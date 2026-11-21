/**
 * Reescritas seguras de HTML público quando o Modo Portal Editorial está ativo.
 * Não altera o banco — só a renderização, para não apontar o leitor a áreas pausadas.
 */

const JOB_BOARD_HREF =
  /href=(["'])(\/(?:vagas|vagas-slz|slz|slz-vagas|slz-empregos|empregos-slz|busca|alertas|publicar-vaga|anunciar-vaga|area-empresas|empresas|categorias|cidades)(?:\/[^"']*)?)\1/gi;

const JOB_BOARD_CTA_PHRASES = [
  [/busca de vagas em São Luís/gi, "guias de emprego em São Luís"],
  [/página de vagas/gi, "blog de carreira"],
  [/Compare vagas abertas/gi, "Leia mais orientações"],
  [/via <a([^>]*)>Empregos São Luís<\/a>/gi, 'no <a$1>blog do Empregos São Luís</a>']
] as const;

/** Destino editorial estável enquanto o quadro público está pausado. */
export function portalSafeHrefForJobBoardPath(pathname: string): string {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/empresas") || path.startsWith("/categorias") || path.startsWith("/cidades")) {
    return "/blog";
  }
  if (path.startsWith("/alertas") || path.startsWith("/busca")) {
    return "/blog";
  }
  if (
    path.startsWith("/publicar-vaga") ||
    path.startsWith("/anunciar-vaga") ||
    path.startsWith("/area-empresas")
  ) {
    return "/contato";
  }
  return "/blog";
}

/**
 * Substitui links de áreas de vagas pausadas por destinos editoriais.
 * Idempotente e conservador: só reescreve href conhecidos do job board.
 */
export function rewriteJobBoardLinksForPortal(html: string): string {
  if (!html) return html;
  let out = html.replace(JOB_BOARD_HREF, (_full, quote: string, path: string) => {
    const safe = portalSafeHrefForJobBoardPath(path);
    return `href=${quote}${safe}${quote}`;
  });
  for (const [pattern, replacement] of JOB_BOARD_CTA_PHRASES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export const EDITORIAL_LOGO_ALT = "Empregos São Luís — emprego, carreira e notícias em São Luís";

/** ALT de logo sem linguagem de quadro de vagas (portal editorial). */
export function resolveLogoAltForPortal(currentAlt: string | null | undefined, portalEnabled: boolean): string {
  const alt = String(currentAlt ?? "").trim();
  if (!portalEnabled) return alt || EDITORIAL_LOGO_ALT;
  if (!alt) return EDITORIAL_LOGO_ALT;
  if (/\bvagas\b/i.test(alt)) return EDITORIAL_LOGO_ALT;
  return alt;
}
