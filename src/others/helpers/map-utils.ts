import { groupBy } from "lodash";
import omit from "lodash/omit";
import { AidRequest, Supply, Location } from "../contexts/api";
import { DecodedAidRequest, DecodedAidRequestGroupedByLocation } from "./decode-aid-request";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

type GroupedByDate = {
  date: string;
  aidRequests: Omit<DecodedAidRequest, "date">[]; // TODO: consider replacing with AidRequest
};

type GroupedByDateWithTotal = {
  date: string;
  aidRequests: Omit<DecodedAidRequest, "date">[]; // TODO: consider replacing with AidRequest
  total: number;
  totalDescription: string;
};

type GroupedByLocationAndDateWithTotal = {
  location: Location;
  aidRequestsByDateWithTotal: GroupedByDateWithTotal[];
};

interface RequestProperties {
  amount: number;
  normalized_amount?: number;
  date: string;
  category: string;
  description: string;
  city: string;
}

type GroupedByCityId = {
  city_id: number;
  total: number;
  aidRequests: AidRequest[];
};

// TODO: Delete once map relies on AidRequest data model
export const adaptToMap = (
  aidRequestGroupedByCityId: GroupedByCityId,
  location: Location | undefined,
  supplyTranslator: (category_id: string) => Supply | undefined
): DecodedAidRequestGroupedByLocation => {
  if (!location) throw new Error(`Location: ${location} is not defined`);

  return {
    location,
    total: aidRequestGroupedByCityId.total,
    decodedAidRequests: aidRequestGroupedByCityId.aidRequests.map((aidRequest: AidRequest) => {
      const supply = supplyTranslator(aidRequest.category_id);
      if (!supply) throw new Error(`Supply category: ${supply} is not defined`);
      return {
        date: aidRequest.date,
        name: supply.name,
        amount: aidRequest.requested_amount,
      };
    }),
  };
};

export const mapAidRequestsToFeatures = (decodedAidRequestGroupedByLocation: DecodedAidRequestGroupedByLocation[]) => {
  let features = new Set<Feature<Geometry, RequestProperties>>();
  decodedAidRequestGroupedByLocation.forEach((locationGroup) => {
    const decodedAidRequestsGroupedByLocationAndDate: GroupedByLocationAndDateWithTotal[] = [
      {
        location: locationGroup.location,
        aidRequestsByDateWithTotal: groupLocationGroupByDate(locationGroup).map(assignTotalForDate),
      },
    ];

    decodedAidRequestsGroupedByLocationAndDate.forEach((dateGroup) => {
      dateGroup.aidRequestsByDateWithTotal.forEach((locationAndDateRequests) => {
        locationAndDateRequests.aidRequests.forEach((req) =>
          addFeatureForAidRequest(req, locationGroup.location, locationAndDateRequests.date, features)
        );
        addAggregatedFeaturePerLocationAndDate(locationGroup, locationAndDateRequests, features);
      });
    });
  });
  const maxPerCategory: { [id: string]: number } = {};
  features.forEach(function (feature) {
    if (feature.properties) {
      if (!(feature.properties.category in maxPerCategory)) {
        maxPerCategory[feature.properties.category] = 0;
      }
      maxPerCategory[feature.properties.category] = Math.max(maxPerCategory[feature.properties.category], feature.properties.amount);
    }
  });
  const featuresWithNormalizedAmount = Array.from(features).map((feature) => {
    if (feature.properties) {
      feature.properties.normalized_amount = feature.properties.amount / maxPerCategory[feature.properties.category];
    }
    return feature;
  });
  return featuresWithNormalizedAmount;
};

export const possibleDates = (requests: AidRequest[]) => {
  return requests.map((req) => req.date).filter((value, index, self) => self.indexOf(value) === index);
};

function addAggregatedFeaturePerLocationAndDate(
  locationGroup: DecodedAidRequestGroupedByLocation,
  dateGroup: GroupedByDateWithTotal,
  features: Set<Feature<Geometry, RequestProperties>>
) {
  features.add({
    type: "Feature",
    properties: {
      amount: dateGroup.total,
      date: dateGroup.date,
      category: "ALL",
      description: dateGroup.totalDescription,
      city: locationGroup.location.name,
    },
    geometry: { type: "Point", coordinates: [locationGroup.location.lon, locationGroup.location.lat] },
  });
}

function addFeatureForAidRequest(
  aidRequest: Omit<DecodedAidRequest, "date">, // TODO: consider replacing with AidRequest
  location: Location,
  date: string,
  features: Set<Feature<Geometry, GeoJsonProperties>>
) {
  features.add({
    type: "Feature",
    properties: {
      amount: aidRequest.amount,
      date: date,
      category: aidRequest.name,
      description: aidRequest.name + ": " + aidRequest.amount,
      city: location.name,
    },
    geometry: { type: "Point", coordinates: [location.lon, location.lat] },
  });
}

export const groupLocationGroupByDate = (locationGroup: DecodedAidRequestGroupedByLocation): GroupedByDate[] => {
  return Object.entries(groupBy(locationGroup.decodedAidRequests, "date")).map(([d, aidRequests]) => ({
    date: d,
    aidRequests: Object.values(aidRequests).map((aidRequest) => omit(aidRequest, "date")),
  }));
};

export const assignTotalForDate = (grouped: GroupedByDate): GroupedByDateWithTotal => {
  const getTotalForDate = () => grouped.aidRequests.reduce((partialSum, aidRequest) => partialSum + aidRequest.amount, 0);
  const getDescriptionForDate = () =>
    grouped.aidRequests
      .sort(function (a, b) {
        return b.amount - a.amount;
      })
      .reduce((partialDesc, aidRequest) => partialDesc + "\n" + aidRequest.name + ": " + aidRequest.amount, "");
  return {
    ...grouped,
    total: getTotalForDate(),
    totalDescription: getDescriptionForDate(),
  };
};
