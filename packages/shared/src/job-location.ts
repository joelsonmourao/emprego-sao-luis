const normalizeText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const GRANDE_ILHA = [
  { city: "São Luís", aliases: ["sao luis", "são luís"], uf: "MA" },
  { city: "São José de Ribamar", aliases: ["sao jose de ribamar", "são josé de ribamar"], uf: "MA" },
  { city: "Paço do Lumiar", aliases: ["paco do lumiar", "paço do lumiar"], uf: "MA" },
  { city: "Raposa", aliases: ["raposa"], uf: "MA" }
];

export function titleCasePtBr(value: string) {
  const minor = new Set(["da", "de", "do", "das", "dos", "e"]);
  return value.trim().replace(/\s+/g, " ").split(" ").map((part, index) => {
    const lower = part.toLocaleLowerCase("pt-BR");
    return index > 0 && minor.has(lower) ? lower : lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
  }).join(" ");
}

export function normalizeNeighborhood(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  return titleCasePtBr(value);
}

/** Extract neighborhood only from explicit textual evidence — never invent from city alone. */
export function extractNeighborhood(input: {
  title?: unknown;
  description?: unknown;
  address?: unknown;
  instructions?: unknown;
  neighborhood?: unknown;
  knownNeighborhoods?: string[];
}) {
  const explicit = normalizeNeighborhood(input.neighborhood);
  if (explicit) {
    return {
      neighborhood: explicit,
      confidence: 1,
      evidence: "Campo bairro informado explicitamente.",
      status: "EXPLICIT" as const
    };
  }

  const corpus = [input.title, input.description, input.address, input.instructions]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join("\n");
  if (!corpus.trim()) {
    return { neighborhood: null, confidence: 0, evidence: null, status: "EMPTY" as const };
  }

  const patterns = [
    /\bbairro\s+([A-Za-zÀ-ÿ0-9 .'-]{2,80})/i,
    /\bunidade\s+(?:do|da|de)\s+([A-Za-zÀ-ÿ0-9 .'-]{2,80})/i,
    /\bendere[cç]o[:\s]+[^,\n]+,\s*([A-Za-zÀ-ÿ0-9 .'-]{2,80})\s*[,/]/i
  ];
  for (const pattern of patterns) {
    const match = corpus.match(pattern);
    const candidate = normalizeNeighborhood(match?.[1]);
    if (!candidate) continue;
    if (/são luís|sao luis|raposa|paço do lumiar|paco do lumiar|são josé de ribamar|sao jose de ribamar|maranhão|maranhao/i.test(candidate)) {
      continue;
    }
    const known = (input.knownNeighborhoods ?? []).map((item) => normalizeText(item));
    if (known.length) {
      const hit = known.find((item) => item === normalizeText(candidate) || normalizeText(candidate).includes(item));
      if (!hit) {
        return {
          neighborhood: null,
          confidence: 0.4,
          evidence: `Menção textual "${candidate}" sem correspondência na base local.`,
          status: "PENDING" as const
        };
      }
    }
    return {
      neighborhood: candidate,
      confidence: known.length ? 0.9 : 0.7,
      evidence: `Extraído de menção explícita: "${candidate}".`,
      status: "EXTRACTED" as const
    };
  }

  return {
    neighborhood: null,
    confidence: 0,
    evidence: "Nenhuma menção explícita de bairro encontrada.",
    status: "EMPTY" as const
  };
}

export function parseBrazilianLocation(input: { locality?: unknown; city?: unknown; state?: unknown }) {
  const locality = typeof input.locality === "string" ? input.locality.trim() : "";
  const cityRaw = typeof input.city === "string" ? input.city.trim() : "";
  const stateRaw = typeof input.state === "string" ? input.state.trim() : "";
  const combined = [cityRaw, locality].filter(Boolean).join(" ");
  const normalized = normalizeText(combined).replace(/[,/-]+/g, " ").replace(/\s+/g, " ");
  const state = normalizeText(stateRaw || locality).includes("maranhao") || /(?:^|\s)ma(?:\s|$)/i.test(`${stateRaw} ${locality}`) ? "MA" : stateRaw.toUpperCase();
  const matches = GRANDE_ILHA.filter((item) => item.aliases.some((alias) => normalized.includes(normalizeText(alias))));
  const exact = matches.length === 1 ? matches[0]! : null;
  if (exact && (!state || state === exact.uf))
    return { city: exact.city, state: exact.uf, status: "EXACT" as const, reason: "Correspondência inequívoca na Grande Ilha." };
  if (cityRaw && /^[A-Za-zÀ-ÿ .'-]{2,120}$/.test(cityRaw) && /^[A-Za-z]{2}$/.test(state))
    return { city: titleCasePtBr(cityRaw), state, status: "EXACT" as const, reason: "Cidade e UF informadas explicitamente." };
  return { city: cityRaw ? titleCasePtBr(cityRaw) : null, state: state || null, status: "PENDING" as const, reason: "Cidade e UF não puderam ser confirmadas sem ambiguidade." };
}
