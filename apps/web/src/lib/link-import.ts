import {
  normalizeApplicationEmail,
  normalizeApplicationUrl,
  normalizeApplicationWhatsapp,
  parseBrazilianLocation
} from "@es/shared";

function decodeHtml(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

function plainText(value: string) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

function externalHttpUrl(value: string) {
  const result = normalizeApplicationUrl(value);
  if (!result.valid || !result.normalized) return null;
  const url = new URL(result.normalized);
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "127.0.0.1" || host === "::1") return null;
  if (/^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return null;
  return url;
}

function meta(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`, "i")
  ];
  return patterns.map((pattern) => pattern.exec(html)?.[1]).find(Boolean);
}

function jobPosting(html: string): Record<string, unknown> | null {
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const value = JSON.parse(match[1]!.trim());
      const candidates = Array.isArray(value) ? value : value?.["@graph"] ? value["@graph"] : [value];
      const found = candidates.find((item: Record<string, unknown>) => item?.["@type"] === "JobPosting");
      if (found) return found;
    } catch {
      // JSON-LD inválido é apenas ignorado; a página continuará como prévia pendente.
    }
  }
  return null;
}

export async function analyzeContactEntry(entry: string) {
  const urls = entry.match(/https?:\/\/[^\s]+/gi) ?? [];
  const emails = entry.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  const withoutUrlsEmails = entry.replace(/https?:\/\/[^\s]+/gi, " ").replace(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, " ");
  const phoneCandidates = withoutUrlsEmails.match(/(?:\+|00)?\d[\d\s().-]{8,}\d/g) ?? [];
  const email = normalizeApplicationEmail(emails[0]);
  const whatsapp = normalizeApplicationWhatsapp(phoneCandidates[0]);
  const source = urls[0] ? externalHttpUrl(urls[0]) : null;
  const warnings: string[] = [];
  const errors: string[] = [];
  let extracted: Record<string, unknown> = {};

  if (urls[0] && !source) errors.push("URL inválida, local ou não permitida.");
  if (source) {
    try {
      const response = await fetch(source, {
        redirect: "follow",
        signal: AbortSignal.timeout(8_000),
        headers: { "user-agent": "EmpregosSaoLuis-ImportPreview/1.0" }
      });
      if ([401, 403, 429].includes(response.status)) {
        warnings.push(`A origem respondeu HTTP ${response.status}; login, CAPTCHA ou limite não serão contornados.`);
      } else if (response.ok) {
        const html = (await response.text()).slice(0, 750_000);
        const schema = jobPosting(html);
        const organization = schema?.hiringOrganization as Record<string, unknown> | undefined;
        const location = schema?.jobLocation as Record<string, unknown> | undefined;
        const address = location?.address as Record<string, unknown> | undefined;
        const title = String(schema?.title ?? meta(html, "og:title") ?? /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "").trim();
        const description = plainText(String(schema?.description ?? meta(html, "og:description") ?? meta(html, "description") ?? ""));
        const city = String(address?.addressLocality ?? "").trim();
        const state = String(address?.addressRegion ?? "").trim();
        const normalizedLocation = parseBrazilianLocation({ city, state });
        extracted = {
          title: decodeHtml(title),
          company: String(organization?.name ?? "").trim(),
          description,
          city: normalizedLocation.status === "EXACT" ? normalizedLocation.city : city,
          state: normalizedLocation.status === "EXACT" ? normalizedLocation.state : state,
          publishedAt: schema?.datePosted ?? null,
          expiresAt: schema?.validThrough ?? null,
          sourceName: source.hostname,
          sourceUrl: response.url
        };
      } else {
        warnings.push(`A origem respondeu HTTP ${response.status}; revise manualmente.`);
      }
    } catch {
      warnings.push("Não foi possível ler a URL sem contornar proteções; revise manualmente.");
    }
  }

  const normalized = {
    ...extracted,
    applicationEmail: email.normalized,
    applicationWhatsapp: whatsapp.normalized,
    applicationWhatsappOriginal: whatsapp.original,
    inputSourceUrl: source?.toString() ?? null
  };
  const missing = ["title", "company", "description", "city", "state", "sourceName"].filter((field) => !String(normalized[field as keyof typeof normalized] ?? "").trim());
  if (!source && !email.valid && !whatsapp.valid) errors.push("Nenhuma URL, e-mail ou WhatsApp válido foi reconhecido.");
  if (missing.length) warnings.push(`Dados críticos pendentes: ${missing.join(", ")}.`);
  return { raw: entry, normalized, warnings, errors, status: errors.length ? "REJECTED" : "NEEDS_REVIEW" };
}

