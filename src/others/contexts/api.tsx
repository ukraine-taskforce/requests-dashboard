import { useTranslation } from "react-i18next";
import { QueryClient, useQuery } from "react-query";
import { fakeRequests } from "../../others/fixtures/fakedata";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, //3 Minutes
    },
  },
});

export const API_DOMAIN = process.env.REACT_APP_API_DOMAIN || "http://127.0.0.1";

export type ID = string | number;

export interface Location {
  id: ID;
  name: string;
  lat: number;
  lon: number;
}

export function useLocationsQuery() {
  const { i18n } = useTranslation();

  return useQuery<Location[]>(`locationQuery${i18n.language}`, async () => {
    try {
      const result = await fetch(`${API_DOMAIN}/locations?locale=${i18n.language}&include_metadata=true`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);

          return res;
        })
        .then((res) => res.json());

      return result.locations;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        return [
          { id: 1, name: "Kyiv", lat: 50.45, lon: 30.524 },
          { id: 2, name: "Kyinka", lat: 51.494, lon: 31.294 },
          { id: 3, name: "Kyrnasivka", lat: 46.484, lon: 30.732 },
          { id: 4, name: "Kyrylivka", lat: 50.351, lon: 30.95 },
        ];
      }

      throw error;
    }
  });
}

export interface Supply {
  id: ID;
  name: string;
}

export function useSuppliesQuery() {
  const { i18n } = useTranslation();

  return useQuery<Supply[]>(`suppliesQuery${i18n.language}`, async () => {
    try {
      const result = await fetch(`${API_DOMAIN}/supplies?locale=${i18n.language}`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);

          return res;
        })
        .then((res) => res.json());

      return result.supplies;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        return [
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
      }

      throw error;
    }
  });
}

export interface AidRequest {
  date: string;
  city_id: ID;
  category_id: ID;
  requested_amount: number;
}

export function useAidRequestQuery() {
  const { i18n } = useTranslation();

  return useQuery<AidRequest[]>(`aidRequestQuery${i18n.language}`, async () => {
    // REMOVE THIS AFTER THE DEMO!
    return fakeRequests;
    try {
      const result = await fetch(`${API_DOMAIN}/aggregated`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);

          return res;
        })
        .then((res) => res.json());

      return result.data;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        return mockAidRequests;
      }

      throw error;
    }
  });
}

const mockAidRequests = [
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
];
