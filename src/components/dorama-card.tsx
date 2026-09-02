import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { slugify, type DoramaItem } from "@/lib/doramas";
import hero1 from "@/assets/hero1.jpg.asset.json";
import hero2 from "@/assets/hero2.jpg.asset.json";
import hero3 from "@/assets/hero3.jpg.asset.json";

const POSTERS = [hero1.url, hero2.url, hero3.url];

export function DoramaCard({ item }: { item: DoramaItem }) {
  const slug = slugify(item.title);
  const { isFavorite, toggleFavorite } = useFavorites();
  const selected = isFavorite(slug);
  return (
    <article className="group relative overflow-hidden rounded-lg border-2 border-primary/80 shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_35%,transparent)] transition-transform duration-200 hover:-translate-y-0.5">
      <Link to="/dorama/$slug" params={{ slug }} aria-label={`Ver ${item.title}`}>
        <img
          src={POSTERS[item.title.length % POSTERS.length]}
          alt=""
          loading="lazy"
          className="aspect-[2/3] w-full object-cover"
        />
        <span className={`absolute right-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-tag-foreground ${item.tag === "DUBLADO" ? "bg-success" : "bg-info"}`}>{item.tag}</span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-overlay via-overlay/60 to-transparent px-1.5 pb-1.5 pt-8">
          <p className="line-clamp-2 text-center text-[11px] font-bold italic leading-tight text-overlay-foreground">{item.title}</p>
        </div>
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={selected ? `Remover ${item.title} da lista` : `Adicionar ${item.title} à lista`}
        onClick={() => toggleFavorite(slug)}
        className="absolute left-1 top-1 size-7 rounded-full bg-overlay/55 text-overlay-foreground hover:bg-overlay/80 hover:text-primary"
      >
        <Heart className={selected ? "fill-primary text-primary" : ""} />
      </Button>
    </article>
  );
}