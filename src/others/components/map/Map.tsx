import MapComponent from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Box } from "@mui/material";
import { ReactNode } from "react";

interface MapProps {
  sourceWithLayer?: ReactNode;
}
export const Map = ({sourceWithLayer}: MapProps) => {

  const initialUkraineCenterView = {
    lat: 48.4501071,
    lng: 30.5240501,
    zoom: 4,
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MapComponent
        mapLib={maplibregl}
        initialViewState={initialUkraineCenterView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ borderRadius: "24px" }}
      >
          {sourceWithLayer}
      </MapComponent>
    </Box>
  );
}
