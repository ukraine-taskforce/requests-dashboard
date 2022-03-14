import { ID } from "../../contexts/api";
import { Filter } from "../../contexts/filter";
import { FilterDropdown } from "./FilterDropdown";

type FilterDropdownGroupProps = {
  filters: Filter[];
  filterGroupOpenHandler: (filterName: string) => void;
  filterGroupUpdateHandler: (filterName: string, filterItemId: ID, value?: boolean) => void;
};

export const FilterDropdownGroup = ({ filters, filterGroupOpenHandler, filterGroupUpdateHandler }: FilterDropdownGroupProps) => {
  const filterItemToggleHandler = (currentFilterName: string) => (filterItemId: ID, overrideValue?: boolean) => {
    filterGroupUpdateHandler(currentFilterName, filterItemId, overrideValue);
  };

  return (
    <div className="filter-dropdown-group" style={{ display: "flex" }}>
      {filters.map(({ filterName, filterItems, active, singleValueFilter }) => (
        <FilterDropdown
          key={filterName}
          filterName={filterName}
          filterItems={filterItems}
          filterActive={active}
          singleValueFilter={singleValueFilter}
          filterGroupOpenHandler={filterGroupOpenHandler}
          filterItemToggleHandler={filterItemToggleHandler(filterName)}
        />
      ))}
    </div>
  );
};
