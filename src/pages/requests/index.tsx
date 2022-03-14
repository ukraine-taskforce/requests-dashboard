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
          .map((date, i): FilterItem => ({ id: date, selected: i === dates.size - 1, text: date }))
          .sort((a, b) => {
            return new Date(a.text).getTime() - new Date(b.text).getTime();
          }),
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
  }, [supplies, decodedAndGroupedByLocation, aidRequests, addFilter]);

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
    features: mapAidRequestsToFeatures(decodedAndGroupedByLocation),
  };

  const { selectedTabId, setSelectedTabId } = useSidebarContext();

  if (!cities) {
    return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  }

  const activeCategoryFilters = filterContext.getActiveFilterItems("Categories");
  const activeDateFilter = filterContext.getActiveFilterItems("Dates")[0];

  const layerFilterCategory = activeCategoryFilters.length
    ? ["in", ["get", "category"], ["array", ["literal", activeCategoryFilters]]]
    : ["==", ["get", "category"], "ALL"];

  const layerFilterDate = activeDateFilter ? ["==", ["get", "date"], ["string", activeDateFilter]] : ["boolean", true];

  const layerFilter = ["all", layerFilterCategory, layerFilterDate];

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
              {/* @ts-ignore */}
              <Layer {...layerStyle} filter={layerFilter} />
            </Source>
          }
        />
      </Main>
    </Layout>
  );
}
