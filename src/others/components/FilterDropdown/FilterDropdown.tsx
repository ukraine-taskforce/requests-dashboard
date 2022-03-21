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
import { FunctionComponent, useRef, useState } from "react";
import { KeyboardArrowDown as ArrowDown, KeyboardArrowUp as ArrowUp, CheckCircle, CircleOutlined } from "@mui/icons-material";
import { FilterItem } from "../../contexts/filter";

type FilterDropdownProps = {
  filterName: string;
  filterItems: FilterItem[];
  /** If filter is a part of FilterDropdownGroup, this prop will be used to determine whether dropdown should be open, it will override internal state */
  filterActive?: boolean;
  singleValueFilter?: boolean;
  filterItemToggleHandler: (filterItemId: string, overrideValue?: boolean) => void;
  filterGroupOpenHandler?: (filterGroupName: string) => void;
};

export const FilterDropdown: FunctionComponent<FilterDropdownProps> = ({
  filterItems = [],
  filterName,
  filterActive,
  singleValueFilter,
  filterItemToggleHandler,
  filterGroupOpenHandler,
}) => {
  const { t } = useTranslation();
  const filterRef = useRef<HTMLDivElement | null>(null);

  const [filterListVisible, setFilterListVisible] = useState(false);

  const selectedFilterItems = filterItems.filter(({ selected }) => selected);
  const selectedFilterItemCount = selectedFilterItems.length;
  const allFiltersSelected = filterItems.every(({ selected }) => !selected);
  const isFilterOpen = filterActive !== undefined ? filterActive : filterListVisible;

  const clearAllFilters = () => filterItems.forEach(({ id }) => filterItemToggleHandler(id, false));
  const toggleFilterList = () => {
    filterGroupOpenHandler && filterGroupOpenHandler(filterName);
    setFilterListVisible((filterListVisible) => !filterListVisible);
  };

  const clickHandler = (id: string, selected: boolean) => () => {
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
            <ListItem>
              <ListItemButton divider={true} onClick={clearAllFilters}>
                <ListItemText color="#000">{t("all")}</ListItemText>
                {checkboxListItemIcon(allFiltersSelected)}
              </ListItemButton>
            </ListItem>
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
    </Box>
  );
};
