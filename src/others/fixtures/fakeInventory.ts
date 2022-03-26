import { Supply } from "../contexts/api";

export type Warehouse = {
  id: number;
  name: string;
  city_id: number;
  contacts: string;
};

export type StockItem = {
  category_id: string;
  warehouse_id: number;
  city_id: number;
  date: string;
  amount: number;
};

export const GetFakeWarehouses = (): { [id: number]: Warehouse } => {
  const dict: { [id: number]: Warehouse } = {};
  for (var i = 0; i < 1000; i = i + 1) {
    dict[i] = {
      id: i,
      name: `Warehouse ${i}`,
      city_id: i % 45 + 1,
      contacts: `We are located ${i+1}km west of the city.\nPhone number is: (${i})-${i}-${i}.`,
    };
  }
  return dict;
};

export const GetFakeStock = (categories: Supply[], warehouseDict: { [id: number]: Warehouse }): StockItem[] => {
  if (categories.length === 0) return [];
  const dates: string[] = ['2022.03.01', '2022.03.02', '2022.03.03', '2022.03.04', '2022.03.05', '2022.03.06'];
  const data: StockItem[] = [];
  const numWarehouses = Object.keys(warehouseDict).length;
  var rnd = 0;
  var xxx = 0;
  for (const date of dates) {
    xxx = xxx + 1;
    for (const category of categories) {
      xxx = xxx + 1;
      for (var i = 0; i < numWarehouses; i = i + 1) {
        data.push({
          category_id: category.id,
          warehouse_id: i,
          city_id: warehouseDict[i].city_id,
          date: date,
          amount: (rnd * 10007) % 13 + Math.abs(warehouseDict[i].city_id - (xxx % 45)),
        });
        rnd = rnd + 1;
      }
    }
  }
  return data;
};

