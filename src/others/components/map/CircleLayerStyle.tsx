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
      ["interpolate", ["linear"], ["get", "mag"], 1, 1, 3, 4],
      16,
      ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 70],
    ],
    "circle-color": [
      "interpolate",
      ["linear"],
      ["get", "mag"],
      1,
      "rgba(33,102,172,0)",
      2,
      "rgb(103,169,207)",
      3,
      "rgb(209,229,240)",
      4,
      "rgb(253,219,199)",
      5,
      "rgb(239,138,98)",
      6,
      "rgb(178,24,43)",
    ],
    "circle-stroke-color": "black",
    "circle-stroke-width": 1,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 1],
  },
};
