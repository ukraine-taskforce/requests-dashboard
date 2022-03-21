import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

export interface LayoutProps {
  header?: ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ header, children }) => {
  return (
    <Box sx={{ height: "100vh", maxHeight: "100vh", overflowY: "hidden" }}>
      {header}
      <Box sx={{ height: "calc(100vh - 64px)" }}>{children}</Box>
    </Box>
  );
};
