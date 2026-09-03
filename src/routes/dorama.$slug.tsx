import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Play, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useFavorites } from "@/hooks/use-favorites";
import { CATALOG } from "@/lib/catalog";
import {
  ALL_DORAMAS,
  getDorama,
  itemSlug,
  recommendations,
  type DoramaItem,
} from "../lib/doramas";

// Fallback de imagem para os títulos das seções fixas da home (que não têm
// pôster próprio): usa alguns pôsteres do catálogo.
const HEROES = CATALOG.filter((c) => c.image)
  .slice(0, 6)
  .map((c) => c.image);

export const Route = createFileRoute("/dorama/$slug")({
  loader: ({ params }) => {
    const dorama = getDorama(params.slug, ALL_DORAMAS);
    if (!dorama) throw notFound();
    return dorama;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — DoramaStream` },
          { name: "description", content: loaderData.synopsis },
          { property: "og:title", content: `${loaderData.title} — DoramaStream` },
          { property: "og:description", content: loaderData.synopsis },
          { property: "og:type", content: "video.tv_show" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Dorama — DoramaStream" }, { name: "robots", content: "noindex" }],
  }),
  component: DoramaPage,
});

function MiniPoster({ item }: { item: DoramaItem }) {
  const isDub = item.tag === "DUBLADO";
  return (
    <Link
      to="/dorama/$slug"
      params={{ slug: itemSlug(item) }}
      className="group relative block overflow-hidden rounded-lg border-2 border-primary/80 shadow-[0_0_10px_oklch(0.55_0.22_25/0.35)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      {item.image ? (
        <img src={item.image} alt="" loading="lazy" className="aspect-[2/3] w-full object-cover" />
      ) : (
        <div
          className="aspect-[2/3] w-full"
          style={{
            background: `linear-gradient(160deg, oklch(0.5 0.18 ${item.hue ?? 0}), oklch(0.2 0.1 ${((item.hue ?? 0) + 60) % 360}))`,
          }}
        />
      )}
      <span
        className={`absolute right-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-tag-foreground ${
          isDub ? "bg-success" : "bg-info"
        }`}
      >
        {item.tag}
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-1.5 pb-1.5 pt-6">
        <p className="line-clamp-2 text-center text-[11px] font-bold italic leading-tight text-overlay-foreground drop-shadow">
          {item.title}
        </p>
      </div>
    </Link>
  );
}

function DoramaPage() {
  const dorama = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  const hero = dorama.image ?? HEROES[dorama.title.length % HEROES.length];
  const related = recommendations(dorama.slug, ALL_DORAMAS, 6);
  const isDub = dorama.tag === "DUBLADO";
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(dorama.slug);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* backdrop + poster */}
      <section className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
          <img
            src={hero}
            alt={dorama.title}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/40" />
        </div>

        <div className="relative z-10 -mt-40 px-4 sm:px-6">
          <Link
            to="/"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar
          </Link>

          <div className="flex gap-4">
            <div className="relative w-32 shrink-0 overflow-hidden rounded-lg border-2 border-primary/80 shadow-[0_0_16px_oklch(0.55_0.22_25/0.4)] sm:w-40">
              {dorama.image ? (
                <img
                  src={dorama.image}
                  alt={dorama.title}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div
                  className="aspect-[2/3] w-full"
                  style={{
                    background: `linear-gradient(160deg, oklch(0.5 0.18 ${dorama.hue ?? 0}), oklch(0.2 0.1 ${((dorama.hue ?? 0) + 60) % 360}))`,
                  }}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-1.5 pb-1.5 pt-6">
                <p className="line-clamp-2 text-center text-[11px] font-bold italic leading-tight text-overlay-foreground">
                  {dorama.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* infos */}
      <main className="px-4 pt-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-primary">{dorama.status}</span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-tag-foreground ${
              isDub ? "bg-success" : "bg-info"
            }`}
          >
            {dorama.tag}
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M12 2l3 7 7 .8-5.2 4.8L18.3 22 12 18.2 5.7 22l1.5-7.4L2 9.8 9 9z" />
            </svg>
            {dorama.rating}
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{dorama.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" />
            </svg>
            {dorama.episodes}
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
            </svg>
            {dorama.origin} · {dorama.year}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{dorama.synopsis}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {dorama.genres.map((g) => (
            <span
              key={g}
              className="rounded-md border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild className="h-12 flex-1">
            <Link to="/planos">
              <Play className="fill-current" />
              Assistir Agora
            </Link>
          </Button>
          <Button variant="outline" className="h-12" onClick={() => toggleFavorite(dorama.slug)}>
            <Heart className={favorite ? "fill-primary text-primary" : ""} />
            {favorite ? "Na minha lista" : "Favoritar"}
          </Button>
          <Button variant="outline" className="h-12"><Share2 /> Compartilhar</Button>
        </div>

        {/* sugestão */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-bold">Envie sua sugestão ou solicite continuação</h2>
          {sent ? (
            <p className="mt-3 text-sm text-emerald-400">
              Pedido enviado! Vamos analisar sua sugestão. 💜
            </p>
          ) : (
            <form
              className="mt-3 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <textarea
                required
                rows={3}
                placeholder="Peça continuação, informe temporada faltando, ou envie sua sugestão..."
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <Button className="self-start rounded-full px-5 py-2 text-sm font-bold">
                Enviar
              </Button>
            </form>
          )}
        </section>

        {/* relacionados */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-extrabold">Você também pode gostar</h2>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
            {related.map((i) => (
              <MiniPoster key={itemSlug(i)} item={i} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-14 border-t border-border px-4 py-8 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} DoramaStream. Todos os direitos reservados.
      </footer>
    </div>
  );
}
