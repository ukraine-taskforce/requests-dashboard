import { groupByCities, groupByCategories, filterByCategoryIds } from "./aid-request-helpers";

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

test("filterByCategoryIds returns only aid requests with category_id's specified in the array of accepted category_id's", () => {
  const acceptedIds = ["personal_hygiene_kits", "baby_food", "baby_products"];
  const filtered = filterByCategoryIds(exampleAggregatedRequests, acceptedIds);

  filtered.forEach((item) => {
    expect(acceptedIds).toContain(item.category_id);
  });
});

test("filterByCategoryIds returns empty array if the array of accepted category_id's is empty", () => {
  const acceptedIds: string[] = [];
  const filtered = filterByCategoryIds(exampleAggregatedRequests, acceptedIds);

  expect(filtered).toEqual([]);
});

test("filterByCategoryIds returns all aid requests if the array of accepted category_id's contains only '*' ", () => {
  const acceptedIds: string[] = ["*"];
  const filtered = filterByCategoryIds(exampleAggregatedRequests, acceptedIds);

  expect(filtered).toEqual(exampleAggregatedRequests);
});

test("filterByCategoryIds returns all aid requests if the array of accepted category_id's contains '*' ", () => {
  const acceptedIds: string[] = ["personal_hygiene_kits", "*"];
  const filtered = filterByCategoryIds(exampleAggregatedRequests, acceptedIds);

  expect(filtered).toEqual(exampleAggregatedRequests);
});

// TODO: pimp the tests
test("groupByCities data shape", () => {
  const firstGroup = groupByCities(exampleAggregatedRequests)[0];

  expect(firstGroup).toEqual({
    city_id: 1,
    total: 18,
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
        date: "2022-03-10",
        city_id: 1,
        category_id: "sanitary_pads",
        requested_amount: 2,
      },
      {
        date: "2022-03-10",
        city_id: 1,
        category_id: "food",
        requested_amount: 2,
      },
      {
        date: "2022-03-11",
        city_id: 1,
        category_id: "batteries",
        requested_amount: 4,
      },
      {
        date: "2022-03-10",
        city_id: 1,
        category_id: "baby_products",
        requested_amount: 2,
      },
    ],
  });
});

// TODO: pimp the tests
test("groupByCategories  data shape", () => {
  const firstGroup = groupByCategories(exampleAggregatedRequests)[0];

  console.log(firstGroup);

  expect(firstGroup).toEqual({
    category_id: "sanitary_pads",
    total: 12,
    aidRequests: [
      {
        date: "2022-03-11",
        city_id: 1226,
        category_id: "sanitary_pads",
        requested_amount: 10,
      },
      {
        date: "2022-03-10",
        city_id: 1,
        category_id: "sanitary_pads",
        requested_amount: 2,
      },
    ],
  });
});
