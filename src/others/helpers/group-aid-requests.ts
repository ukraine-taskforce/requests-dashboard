import { groupBy } from "lodash";
import omit from "lodash/omit";
import { AidRequest, Location, Supply, ID } from "../contexts/api";

export type GroupedByLocation = {
  city_id: ID;
  aidRequests: Omit<AidRequest, "city_id">[];
};

export const groupByLocation = (aidRequests: AidRequest[]) => {
  return Object.entries(groupBy(aidRequests, "city_id")).map(([key, val]) => ({
    city_id: key,
    aidRequests: Object.values(val).map((v) => omit(v, "city_id")),
  }));
};
