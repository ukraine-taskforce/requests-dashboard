import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Source } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { groupBy, isEmpty, uniq, keys } from "lodash";

import { useAidRequestQuery } from "../../others/contexts/api";
import { useDictionaryContext } from "../../others/contexts/dictionary-context";
import { useSidebarContext } from "../../others/contexts/sidebar-context";
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
  sortDates,
  filterByCategoryIds,
  groupByCityIdWithTotal,
  groupByCategoryIdWithTotal,
  groupedByCitiesToTableData,
  groupedByCategoriesToTableData,
} from "../../others/helpers/aid-request-helpers";

export function Requests() {
  const { t } = useTranslation();
  const { data: aidRequests } = useAidRequestQuery();
  const { locationDict, suppliesDict, translateLocation, translateSupply } = useDictionaryContext();

  const filterContext = useFilter();

  const { addFilter, getActiveFilterItems } = filterContext;

  // First create a lookup table for all aid requests grouped by dates and memoise it
  const aidRequestsGroupedByDate = useMemo(() => {
    if (!aidRequests?.length) return {};

    return groupBy(aidRequests, "date");
  }, [aidRequests]);

  // Initialize filter context with data coming from BE (supplies, dates, location)
  // TODO: consider moving this to a component higher up in the render tree
  // TODO: consider simplifying filterContext API
  useEffect(() => {
    if (suppliesDict) {
      addFilter({
        filterName: "Categories",
        filterItems: Object.values(suppliesDict).map((category): FilterItem => ({ id: category.id, selected: false, text: category.name })),
        active: false,
        singleValueFilter: false,
      });
    }

    if (locationDict) {
      addFilter({
        filterName: "Cities",
        filterItems: Object.values(locationDict).map((location): FilterItem => ({ id: location.name.toLowerCase().replace(" ", "-"), selected: false, text: location.name })),
        active: false,
        singleValueFilter: false,
        hasSearch: true,
      });
    }

    if (!isEmpty(aidRequestsGroupedByDate)) {
      const uniqueDatesSorted = uniq(keys(aidRequestsGroupedByDate)).sort(sortDates);

      addFilter({
        filterName: "Dates",
        filterItems: uniqueDatesSorted.map(
          (date, i): FilterItem => ({ id: date, selected: i === uniqueDatesSorted.length - 1, text: date })
        ),
        active: false,
        singleValueFilter: true,
      });
    }
  }, [suppliesDict, locationDict, aidRequestsGroupedByDate, addFilter]);

  const activeFilterItems = getActiveFilterItems("Categories") as string[]; // typecasting necessary because filter item is string | boolean
  const activeDateFilter = getActiveFilterItems("Dates")[0] as string; // typecasting necessary because filter item is string | boolean

  // Filter aid requests by given date and by category (and possibly city in the next step)
  const aidRequestsFiltered = useMemo(() => {
    if (!activeDateFilter || isEmpty(aidRequestsGroupedByDate)) return [];
    const activeCategoryFilters = activeFilterItems.length ? activeFilterItems : ["*"];

    const filteredByDate = aidRequestsGroupedByDate[activeDateFilter];
    const filteredByCategories = filterByCategoryIds(filteredByDate, activeCategoryFilters);

    return filteredByCategories;
  }, [aidRequestsGroupedByDate, activeDateFilter, activeFilterItems]);

  // Group aid requests them according to tables' needs
  // TODO: consider moving this step to the table component
  const { groupedByCitiesWithTotal, groupedByCategoriesWithTotal } = useMemo(() => {
    if (!aidRequestsFiltered.length) {
      return {
        groupedByCitiesWithTotal: [],
        groupedByCategoriesWithTotal: [],
      };
    }

    const groupedByCitiesWithTotal = groupByCityIdWithTotal(aidRequestsFiltered);
    const groupedByCategoriesWithTotal = groupByCategoryIdWithTotal(aidRequestsFiltered);

    return {
      groupedByCitiesWithTotal,
      groupedByCategoriesWithTotal,
    };
  }, [aidRequestsFiltered]);

  // Map filtered aid requests to data consumable by map component
  // TODO: consider refactoring map so that it consumes raw AidRequest[]
  // NOTE: adaptToMap has been added temporarily
  const isMapDataAvailable = locationDict && suppliesDict && groupedByCitiesWithTotal.length;
  const mapData = isMapDataAvailable
    ? groupedByCitiesWithTotal.map((aidRequest) => adaptToMap(aidRequest, translateLocation(aidRequest.city_id), translateSupply))
    : [];
  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: mapAidRequestsToFeatures(mapData),
  };

  const tableDataByCities = groupedByCitiesWithTotal.map(groupedByCitiesToTableData).sort((a, b) => Number(a.value) - Number(b.value));
  const tableDataByCategories = groupedByCategoriesWithTotal
    .map(groupedByCategoriesToTableData)
    .sort((a, b) => Number(a.value) - Number(b.value));

  // TODO: move this logic to map component - it should get filters via context and process them accordingly
  // TODO: fix filter mapping - it should use category_id
  // TODO: add some comments / typing explaining what kind of black the magic is happening here :)
  const layerFilterCategory = activeFilterItems.length
    ? ["in", ["get", "category"], ["array", ["literal", activeFilterItems]]]
    : ["==", ["get", "category"], "ALL"];

  const layerFilterDate = activeDateFilter ? ["==", ["get", "date"], ["string", activeDateFilter]] : ["boolean", true];
  const layerFilter = ["all", layerFilterCategory, layerFilterDate];

  const { selectedTabId, setSelectedTabId } = useSidebarContext();

  // TODO: implement proper loaders
  // if (!locations) {
  //   return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  // }

  const loadingMessage = "";
  const byCities = selectedTabId === 0;
  return (
    <Layout header={<Header />}>
      <Main
        aside={
          <Sidebar className="requests-sidebar">
            <MultiTab selectedId={selectedTabId} onChange={setSelectedTabId} labels={[t("by_cities"), t("by_items")]} marginBottom={4} />
            <CollapsibleTable
              rows={byCities ? tableDataByCities : tableDataByCategories}
              renderRowData={(row) => ({
                name: byCities
                  ? translateLocation(Number(row.name))?.name || loadingMessage
                  : translateSupply(String(row.name))?.name || loadingMessage,
                value: row.value,
                hidden: row.hidden
                  .map(({ name, value }) => ({
                    name: byCities
                      ? translateSupply(String(name))?.name || loadingMessage
                      : translateLocation(Number(name))?.name || loadingMessage,
                    value: value,
                  }))
                  .sort((a, b) => Number(b.value) - Number(a.value)),
              })}
            />
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
