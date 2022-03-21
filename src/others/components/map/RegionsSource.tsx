import { useEffect, RefObject } from "react";
import { useFilter } from "../../contexts/filter";
import { GeoJSONSource } from "maplibre-gl";
import { AidRequest } from "../../contexts/api";
import { adminRegions } from "../../fixtures/regionsP3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Layer, Source, MapRef } from "react-map-gl";
import { useDictionaryContext } from "../../contexts/dictionary-context";


interface RegionsSourceProperties {
  aidRequests: AidRequest[] | undefined;
  mapRef: RefObject<MapRef>;
  mapLoaded: boolean;
};


export const RegionsSource = ({aidRequests, mapRef, mapLoaded}: RegionsSourceProperties) => {
  const { translateLocation } = useDictionaryContext();
  const filterContext = useFilter();
  const { Dates: dateFilter} = filterContext.filters;
  const dates = dateFilter?.filterItems.map(({text}) => text) || [];

  const searchParams = new URLSearchParams(window.location.search);
  const showRegions = (searchParams.get('show_regions') ?
                       searchParams.get('show_regions') :
                       process.env.REACT_APP_SHOW_REGIONS) === '1';
  const regionsSplitByDate = (searchParams.get('regions_split_by_date') ?
                              searchParams.get('regions_split_by_date') :
                              process.env.REACT_APP_REGIONS_SPLIT_BY_DATE) === '1';

  const activeDateFilter = filterContext.getActiveFilterItems("Dates")[0];
  const layerFilterDate = (regionsSplitByDate ?
                           ["boolean", "true"] :
                           ["==", ["get", "date"], ["string", activeDateFilter]]);

  const activeCategoryFilters = filterContext.getActiveFilterItems("Categories");

  useEffect(() => {
    if (!showRegions || !mapRef || !mapRef.current) return;
    const allRegionsWithMeta = [];
    for (const date of dates) {
      if (regionsSplitByDate && date !== activeDateFilter) continue;
      const regionToCount: {[id: string]: number} = {};
      var maxVal = 0;
      if (aidRequests) {
        for (const request of aidRequests) {
          if (request.date !== date) continue;
          // TODO: support multi category
          if (activeCategoryFilters.length > 0 && request.category_id !== activeCategoryFilters[0]) continue;
          const city = translateLocation(request.city_id);
          if (!city) continue;
          const region_id = city.region_id;
          if (!(region_id in regionToCount)) {
            regionToCount[region_id] = 0;
          }
          regionToCount[region_id] = regionToCount[region_id] + request.requested_amount;
          maxVal = Math.max(maxVal, regionToCount[region_id]);
        }
      }
      for (const region of adminRegions) {
        const res = regionsSplitByDate ? region : Object.assign({}, region);
        if (res.properties) {
          res.properties = Object.assign({}, res.properties);
          res.properties.date = date;
          if (res.properties.shapeID in regionToCount) {
            res.properties.normalized_amount = regionToCount[res.properties.shapeID] / maxVal;
          } else {
            res.properties.normalized_amount = 0;
          }
        }
        allRegionsWithMeta.push(res);
      }
    }
    const regionsGeo: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: allRegionsWithMeta,
    };
    if (mapRef.current.getSource('state')) {
      (mapRef.current.getSource('state') as GeoJSONSource).setData(regionsGeo);
    }
  }, [mapRef,
      JSON.stringify(activeCategoryFilters),
      regionsSplitByDate ? activeDateFilter : '',
      JSON.stringify(dates),
      JSON.stringify(aidRequests),  // This looks crazy, is there a better way?
      translateLocation,
      mapLoaded]);


  if (showRegions) {
   return (<><Source id="state" type="geojson" key="states_dynamic" data={{type: "FeatureCollection", features: []}}>
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
            </Source>
            <Source id="state_constant" type="geojson" key="states_static" data={{type: "FeatureCollection", features: adminRegions}}>
              <Layer id="state-borders" type="line" layout={{}} paint={{"line-color": "black", 'line-width': 1}} />
            </Source></>);
  } else {
    return (null);
  }
};
