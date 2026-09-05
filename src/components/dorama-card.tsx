import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { CATALOG } from "@/lib/catalog";
import { itemSlug, type DoramaItem } from "@/lib/doramas";

// Fallback para itens sem pôster próprio (ex.: seções fixas da home):
// reaproveita pôsteres reais do catálogo.
const POSTERS = CATALOG.filter((c) => c.image)
  .slice(0, 12)
  .map((c) => c.image);

export function DoramaCard({ item }: { item: DoramaItem }) {
  const slug = itemSlug(item);
  const { isFavorite, toggleFavorite } = useFavorites();
  const selected = isFavorite(slug);
  const label = item.title || "título do catálogo";
  return (
    <article className="group relative overflow-hidden rounded-lg border-2 border-primary/80 shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_35%,transparent)] transition-transform duration-200 hover:-translate-y-0.5">
      <Link to="/dorama/$slug" params={{ slug }} aria-label={`Ver ${label}`}>
        <img
          src={item.image ?? POSTERS[item.title.length % POSTERS.length]}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[2/3] w-full object-cover"
        />
        <span className={`absolute right-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-tag-foreground ${item.tag === "DUBLADO" ? "bg-success" : "bg-info"}`}>{item.tag}</span>
        {item.title && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-overlay via-overlay/60 to-transparent px-1.5 pb-1.5 pt-8">
            <p className="line-clamp-2 text-center text-[11px] font-bold italic leading-tight text-overlay-foreground">{item.title}</p>
          </div>
        )}
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={selected ? `Remover ${label} da lista` : `Adicionar ${label} à lista`}
        onClick={() => toggleFavorite(slug)}
        className="absolute left-1 top-1 size-7 rounded-full bg-overlay/55 text-overlay-foreground hover:bg-overlay/80 hover:text-primary"
      >
        <Heart className={selected ? "fill-primary text-primary" : ""} />
      </Button>
    </article>
  );
}