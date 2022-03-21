import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { AuthStatus, useAuth } from "../../others/contexts/auth";

import { ImgBrand } from "../../media/images/UGT_Asset_Brand";
import { LanguageSelector } from "../../others/components/LanguageSelector";

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, status } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();
      await login(username, password);
    },
    [login, username, password]
  );

  React.useEffect(() => {
    if (status === AuthStatus.SignedIn) {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <>
    <Box sx={{ marginTop: 5, marginLeft: 5 }}>
      <LanguageSelector />
    </Box>
    <Container maxWidth="sm">
      <Box sx={{ my: 20, display: "flex" }}>
        <ImgBrand alt="UGT Logo" />
        <Typography variant="h4" component="h1" gutterBottom sx={{ margin: "auto" }}>
          {t("ugt")}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 10, display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2 }}
            label={t("login")}
            placeholder="username"
            autoComplete="login"
            inputProps={{ "aria-label": t("email") }}
            variant="filled"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <TextField
            sx={{ mb: 2 }}
            label={t("password")}
            placeholder="password"
            type="password"
            autoComplete="password"
            inputProps={{ "aria-label": t("password") }}
            variant="filled"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button sx={{ mb: 2 }} variant="contained" type="submit" disabled={!username || !password || status === AuthStatus.Loading}>
            {t("login2")}
          </Button>
          <Button sx={{ mb: 2 }} variant="outlined" disabled={status === AuthStatus.Loading} onClick={() => navigate("/reset-password")}>
            {t("request_new_password")}
          </Button>
        </Box>
      </form>
    </Container>
    </>
  );
}
