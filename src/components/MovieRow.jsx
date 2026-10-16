import { useState, useEffect } from "react";

const KEY = import.meta.env.VITE_TMDB_KEY;
const IMG = "https://image.tmdb.org/t/p/w300";

export default function MovieRow({ title, endpoint }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const sep = endpoint.includes("?") ? "&" : "?";
        const res = await fetch(
          `https://api.themoviedb.org/3${endpoint}${sep}api_key=${KEY}`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [endpoint]);

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h2>{title}</h2>
      <div className="row">
        {movies
          .filter((m) => m.poster_path)
          .map((m) => (
            <div className="card" key={m.id}>
              <img src={IMG + m.poster_path} alt={m.title || m.name} />
              <p>{m.title || m.name}</p>
            </div>
          ))}
      </div>
    </section>
  );
}