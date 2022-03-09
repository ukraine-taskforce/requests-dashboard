import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";

import { ImgBrand } from "../../medias/images/UGT_Asset_Brand";

export function Home() {
  const { t } = useTranslation();

  // For caching purposes
  useSuppliesQuery();
  useLocationsQuery();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: "flex" }}>
        <ImgBrand alt="UGT Logo" />
        <Typography variant="h4" component="h1" gutterBottom sx={{ margin: "auto" }}>
          {t("ugt")}
        </Typography>
      </Box>
      <Box sx={{ my: 4, display: "flex", flexDirection: "column" }}>
        <p>
          <Link to="/requests">Requests</Link>
        </p>
        <p>
          <Link to="/incidents">Incidents</Link>
        </p>
      </Box>
    </Container>
  );
}
