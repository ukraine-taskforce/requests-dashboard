import { LayerProps } from "react-map-gl";

export const layerStyleWithRegions: LayerProps = {
  id: "circles",
  type: "circle",
  minzoom: 2,
  paint: {
    "circle-radius": [
      // Doc on interpolation https://maplibre.org/maplibre-gl-js-docs/style-spec/expressions/#interpolate
      "interpolate",
      ["linear"],
      ["zoom"],
      7.8,
      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 0, 1, 0],
      7.9,
      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 0, 1, 10],
      16,
      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 0, 1, 200],
    ],

    "circle-color": [
      // Doc on interpolation https://maplibre.org/maplibre-gl-js-docs/style-spec/expressions/#interpolate                 
      "interpolate",
      ["linear"],
      ["get", "normalized_amount"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgba(103,169,207,0.8)",
      0.4,
      "rgba(209,229,240,0.8)",
      0.6,
      "rgba(253,219,199,0.8)",
      0.8,
      "rgba(239,138,98,0.8)",
      1,
      "rgba(178,24,43,0.8)",
    ],
    "circle-stroke-color": "black",
    "circle-stroke-width": 1,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 1],
  },
};
