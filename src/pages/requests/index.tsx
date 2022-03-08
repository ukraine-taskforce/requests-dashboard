import { useTranslation } from "react-i18next";

import { useLocationsQuery } from "../../others/contexts/api";

import { Layout } from "../../others/components/Layout";
import MapComponent from "../../others/components/MapComponent";


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
      <MapComponent />
    </Layout>
  );
}
