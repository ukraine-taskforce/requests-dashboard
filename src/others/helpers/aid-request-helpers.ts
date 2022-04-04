import { groupBy, map } from "lodash";

import { AidRequest, Supply } from "../contexts/api";
import { ListItem } from "../components/CollapsibleListItem";
import { MapDataPoint } from "./map-utils";

export const sortDates = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export enum FilterEnum {
  All = "*",
}

export const filterByCategoryIds = (aidRequests: AidRequest[], categoryIds: string[] | FilterEnum.All): AidRequest[] => {
  if (categoryIds === FilterEnum.All) return aidRequests;
  const categoryIdsSet = new Set(categoryIds);
  return aidRequests.filter((aidRequest) => categoryIdsSet.has(aidRequest.category_id));
};

export const filterByCityIds = (aidRequests: AidRequest[], cityIds: number[] | FilterEnum.All): AidRequest[] => {
  if (cityIds === FilterEnum.All) return aidRequests;
  const cityIdsSet = new Set(cityIds);
  return aidRequests.filter((aidRequest) => cityIdsSet.has(aidRequest.city_id));
};

type Total = {
  total: number;
};

type GroupedByCities = {
  city_id: number;
  aidRequests: AidRequest[];
};

export const groupByCityIdWithTotal = (aidRequests: AidRequest[]): (GroupedByCities & Total)[] => {
  const groupedByCityId = groupBy(aidRequests, "city_id");

  const groupedByCityIdWithTotal = map(groupedByCityId, (reqs, city_id) => {
    return { city_id: Number(city_id), total: totalCalculator(reqs), aidRequests: [...reqs] };
  });

  return groupedByCityIdWithTotal;
};

type GroupedByCategories = {
  category_id: string;
  aidRequests: AidRequest[];
};

export const groupByCategoryIdWithTotal = (aidRequests: AidRequest[]): (GroupedByCategories & Total)[] => {
  const groupedByCategoryId = groupBy(aidRequests, "category_id");

  const groupedByCategoryIdWithTotal = map(groupedByCategoryId, (reqs, category_id) => {
    return { category_id, total: totalCalculator(reqs), aidRequests: [...reqs] };
  });

  return groupedByCategoryIdWithTotal;
};

type TableData = ListItem;

export const groupedByCitiesToTableData = ({ city_id, total, aidRequests }: GroupedByCities & Total): TableData => {
  return {
    name: city_id,
    value: total,
    hidden: map(aidRequests, (req) => {
      return {
        name: req.category_id,
        value: req.requested_amount,
      };
    }),
  };
};

export const groupedByCategoriesToTableData = ({ category_id, total, aidRequests }: GroupedByCategories & Total): TableData => {
  return {
    name: category_id,
    value: total,
    hidden: map(aidRequests, (req) => {
      return {
        name: req.city_id,
        value: req.requested_amount,
      };
    }),
  };
};

const totalCalculator = (aidRequests: AidRequest[]): number =>
  aidRequests.reduce((sum, aidRequest) => sum + aidRequest.requested_amount, 0);

type GroupedByCityId = {
  city_id: number;
  total: number;
  aidRequests: AidRequest[];
};

export const aggregateCategories = (
  aidRequestsGroupedByCityId: GroupedByCityId,
  supplyTranslator: (category_id: string) => Supply | undefined
): MapDataPoint => {
  const sortedAidRequests = aidRequestsGroupedByCityId.aidRequests.sort((a, b) => b.requested_amount - a.requested_amount);
  const description = sortedAidRequests.reduce((d, aidRequest) => {
    const supply = supplyTranslator(aidRequest.category_id);
    if (!supply) throw new Error(`Supply category: ${supply} is not defined`);
    // TODO: Consider moving the formatting to the component that does the rendering.
    return d + supply.name + ": " + aidRequest.requested_amount + "\n";
  }, "");
  return {
    city_id: aidRequestsGroupedByCityId.city_id,
    amount: aidRequestsGroupedByCityId.total,
    description: description
  };
};

