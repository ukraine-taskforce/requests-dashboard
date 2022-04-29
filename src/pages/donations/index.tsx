import { useState, useEffect } from "react";
import MapComponent, { Popup, MapProvider, Marker } from "react-map-gl";

import { Layout } from "../../others/components/Layout";
import { Header } from "../../others/components/donations/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { CollapsibleTable } from "../../others/components/CollapsibleListSimple";
import { Box, Typography } from "@mui/material";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type DonationPoint = {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  description: string;
  openingHours: string;
};

const fakeDonationPoints: DonationPoint[] = [
 {
   id: 1,
   name: "ETH drop-off location",
   coordinates: {
     latitude: 47.3764,
     longitude: 8.5476,     
   },
   phoneNumber: "+41781111111",
   description: "EN:\ntake only cloths\nUA:\nberem odjag",
   openingHours: "daily 10:00-17:00 except for sundays",
 },
 {
   id: 2,
   name: "Ukrainian embassy in Bern",
   coordinates: {
     latitude: 46.9439,
     longitude: 7.4471
   },
   phoneNumber: "+41782222222",
   description: "DE: wir nehmen alles\nUA: prunoste vse\nEN: we take everything",
   openingHours: "check the embassy website",
 },
];

export function Donations() {
  const [popupInfo, setPopupInfo] = useState<DonationPoint | null>(null);
  
  useEffect(() => {
    document.title = "Donation drop-off points";
  }, []);

  const tableData = fakeDonationPoints.map((point: DonationPoint) => {
    return {
      name: point.name,
      description: `${point.description}\n\nPhone number: ${point.phoneNumber}\nOpening hours: ${point.openingHours}`,
      coordinates: point.coordinates,
    };
  });

  const table = (
    <CollapsibleTable
      rows={tableData}
      renderRowData={(row) => {
        return {
          name: row.name,
          coordinates: row.coordinates,
          description: row.description,
        };
      }}
    />
  );

  const initialMapView = {
    latitude: 48.45,
    longitude: 10.5,
    zoom: 5,
  };

  return (
    <Layout header={<Header />}>
      <MapProvider>
        <Main
          aside={
            <Sidebar className="requests-sidebar">
              {table}
            </Sidebar>
          }
        >
          <Box sx={{ height: "100%", width: "100%" }}>
            <MapComponent
              mapLib={maplibregl}
              initialViewState={initialMapView}
              mapStyle="https://api.maptiler.com/maps/streets/style.json?key=8XnO8TF3UjHDY1RKP9jm"
              style={{ borderRadius: "24px" }}
            >
              {fakeDonationPoints.map((point: DonationPoint) => (
                <Marker key={point.id.toString()} longitude={point.coordinates.longitude} latitude={point.coordinates.latitude} onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(point);
                }} />))}
              {popupInfo && (
               <Popup
                 longitude={popupInfo.coordinates.longitude}
                 latitude={popupInfo.coordinates.latitude}
                 onClose={() => setPopupInfo(null)}
                 closeButton={false}
                 closeOnClick={true}
                 style={{
                   color: "#000000",
                 }}
               >
                 <div>
                   <Typography variant="h6" component="div">
                     {popupInfo.name}
                   </Typography>
                   <pre>
                     {popupInfo.description}
                   </pre>
                   <br/>
                   <b>Phone number:</b> {popupInfo.phoneNumber}<br/>
                   <b>Opening hours:</b> {popupInfo.openingHours}<br/>
                </div>
              </Popup>)}
            </MapComponent>
          </Box>
        </Main>
      </MapProvider>
    </Layout>
  );
}
