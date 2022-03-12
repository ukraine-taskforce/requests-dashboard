import { groupBy } from "lodash";
import omit from "lodash/omit";
import { AidRequest, Location, Supply, ID } from "../contexts/api";
import { GroupedByLocation } from "./group-aid-requests";

export const assignTotal = (grouped: GroupedByLocation) => {
  const getTotalForLocation = () => grouped.aidRequests.reduce((partialSum, aidRequest) => partialSum + aidRequest.requested_amount, 0);
  return {
    ...grouped,
    total: getTotalForLocation(),
  };
};
