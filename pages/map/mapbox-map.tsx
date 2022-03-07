import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer } from "react-map-gl";
import useSWR from "swr";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_KEY = process.env.NEXT_PUBLIC_MAPBOX_KEY;
const initialLatitude = 48.4501071;
const initialLongitude = 30.5240501;
const layerStyle = {
  id: "ukr_water_needs-point",
  type: "circle",
  minzoom: 5,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      7,
      ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
      16,
      ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
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
    "circle-stroke-color": "white",
    "circle-stroke-width": 1,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
  },
};

export const MapboxMap = () => {
  const { data, error } = useSWR("/api/aid-requests", fetcher);

  const geojson = {
    type: "FeatureCollection",
    features: data,
  };

  return (
    <Map
      initialViewState={{
        latitude: initialLatitude,
        longitude: initialLongitude,
        zoom: 5,
      }}
      // style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxAccessToken={MAPBOX_KEY}
    >
      {/* @ts-ignore */}
      <Source id="ukr_water_needs" type="geojson" data={geojson}>
        {/* @ts-ignore */}
        <Layer {...layerStyle} />
      </Source>
    </Map>
  );
};

// @ts-ignore
const fetcher = (...args: any) => fetch(...args).then((res) => res.json());
