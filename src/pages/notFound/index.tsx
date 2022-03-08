import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <h1>404</h1>
      <p>{t("page_not_exist")}</p>
      <Link to="/">{t("go_to_homepage")}</Link>
    </React.Fragment>
  );
}
