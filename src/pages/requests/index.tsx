import { useTranslation } from "react-i18next";

import { useLocationsQuery } from "../../others/contexts/api";

import { Layout } from "../../others/components/Layout";
import { Header } from "../../others/components/Header";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  return (
    <Layout header={<Header />}>
      <div>MAP {t("random_translations")}</div>
    </Layout>
  );
}
