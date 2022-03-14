import MapComponent, { Popup } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Box } from "@mui/material";
import { ReactNode, useCallback, useState, useRef } from "react";

interface MapProps {
  sourceWithLayer?: ReactNode;
}

interface PopupInfo {
  latitude: number;
  longitude: number;
  description: string;
}

const initialUkraineCenterView = {
  latitude: 48.4501071,
  longitude: 30.5240501,
  zoom: 5,
};

export const Map = ({sourceWithLayer}: MapProps) => {
  const mapRef = useRef(null)
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const handleOnClick = useCallback(event => {
    // TODO fix TS
    // @ts-ignore
    const features = mapRef?.current?.queryRenderedFeatures(event.point, {
      layers: ["ukr_water_needs-point"],
    })

    if (features && features.length > 0) {
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        description: features[0].properties.description
      })
    }
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MapComponent
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={initialUkraineCenterView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ borderRadius: "24px" }}
        onClick={handleOnClick}
      >
          {sourceWithLayer}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            style={{
              color: '#000000'
            }}
          >
            <div>
              {popupInfo.description}
            </div>
          </Popup>
        )}
      </MapComponent>
    </Box>
  );
}
