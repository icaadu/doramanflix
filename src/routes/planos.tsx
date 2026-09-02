import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [
    { title: "Planos de Assinatura — DoramaStream" },
    { name: "description", content: "Escolha seu plano DoramaStream e assista doramas sem limites." },
    { property: "og:title", content: "Planos de Assinatura — DoramaStream" },
    { property: "og:description", content: "Planos semanais, mensais, semestrais e vitalício para assistir sem limites." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: PlansPage,
});

const plans = [
  { name: "Semanal — 7 dias", cycle: "/semanal", price: "R$ 5,00", daily: "Apenas R$ 0,71 por dia", icon: Zap, benefits: ["Ideal para testar o app", "1 tela simultânea", "Acesso ilimitado", "Qualidade HD", "Sem anúncios"] },
  { name: "Mensal", cycle: "/mês", price: "R$ 10,00", daily: "Apenas R$ 0,33 por dia", icon: Sparkles, popular: "MAIS POPULAR", benefits: ["Acesso ilimitado", "5 telas simultâneas", "Qualidade HD", "Sem anúncios", "Suporte", "Disponível para TV"] },
  { name: "Semestral — 6 meses", cycle: "/semestral", price: "R$ 37,90", daily: "Apenas R$ 0,21 por dia", icon: Zap, benefits: ["Acesso ilimitado por 6 meses", "10 telas simultâneas", "Qualidade HD", "Sem anúncios", "Suporte", "Disponível para TV"] },
  { name: "Acesso Vitalício", cycle: "Pague apenas uma vez!", price: "R$ 69,90", daily: "Sem mensalidade · Sem renovação automática", icon: Crown, popular: "MELHOR OFERTA", premium: true, benefits: ["20 telas simultâneas", "Qualidade 4K", "Sem anúncios", "Conteúdos exclusivos", "Grupo VIP", "Suporte VIP", "Disponível para TV"] },
];

function PlansPage() {
  return <div className="dark min-h-screen bg-background text-foreground"><SiteHeader />
    <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center"><span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold text-success"><Sparkles className="size-3" /> Escolha seu plano</span><h1 className="mt-3 font-serif text-3xl font-bold">Escolha seu Plano</h1><p className="mt-1 text-xs text-muted-foreground">Assista seus doramas favoritos sem limites</p></div>
      <div className="mt-6 space-y-4">{plans.map((plan) => { const Icon = plan.icon; return <article key={plan.name} className={`relative rounded-lg border p-4 ${plan.premium ? "border-premium bg-premium/5 shadow-[0_0_24px_color-mix(in_oklab,var(--premium)_18%,transparent)]" : "border-success/60 bg-card"}`}>
        {plan.popular && <span className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[8px] font-black ${plan.premium ? "bg-premium text-premium-foreground" : "bg-success text-tag-foreground"}`}>{plan.popular}</span>}
        <div className="flex items-start gap-3"><span className={`grid size-8 place-items-center rounded-full ${plan.premium ? "bg-premium/15 text-premium" : "bg-success/15 text-success"}`}><Icon className="size-4" /></span><div><h2 className={`font-serif text-base font-bold ${plan.premium ? "text-premium" : ""}`}>{plan.name}</h2><p className="text-[9px] text-muted-foreground">{plan.cycle}</p></div></div>
        <div className="my-3 rounded-md border border-border bg-background/70 py-3 text-center"><p className={`text-lg font-black ${plan.premium ? "text-premium" : ""}`}>{plan.price}</p><p className={`mt-1 text-[9px] ${plan.premium ? "text-premium" : "text-success"}`}>{plan.daily}</p></div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-2">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-1 text-[9px]"><Check className={`mt-0.5 size-3 shrink-0 ${plan.premium ? "text-premium" : "text-success"}`} />{benefit}</li>)}</ul>
        <div className="mt-4 grid grid-cols-2 gap-2"><Button className={plan.premium ? "bg-premium text-premium-foreground hover:bg-premium/90" : "bg-success text-tag-foreground hover:bg-success/90"}>PIX</Button><Button className={plan.premium ? "bg-premium text-premium-foreground hover:bg-premium/90" : "bg-success text-tag-foreground hover:bg-success/90"}><CreditCard /> Cartão</Button></div>
      </article>})}</div>
      <div className="mt-6 flex items-center justify-center gap-5 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><ShieldCheck className="size-4 text-success" />Pagamento seguro</span><span className="flex items-center gap-1"><Zap className="size-4 text-success" />Cancele quando quiser</span></div>
    </main><SiteFooter /></div>;
}