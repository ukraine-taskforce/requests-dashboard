import { groupByLocation } from "./group-aid-requests";

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

test("groupByLocation reduces exampleAggregatedRequests length to 4, because it contains requests with 4 different city_id's", () => {
  expect(groupByLocation(exampleAggregatedRequests).length).toEqual(4);
});

test("1st group", () => {
  const firstGroup = groupByLocation(exampleAggregatedRequests)[0];

  expect(firstGroup).toEqual({
    city_id: "1",
    categories: [
      { date: "2022-03-11", category_id: "bedding", requested_amount: 4 },
      { date: "2022-03-11", category_id: "candles", requested_amount: 4 },
      {
        date: "2022-03-10",
        category_id: "sanitary_pads",
        requested_amount: 2,
      },
      { date: "2022-03-10", category_id: "food", requested_amount: 2 },
      {
        date: "2022-03-11",
        category_id: "batteries",
        requested_amount: 4,
      },
      {
        date: "2022-03-10",
        category_id: "baby_products",
        requested_amount: 2,
      },
    ],
  });
});

test("2nd group", () => {
  const secondGroup = groupByLocation(exampleAggregatedRequests)[1];

  expect(secondGroup).toEqual({
    city_id: "2",
    categories: [
      {
        date: "2022-03-10",
        category_id: "personal_hygiene_kits",
        requested_amount: 1,
      },
    ],
  });
});

test("3rd group", () => {
  const thirdGroup = groupByLocation(exampleAggregatedRequests)[2];

  expect(thirdGroup).toEqual({
    city_id: "30",
    categories: [
      {
        date: "2022-03-11",
        category_id: "batteries",
        requested_amount: 4,
      },
    ],
  });
});

test("4th group", () => {
  const fourthGroup = groupByLocation(exampleAggregatedRequests)[3];

  expect(fourthGroup).toEqual({
    city_id: "1226",
    categories: [
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
  });
});
