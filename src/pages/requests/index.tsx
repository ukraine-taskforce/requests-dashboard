import { useTranslation } from "react-i18next";

import { useLocationsQuery } from "../../others/contexts/api";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";

import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { MultiTab } from "../../others/components/MultiTab";
import { Layer, Source } from "react-map-gl";
import { layerStyle } from "../../others/components/map/CircleLayerStyle";
import { aidRequestsFixture } from "../../others/fixtures/request.fixture";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: aidRequestsFixture,
  };

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar>
            <MultiTab labels={[t("by_cities"), t("by_items")]} />
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
