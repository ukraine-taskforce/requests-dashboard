import { createTheme } from "@mui/material/styles";

export const colors = {
  black: "#121212",
  white: "#fff",
  focus: "#159bff",
  gray: "#bdc0c2",
  error: "#f79a9a",
  darkError: "#4d0707",
};

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.black,
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});
