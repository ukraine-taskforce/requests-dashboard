import { useTranslation } from "react-i18next";
import { useEffect, useCallback, useMemo } from "react";
import { MapProvider } from "react-map-gl";
import { map, groupBy } from "lodash";
import { Layout } from "../../others/components/Layout";
import { Map } from "../../others/components/map/Map";
import { Header } from "../../others/components/mckinsey/Header";
import { Main } from "../../others/components/Main";
import { Sidebar } from "../../others/components/Sidebar";
import { CollapsibleTable } from "../../others/components/CollapsibleList";
import { RegionsSourceWithLayers } from "../../others/components/map/McKinseyRegionsSourceWithLayers";
import { ukrAdm1 } from "../../others/fixtures/ukrAdm1";
import { FilterItem, useFilter } from "../../others/contexts/filter";

type Category = {
  id: string;
  name: string;
  measure: string;
};

const categories: { [id: string]: Category } = {
  "water": {
    id: "water",
    name: "Water",
    measure: "L",
  },
  "rice": {
    id: "rice",
    name: "Rice",
    measure: "kg",
  },
  "bread": {
    id: "bread",
    name: "Bread",
    measure: "kg",
  }
};

export function McKinsey() {
  const { t } = useTranslation();
  const { addFilter, getActiveFilterItems } = useFilter();

  useEffect(() => {
    addFilter({
      filterName: "Categories",
      filterItems: Object.values(categories).map((category): FilterItem => ({ id: category.id, selected: false, text: category.name })),
      active: false,
      singleValueFilter: false,
    });
  }, [addFilter]);
 
  const activeCategoryFilter = getActiveFilterItems("Categories") as string[]; 

  const generateFakeData = useCallback((activeCategoryFilter) => {
    const regions: string[] = ['Kherson Oblast', 'Volyn Oblast', 'Rivne Oblast', 'Zhytomyr Oblast', 'Kyiv Oblast', 'Chernihiv Oblast', 'Sumy Oblast', 'Kharkiv Oblast', 'Luhansk Oblast', 'Donetsk Oblast', 'Zaporizhia Oblast', 'Lviv Oblast', 'Ivano-Frankivsk Oblast', 'Zakarpattia Oblast', 'Ternopil Oblast', 'Chernivtsi Oblast', 'Odessa Oblast', 'Mykolaiv Oblast', 'Autonomous Republic of Crimea', 'Vinnytsia Oblast', 'Khmelnytskyi Oblast', 'Cherkasy Oblast', 'Poltava Oblast', 'Dnipropetrovsk Oblast', 'Kirovohrad Oblast', 'Kyiv', 'Sevastopol'];
    const data = [];
    const priorityDict: { [id: string]: number } = {};
    for (const region of regions) {
      priorityDict[region] = Math.random();
      const cats = Object.keys(categories);
      for (const c of cats) {
        if (activeCategoryFilter.length && !activeCategoryFilter.includes(c)) {
          continue;
        }
        data.push({
          oblast_name: region,
          category: c,
          amount: Math.floor(Math.random() * 100),
        });
      }
    }
    return { data, priorityDict };
  }, []);
  const categoriesAsString = JSON.stringify(activeCategoryFilter);
  const { data, priorityDict } = useMemo(() => generateFakeData(JSON.parse(categoriesAsString)), [generateFakeData, categoriesAsString]);
  const groupedByOblast = groupBy(data, "oblast_name");

  const groupedByOblastWithTotal = map(groupedByOblast, (reqs, oblast_name) => {
    return { oblast_name: oblast_name, total: reqs.reduce((sum, request) => sum + request.amount, 0), requests: [...reqs] };
  });

  const descMap: { [id: string]: string } = {};
  const totalMap: { [id: string]: number } = {};

  const tableData = groupedByOblastWithTotal.map(({ oblast_name, total, requests }: any) => {
    var description = "";
    requests.forEach((req: any) => {
      description = `${description}\n${categories[req.category].name} (${categories[req.category].measure}): ${req.amount}`;
    });
    descMap[oblast_name] = description;
    totalMap[oblast_name] = total;
    return {
      name: oblast_name,
      value: activeCategoryFilter.length ? total : "",
      hidden: map(requests, (req) => {
        return {
          name: req.category,
          value: req.amount,
        };
      }),
    };
  });

  const maxAmount: number = Object.entries(totalMap).reduce((a, b) => a[1] > b[1] ? a : b)[1];

  const ukrAdm1WithMeta = ukrAdm1.map((r) => {
    const region = Object.assign({}, r);
    if (region.properties && r.properties) {
      region.properties = Object.assign({}, r.properties);
      region.properties.normalized_amount = priorityDict[r.properties.shapeName];
      if (activeCategoryFilter.length) {
        region.properties.amount = totalMap[r.properties.shapeName];
        region.properties.normalized_amount = region.properties.amount / maxAmount;
      }
      region.properties.description = descMap[r.properties.shapeName];
      region.properties.shapeName = t(r.properties.shapeName);
    }
    return region;
  });
  const sortedTableData = tableData.sort((a, b) => activeCategoryFilter.length ? b.value - a.value : priorityDict[b.name] - priorityDict[a.name]);

  const tableByOblast = (
    <CollapsibleTable
      rows={sortedTableData}
      renderRowData={(row) => {
        return {
          name: t(row.name.toString()).toString(),
          value: row.value,
          coordinates: undefined,
          hidden: row.hidden
            .map(({ name, value }) => ({
              name: `${categories[name].name} (${categories[name].measure})`,
              value: value,
            }))
            //.sort((a, b) => Number(b.value) - Number(a.value)),
        };
      }}
    />
  );

  return (
    <Layout header={<Header />}>
      <MapProvider>
        <Main
          aside={
            <Sidebar className="requests-sidebar">
              {tableByOblast}
            </Sidebar>
          }
        >
          <Map
            interactiveLayerIds={["state-fills"]}
            sourceWithLayer={<RegionsSourceWithLayers regionsOriginal={ukrAdm1} regionsWithMeta={ukrAdm1WithMeta} invertColors={false} />}
          />
        </Main>
      </MapProvider>
    </Layout>
  );
}
