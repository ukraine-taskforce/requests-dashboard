import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MapboxMap } from "./map/mapbox-map";

import { AppHeader } from "./shared/app-header";

export default function Index() {
  return (
    <>
      <AppHeader />
      <Container sx={{ width: "100vw", height: "100vh" }}>
        <Box sx={{ width: "100%", height: "80%" }}>
          <MapboxMap />
        </Box>
      </Container>
    </>
  );
}
