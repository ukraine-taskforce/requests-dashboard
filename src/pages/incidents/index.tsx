import { useTranslation } from "react-i18next";

import { useLocationsQuery } from "../../others/contexts/api";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";

import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { MultiTab } from "../../others/components/MultiTab";
import { useSidebarContext } from "../../others/components/sidebar-context";

export function Incidents() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();

  const { selectedTabId, setSelectedTabId } = useSidebarContext();

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar>
            <MultiTab selectedId={selectedTabId} onChange={setSelectedTabId} labels={[t("by_cities"), t("by_items")]} />
          </Sidebar>
        }
      >
        <Map />
      </Main>
    </Layout>
  );
}
