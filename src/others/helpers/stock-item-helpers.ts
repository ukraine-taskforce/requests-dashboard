import { groupBy, map } from "lodash";

import { Supply } from "../contexts/api";
import { Warehouse, StockItem } from "../fixtures/fakeInventory";
import { ListItem } from "../components/CollapsibleListItem";
import { MapDataPoint } from "./map-utils";

export const sortDates = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export enum FilterEnum {
  All = "*",
}

export const filterByCategoryIds = (stockItems: StockItem[], categoryIds: string[] | FilterEnum.All): StockItem[] => {
  if (categoryIds === FilterEnum.All) return stockItems;
  const categoryIdsSet = new Set(categoryIds);
  return stockItems.filter((item) => categoryIdsSet.has(item.category_id));
};

export const filterByCityIds = (stockItems: StockItem[], cityIds: number[] | FilterEnum.All): StockItem[] => {
  if (cityIds === FilterEnum.All) return stockItems;
  const cityIdsSet = new Set(cityIds);
  return stockItems.filter((item) => cityIdsSet.has(item.city_id));
};

type Total = {
  total: number;
};

type GroupedByCities = {
  city_id: number;
  stockItems: StockItem[];
};

type GroupedByWarehouses = {
  warehouse_id: number;
  stockItems: StockItem[];
};

export const groupByWarehouseIdWithTotal = (stockItems: StockItem[]): (GroupedByWarehouses & Total)[] => {
  const groupedByWarehouseId = groupBy(stockItems, "warehouse_id");

  const groupedByWarehouseIdWithTotal = map(groupedByWarehouseId, (reqs, warehouse_id) => {
    return { warehouse_id: Number(warehouse_id), total: totalCalculator(reqs), stockItems: [...reqs] };
  });

  return groupedByWarehouseIdWithTotal;
};

export const groupByCityIdWithTotal = (stockItems: StockItem[]): (GroupedByCities & Total)[] => {
  const groupedByCityId = groupBy(stockItems, "city_id");

  const groupedByCityIdWithTotal = map(groupedByCityId, (reqs, city_id) => {
    return { city_id: Number(city_id), total: totalCalculator(reqs), stockItems: [...reqs] };
  });

  return groupedByCityIdWithTotal;
};

type GroupedByCategories = {
  category_id: string;
  stockItems: StockItem[];
};

export const groupByCategoryIdWithTotal = (stockItems: StockItem[]): (GroupedByCategories & Total)[] => {
  const groupedByCategoryId = groupBy(stockItems, "category_id");

  const groupedByCategoryIdWithTotal = map(groupedByCategoryId, (reqs, category_id) => {
    return { category_id, total: totalCalculator(reqs), stockItems: [...reqs] };
  });

  return groupedByCategoryIdWithTotal;
};

type TableData = ListItem;

export const groupedByWarehouseToTableData = ({ warehouse_id, total, stockItems }: GroupedByWarehouses & Total): TableData => {
  return {
    name: warehouse_id,
    value: total,
    hidden: map(stockItems, (req) => {
      return {
        name: req.category_id,
        value: req.amount,
      };
    }),
  };
};

export const groupedByCitiesToTableData = ({ city_id, total, stockItems }: GroupedByCities & Total): TableData => {
  const grouped = groupBy(stockItems, "category_id");
  const groupedAndMapped = map(grouped, (reqs, category_id) => {
    return { name: category_id, value: totalCalculator(reqs) };
  });

  return {
    name: city_id,
    value: total,
    hidden: groupedAndMapped,
  };
};

export const groupedByCategoriesToTableData = ({ category_id, total, stockItems }: GroupedByCategories & Total): TableData => {
  const grouped = groupBy(stockItems, "city_id");
  const groupedAndMapped = map(grouped, (reqs, city_id) => {
    return { name: city_id, value: totalCalculator(reqs) };
  });

  return {
    name: category_id,
    value: total,
    hidden: groupedAndMapped,
  };
};

const totalCalculator = (stockItems: StockItem[]): number =>
  stockItems.reduce((sum, stockItem) => sum + stockItem.amount, 0);

type GroupedByCityId = {
  city_id: number;
  total: number;
  stockItems: StockItem[];
};

export const aggregateCategories = (
  aidRequestsGroupedByCityId: GroupedByCityId,
  supplyTranslator: (category_id: string) => Supply | undefined,
  warehousesDict: { [id:string]: Warehouse },
): MapDataPoint => {
  const grouped = groupBy(aidRequestsGroupedByCityId.stockItems, "warehouse_id");
  const groupedAndMapped = map(grouped, (reqs, warehouse_id) => {
    /*const reqSorted = reqs.sort((a, b) => b.amount - a.amount);
    const description = reqSorted.reduce((d, aidRequest) => {
      const supply = supplyTranslator(aidRequest.category_id);
      if (!supply) throw new Error(`Supply category: ${supply} is not defined`);
      // TODO: Consider moving the formatting to the component that does the rendering.
      return d + supply.name + ": " + aidRequest.amount + "\n";
    }, "");*/
    const w = warehousesDict[warehouse_id];
    const total = totalCalculator(reqs);
    return { total: total, description: `${w.name}: ${total}\n${w.contacts}\n\n` };
  });

  const sortedAidRequests = groupedAndMapped.sort((a, b) => b.total - a.total);
  const description = sortedAidRequests.reduce((d, aidRequest) => {
    return d + aidRequest.description + "\n";
  }, "");
  return {
    city_id: aidRequestsGroupedByCityId.city_id,
    amount: aidRequestsGroupedByCityId.total,
    description: description
  };
};
