import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";
import { AuthStatus, useAuth } from "../../others/contexts/auth";

import { ImgBrand } from "../../medias/images/UGT_Asset_Brand";

export function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetPassword, status } = useAuth();
  const [email, setEmail] = React.useState("");

  // For caching purposes
  useSuppliesQuery();
  useLocationsQuery();

  const handleSubmit = React.useCallback(async () => {
    await resetPassword(email);
    navigate("/login");
  }, [resetPassword, navigate, email]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 20, display: "flex" }}>
        <ImgBrand alt="UGT Logo" />
        <Typography variant="h4" component="h1" gutterBottom sx={{ margin: "auto" }}>
          {t("ugt")}
        </Typography>
      </Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ margin: "auto" }}>
        {t("request_new_password_label")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 10, display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2 }}
            label={t("email")}
            placeholder="jane.doe@mail.com"
            type="email"
            inputProps={{ "aria-label": t("email") }}
            variant="filled"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button sx={{ mb: 2 }} variant="outlined" disabled={status === AuthStatus.Loading}>
            {t("request_new_password")}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
