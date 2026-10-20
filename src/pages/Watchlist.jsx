import { Box, Typography, Button } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useWatchlist } from "../context/WatchlistContext";

export default function Watchlist() {
  const { items, clear } = useWatchlist();

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          My Watchlist {items.length > 0 && `(${items.length})`}
        </Typography>
        {items.length > 0 && (
          <Button color="error" startIcon={<DeleteSweepIcon />} onClick={clear}>
            Clear all
          </Button>
        )}
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Your watchlist is empty
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Click the bookmark icon on any movie or TV show to save it here.
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Browse titles
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 2,
          }}
        >
          {items.map((item) => (
            <MovieCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              mediaType={item.media_type}
              fluid
            />
          ))}
        </Box>
      )}
    </Box>
  );
}