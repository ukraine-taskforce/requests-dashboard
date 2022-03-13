import { AidRequest, ID } from "../contexts/api";

import { GroupedByLocation } from "./group-aid-requests";

export type GroupedByLocationWithTotal = {
  total: number;
  city_id: ID;
  categories: Omit<AidRequest, "city_id">[];
};

export const assignTotal = (grouped: GroupedByLocation) => {
  const getTotalForLocation = () => grouped.categories.reduce((partialSum, aidRequest) => partialSum + aidRequest.requested_amount, 0);

  return {
    ...grouped,
    total: getTotalForLocation(),
  };
};
