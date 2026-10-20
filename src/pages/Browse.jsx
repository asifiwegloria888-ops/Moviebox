import { useState, useEffect } from "react";
import { Box, Typography, Chip, Button, Skeleton, Alert } from "@mui/material";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function Browse({ type }) {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = type === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    tmdb(`/genre/${type}/list`)
      .then((data) => setGenres(data.genres || []))
      .catch(() => setGenres([]));
  }, [type]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    const params = { sort_by: "popularity.desc", page };
    if (genre) params.with_genres = genre;

    tmdb(`/discover/${type}`, params)
      .then((data) => {
        if (ignore) return;
        setItems((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotalPages(Math.min(data.total_pages || 1, 500));
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [type, genre, page]);

  const chooseGenre = (id) => {
    setGenre(id);
    setPage(1);
    setItems([]);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        <Chip
          label="All"
          color={genre === null ? "primary" : "default"}
          onClick={() => chooseGenre(null)}
        />
        {genres.map((g) => (
          <Chip
            key={g.id}
            label={g.name}
            color={genre === g.id ? "primary" : "default"}
            onClick={() => chooseGenre(g.id)}
          />
        ))}
      </Box>

      {error && <Alert severity="error">Could not load {title}: {error}</Alert>}

      {!error && !loading && items.length === 0 && (
        <Typography color="text.secondary">No results for this genre.</Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 2,
        }}
      >
        {items.map((item) => (
          <MovieCard key={item.id} item={item} mediaType={type} fluid />
        ))}
        {loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" sx={{ aspectRatio: "2 / 3", height: "auto" }} />
          ))}
      </Box>

      {!error && !loading && page < totalPages && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button variant="outlined" onClick={() => setPage((p) => p + 1)}>
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}