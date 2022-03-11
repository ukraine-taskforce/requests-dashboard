import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

import { useSidebarContext } from "./sidebar-context";

export interface SidebarProps {
  children?: ReactNode;
}

const openSidebarWidth = "300px";

export const Sidebar = ({ children }: SidebarProps) => {
  const { isOpen } = useSidebarContext();

  return (
    <Box sx={{ height: "100%", width: isOpen ? openSidebarWidth : 0, transition: "width .3s ease-in-out" }}>
      {isOpen ? <Box sx={{ display: "flex" }}>{children}</Box> : null}
    </Box>
  );
};
