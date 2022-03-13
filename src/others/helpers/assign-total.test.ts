import { assignTotal } from "./assign-total";

test("assignTotal", () => {
  const grouped = {
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
  };

  const groupedWithTotal = assignTotal(grouped);

  expect(groupedWithTotal.total).toEqual(159);
});
