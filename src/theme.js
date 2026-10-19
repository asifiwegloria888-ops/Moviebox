import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2ee6a6" },
    background: { default: "#121212", paper: "#1b1b1b" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#444 transparent",
        },
        "*::-webkit-scrollbar": { height: 8, width: 8 },
        "*::-webkit-scrollbar-thumb": {
          background: "#444",
          borderRadius: 4,
        },
        "*::-webkit-scrollbar-track": { background: "transparent" },
      },
    },
  },
});

export default theme;