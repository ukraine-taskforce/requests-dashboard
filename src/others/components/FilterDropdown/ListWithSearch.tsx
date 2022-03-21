import { FixedSizeList, areEqual } from "react-window";
import { Button, ListItem, ListItemButton, ListItemText, ClickAwayListener, Divider, useAutocomplete, Typography } from "@mui/material";
import { FunctionComponent, memo, forwardRef } from "react";
import SearchIcon from '@mui/icons-material/Search';

import { FilterItem } from "../../contexts/filter";
import { ID } from "../../contexts/api";

import styles from "./ListWithSearch.module.css";

type ListWithSearchProps = {
  selectedFilterItemCount: number;
  selectedFilterItems: FilterItem[];
  searchableItems: FilterItem[];
  onSelectItem: (id: ID, selected: boolean) => () => void;
  checkboxListItemIcon: (value: boolean) => React.ReactNode;
  toggleFilterList: () => void;
  clearAllFilters: () => void;
};

function itemKey(index: number, data: FilterItem[]) {
  const item = data[index];
  return `${item.id}-${index}`;
}

export const ListWithSearch: FunctionComponent<ListWithSearchProps> = ({
  searchableItems,
  selectedFilterItemCount,
  selectedFilterItems,
  onSelectItem,
  checkboxListItemIcon,
  toggleFilterList,
  clearAllFilters,
}) => {
  const { getRootProps, getInputProps, getListboxProps, groupedOptions } =
    useAutocomplete<FilterItem>({
      id: "search_filters_list",
      options: searchableItems,
      getOptionLabel: (option) => option.text,
      open: true,
    });

  const Row = memo((props: { data: FilterItem[], index: number, style: object}) => {
    const { data, index, style } = props;
    const { id, selected, text} = data[index];

    return (
      <ListItem key={id} style={style}>
        <ListItemButton onClick={onSelectItem(id, selected)} sx={{ paddingRight: "8px" }}>
          <ListItemText>{text}</ListItemText>
          {checkboxListItemIcon(selected)}
        </ListItemButton>
      </ListItem>
    )
  }, areEqual);

  const InnerElementType = forwardRef<HTMLUListElement>((props, ref) => {
    return <ul ref={ref} {...props} {...getListboxProps()} />;
  });

  return (
    <ClickAwayListener onClickAway={toggleFilterList}>
      <div className={styles.listContainer}>
        <div className={styles.clearButtonContainer}>
          <Button variant="text" size="large" onClick={clearAllFilters}>Clear</Button>
        </div>

        <div {...getRootProps()} className={styles.searchContainer}>
          <SearchIcon sx={{ color: "000" }} />
          <input
            {...getInputProps()}
            placeholder="Search your city"
            className={styles.searchInput}
          />
        </div>

        {selectedFilterItemCount > 0 ? (
          <>
            {selectedFilterItems.map(({ id, text, selected }, index) => (
              <ListItem key={`${id}-${index}`}>
                <ListItemButton sx={{ padding: "0 16px" }} onClick={onSelectItem(id, selected)}>
                  <ListItemText>{text}</ListItemText>
                  {checkboxListItemIcon(selected)}
                </ListItemButton>
              </ListItem>
            ))}
            <Divider
              sx={{
                borderColor: "#f3f3f3",
                marginBottom: "10px",
              }}
            />
          </>
        ) : null}

        {groupedOptions.length === 0 ? (
          <Typography variant="body2" component="p" align="center" className={styles.noResults}>
            No matching results
          </Typography>
        ): (
          <FixedSizeList
            innerElementType={InnerElementType}
            overscanCount={5}
            height={300}
            itemCount={groupedOptions.length}
            itemData={groupedOptions as FilterItem[]}
            itemSize={55}
            itemKey={itemKey}
            width={300}>
            {Row}
          </FixedSizeList>
        )}
      </div>
    </ClickAwayListener>
  );
};
