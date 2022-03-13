import { processAidRequests } from "./process-aid-request";

const supplies = [
  { id: "food", name: "Food" },
  { id: "water", name: "Water" },
  { id: "baby_food", name: "Baby Food" },
  { id: "baby_products", name: "Baby Products" },
  { id: "medical_kits_supplies", name: "Medical Kits / Supplies" },
  { id: "personal_hygiene_kits", name: "Personal hygiene kits" },
  { id: "masks", name: "Masks" },
  { id: "sanitary_pads", name: "Sanitary pads" },
  { id: "tampons", name: "Tampons" },
  { id: "torches", name: "Torches" },
  { id: "batteries", name: "Batteries" },
  { id: "candles", name: "Candles" },
  { id: "firestarter", name: "Firestarter" },
  { id: "bedding", name: "Bedding" },
  { id: "sleeping_bags", name: "Sleeping Bags" },
  { id: "thermal_clothing", name: "Thermal clothing" },
  { id: "shoes", name: "Shoes" },
  { id: "clothes", name: "Clothes" },
  { id: "gloves", name: "Gloves" },
];

const cities = [
  { id: 1, name: "Kyiv", lat: 50.45, lon: 30.524 },
  { id: 2, name: "Chernihiv", lat: 51.494, lon: 31.294 },
  { id: 30, name: "Vinnytsia", lat: 49.232, lon: 28.467 },
  { id: 1220, name: "Rovenky", lat: 48.089, lon: 39.368 },
  { id: 1221, name: "Lymanske", lat: 46.661, lon: 29.976 },
  { id: 1222, name: "Staromykhailivka", lat: 48, lon: 37.583 },
  { id: 1223, name: "Alupka", lat: 44.42, lon: 34.048 },
  { id: 1224, name: "Nyzhnii Naholchyk", lat: 48.02, lon: 39.059 },
  { id: 1225, name: "Yesaulivka", lat: 48.051, lon: 39.025 },
  { id: 1226, name: "Zaliznychne", lat: 47.645, lon: 36.169 },
  { id: 1227, name: "Haivoron", lat: 48.336, lon: 29.867 },
  { id: 1228, name: "Gvardeiskoe, Crimea ", lat: 45.115, lon: 34.023 },
  { id: 1229, name: "Khrystynivka", lat: 48.812, lon: 29.967 },
  { id: 1230, name: "Kirovske, Donetsk Oblast 86300", lat: 48.145, lon: 38.354 },
];

const exampleAggregatedRequests = [
  { date: "2022-03-11", city_id: 1226, category_id: "sanitary_pads", requested_amount: 10 },
  { date: "2022-03-12", city_id: 1226, category_id: "personal_hygiene_kits", requested_amount: 4 },
  { date: "2022-03-11", city_id: 1, category_id: "bedding", requested_amount: 4 },
  { date: "2022-03-11", city_id: 1226, category_id: "masks", requested_amount: 15 },
  { date: "2022-03-10", city_id: 2, category_id: "personal_hygiene_kits", requested_amount: 1 },
  { date: "2022-03-11", city_id: 1, category_id: "candles", requested_amount: 4 },
  { date: "2022-03-11", city_id: 1226, category_id: "baby_products", requested_amount: 19 },
  { date: "2022-03-11", city_id: 1226, category_id: "medical_kits_supplies", requested_amount: 16 },
  { date: "2022-03-11", city_id: 1226, category_id: "torches", requested_amount: 10 },
  { date: "2022-03-10", city_id: 1, category_id: "sanitary_pads", requested_amount: 2 },
  { date: "2022-03-11", city_id: 1226, category_id: "water", requested_amount: 11 },
  { date: "2022-03-10", city_id: 1, category_id: "food", requested_amount: 2 },
  { date: "2022-03-11", city_id: 1226, category_id: "personal_hygiene_kits", requested_amount: 21 },
  { date: "2022-03-11", city_id: 1, category_id: "batteries", requested_amount: 4 },
  { date: "2022-03-11", city_id: 30, category_id: "batteries", requested_amount: 4 },
  { date: "2022-03-10", city_id: 1, category_id: "baby_products", requested_amount: 2 },
  { date: "2022-03-11", city_id: 1226, category_id: "tampons", requested_amount: 20 },
  { date: "2022-03-11", city_id: 1226, category_id: "food", requested_amount: 10 },
  { date: "2022-03-12", city_id: 1226, category_id: "medical_kits_supplies", requested_amount: 4 },
  { date: "2022-03-12", city_id: 1226, category_id: "baby_products", requested_amount: 4 },
  { date: "2022-03-11", city_id: 1226, category_id: "baby_food", requested_amount: 15 },
];

test("processAidRequests has an array of aid requests decodedAndGroupedByLocation", () => {
  const processedAidRequests = processAidRequests(cities, supplies, exampleAggregatedRequests);
  expect(processedAidRequests.decodedAndGroupedByLocation).toBeInstanceOf(Array);
});

