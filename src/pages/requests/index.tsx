import { useTranslation } from "react-i18next";

import { useLocationsQuery } from "../../others/contexts/api";

import { Layout } from "../../others/components/Layout";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();

  if (!cities) {
    return (
      <Layout>
        {/* <Loader /> */}
      </Layout>
    );
  }

  return (
    <Layout>
      <div>MAP {t("random_translations")}</div>
    </Layout>
  );
}
