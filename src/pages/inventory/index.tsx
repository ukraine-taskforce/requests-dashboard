import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layer, Source, MapProvider } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { groupBy, isEmpty, uniq, keys } from "lodash";

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
import { layerStyleWithRegions } from "../../others/components/map/CircleLayerStyleWithRegionsInventory";
import { RegionsSourceWithLayers } from "../../others/components/map/RegionsSourceWithLayers";
import { mapToFeatures } from "../../others/helpers/map-utils";
import {
  aggregateCategories,
  sortDates,
  filterByCategoryIds,
  filterByCityIds,
  FilterEnum,
  groupByCityIdWithTotal,
  groupByWarehouseIdWithTotal,
  groupByCategoryIdWithTotal,
  groupedByCitiesToTableData,
  groupedByCategoriesToTableData,
  groupedByWarehouseToTableData,
} from "../../others/helpers/stock-item-helpers";
import { GetFakeStock, GetFakeWarehouses } from "../../others/fixtures/fakeInventory";

export function Inventory() {
  const { t } = useTranslation();
  const { locationDict, suppliesDict, translateLocation, translateSupply } = useDictionaryContext();
  const warehousesDict = useMemo(() => GetFakeWarehouses(), []);
  const stockItems = useMemo(() => GetFakeStock(suppliesDict ? Object.values(suppliesDict): [], warehousesDict), [suppliesDict, warehousesDict]);
  const filterContext = useFilter();

  const { addFilter, getActiveFilterItems } = filterContext;

  // First create a lookup table for all stock items grouped by dates and memoise it
  const stockItemsGroupedByDate = useMemo(() => {
    if (!stockItems?.length) return {};

    return groupBy(stockItems, "date");
  }, [stockItems]);

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
        filterItems: Object.values(locationDict).map((location): FilterItem => ({ id: location.id, selected: false, text: location.name })),
        active: false,
        singleValueFilter: false,
        hasSearch: true,
      });
    }

    if (!isEmpty(stockItemsGroupedByDate)) {
      const uniqueDatesSorted = uniq(keys(stockItemsGroupedByDate)).sort(sortDates);

      addFilter({
        filterName: "Dates",
        filterItems: uniqueDatesSorted.map(
          (date, i): FilterItem => ({ id: date, selected: i === uniqueDatesSorted.length - 1, text: date })
        ),
        active: false,
        singleValueFilter: true,
      });
    }
  }, [suppliesDict, locationDict, stockItemsGroupedByDate, addFilter]);

  const activeFilterItems = getActiveFilterItems("Categories") as string[]; // typecasting necessary because type FilterItemId = string | number
  const activeDateFilter = getActiveFilterItems("Dates")[0] as string; // typecasting necessary because type FilterItemId = string | number
  const activeCityFilter = getActiveFilterItems("Cities") as number[]; // typecasting necessary because type FilterItemId = string | number

  // Filter stock items by given date, category, and city
  const stockItemsFiltered = useMemo(() => {
    if (!activeDateFilter || isEmpty(stockItemsGroupedByDate)) return [];
    const activeCategoryFilters = activeFilterItems.length ? activeFilterItems : FilterEnum.All;
    const activeCityFilters = activeCityFilter.length ? activeCityFilter : FilterEnum.All;

    const filteredByDate = stockItemsGroupedByDate[activeDateFilter];
    const filteredByCategories = filterByCategoryIds(filteredByDate, activeCategoryFilters);
    const filteredByCities = filterByCityIds(filteredByCategories, activeCityFilters);

    return filteredByCities;
  }, [stockItemsGroupedByDate, activeDateFilter, activeFilterItems, activeCityFilter]);

  // Group stock items them according to tables' needs
  // TODO: consider moving this step to the table component
  const { groupedByWarehouseWithTotal, groupedByCitiesWithTotal, groupedByCategoriesWithTotal } = useMemo(() => {
    if (!stockItemsFiltered.length) {
      return {
        groupedByWarehouseWithTotal: [],
        groupedByCitiesWithTotal: [],
        groupedByCategoriesWithTotal: [],
      };
    }

    const groupedByWarehouseWithTotal = groupByWarehouseIdWithTotal(stockItemsFiltered);
    const groupedByCitiesWithTotal = groupByCityIdWithTotal(stockItemsFiltered);
    const groupedByCategoriesWithTotal = groupByCategoryIdWithTotal(stockItemsFiltered);

    return {
      groupedByWarehouseWithTotal,
      groupedByCitiesWithTotal,
      groupedByCategoriesWithTotal,
    };
  }, [stockItemsFiltered]);

  // Map filtered stock items to data consumable by map component
  const isMapDataAvailable = locationDict && suppliesDict && groupedByCitiesWithTotal.length;
  const mapData = isMapDataAvailable ? groupedByCitiesWithTotal.map((stockItems) => aggregateCategories(stockItems, translateSupply, warehousesDict)) : [];
  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: mapToFeatures(mapData, translateLocation),
  };


  const tableDataByWarehouse = groupedByWarehouseWithTotal.map(groupedByWarehouseToTableData).sort((a, b) => Number(b.value) - Number(a.value));
  const tableDataByCities = groupedByCitiesWithTotal.map(groupedByCitiesToTableData).sort((a, b) => Number(b.value) - Number(a.value));
  const tableDataByCategories = groupedByCategoriesWithTotal
    .map(groupedByCategoriesToTableData)
    .sort((a, b) => Number(b.value) - Number(a.value));

  const { selectedTabId, setSelectedTabId } = useSidebarContext();

  // TODO: implement proper loaders
  // if (!locations) {
  //   return <Layout header={<Header />}>{/* <Loader /> */}</Layout>;
  // }

  const loadingMessage = "";

  const tableByWarehouse = (
    <CollapsibleTable
      rows={tableDataByWarehouse}
      renderRowData={(row) => {
        const warehouse = warehousesDict[Number(row.name)];
	const location = translateLocation(warehouse.city_id);
        return {
          name: warehouse?.name || loadingMessage,
          value: row.value,
          coordinates: location
            ? {
                latitude: location.lat,
                longitude: location.lon,
              }
            : undefined,
          hidden: row.hidden
            .map(({ name, value }) => ({
              name: translateSupply(String(name))?.name || loadingMessage,
              value: value,
            }))
            .sort((a, b) => Number(b.value) - Number(a.value)),
        };
      }}
    />
  );



  const tableByCities = (
    <CollapsibleTable
      rows={tableDataByCities}
      renderRowData={(row) => {
        const location = translateLocation(Number(row.name));
        return {
          name: location?.name || loadingMessage,
          value: row.value,
          coordinates: location
            ? {
                latitude: location.lat,
                longitude: location.lon,
              }
            : undefined,
          hidden: row.hidden
            .map(({ name, value }) => ({
              name: translateSupply(String(name))?.name || loadingMessage,
              value: value,
            }))
            .sort((a, b) => Number(b.value) - Number(a.value)),
        };
      }}
    />
  );

  const tableByItems = (
    <CollapsibleTable
      rows={tableDataByCategories}
      renderRowData={(row) => {
        return {
          name: translateSupply(String(row.name))?.name || loadingMessage,
          value: row.value,
          hidden: row.hidden
            .map(({ name, value }) => {
              const location = translateLocation(Number(name));
              return {
                name: location?.name || loadingMessage,
                value: value,
                coordinates: location
                  ? {
                      latitude: location.lat,
                      longitude: location.lon,
                    }
                  : undefined,
              };
            })
            .sort((a, b) => Number(b.value) - Number(a.value)),
        };
      }}
    />
  );
  if (!(window.location.hostname === "localhost" || window.location.hostname === "maps.ugtf.dev")){
    return (<></>);
  }
  return (
    <Layout header={<Header aidRequests={[]} />}>
      <MapProvider>
        <Main
          aside={
            <Sidebar className="requests-sidebar">
              <MultiTab selectedId={selectedTabId} onChange={setSelectedTabId} labels={["Warehouses", t("by_cities"), t("by_items")]} marginBottom={4} />
              {selectedTabId === 0 ? tableByWarehouse : (selectedTabId === 1 ? tableByCities : tableByItems) }
            </Sidebar>
          }
        >
          <Map
            interactiveLayerIds={["circles", "state-fills"]}
            sourceWithLayer={
              <>
                <Source id="circles-source" type="geojson" data={geojson}>
                  <Layer {...layerStyleWithRegions} />
                </Source>
                <RegionsSourceWithLayers mapDataPoints={mapData} invertColors={true} />
              </>
            }
          />
        </Main>
      </MapProvider>
    </Layout>
  );
}
