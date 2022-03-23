import { AidRequest, Supply, Location } from "../contexts/api";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

type GroupedByCityId = {
  city_id: number;
  total: number;
  aidRequests: AidRequest[];
};

type MapData = {
  city_id: number;
  amount: number;
  description: string;
};

export const aggregateCategories = (
  aidRequestsGroupedByCityId: GroupedByCityId,
  supplyTranslator: (category_id: string) => Supply | undefined
): MapData => {
  const sortedAidRequests = aidRequestsGroupedByCityId.aidRequests.sort((a, b) => b.requested_amount - a.requested_amount);
  const description = sortedAidRequests.reduce((d, aidRequest) => {
    const supply = supplyTranslator(aidRequest.category_id);
    if (!supply) throw new Error(`Supply category: ${supply} is not defined`);
    return d + supply.name + ": " + aidRequest.requested_amount + "\n"
  }, "");
  return {
    city_id: aidRequestsGroupedByCityId.city_id,
    amount: aidRequestsGroupedByCityId.total,
    description: description
  };
};

export const mapAidRequestsToFeatures = (mapData: MapData[], locationTranslator: (city_id: number) => Location | undefined): Feature<Geometry, GeoJsonProperties>[] => {
  const maxAmount = mapData.reduce((max, dataPoint) => Math.max(max, dataPoint.amount), 0);
  return mapData.map((dataPoint) => {
    const location = locationTranslator(dataPoint.city_id);
    if (!location) throw new Error(`Location: ${dataPoint.city_id} is not found`);

    return {
        type: "Feature",
        properties: {
          amount: dataPoint.amount,
	  city: location.name,
	  normalized_amount: dataPoint.amount / maxAmount,
          description: dataPoint.description,
        },
        geometry: { type: "Point", coordinates: [location.lon, location.lat] },
    };
  });
};

