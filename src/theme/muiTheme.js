import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  palette: {
    primary: {
      main: "#2563eb", // A shade of blue for primary actions
    },
    secondary: {
      main: "#6b7280", // A shade of gray for secondary actions
    },
  },
});

export default muiTheme;
