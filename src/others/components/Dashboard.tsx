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

  console.log("Dashboard isOpen", isOpen);
  return (
    <Box sx={{ height: "100%", backgroundColor: "primary.main", width: isOpen ? openDashboardWidth : 0 }}>
      {isOpen ? <Box sx={{ display: "flex" }}>{children}</Box> : null}
    </Box>
  );
};
