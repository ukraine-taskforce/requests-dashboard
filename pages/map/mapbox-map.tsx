import { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export const MapboxMap = () => {
  const MAPBOX_KEY = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  return (
    <Map
      initialViewState={{
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14,
      }}
      // style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAPBOX_KEY}
    >
      <Marker longitude={-122.4} latitude={37.8} color="red" />
    </Map>
  );
};
