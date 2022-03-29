import { useMemo, useState } from "react";
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
  urlParamsString: string,
  toggleFilterItem: (filterName: FilterName, filterItemId: FilterItemId, value?: boolean) => void
) => {
  const query = useMemo(() => new URLSearchParams(urlParamsString), [urlParamsString]);
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(false);

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

  const setQuery = (queryData: { category: string[]; city: number[]; date: string }) => {
    if (shouldUpdateUrl) {
      const queryNames = Object.keys(queryData) as QueryName[];

      queryNames.forEach((queryName) => {
        const queryDataAsString = Array.isArray(queryData[queryName])
          ? (queryData[queryName] as string[] | number[]).join(",")
          : queryData[queryName];

        if (queryDataAsString) {
          query.set(queryName, queryDataAsString as string);
        } else {
          query.delete(queryName);
        }
      });

      const url = new URL(window.location.href);
      url.search = query.toString();
      window.history.pushState({}, "", url);
    }
  };

  return {
    setFilterFromQuery,
    setQuery,
  };
};
