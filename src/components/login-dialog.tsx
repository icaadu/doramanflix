import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const { signIn } = useAuth();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

  function resetForm() {
    setValue("");
    setError("");
    setConfirmedEmail(null);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const email = value.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setError("Digite um e-mail válido — o mesmo que você usou na compra.");
      return;
    }
    signIn(email);
    setConfirmedEmail(email);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="max-w-sm border-border bg-card">
        <p className="text-center font-serif text-lg font-bold tracking-wide text-primary">
          DORAMASTREAM
        </p>

        {confirmedEmail ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <CheckCircle2 className="size-10 text-success" />
            <DialogTitle className="text-xl">Acesso liberado</DialogTitle>
            <DialogDescription>
              Tudo certo para{" "}
              <span className="font-medium text-foreground">{confirmedEmail}</span>. Bom dorama! 💜
            </DialogDescription>
            <Button asChild className="mt-2 w-full">
              <Link to="/catalogo" onClick={() => onOpenChange(false)}>
                Começar a assistir
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Bem-vindo</DialogTitle>
              <DialogDescription>
                Digite seu e-mail da compra para assistir
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5 text-left">
                <span className="text-xs font-semibold text-foreground">E-mail</span>
                <span className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 focus-within:border-ring">
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder="seu@email.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </span>
              </label>

              {error && <p className="text-xs font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>

            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="size-3.5 shrink-0" />
              Acesso exclusivo para clientes. Usamos seu e-mail apenas para liberar o conteúdo.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
