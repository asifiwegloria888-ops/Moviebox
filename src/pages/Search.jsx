import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Chip, Button, Skeleton, Alert } from "@mui/material";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

function SearchResults({ q }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all"); // all | movie | tv
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    tmdb("/search/multi", { query: q, page, include_adult: false })
      .then((data) => {
        if (ignore) return;
        // On garde seulement les films et les séries (pas les personnes)
        const valid = (data.results || []).filter(
          (r) => r.media_type === "movie" || r.media_type === "tv"
        );
        setItems((prev) => (page === 1 ? valid : [...prev, ...valid]));
        setTotalPages(data.total_pages || 1);
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
  }, [q, page]);

  const shown = filter === "all" ? items : items.filter((i) => i.media_type === filter);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
        Search results
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Results for “{q}”
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip label="All" color={filter === "all" ? "primary" : "default"} onClick={() => setFilter("all")} />
        <Chip label="Movies" color={filter === "movie" ? "primary" : "default"} onClick={() => setFilter("movie")} />
        <Chip label="TV Shows" color={filter === "tv" ? "primary" : "default"} onClick={() => setFilter("tv")} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Search failed: {error}. Check your connection and try again.
        </Alert>
      )}

      {!error && !loading && shown.length === 0 && (
        <Typography color="text.secondary">
          No results found for “{q}”. Try another title.
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 2,
        }}
      >
        {shown.map((item) => (
          <MovieCard key={`${item.media_type}-${item.id}`} item={item} fluid />
        ))}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
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

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  if (!q) {
    return (
      <Typography color="text.secondary">
        Type a movie or TV show title in the search bar.
      </Typography>
    );
  }

  // key={q} : une nouvelle recherche repart de zéro (page 1, liste vide)
  return <SearchResults key={q} q={q} />;
}
