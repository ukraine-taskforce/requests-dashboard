import { useEffect, RefObject } from "react";
import { useFilter } from "../../contexts/filter";
import { GeoJSONSource } from "maplibre-gl";
import { AidRequest } from "../../contexts/api";
import { adminRegions } from "../../fixtures/regionsP3";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Layer, Source, MapRef } from "react-map-gl";
import { useDictionaryContext } from "../../contexts/dictionary-context";
import { RegionData, filterByCategoryIds, groupByRegions } from "../../helpers/aid-request-helpers";


interface RegionsSourceProperties {
  aidRequestsGroupedByDate: { [id: string]: AidRequest[]};
  mapRef: RefObject<MapRef>;
  mapLoaded: boolean;
};


export const RegionsSource = ({aidRequestsGroupedByDate, mapRef, mapLoaded}: RegionsSourceProperties) => {
  const { translateLocation } = useDictionaryContext();
  const filterContext = useFilter();
  const { Dates: dateFilter} = filterContext.filters;
  const dates = dateFilter?.filterItems.map(({text}) => text) || [];

  const searchParams = new URLSearchParams(window.location.search);
  const regionsSplitByDate = (searchParams.get('regions_split_by_date') ?
                              searchParams.get('regions_split_by_date') :
                              process.env.REACT_APP_REGIONS_SPLIT_BY_DATE) === '1';

  const activeDateFilter = filterContext.getActiveFilterItems("Dates")[0];
  const layerFilterDate = (regionsSplitByDate ?
                           ["boolean", "true"] :
                           ["==", ["get", "date"], ["string", activeDateFilter]]);

  const activeCategoryFilters = filterContext.getActiveFilterItems("Categories") as string[];
  const filterUseEffectDependencies = JSON.stringify([activeCategoryFilters,
                                                      regionsSplitByDate ? activeDateFilter : '',
                                                      dates]);
  useEffect(() => {
    if (!mapRef || !mapRef.current || !aidRequestsGroupedByDate) return;
    const allRegionsWithMeta: Feature<Geometry, GeoJsonProperties>[]  = [];
    dates.forEach((date) => {
      if (regionsSplitByDate && date !== activeDateFilter) return;
      const aidRequests = filterByCategoryIds(aidRequestsGroupedByDate[date], activeCategoryFilters);
      const regionToCount: RegionData = groupByRegions(aidRequests, translateLocation);
      const maxVal = Object.values(regionToCount).reduce((a, b) => a > b ? a : b, 0);
      adminRegions.forEach((region) => {
        const res = regionsSplitByDate ? region : Object.assign({}, region);
        if (res.properties && res.properties.shapeID in regionToCount) {
          res.properties = Object.assign({}, res.properties);
          res.properties.date = date;
          res.properties.normalized_amount = regionToCount[res.properties.shapeID] / maxVal;
          allRegionsWithMeta.push(res);
        }
      });
    });
    const regionsGeo: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: allRegionsWithMeta,
    };
    if (mapRef.current.getSource('state')) {
      (mapRef.current.getSource('state') as GeoJSONSource).setData(regionsGeo);
    }
  }, [mapRef,
      filterUseEffectDependencies,
      aidRequestsGroupedByDate,
      translateLocation,
      mapLoaded]);


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
};
