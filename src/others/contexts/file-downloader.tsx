import { createContext, useState, useContext, FunctionComponent, useEffect } from "react";

import { useAidRequestQuery, useLocationsQuery, useSuppliesQuery } from "./api";
import { useDictionaryContext } from "./dictionary-context";
import { useFilter } from "./filter";

type FormattedAidRequests = {
  [city: string]: {
    date: string;
    requests: [
      {
        category: string;
        amount: number;
      }
    ];
  };
};

export interface FileDownloaderContextValue {
  isButtonDisabled: boolean;
  downloadAsJSON: () => void;
  downloadAsCSV: () => void;
}

const initFileDownloaderContextValue: FileDownloaderContextValue = {
  isButtonDisabled: true,
  downloadAsCSV: () => {},
  downloadAsJSON: () => {},
};

const FileDownloaderContext = createContext<FileDownloaderContextValue>(initFileDownloaderContextValue);

const triggerFileDownload = (dataBlob: Blob, extension: string) => {
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ukraine-requests.${extension}`);
  link.click();

  URL.revokeObjectURL(url);
};

export function useFileDownloader(): FileDownloaderContextValue {
  return useContext(FileDownloaderContext);
}

export const FileDownloaderContextProvider: FunctionComponent = ({ children }) => {
  const { data: cities, isSuccess: citiesSuccess } = useLocationsQuery();
  const { data: supplies, isSuccess: suppliesSuccess } = useSuppliesQuery();
  const { translateLocation, translateSupply } = useDictionaryContext();
  const { data: aidRequests, isSuccess: aidRequestsSuccess } = useAidRequestQuery();
  const { getActiveFilterItems } = useFilter();

  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);

  const activeCategoryFilters = getActiveFilterItems("Categories");
  const activeDateFilters = getActiveFilterItems("Dates");

  useEffect(() => {
    setButtonDisabled(!citiesSuccess && !suppliesSuccess && !aidRequestsSuccess);
  }, [citiesSuccess, suppliesSuccess, aidRequestsSuccess]);

  const filteredAidRequests = aidRequests?.filter(
    (aidRequest) =>
      (activeCategoryFilters.length === 0 || activeCategoryFilters.includes(aidRequest.category_id as string)) && // typecasting necessary because filter item is string | boolean
      (activeDateFilters.length === 0 || activeDateFilters.includes(aidRequest.date))
  );

  const uniqueCategories: Set<string> = new Set();

  const formattedAidRequests = filteredAidRequests?.reduce((result: FormattedAidRequests, request) => {
    if (supplies && cities) {
      const category = translateSupply(request.category_id);
      const location = translateLocation(request.city_id);

      const categoryName = category?.name;
      const locationName = location?.name;

      if (categoryName && locationName) {
        uniqueCategories.add(categoryName);

        const formattedRequest = {
          category: categoryName,
          amount: request.requested_amount,
        };

        if (result[locationName]) {
          result[locationName].requests.push(formattedRequest);
        } else {
          result[locationName] = {
            date: request.date,
            requests: [formattedRequest],
          };
        }
      }
    }

    return result;
  }, {} as FormattedAidRequests);

  const downloadAsJSON = () => {
    const blob = new Blob([JSON.stringify(formattedAidRequests, null, 4)], {
      type: "application/json",
    });

    triggerFileDownload(blob, "json");
  };
  const downloadAsCSV = () => {
    const csvRows = [];
    const csvHeaders = ["City", "Date"].concat(Array.from(uniqueCategories));

    csvRows.push(csvHeaders.join(","));

    for (const city in formattedAidRequests) {
      const { requests: cityRequests, date: requestDate } = formattedAidRequests[city];

      const csvRow = [requestDate];

      cityRequests.forEach((request) => {
        csvRow.push(request.amount + "");
      });

      // removing ',' from city names so that columns in CSV are correcly laid out
      csvRows.push(city.replace(",", " ") + "," + csvRow.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv",
    });

    triggerFileDownload(blob, "csv");
  };

  return (
    <FileDownloaderContext.Provider
      value={{
        isButtonDisabled,
        downloadAsCSV,
        downloadAsJSON,
      }}
    >
      {children}
    </FileDownloaderContext.Provider>
  );
};
