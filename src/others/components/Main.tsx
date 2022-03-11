import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

export interface MainProps {
  children?: ReactNode;
  aside?: ReactNode;
}

export const Main = ({ children, aside }: MainProps) => {
  return (
    <Box
      component="main"
      sx={{
        height: "100%",
        paddingX: 4,
        paddingY: 2,
        display: "flex",
      }}
    >
      <Box component="aside" sx={{ marginRight: 4 }}>
        {aside}
      </Box>
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Box>
  );
};
