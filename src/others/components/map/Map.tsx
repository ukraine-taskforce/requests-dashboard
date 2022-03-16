import MapComponent, { Popup, MapRef, MapLayerMouseEvent } from "react-map-gl";
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

const MAP_STYLE = process.env.REACT_APP_MAPLIBRE_MAP_STYLE || "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const Map = ({sourceWithLayer}: MapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [cursor, setCursor] = useState<'auto' | 'pointer'>('auto');

  const handleMouseEnter = useCallback((event: MapLayerMouseEvent) => {
    if (mapRef?.current) {
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: ["ukr_water_needs-point"],
      })

      if (features && features.length > 0) {
        const requestData = features[0].properties;

        setCursor('pointer');

        setPopupInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          description: requestData ? requestData.description : 'Information unavailable',
        })
      }
    }
  }, [mapRef]);

  const handleMouseLeave = useCallback(() => {
    setCursor('auto');
    setPopupInfo(null);
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MapComponent
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={initialUkraineCenterView}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: "24px" }}
        interactiveLayerIds={["ukr_water_needs-point"]}
        cursor={cursor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
          {sourceWithLayer}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            closeOnClick={false}
            style={{
              color: '#000000'
            }}
          >
            <div>
              <pre>
                {popupInfo.description}
              </pre>
            </div>
          </Popup>
        )}
      </MapComponent>
    </Box>
  );
}
