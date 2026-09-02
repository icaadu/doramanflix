import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoramaCard } from "@/components/dorama-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useFavorites } from "@/hooks/use-favorites";
import { ALL_DORAMAS, slugify } from "@/lib/doramas";

export const Route = createFileRoute("/minha-lista")({
  head: () => ({ meta: [
    { title: "Minha Lista — DoramaStream" },
    { name: "description", content: "Seus doramas favoritos reunidos em um só lugar." },
    { property: "og:title", content: "Minha Lista — DoramaStream" },
    { property: "og:description", content: "Acesse sua lista pessoal de doramas favoritos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: MyListPage,
});

function MyListPage() {
  const { favorites } = useFavorites();
  const items = ALL_DORAMAS.filter((item) => favorites.includes(slugify(item.title)));
  return <div className="dark flex min-h-screen flex-col bg-background text-foreground"><SiteHeader />
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-6">
      <div><h1 className="flex items-center gap-2 font-serif text-3xl font-bold"><Heart className="size-7 text-primary" /> Minha Lista</h1><p className="mt-2 text-xs text-muted-foreground">Seus doramas favoritos em um só lugar</p></div>
      {items.length === 0 ? <section className="flex min-h-[360px] flex-col items-center justify-center text-center"><Heart className="size-16 text-muted/70" /><h2 className="mt-5 font-serif text-xl font-bold">Sua lista está vazia</h2><p className="mt-2 text-sm text-muted-foreground">Clique no coração dos doramas para adicioná-los aqui</p><Button asChild className="mt-6"><Link to="/">Explorar catálogo</Link></Button></section> : <section className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">{items.map((item) => <DoramaCard key={item.title} item={item} />)}</section>}
    </main><SiteFooter /></div>;
}