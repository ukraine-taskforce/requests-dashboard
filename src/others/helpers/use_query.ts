import { useMemo, useEffect, useState } from "react";
import { FilterItemId, FilterName } from "../contexts/filter";

type QueryName = "category" | "city" | "date";

const queryNametoFilterMap: {
  [key in FilterName]: QueryName;
} = {
  Categories: "category",
  Cities: "city",
  Dates: "date",
};

export const useQuery = (
  search: string,
  toggleFilterItem: (filterName: FilterName, filterItemId: FilterItemId, value?: boolean) => void
) => {
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [queryString, setQueryString] = useState('');
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(false);

  useEffect(() => {
    let url = new URL(window.location.href);
    url.search = queryString;
    window.history.pushState({}, "", url);
  }, [queryString]);

  const setFilterFromQuery = (filterNames: FilterName[]) => {
    filterNames.forEach((filterName: FilterName) => {
      const queryParam = query.get(queryNametoFilterMap[filterName]);

      if (queryParam) {
        const filterItems = queryParam.split(",");
        filterItems.forEach((item: string) => {
          const filterItemId = filterName === "Cities" ? Number(item) : item;
          toggleFilterItem(filterName, filterItemId, true);
        });
      }
    });

    setShouldUpdateUrl(true);
  };

  const setQuery = (queryData: {
    category: string[],
    city: number[],
    date: string,
  }) => {
    if (shouldUpdateUrl) {
      const queryNames = Object.keys(queryData) as QueryName[];

      queryNames.forEach(queryName => {
        if (queryData[queryName]) {
          // @ts-ignore
          query.set(queryName, queryData[queryName]);
        }
      })

      setQueryString(query.toString())
    }
  };

  return {
    setFilterFromQuery,
    setQuery,
  };
};
