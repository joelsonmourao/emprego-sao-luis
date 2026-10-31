export const SOCIAL_FORMATS = ["feed", "story", "square", "carousel"] as const;

export function buildJobCaption(input: { title: string; company: string; city: string; state: string; publicCode: string; siteUrl: string }) {
  return `${input.title}\n\nEmpresa: ${input.company}\nLocal: ${input.city}/${input.state}\nCódigo: ${input.publicCode}\n\nVeja os detalhes e candidate-se em ${input.siteUrl}/i/${input.publicCode}?utm_source=instagram&utm_medium=social&utm_campaign=vaga`;
}

export function buildJobCardSvg(input: { title: string; company: string; location: string; publicCode: string; width: number; height: number }) {
  const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${input.width}" height="${input.height}" viewBox="0 0 ${input.width} ${input.height}"><rect width="100%" height="100%" fill="#fff"/><rect width="100%" height="18%" fill="#b42318"/><text x="7%" y="11%" fill="#fff" font-size="42" font-family="Arial" font-weight="700">EMPREGOS SÃO LUÍS</text><text x="7%" y="35%" fill="#171717" font-size="58" font-family="Arial" font-weight="700">${escape(input.title.slice(0, 42))}</text><text x="7%" y="50%" fill="#444" font-size="36" font-family="Arial">${escape(input.company.slice(0, 50))}</text><text x="7%" y="59%" fill="#444" font-size="32" font-family="Arial">${escape(input.location)}</text><rect x="7%" y="73%" width="42%" height="10%" rx="18" fill="#171717"/><text x="10%" y="80%" fill="#fff" font-size="32" font-family="Arial" font-weight="700">Código ${escape(input.publicCode)}</text><text x="7%" y="91%" fill="#b42318" font-size="30" font-family="Arial" font-weight="700">empregossaoluis.com.br</text></svg>`;
}
