import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { FilterItemId } from "../../contexts/filter";

import { FilterDropdown as FilterDropdownComponent } from "./FilterDropdown";

export default {
  title: "FilterDropdown",
  component: FilterDropdownComponent,
  decorators: [
    (Story) => (
      <div style={{ width: "800px", height: "600px", backgroundColor: "black", padding: "20px" }}>
        <Story></Story>
      </div>
    ),
  ],
} as ComponentMeta<typeof FilterDropdownComponent>;

const getFilterItems = (itemCount: number) => {
  return Array(itemCount)
    .fill(1)
    .map((item, index) => ({ id: `filter-item-${index + 1}`, text: `Filter Item ${index + 1}`, selected: false }));
};

const filterDropdownBasic =
  (filterItemCount: number): ComponentStory<typeof FilterDropdownComponent> =>
  () => {
    const [filterItems, setFilterItems] = useState(getFilterItems(filterItemCount));

    const filterItemToggleHandler = (filterItemId: FilterItemId, overrideValue?: boolean) =>
      setFilterItems((currentFilterItems) =>
        currentFilterItems.map((filterItem) => {
          if (filterItem.id === filterItemId) {
            filterItem.selected = overrideValue !== undefined ? overrideValue : !filterItem.selected;
          }

          return filterItem;
        })
      );

    return <FilterDropdownComponent filterName="Categories" filterItems={filterItems} filterItemToggleHandler={filterItemToggleHandler} />;
  };

export const FilterDropdownLong = filterDropdownBasic(20);
export const FilterDropdownShort = filterDropdownBasic(5);
