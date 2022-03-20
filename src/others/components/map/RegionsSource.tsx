import { useEffect, RefObject } from "react";
import { useFilter } from "../../contexts/filter";
import { GeoJSONSource } from "maplibre-gl";
import { Location, AidRequest } from "../../contexts/api";
import { adminRegions } from "../../fixtures/regionsP3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Layer, Source, MapRef } from "react-map-gl";

interface RegionsSourceProperties {
  cities: Location[] | undefined;
  aidRequests: AidRequest[] | undefined;
  mapRef: RefObject<MapRef>;
  mapLoaded: boolean;
};


export const RegionsSource = ({cities, aidRequests, mapRef, mapLoaded}: RegionsSourceProperties) => {
  const filterContext = useFilter();
  const { Dates: dateFilter, ...otherFilters} = filterContext.filters;
  const dates = dateFilter?.filterItems.map(({text}) => text) || [];

  const searchParams = new URLSearchParams(window.location.search);
	console.log(searchParams.get('show_aa'), (searchParams.get('show_aa') ? '1': '0'));
  const showAA = (searchParams.get('show_aa') ? searchParams.get('show_aa') : process.env.REACT_APP_SHOW_AA) === '1';
  const aaSplitByDate = (searchParams.get('aa_split_by_date') ? searchParams.get('aa_split_by_date') : process.env.REACT_APP_AA_SPLIT_BY_DATE) === '1';

  const activeDateFilter = filterContext.getActiveFilterItems("Dates")[0];
  const layerFilterDate = aaSplitByDate ? ["boolean", "true"] : ["==", ["get", "date"], ["string", activeDateFilter]];

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


  if (showAA) {
   return <Source id="state" type="geojson" key="states" data={{type: "FeatureCollection", features: []}}>
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
            </Source>;
  } else {
    return (null);
  }
};
