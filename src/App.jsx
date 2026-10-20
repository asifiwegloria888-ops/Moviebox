import { Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Search from "./pages/Search";
import Details from "./pages/Details";

// Pages provisoires, on les remplacera une par une
const Page = ({ name }) => <Typography variant="h4">{name}</Typography>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Page name="Movies" />} />
        <Route path="/tv" element={<Page name="TV Shows" />} />
        <Route path="/watchlist" element={<Page name="My Watchlist" />} />
        <Route path="/search" element={<Search />} />
        <Route path="/:type/:id" element={<Details />} />
      </Route>
    </Routes>
  );
}