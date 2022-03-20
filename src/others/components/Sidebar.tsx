import * as React from "react";
import { ReactNode } from "react";
import Box, { BoxProps } from "@mui/material/Box";

import { useSidebarContext } from "../contexts/sidebar-context";

export interface SidebarProps extends BoxProps {
  children?: ReactNode;
}

const openSidebarWidth = "300px";

export const Sidebar = ({ children, className, ...innerStyles }: SidebarProps) => {
  const { isOpen } = useSidebarContext();

  return (
    <Box
      className={className}
      sx={{ overflowY: "auto", height: "100%", width: isOpen ? openSidebarWidth : 0, transition: "width .3s ease-in-out" }}
      id="scrollableDiv"
    >
      {isOpen ? <Box sx={{ display: "flex", flexDirection: "column", ...innerStyles }}>{children}</Box> : null}
    </Box>
  );
};
