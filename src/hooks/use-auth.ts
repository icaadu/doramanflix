import { useCallback, useEffect, useState } from "react";

// "Login" leve, só no navegador: guarda o e-mail que o cliente usou na compra
// para o site tratar o acesso como liberado. Não há backend — a validação real
// da compra é feita por fora (suporte / plataforma de pagamento).
const STORAGE_KEY = "doramastream-acesso";
const CHANGE_EVENT = "doramastream-acesso-change";

function readEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value && value.includes("@") ? value : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setEmail(readEmail());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = useCallback((value: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* localStorage indisponível — segue sem persistir */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* idem */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { email, isSignedIn: email !== null, signIn, signOut };
}
