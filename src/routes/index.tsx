import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

const CATEGORIES = [
  "Todas",
  "Doramas/Séries",
  "Brasileira",
  "+18",
  "LGBTQIA+",
  "Animes",
  "Turcas",
];

type Item = { title: string; tag: "DUBLADO" | "LEGENDADO"; hue: number };

const make = (titles: string[], start = 0): Item[] =>
  titles.map((title, i) => ({
    title,
    tag: (i + start) % 2 === 0 ? "DUBLADO" : "LEGENDADO",
    hue: (start * 37 + i * 47) % 360,
  }));

const TOP10 = make([
  "O Grande e Poderoso Gênio",
  "Coração Partido",
  "O Herói do Apocalipse",
  "O Doutor do Destino",
  "Amor em Seul",
  "Herdeira Secreta",
  "Contrato de Casamento",
  "Vingança de Inverno",
  "A CEO e o Motorista",
  "Renascida aos 18",
]);

const LANCAMENTOS = make(
  [
    "Noiva do Bilionário",
    "Guardião das Estrelas",
    "Um Verão em Busan",
    "Segredos do Palácio",
    "A Filha Trocada",
    "Meu Chefe Alfa",
    "Estrela Cadente",
    "Reencontro em Jeju",
  ],
  3,
);

const POPULARES = make(
  [
    "Amor Proibido",
    "A Rainha de Ferro",
    "Doce Obsessão",
    "Volte Para Mim",
    "O Príncipe Perdido",
    "Contrato de 100 Dias",
    "Herança de Sangue",
    "Café da Meia-Noite",
  ],
  6,
);

function Poster({ item }: { item: Item }) {
  return (
    <a
      href="#"
      className="group relative block w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 sm:w-44"
    >
      <div
        className="aspect-[2/3] w-full"
        style={{
          background: `linear-gradient(150deg, oklch(0.45 0.18 ${item.hue}), oklch(0.22 0.09 ${(item.hue + 60) % 360}))`,
        }}
      />
      <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary-foreground">
        {item.tag}
      </span>
      <div className="p-2">
        <p className="line-clamp-2 text-xs font-semibold text-foreground">{item.title}</p>
      </div>
    </a>
  );
}

function Row({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 px-4 text-lg font-bold text-foreground sm:px-6">{title}</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 sm:px-6">
        {items.map((i) => (
          <Poster key={i.title} item={i} />
        ))}
      </div>
    </section>
  );
}

function Index() {
  const [active, setActive] = useState("Todas");

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <span className="text-lg font-extrabold tracking-tight text-primary">
            DORAMA<span className="text-foreground">STREAM</span>
          </span>
          <input
            type="search"
            placeholder="Buscar dorama..."
            className="w-40 rounded-full border border-input bg-card px-3 py-1.5 text-sm outline-none focus:border-ring sm:w-64"
          />
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="shrink-0 rounded-full border border-accent bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            🎁 Ganhe 1 mês grátis
          </span>
        </nav>
      </header>

      <main className="pb-16">
        <section className="relative overflow-hidden px-4 py-10 sm:px-6">
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, oklch(0.45 0.2 350 / 0.5), transparent 60%), radial-gradient(circle at 80% 0%, oklch(0.4 0.18 280 / 0.5), transparent 55%)",
            }}
          />
          <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Doramas e séries asiáticas, dublados e legendados
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            ✨ Novos doramas e séries adicionados todo dia. Assista onde quiser, quando quiser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#top10"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Assistir Agora
            </a>
            <a
              href="#pedido"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              Peça seu dorama favorito
            </a>
          </div>
        </section>

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
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
                Enviar pedido
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-8 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} DoramaStream. Todos os direitos reservados.
      </footer>
    </div>
  );
}
