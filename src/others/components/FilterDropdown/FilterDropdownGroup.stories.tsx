import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { FilterDropdownItem } from "./FilterDropdown";

import { FilterDropdownGroup as FilterDropdownGroupComponent, FilterDropdownGroupItem } from "./FilterDropdownGroup";

export default {
  title: "FilterDropdownGroup",
  component: FilterDropdownGroupComponent,
  decorators: [
    (Story) => (
      <div style={{ width: "800px", height: "600px", backgroundColor: "black", padding: "20px" }}>
        <Story></Story>
      </div>
    ),
  ],
} as ComponentMeta<typeof FilterDropdownGroupComponent>;

const getFilterItems = (itemCount: number) => {
  return Array(itemCount)
    .fill(1)
    .map((item, index) => ({ id: `filter-item-${index + 1}`, text: `Filter Item ${index + 1}`, selected: false }));
};

export const FilterDropdownGroupBasic: ComponentStory<typeof FilterDropdownGroupComponent> = () => {
  const filterData = ["Categories", "Cities"].map(
    (category, i): FilterDropdownGroupItem => ({ filterName: category, filterItems: getFilterItems(5 * (i + 1)), active: false })
  );

  const [filters, setFilters] = useState(filterData);

  const filterOpenHandler = (filterName: string) =>
    setFilters((filters) =>
      filters.map((filterItem) => {
        if (filterItem.filterName === filterName && !filterItem.active) {
          filterItem.active = true;
        } else {
          filterItem.active = false;
        }

        return filterItem;
      })
    );

  const filterGroupUpdateHandler = (filterGroupName: string, filterGroupItems: FilterDropdownItem[]) => {
    setFilters((filters) =>
      filters.map((filterGroup) => {
        if (filterGroup.filterName === filterGroupName) {
          filterGroup.filterItems = filterGroupItems;
        }

        return filterGroup;
      })
    );
  };

  return (
    <FilterDropdownGroupComponent
      filters={filters}
      filterGroupOpenHandler={filterOpenHandler}
      filterGroupUpdateHandler={filterGroupUpdateHandler}
    />
  );
};
