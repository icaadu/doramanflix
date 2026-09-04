import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login-dialog";
import { useAuth } from "@/hooks/use-auth";

export function SiteHeader() {
  const { isSignedIn, email, signOut } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

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
          <span
            className={`hidden rounded-full px-3 py-1 text-[10px] font-bold sm:inline-flex ${
              isSignedIn
                ? "bg-success text-tag-foreground"
                : "bg-destructive text-destructive-foreground"
            }`}
          >
            {isSignedIn ? "Ativo" : "Inativo"}
          </span>
          <Button variant="ghost" size="icon" aria-label="Pesquisar" asChild>
            <Link to="/catalogo">
              <Search />
            </Link>
          </Button>
          {isSignedIn ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              title={email ?? undefined}
              onClick={signOut}
            >
              <LogOut />
              Sair
            </Button>
          ) : (
            <Button size="sm" className="rounded-full" onClick={() => setLoginOpen(true)}>
              <LogIn />
              Entrar
            </Button>
          )}
        </div>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
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
