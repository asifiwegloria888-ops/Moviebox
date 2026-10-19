import { Link } from "react-router-dom";
import {
  Card, CardActionArea, CardMedia, CardContent, Typography, Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { IMG } from "../api/tmdb";

export default function MovieCard({ item, mediaType, fluid = false }) {
  const type = mediaType || item.media_type || "movie";
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

  return (
    <Card
      sx={{
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
    </Card>
  );
}