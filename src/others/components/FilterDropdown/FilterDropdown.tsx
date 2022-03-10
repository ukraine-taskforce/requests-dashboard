import { Button, Checkbox, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { KeyboardArrowDown as ArrowDown, KeyboardArrowUp as ArrowUp, CheckCircle, CircleOutlined } from "@mui/icons-material";

export type FilterDropdownItem = {
  id: string;
  selected: boolean;
  text: string;
};

type FilterDropdownProps = {
  filterName: string;
  filterItems: FilterDropdownItem[];
  /** If filter is a part of FilterDropdownGroup, this prop will be used to determine whether dropdown should be open, it will override internal state */
  filterActive?: boolean;
  filterItemToggleHandler: (filterItemId: string, overrideValue?: boolean) => void;
  filterGroupOpenHandler?: (filterGroupName: string) => void;
};

export const FilterDropdown: FunctionComponent<FilterDropdownProps> = ({
  filterItems = [],
  filterName,
  filterActive,
  filterItemToggleHandler,
  filterGroupOpenHandler,
}) => {
  const [filterListVisible, setFilterListVisible] = useState(false);

  const selectedFilterItemCount = filterItems.filter(({ selected }) => selected).length;
  const allFiltersSelected = filterItems.every(({ selected }) => selected);
  const isFilterOpen = filterActive !== undefined ? filterActive : filterListVisible;

  const selectAllFilters = () => filterItems.forEach(({ id }) => filterItemToggleHandler(id, true));
  const clearAllFilters = () => filterItems.forEach(({ id }) => filterItemToggleHandler(id, false));
  const toggleFilterList = () => {
    filterGroupOpenHandler && filterGroupOpenHandler(filterName);
    setFilterListVisible((filterListVisible) => !filterListVisible);
  };

  const checkboxListItemIcon = (value: boolean) => (
    <ListItemIcon
      sx={{
        minWidth: "0",
      }}
    >
      <Checkbox disableRipple={true} icon={<CircleOutlined />} checkedIcon={<CheckCircle color="primary" />} checked={value}></Checkbox>
    </ListItemIcon>
  );

  return (
    <div className="filter-dropdown" style={{ maxWidth: "300px", position: "relative", marginRight: 8 }}>
      <Button
        sx={{ borderRadius: "20px", textTransform: "unset", backgroundColor: "#fff", color: "#000" }}
        size="large"
        variant="contained"
        onClick={toggleFilterList}
        endIcon={isFilterOpen ? <ArrowUp /> : <ArrowDown />}
      >
        <Typography mr={1} variant="body2" component="p">
          {filterName}
        </Typography>
        <Chip size="small" color="primary" label={selectedFilterItemCount} />
      </Button>
      {isFilterOpen && (
        <List
          sx={{
            borderRadius: "24px",
            backgroundColor: "#fff",
            marginTop: "12px",
            maxHeight: "500px",
            overflow: "auto",
            position: "absolute",
            zIndex: 1000,
            minWidth: "300px",
            color: "#000",
          }}
        >
          <ListItem sx={{ justifyContent: "center" }}>
            <Button color="primary" onClick={clearAllFilters}>
              Clear
            </Button>
          </ListItem>
          <ListItem>
            <ListItemButton divider={true} onClick={selectAllFilters}>
              <ListItemText color="#000">All</ListItemText>
              {checkboxListItemIcon(allFiltersSelected)}
            </ListItemButton>
          </ListItem>
          {filterItems.map(({ id, text, selected }) => (
            <ListItem key={id}>
              <ListItemButton onClick={() => filterItemToggleHandler(id)}>
                <ListItemText>{text}</ListItemText>
                {checkboxListItemIcon(selected)}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
