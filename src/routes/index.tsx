import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DoramaCard } from "@/components/dorama-card";
import { SiteHeader } from "@/components/site-header";
import { CATALOG, CATALOG_CATEGORIES } from "@/lib/catalog";
import {
  LANCAMENTOS,
  POPULARES,
  TOP10,
  type DoramaItem as Item,
} from "../lib/doramas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DoramaStream — Doramas e Séries Asiáticas Online" },
      {
        name: "description",
        content:
          "Assista doramas, séries asiáticas e turcas dubladas e legendadas. Novos títulos adicionados todos os dias.",
      },
      { property: "og:title", content: "DoramaStream — Doramas e Séries Asiáticas Online" },
      {
        property: "og:description",
        content: "Catálogo de doramas dublados e legendados, atualizado diariamente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Slides do banner: pôsteres reais do catálogo. A lista de preferidos é só
// para começar por títulos reconhecíveis; se algum não existir, é ignorado e
// o restante é completado com outros títulos do catálogo.
const HERO_PICKS = [
  "rainha-das-lagrimas",
  "pousando-no-amor",
  "vincenzo",
  "meu-amor-das-estrelas",
  "a-herdeira-foi-trocada-ao-nascer",
];

const SLIDES = (() => {
  const titled = CATALOG.filter((c) => c.title && c.image);
  const byId = new Map(titled.map((c) => [c.id, c]));
  const picked = HERO_PICKS.map((id) => byId.get(id)).filter(
    (c): c is (typeof titled)[number] => Boolean(c),
  );
  for (const c of titled) {
    if (picked.length >= 5) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked.map((c) => ({ img: c.image, title: c.title }));
})();

function Row({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 px-3 text-base font-extrabold uppercase tracking-wide text-foreground sm:px-6 sm:text-lg">
        {title}
      </h2>
      <div className="grid grid-cols-3 gap-2.5 px-3 sm:grid-cols-4 sm:gap-3 sm:px-6 md:grid-cols-5 lg:grid-cols-6">
        {items.map((i) => (
          <DoramaCard key={i.title} item={i} />
        ))}
      </div>
    </section>
  );
}

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
      {SLIDES.map((s, i) => (
        <img
          key={s.img}
          src={s.img}
          alt={s.title}
          width={1024}
          height={1280}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 px-4">
        <h1 className="text-center text-2xl font-extrabold uppercase italic leading-tight text-overlay-foreground drop-shadow-lg sm:text-4xl">
          {SLIDES[index]?.title}
        </h1>
        <Link
          to="/planos"
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
          Assistir Agora
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <Button
            variant="ghost"
            size="sm"
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-5 bg-primary" : "w-2.5 bg-overlay-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="pb-16">
        <HeroCarousel />

        {/* busca */}
        <div className="px-4 pt-3 sm:px-6">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              className="size-4 fill-none stroke-muted-foreground"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Buscar filmes..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        {/* categorias — rolagem horizontal no celular (iOS/Android), quebra em
            linhas só no desktop; cada uma abre o catálogo já filtrado */}
        <nav className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6 md:flex-wrap md:justify-center [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATALOG_CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/catalogo"
              search={c.key === "tudo" ? {} : { categoria: c.key }}
              className="shrink-0 whitespace-nowrap rounded-full border border-primary/50 bg-transparent px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div id="top10">
          <Row title="🔥 Top 10 da Semana" items={TOP10} />
        </div>
        <Row title="🆕 Lançamentos" items={LANCAMENTOS} />
        <Row title="⭐ Mais Populares" items={POPULARES} />

        <section id="pedido" className="mt-14 px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Peça seu Dorama/Série favorito</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Não achou um título? Envie o nome e adicionamos ao catálogo.
            </p>
            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                required
                placeholder="Nome do dorama ou série"
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-ring"
              />
              <Button className="rounded-full px-5 py-2 text-sm font-bold">
                Enviar pedido
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* navegação inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur sm:hidden">
        {[
          { label: "Início", to: "/" as const, d: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" },
          { label: "Planos", to: "/planos" as const, d: "M4 5h16v12H4zM8 21h8" },
          { label: "Minha Lista", to: "/minha-lista" as const, d: "M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z" },
        ].map((i, idx) => (
          <Link
            key={i.label}
            to={i.to}
            className={`flex flex-col items-center gap-0.5 text-[10px] ${
              idx === 0 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
              <path d={i.d} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {i.label}
          </Link>
        ))}
      </nav>

      <footer className="border-t border-border px-4 py-8 pb-20 text-xs text-muted-foreground sm:px-6 sm:pb-8">
        © {new Date().getFullYear()} DoramaStream. Todos os direitos reservados.
      </footer>
    </div>
  );
}
