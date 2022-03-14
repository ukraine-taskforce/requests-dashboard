import { Button, Checkbox, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { KeyboardArrowDown as ArrowDown, KeyboardArrowUp as ArrowUp, CheckCircle, CircleOutlined } from "@mui/icons-material";
import { FilterItem } from "../../contexts/filter";
import { ID } from "../../contexts/api";

type FilterDropdownProps = {
  filterName: string;
  filterItems: FilterItem[];
  /** If filter is a part of FilterDropdownGroup, this prop will be used to determine whether dropdown should be open, it will override internal state */
  filterActive?: boolean;
  singleValueFilter?: boolean;
  filterItemToggleHandler: (filterItemId: ID, overrideValue?: boolean) => void;
  filterGroupOpenHandler?: (filterGroupName: string) => void;
};

export const FilterDropdown: FunctionComponent<FilterDropdownProps> = ({
  filterItems = [],
  filterName,
  filterActive,
  filterItemToggleHandler,
  filterGroupOpenHandler,
}) => {
  const filterRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const clickEventHandler = (e: Event) => {
  //     if (filterRef.current && !filterRef.current.contains(e.target as Element)) {
  //       toggleFilterList();
  //     }
  //   };

  //   document.addEventListener("click", clickEventHandler);

  //   return () => {
  //     document.removeEventListener("click", clickEventHandler);
  //   };
  // }, []);

  const [filterListVisible, setFilterListVisible] = useState(false);

  const selectedFilterItemCount = filterItems.filter(({ selected }) => selected).length;
  const allFiltersSelected = filterItems.every(({ selected }) => !selected);
  const isFilterOpen = filterActive !== undefined ? filterActive : filterListVisible;

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
      <Checkbox
        disableRipple={true}
        icon={<CircleOutlined color="info" />}
        checkedIcon={<CheckCircle color="primary" />}
        checked={value}
      ></Checkbox>
    </ListItemIcon>
  );

  return (
    <div
      ref={filterRef}
      className={`filter-dropdown filter-dropdown-${filterName}`}
      style={{ maxWidth: "300px", position: "relative", marginRight: 8 }}
    >
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
            marginTop: "16px",
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
            <ListItemButton divider={true} onClick={clearAllFilters}>
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
