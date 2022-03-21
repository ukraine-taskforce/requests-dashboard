import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

import { useLocationsQuery, useAidRequestQuery, useSuppliesQuery, ID } from "../../others/contexts/api";
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
import { FilterItem, useFilter } from "../../others/contexts/filter";
import { DecodedLocation, DecodedAidRequest } from "../../others/helpers/decode-aid-request";
import { mapLocationsToTableData, mapCategoriesToTableData } from "./map-to-table-data";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();
  const { data: aidRequests } = useAidRequestQuery();
  const filterContext = useFilter();

  const addFilter = filterContext.addFilter;

  const { decodedAndGroupedByLocation, decodedAndGroupedByCategory } = useMemo(() => {
    return processAidRequests(cities, supplies, aidRequests);
  }, [cities, supplies, aidRequests]);

  useEffect(() => {
    if (supplies?.length) {
      addFilter({
        filterName: "Categories",
        filterItems: supplies.map((category): FilterItem => ({ id: category.name as ID, selected: false, text: category.name })),
        active: false,
        singleValueFilter: true,
      });
    }

    if (aidRequests?.length) {
      const dates = aidRequests.reduce((dateSet, request) => {
        dateSet.add(request.date);
        return dateSet;
      }, new Set<string>());

      addFilter({
        filterName: "Dates",
        filterItems: Array.from(dates)
          .sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
          })
          .map((date, i): FilterItem => ({ id: date, selected: i === dates.size - 1, text: date })),
        active: false,
        singleValueFilter: true,
      });
    }

    if (decodedAndGroupedByLocation.length) {
      const filterItems: FilterItem[] = decodedAndGroupedByLocation.map(
        (city): FilterItem => ({ id: city.location.name.toLowerCase().replace(" ", "-"), text: city.location.name, selected: false })
      );

      addFilter({
        filterName: "Cities",
        filterItems,
        active: false,
        singleValueFilter: false,
      });
    }
  }, [supplies, decodedAndGroupedByLocation, aidRequests, addFilter]);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: mapAidRequestsToFeatures(decodedAndGroupedByLocation),
  };

  const { selectedTabId, setSelectedTabId } = useSidebarContext();

  const activeCategoryFilters = filterContext.getActiveFilterItems("Categories");
  const activeDateFilter = filterContext.getActiveFilterItems("Dates")[0];

  const layerFilterCategory = activeCategoryFilters.length
    ? ["in", ["get", "category"], ["array", ["literal", activeCategoryFilters]]]
    : ["==", ["get", "category"], "ALL"];

  const layerFilterDate = activeDateFilter ? ["==", ["get", "date"], ["string", activeDateFilter]] : ["boolean", true];

  const layerFilter = ["all", layerFilterCategory, layerFilterDate];

  const selectedDate = activeDateFilter;
  const activeCategories = activeCategoryFilters;
  const categoriesTableData = mapLocationsToTableData(decodedAndGroupedByCategory);
  const filteredAndGroupedByCategory = categoriesTableData
    .map((data: CategoriesTableData) => {
      return {
        ...data,
        hidden: data.hidden.filter((req) => req.date === selectedDate),
      };
    })
    .filter((data: CategoriesTableData) => (activeCategories.length ? activeCategories.some((category) => data.name === category) : data)) // TODO: activeCategories needs to be full for "ALL"
    .map((data: CategoriesTableData) => {
      const getTotalForCategory = () => data.hidden.reduce((partialSum, aidRequest) => partialSum + aidRequest.total, 0);
      return {
        ...data,
        total: getTotalForCategory(),
      };
    })
    .filter((data: CategoriesTableData) => data.total !== 0)
    .sort((a: any, b: any) => b.total - a.total);

  const locationsTableData = mapCategoriesToTableData(decodedAndGroupedByLocation);
  const filteredAndGroupedByLocation = locationsTableData
    .map((data: LocationsTableData) => {
      return {
        ...data,
        decodedAidRequests: data.decodedAidRequests.filter((req) => req.date === selectedDate),
      };
    })
    .map((data: LocationsTableData) => {
      return {
        ...data,
        hidden: data.decodedAidRequests
          .map((req) => ({ name: req.name, total: req.amount }))
          .filter((req) => (activeCategories.length ? activeCategories.some((category) => req.name === category) : req)), // TODO: activeCategories needs to be full for "ALL"
      };
    })
    .map((data: LocationsTableData) => {
      const getTotalForLocation = () => data.hidden.reduce((partialSum, aidRequest) => partialSum + aidRequest.total, 0);
      return {
        ...data,
        total: getTotalForLocation(),
      };
    })
    .filter((data: LocationsTableData) => data.total !== 0)
    .sort((a: any, b: any) => b.total - a.total);

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar className="requests-sidebar">
            <MultiTab selectedId={selectedTabId} onChange={setSelectedTabId} labels={[t("by_cities"), t("by_items")]} marginBottom={4} />
            <CollapsibleTable rows={selectedTabId === 0 ? filteredAndGroupedByLocation : filteredAndGroupedByCategory} />
          </Sidebar>
        }
      >
        <Map
          sourceWithLayer={
            <Source id="ukr_water_needs" type="geojson" data={geojson}>
              {/* @ts-ignore */}
              <Layer {...layerStyle} filter={layerFilter} />
            </Source>
          }
        />
      </Main>
    </Layout>
  );
}

type CategoriesTableData = {
  name: string;
  total: number;
  hidden: {
    name: string;
    total: number;
    date: string;
    amount: number;
    location: DecodedLocation;
  }[];
};

type LocationsTableData = {
  name: string;
  total: number;
  hidden: {
    name: string;
    total: number;
  }[];
  location: DecodedLocation;
  decodedAidRequests: DecodedAidRequest[];
};
