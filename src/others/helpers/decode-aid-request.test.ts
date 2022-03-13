import { decodeAidRequest } from "./decode-aid-request";

const dictionary = {
  supplies: [
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
  ],
  locations: [
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
  ],
};

test("decodeAidRequest", () => {
  const groupedWithTotal = {
    city_id: "1226",
    total: 159,
    aidRequests: [
      {
        date: "2022-03-11",
        category_id: "sanitary_pads",
        requested_amount: 10,
      },
      {
        date: "2022-03-12",
        category_id: "personal_hygiene_kits",
        requested_amount: 4,
      },
      { date: "2022-03-11", category_id: "masks", requested_amount: 15 },
      {
        date: "2022-03-11",
        category_id: "baby_products",
        requested_amount: 19,
      },
      {
        date: "2022-03-11",
        category_id: "medical_kits_supplies",
        requested_amount: 16,
      },
      {
        date: "2022-03-11",
        category_id: "torches",
        requested_amount: 10,
      },
      { date: "2022-03-11", category_id: "water", requested_amount: 11 },
      {
        date: "2022-03-11",
        category_id: "personal_hygiene_kits",
        requested_amount: 21,
      },
      {
        date: "2022-03-11",
        category_id: "tampons",
        requested_amount: 20,
      },
      { date: "2022-03-11", category_id: "food", requested_amount: 10 },
      {
        date: "2022-03-12",
        category_id: "medical_kits_supplies",
        requested_amount: 4,
      },
      {
        date: "2022-03-12",
        category_id: "baby_products",
        requested_amount: 4,
      },
      {
        date: "2022-03-11",
        category_id: "baby_food",
        requested_amount: 15,
      },
    ],
  };

  const decodedGroupedByLocation = decodeAidRequest(dictionary, groupedWithTotal);

  expect(decodedGroupedByLocation).toEqual({
    location: { name: "Zaliznychne", lat: 47.645, lon: 36.169 },
    total: 159,
    aidRequests: [
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
  });
});
