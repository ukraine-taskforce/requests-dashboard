import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Layer, Source } from "react-map-gl";

interface RegionsSourceWithLayersProperties {
  regionsOriginal: Feature<Geometry, GeoJsonProperties>[];
  regionsWithMeta: Feature<Geometry, GeoJsonProperties>[];
  invertColors: boolean;
};

export const MaxRegionVisibleZoomLevel = 8;

export const RegionsSourceWithLayers = ({ regionsOriginal, regionsWithMeta, invertColors }: RegionsSourceWithLayersProperties) => {
  const regionsGeo: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: regionsWithMeta,
  };

  const color1 = invertColors ? 'rgba(0, 200, 0, 0)' : 'rgba(200, 0, 0, 0)';
  const color2 = invertColors ? 'rgb(0, 200, 0)' : 'rgb(200,0,0)';
  return (<><Source id="state" type="geojson" key="states_dynamic" data={regionsGeo}>
           <Layer id="state-fills" type="fill" layout={{}}
            paint={{
              "fill-color": [
                    "interpolate",
                    ["linear"], 
                    ["zoom"],
                    7,
                    ["interpolate", ["linear"], ["get", "normalized_amount"], 0, color1, 1, color2],
                    MaxRegionVisibleZoomLevel,
                    ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 'rgba(255,255,255,0)', 1, 'rgba(255,255,255,0)'],
                    ],                      
           }} />
          </Source>
          <Source id="state_constant" type="geojson" key="states_static" data={{type: "FeatureCollection", features: regionsOriginal}}>
            <Layer id="state-borders" type="line" layout={{}} paint={{"line-color": "black", 'line-width': 1}} />
          </Source></>);
};
