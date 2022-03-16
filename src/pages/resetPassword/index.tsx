import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAuth } from "../../others/contexts/auth";

import { ImgBrand } from "../../medias/images/UGT_Asset_Brand";

enum FormStep {
  Username,
  Confirmation,
  Done,
}

export function ResetPassword() {
  const { t } = useTranslation();
  const { sendCode, confirmPassword } = useAuth();
  const [username, setUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<FormStep>(FormStep.Username);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();
      switch (step) {
        case FormStep.Username:
          await sendCode(username);

          setStep(FormStep.Confirmation);
          break;

        case FormStep.Confirmation:
          await confirmPassword(code, username, newPassword);

          setStep(FormStep.Done);
          break;
        default:
          break;
      }
    },
    [step, setStep, username, code, newPassword, sendCode, confirmPassword]
  );

  const disabledStatus = React.useMemo(
    () =>
      step === FormStep.Done || (step === FormStep.Username && !username) || (step === FormStep.Confirmation && (!newPassword || !code)),
    [code, newPassword, step, username]
  );

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 20, display: "flex" }}>
        <ImgBrand alt="UGT Logo" />
        <Typography variant="h4" component="h1" gutterBottom sx={{ margin: "auto" }}>
          {t("ugt")}
        </Typography>
      </Box>
      <Typography variant="h5" component="h1" gutterBottom sx={{ my: 4 }}>
        {t("request_new_password_label")}
      </Typography>
      {step === FormStep.Confirmation && (
        <Alert color="info" severity="info" sx={{ mb: 2 }}>
          {t("code_sent")}
        </Alert>
      )}
      {step === FormStep.Done && (
        <React.Fragment>
          <Alert color="success" severity="success" sx={{ mb: 2 }}>
            {t("password_change_success")}
          </Alert>
          <Link to="/login">
            <Typography variant="h6" component="h1" gutterBottom sx={{ my: 2 }}>
              {t("go_to_login")}
            </Typography>
          </Link>
        </React.Fragment>
      )}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 10, display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2 }}
            label={t("login")}
            placeholder="username"
            inputProps={{ "aria-label": t("login") }}
            autoComplete="login"
            variant="filled"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            disabled={step !== FormStep.Username}
          />
          {step === FormStep.Confirmation && (
            <React.Fragment>
              <TextField
                sx={{ mb: 2 }}
                label={t("code")}
                placeholder="123456"
                inputProps={{ "aria-label": t("code") }}
                variant="filled"
                value={code}
                onChange={(event) => setCode(event.currentTarget.value)}
              />
              <TextField
                sx={{ mb: 2 }}
                label={t("password")}
                placeholder="password"
                type="password"
                autoComplete="password"
                inputProps={{ "aria-label": t("password") }}
                variant="filled"
                value={newPassword}
                onChange={(event) => setNewPassword(event.currentTarget.value)}
              />
            </React.Fragment>
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button type="submit" sx={{ mb: 2 }} variant="contained" disabled={disabledStatus}>
            {t("reset_password")}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
