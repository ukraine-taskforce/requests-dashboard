import { processByCities } from "./aid-request-grouped";

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
  { id: 1, name: "Kyiv", lat: 50.45, lon: 30.524, region_id: "1" },
  { id: 2, name: "Chernihiv", lat: 51.494, lon: 31.294, region_id: "1" },
  { id: 30, name: "Vinnytsia", lat: 49.232, lon: 28.467, region_id: "1" },
  { id: 1220, name: "Rovenky", lat: 48.089, lon: 39.368, region_id: "1" },
  { id: 1221, name: "Lymanske", lat: 46.661, lon: 29.976, region_id: "1" },
  { id: 1222, name: "Staromykhailivka", lat: 48, lon: 37.583, region_id: "1" },
  { id: 1223, name: "Alupka", lat: 44.42, lon: 34.048, region_id: "1" },
  { id: 1224, name: "Nyzhnii Naholchyk", lat: 48.02, lon: 39.059, region_id: "1" },
  { id: 1225, name: "Yesaulivka", lat: 48.051, lon: 39.025, region_id: "1" },
  { id: 1226, name: "Zaliznychne", lat: 47.645, lon: 36.169, region_id: "1" },
  { id: 1227, name: "Haivoron", lat: 48.336, lon: 29.867, region_id: "" },
  { id: 1228, name: "Gvardeiskoe, Crimea ", lat: 45.115, lon: 34.023, region_id: "1" },
  { id: 1229, name: "Khrystynivka", lat: 48.812, lon: 29.967, region_id: "1" },
  { id: 1230, name: "Kirovske, Donetsk Oblast 86300", lat: 48.145, lon: 38.354, region_id: "1" },
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

// test("filters aid requests by date, exposes city_id and total of aid requests for a given city_id", () => {
//   const processedByCities = processByCities(exampleAggregatedRequests, "2022-03-11");

//   expect(processedByCities).toEqual(aidRequestsGroupedByCityId);
// });

test("first group", () => {
  const firstGroup = processByCities(exampleAggregatedRequests, "2022-03-11")[0];

  expect(firstGroup).toEqual({
    city_id: 1,
    total: 12,
    aidRequests: [
      {
        date: "2022-03-11",
        city_id: 1,
        category_id: "bedding",
        requested_amount: 4,
      },
      {
        date: "2022-03-11",
        city_id: 1,
        category_id: "candles",
        requested_amount: 4,
      },
      {
        date: "2022-03-11",
        city_id: 1,
        category_id: "batteries",
        requested_amount: 4,
      },
    ],
  });
});

const aidRequestsGroupedByCityId = [
  {
    city_id: 1,
    total: 12,
    aidRequests: [
      { city_id: 1, date: "2022-03-11", category_id: "bedding", requested_amount: 4 },
      { city_id: 1, date: "2022-03-11", category_id: "candles", requested_amount: 4 },
      {
        city_id: 1,
        date: "2022-03-10",
        category_id: "sanitary_pads",
        requested_amount: 2,
      },
      { city_id: 1, date: "2022-03-10", category_id: "food", requested_amount: 2 },
      {
        city_id: 1,
        date: "2022-03-11",
        category_id: "batteries",
        requested_amount: 4,
      },
      {
        city_id: 1,
        date: "2022-03-10",
        category_id: "baby_products",
        requested_amount: 2,
      },
    ],
  },
  {
    city_id: 2,
    total: 1,
    aidRequests: [
      {
        city_id: 2,
        date: "2022-03-10",
        category_id: "personal_hygiene_kits",
        requested_amount: 1,
      },
    ],
  },
  {
    city_id: 30,
    total: 4,
    aidRequests: [
      {
        city_id: 30,
        date: "2022-03-11",
        category_id: "batteries",
        requested_amount: 4,
      },
    ],
  },
  {
    city_id: 1226,
    total: 147,
    aidRequests: [
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "sanitary_pads",
        requested_amount: 10,
      },
      {
        city_id: 1226,
        date: "2022-03-12",
        category_id: "personal_hygiene_kits",
        requested_amount: 4,
      },
      { city_id: 1226, date: "2022-03-11", category_id: "masks", requested_amount: 15 },
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "baby_products",
        requested_amount: 19,
      },
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "medical_kits_supplies",
        requested_amount: 16,
      },
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "torches",
        requested_amount: 10,
      },
      { city_id: 1226, date: "2022-03-11", category_id: "water", requested_amount: 11 },
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "personal_hygiene_kits",
        requested_amount: 21,
      },
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "tampons",
        requested_amount: 20,
      },
      { city_id: 1226, date: "2022-03-11", category_id: "food", requested_amount: 10 },
      {
        city_id: 1226,
        date: "2022-03-12",
        category_id: "medical_kits_supplies",
        requested_amount: 4,
      },
      {
        city_id: 1226,
        date: "2022-03-12",
        category_id: "baby_products",
        requested_amount: 4,
      },
      {
        city_id: 1226,
        date: "2022-03-11",
        category_id: "baby_food",
        requested_amount: 15,
      },
    ],
  },
];

// test("AidRequestGrouped.byCityId with assignTotal calculates total for 4th group equal to 159", () => {
//   const aidRequestGroupedWithTotal = new AidRequestGrouped(exampleAggregatedRequests, [assignTotal]);

//   expect(aidRequestGroupedWithTotal.byCityId[3].total).toEqual(159);
// });

// test("AidRequestGrouped.byCityId with findLocation finds location", () => {
//   const aidRequestGroupedWithTotal = new AidRequestGrouped(exampleAggregatedRequests, [findLocation]);

//   expect(aidRequestGroupedWithTotal.byCityId[3].total).toEqual(159);
// });
