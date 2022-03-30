import { useTranslation } from "react-i18next";
import MapComponent, { Popup, MapRef, MapLayerMouseEvent, Layer, Source } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Box, Typography } from "@mui/material";
import { INITIAL_UKRAINE_CENTER_VIEW } from '../../constants';
import { useCallback, useState, useRef, useMemo } from "react";
import { MaxRegionVisibleZoomLevel, RegionsSourceWithLayers } from "./RegionsSourceWithLayers";
import { layerStyle, layerStyleInvertedColors } from "./CircleLayerStyle";
import { layerStyleWithRegions, layerStyleWithRegionsInvertedColors } from "./CircleLayerStyleWithRegions";
import { RequestMapDataPoint, mapAidRequestsToFeatures } from "../../helpers/map-utils";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useDictionaryContext } from "../../contexts/dictionary-context";

interface MapProps {
  requestMapDataPoints: RequestMapDataPoint[];
  invertColors: boolean;
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

export const Map = ({ requestMapDataPoints, invertColors }: MapProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef>(null);
  const { translateLocation } = useDictionaryContext();
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [cursor, setCursor] = useState<"auto" | "pointer">("auto");

  const searchParams = new URLSearchParams(window.location.search);
  const showRegions = (searchParams.get("show_regions") || process.env.REACT_APP_SHOW_REGIONS) === "true";
  
  const interactiveLayerIds = useMemo(() => {return showRegions ? ["circles", "state-fills"] : ["circles"];}, [showRegions]);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: mapAidRequestsToFeatures(requestMapDataPoints, translateLocation)
  };

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
        <Source id="circles-source" type="geojson" data={geojson}>
          <Layer {...(showRegions ? (invertColors ? layerStyleWithRegionsInvertedColors : layerStyleWithRegions) : (invertColors ? layerStyleInvertedColors : layerStyle))} />
        </Source>
        {showRegions && <RegionsSourceWithLayers requestMapDataPoints={requestMapDataPoints} invertColors={invertColors} />}

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
                    {popupInfo.data.city}: {popupInfo.data.totalItems} {t("requests")}
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
