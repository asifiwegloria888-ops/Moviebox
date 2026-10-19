const BASE = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_KEY;

export const IMG = "https://image.tmdb.org/t/p/w342";

export async function tmdb(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}