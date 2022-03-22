import { AidRequest } from "../../contexts/api";
import { adminRegions } from "../../fixtures/regionsP3";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Layer, Source } from "react-map-gl";
import { useDictionaryContext } from "../../contexts/dictionary-context";
import { mapRegionIdsToAidRequestCount } from "../../helpers/aid-request-helpers";

interface RegionsSourceWithLayersProperties {
  aidRequests: AidRequest[];
};

export const RegionsSourceWithLayers = ({aidRequests}: RegionsSourceWithLayersProperties) => {
  const { translateLocation } = useDictionaryContext();
  const allRegionsWithMeta: Feature<Geometry, GeoJsonProperties>[]  = [];
  const regionToCount = mapRegionIdsToAidRequestCount(aidRequests, translateLocation);
  const maxVal = Object.values(regionToCount).reduce((a, b) => a > b ? a : b, 0);
  adminRegions.forEach((region) => {
    if (region.properties && region.properties.shapeID in regionToCount) {
      const res = Object.assign({}, region);
      res.properties = Object.assign({}, res.properties);
      res.properties.normalized_amount = regionToCount[res.properties.shapeID] / maxVal;
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
                    8,
                    ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 'rgba(255,255,255,0)', 1, 'rgba(255,255,255,0)'],
                    ],                      
           }} />
          </Source>
          <Source id="state_constant" type="geojson" key="states_static" data={{type: "FeatureCollection", features: adminRegions}}>
            <Layer id="state-borders" type="line" layout={{}} paint={{"line-color": "black", 'line-width': 1}} />
          </Source></>);
};
