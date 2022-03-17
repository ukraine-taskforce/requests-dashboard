import React, { useCallback, useState } from "react";

export type FilterItem = {
  id: string;
  selected: boolean;
  text: string;
};

export type Filter = {
  active: boolean;
  filterName: string;
  filterItems: FilterItem[];
  singleValueFilter: boolean;
};

export interface FilterContextValue {
  filters: { [filterName: string]: Filter };
  addFilter: (newFilter: Filter) => void;
  activateFilter: (filterName: string) => void;
  toggleFilterItem: (filterName: string, filterItemId: string, value?: boolean) => void;
  getActiveFilterItems: (filterName: string) => string[];
}

const initFilterContextValue: FilterContextValue = {
  filters: {},
  addFilter: () => {},
  activateFilter: () => {},
  toggleFilterItem: () => {},
  getActiveFilterItems: () => [],
};

const FilterContext = React.createContext<FilterContextValue>(initFilterContextValue);

export function useFilter(): FilterContextValue {
  return React.useContext(FilterContext);
}

export const FilterContextProvider: React.FunctionComponent = ({ children }) => {
  const [filters, setFilters] = useState<{ [filterName: string]: Filter }>({});

  const addFilter = useCallback(
    (newFilter: Filter) => {
      setFilters((initFilters) => ({ ...initFilters, [newFilter.filterName]: newFilter }));
    },
    [setFilters]
  );

  const activateFilter = useCallback(
    (filterName: string) => {
      setFilters((filters) => {
        const currentFilter = filters[filterName];

        return {
          ...filters,
          [filterName]: {
            ...currentFilter,
            active: !currentFilter.active,
          },
        };
      });
    },
    [setFilters]
  );

  const toggleFilterItem = useCallback(
    (filterName: string, filterItemId: string, value?: boolean) => {
      setFilters((filters) => {
        const currentFilter = filters[filterName];

        return {
          ...filters,
          [filterName]: {
            ...currentFilter,
            filterItems: currentFilter.filterItems.map((filterItem) => {
              if (currentFilter.singleValueFilter) {
                // Deselect all other filter items
                filterItem.selected = false;
              }

              if (filterItem.id === filterItemId) {
                // If value is specified as a param, use it, else - toggle
                const newFilterItemValue = typeof value === "boolean" ? value : !filterItem.selected;
                filterItem.selected = newFilterItemValue;
              }
              return filterItem;
            }),
          },
        };
      });
    },
    [setFilters]
  );

  const getActiveFilterItems = (filterName: string) => {
    const currentFilter = filters[filterName];
    if (currentFilter) {
      return currentFilter.filterItems.filter(({ selected }) => selected).map(({ id }) => id);
    }

    return [];
  };

  return (
    <FilterContext.Provider value={{ filters, addFilter, activateFilter, toggleFilterItem, getActiveFilterItems }}>
      {children}
    </FilterContext.Provider>
  );
};