test("processAidRequests has an array of aid requests decodedAndGroupedByCategory", () => {
  const processedAidRequests = processAidRequests(cities, supplies, exampleAggregatedRequests);
  expect(processedAidRequests.decodedAndGroupedByLocation).toBeInstanceOf(Array);
});

// TODO: refactor these tests to be more concise
test("processAidRequests.decodedAndGroupedByLocation has an expected value", () => {
  const processedAidRequests = processAidRequests(cities, supplies, exampleAggregatedRequests);

  expect(processedAidRequests.decodedAndGroupedByLocation).toEqual([
    {
      location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
      total: 18,
      decodedAidRequests: [
        { date: "2022-03-11", amount: 4, name: "Bedding" },
        { date: "2022-03-11", amount: 4, name: "Candles" },
        { date: "2022-03-10", amount: 2, name: "Sanitary pads" },
        { date: "2022-03-10", amount: 2, name: "Food" },
        { date: "2022-03-11", amount: 4, name: "Batteries" },
        { date: "2022-03-10", amount: 2, name: "Baby Products" },
      ],
    },
    {
      location: { name: "Chernihiv", lat: 51.494, lon: 31.294 },
      total: 1,
      decodedAidRequests: [{ date: "2022-03-10", amount: 1, name: "Personal hygiene kits" }],
    },
    {
      location: { name: "Vinnytsia", lat: 49.232, lon: 28.467 },
      total: 4,
      decodedAidRequests: [{ date: "2022-03-11", amount: 4, name: "Batteries" }],
    },
    {
      location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
      total: 159,
      decodedAidRequests: [
        { date: "2022-03-11", amount: 10, name: "Sanitary pads" },
        { date: "2022-03-12", amount: 4, name: "Personal hygiene kits" },
        { date: "2022-03-11", amount: 15, name: "Masks" },
        { date: "2022-03-11", amount: 19, name: "Baby Products" },
        { date: "2022-03-11", amount: 16, name: "Medical Kits / Supplies" },
        { date: "2022-03-11", amount: 10, name: "Torches" },
        { date: "2022-03-11", amount: 11, name: "Water" },
        { date: "2022-03-11", amount: 21, name: "Personal hygiene kits" },
        { date: "2022-03-11", amount: 20, name: "Tampons" },
        { date: "2022-03-11", amount: 10, name: "Food" },
        { date: "2022-03-12", amount: 4, name: "Medical Kits / Supplies" },
        { date: "2022-03-12", amount: 4, name: "Baby Products" },
        { date: "2022-03-11", amount: 15, name: "Baby Food" },
      ],
    },
  ]);
});

test("processAidRequests.decodedAndGroupedByCategory has an expected value", () => {
  const processedAidRequests = processAidRequests(cities, supplies, exampleAggregatedRequests);

  expect(processedAidRequests.decodedAndGroupedByCategory).toEqual([
    {
      name: "Sanitary pads",
      total: 12,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 10,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
        {
          date: "2022-03-10",
          amount: 2,
          location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
        },
      ],
    },
    {
      name: "Personal hygiene kits",
      total: 26,
      decodedAidRequests: [
        {
          date: "2022-03-12",
          amount: 4,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
        {
          date: "2022-03-10",
          amount: 1,
          location: { name: "Chernihiv", lat: 51.494, lon: 31.294 },
        },
        {
          date: "2022-03-11",
          amount: 21,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Bedding",
      total: 4,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 4,
          location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
        },
      ],
    },
    {
      name: "Masks",
      total: 15,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 15,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Candles",
      total: 4,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 4,
          location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
        },
      ],
    },
    {
      name: "Baby Products",
      total: 25,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 19,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
        {
          date: "2022-03-10",
          amount: 2,
          location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
        },
        {
          date: "2022-03-12",
          amount: 4,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Medical Kits / Supplies",
      total: 20,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 16,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
        {
          date: "2022-03-12",
          amount: 4,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Torches",
      total: 10,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 10,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Water",
      total: 11,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 11,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Food",
      total: 12,
      decodedAidRequests: [
        {
          date: "2022-03-10",
          amount: 2,
          location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
        },
        {
          date: "2022-03-11",
          amount: 10,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Batteries",
      total: 8,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 4,
          location: { name: "Kyiv", lat: 50.45, lon: 30.524 },
        },
        {
          date: "2022-03-11",
          amount: 4,
          location: { name: "Vinnytsia", lat: 49.232, lon: 28.467 },
        },
      ],
    },
    {
      name: "Tampons",
      total: 20,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 20,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
    {
      name: "Baby Food",
      total: 15,
      decodedAidRequests: [
        {
          date: "2022-03-11",
          amount: 15,
          location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
        },
      ],
    },
  ]);
});
