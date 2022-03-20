import { groupBy, map, filter, eq, flatten } from "lodash";

import { AidRequest } from "../contexts/api";
import { ListItem } from "../components/CollapsibleListItem";

export const sortDates = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export const filterByCategoryIds = (aidRequests: AidRequest[], categoryIds: (string | "*")[]): AidRequest[] => {
  if (categoryIds.includes("*")) return aidRequests;
  return flatten(categoryIds.map((categoryId) => filter(aidRequests, (req) => eq(categoryId, req.category_id))));
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
