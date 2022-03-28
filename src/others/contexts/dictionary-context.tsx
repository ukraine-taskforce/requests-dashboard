import { ReactNode, useState, useContext, createContext, useEffect, useMemo } from "react";
import { useLocationsQuery, useSuppliesQuery, Supply, Location } from "./api";

interface DictionaryState {
  suppliesDict: SuppliesDict | undefined; // TODO: it's used only in map - doesn't have to be exposed once map is using the declarative API (translate...)
  locationDict: LocationsDict | undefined; // TODO: it's used only in map - doesn't have to be exposed once map is using the declarative API (translate...)
  translateLocation: (city_id: number) => Location | undefined;
  translateSupply: (category_id: string) => Supply | undefined;
}

type LocationsDict = { [k: number]: Location };
type SuppliesDict = { [k: string]: Supply };

export const DictionaryContext = createContext<DictionaryState | null>(null);

export const useDictionaryContext = () => {
  const dictionaryContext = useContext(DictionaryContext);
  if (!dictionaryContext) {
    throw new Error("dictionaryContext must be used within dictionaryContextProvider");
  }
  return dictionaryContext;
};

interface DictionaryContextProviderProps {
  children: ReactNode;
}

export const DictionaryContextProvider = ({ children }: DictionaryContextProviderProps) => {
  const { data: locations } = useLocationsQuery();
  const { data: supplies } = useSuppliesQuery();

  const dictionaryState = useDictionaryState({ supplies, locations });

  return <DictionaryContext.Provider value={dictionaryState}>{children}</DictionaryContext.Provider>;
};

const useDictionaryState = ({ supplies, locations }: { supplies: Supply[] | undefined; locations: Location[] | undefined }) => {
  const [suppliesDict, setSuppliesDict] = useState<SuppliesDict | undefined>(undefined);
  const [locationDict, setLocationsDict] = useState<LocationsDict | undefined>(undefined);

  const initLocationsDict = useMemo(
    () => (locations: Location[]) => {
      if (!locationDict) {
        const locationDict = locations.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
        setLocationsDict(locationDict);
      }
    },
    [locations, locationDict]
  );

  const initSuppliesDict = useMemo(
    () => (supplies: Supply[]) => {
      if (!suppliesDict) {
        const suppliesDict = supplies.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
        setSuppliesDict(suppliesDict);
      }
    },
    [supplies, suppliesDict]
  );

  useEffect(() => {
    if (locations?.length && supplies?.length) {
      initLocationsDict(locations);
      initSuppliesDict(supplies);
    }
  }, [supplies, locations, initLocationsDict, initSuppliesDict]);

  const translateLocation = (city_id: number): Location | undefined => {
    const location = locationDict ? locationDict[city_id] : undefined;
    return location;
  };

  const translateSupply = (category_id: string): Supply | undefined => {
    const supply = suppliesDict ? suppliesDict[category_id] : undefined;
    return supply;
  };

  return {
    initSuppliesDict,
    initLocationsDict,
    suppliesDict,
    locationDict,
    translateLocation,
    translateSupply,
  };
};
