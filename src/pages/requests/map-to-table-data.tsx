import { DecodedAidRequestGroupedByCategory, DecodedAidRequestGroupedByLocation } from "../../others/helpers/decode-aid-request";

const totalDescending = (a: any, b: any) => b.total - a.total;

export const mapCategoriesToTableData = (decodedAndGroupedByLocation: DecodedAidRequestGroupedByLocation[]) =>
  decodedAndGroupedByLocation
    .map((aidReqest) => {
      return {
        ...aidReqest,
        name: aidReqest.location.name,
        total: aidReqest.total,
        hidden: aidReqest.decodedAidRequests.map((category) => ({ name: category.name, total: category.amount })).sort(totalDescending),
      };
    })
    .sort(totalDescending);

export const mapLocationsToTableData = (decodedAndGroupedByCategory: DecodedAidRequestGroupedByCategory[]) =>
  decodedAndGroupedByCategory.map((aidReqest) => {
    return {
      name: aidReqest.name,
      total: aidReqest.total,
      hidden: aidReqest.decodedAidRequests
        .map((aidReqest) => ({ ...aidReqest, name: aidReqest.location.name, total: aidReqest.amount }))
        .sort(totalDescending),
    };
  });
