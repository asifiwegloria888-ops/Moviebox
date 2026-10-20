/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "gloflix-watchlist";
const WatchlistContext = createContext(null);

// Lit la liste sauvegardée dans le navigateur
function loadWatchlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return []; // données corrompues ou localStorage indisponible
  }
}

// On ne garde que l'essentiel de chaque titre
export function toWatchlistItem(item, type) {
  return {
    id: item.id,
    media_type: type,
    title: item.title,
    name: item.name,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
  };
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(loadWatchlist);

  // Sauvegarde à chaque changement de la liste
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* stockage plein ou bloqué : on ignore */
    }
  }, [items]);

  const isSaved = (id, type) =>
    items.some((i) => i.id === id && i.media_type === type);

  const add = (item, type) => {
    if (!isSaved(item.id, type)) {
      setItems((prev) => [...prev, toWatchlistItem(item, type)]);
    }
  };

  const remove = (id, type) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.media_type === type)));
  };

  const toggle = (item, type) => {
    if (isSaved(item.id, type)) remove(item.id, type);
    else add(item, type);
  };

  const clear = () => setItems([]);

  return (
    <WatchlistContext.Provider value={{ items, isSaved, add, remove, toggle, clear }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}