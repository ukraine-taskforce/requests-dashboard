import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";

import styles from "./login.module.css";

import { ImgBrand } from "../../medias/images/UGT_Asset_Brand";

export function Login() {
  const { t } = useTranslation();

  // For caching purposes
  useSuppliesQuery();
  useLocationsQuery();

  return (
    <React.Fragment>
      <ImgBrand className={styles.ugtLogo} alt="UGT Logo" />
      <h1>{t("home_how_does_works")}</h1>
      <p>
        <Link to="/requests">Requests</Link>
      </p>
      <p>
        <Link to="/incidents">Incidents</Link>
      </p>
    </React.Fragment>
  );
}
