import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, TextField, Box, InputAdornment, useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";

const WIDTH = 220;

const links = [
  { label: "Home", to: "/", icon: <HomeIcon /> },
  { label: "Movies", to: "/movies", icon: <MovieIcon /> },
  { label: "TV Shows", to: "/tv", icon: <TvIcon /> },
  { label: "My Watchlist", to: "/watchlist", icon: <BookmarkIcon /> },
];

export default function Layout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 2 }}>
          {!isDesktop && (
            <IconButton color="inherit" onClick={() => setOpen(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "primary.main", textDecoration: "none", fontWeight: 700 }}
          >
            GloFlix
          </Typography>

          <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: 500, ml: "auto" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search movies or TV shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || open}
        onClose={() => setOpen(false)}
        sx={{
          width: WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: WIDTH, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List sx={{ pt: 2 }}>
          {links.map((l) => (
            <ListItemButton
              key={l.to}
              component={Link}
              to={l.to}
              selected={pathname === l.to}
              onClick={() => setOpen(false)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{l.icon}</ListItemIcon>
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}