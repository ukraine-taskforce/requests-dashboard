import { mapAidRequestsToFeatures, aggregateCategories } from "./map-utils";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

test("aggregateCategories", () => {
  const requests = [
    { date: "2022-03-10", city_id: 1, category_id: "personal_hygiene_kits", requested_amount: 14 },
    { date: "2022-03-10", city_id: 1, category_id: "water", requested_amount: 20 },
    { date: "2022-03-10", city_id: 1, category_id: "food", requested_amount: 14 },
  ];
  function mockSupplyTranslator(category_id: string) {
    return {id: category_id, name: `Name#${category_id}`};
  }

  expect(aggregateCategories({city_id: 1, total: 17, aidRequests: requests}, mockSupplyTranslator)).toEqual({
    amount: 17,
    city_id: 1,
    description: "Name#water: 20\nName#personal_hygiene_kits: 14\nName#food: 14\n",
  });
});

test("mapAidRequestsToFeatures", () => {
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
  expect(mapAidRequestsToFeatures(mapData, mockLocationTranslator)).toEqual([
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
