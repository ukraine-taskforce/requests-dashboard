import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

import { useLocationsQuery, useAidRequestQuery, useSuppliesQuery, ID } from "../../others/contexts/api";
import { useSidebarContext } from "../../others/components/sidebar-context";
import { FilterItem, useFilter } from "../../others/contexts/filter";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";
import { Header } from "../../others/components/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { MultiTab } from "../../others/components/MultiTab";
import { CollapsibleTable } from "../../others/components/CollapsibleList";
import { layerStyle } from "../../others/components/map/CircleLayerStyle";
import { mapAidRequestsToFeatures, adaptToMap } from "../../others/helpers/map-utils";

import {
  processByCities,
  processByCategories,
  processedByCitiesToTableData,
  processedByCategoriesToTableData,
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

  const { processedByCities, processedByCategories, mapData } = useMemo(() => {
    if (!cities || !aidRequests || !supplies) {
      return {
        processedByCities: [],
        processedByCategories: [],
        mapData: [],
      };
    }

    const processedByCities = processByCities(aidRequests, activeDateFilter);
    const processedByCategories = processByCategories(aidRequests, activeDateFilter);
    const mapData = processedByCities.map((aidRequest) => adaptToMap(aidRequest, translateToLocation(cities), translateToSupply(supplies)));

    return {
      processedByCities,
      processedByCategories,
      mapData,
    };
  }, [aidRequests, cities, supplies, activeDateFilter]);

  const tableDataByCities = processedByCities.map(processedByCitiesToTableData);
  const tableDataByCategories = processedByCategories.map(processedByCategoriesToTableData);
  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: mapAidRequestsToFeatures(mapData),
  };

  const layerFilterCategory = activeCategoryFilters.length
    ? ["in", ["get", "category"], ["array", ["literal", activeCategoryFilters]]]
    : ["==", ["get", "category"], "ALL"];

  const layerFilterDate = activeDateFilter ? ["==", ["get", "date"], ["string", activeDateFilter]] : ["boolean", true];
  const layerFilter = ["all", layerFilterCategory, layerFilterDate];

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
            <CollapsibleTable rows={selectedTabId === 0 ? tableDataByCities : tableDataByCategories} />
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
