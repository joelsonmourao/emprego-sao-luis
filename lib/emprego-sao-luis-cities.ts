/** Cidades do Maranhão com foco em São Luís e Região Metropolitana. */
export const FEATURED_CITIES = [
  { name: "São Luís", slug: "sao-luis" },
  { name: "São José de Ribamar", slug: "sao-jose-de-ribamar" },
  { name: "Paço do Lumiar", slug: "paco-do-lumiar" },
  { name: "Raposa", slug: "raposa" },
  { name: "Alcântara", slug: "alcantara" },
  { name: "Imperatriz", slug: "imperatriz" },
  { name: "Timon", slug: "timon" },
  { name: "Caxias", slug: "caxias" },
  { name: "Bacabal", slug: "bacabal" }
] as const;

export const MARANHAO_CITIES = [
  ...FEATURED_CITIES,
  { name: "Balsas", slug: "balsas" },
  { name: "Açailândia", slug: "acailandia" },
  { name: "Santa Inês", slug: "santa-ines" },
  { name: "Pinheiro", slug: "pinheiro" },
  { name: "Codó", slug: "codo" },
  { name: "Chapadinha", slug: "chapadinha" },
  { name: "Barreirinhas", slug: "barreirinhas" },
  { name: "Itapecuru Mirim", slug: "itapecuru-mirim" },
  { name: "Santa Rita", slug: "santa-rita" },
  { name: "Rosário", slug: "rosario" },
  { name: "Viana", slug: "viana" },
  { name: "Pedreiras", slug: "pedreiras" },
  { name: "Presidente Dutra", slug: "presidente-dutra" },
  { name: "Grajaú", slug: "grajau" },
  { name: "Zé Doca", slug: "ze-doca" }
] as const;
