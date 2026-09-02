import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "doramastream-favorites";
const CHANGE_EVENT = "doramastream-favorites-change";

function readFavorites() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === "string") : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    const current = readFavorites();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return {
    favorites,
    isFavorite: (slug: string) => favorites.includes(slug),
    toggleFavorite,
  };
}