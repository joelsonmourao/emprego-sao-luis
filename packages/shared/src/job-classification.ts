export type CategorySuggestion = {
  categoryId: string | null;
  categoryName: string | null;
  confidence: number;
  reason: string;
  level: "HIGH" | "MEDIUM" | "LOW";
  source: "DETERMINISTIC";
};

const RULES: Array<{ categories: string[]; keywords: string[] }> = [
  { categories: ["comércio", "vendas"], keywords: ["vendedor", "vendas", "loja", "caixa", "promotor", "comercial"] },
  { categories: ["logística", "transporte"], keywords: ["logística", "estoque", "inventário", "almoxarif", "motorista", "porto", "armazém"] },
  { categories: ["saúde"], keywords: ["enferm", "médic", "farmácia", "farmac", "hospital", "clínica", "odont", "saúde"] },
  { categories: ["construção", "engenharia"], keywords: ["obra", "pedreiro", "engenheiro", "construção", "eletricista", "técnico de edific"] },
  { categories: ["tecnologia", "ti"], keywords: ["desenvolvedor", "programador", "software", "suporte ti", "dados", "tecnologia", "infraestrutura"] },
  { categories: ["atendimento", "serviços"], keywords: ["atendimento", "recepcion", "auxiliar de serviços", "limpeza", "garçom", "telemarketing"] },
  { categories: ["administrativo", "financeiro"], keywords: ["administrativ", "financeir", "contábil", "faturamento", "assistente", "analista"] },
  { categories: ["indústria", "produção"], keywords: ["produção", "operador", "industrial", "manutenção", "mecânico", "qualidade"] }
];

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

export type AdminClassificationRule = {
  categorySlug?: string;
  categoryName: string;
  keywords: string[];
  synonyms?: string[];
  priority?: number;
  active?: boolean;
};

export function suggestCategory(
  input: { title: string; description: string; requirements?: string; companyName?: string },
  categories: Array<{ id: string; name: string; slug?: string }>,
  adminRules: AdminClassificationRule[] = []
): CategorySuggestion {
  const haystack = normalize(
    `${input.title} ${input.description} ${input.requirements ?? ""} ${input.companyName ?? ""}`
  );
  const available = categories.map((category) => ({
    ...category,
    normalized: normalize(category.name),
    slug: category.slug ? normalize(category.slug) : normalize(category.name)
  }));
  let best: { id: string | null; name: string; score: number; matches: string[]; priority: number } | null = null;

  const effectiveRules =
    adminRules.filter((rule) => rule.active !== false).length > 0
      ? adminRules
          .filter((rule) => rule.active !== false)
          .map((rule) => ({
            categories: [rule.categoryName, rule.categorySlug ?? ""],
            keywords: [...rule.keywords, ...(rule.synonyms ?? [])],
            priority: rule.priority ?? 100
          }))
      : RULES.map((rule) => ({ ...rule, priority: 100 }));

  for (const rule of effectiveRules) {
    const category = available.find((item) =>
      rule.categories.some((name) => {
        const normalizedName = normalize(name);
        return normalizedName && (item.normalized.includes(normalizedName) || item.slug.includes(normalizedName));
      })
    );
    const matches = rule.keywords.filter((keyword) => haystack.includes(normalize(keyword)));
    const titleMatches = rule.keywords.filter((keyword) => normalize(input.title).includes(normalize(keyword))).length;
    const score = matches.length + titleMatches;
    if (score <= 0) continue;
    const name = category?.name ?? rule.categories[0]!;
    const id = category?.id ?? null;
    if (
      !best ||
      score > best.score ||
      (score === best.score && rule.priority < best.priority)
    ) {
      best = { id, name, score, matches, priority: rule.priority };
    }
  }

  if (!best)
    return {
      categoryId: null,
      categoryName: null,
      confidence: 0,
      reason: "Nenhuma regra compatível foi encontrada.",
      level: "LOW",
      source: "DETERMINISTIC"
    };
  const confidence = best.score >= 4 ? 0.92 : best.score >= 2 ? 0.76 : 0.52;
  const level = confidence >= 0.8 ? "HIGH" : confidence >= 0.6 ? "MEDIUM" : "LOW";
  return {
    categoryId: level === "HIGH" ? best.id : level === "MEDIUM" ? best.id : null,
    categoryName: best.name,
    confidence,
    reason: `Correspondências: ${best.matches.slice(0, 5).join(", ") || "termo do título"}. Nível ${level}.`,
    level,
    source: "DETERMINISTIC"
  };
}

