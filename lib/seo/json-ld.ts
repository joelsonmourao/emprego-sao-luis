import { absoluteUrl } from "@/lib/utils";
import { stripHtml } from "@/lib/rich-text";

export function buildOrganizationJsonLd(input?: { name?: string; logoUrl?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input?.name ?? "Jovem Aprendiz Vagas",
    url: absoluteUrl("/"),
    logo: absoluteUrl(input?.logoUrl ?? "/brand-logo.svg")
  };
}

export function buildWebsiteJsonLd(input?: { name?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input?.name ?? "Jovem Aprendiz Vagas",
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/busca")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

// Mapeamento de CEPs por cidade para fallback automático
const CITY_CEP_MAP: Record<string, string> = {
  "são luís": "65000-000",
  "são luis": "65000-000",
  "são paulo": "01000-000",
  "sao paulo": "01000-000",
  "rio de janeiro": "20000-000",
  "belo horizonte": "30000-000",
  "brasília": "70000-000",
  "recife": "50000-000",
  "salvador": "40000-000",
  "fortaleza": "60000-000",
  "manaus": "69000-000",
  "curitiba": "80000-000",
  "porto alegre": "90000-000"
};

// Cache em memória para CEPs buscados da API
const cepCache = new Map<string, string>();

// CEPs padrão das capitais dos estados (fallback final)
const STATE_CAPITAL_CEPS: Record<string, string> = {
  "AC": "69900-000", // Rio Branco
  "AL": "57000-000", // Maceió
  "AP": "68900-000", // Macapá
  "AM": "69000-000", // Manaus
  "BA": "40000-000", // Salvador
  "CE": "60000-000", // Fortaleza
  "DF": "70000-000", // Brasília
  "ES": "29000-000", // Vitória
  "GO": "74000-000", // Goiânia
  "MA": "65000-000", // São Luís
  "MT": "78000-000", // Cuiabá
  "MS": "79000-000", // Campo Grande
  "MG": "30000-000", // Belo Horizonte
  "PA": "66000-000", // Belém
  "PB": "58000-000", // João Pessoa
  "PR": "80000-000", // Curitiba
  "PE": "50000-000", // Recife
  "PI": "64000-000", // Teresina
  "RJ": "20000-000", // Rio de Janeiro
  "RN": "59000-000", // Natal
  "RS": "90000-000", // Porto Alegre
  "RO": "76800-000", // Porto Velho
  "RR": "69300-000", // Boa Vista
  "SC": "88000-000", // Florianópolis
  "SP": "01000-000", // São Paulo
  "SE": "49000-000", // Aracaju
  "TO": "77000-000"  // Palmas
};

// Ampliar mapeamento manual com mais cidades brasileiras
const EXPANDED_CITY_CEP_MAP: Record<string, string> = {
  ...CITY_CEP_MAP,
  // Maranhão - cidades adicionais
  "imperatriz": "65900-000",
  "são josé de ribamar": "65000-000",
  "timon": "65600-000",
  "bacabal": "65700-000",
  "caxias": "65600-000",
  "codó": "65400-000",
  "paço do lumiar": "65000-000",
  "axixá": "65200-000",
  
  // São Paulo - cidades adicionais
  "guarulhos": "07000-000",
  "campinas": "13000-000",
  "são bernardo do campo": "09800-000",
  "santo andré": "09000-000",
  "osasco": "06000-000",
  "sorocaba": "18000-000",
  "ribeirão preto": "14000-000",
  "são josé dos campos": "12200-000",
  "santos": "11000-000",
  "mogi das cruzes": "08700-000",
  "diadema": "09900-000",
  "carapicuíba": "06300-000",
  "mauá": "09300-000",
  "são vicente": "11300-000",
  "franco da rocha": "07800-000",
  "bertioga": "11400-000",
  
  // Rio de Janeiro - cidades adicionais
  "niterói": "24000-000",
  "nova iguaçu": "26200-000",
  "duque de caxias": "25000-000",
  "são gonçalo": "24400-000",
  "petrópolis": "25600-000",
  "volta redonda": "27200-000",
  "barra mansa": "27300-000",
  "resende": "27500-000",
  "campos dos goytacazes": "28000-000",
  "teresópolis": "25900-000",
  "macaé": "27900-000",
  "cabo frio": "28900-000",
  "angra dos reis": "23900-000",
  "nova friburgo": "28600-000",
  
  // Minas Gerais - cidades adicionais
  "betim": "32000-000",
  "contagem": "32000-000",
  "uberlândia": "38400-000",
  "juiz de fora": "36000-000",
  "montes claros": "39400-000",
  "divinópolis": "35500-000",
  "itajubá": "37500-000",
  "poços de caldas": "37700-000",
  "patos de minas": "38700-000",
  "teófilo otoni": "35200-000",
  "são joão del rei": "36300-000",
  "sete lagoas": "35700-000",
  "ipatinga": "35100-000",
  "uberaba": "38000-000",
  
  // Bahia - cidades adicionais
  "feira de santana": "44000-000",
  "vitória da conquista": "45000-000",
  "itabuna": "45600-000",
  "juazeiro": "48900-000",
  "ilhéus": "45600-000",
  "jequié": "45200-000",
  "barreiras": "47800-000",
  "alagoinhas": "48000-000",
  "porto seguro": "45800-000",
  "teixeira de freitas": "45900-000",
  "paulo afonso": "48600-000",
  
  // Ceará - cidades adicionais
  "caucaia": "61600-000",
  "juazeiro do norte": "63000-000",
  "sobral": "62000-000",
  "itiapipoca": "62500-000",
  "crato": "63100-000",
  "maracanaú": "61900-000",
  "quixadá": "62800-000",
  "pacatuba": "61800-000",
  "iguatu": "63500-000",
  
  // Pernambuco - cidades adicionais
  "olinda": "53000-000",
  "jaboatão dos guararapes": "54000-000",
  "caruaru": "55000-000",
  "petrolina": "56300-000",
  "vitoria de santo antão": "55600-000",
  "garanhuns": "55200-000",
  "serra talhada": "56900-000",
  "abreu e lima": "55800-000",
  
  // Paraná - cidades adicionais
  "londrina": "86000-000",
  "maringá": "87000-000",
  "ponta grossa": "84000-000",
  "cascavel": "85800-000",
  "guarapuava": "85000-000",
  "foz do iguaçu": "85800-000",
  "apucarana": "86800-000",
  "toledo": "85900-000",
  "paranaguá": "83200-000",
  
  // Rio Grande do Sul - cidades adicionais
  "caxias do sul": "95000-000",
  "gravataí": "94000-000",
  "viamão": "94400-000",
  "novo hamburgo": "93300-000",
  "canoas": "92000-000",
  "são leopoldo": "93000-000",
  "sapucaia do sul": "93300-000",
  "uruguaiana": "97500-000",
  "bagé": "96000-000",
  "cachoeirinha": "94900-000",
  
  // Santa Catarina - cidades adicionais
  "joinville": "89200-000",
  "blumenau": "89000-000",
  "florianópolis": "88000-000",
  "são josé": "88100-000",
  "chapecó": "89800-000",
  "criciúma": "88800-000",
  "itajaí": "88300-000",
  "lages": "88500-000",
  "balneário camboriú": "88330-000",
  "brusque": "88350-000",
  
  // Goiás - cidades adicionais
  "anápolis": "75000-000",
  "aparecida de goiânia": "74900-000",
  "rio verde": "75900-000",
  "luziânia": "72800-000",
  "água boa": "75200-000",
  "jataí": "75800-000",
  "trindade": "75380-000",
  
  // Pará - cidades adicionais
  "anaindeua": "67000-000",
  "marabá": "68500-000",
  "santarém": "68000-000",
  "parauapebas": "68500-000",
  "castanhal": "68600-000",
  "abaetetuba": "68400-000",
  "cametá": "68400-000",
  "barcarena": "68440-000",
  "paragominas": "68600-000",
  
  // Amazonas - cidades adicionais
  "parintins": "69100-000",
  "itacoatiara": "69100-000",
  "manacapuru": "69400-000",
  "coari": "69400-000",
  
  // Espírito Santo - cidades adicionais
  "vila velha": "29100-000",
  "serra": "29100-000",
  "cariacica": "29100-000",
  "viana": "29100-000",
  "cachoeiro de itapemirim": "29300-000",
  "linhares": "29900-000",
  "são mateus": "29900-000",
  "aracruz": "29100-000",
  
  // Mato Grosso - cidades adicionais
  "cuiabá": "78000-000",
  "várzea grande": "78100-000",
  "rondonópolis": "78700-000",
  "sinop": "78550-000",
  "tangará da serra": "78500-000",
  "barra do bugres": "78300-000",
  "alta floresta": "78580-000",
  
  // Mato Grosso do Sul - cidades adicionais
  "campo grande": "79000-000",
  "três lagoas": "76000-000",
  "corumbá": "79300-000",
  "dourados": "79800-000",
  "aquidauana": "79400-000",
  "naviraí": "79900-000",
  
  // Distrito Federal e Entorno - cidades adicionais
  "brasília": "70000-000",
  "taguatinga": "72000-000",
  "ceilândia": "72200-000",
  "gama": "72400-000",
  "sobradinho": "73000-000",
  "planaltina": "73300-000",
  "aguas claras": "71900-000",
  "riacho fundo": "71800-000",
  "samambaia": "72300-000",
  "santa maria": "72500-000",
  "val paraíso": "72800-000",
  
  // Alagoas - cidades adicionais
  "maceió": "57000-000",
  "arapiraca": "57200-000",
  "palmeira dos índios": "57600-000",
  "rio largo": "57100-000",
  "pão de açúcar": "57200-000",
  "união dos palmares": "57800-000",
  "são miguel dos campos": "57240-000",
  "satuba": "57100-000",
  "mata grande": "57400-000",
  
  // Sergipe - cidades adicionais
  "aracaju": "49000-000",
  "nossa senhora do socorro": "49000-000",
  "lagarto": "49400-000",
  "itabaiana": "49500-000",
  "estância": "49200-000",
  "simão dias": "49600-000",
  "propriá": "49700-000",
  "itaporanga d'ajuda": "49200-000",
  "barra dos coqueiros": "49100-000",
  
  // Rondônia - cidades adicionais
  "porto velho": "76800-000",
  "ji-paraná": "76900-000",
  "ariquemes": "76870-000",
  "vilhena": "76980-000",
  "cacoal": "76960-000",
  "rolim de moura": "76990-000",
  "guajará-mirim": "76820-000",
  
  // Acre - cidades adicionais
  "rio branco": "69900-000",
  "cruzeiro do sul": "69980-000",
  "senador guilherme": "69930-000",
  "senador ramalho": "69940-000",
  "tarauacá": "69970-000",
  "feijó": "69960-000",
  
  // Amapá - cidades adicionais
  "macapá": "68900-000",
  "santana": "68925-000",
  "laranjal do jari": "68300-000",
  "oiapoque": "68980-000",
  "porto grande": "68945-000",
  "mazagão": "68915-000",
  
  // Roraima - cidades adicionais
  "boa vista": "69300-000",
  "rorainópolis": "69373-000",
  "caracaraí": "69370-000",
  "cantá": "69350-000",
  "bonfim": "69320-000",
  "normandia": "69360-000",
  "pacaraima": "69340-000",
  
  // Tocantins - cidades adicionais
  "palmas": "77000-000",
  "araguaína": "77800-000",
  "gurupi": "77400-000",
  "porto nacional": "77500-000",
  "araguatins": "77900-000",
  "tocantinópolis": "77580-000",
  "miracema do tocantins": "77550-000",
  "paraíso do tocantins": "77600-000",
  "colinas do tocantins": "77760-000"
};

// Função para buscar CEP usando OpenCep (API mais confiável)
async function fetchCepFromOpenCep(state: string, city: string): Promise<string | null> {
  const cacheKey = `${state}-${city}`;
  
  // Verificar cache primeiro
  if (cepCache.has(cacheKey)) {
    return cepCache.get(cacheKey)!;
  }
  
  try {
    // Normalizar nome da cidade para busca
    const normalizedCity = city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // OpenCep API - busca por cidade e estado
    const response = await fetch(`https://opencep.com/v1/search?state=${state}&city=${encodeURIComponent(normalizedCity)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // OpenCep retorna array com resultados
    if (Array.isArray(data) && data.length > 0) {
      // Usar o primeiro CEP encontrado
      const cep = data[0].cep;
      if (cep) {
        cepCache.set(cacheKey, cep);
        return cep;
      }
    }
    
    return null;
  } catch (error) {
    console.warn(`Erro ao buscar CEP para ${city}-${state}:`, error instanceof Error ? error.message : 'Erro desconhecido');
    return null;
  }
}

// Função fallback para ViaCEP (busca por logradouro genérico)
async function fetchCepFromViaCep(state: string, city: string): Promise<string | null> {
  const cacheKey = `${state}-${city}`;
  
  // Verificar cache primeiro
  if (cepCache.has(cacheKey)) {
    return cepCache.get(cacheKey)!;
  }
  
  try {
    // Normalizar nome da cidade
    const normalizedCity = city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '%20');
    
    // Tentar buscar por "Centro" que existe na maioria das cidades
    const response = await fetch(`https://viacep.com.br/ws/${state}/${normalizedCity}/Centro/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // ViaCEP retorna array com múltiplos CEPs
    if (Array.isArray(data) && data.length > 0) {
      const cep = data[0].cep;
      if (cep) {
        cepCache.set(cacheKey, cep);
        return cep;
      }
    }
    
    return null;
  } catch (error) {
    console.warn(`Erro ao buscar CEP para ${city}-${state}:`, error instanceof Error ? error.message : 'Erro desconhecido');
    return null;
  }
}

// Função assíncrona para obter CEP baseado na cidade e estado
async function getCityPostalCode(cityName: string, stateCode?: string): Promise<string> {
  const normalizedCity = cityName.toLowerCase().trim();
  
  // 1. Verificar no mapeamento expandido primeiro (mais rápido)
  if (EXPANDED_CITY_CEP_MAP[normalizedCity]) {
    return EXPANDED_CITY_CEP_MAP[normalizedCity];
  }
  
  // 2. Se não tiver estado, retornar fallback genérico
  if (!stateCode) {
    return "00000-000";
  }
  
  // 3. Tentar buscar da API OpenCep (se tiver estado)
  try {
    const cepFromOpenCep = await fetchCepFromOpenCep(stateCode, cityName);
    if (cepFromOpenCep) {
      return cepFromOpenCep;
    }
  } catch (error) {
    // Falha silenciosa na API OpenCep
  }
  
  // 4. Tentar buscar da API ViaCEP como fallback
  try {
    const cepFromViaCep = await fetchCepFromViaCep(stateCode, cityName);
    if (cepFromViaCep) {
      return cepFromViaCep;
    }
  } catch (error) {
    // Falha silenciosa na API ViaCEP
  }
  
  // 5. Fallback para CEP da capital do estado
  const capitalCep = STATE_CAPITAL_CEPS[stateCode.toUpperCase()];
  if (capitalCep) {
    return capitalCep;
  }
  
  // 6. Fallback final genérico
  return "00000-000";
}

// Função síncrona para compatibilidade (usa cache ou fallback)
function getCityPostalCodeSync(cityName: string, stateCode?: string): string {
  const normalizedCity = cityName.toLowerCase().trim();
  
  // Verificar no mapeamento expandido
  if (EXPANDED_CITY_CEP_MAP[normalizedCity]) {
    return EXPANDED_CITY_CEP_MAP[normalizedCity];
  }
  
  // Verificar cache
  if (stateCode) {
    const cacheKey = `${stateCode}-${cityName}`;
    if (cepCache.has(cacheKey)) {
      return cepCache.get(cacheKey)!;
    }
    
    // Fallback para capital do estado
    const capitalCep = STATE_CAPITAL_CEPS[stateCode.toUpperCase()];
    if (capitalCep) {
      return capitalCep;
    }
  }
  
  // Fallback genérico
  return "00000-000";
}

// Função para gerar streetAddress com fallbacks
function generateStreetAddress(cityName: string): string {
  // Se tiver informações mais específicas da localização, usaríamos aqui
  // Por enquanto, usa uma abordagem baseada na cidade
  const normalizedCity = cityName.toLowerCase().trim();
  
  // Para São Luís, usamos bairros conhecidos ou fallback genérico
  if (normalizedCity.includes("são luís") || normalizedCity.includes("sao luis")) {
    return "Centro Histórico, São Luís, MA";
  }
  
  // Para outras cidades, usa centro ou bairro genérico
  return `Centro, ${cityName}`;
}

export function buildJobPostingJsonLd(job: {
  id?: string;
  externalId?: string | null;
  title: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  cityName: string;
  stateCode: string;
  publishedAt: string;
  updatedAt?: string;
  expiresAt: string | null;
  validThrough?: string | null;
  applyUrl: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  workHours?: string | null;
  requirements?: string[];
  responsibilities?: string[];
}) {
  const description = [job.summary?.trim(), stripHtml(job.descriptionHtml).trim()].filter(Boolean).join("\n\n").slice(0, 5000);
  const sameDomainApply = job.applyUrl.startsWith(absoluteUrl("/"));

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.publishedAt,
    dateModified: job.updatedAt ?? job.publishedAt,
    validThrough: job.validThrough ?? job.expiresAt ?? undefined,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: job.companyLogoUrl ?? absoluteUrl("/brand-mark.svg"),
      sameAs: job.companyWebsiteUrl ?? undefined
    },
    jobLocationType: job.locationType === "REMOTE" ? "TELECOMMUTE" : undefined,
    jobLocation:
      job.locationType === "REMOTE"
        ? undefined
        : {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: generateStreetAddress(job.cityName),
              addressLocality: job.cityName,
              addressRegion: job.stateCode,
              postalCode: getCityPostalCodeSync(job.cityName, job.stateCode),
              addressCountry: "BR"
            }
          },
    applicantLocationRequirements:
      job.locationType === "REMOTE"
        ? {
            "@type": "Country",
            name: "Brasil"
          }
        : undefined,
    baseSalary:
      job.salaryMin || job.salaryMax
        ? {
            "@type": "MonetaryAmount",
            currency: "BRL",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin ?? undefined,
              maxValue: job.salaryMax ?? undefined,
              unitText: "MONTH"
            }
          }
        : undefined,
    identifier: {
      "@type": "PropertyValue",
      name: job.companyName,
      value: job.externalId || job.id || job.slug
    },
    occupationalCategory: "Jovem Aprendiz",
    qualifications: job.requirements?.length ? job.requirements.join("\n") : undefined,
    responsibilities: job.responsibilities?.length ? job.responsibilities.join("\n") : undefined,
    workHours: job.workHours ?? undefined,
    directApply: sameDomainApply || undefined,
    url: absoluteUrl(`/vagas/${job.slug}`)
  };
}

