import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

import { useLocationsQuery, useAidRequestQuery, useSuppliesQuery } from "../../others/contexts/api";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";
import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { MultiTab } from "../../others/components/MultiTab";
import { CollapsibleTable } from "../../others/components/CollapsibleList";
import { layerStyle } from "../../others/components/map/CircleLayerStyle";
import { mapAidRequestsToFeatures } from "../../others/helpers/map-utils";
import { processAidRequests } from "../../others/helpers/process-aid-request";
import { useSidebarContext } from "../../others/components/sidebar-context";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();
  const { data: aidRequests } = useAidRequestQuery();

  const { decodedAndGroupedByLocation, decodedAndGroupedByCategory } = useMemo(() => {
    return processAidRequests(cities, supplies, aidRequests);
  }, [cities, supplies, aidRequests]);

  const memoisedLocationsTable = useMemo(() => {
    const totalDescending = (a: any, b: any) => b.total - a.total;
    const tableData = decodedAndGroupedByLocation
      .map((aidReqest) => {
        return {
          name: aidReqest.location.name,
          total: aidReqest.total,
          hidden: aidReqest.decodedAidRequests.map((category) => ({ name: category.name, total: category.amount })).sort(totalDescending),
        };
      })
      .sort(totalDescending);
    return <CollapsibleTable rows={tableData} />;
  }, [decodedAndGroupedByLocation]);

  const memoisedCategoriesTable = useMemo(() => {
    const totalDescending = (a: any, b: any) => b.total - a.total;
    const tableData = decodedAndGroupedByCategory
      .map((aidReqest) => {
        return {
          name: aidReqest.name,
          total: aidReqest.total,
          hidden: aidReqest.decodedAidRequests
            .map((category) => ({ name: category.location.name, total: category.amount }))
            .sort(totalDescending),
        };
      })
      .sort(totalDescending);
    return <CollapsibleTable rows={tableData} />;
  }, [decodedAndGroupedByCategory]);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: Array.from(mapAidRequestsToFeatures(decodedAndGroupedByLocation)),
  };

  const { selectedTabId, setSelectedTabId } = useSidebarContext();

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar className="requests-sidebar">
            <MultiTab selectedId={selectedTabId} onChange={setSelectedTabId} labels={[t("by_cities"), t("by_items")]} marginBottom={4} />
            {selectedTabId === 0 ? memoisedLocationsTable : memoisedCategoriesTable}
          </Sidebar>
        }
      >
        <Map
          sourceWithLayer={
            <Source id="ukr_water_needs" type="geojson" data={geojson}>
              <Layer {...layerStyle} />
            </Source>
          }
        />
      </Main>
    </Layout>
  );
}
