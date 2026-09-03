import catalogJson from "@/data/catalog.json";

const RAW_CATALOG = catalogJson as Array<{
  id: string;
  title: string;
  tag: "DUBLADO" | "LEGENDADO";
  image: string;
}>;

// Pôsteres reais reaproveitados pelas seções fixas da home (que não têm arte
// própria), para que nenhum card apareça sem imagem.
const POSTER_POOL = RAW_CATALOG.filter((c) => c.image && c.title).map((c) => c.image);

export type DoramaItem = {
  title: string;
  tag: "DUBLADO" | "LEGENDADO";
  /** Identificador estável (catálogo). Usado quando não há título. */
  id?: string;
  /** Matiz do pôster-placeholder. Ausente quando o item tem imagem real. */
  hue?: number;
  /** Caminho do pôster real (catálogo). Quando ausente, usa placeholder. */
  image?: string;
};

export const slugify = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Slug de rota/favorito de um item: o `id` do catálogo, senão o título. */
export const itemSlug = (i: DoramaItem) => i.id || slugify(i.title);

const make = (titles: string[], start = 0): DoramaItem[] =>
  titles.map((title, i) => ({
    title,
    tag: (i + start) % 2 === 0 ? "DUBLADO" : "LEGENDADO",
    hue: (start * 37 + i * 47) % 360,
    image: POSTER_POOL[(start * 13 + i * 7) % POSTER_POOL.length]!,
  }));

export const TOP10 = make([
  "O Grande e Poderoso Gênio",
  "Coração Partido",
  "O Herói do Apocalipse",
  "O Doutor do Destino",
  "Amor em Seul",
  "Herdeira Secreta",
  "Contrato de Casamento",
  "Vingança de Inverno",
  "A CEO e o Motorista",
  "Renascida aos 18",
]);

export const LANCAMENTOS = make(
  [
    "Noiva do Bilionário",
    "Guardião das Estrelas",
    "Um Verão em Busan",
    "Segredos do Palácio",
    "A Filha Trocada",
    "Meu Chefe Alfa",
    "Estrela Cadente",
    "Reencontro em Jeju",
  ],
  3,
);

export const POPULARES = make(
  [
    "Amor Proibido",
    "A Rainha de Ferro",
    "Doce Obsessão",
    "Volte Para Mim",
    "O Príncipe Perdido",
    "Contrato de 100 Dias",
    "Herança de Sangue",
    "Café da Meia-Noite",
  ],
  6,
);

const CATALOG_ITEMS: DoramaItem[] = RAW_CATALOG.map((c) => ({
  id: c.id,
  title: c.title,
  tag: c.tag,
  image: c.image,
}));

/**
 * Lista completa usada pelas páginas de detalhe (/dorama/$slug), "Minha Lista"
 * e recomendações. Inclui os cards do catálogo, sem duplicar slugs já
 * presentes nas seções fixas da home.
 */
export const ALL_DORAMAS: DoramaItem[] = (() => {
  const list = [...TOP10, ...LANCAMENTOS, ...POPULARES];
  const seen = new Set(list.map((i) => itemSlug(i)));
  for (const item of CATALOG_ITEMS) {
    const s = itemSlug(item);
    if (seen.has(s)) continue;
    seen.add(s);
    list.push(item);
  }
  return list;
})();

const GENRES = [
  ["Drama", "Romance"],
  ["Romance", "Comédia"],
  ["Drama", "Histórico"],
  ["Fantasia", "Romance"],
  ["Ação", "Drama"],
];

export function getDorama(slug: string, all: DoramaItem[]) {
  const item = all.find((i) => itemSlug(i) === slug);
  if (!item) return undefined;
  const name = item.title || "Este título";
  const seed = name.length + (item.hue ?? 0);
  return {
    ...item,
    slug,
    title: name,
    rating: (7.8 + (seed % 15) / 10).toFixed(1),
    status: seed % 3 === 0 ? "Em exibição" : "Completo",
    episodes: seed % 2 === 0 ? "Episódio único" : `${12 + (seed % 40)} episódios`,
    origin: ["Coreia do Sul", "China", "Brasil", "Turquia"][seed % 4],
    year: 2021 + (seed % 5),
    genres: GENRES[seed % GENRES.length]!,
    synopsis: `${name} é uma história envolvente de emoções, reviravoltas e destinos cruzados. Acompanhe cada episódio ${item.tag === "DUBLADO" ? "dublado" : "legendado"} em português e mergulhe nesse universo.`,
  };
}

export function recommendations(current: string, all: DoramaItem[], count = 6) {
  const pool = all.filter((i) => itemSlug(i) !== current && i.title && i.image);
  if (pool.length <= count) return pool;
  // ponto de partida estável por título, para variar entre páginas
  let h = 0;
  for (let n = 0; n < current.length; n++) h = (h * 31 + current.charCodeAt(n)) | 0;
  const start = Math.abs(h) % (pool.length - count);
  return pool.slice(start, start + count);
}
