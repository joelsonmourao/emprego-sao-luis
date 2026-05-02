/**
 * Gera `lib/geo/data/municipios-coordenadas.json` a partir do GeoNames (cities1000 + admin1).
 * Fonte: https://download.geonames.org/export/dump/
 *
 * Pré-requisito: cities1000.txt (extraído de cities1000.zip) em:
 *   %TEMP%/cities1000/cities1000.txt
 * ou variável GEO_CITIES1000_PATH apontando para o arquivo.
 *
 * Uso:
 *   node scripts/generate-municipios-geonames.mjs
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "lib", "geo", "data", "municipios-coordenadas.json");

const STATE_NAME_TO_UF = {
  acre: "AC",
  alagoas: "AL",
  amapa: "AP",
  amazonas: "AM",
  bahia: "BA",
  ceara: "CE",
  "distrito federal": "DF",
  "federal district": "DF",
  "espirito santo": "ES",
  goias: "GO",
  maranhao: "MA",
  "mato grosso": "MT",
  "mato grosso do sul": "MS",
  "minas gerais": "MG",
  para: "PA",
  paraiba: "PB",
  parana: "PR",
  pernambuco: "PE",
  piaui: "PI",
  "rio de janeiro": "RJ",
  "rio grande do norte": "RN",
  "rio grande do sul": "RS",
  rondonia: "RO",
  roraima: "RR",
  "santa catarina": "SC",
  "sao paulo": "SP",
  sergipe: "SE",
  tocantins: "TO"
};

function normalizeStateKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

async function loadAdmin1ToUf() {
  const text = await fetchText("https://download.geonames.org/export/dump/admin1CodesASCII.txt");
  const map = new Map();
  for (const line of text.split("\n")) {
    if (!line.startsWith("BR.")) continue;
    const parts = line.split("\t");
    const code = parts[0].split(".")[1];
    const ascii = parts[2] || parts[1];
    const uf = STATE_NAME_TO_UF[normalizeStateKey(ascii)];
    if (code && uf) map.set(code, uf);
  }
  return map;
}

function defaultCitiesPath() {
  const win = process.env.TEMP || process.env.TMP || "/tmp";
  return path.join(win, "cities1000", "cities1000.txt");
}

async function main() {
  const citiesPath = process.env.GEO_CITIES1000_PATH || defaultCitiesPath();
  if (!fs.existsSync(citiesPath)) {
    console.error(
      `Arquivo não encontrado: ${citiesPath}\nBaixe cities1000.zip de https://download.geonames.org/export/dump/cities1000.zip,\nextraia cities1000.txt ou defina GEO_CITIES1000_PATH.`
    );
    process.exit(1);
  }

  const admin1ToUf = await loadAdmin1ToUf();

  /** @type {Map<string, { city: string; uf: string; lat: number; lng: number; pop: number; ibge: string }>} */
  const byAdmin2 = new Map();
  /**
   * Capitais e outros lugares BR no GeoNames costumam vir com admin2 vazio; sem isso, São Paulo e Brasília somem.
   * Chave estável por geonameid para não colidir com municípios que têm admin2.
   */
  const byGeonameNoAdmin2 = new Map();

  const rl = readline.createInterface({ input: fs.createReadStream(citiesPath, { encoding: "utf8" }) });

  for await (const line of rl) {
    if (!line || line.startsWith("#")) continue;
    const f = line.split("\t");
    if (f.length < 15) continue;
    if (f[8] !== "BR") continue;
    if (f[6] !== "P") continue;
    const fc = f[7];
    if (!fc.startsWith("PPL")) continue;

    const admin1 = f[10]?.trim();
    const admin2 = f[11]?.trim();
    if (!admin1) continue;

    const uf = admin1ToUf.get(admin1);
    if (!uf) continue;

    const lat = Number.parseFloat(f[4]);
    const lng = Number.parseFloat(f[5]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const pop = Number.parseInt(f[14] || "0", 10) || 0;
    const city = (f[2] || f[1] || "").trim();
    if (!city) continue;

    const geonameid = (f[0] || "").trim();

    if (admin2) {
      const prev = byAdmin2.get(admin2);
      if (!prev || pop > prev.pop) {
        byAdmin2.set(admin2, { city, uf, lat, lng, pop, ibge: admin2 });
      }
    } else if (geonameid) {
      const prev = byGeonameNoAdmin2.get(geonameid);
      if (!prev || pop > prev.pop) {
        byGeonameNoAdmin2.set(geonameid, { city, uf, lat, lng, pop, ibge: "" });
      }
    }
  }

  const rows = [...byAdmin2.values(), ...byGeonameNoAdmin2.values()].map((v) => ({
    city: v.city,
    uf: v.uf,
    latitude: v.lat,
    longitude: v.lng,
    ...(v.ibge ? { ibge: v.ibge } : {})
  }));

  rows.sort((a, b) => a.uf.localeCompare(b.uf) || a.city.localeCompare(b.city));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(rows)}\n`, "utf8");

  console.log(`Escrito ${rows.length} municípios em ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
