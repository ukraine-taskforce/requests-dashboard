import { useState } from "react";
import MapComponent, { Layer, LayerProps, Source } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./Map.module.css";
import { aidRequestsFixture } from "../fixtures/request.fixture";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

const layerStyle: LayerProps = {
  id: "ukr_water_needs-point",
  type: "circle",
  minzoom: 2,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      7,
      ["interpolate", ["linear"], ["get", "mag"], 1, 1, 3, 4],
      16,
      ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 70],
    ],
    "circle-color": [
      "interpolate",
      ["linear"],
      ["get", "mag"],
      1,
      "rgba(33,102,172,0)",
      2,
      "rgb(103,169,207)",
      3,
      "rgb(209,229,240)",
      4,
      "rgb(253,219,199)",
      5,
      "rgb(239,138,98)",
      6,
      "rgb(178,24,43)",
    ],
    "circle-stroke-color": "black",
    "circle-stroke-width": 1,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 1],
  },
};

export function Map() {
  const ukraineCenterCoords = {
    lat: 48.4501071,
    lng: 30.5240501,
  };

  const [lng] = useState(ukraineCenterCoords.lng);
  const [lat] = useState(ukraineCenterCoords.lat);
  const [zoom] = useState(4);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    //@ts-ignore
    features: aidRequestsFixture,
  };

  return (
    <div className={styles.mapWrap}>
      <div className={styles.map}>
        <MapComponent
          mapLib={maplibregl}
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: zoom,
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <Source id="ukr_water_needs" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        </MapComponent>
      </div>
    </div>
  );
}
