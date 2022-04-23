import { useTranslation } from "react-i18next";
import MapComponent, { Popup, MapRef, MapLayerMouseEvent } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Box, Typography } from "@mui/material";
import { ReactNode, useCallback, useState, useRef } from "react";
import { INITIAL_UKRAINE_CENTER_VIEW } from '../../constants';
import { MaxRegionVisibleZoomLevel } from "./RegionsSourceWithLayers";

interface MapProps {
  sourceWithLayer?: ReactNode;
  interactiveLayerIds: string[]
}

interface PopupInfo {
  latitude: number;
  longitude: number;
  data: {
    id: string;
    description: string;
    city: string;
    totalItems: number;
  };
}

const MAP_STYLE = process.env.REACT_APP_MAPLIBRE_MAP_STYLE || "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const Map = ({ sourceWithLayer, interactiveLayerIds }: MapProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [cursor, setCursor] = useState<"auto" | "pointer">("auto");

  const closePopup = useCallback(() => {
    setCursor("auto");
    setPopupInfo(null);
  }, []);

  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (mapRef?.current) {
        const features = mapRef.current.queryRenderedFeatures(event.point, {
          layers: interactiveLayerIds,
        });

        if (features && features.length > 0) {
          // We'd like to give preference to a more granular information, thus 'state-fills' is less desirable.
          const preferredLayerIndex = features[0].layer.id === 'state-fills' && features.length === 2 ? 1 : 0;
          const requestData = features[preferredLayerIndex].properties;
          if (!requestData) return;
          const isRegionPopup = features[preferredLayerIndex].layer.id === 'state-fills';
          // We don't show region popup when zoomed-in too much.
          if (isRegionPopup && event.target.getZoom() >= MaxRegionVisibleZoomLevel) {
            if (popupInfo) {
              closePopup();
            }
            return;
          }
          const popupId = isRegionPopup ? `region:${requestData.shapeID}` : `city:${requestData.city}`;
          if (popupInfo && popupInfo.data.id === popupId) return;

          setCursor("pointer");

          setPopupInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            data: {
              id: popupId,
              city: isRegionPopup ? requestData.shapeName : requestData.city,
              description: requestData.description,
              totalItems: requestData.amount,
            },
          });
        }
      }
    },
    [mapRef, popupInfo, interactiveLayerIds, closePopup]
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MapComponent
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={INITIAL_UKRAINE_CENTER_VIEW}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: "24px" }}
        interactiveLayerIds={interactiveLayerIds}
        cursor={cursor}
        onMouseMove={handleMouseMove}
        onMouseLeave={closePopup}
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
              color: "#000000",
            }}
          >
            <div>
              {popupInfo.data ? (
                <>
                  <Typography variant="h6" component="div">
                    {popupInfo.data.city}: {popupInfo.data.totalItems} {popupInfo.data.totalItems && t("requests")}
                  </Typography>
                  <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                    {popupInfo.data.description}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" component="div">
                  Information unavailable
                </Typography>
              )}
            </div>
          </Popup>
        )}
      </MapComponent>
    </Box>
  );
};
