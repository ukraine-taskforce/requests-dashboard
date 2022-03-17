import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { orderBy, groupBy, map, assignInWith, reduce } from "lodash";

import { useLocationsQuery, useAidRequestQuery, useSuppliesQuery, ID } from "../../others/contexts/api";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";
import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { MultiTab } from "../../others/components/MultiTab";
import { CollapsibleTable } from "../../others/components/CollapsibleList";
import { layerStyle } from "../../others/components/map/CircleLayerStyle";
import { mapAidRequestsToFeatures, adaptToMap } from "../../others/helpers/map-utils";
import { processAidRequests } from "../../others/helpers/process-aid-request";
import { useSidebarContext } from "../../others/components/sidebar-context";
import { FilterItem, useFilter } from "../../others/contexts/filter";
import { DecodedLocation, DecodedAidRequest } from "../../others/helpers/decode-aid-request";
import { mapLocationsToTableData, mapCategoriesToTableData } from "./map-to-table-data";

import {
  processByCities,
  processedByCitiesToTableData,
  getUniqueDates,
  translateToLocation,
  translateToSupply,
} from "../../others/helpers/aid-request-grouped";

export function Requests() {
  const { t } = useTranslation();
  const { data: cities } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();
  const { data: aidRequests } = useAidRequestQuery();
  const filterContext = useFilter();

  const addFilter = filterContext.addFilter;

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
        filterItems: getUniqueDates(aidRequests)
          .sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
          })
          .map((date, i): FilterItem => ({ id: date, selected: i === dates.size - 1, text: date })),
        active: false,
        singleValueFilter: true,
      });
    }

    // TODO: to implement cities
    // if (decodedAndGroupedByLocation.length) {
    //   const filterItems: FilterItem[] = decodedAndGroupedByLocation.map(
    //     (city): FilterItem => ({ id: city.location.name.toLowerCase().replace(" ", "-"), text: city.location.name, selected: false })
    //   );

    //   addFilter({
    //     filterName: "Cities",
    //     filterItems,
    //     active: false,
    //     singleValueFilter: true,
    //   });
    // }
  }, [supplies, aidRequests, addFilter]);

  const activeCategoryFilters = filterContext.getActiveFilterItems("Categories");
  const activeDateFilter = String(filterContext.getActiveFilterItems("Dates")[0]); // TODO: change to string type, it's always string

  const { processedByCities, mapData } = useMemo(() => {
    if (!cities || !aidRequests || !supplies) {
      return {
        processedByCities: [],
        mapData: [],
      };
    }
    // const temp = aidRequests.slice(0, 100);
    const processedByCities = processByCities(aidRequests, activeDateFilter);
    const mapData = processedByCities.map((aidRequest) => adaptToMap(aidRequest, translateToLocation(cities), translateToSupply(supplies)));

    return {
      processedByCities,
      mapData,
    };
  }, [aidRequests, cities, supplies, activeDateFilter]);

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: mapAidRequestsToFeatures(mapData),
  };

  const layerFilterCategory = activeCategoryFilters.length
    ? ["in", ["get", "category"], ["array", ["literal", activeCategoryFilters]]]
    : ["==", ["get", "category"], "ALL"];

  const layerFilterDate = activeDateFilter ? ["==", ["get", "date"], ["string", activeDateFilter]] : ["boolean", true];

  const layerFilter = ["all", layerFilterCategory, layerFilterDate];

  // const categoriesTableData = mapLocationsToTableData(decodedAndGroupedByCategory);
  // const filteredAndGroupedByCategory = categoriesTableData
  //   .map((data: CategoriesTableData) => {
  //     return {
  //       ...data,
  //       hidden: data.hidden.filter((req) => req.date === selectedDate),
  //     };
  //   })
  //   .filter((data: CategoriesTableData) => (activeCategories.length ? activeCategories.some((category) => data.name === category) : data)) // TODO: activeCategories needs to be full for "ALL"
  //   .map((data: CategoriesTableData) => {
  //     const getTotalForCategory = () => data.hidden.reduce((partialSum, aidRequest) => partialSum + aidRequest.total, 0);
  //     return {
  //       ...data,
  //       total: getTotalForCategory(),
  //     };
  //   })
  //   .filter((data: CategoriesTableData) => data.total !== 0)
  //   .sort((a: any, b: any) => b.total - a.total);

  // const locationsTableData = mapCategoriesToTableData(decodedAndGroupedByLocation);

  const filteredAndGroupedByLocation = processedByCities.map(processedByCitiesToTableData);

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
            {/* <CollapsibleTable rows={selectedTabId === 0 ? filteredAndGroupedByLocation : filteredAndGroupedByCategory} /> */}
            <CollapsibleTable rows={filteredAndGroupedByLocation} />
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