// Versão assíncrona que busca CEPs da API quando necessário
export async function buildJobPostingJsonLdAsync(job: {
  id?: string;
  externalId?: string | null;
  title: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  cityName: string;
  stateCode: string;
  publishedAt: string;
  updatedAt?: string;
  expiresAt: string | null;
  validThrough?: string | null;
  applyUrl: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  workHours?: string | null;
  requirements?: string[];
  responsibilities?: string[];
}) {
  const description = [job.summary?.trim(), stripHtml(job.descriptionHtml).trim()].filter(Boolean).join("\n\n").slice(0, 5000);
  const sameDomainApply = job.applyUrl.startsWith(absoluteUrl("/"));
  
  // Buscar CEP de forma assíncrona
  const postalCode = await getCityPostalCode(job.cityName, job.stateCode);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.publishedAt,
    dateModified: job.updatedAt ?? job.publishedAt,
    validThrough: job.validThrough ?? job.expiresAt ?? undefined,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: job.companyLogoUrl ?? absoluteUrl("/brand-mark.svg"),
      sameAs: job.companyWebsiteUrl ?? undefined
    },
    jobLocationType: job.locationType === "REMOTE" ? "TELECOMMUTE" : undefined,
    jobLocation:
      job.locationType === "REMOTE"
        ? undefined
        : {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: generateStreetAddress(job.cityName),
              addressLocality: job.cityName,
              addressRegion: job.stateCode,
              postalCode,
              addressCountry: "BR"
            }
          },
    applicantLocationRequirements:
      job.locationType === "REMOTE"
        ? {
            "@type": "Country",
            name: "Brasil"
          }
        : undefined,
    baseSalary:
      job.salaryMin || job.salaryMax
        ? {
            "@type": "MonetaryAmount",
            currency: "BRL",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin ?? undefined,
              maxValue: job.salaryMax ?? undefined,
              unitText: "MONTH"
            }
          }
        : undefined,
    identifier: {
      "@type": "PropertyValue",
      name: job.companyName,
      value: job.externalId || job.id || job.slug
    },
    occupationalCategory: "Jovem Aprendiz",
    qualifications: job.requirements?.length ? job.requirements.join("\n") : undefined,
    responsibilities: job.responsibilities?.length ? job.responsibilities.join("\n") : undefined,
    workHours: job.workHours ?? undefined,
    directApply: sameDomainApply || undefined,
    url: absoluteUrl(`/vagas/${job.slug}`)
  };
}

// Função para pré-carregar CEPs de cidades comuns (pode ser chamada durante build)
export async function preloadCommonCeps() {
  const commonCities = [
    { city: "São Paulo", state: "SP" },
    { city: "Rio de Janeiro", state: "RJ" },
    { city: "Belo Horizonte", state: "MG" },
    { city: "Salvador", state: "BA" },
    { city: "Brasília", state: "DF" },
    { city: "Fortaleza", state: "CE" },
    { city: "Recife", state: "PE" },
    { city: "Porto Alegre", state: "RS" },
    { city: "Curitiba", state: "PR" },
    { city: "Manaus", state: "AM" },
    { city: "Belém", state: "PA" },
    { city: "Goiânia", state: "GO" }
  ];

  const promises = commonCities.map(async ({ city, state }) => {
    try {
      await getCityPostalCode(city, state);
    } catch (error) {
      // Silenciar erros no pré-carregamento
    }
  });

  await Promise.allSettled(promises);
}
