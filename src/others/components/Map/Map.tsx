import MapComponent, { Layer, Source } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./Map.module.css";
import { aidRequestsFixture } from "../../fixtures/request.fixture";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { layerStyle } from "./CircleLayerStyle";

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
    <div className={styles.mapWrap}>
      <div className={styles.map}>
        <MapComponent
          mapLib={maplibregl}
          initialViewState={initialView}
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
