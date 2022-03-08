import { createTheme } from "@mui/material/styles";

const colors = {
  black: "#000",
  white: "#fff",
  focus: "#159bff",
  gray: "#bdc0c2",
  error: "#f79a9a",
  darkError: "#4d0707",
};

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.black,
      contrastText: colors.white,
      // TODO: set these up once we know which one they are
      light: "red",
      dark: "blue",
    },
    // secondary: {
    //   light: "#ff7961",
    //   main: "#f44336",
    //   dark: "#ba000d",
    //   contrastText: "#000",
    // },
  },
  typography: {
    allVariants: {
      color: colors.white,
    },
  },
});
