import { Link } from "@tanstack/react-router";
import { Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-serif text-lg font-bold text-primary sm:text-xl">
          DORAMASTREAM
        </Link>
        <nav className="hidden h-full items-center gap-7 md:flex" aria-label="Navegação principal">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/planos">Planos</NavLink>
          <NavLink to="/minha-lista">Minha Lista</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-destructive px-3 py-1 text-[10px] font-bold text-destructive-foreground sm:inline-flex">
            Inativo
          </span>
          <Button variant="ghost" size="icon" aria-label="Pesquisar">
            <Search />
          </Button>
          <Button size="sm" className="rounded-full">
            <UserRound />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  children,
}: {
  to: "/" | "/catalogo" | "/planos" | "/minha-lista";
  children: string;
}) {
  return <Link to={to} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground border-primary" }} inactiveProps={{ className: "text-muted-foreground border-transparent" }} className="flex h-full items-center border-b-2 text-xs font-semibold transition-colors hover:text-foreground">{children}</Link>;
}