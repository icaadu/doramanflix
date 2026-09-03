import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DoramaCard } from "@/components/dorama-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  CATALOG_CATEGORIES,
  catalogCounts,
  categoryByKey,
  DEFAULT_CATEGORY,
  filterCatalog,
} from "@/lib/catalog";

type CatalogSearch = {
  categoria?: string | undefined;
  q?: string | undefined;
};

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    categoria: typeof search["categoria"] === "string" ? search["categoria"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — DoramaStream" },
      {
        name: "description",
        content:
          "Explore o catálogo completo de doramas, séries, animes e produções turcas e brasileiras, dublados e legendados.",
      },
      { property: "og:title", content: "Catálogo — DoramaStream" },
      { property: "og:description", content: "Nossa coleção completa de doramas e séries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

// Contador por aba (ex.: "Doramas 72"). Já vem calculado; deixe `true` para
// exibir ao lado do rótulo dos botões.
const SHOW_COUNTS = false;

function CatalogPage() {
  const { categoria, q } = Route.useSearch();
  const navigate = useNavigate();

  const activeKey = categoryByKey(categoria).key;
  const [query, setQuery] = useState(q ?? "");

  // Mantém o campo em sincronia quando a URL muda por fora (voltar/avançar, link).
  useEffect(() => {
    setQuery(q ?? "");
  }, [q]);

  const counts = useMemo(() => catalogCounts(), []);
  const results = useMemo(() => filterCatalog(activeKey, query), [activeKey, query]);

  function onSearchChange(value: string) {
    setQuery(value);
    navigate({
      to: "/catalogo",
      search: (prev) => ({ ...prev, q: value.trim() ? value : undefined }),
      replace: true,
      resetScroll: false,
    });
  }

  const isSearching = query.trim().length > 0;

  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-serif text-3xl font-bold">Catálogo</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Explore nossa coleção completa de doramas
        </p>

        {/* busca */}
        <label className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar dorama..."
            aria-label="Buscar dorama"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        {/* categorias — rolagem horizontal no mobile, quebra em linhas no desktop */}
        <nav
          aria-label="Filtrar por categoria"
          className="mt-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATALOG_CATEGORIES.map((cat) => {
            const active = cat.key === activeKey;
            return (
              <Link
                key={cat.key}
                to="/catalogo"
                search={(prev) => ({
                  ...prev,
                  categoria: cat.key === DEFAULT_CATEGORY ? undefined : cat.key,
                })}
                resetScroll={false}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/40 bg-transparent text-foreground hover:border-primary"
                }`}
              >
                {cat.label}
                {SHOW_COUNTS && (
                  <span className="ml-1.5 opacity-70">{counts[cat.key]}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* grade */}
        {results.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <Search className="size-12 text-muted/70" />
            <p className="mt-4 text-sm text-muted-foreground">
              {isSearching
                ? "Nenhum resultado encontrado para sua busca."
                : "Nenhum título encontrado nesta categoria."}
            </p>
          </div>
        ) : (
          <section className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
            {results.map((item) => (
              <DoramaCard key={item.id} item={item} />
            ))}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
