import rawCatalog from "@/data/catalog.json";
import { slugify } from "@/lib/doramas";

/**
 * Um título do catálogo.
 *
 * `categories` = as pastas em que a imagem do card está (mapeamento 1:1 pasta
 * -> aba). O gerador junta só imagens de conteúdo idêntico, então um pôster
 * colocado em várias pastas aparece nas abas correspondentes. "Populares" e
 * "+18" NÃO ficam aqui — vêm das flags `popular` e `adult`.
 *
 * Para adicionar um título novo depois: coloque a imagem na pasta certa e rode
 * `node scripts/build-catalog.mjs`, ou edite `src/data/catalog.json` à mão
 * seguindo este mesmo formato. Nada no componente do catálogo precisa mudar.
 */
export type CatalogItem = {
  id: string;
  title: string;
  image: string;
  tag: "DUBLADO" | "LEGENDADO";
  languageType: "dublado" | "legendado";
  categories: string[];
  popular: boolean;
  adult: boolean;
};

export const CATALOG = rawCatalog as CatalogItem[];

/**
 * Definição única das abas do catálogo. `key` é o que aparece na URL
 * (`/catalogo?categoria=<key>`); `label` é o texto do botão.
 * Para criar/renomear/reordenar uma aba, mexa só aqui.
 */
export const CATALOG_CATEGORIES = [
  { key: "tudo", label: "Tudo" },
  { key: "populares", label: "Populares" },
  { key: "adulto", label: "+18" },
  { key: "doramas", label: "Doramas" },
  { key: "doramas-series", label: "Doramas/Séries" },
  { key: "brasileira", label: "Brasileira" },
  { key: "lgbtqia", label: "LGBTQIA+" },
  { key: "series", label: "Séries" },
  { key: "animes", label: "Animes" },
  { key: "turcas", label: "Turcas" },
] as const;

export type CategoryKey = (typeof CATALOG_CATEGORIES)[number]["key"];

export const DEFAULT_CATEGORY: CategoryKey = "tudo";

export function categoryByKey(key: string | undefined) {
  return CATALOG_CATEGORIES.find((c) => c.key === key) ?? CATALOG_CATEGORIES[0];
}

/** Um título pertence à aba `key`? */
export function itemInCategory(item: CatalogItem, key: string): boolean {
  switch (key) {
    case "tudo":
      return true;
    case "populares":
      return item.popular === true;
    case "adulto":
      return item.adult === true;
    default: {
      const label = categoryByKey(key).label;
      return item.categories.includes(label);
    }
  }
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/**
 * Lista derivada: primeiro filtra pela aba, depois pela busca (dentro da aba).
 * Nunca muta `CATALOG`.
 */
export function filterCatalog(categoryKey: string, query: string): CatalogItem[] {
  const q = normalize(query);
  return CATALOG.filter((item) => {
    if (!itemInCategory(item, categoryKey)) return false;
    if (!q) return true;
    return normalize(item.title).includes(q);
  });
}

/** Quantidade de títulos por aba — pronto para exibir um contador no futuro. */
export function catalogCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const { key } of CATALOG_CATEGORIES) {
    counts[key] = CATALOG.reduce((n, item) => n + (itemInCategory(item, key) ? 1 : 0), 0);
  }
  return counts;
}

export { slugify };
