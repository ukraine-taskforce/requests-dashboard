import {
  Button,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  ClickAwayListener,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FunctionComponent, useRef, useState, useMemo } from "react";
import { KeyboardArrowDown as ArrowDown, KeyboardArrowUp as ArrowUp, CheckCircle, CircleOutlined } from "@mui/icons-material";
import { FilterItem, FilterItemId, FilterName } from "../../contexts/filter";
import { ListWithSearch } from "./ListWithSearch";

type FilterDropdownProps = {
  hasSearch?: boolean;
  filterName: FilterName;
  filterItems: FilterItem[];
  /** If filter is a part of FilterDropdownGroup, this prop will be used to determine whether dropdown should be open, it will override internal state */
  filterActive?: boolean;
  singleValueFilter?: boolean;
  filterItemToggleHandler: (filterItemId: FilterItemId, overrideValue?: boolean) => void;
  filterGroupOpenHandler?: (filterGroupName: FilterName) => void;
};

export const FilterDropdown: FunctionComponent<FilterDropdownProps> = ({
  filterItems = [],
  filterName,
  hasSearch,
  filterActive,
  singleValueFilter,
  filterItemToggleHandler,
  filterGroupOpenHandler,
}) => {
  const { t } = useTranslation();
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [filterListVisible, setFilterListVisible] = useState(false);

  const { selectedFilterItems, unSelectedFilterItems } = useMemo(
    () =>
      filterItems.reduce(
        (acc, item) => {
          item.selected === true ? acc.selectedFilterItems.push(item) : acc.unSelectedFilterItems.push(item);
          return acc;
        },
        {
          selectedFilterItems: [] as FilterItem[],
          unSelectedFilterItems: [] as FilterItem[],
        }
      ),
    [filterItems]
  );

  const selectedFilterItemCount = selectedFilterItems.length;
  const isFilterOpen = filterActive !== undefined ? filterActive : filterListVisible;

  const clearAllFilters = () => filterItems.forEach(({ id }) => filterItemToggleHandler(id, false));
  const toggleFilterList = () => {
    filterGroupOpenHandler && filterGroupOpenHandler(filterName);
    setFilterListVisible((filterListVisible) => !filterListVisible);
  };

  const clickHandler = (id: FilterItemId, selected: boolean) => () => {
    if (selected) {
      filterItemToggleHandler(id, false);
    } else {
      filterItemToggleHandler(id);
    }
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

  const filterButtonLabel = singleValueFilter && selectedFilterItemCount === 1 ? selectedFilterItems[0].text : t("FILTER_" + filterName);
  const multipleFiltersChipLabel = selectedFilterItemCount === 0 ? t("all") : selectedFilterItemCount;

  return (
    <Box
      ref={filterRef}
      className={`filter-dropdown filter-dropdown-${filterName}`}
      style={{ width: "200px", position: "relative", marginRight: 8 }}
    >
      <Button
        sx={{
          borderRadius: "20px",
          textTransform: "unset",
          backgroundColor: "#fff",
          color: "#000",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        size="large"
        variant="contained"
        onClick={toggleFilterList}
        endIcon={isFilterOpen ? <ArrowUp /> : <ArrowDown />}
      >
        <Typography mr={1} variant="body2" component="p">
          {filterButtonLabel}
        </Typography>
        {!singleValueFilter && <Chip size="small" color="primary" label={multipleFiltersChipLabel} />}
      </Button>

      {isFilterOpen && (
        <>
          {hasSearch ? (
            <ListWithSearch
              searchableItems={unSelectedFilterItems}
              selectedFilterItems={selectedFilterItems}
              onSelectItem={clickHandler}
              checkboxListItemIcon={checkboxListItemIcon}
              toggleFilterList={toggleFilterList}
              clearAllFilters={clearAllFilters}
            />
          ) : (
            <ClickAwayListener onClickAway={toggleFilterList}>
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
                {!singleValueFilter && (
                  <ListItem sx={{ justifyContent: "center" }}>
                    <Button color="primary" onClick={clearAllFilters}>
                      {t("clear")}
                    </Button>
                  </ListItem>
                )}
                {filterItems.map(({ id, text, selected }) => (
                  <ListItem key={id}>
                    <ListItemButton onClick={clickHandler(id, selected)}>
                      <ListItemText>{text}</ListItemText>
                      {checkboxListItemIcon(selected)}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </ClickAwayListener>
          )}
        </>
      )}
    </Box>
  );
};
