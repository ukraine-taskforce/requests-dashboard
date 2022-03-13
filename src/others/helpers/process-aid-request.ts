import { Location, Supply, AidRequest } from "../../others/contexts/api";
import { decodeAidRequest } from "../../others/helpers/decode-aid-request";
import { groupByLocation } from "../../others/helpers/group-aid-requests";
import { assignTotal } from "../../others/helpers/assign-total";

export const processAidRequests = (cities?: Location[], supplies?: Supply[], aidRequests?: AidRequest[]) => {
  if (cities && supplies && aidRequests) {
    const groupedByLocation = groupByLocation(aidRequests);
    const groupedByLocationWithTotal = groupedByLocation.map(assignTotal);

    return {
      decodedAndGroupedByLocation: groupedByLocationWithTotal.map((aidRequest) =>
        decodeAidRequest({ locations: cities, supplies }, aidRequest)
      ),
    };
  }
  return {
    decodedAndGroupedByLocation: [],
  };
};
