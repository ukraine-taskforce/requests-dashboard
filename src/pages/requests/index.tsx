import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import omit from "lodash/omit";
import { useLocationsQuery, useAidRequestQuery, useSuppliesQuery, AidRequest, Location, Supply, ID } from "../../others/contexts/api";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";

import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { MultiTab } from "../../others/components/MultiTab";
import { CollapsibleTable } from "../../others/components/CollapsibleList";
import { Layer, Source } from "react-map-gl";
import { layerStyle } from "../../others/components/map/CircleLayerStyle";
import { aidRequestsFixture } from "../../others/fixtures/request.fixture";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();
  const { data: aidRequests } = useAidRequestQuery();

  const decodedAidRequests = useMemo(() => {
    if (cities && supplies && aidRequests) {
      return decodeAidRequests(aidRequests, cities, supplies);
    } else return [];
  }, [aidRequests, supplies, aidRequests]);

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  console.log("These are the decoded:", decodedAidRequests);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: aidRequestsFixture,
  };

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar className="requests-sidebar">
            <MultiTab labels={[t("by_cities"), t("by_items")]} marginBottom={4} />
            <CollapsibleTable rows={createItemsByCitiesExampleData().sort((cityA, cityB) => cityB.total - cityA.total)} />
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

// TODO: create proper mocked api response:
const createItemsByCitiesExampleData = () => {
  const randomNumber = () => Math.floor(Math.random() * 100);
  const exampleCities = ["Kiev", "Lviv", "Luck", "Berdychiv", "Odessa", "Ivano-Frankivsk"];
  const exampleCategories = ["Food", "Water", "Warm clothes", "Sleeping bags"];

  const mockCategories = exampleCategories.map((category: string) => ({ name: category, total: randomNumber() }));

  return exampleCities.map((city) => {
    // const getTotalForCity = () => mockCategories.reduce((partialSum, category) => partialSum + category.total, 0);
    const getExampleTotalForCity = () => mockCategories.reduce((partialSum, category) => partialSum + randomNumber(), 0);

    return {
      name: city,
      total: getExampleTotalForCity(),
      hidden: mockCategories,
    };
  });
};

const decodeAidRequests = (aidRequests: AidRequest[], locations: Location[], categories: Supply[]) => {
  return aidRequests.map((aidRequest: AidRequest) => {
    return {
      date: aidRequest.date,
      amount: aidRequest.requested_amount,
      category: decodeCategory(categories, aidRequest.category_id),
      location: decodeLocation(locations, aidRequest.city_id),
    };
  });
};

const decodeLocation = (locations: Location[], cityId: ID) => {
  const location = locations.find((location) => location.id === cityId);
  return omit(location, "id");
};

const decodeCategory = (categories: Supply[], category_id: ID) => {
  const category = categories.find((category) => category.id === category_id);
  return category?.name;
};
