import { useEffect } from "react";
import { useLocationsQuery, useAidRequestQuery } from "../../contexts/api";
import { useFilter } from "../../contexts/filter";
import { useTranslation } from "react-i18next";
import MapComponent, { Popup, MapRef, MapLayerMouseEvent } from "react-map-gl";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { adminRegions } from "../../fixtures/regionsP3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Box, Typography } from "@mui/material";
import { ReactNode, useCallback, useState, useRef } from "react";
//import { useSearchParams } from "react-router-native";
//import queryString from "query-string";
import { Layer, Source } from "react-map-gl";
interface MapProps {
  sourceWithLayer?: ReactNode;
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

export const Map = ({ sourceWithLayer }: MapProps) => {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();
  const { data: aidRequests } = useAidRequestQuery();
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [cursor, setCursor] = useState<"auto" | "pointer">("auto");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const filterContext = useFilter();
  const { Dates: dateFilter, ...otherFilters} = filterContext.filters;
  const dates = dateFilter?.filterItems.map(({text}) => text) || [];

  //const [a, b] = useSearchParams();
//	console.log(a,b);
  const searchParams = new URLSearchParams(window.location.search);
	console.log(searchParams.get('show_aa'), (searchParams.get('show_aa') ? '1': '0'));
  const showAA = (searchParams.get('show_aa') ? searchParams.get('show_aa') : process.env.REACT_APP_SHOW_AA) === '1';
  const aaSplitByDate = (searchParams.get('aa_split_by_date') ? searchParams.get('aa_split_by_date') : process.env.REACT_APP_AA_SPLIT_BY_DATE) === '1';
	
  console.log(showAA, aaSplitByDate);
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


  const activeDateFilter = filterContext.getActiveFilterItems("Dates")[0];

  const layerFilterDate = aaSplitByDate ? ["boolean", "true"] : ["==", ["get", "date"], ["string", activeDateFilter]];


  const map = <MapComponent
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={initialUkraineCenterView}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: "24px" }}
        interactiveLayerIds={["ukr_water_needs-point"]}
        cursor={cursor}
	onLoad={() => {console.log('map loaded');setMapLoaded(true);}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

      >
        {sourceWithLayer}

	{showAA ? <Source id="state" type="geojson" key="states" data={{type: "FeatureCollection", features: []}}>
              <Layer id="state-borders" type="line" layout={{}} paint={{"line-color": "black", 'line-width': 1}} />
              <Layer id="state-fills" type="fill" filter={layerFilterDate} layout={{}} 
              paint={{
                "fill-color": [
                      "interpolate",
                      ["linear"], 
                      ["zoom"],
                      7,
                      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 'rgba(200, 0, 0, 0)', 1, 'rgb(200,0,0)'],
                      8,
                      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 'rgba(255,255,255,0)', 1, 'rgba(255,255,255,0)'],
                      ],
                      
             }} />
            </Source> : ""}

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
      </MapComponent>;

  
  const activeCategoryFilters = filterContext.getActiveFilterItems("Categories");


  useEffect(() => {
	  if (!showAA) {return;}
	  console.log(mapRef, mapRef.current);
	  if(mapRef && mapRef.current){
   const start = new Date().getTime();
		  
  console.log('2', activeDateFilter, activeCategoryFilters, mapRef.current.getSource('state'));
  const cityToRegion: {[id: string]: string} = {};
  if (cities) {
    for (const city of cities) {
      cityToRegion[city.id] = city.region_id;
    }
  }
		 const adminRegionsWithMeta = [];
  for (const date of dates) {
	  if (aaSplitByDate && date !== activeDateFilter) {continue;}
  const adminsWithData: {[id: string]: number} = {};
  var maxVal = 0;
  if (aidRequests) {
    for (const request of aidRequests) {
      if (request.date !== date) {
        continue;
      }
      // TODO: support multi category
      if (activeCategoryFilters.length > 0 && request.category_id !== activeCategoryFilters[0]) {
        continue;
      }
      const region_id = cityToRegion[request.city_id];
      if (!(region_id in adminsWithData)) {
        adminsWithData[region_id] = 0;
      }
      adminsWithData[region_id] = adminsWithData[region_id] + request.requested_amount;
      maxVal = Math.max(maxVal, adminsWithData[region_id]);
     }
  }
  console.log(date, adminsWithData['UKR-ADM1-14850775B25539455'], maxVal);
  for (const region of adminRegions) {
    const res = aaSplitByDate ? region : Object.assign({}, region);
    if (res.properties) {
      res.properties = Object.assign({}, res.properties);
      res.properties.date = date;
      if (res.properties.shapeID in adminsWithData) {
        res.properties.normalized_amount = adminsWithData[res.properties.shapeID] / maxVal;
      } else {
        res.properties.normalized_amount = 0;
      }
    }
    adminRegionsWithMeta.push(res);
  }
  }
  const regionsGeo: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: adminRegionsWithMeta,
  };
		  console.log('time ', (new Date().getTime() - start));
		  if (mapRef.current.getSource('state'))
		  (mapRef.current.getSource('state') as GeoJSONSource).setData(regionsGeo);

		  console.log('time2 ', (new Date().getTime() - start));

	  }
  }, [mapRef,mapRef.current,mapRef.current?  mapRef.current.getSource('state') : null, JSON.stringify(activeCategoryFilters),  aaSplitByDate ? activeDateFilter : '', JSON.stringify(dates), JSON.stringify(aidRequests), JSON.stringify(cities), mapLoaded]);


  return (
    <Box sx={{ height: "100%", width: "100%" }}>{map}</Box>
  );
};
