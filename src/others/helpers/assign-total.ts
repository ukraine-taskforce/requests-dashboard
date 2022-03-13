import { AidRequest, ID } from "../contexts/api";

import { GroupedByLocation, GroupedByCategory } from "./group-aid-requests";

export type GroupedByLocationWithTotal = {
  total: number;
  city_id: ID;
  aidRequests: Omit<AidRequest, "city_id">[];
};

export type GroupedByCategoryWithTotal = {
  total: number;
  category_id: ID;
  aidRequests: Omit<AidRequest, "category_id">[];
};

export const assignTotalToGroupedByLocation = (grouped: GroupedByLocation): GroupedByLocationWithTotal => {
  const getTotalForLocation = () => grouped.aidRequests.reduce((partialSum, aidRequest) => partialSum + aidRequest.requested_amount, 0);

  return {
    ...grouped,
    total: getTotalForLocation(),
  };
};

export const assignTotalToGroupedByCategory = (grouped: GroupedByCategory): GroupedByCategoryWithTotal => {
  const getTotalForCategory = () => grouped.aidRequests.reduce((partialSum, aidRequest) => partialSum + aidRequest.requested_amount, 0);

  return {
    ...grouped,
    total: getTotalForCategory(),
  };
};
