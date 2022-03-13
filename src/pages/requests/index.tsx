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
import { aidRequestsFixture } from "../../others/fixtures/request.fixture";
import { processAidRequests } from "../../others/helpers/process-aid-request";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();
  const { data: aidRequests } = useAidRequestQuery();

  console.log("cities", cities);

  const { decodedAndGroupedByLocation } = useMemo(() => {
    return processAidRequests(cities, supplies, aidRequests);
  }, [cities, supplies, aidRequests]);

  const sortedTableRowDataByLocation = useMemo(() => {
    const totalDescending = (a: any, b: any) => b.total - a.total;
    return decodedAndGroupedByLocation
      .map((aidReqest) => {
        return {
          name: aidReqest.location.name,
          total: aidReqest.total,
          hidden: aidReqest.categories.map((category) => ({ name: category.name, total: category.amount })).sort(totalDescending),
        };
      })
      .sort(totalDescending);
  }, [aidRequests, supplies, aidRequests]);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: aidRequestsFixture,
  };

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar className="requests-sidebar">
            <MultiTab labels={[t("by_cities"), t("by_items")]} marginBottom={4} />
            <CollapsibleTable rows={sortedTableRowDataByLocation} />
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
