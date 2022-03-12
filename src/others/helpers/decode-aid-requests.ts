import omit from "lodash/omit";

import { AidRequest, Location, Supply, ID } from "../contexts/api";

export type DecodedAidRequest = {
  date: string;
  amount: number;
  category: string | undefined;
  location: Omit<Location, "id">;
};

export const decodeAidRequest = (aidRequest: AidRequest, locations: Location[], categories: Supply[]) => {
  return {
    date: aidRequest.date,
    amount: aidRequest.requested_amount,
    category: decodeCategory(categories, aidRequest.category_id),
    location: decodeLocation(locations, aidRequest.city_id),
  };
};

const decodeLocation = (locations: Location[], cityId: ID) => {
  const location = locations.find((location) => String(location.id) === String(cityId));
  return omit(location, "id");
};

const decodeCategory = (categories: Supply[], category_id: ID) => {
  const category = categories.find((category) => String(category.id) === String(category_id));
  return category?.name;
};
