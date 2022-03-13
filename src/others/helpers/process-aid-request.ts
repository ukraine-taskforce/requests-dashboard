import { Location, Supply, AidRequest } from "../../others/contexts/api";
import {
  decodeAidRequestGroupedByLocationWithTotal,
  decodeAidRequestGroupedByCategoryWithTotal,
} from "../../others/helpers/decode-aid-request";
import { groupByLocation, groupByCategory } from "../../others/helpers/group-aid-requests";
import { assignTotalToGroupedByLocation, assignTotalToGroupedByCategory } from "../../others/helpers/assign-total";

export const processAidRequests = (cities?: Location[], supplies?: Supply[], aidRequests?: AidRequest[]) => {
  if (cities && supplies && aidRequests) {
    const groupedByLocation = groupByLocation(aidRequests);
    const groupedByLocationWithTotal = groupedByLocation.map(assignTotalToGroupedByLocation);
    const decodedAndGroupedByLocation = groupedByLocationWithTotal.map((aidRequest) =>
      decodeAidRequestGroupedByLocationWithTotal({ locations: cities, supplies }, aidRequest)
    );

    const groupedByCategory = groupByCategory(aidRequests);
    const groupedByCategoryWithTotal = groupedByCategory.map(assignTotalToGroupedByCategory);
    const decodedAndGroupedByCategory = groupedByCategoryWithTotal.map((aidRequest) =>
      decodeAidRequestGroupedByCategoryWithTotal({ locations: cities, supplies }, aidRequest)
    );

    return {
      decodedAndGroupedByLocation,
      decodedAndGroupedByCategory,
    };
  }
  return {
    decodedAndGroupedByLocation: [],
    decodedAndGroupedByCategory: [],
  };
};
