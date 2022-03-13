import { groupBy } from "lodash";
import omit from "lodash/omit";
import { AidRequest } from "../contexts/api";
import { DecodedAidRequest, DecodedAidRequestGroupedByLocation, DecodedLocation } from "./decode-aid-request";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

type GroupedByDate = {
    date: string;
    aidRequests: Omit<DecodedAidRequest, "date">[];
}

type GroupedByDateWithTotal = {
    date: string;
    aidRequests: Omit<DecodedAidRequest, "date">[];
    total: number;
}

type GroupedByLocationAndDateWithTotal = {
    location: DecodedLocation;
    aidRequestsByDateWithTotal: GroupedByDateWithTotal[];
}

export const mapAidRequestsToFeatures = (decodedAidRequestGroupedByLocation: DecodedAidRequestGroupedByLocation[]) => {
    let features = new Set<Feature<Geometry, GeoJsonProperties>>()
    decodedAidRequestGroupedByLocation.forEach(locationGroup => {
        const decodedAidRequestsGroupedByLocationAndDate: GroupedByLocationAndDateWithTotal[] = [{
            location: locationGroup.location,
            aidRequestsByDateWithTotal: groupLocationGroupByDate(locationGroup).map(assignTotalForDate)
        }];

        decodedAidRequestsGroupedByLocationAndDate.forEach(dateGroup => {
            dateGroup.aidRequestsByDateWithTotal.forEach(locationAndDateRequests => {
                locationAndDateRequests.aidRequests.forEach(req =>
                    addFeatureForAidRequest(req, locationGroup.location, locationAndDateRequests.date, features));
                addAggregatedFeaturePerLocationAndDate(locationGroup, locationAndDateRequests, features);
            })
        });
    })
    return features;
}

export const possibleDates = (requests: AidRequest[]) => {
    return requests.map(req => req.date)
        .filter((value, index, self) => self.indexOf(value) === index)
}

function addAggregatedFeaturePerLocationAndDate(
    locationGroup: DecodedAidRequestGroupedByLocation,
    dateGroup: GroupedByDateWithTotal,
    features: Set<Feature<Geometry, GeoJsonProperties>>) {
    features.add({
        type: "Feature",
        properties: {
            amount: dateGroup.total,
            date: dateGroup.date,
            category: "ALL",
        },
        geometry: { type: "Point", coordinates: [locationGroup.location.lon, locationGroup.location.lat] }
    })
}

function addFeatureForAidRequest(
    aidRequest: Omit<DecodedAidRequest, "date">,
    location: DecodedLocation,
    date: string,
    features: Set<Feature<Geometry, GeoJsonProperties>>) {
    features.add({
        type: "Feature",
        properties: {
            amount: aidRequest.amount,
            date: date,
            category: aidRequest.name,
        },
        geometry: { type: "Point", coordinates: [location.lon, location.lat] }
    })
}

export const groupLocationGroupByDate = (locationGroup: DecodedAidRequestGroupedByLocation): GroupedByDate[] => {
    return Object.entries(groupBy(locationGroup.decodedAidRequest, "date")).map(([d, aidRequests]) => ({
        date: d,
        aidRequests: Object.values(aidRequests).map((aidRequest) => omit(aidRequest, "date")),
    }));
}

export const assignTotalForDate = (grouped: GroupedByDate): GroupedByDateWithTotal => {
    const getTotalForDate = () => grouped.aidRequests.reduce((partialSum, aidRequest) => partialSum + aidRequest.amount, 0);
    return {
        ...grouped,
        total: getTotalForDate(),
    };
};


