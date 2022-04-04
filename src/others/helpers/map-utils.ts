import { groupBy } from "lodash";
import { Location } from "../contexts/api";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

export type MapDataPoint = {
  city_id: number;
  amount: number;
  description: string;
};

export const mapToFeatures = (mapData: MapDataPoint[], locationTranslator: (city_id: number) => Location | undefined): Feature<Geometry, GeoJsonProperties>[] => {
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

export type RegionMetadata = { [id: string]: {amount: number, description: string } };
type RegionData = {
  region_id: string;
  city_name: string;
  amount: number;
};

export const groupByRegions = (mapDataPoints: MapDataPoint[], translateLocation: (city_id: number) => Location | undefined): RegionMetadata => {
  const regionData: RegionData[] = mapDataPoints.map((req) => {
    const city = translateLocation(req.city_id);
    if (!city) throw new Error(`Loccation ${req.city_id} is not found`);
    return {
      region_id: city.region_id,
      city_name: city.name,
      amount: req.amount,
    };
  });
  const groupedRegionData = Object.entries(groupBy(regionData, "region_id"));
  const regionToMetadata: RegionMetadata = Object.assign({}, ...groupedRegionData.map(
    ([region_id, data]) => {
      const totalAmount = data.reduce((sum, dataPoint) => sum + dataPoint.amount, 0);
      const sortedData = data.sort((a, b) => b.amount - a.amount);
      const description = sortedData.reduce((d, dataPoint) => d + dataPoint.city_name + ': ' + dataPoint.amount + '\n', '');
      return { [region_id]: { amount: totalAmount, description: description } };
    }
  ));
  return regionToMetadata;
};

