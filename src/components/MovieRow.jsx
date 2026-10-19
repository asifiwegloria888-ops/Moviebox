import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Alert } from "@mui/material";
import { tmdb } from "../api/tmdb";
import MovieCard from "./movieCard";

export default function MovieRow({ title, path, mediaType }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    tmdb(path)
      .then((data) => {
        if (!ignore) {
          setItems((data.results || []).filter((i) => i.media_type !== "person"));
        }
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
  }, [path]);

  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>
        {title}
      </Typography>

      {error && <Alert severity="error">Could not load this section: {error}</Alert>}

      {!error && !loading && items.length === 0 && (
        <Typography color="text.secondary">Nothing to show.</Typography>
      )}

      {!error && (
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" width={150} height={265} sx={{ flexShrink: 0 }} />
              ))
            : items.map((item) => (
                <MovieCard key={item.id} item={item} mediaType={mediaType} />
              ))}
        </Box>
      )}
    </Box>
  );
}