import * as React from "react";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

export interface MapWindowProps {
  children?: ReactNode;
}

export const MapWindow = ({ children }: MapWindowProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
      }}
      className="map-window"
    >
      {children}
    </Box>
  );
};
