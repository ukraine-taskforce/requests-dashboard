import { useTranslation } from "react-i18next";
import { List, ListItem, ListItemButton, ListItemText, ClickAwayListener, Divider, useAutocomplete } from "@mui/material";
import { FunctionComponent, useRef, useState } from "react";
import { KeyboardArrowDown as ArrowDown, KeyboardArrowUp as ArrowUp, CheckCircle, CircleOutlined } from "@mui/icons-material";
import { FilterItem } from "../../contexts/filter";
import { ID } from "../../contexts/api";

/**
 * TODOs:
 *
 * 1. Add "Clear" button at top
 * 2. Add search icon to input
 * 3. Fix top button label and category count
 * 4. Move cities as 1st filter dropdown
 * 5. Address any inline TODOs in the code
 */

type FilterDropdownProps = {
  selectedFilterItemCount: number;
  selectedFilterItems: FilterItem[];
  filterItems: FilterItem[];
  // TODO finish typings
  clickHandler: any;
  checkboxListItemIcon: any;
  toggleFilterList: any;
};

export const ListWithSearch: FunctionComponent<FilterDropdownProps> = ({
  filterItems,
  selectedFilterItemCount,
  selectedFilterItems,
  clickHandler,
  checkboxListItemIcon,
  toggleFilterList,
}) => {
  const { getRootProps, getInputLabelProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, inputValue } =
    useAutocomplete<FilterItem>({
      id: "use-autocomplete-demo",
      options: filterItems,
      getOptionLabel: (option) => option.text,
      open: true,
    });

  return (
    <ClickAwayListener onClickAway={toggleFilterList}>
      <div
        style={{
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
        <div>
          <div {...getRootProps()}>
            <input
              {...getInputProps()}
              placeholder="Search your city"
              style={{
                height: "55px",
                borderRadius: "25px",
                width: "270px",
                padding: "20px",
                margin: "20px 20px 0 20px",
                borderWidth: "1px",
              }}
            />
          </div>

          {selectedFilterItemCount > 0 ? (
            <>
              {selectedFilterItems.map(({ id, text, selected }, index) => (
                <ListItem key={`${id}-${index}`}>
                  <ListItemButton onClick={clickHandler(id, selected)}>
                    <ListItemText>{text}</ListItemText>
                    {checkboxListItemIcon(selected)}
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider
                sx={{
                  borderColor: "#f3f3f3",
                }}
              />
            </>
          ) : null}

          {groupedOptions.length > 0 ? (
            <List {...getListboxProps()}>
              {/* TODO fix TS */}
              {/* @ts-ignore */}
              {groupedOptions.map(({ id, text, selected }, index) => (
                <ListItem key={id}>
                  <ListItemButton onClick={clickHandler(id, selected)}>
                    <ListItemText>{text}</ListItemText>
                    {checkboxListItemIcon(selected)}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : null}
        </div>
      </div>
    </ClickAwayListener>
  );
};
