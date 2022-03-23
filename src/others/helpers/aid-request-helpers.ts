import { groupBy, map } from "lodash";

import { AidRequest, Location } from "../contexts/api";
import { ListItem } from "../components/CollapsibleListItem";

export const sortDates = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export enum FilterEnum {
  All = "*",
}

export const filterByCategoryIds = (aidRequests: AidRequest[], categoryIds: string[] | FilterEnum.All): AidRequest[] => {
  if (categoryIds === FilterEnum.All) return aidRequests;
  const categoryIdsSet = new Set(categoryIds);
  return aidRequests.filter((aidRequest) => categoryIdsSet.has(aidRequest.category_id));
};

export const filterByCityIds = (aidRequests: AidRequest[], cityIds: number[] | FilterEnum.All): AidRequest[] => {
  if (cityIds === FilterEnum.All) return aidRequests;
  const cityIdsSet = new Set(cityIds);
  return aidRequests.filter((aidRequest) => cityIdsSet.has(aidRequest.city_id));
};

type Total = {
  total: number;
};

type GroupedByCities = {
  city_id: number;
  aidRequests: AidRequest[];
};

export const groupByCityIdWithTotal = (aidRequests: AidRequest[]): (GroupedByCities & Total)[] => {
  const groupedByCityId = groupBy(aidRequests, "city_id");

  const groupedByCityIdWithTotal = map(groupedByCityId, (reqs, city_id) => {
    return { city_id: Number(city_id), total: totalCalculator(reqs), aidRequests: [...reqs] };
  });

  return groupedByCityIdWithTotal;
};

type GroupedByCategories = {
  category_id: string;
  aidRequests: AidRequest[];
};

export const groupByCategoryIdWithTotal = (aidRequests: AidRequest[]): (GroupedByCategories & Total)[] => {
  const groupedByCategoryId = groupBy(aidRequests, "category_id");

  const groupedByCategoryIdWithTotal = map(groupedByCategoryId, (reqs, category_id) => {
    return { category_id, total: totalCalculator(reqs), aidRequests: [...reqs] };
  });

  return groupedByCategoryIdWithTotal;
};

type TableData = ListItem;

export const groupedByCitiesToTableData = ({ city_id, total, aidRequests }: GroupedByCities & Total): TableData => {
  return {
    name: city_id,
    value: total,
    hidden: map(aidRequests, (req) => {
      return {
        name: req.category_id,
        value: req.requested_amount,
      };
    }),
  };
};

export const groupedByCategoriesToTableData = ({ category_id, total, aidRequests }: GroupedByCategories & Total): TableData => {
  return {
    name: category_id,
    value: total,
    hidden: map(aidRequests, (req) => {
      return {
        name: req.city_id,
        value: req.requested_amount,
      };
    }),
  };
};

const totalCalculator = (aidRequests: AidRequest[]): number =>
  aidRequests.reduce((sum, aidRequest) => sum + aidRequest.requested_amount, 0);

export type AidRequestMetadataForRegion = { [id: string]: {amount: number, description: string } };
type RegionRequestData = {
  region_id: string;
  city_name: string;
  requested_amount: number;
};

export const mapRegionIdsToAidRequestCount = (aidRequests: AidRequest[], translateLocation: (city_id: number) => Location | undefined): AidRequestMetadataForRegion => {
  const regionAidRequests: RegionRequestData[] = aidRequests.map((req) => {
    const city = translateLocation(req.city_id);
    if (!city) throw new Error(`Loccation ${req.city_id} is not found`);
    return {
      region_id: city.region_id,
      city_name: city.name,
      requested_amount: req.requested_amount,
    };
  });
  const groupedRegionAidRequests = Object.entries(groupBy(regionAidRequests, "region_id"));
  const regionToMetadata: AidRequestMetadataForRegion = {};
  groupedRegionAidRequests.forEach(([region_id, requests]) => {
    const totalAmount = requests.reduce((sum, request) => sum + request.requested_amount, 0);
    const sortedRequests = requests.sort((a, b) => b.requested_amount - a.requested_amount);
    const description = sortedRequests.reduce((d, request) => d + request.city_name + ': ' + request.requested_amount + '\n', '');
    regionToMetadata[region_id] = {
      amount: totalAmount,
      description: description,
    };
  });
  return regionToMetadata;
};

