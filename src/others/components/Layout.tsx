import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

import { DashboardContextProvider } from "./dashboard-context";

export interface LayoutProps {
  header?: ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ header, children }) => {
  return (
    <DashboardContextProvider>
      <Box sx={{ height: "100vh" }}>
        {header}
        <Box sx={{ height: "calc(100vh - 64px)" }}>{children}</Box>
      </Box>
    </DashboardContextProvider>
  );
};
