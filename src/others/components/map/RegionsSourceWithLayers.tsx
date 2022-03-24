import { adminRegions } from "../../fixtures/regionsP3";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Layer, Source } from "react-map-gl";
import { useDictionaryContext } from "../../contexts/dictionary-context";
import { mapRegionIdsToAidRequestMetadata } from "../../helpers/aid-request-helpers";
import { RequestMapDataPoint } from "../../helpers/map-utils";

interface RegionsSourceWithLayersProperties {
  requestMapDataPoints: RequestMapDataPoint[];
};

export const MaxRegionVisibleZoomLevel = 8;

export const RegionsSourceWithLayers = ({requestMapDataPoints}: RegionsSourceWithLayersProperties) => {
  const { translateLocation } = useDictionaryContext();
  const allRegionsWithMeta: Feature<Geometry, GeoJsonProperties>[]  = [];
  const regionToMetadata = mapRegionIdsToAidRequestMetadata(requestMapDataPoints, translateLocation);
  const maxVal = Object.values(regionToMetadata).map((d) => d.amount).reduce((a, b) => a > b ? a : b, 0);
  adminRegions.forEach((region) => {

    if (region.properties && region.id && region.id in regionToMetadata) {
      const res = Object.assign({}, region);
      res.properties = Object.assign({}, res.properties);
      const regionMetadata = regionToMetadata[res.id];
      res.properties.amount = regionMetadata.amount;
      res.properties.normalized_amount = regionMetadata.amount / maxVal;
      res.properties.description = regionMetadata.description;
      allRegionsWithMeta.push(res);
    }
  });
  const regionsGeo: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: allRegionsWithMeta,
  };


  return (<><Source id="state" type="geojson" key="states_dynamic" data={regionsGeo}>
           <Layer id="state-fills" type="fill" layout={{}}
            paint={{
              "fill-color": [
                    "interpolate",
                    ["linear"], 
                    ["zoom"],
                    7,
                    ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 'rgba(200, 0, 0, 0)', 1, 'rgb(200,0,0)'],
                    MaxRegionVisibleZoomLevel,
                    ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 'rgba(255,255,255,0)', 1, 'rgba(255,255,255,0)'],
                    ],  
              "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    1,
                    0.5,
                    ],              
           }} />
          </Source>
          <Source id="state_constant" type="geojson" key="states_static" data={{type: "FeatureCollection", features: adminRegions}}>
            <Layer id="state-borders" type="line" layout={{}} paint={{"line-color": "black", 'line-width': 1}} />
          </Source></>);
};
