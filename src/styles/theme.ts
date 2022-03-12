import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const colors = {
  black: "#121212",
  white: "#fff",
  focus: "#159bff",
  gray: "#bdc0c2",
  error: "#f79a9a",
  darkError: "#4d0707",
  blue: "#0067FE",
};

export let muiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.black,
    },
    primary: {
      main: colors.blue,
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 12,
  },
  spacing: 4,
});

muiTheme = responsiveFontSizes(muiTheme);
