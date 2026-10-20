import { Link } from "react-router-dom";
import {
  Card, CardActionArea, CardMedia, CardContent, Typography, Box, IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { IMG } from "../api/tmdb";
import { useWatchlist } from "../context/WatchlistContext";

export default function MovieCard({ item, mediaType, fluid = false }) {
  const { isSaved, toggle } = useWatchlist();

  const type = mediaType || item.media_type || "movie";
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
  const saved = isSaved(item.id, type);

  return (
    <Card
      sx={{
        position: "relative",
        width: fluid ? "100%" : 150,
        flexShrink: 0,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "scale(1.05)", boxShadow: 8 },
      }}
    >
      <CardActionArea component={Link} to={`/${type}/${item.id}`}>
        {item.poster_path ? (
          <CardMedia
            component="img"
            image={IMG + item.poster_path}
            alt={title}
            sx={{ aspectRatio: "2 / 3", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              aspectRatio: "2 / 3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.900",
              color: "text.secondary",
              p: 1,
              textAlign: "center",
            }}
          >
            No poster
          </Box>
        )}
        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
          <Typography variant="body2" noWrap title={title}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <StarIcon sx={{ fontSize: 14, color: "#f5c518" }} />
            <Typography variant="caption">
              {rating}
              {year && ` · ${year}`}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Bouton watchlist : placé à côté (et non dans) du lien de la carte */}
      <IconButton
        size="small"
        onClick={() => toggle(item, type)}
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          bgcolor: "rgba(0,0,0,0.65)",
          color: saved ? "primary.main" : "#fff",
          "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
        }}
      >
        {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
      </IconButton>
    </Card>
  );
}