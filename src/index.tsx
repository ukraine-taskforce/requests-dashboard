import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { muiTheme } from "./styles/theme";

import "./index.css";
import "./others/contexts/i18n";
import reportWebVitals from "./reportWebVitals";
import { DictionaryContextProvider } from "./others/contexts/dictionary-context";
import { SidebarContextProvider } from "./others/contexts/sidebar-context";
import { AuthWrapper } from "./others/components/AuthWrapper";
import { queryClient } from "./others/contexts/api";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Requests } from "./pages/requests";
import { Inventory } from "./pages/inventory";
import { NotFound } from "./pages/notFound";
import { ResetPassword } from "./pages/resetPassword";
import { AuthProvider } from "./others/contexts/auth";
import { FilterContextProvider } from "./others/contexts/filter";

const Providers: React.FunctionComponent = ({ children }) => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={muiTheme}>
        <DictionaryContextProvider>
          <SidebarContextProvider>
            <FilterContextProvider>{children}</FilterContextProvider>
          </SidebarContextProvider>
        </DictionaryContextProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  </AuthProvider>
);

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<AuthWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/requests" element={<Requests />} />
	    <Route path="/inventory" element={<Inventory />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
