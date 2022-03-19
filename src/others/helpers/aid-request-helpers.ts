import { groupBy, map, filter, eq, flatten } from "lodash";
import { Location, Supply, AidRequest, ID } from "../contexts/api";

import { ListItem } from "../components/CollapsibleListItem";

export const translateToLocation =
  (cities: Location[]) =>
  (city_id: number): Location => {
    return cities[city_id - 1];
  }; // TODO: remove once map consumes DictionaryContext properly

export const translateToSupply =
  (supplies: Supply[]) =>
  (category_id: ID): Supply => {
    const supply = supplies.find((suply) => String(suply.id) === String(category_id));
    if (!supply) throw new Error(`Supply category: ${category_id} is not defined`);

    return supply;
  }; // TODO: remove once map consumes DictionaryContext properly

export const sortDates = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export const filterByCategoryIds = (aidRequests: AidRequest[], categoryIds: (string | "*")[]) => {
  if (categoryIds.includes("*")) return aidRequests;
  return flatten(categoryIds.map((categoryId) => filter(aidRequests, (req) => eq(categoryId, req.category_id))));
};

export const groupByCities = (aidRequests: AidRequest[]) => {
  const groupedByCityId = groupBy(aidRequests, "city_id");

  const groupedByCityIdWithTotal = map(groupedByCityId, (reqs, city_id) => {
    return { city_id: Number(city_id), total: totalCalculator(reqs), aidRequests: [...reqs] };
  });

  return groupedByCityIdWithTotal;
};

export const groupByCategories = (aidRequests: AidRequest[]) => {
  const groupedByCategoryId = groupBy(aidRequests, "category_id");

  const groupedByCategoryIdWithTotal = map(groupedByCategoryId, (reqs, category_id) => {
    return { category_id, total: totalCalculator(reqs), aidRequests: [...reqs] };
  });

  return groupedByCategoryIdWithTotal;
};

type GroupedByCities = {
  city_id: number;
  total: number;
  aidRequests: AidRequest[];
};

type GroupedByCategories = {
  category_id: string;
  total: number;
  aidRequests: AidRequest[];
};

type TableData = ListItem;

export const groupedByCitiesToTableData = ({ city_id, total, aidRequests }: GroupedByCities): TableData => {
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

export const groupedByCategoriesToTableData = ({ category_id, total, aidRequests }: GroupedByCategories): TableData => {
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

const totalCalculator = (aidRequests: AidRequest[]) => aidRequests.reduce((sum, aidRequest) => sum + aidRequest.requested_amount, 0);