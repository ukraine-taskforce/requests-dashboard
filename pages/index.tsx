import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MapboxMap } from "./map/mapbox-map";

export default function Index() {
  return (
    <Container sx={{ width: "100vw", height: "100vh" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ position: "relative", top: 0 }}
      >
        Requests map
      </Typography>
      <Box sx={{ width: "100%", height: "80%" }}>
        <MapboxMap />
      </Box>
    </Container>
  );
}
