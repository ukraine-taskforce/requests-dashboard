import { useTranslation } from "react-i18next";
import { QueryClient, useQuery } from "react-query";
import React from "react";

import { fakeRequests } from "../../others/fixtures/fakeRequestsV2";
import { useAuth } from "./auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, //3 Minutes
    },
  },
});

export const API_DOMAIN = process.env.REACT_APP_API_DOMAIN || "http://127.0.0.1";
export const REQUESTS_SOURCE = process.env.REACT_APP_REQUESTS_SOURCE || "api";

export interface Location {
  id: number;
  name: string;
  lat: number;
  lon: number;
  region_id: string;
}

function useFetch() {
  const { forceSessionRefresh, session } = useAuth();

  const query = React.useCallback(
    (input: RequestInfo, init?: RequestInit) => {
      return fetch(input, {
        headers: {
          Authorization: session?.accessToken.jwtToken || "",
        },
        ...init,
      }).then((res) => {
        if (res.status === 401) {
          forceSessionRefresh();
        }

        return res;
      });
    },
    [forceSessionRefresh, session]
  );

  return {
    query,
  };
}

export function useLocationsQuery() {
  const { i18n } = useTranslation();
  const { query } = useFetch();

  return useQuery<Location[]>(`locationQuery${i18n.language}`, async () => {
    try {
      const result = await query(`${API_DOMAIN}/locations?locale=${i18n.language}&include_metadata=true`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);

          return res;
        })
        .then((res) => res.json());

      return result.locations;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        return [
          { id: 1, name: "Kyiv", lat: 50.45, lon: 30.524, region_id: "UKR-ADM1-14850775B25539455" },
          { id: 2, name: "Kyinka", lat: 51.494, lon: 31.294, region_id: "UKR-ADM1-14850775B25539455" },
          { id: 3, name: "Kyrnasivka", lat: 46.484, lon: 30.732, region_id: "UKR-ADM1-14850775B25539455" },
          { id: 4, name: "Kyrylivka", lat: 50.351, lon: 30.95, region_id: "UKR-ADM2-31201334B8340102" },
        ];
      }

      throw error;
    }
  });
}

export interface Supply {
  id: string;
  name: string;
}

export function useSuppliesQuery() {
  const { i18n } = useTranslation();
  const { query } = useFetch();

  return useQuery<Supply[]>(`suppliesQuery${i18n.language}`, async () => {
    try {
      const result = await query(`${API_DOMAIN}/supplies?locale=${i18n.language}`)
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
  city_id: number;
  category_id: string;
  requested_amount: number;
}

export function useAidRequestQuery() {
  const { i18n } = useTranslation();
  const { query } = useFetch();

  return useQuery<AidRequest[]>(`aidRequestQuery${i18n.language}`, async () => {
    if (REQUESTS_SOURCE === "fakeRequestsV2") {
      return fakeRequests;
    }
    if (REQUESTS_SOURCE === "api") {
      try {
        const result = await query(`${API_DOMAIN}/aggregated`)
          .then((res) => {
            if (!res.ok) throw new Error(res.statusText);

            return res;
          })
          .then((res) => res.json());

        return result.data;
      } catch (error) {
        throw error;
      }
    }
    throw new Error("Request source [" + REQUESTS_SOURCE + "] is not supported.");
  });
}
