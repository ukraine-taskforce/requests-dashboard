import omit from "lodash/omit";

import { Location, Supply, ID, AidRequest } from "../contexts/api";

// TODO: Delete this file once map-utils start using raw AidRequest only

export type GroupedByLocationWithTotal = {
  total: number;
  city_id: ID;
  aidRequests: Omit<AidRequest, "city_id">[];
};

export type GroupedByCategoryWithTotal = {
  total: number;
  category_id: ID;
  aidRequests: Omit<AidRequest, "category_id">[];
};

export type DecodedAidRequestGroupedByLocation = {
  location: DecodedLocation;
  total: number;
  decodedAidRequests: DecodedAidRequest[];
};

export type DecodedLocation = Location; // TODO: remove once map consumes DictionaryContext properly, i.e. relying on Location as data model and translate on render
export type DecodedAidRequest = { date: string; name: string; amount: number };

export type Dictionary = {
  locations: Location[];
  supplies: Supply[];
};

export const decodeAidRequestGroupedByLocationWithTotal = (
  dictionary: Dictionary,
  aidRequest: GroupedByLocationWithTotal
): DecodedAidRequestGroupedByLocation => {
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
    decodedAidRequests: decodedAidRequests,
  };
};

export type DecodedAidRequestGroupedByCategory = {
  name: string;
  total: number;
  decodedAidRequests: Pick<
    {
      date: string;
      amount: number;
      location: DecodedLocation;
    },
    "date" | "amount" | "location"
  >[];
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
  if (!location) throw new Error(`Location: ${location} is not defined`);

  return location;
};

const decodeCategory = (categories: Supply[], category_id: ID): string => {
  const category = categories.find((category) => String(category.id) === String(category_id));
  if (!category) throw new Error(`Supply category: ${category_id} is not defined`);

  return category.name;
};
