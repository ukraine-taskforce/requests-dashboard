import { Box } from "@mui/material";
import { FilterDropdown, FilterDropdownItem } from "./FilterDropdown";

type FilterDropdownGroupProps = {
  filters: FilterDropdownGroupItem[];
  filterGroupOpenHandler: (filterName: string) => void;
  filterGroupUpdateHandler: (filterName: string, newFilterItems: FilterDropdownItem[]) => void;
};

export type FilterDropdownGroupItem = {
  active: boolean;
  filterName: string;
  filterItems: FilterDropdownItem[];
};

export const FilterDropdownGroup = ({ filters, filterGroupOpenHandler, filterGroupUpdateHandler }: FilterDropdownGroupProps) => {
  const filterItemToggleHandler = (currentFilterName: string) => (filterItemId: string, overrideValue?: boolean) => {
    const currentFilterGroup = filters.find(({ filterName }) => filterName === currentFilterName);
    if (currentFilterGroup) {
      const newFilterItems = currentFilterGroup.filterItems.map((newFilterItem) => {
        if (newFilterItem.id === filterItemId) {
          newFilterItem.selected = overrideValue !== undefined ? overrideValue : !newFilterItem.selected;
        }

        return newFilterItem;
      });

      filterGroupUpdateHandler(currentFilterName, newFilterItems);
    }
  };

  return (
    <Box sx={{ flexGrow: 8, display: "flex" }}>
      {filters.map(({ filterName, filterItems, active }) => (
        <FilterDropdown
          key={filterName}
          filterName={filterName}
          filterItems={filterItems}
          filterActive={active}
          filterGroupOpenHandler={filterGroupOpenHandler}
          filterItemToggleHandler={filterItemToggleHandler(filterName)}
        />
      ))}
    </Box>
  );
};
