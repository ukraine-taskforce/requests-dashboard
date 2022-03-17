import { ReactText } from "react";
import { groupBy, map, keys, uniq, filter, eq, every } from "lodash";
import { Location, Supply, AidRequest, ID } from "../contexts/api";

export const translateToLocation =
  (cities: Location[]) =>
  (city_id: number): Location => {
    return cities[city_id - 1];
  };

export const translateToSupply =
  (supplies: Supply[]) =>
  (category_id: ID): Supply => {
    const supply = supplies.find((suply) => String(suply.id) === String(category_id));
    if (!supply) throw new Error(`Supply category: ${category_id} is not defined`);

    return supply;
  };

export const sortDates = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export const filterByCategoryIds = (aidRequests: AidRequest[], categoryIds: string[]) => {
  return filter(aidRequests, (req) => every(categoryIds, (id) => eq(id, req.category_id)));
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

type ProcessedByCities = {
  city_id: number;
  total: number;
  aidRequests: AidRequest[];
};

type ProcessedByCategories = {
  category_id: string;
  total: number;
  aidRequests: AidRequest[];
};

export const processedByCitiesToTableData = ({ city_id, total, aidRequests }: ProcessedByCities): TableData => {
  return {
    left: city_id,
    right: total,
    hidden: map(aidRequests, (req) => {
      return {
        left: req.category_id,
        right: req.requested_amount,
      };
    }),
  };
};

export const processedByCategoriesToTableData = ({ category_id, total, aidRequests }: ProcessedByCategories): TableData => {
  return {
    left: category_id,
    right: total,
    hidden: map(aidRequests, (req) => {
      return {
        left: req.city_id,
        right: req.requested_amount,
      };
    }),
  };
};

type TableData = {
  left: ReactText;
  right: ReactText;
  hidden: {
    left: ReactText;
    right: ReactText;
  }[];
};

const totalCalculator = (aidRequests: AidRequest[]) => aidRequests.reduce((sum, aidRequest) => sum + aidRequest.requested_amount, 0);
