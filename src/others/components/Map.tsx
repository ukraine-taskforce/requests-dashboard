import { useState } from "react";
import MapComponent from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./Map.module.css";

export function Map() {
  const ukraineCenterCoords = {
    lat: 48.4501071,
    lng: 30.5240501,
  };

  const [lng] = useState(ukraineCenterCoords.lng);
  const [lat] = useState(ukraineCenterCoords.lat);
  const [zoom] = useState(4);

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
        />
      </div>
    </div>
  );
}
