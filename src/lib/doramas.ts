export type DoramaItem = { title: string; tag: "DUBLADO" | "LEGENDADO"; hue: number };

const make = (titles: string[], start = 0): DoramaItem[] =>
  titles.map((title, i) => ({
    title,
    tag: (i + start) % 2 === 0 ? "DUBLADO" : "LEGENDADO",
    hue: (start * 37 + i * 47) % 360,
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

export const ALL_DORAMAS: DoramaItem[] = [...TOP10, ...LANCAMENTOS, ...POPULARES];

export const slugify = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const GENRES = [
  ["Drama", "Romance"],
  ["Romance", "Comédia"],
  ["Drama", "Histórico"],
  ["Fantasia", "Romance"],
  ["Ação", "Drama"],
];

export function getDorama(slug: string, all: DoramaItem[]) {
  const item = all.find((i) => slugify(i.title) === slug);
  if (!item) return undefined;
  const seed = item.title.length + item.hue;
  return {
    ...item,
    slug,
    rating: (7.8 + (seed % 15) / 10).toFixed(1),
    status: seed % 3 === 0 ? "Em exibição" : "Completo",
    episodes: seed % 2 === 0 ? "Episódio único" : `${12 + (seed % 40)} episódios`,
    origin: ["Coreia do Sul", "China", "Brasil", "Turquia"][seed % 4],
    year: 2021 + (seed % 5),
    genres: GENRES[seed % GENRES.length],
    synopsis: `${item.title} é uma história envolvente de emoções, reviravoltas e destinos cruzados. Acompanhe cada episódio ${item.tag === "DUBLADO" ? "dublado" : "legendado"} em português e mergulhe nesse universo.`,
  };
}

export function recommendations(current: string, all: DoramaItem[], count = 6) {
  return all.filter((i) => slugify(i.title) !== current).slice(0, count);
}
