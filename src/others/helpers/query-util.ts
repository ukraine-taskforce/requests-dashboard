import { useMemo, useEffect, useState } from "react";
import { FilterItemId, FilterName } from "../contexts/filter";

type queryName = "category" | "city" | "date";

const queryNametoFilterMap = {
  Categories: "category",
  Cities: "city",
  Dates: "date",
};

export const useQuery = (
  search: string,
  toggleFilterItem: (filterName: FilterName, filterItemId: FilterItemId, value?: boolean) => void
) => {
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    let url = new URL(window.location.href);
    url.search = queryString;
    window.history.pushState({}, "", url);
  }, [queryString]);

  const setFilterFromQuery = (filterName: FilterName) => {
    // @ts-ignore
    const queryParam = query.get(queryNametoFilterMap[filterName]);

    if (queryParam) {
      const filterItems = queryParam.split(",");
      filterItems.forEach((item: string) => {
        const filterItemId = filterName === "Cities" ? Number(item) : item;
        toggleFilterItem(filterName, filterItemId, true);
      });
    }
  };

  const setQuery = (queryName: queryName, data: string) => {
    query.set(queryName, data);
    setQueryString(query.toString());
  };

  return {
    setFilterFromQuery,
    setQuery,
  };
};
