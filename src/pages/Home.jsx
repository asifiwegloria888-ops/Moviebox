import { Box } from "@mui/material";
import MovieRow from "../components/MovieRow";

export default function Home() {
  return (
    <Box>
      <MovieRow title="Trending This Week" path="/trending/all/week" />
      <MovieRow title="Popular Movies" path="/movie/popular" mediaType="movie" />
      <MovieRow title="Action Movies" path="/discover/movie?with_genres=28" mediaType="movie" />
      <MovieRow title="Popular TV Shows" path="/tv/popular" mediaType="tv" />
    </Box>
  );
}
