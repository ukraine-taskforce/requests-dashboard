import { ReactNode, useState, useContext, createContext, useEffect } from "react";
import { useLocationsQuery, useSuppliesQuery, Supply, Location } from "./api";

interface DictionaryState {
  supplies: Supply[]; // TODO: it's used only in map - doesn't have to be exposed once map is using the declarative API (translate...)
  locations: Location[]; // TODO: it's used only in map - doesn't have to be exposed once map is using the declarative API (translate...)
  translateLocation: (city_id: number) => Location | undefined;
  translateSupply: (category_id: string) => Supply | undefined;
}

export const DictionaryContext = createContext<DictionaryState | null>(null);

export const useDictionaryContext = () => {
  const dictionaryContext = useContext(DictionaryContext);
  if (!dictionaryContext) {
    throw new Error("dictionaryContext must be used within ictionaryContextProvider");
  }
  return dictionaryContext;
};

interface DictionaryContextProviderProps {
  children: ReactNode;
}

export const DictionaryContextProvider = ({ children }: DictionaryContextProviderProps) => {
  const { data: locations } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();

  const dictionaryState = useDictionaryState({ supplies: supplies || [], locations: locations || [] });

  useEffect(() => {
    dictionaryState.setSupplies(supplies || []);
    dictionaryState.setLocations(locations || []);
  }, [supplies?.length, locations?.length]);

  return <DictionaryContext.Provider value={dictionaryState}>{children}</DictionaryContext.Provider>;
};

const useDictionaryState = ({ supplies: sup, locations: loc }: { supplies: Supply[]; locations: Location[] }) => {
  const [supplies, setSupplies] = useState(sup);
  const [locations, setLocations] = useState(loc);

  const translateLocation = (city_id: number) => {
    const location = locations[city_id - 1];
    return location;
  };

  const translateSupply = (category_id: string) => {
    const supply = supplies.find((supply) => String(supply.id) === String(category_id));
    return supply;
  };

  return {
    supplies,
    setSupplies,
    locations,
    setLocations,
    translateLocation,
    translateSupply,
  };
};
