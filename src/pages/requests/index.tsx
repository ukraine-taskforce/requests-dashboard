import { useTranslation } from "react-i18next";

import { useLocationsQuery } from "../../others/contexts/api";
import { Layout } from "../../others/components/Layout";
import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Dashboard } from "../../others/components/Dashboard";
import { MultiTab } from "../../others/components/MultiTab";
import { MapWindow } from "../../others/components/MapWindow";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Dashboard>
            <MultiTab labels={[t("by_cities"), t("by_items")]} />
          </Dashboard>
        }
      >
        {/* Todo: replace with the real map */}
        <MapWindow> Map will go here</MapWindow>
      </Main>
    </Layout>
  );
}
