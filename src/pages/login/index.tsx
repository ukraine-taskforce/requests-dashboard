import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";
import { useAuth } from "../../others/contexts/auth";

import { ImgBrand } from "../../medias/images/UGT_Asset_Brand";

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // For caching purposes
  useSuppliesQuery();
  useLocationsQuery();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 20, display: "flex" }}>
        <ImgBrand alt="UGT Logo" />
        <Typography variant="h4" component="h1" gutterBottom sx={{ margin: "auto" }}>
          {t("ugt")}
        </Typography>
      </Box>
      <Box sx={{ mb: 10, display: "flex", flexDirection: "column" }}>
        <TextField
          sx={{ mb: 2 }}
          label={t("email")}
          placeholder="jane.doe@mail.com"
          type="email"
          inputProps={{ "aria-label": t("email") }}
          variant="filled"
        />
        <TextField
          sx={{ mb: 2 }}
          label={t("password")}
          placeholder="password"
          type="password"
          inputProps={{ "aria-label": t("password") }}
          variant="filled"
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          onClick={() => {
            login();
            navigate("/");
          }}
        >
          {t("login")}
        </Button>
        <Button sx={{ mb: 2 }} variant="outlined">
          {t("request_new_password")}
        </Button>
      </Box>
    </Container>
  );
}
