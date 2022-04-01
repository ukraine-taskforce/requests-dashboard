import { Location } from "../contexts/api";
import { MapDataPoint, groupByRegions, mapToFeatures } from "./map-utils";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

test("mapToFeatures", () => {
  const mapData = [
    {
      city_id: 1,
      amount: 10,
      description: "description#1",
    },
    {
      city_id: 2,
      amount: 20,
      description: "description#2",
    }
  ];
  function mockLocationTranslator(city_id: number) {
    return {id: city_id, name: `name#${city_id}`, lat: city_id, lon: city_id, region_id: `region:${city_id}`};
  }
  expect(mapToFeatures(mapData, mockLocationTranslator)).toEqual([
    {
      type: "Feature",
      properties: {
        amount: 10,
        normalized_amount: 0.5,
        description: "description#1",
        city: "name#1",
      },
      geometry: { type: "Point", coordinates: [1, 1] },
    },
    {
      type: "Feature",
      properties: {
        amount: 20,
        normalized_amount: 1,
        description: "description#2",
        city: "name#2",
      },
      geometry: { type: "Point", coordinates: [2, 2] },
    },
  ]);
});

test("groupByRegions", () => {
  const mockTranslateLocation = (city_id: number): Location => {
    return {id: city_id, name: `name#${city_id}`, lat: 1, lon: 2, region_id: 'region_' + (city_id % 2)};
  }
  const exampleMapDataPoints: MapDataPoint[] = [
    {
      city_id: 1,
      amount: 10,
      description: "",
    },
    {
      city_id: 2,
      amount: 20,
      description: "",
    },
    {
      city_id: 3,
      amount: 50,
      description: "",
    }     
  ];
  const result = groupByRegions(exampleMapDataPoints, mockTranslateLocation);

  expect(result).toEqual({
    "region_0": {
      amount: 20,
      description: "name#2: 20\n",
    },
    "region_1": {
      amount: 60,
      description: "name#3: 50\nname#1: 10\n",
    },
  });
});

