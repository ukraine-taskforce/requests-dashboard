import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

import { useDashboardContext } from "./dashboard-context";

export interface DashboardProps {
  children?: ReactNode;
}

const openDashboardWidth = "300px";

export const Dashboard = ({ children }: DashboardProps) => {
  const { isOpen } = useDashboardContext();

  return (
    <Box sx={{ height: "100%", width: isOpen ? openDashboardWidth : 0, transition: "width .3s ease-in-out" }}>
      {isOpen ? <Box sx={{ display: "flex" }}>{children}</Box> : null}
    </Box>
  );
};
