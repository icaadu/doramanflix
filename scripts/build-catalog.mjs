// ---------------------------------------------------------------------------
// Gerador do catálogo.
//
// Lê as pastas de pôsteres (organizadas por categoria), deriva um título a
// partir do nome de cada arquivo, junta títulos repetidos em uma única entrada
// com várias categorias, copia as imagens para `public/posters/` e escreve o
// dataset final em `src/data/catalog.json`.
//
// Uso:
//   node scripts/build-catalog.mjs
//
// A origem padrão é a Área de Trabalho do usuário. Para usar outra pasta:
//   CATALOG_SRC="D:/algum/caminho" node scripts/build-catalog.mjs
//
// Cada subpasta de CATALOG_SRC vira uma categoria (ver CATEGORY_FOLDERS).
// Para adicionar um título novo depois, basta jogar a imagem na pasta certa
// e rodar o script de novo — nada no componente do catálogo precisa mudar.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SRC =
  process.env.CATALOG_SRC ||
  path.join(process.env.USERPROFILE || process.env.HOME || "", "Desktop");

const POSTERS_DIR = path.join(ROOT, "public", "posters");
const DATA_FILE = path.join(ROOT, "src", "data", "catalog.json");

// Pasta -> como ela entra no catálogo.
//   label   : rótulo exibido / usado nos filtros por categoria
//   adult   : marca os títulos como conteúdo +18
//   popular : marca os títulos como "Populares" (curadoria, não categoria)
const CATEGORY_FOLDERS = [
  { folder: "dorama", label: "Doramas" },
  { folder: "doramas series", label: "Doramas/Séries" },
  { folder: "series", label: "Séries" },
  { folder: "animes", label: "Animes" },
  { folder: "Brasileira", label: "Brasileira" },
  { folder: "turcas", label: "Turcas" },
  { folder: "lgbtqia+", label: "LGBTQIA+" },
  // "+18" e "Populares" não viram categoria — são flags (adult / popular).
  { folder: "+18", adult: true },
  { folder: "Populares", popular: true },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const ACRONYMS = { ceo: "CEO", vs: "vs", tv: "TV", dr: "Dr", mr: "Mr", ii: "II", iii: "III" };

// Acentos que os nomes de arquivo perderam — reposicionados por palavra inteira
// (apenas casos seguros e frequentes).
const ACCENTS = {
  voce: "você", coracao: "coração", nao: "não", irma: "irmã", irmao: "irmão",
  mae: "mãe", familia: "família", vinganca: "vingança", herois: "heróis",
  heroi: "herói", ilusao: "ilusão", paixao: "paixão", obsessao: "obsessão",
  mansao: "mansão", traicao: "traição", solidao: "solidão", contrato: "contrato",
  seculo: "século", medico: "médico", magnata: "magnata", bilionario: "bilionário",
  milionario: "milionário", presidiaria: "presidiária", proprio: "próprio",
  policia: "polícia", memoria: "memória", historia: "história", cinderela: "cinderela",
  ultimo: "último", ultima: "última", unico: "único", unica: "única",
  principe: "príncipe", princesa: "princesa", ambicao: "ambição", chines: "chinês",
  gemeas: "gêmeas", gemeos: "gêmeos", romance: "romance", tragedia: "tragédia",
};
const SMALL_WORDS = new Set([
  "de", "da", "do", "das", "dos", "e", "o", "a", "os", "as", "em", "no", "na",
  "nos", "nas", "um", "uma", "para", "por", "com", "que", "ao", "aos", "à", "às",
  "the", "of", "and", "in",
]);

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

function stripExt(name) {
  const ext = path.extname(name);
  return { base: name.slice(0, -ext.length || undefined), ext: ext.toLowerCase() };
}

function detectTag(raw) {
  if (/(^|[-_ ])leg(endado)?([-_ .]|$)/i.test(raw)) return "LEGENDADO";
  if (/(^|[-_ ])dub(lado)?([-_ .]|$)/i.test(raw)) return "DUBLADO";
  return null;
}

// Nome de arquivo -> título legível, ou null se for lixo (hash, screenshot, etc).
function deriveTitle(base) {
  let s = base;
  s = s.replace(/^imgi_\d+_/i, ""); // prefixo do "site copier"
  s = s.replace(UUID, " "); // ids soltos
  s = s.replace(/^[-_\s]+/, "");
  // sufixos comuns de exportação
  s = s.replace(/[-_]scaled\b/gi, " ");
  s = s.replace(/[-_]?leg(endado)?\b/gi, " ");
  s = s.replace(/[-_]?dub(lado)?\b/gi, " ");
  s = s.replace(/[-_]pt\b/gi, " ");
  s = s.replace(/\._V1_.*/i, " ");
  s = s.replace(/[-_]FMjpg.*/i, " ");
  s = s.replace(/[-_]photo[-_]?\d+.*/i, " ");
  s = s.replace(/\bcover[-_][a-z0-9]+\b/gi, " ");
  s = s.replace(/\bchatgpt[-_ ]image\b.*/i, " ");
  s = s.replace(/\bphoto[-_ ]?\d{6,}.*/i, " ");
  s = s.replace(/[^0-9A-Za-zÀ-ÿ]+/g, " ").trim();
  s = s.replace(/\s+\d{7,}$/, "").trim(); // id/timestamp preso no fim
  s = s.replace(/\s+\d{1,2}$/, "").trim(); // "-1", "-2" no fim

  if (!s) return null;
  const compact = s.replace(/\s+/g, "");
  const letters = compact.replace(/[^A-Za-zÀ-ÿ]/g, "").length;
  const digits = compact.replace(/[^0-9]/g, "").length;
  if (/^\d+([.,]\d+)?$/.test(compact)) return null; // número puro
  if (/^0[.,]\d+$/.test(base)) return null; // "0.1234..."
  if (/^images?$/i.test(compact)) return null;
  if (/^default$/i.test(compact)) return null;
  if (/^[0-9a-f]{12,}$/i.test(compact)) return null; // hash hex
  if (/^MV5B/i.test(compact)) return null; // id IMDb
  if (/^captura?de?tela/i.test(compact)) return null;
  if (/^\d{9,}/.test(compact)) return null; // timestamp
  if (/^[a-z0-9]{6,10}$/i.test(compact) && !/[aeiouàáâãéêíóôõú]/i.test(compact)) return null;
  if (digits > letters * 0.4) return null; // "número demais" -> id disfarçado
  if (letters < 3) return null;

  const words = s.toLowerCase().split(/\s+/);
  let out = words
    .map((w, i) => {
      const base2 = w.normalize("NFD").replace(/[̀-ͯ]/g, "");
      if (ACRONYMS[base2]) return ACRONYMS[base2];
      if (ACCENTS[base2]) w = ACCENTS[base2];
      if (i > 0 && SMALL_WORDS.has(base2)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ")
    .trim();

  // acentos que ficaram partidos em duas "palavras" no nome do arquivo
  out = out
    .replace(/\bBiliona Rio\b/g, "Bilionário")
    .replace(/\bBiliona Ria\b/g, "Bilionária")
    .replace(/\bA Gua\b/g, "Água")
    .replace(/\bSss\b/g, "SSS");
  return out;
}

function slugify(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// --- coleta -----------------------------------------------------------------

if (!fs.existsSync(SRC)) {
  console.error(`Origem não encontrada: ${SRC}`);
  process.exit(1);
}

fs.rmSync(POSTERS_DIR, { recursive: true, force: true });
fs.mkdirSync(POSTERS_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

/** @type {Map<string, any>} */
const bySlug = new Map();
const usedFiles = new Set();

for (const { folder, label, adult, popular } of CATEGORY_FOLDERS) {
  const dir = path.join(SRC, folder);
  if (!fs.existsSync(dir)) {
    console.warn(`(pulada) pasta ausente: ${folder}`);
    continue;
  }
  let count = 0;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!fs.statSync(full).isFile()) continue;
    const { base, ext } = stripExt(name);
    if (!IMAGE_EXT.has(ext)) continue;

    // Toda imagem vira um card. Quando o nome do arquivo não dá um título
    // aproveitável, o card fica sem legenda (title: "") — a arte do pôster já
    // costuma trazer o nome. `key` identifica o card: pelo título quando há um,
    // senão pelo próprio nome do arquivo (para juntar as pastas idênticas).
    const title = deriveTitle(base) || "";
    const titleSlug = title ? slugify(title) : "";
    const key = titleSlug || `img-${slugify(base) || hash(base)}`;

    let entry = bySlug.get(key);
    if (!entry) {
      let outName = `${key}${ext}`;
      if (usedFiles.has(outName)) outName = `${key}-${hash(base) % 1000}${ext}`;
      usedFiles.add(outName);
      fs.copyFileSync(full, path.join(POSTERS_DIR, outName));

      entry = {
        id: key,
        title,
        image: `/posters/${outName}`,
        tag: detectTag(name) || (hash(key) % 2 === 0 ? "DUBLADO" : "LEGENDADO"),
        languageType: "",
        categories: [],
        popular: false,
        adult: false,
      };
      entry.languageType = entry.tag === "DUBLADO" ? "dublado" : "legendado";
      bySlug.set(key, entry);
    }

    if (label && !entry.categories.includes(label)) entry.categories.push(label);
    if (adult) entry.adult = true;
    if (popular) entry.popular = true;
    count++;
  }
  console.log(`${folder.padEnd(16)} ${String(count).padStart(4)} imagens`);
}

// títulos primeiro (em ordem alfabética), depois os cards sem legenda
const items = [...bySlug.values()].sort((a, b) => {
  if (!a.title !== !b.title) return a.title ? -1 : 1;
  return a.title.localeCompare(b.title, "pt") || a.id.localeCompare(b.id);
});

// ordena categorias de cada item na ordem canônica
const ORDER = CATEGORY_FOLDERS.filter((c) => c.label).map((c) => c.label);
for (const it of items) {
  it.categories.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
}

fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2) + "\n");

// --- resumo ---------------------------------------------------------------

const counts = { Tudo: items.length, Populares: 0, "+18": 0 };
for (const c of ORDER) counts[c] = 0;
for (const it of items) {
  if (it.popular) counts.Populares++;
  if (it.adult) counts["+18"]++;
  for (const c of it.categories) counts[c] = (counts[c] || 0) + 1;
}

console.log("\n--- catálogo gerado ---");
for (const [k, v] of Object.entries(counts)) console.log(`${k.padEnd(16)} ${v}`);
const untitled = items.filter((it) => !it.title).length;
console.log(`\n${items.length} cards -> ${path.relative(ROOT, DATA_FILE)}`);
console.log(`${items.length - untitled} com legenda · ${untitled} sem legenda (só pôster)`);
console.log(`${usedFiles.size} imagens -> public/posters/`);
