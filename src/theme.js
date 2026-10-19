import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2ee6a6" },
    background: { default: "#121212", paper: "#1b1b1b" },
  },
  shape: { borderRadius: 10 },
});

export default theme;