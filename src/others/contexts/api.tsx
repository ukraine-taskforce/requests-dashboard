import { useTranslation } from "react-i18next";
import { QueryClient, useQuery } from "react-query";

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
          { id: 1, name: "Kyiv", lat: 50.45, lon: 30.524},
          { id: 2, name: "Kyinka", lat: 51.494, lon: 31.294 },
          { id: 3, name: "Kyrnasivka", lat: 46.484, lon: 30.732 },
          { id: 4, name: "Kyrylivka" , lat: 50.351, lon: 30.95 },
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
          { id: 1, name: "Food" },
          { id: 2, name: "Water" },
          { id: 3, name: "Baby Food" },
          { id: 4, name: "Medical Kits / Supplies" },
        ];
      }

      throw error;
    }
  });
}
