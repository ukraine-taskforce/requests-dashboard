import { AidRequest } from "../../contexts/api";
import { useTranslation } from "react-i18next";
import MapComponent, { Popup, MapRef, MapLayerMouseEvent } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { RegionsSource } from "../map/RegionsSource";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Typography } from "@mui/material";
import { ReactNode, useCallback, useState, useRef } from "react";

interface MapProps {
  sourceWithLayer?: ReactNode;
  aidRequests: AidRequest[] | undefined;
}

interface PopupInfo {
  latitude: number;
  longitude: number;
  data?: {
    description: string;
    city: string;
    totalItems: number;
  };
}

const initialUkraineCenterView = {
  latitude: 48.4501071,
  longitude: 30.5240501,
  zoom: 5,
};

const MAP_STYLE = process.env.REACT_APP_MAPLIBRE_MAP_STYLE || "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const Map = ({ sourceWithLayer, aidRequests }: MapProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [cursor, setCursor] = useState<"auto" | "pointer">("auto");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const searchParams = new URLSearchParams(window.location.search);
  const showRegions = (searchParams.get('show_regions') ?
                       searchParams.get('show_regions') :
                       process.env.REACT_APP_SHOW_REGIONS) === '1';

  const handleMouseEnter = useCallback(
    (event: MapLayerMouseEvent) => {
      if (mapRef?.current) {
        const features = mapRef.current.queryRenderedFeatures(event.point, {
          layers: ["ukr_water_needs-point"],
        });

        if (features && features.length > 0) {
          const requestData = features[0].properties;

          setCursor("pointer");

          setPopupInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            data: requestData
              ? {
                  city: requestData.city,
                  description: requestData.description,
                  totalItems: requestData.amount,
                }
              : undefined,
          });
        }
      }
    },
    [mapRef]
  );

  const handleMouseLeave = useCallback(() => {
    setCursor("auto");
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
        onLoad={() => {setMapLoaded(true);}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {sourceWithLayer}

        {showRegions && <RegionsSource aidRequests={aidRequests} mapRef={mapRef} mapLoaded={mapLoaded} />}

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
