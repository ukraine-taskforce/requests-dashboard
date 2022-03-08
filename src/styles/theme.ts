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
      light: "red",
      main: colors.black,
      dark: "blue",
      contrastText: "#fff",
    },
    // secondary: {
    //   light: "#ff7961",
    //   main: "#f44336",
    //   dark: "#ba000d",
    //   contrastText: "#000",
    // },
  },
});
