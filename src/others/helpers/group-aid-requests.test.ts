import { groupByLocation, groupByCategory } from "./group-aid-requests";

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

test("groupByLocation length is equal 4, because it contains requests with 4 different city_id's", () => {
  expect(groupByLocation(exampleAggregatedRequests).length).toEqual(4);
});

test("groupByLocation groups aid requests by city_id", () => {
  const groupedByLocation = groupByLocation(exampleAggregatedRequests);

  expect(groupedByLocation).toEqual([
    {
      city_id: "1",
      aidRequests: [
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
    },
    {
      city_id: "2",
      aidRequests: [
        {
          date: "2022-03-10",
          category_id: "personal_hygiene_kits",
          requested_amount: 1,
        },
      ],
    },
    {
      city_id: "30",
      aidRequests: [
        {
          date: "2022-03-11",
          category_id: "batteries",
          requested_amount: 4,
        },
      ],
    },
    {
      city_id: "1226",
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
    },
  ]);
});

test("groupByCategory length is equal, because it contains requests with 13 different category_id's", () => {
  expect(groupByCategory(exampleAggregatedRequests).length).toEqual(13);
});

test("groupByCategory groups aid requests by category_id", () => {
  const groupedByCategory = groupByCategory(exampleAggregatedRequests);

  expect(groupedByCategory).toEqual([
    {
      category_id: "sanitary_pads",
      aidRequests: [
        { date: "2022-03-11", city_id: 1226, requested_amount: 10 },
        { date: "2022-03-10", city_id: 1, requested_amount: 2 },
      ],
    },
    {
      category_id: "personal_hygiene_kits",
      aidRequests: [
        { date: "2022-03-12", city_id: 1226, requested_amount: 4 },
        { date: "2022-03-10", city_id: 2, requested_amount: 1 },
        { date: "2022-03-11", city_id: 1226, requested_amount: 21 },
      ],
    },
    {
      category_id: "bedding",
      aidRequests: [{ date: "2022-03-11", city_id: 1, requested_amount: 4 }],
    },
    {
      category_id: "masks",
      aidRequests: [{ date: "2022-03-11", city_id: 1226, requested_amount: 15 }],
    },
    {
      category_id: "candles",
      aidRequests: [{ date: "2022-03-11", city_id: 1, requested_amount: 4 }],
    },
    {
      category_id: "baby_products",
      aidRequests: [
        { date: "2022-03-11", city_id: 1226, requested_amount: 19 },
        { date: "2022-03-10", city_id: 1, requested_amount: 2 },
        { date: "2022-03-12", city_id: 1226, requested_amount: 4 },
      ],
    },
    {
      category_id: "medical_kits_supplies",
      aidRequests: [
        { date: "2022-03-11", city_id: 1226, requested_amount: 16 },
        { date: "2022-03-12", city_id: 1226, requested_amount: 4 },
      ],
    },
    {
      category_id: "torches",
      aidRequests: [{ date: "2022-03-11", city_id: 1226, requested_amount: 10 }],
    },
    {
      category_id: "water",
      aidRequests: [{ date: "2022-03-11", city_id: 1226, requested_amount: 11 }],
    },
    {
      category_id: "food",
      aidRequests: [
        { date: "2022-03-10", city_id: 1, requested_amount: 2 },
        { date: "2022-03-11", city_id: 1226, requested_amount: 10 },
      ],
    },
    {
      category_id: "batteries",
      aidRequests: [
        { date: "2022-03-11", city_id: 1, requested_amount: 4 },
        { date: "2022-03-11", city_id: 30, requested_amount: 4 },
      ],
    },
    {
      category_id: "tampons",
      aidRequests: [{ date: "2022-03-11", city_id: 1226, requested_amount: 20 }],
    },
    {
      category_id: "baby_food",
      aidRequests: [{ date: "2022-03-11", city_id: 1226, requested_amount: 15 }],
    },
  ]);
});
