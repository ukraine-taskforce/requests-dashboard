import { LayerProps } from "react-map-gl";

export const layerStyle: LayerProps = {
  id: "ukr_water_needs-point",
  type: "circle",
  minzoom: 2,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      7,
      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 1, 1, 4],
      16,
      ["interpolate", ["linear"], ["get", "normalized_amount"], 0, 5, 1, 70],
    ],
    "circle-color": [
      "interpolate",
      ["linear"],
      ["get", "normalized_amount"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      1,
      "rgb(178,24,43)",
    ],
    "circle-stroke-color": "black",
    "circle-stroke-width": 1,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 1],
  },
};
