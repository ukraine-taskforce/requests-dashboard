import * as React from "react";
import { ReactNode } from "react";
import AppBar from "@mui/material/AppBar";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { useDashboardContext } from "./dashboard-context";

export interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { toggle } = useDashboardContext();
  return (
    <AppBar position="static" sx={{ paddingRight: 1, paddingLeft: 1 }}>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        {children}
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};
