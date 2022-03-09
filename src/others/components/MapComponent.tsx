import { useState } from "react";
import Map from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./MapComponent.module.css";

export default function MapComponent() {
  const [lng] = useState(30.5240501);
  const [lat] = useState(48.4501071);
  const [zoom] = useState(5);

  return (
    <div className={styles.mapWrap}>
      <div className={styles.map}>
        <Map
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
