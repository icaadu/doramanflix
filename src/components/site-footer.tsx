import { Link } from "@tanstack/react-router";
import { Heart, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-lg font-bold text-primary">DORAMASTREAM</p>
            <p className="mt-3 max-w-xs text-xs leading-6 text-muted-foreground">
              Seu streaming de doramas. Assista histórias marcantes dubladas e legendadas em português.
            </p>
          </div>
          <FooterGroup title="Navegar" links={[['Catálogo', '/'], ['Planos', '/planos'], ['Minha Lista', '/minha-lista']]} />
          <FooterGroup title="Categorias" links={[['Romance', '/'], ['Drama', '/'], ['Escolar', '/'], ['Histórico', '/']]} />
          <div>
            <p className="text-xs font-bold text-foreground">Suporte</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>Central de Ajuda</li><li>Termos de Uso</li><li>Privacidade</li><li>WhatsApp: +55 11 99999-0000</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">Feito com <Heart className="size-3 fill-primary text-primary" /> para amantes de doramas</span>
          <Instagram className="size-4" aria-label="Instagram" />
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: Array<[string, string]> }) {
  return <div><p className="text-xs font-bold text-foreground">{title}</p><ul className="mt-3 space-y-2">{links.map(([label, to]) => <li key={label}><Link to={to} className="text-xs text-muted-foreground transition-colors hover:text-primary">{label}</Link></li>)}</ul></div>;
}