import omit from "lodash/omit";

import { GroupedByLocationWithTotal, GroupedByCategoryWithTotal } from "./assign-total";
import { Location, Supply, ID } from "../contexts/api";

export type DecodedAidRequestGroupedByLocation = {
  location: DecodedLocation;
  total: number;
  decodedAidRequest: DecodedAidRequest[];
};

export type DecodedLocation = Pick<Location, "name" | "lat" | "lon">;
export type DecodedAidRequest = { date: string; name: string; amount: number };

export type Dictionary = {
  locations: Location[];
  supplies: Supply[];
};

export const decodeAidRequestGroupedByLocationWithTotal = (dictionary: Dictionary, aidRequest: GroupedByLocationWithTotal) => {
  const decodedLocation = decodeLocation(dictionary.locations, aidRequest.city_id);

  const decodedAidRequests = aidRequest.aidRequests
    .map((category) => ({
      date: category.date,
      amount: category.requested_amount,
      name: decodeCategory(dictionary.supplies, category.category_id),
    }))
    .map((supply) => omit(supply, "category_id"));

  return {
    location: decodedLocation,
    total: aidRequest.total,
    decodedAidRequests,
  };
};

export const decodeAidRequestGroupedByCategoryWithTotal = (dictionary: Dictionary, aidRequest: GroupedByCategoryWithTotal) => {
  const decodedCategory = decodeCategory(dictionary.supplies, aidRequest.category_id);

  const decodedAidRequests = aidRequest.aidRequests
    .map((aidRequest) => ({
      date: aidRequest.date,
      amount: aidRequest.requested_amount,
      location: decodeLocation(dictionary.locations, aidRequest.city_id),
    }))
    .map((supply) => omit(supply, "category_id"));

  return {
    name: decodedCategory,
    total: aidRequest.total,
    decodedAidRequests,
  };
};

const decodeLocation = (locations: Location[], cityId: ID): DecodedLocation => {
  const location = locations.find((location) => String(location.id) === String(cityId));
  return omit(location, "id");
};

const decodeCategory = (categories: Supply[], category_id: ID): string => {
  const category = categories.find((category) => String(category.id) === String(category_id));
  if (!category) throw new Error(`Supply category: ${category_id} is not defined`);

  return category.name;
};
