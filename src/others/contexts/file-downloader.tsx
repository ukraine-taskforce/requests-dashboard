import { createContext, useContext, FunctionComponent } from "react";

import { AidRequest } from "./api";
import { useDictionaryContext } from "./dictionary-context";

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
  downloadAsJSON: (aidRequests: AidRequest[]) => void;
  downloadAsCSV: (aidRequests: AidRequest[]) => void;
}

const initFileDownloaderContextValue: FileDownloaderContextValue = {
  downloadAsCSV: (aidRequests) => {},
  downloadAsJSON: (aidRequests) => {},
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
  const { translateLocation, translateSupply } = useDictionaryContext();

  const formatAidRequests = (aidRequests: AidRequest[]): [FormattedAidRequests, string[]] => {
    const uniqueCategories: Set<string> = new Set();

    const formattedAidRequests = aidRequests?.reduce((result: FormattedAidRequests, request) => {
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

        // NOTE: the code in this file only works if a single date is present in the data
        if (result[locationName]) {
          result[locationName].requests.push(formattedRequest);
        } else {
          result[locationName] = {
            date: request.date,
            requests: [formattedRequest],
          };
        }
      }
      return result;
    }, {} as FormattedAidRequests);
    return [ formattedAidRequests, Array.from(uniqueCategories) ];
  };

  const downloadAsJSON = (aidRequests: AidRequest[]) => {
    const [ formattedAidRequests, ] = formatAidRequests(aidRequests);
    const blob = new Blob([JSON.stringify(formattedAidRequests, null, 4)], {
      type: "application/json",
    });

    triggerFileDownload(blob, "json");
  };
  const downloadAsCSV = (aidRequests: AidRequest[]) => {
    const [ formattedAidRequests, uniqueCategories ] = formatAidRequests(aidRequests);
    const csvRows = [];
    const csvHeaders = ["City", "Date"].concat(uniqueCategories);

    csvRows.push(csvHeaders.join(","));

    for (const city in formattedAidRequests) {
      const { requests: cityRequests, date: requestDate } = formattedAidRequests[city];

      const csvRow = [requestDate];

      const categoryToAmount: { [id: string]: number } = {};
      uniqueCategories.forEach((category) => { categoryToAmount[category] = 0; });
      cityRequests.forEach((request) => {
        categoryToAmount[request.category] = request.amount;
      });
      uniqueCategories.forEach((category) => {
        csvRow.push(String(categoryToAmount[category]));
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
        downloadAsCSV,
        downloadAsJSON,
      }}
    >
      {children}
    </FileDownloaderContext.Provider>
  );
};
