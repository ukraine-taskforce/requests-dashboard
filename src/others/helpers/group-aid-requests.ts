import { groupBy } from "lodash";
import omit from "lodash/omit";

import { AidRequest, ID } from "../contexts/api";

export type GroupedByLocation = {
  city_id: ID;
  categories: Omit<AidRequest, "city_id">[];
};

export const groupByLocation = (aidRequests: AidRequest[]): GroupedByLocation[] => {
  return Object.entries(groupBy(aidRequests, "city_id")).map(([location, categories]) => ({
    city_id: location,
    categories: Object.values(categories).map((category) => omit(category, "city_id")),
  }));
};
