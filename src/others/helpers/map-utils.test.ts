import { DecodedAidRequestGroupedByLocation } from "./decode-aid-request";
import { assignTotalForDate, groupLocationGroupByDate, mapAidRequestsToFeatures, possibleDates } from "./map-utils";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

test("possibleDates", () => {
    const requests = [
        { date: "2022-03-10", city_id: 1, category_id: "personal_hygiene_kits", requested_amount: 14 },
        { date: "2022-03-10", city_id: 1, category_id: "water", requested_amount: 20 },
        { date: "2022-03-10", city_id: 1, category_id: "food", requested_amount: 14 },
        { date: "2022-03-10", city_id: 1, category_id: "water", requested_amount: 14 },
        { date: "2022-03-10", city_id: 1, category_id: "medical_kits_supplies", requested_amount: 10 },
        { date: "2022-03-10", city_id: 1, category_id: "food", requested_amount: 20 },
        { date: "2022-03-09", city_id: 1, category_id: "medical_kits_supplies", requested_amount: 14 },
        { date: "2022-03-09", city_id: 1, category_id: "water", requested_amount: 20 },
        { date: "2022-03-09", city_id: 3, category_id: "food", requested_amount: 14 },
        { date: "2022-03-09", city_id: 3, category_id: "water", requested_amount: 14 },
        { date: "2022-03-09", city_id: 4, category_id: "torches", requested_amount: 99 },
        { date: "2022-03-09", city_id: 4, category_id: "food", requested_amount: 20 },
        { date: "2022-03-07", city_id: 3, category_id: "water", requested_amount: 14 },
        { date: "2022-03-07", city_id: 4, category_id: "torches", requested_amount: 99 },
        { date: "2022-03-07", city_id: 4, category_id: "food", requested_amount: 20 },
    ];

    expect(possibleDates(requests).length).toEqual(3);
    expect(possibleDates(requests)).toEqual(["2022-03-10", "2022-03-09", "2022-03-07"])
});

test("groupLocationGroupByDate", () => {
    const locationGroup: DecodedAidRequestGroupedByLocation = {
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
    };

    expect(groupLocationGroupByDate(locationGroup))
        .toEqual([
            {
                date: "2022-03-11",
                aidRequests: [
                    { amount: 10, name: "Sanitary pads" },
                    { amount: 15, name: "Masks" },
                    { amount: 19, name: "Baby Products" },
                    { amount: 16, name: "Medical Kits / Supplies" },
                    { amount: 10, name: "Torches" },
                    { amount: 11, name: "Water" },
                    { amount: 21, name: "Personal hygiene kits" },
                    { amount: 20, name: "Tampons" },
                    { amount: 10, name: "Food" },
                    { amount: 15, name: "Baby Food" },
                ]
            }, {
                date: "2022-03-12",
                aidRequests: [
                    { amount: 4, name: "Personal hygiene kits" },
                    { amount: 4, name: "Medical Kits / Supplies" },
                    { amount: 4, name: "Baby Products" },
                ]
            }])
});

test("assignTotalForDate", () => {
    const grouped = {
        date: "2022-03-11",
        aidRequests: [
            { amount: 10, name: "Sanitary pads" },
            { amount: 15, name: "Masks" },
            { amount: 19, name: "Baby Products" },
            { amount: 16, name: "Medical Kits / Supplies" },
            { amount: 10, name: "Torches" },
            { amount: 11, name: "Water" },
            { amount: 21, name: "Personal hygiene kits" },
            { amount: 20, name: "Tampons" },
            { amount: 10, name: "Food" },
            { amount: 15, name: "Baby Food" },
        ]
    };

    expect(assignTotalForDate(grouped).total)
        .toEqual(147)
});

test("mapAidRequestsToFeatures", () => {
    const decodedAidRequestGroupedByLocation: DecodedAidRequestGroupedByLocation[] = [
        {
            location: { name: "Zaliznychne", lon: 36.169, lat: 47.645 },
            total: 17,
            decodedAidRequests: [
                { date: "2022-03-11", amount: 10, name: "Sanitary pads" },
                { date: "2022-03-11", amount: 3, name: "Batteries" },
                { date: "2022-03-10", amount: 4, name: "Personal hygiene kits" }
            ],
        },
        {
            location: { name: "Kyiv", lon: 30.524, lat: 50.45 },
            total: 11,
            decodedAidRequests: [
                { date: "2022-03-11", amount: 1, name: "Batteries" },
                { date: "2022-03-10", amount: 2, name: "Baby Products" },
                { date: "2022-03-10", amount: 3, name: "Sanitary pads" },
                { date: "2022-03-10", amount: 5, name: "Personal hygiene kits" }
            ],
        }
    ];

    expect(mapAidRequestsToFeatures(decodedAidRequestGroupedByLocation))
        .toEqual(new Set<Feature<Geometry, GeoJsonProperties>>([
            // Location Zaliznychne
            // Features for single requests
            {
                type: "Feature",
                properties: {
                    amount: 10,
                    category: "Sanitary pads",
                    date: "2022-03-11"
                },
                geometry: { type: "Point", coordinates: [36.169, 47.645] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 3,
                    category: "Batteries",
                    date: "2022-03-11"
                },
                geometry: { type: "Point", coordinates: [36.169, 47.645] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 4,
                    category: "Personal hygiene kits",
                    date: "2022-03-10"
                },
                geometry: { type: "Point", coordinates: [36.169, 47.645] },
            },
            // Features for aggregated requests for day and location
            {
                type: "Feature",
                properties: {
                    amount: 13,
                    category: "ALL",
                    date: "2022-03-11"
                },
                geometry: { type: "Point", coordinates: [36.169, 47.645] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 4,
                    category: "ALL",
                    date: "2022-03-10"
                },
                geometry: { type: "Point", coordinates: [36.169, 47.645] },
            },
            // Location Kyiv
            // Features for single requests
            {
                type: "Feature",
                properties: {
                    amount: 1,
                    category: "Batteries",
                    date: "2022-03-11"
                },
                geometry: { type: "Point", coordinates: [30.524, 50.45] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 2,
                    category: "Baby Products",
                    date: "2022-03-10"
                },
                geometry: { type: "Point", coordinates: [30.524, 50.45] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 3,
                    category: "Sanitary pads",
                    date: "2022-03-10"
                },
                geometry: { type: "Point", coordinates: [30.524, 50.45] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 5,
                    category: "Personal hygiene kits",
                    date: "2022-03-10"
                },
                geometry: { type: "Point", coordinates: [30.524, 50.45] },
            },
            // Features for aggregated requests for day and location
            {
                type: "Feature",
                properties: {
                    amount: 1,
                    category: "ALL",
                    date: "2022-03-11"
                },
                geometry: { type: "Point", coordinates: [30.524, 50.45] },
            },
            {
                type: "Feature",
                properties: {
                    amount: 10,
                    category: "ALL",
                    date: "2022-03-10"
                },
                geometry: { type: "Point", coordinates: [30.524, 50.45] },
            }
        ]));
});



