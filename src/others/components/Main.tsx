import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

export interface MainProps {
  children?: ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return <Box sx={{ height: "100%", backgroundColor: "primary.main", padding: 4 }}>{children}</Box>;
};
