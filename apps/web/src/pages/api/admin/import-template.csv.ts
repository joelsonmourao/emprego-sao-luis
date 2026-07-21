import type { APIRoute } from "astro";
import { IMPORT_EXAMPLE_MARKER, IMPORT_TEMPLATE_HEADERS } from "@es/shared";

const quote = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export const GET: APIRoute = ({ locals }) => {
  if (!locals.auth) return new Response("Não autorizado.", { status: 401 });
  const example = IMPORT_TEMPLATE_HEADERS.map((header) => {
    if (header === "id") return "";
    if (header === "titulo") return IMPORT_EXAMPLE_MARKER;
    if (header === "empresa") return "Empresa Exemplo";
    if (header === "descricao")
      return "<p>Linha ilustrativa em HTML. Substitua por dados reais; esta linha nunca será importada.</p>";
    if (header === "cidade") return "São Luís";
    if (header === "uf") return "MA";
    if (header === "modalidade") return "Presencial";
    if (header === "dataPublicacao") return "21/07/2026";
    if (header === "dataEncerramento") return "21/08/2026";
    if (header === "fonteNome") return "Fonte Exemplo";
    if (header === "candidaturaEmail") return "exemplo@empresa.com.br";
    return "";
  });
  const body = `\uFEFF${IMPORT_TEMPLATE_HEADERS.map(quote).join(",")}\r\n${example.map(quote).join(",")}\r\n`;
  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="modelo-importacao-vagas.csv"',
      "cache-control": "private, max-age=300"
    }
  });
};
