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

import { SidebarContextProvider } from "./others/components/sidebar-context";
import { AuthWrapper } from "./others/components/AuthWrapper";
import { queryClient } from "./others/contexts/api";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Requests } from "./pages/requests";
import { Incidents } from "./pages/incidents";
import { NotFound } from "./pages/notFound";
import { AuthProvider } from "./others/contexts/auth";
import { FilterContextProvider } from "./others/contexts/filter";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider theme={muiTheme}>
          <SidebarContextProvider>
            <FilterContextProvider>
              <CssBaseline />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<AuthWrapper />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/incidents" element={<Incidents />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </FilterContextProvider>
          </SidebarContextProvider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
