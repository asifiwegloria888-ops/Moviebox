import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Chip, Button, Skeleton, Alert, Rating } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { tmdb, IMG_LARGE, BACKDROP } from "../api/tmdb";

function DetailsContent({ type, id }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    tmdb(`/${type}/${id}`)
      .then((res) => {
        if (!ignore) setData(res);
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
  }, [type, id]);

  const backButton = (
    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
      Back
    </Button>
  );

  if (loading) {
    return (
      <Box>
        {backButton}
        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
          <Skeleton variant="rounded" width={300} height={450} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={60} width="60%" />
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="rounded" height={150} sx={{ mt: 2 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        {backButton}
        <Alert severity="error">
          Could not load the details ({error}). The title may not exist or the connection failed.
        </Alert>
      </Box>
    );
  }

  const title = data.title || data.name || "Untitled";
  const date = data.release_date || data.first_air_date;
  const year = date ? date.slice(0, 4) : "Unknown year";
  const rating = data.vote_average ? data.vote_average : null;
  const genres = data.genres || [];
  const runtime = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}min`
    : data.number_of_seasons
    ? `${data.number_of_seasons} season${data.number_of_seasons > 1 ? "s" : ""}`
    : null;

  return (
    <Box>
      {backButton}

      {/* Bandeau avec l'image de fond (si elle existe) */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          p: { xs: 2, md: 4 },
          bgcolor: "background.paper",
          backgroundImage: data.backdrop_path
            ? `linear-gradient(rgba(18,18,18,0.85), rgba(18,18,18,0.95)), url(${BACKDROP + data.backdrop_path})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
          {/* Affiche */}
          {data.poster_path ? (
            <Box
              component="img"
              src={IMG_LARGE + data.poster_path}
              alt={title}
              sx={{
                width: { xs: "60%", md: 300 },
                maxWidth: 300,
                alignSelf: { xs: "center", md: "flex-start" },
                borderRadius: 2,
                boxShadow: 8,
              }}
            />
          ) : (
            <Box
              sx={{
                width: { xs: "60%", md: 300 },
                maxWidth: 300,
                aspectRatio: "2 / 3",
                alignSelf: { xs: "center", md: "flex-start" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.900",
                color: "text.secondary",
                borderRadius: 2,
              }}
            >
              No poster available
            </Box>
          )}

          {/* Informations */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.6rem" } }}>
              {title}
            </Typography>

            {data.tagline && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                {data.tagline}
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", my: 2 }}>
              {rating !== null ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating value={rating / 2} precision={0.1} readOnly size="small" />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {rating.toFixed(1)}/10
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">No rating yet</Typography>
              )}
              <Typography color="text.secondary">{year}</Typography>
              {runtime && <Typography color="text.secondary">{runtime}</Typography>}
              <Chip label={type === "movie" ? "Movie" : "TV Show"} size="small" color="primary" variant="outlined" />
            </Box>

            {/* Genres */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {genres.length > 0 ? (
                genres.map((g) => <Chip key={g.id} label={g.name} />)
              ) : (
                <Typography color="text.secondary">Genre not available</Typography>
              )}
            </Box>

            {/* Résumé */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Overview
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
              {data.overview || "No overview available for this title."}
            </Typography>

            {/* Emplacement du bouton Watchlist (étape 6) */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Details() {
  const { type, id } = useParams();

  // On refuse les adresses qui ne sont ni /movie/... ni /tv/...
  if (type !== "movie" && type !== "tv") {
    return <Alert severity="warning">Page not found.</Alert>;
  }

  // key : un nouveau film repart de zéro
  return <DetailsContent key={`${type}-${id}`} type={type} id={id} />;
}