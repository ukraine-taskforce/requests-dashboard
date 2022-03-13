import { groupBy } from "lodash";
import omit from "lodash/omit";

import { AidRequest, ID } from "../contexts/api";

export type GroupedByLocation = {
  city_id: ID;
  aidRequests: Omit<AidRequest, "city_id">[];
};

export type GroupedByCategory = {
  category_id: ID;
  aidRequests: Omit<AidRequest, "category_id">[];
};

export const groupByLocation = (aidRequests: AidRequest[]): GroupedByLocation[] => {
  return Object.entries(groupBy(aidRequests, "city_id")).map(([location, aidRequests]) => ({
    city_id: location,
    aidRequests: Object.values(aidRequests).map((aidRequest) => omit(aidRequest, "city_id")),
  }));
};

export const groupByCategory = (aidRequests: AidRequest[]): GroupedByCategory[] => {
  return Object.entries(groupBy(aidRequests, "category_id")).map(([category_id, aidRequests]) => ({
    category_id,
    aidRequests: Object.values(aidRequests).map((aidRequest) => omit(aidRequest, "category_id")),
  }));
};
