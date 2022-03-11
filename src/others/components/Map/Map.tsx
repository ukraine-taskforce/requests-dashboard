import MapComponent, { Layer, Source } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { aidRequestsFixture } from "../../fixtures/request.fixture";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { layerStyle } from "./CircleLayerStyle";
import { Box } from "@mui/material";

export function Map() {

  const initialView = {
    lat: 48.4501071,
    lng: 30.5240501,
    zoom: 4,
  };

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: aidRequestsFixture,
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MapComponent
        mapLib={maplibregl}
        initialViewState={initialView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ borderRadius: "24px" }}
      >
        <Source id="ukr_water_needs" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </MapComponent>
    </Box>
  );
}
