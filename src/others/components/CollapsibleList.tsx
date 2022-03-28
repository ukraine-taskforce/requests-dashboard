import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMap } from "react-map-gl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InfiniteScroll from "react-infinite-scroll-component";

import { INITIAL_UKRAINE_CENTER_VIEW } from '../constants';
import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";
export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
  renderRowData: (row: ListItem) => ListItem;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const CollapsibleTable = ({ rows, renderRowData, ...tableProps }: CollapsibleTableProps) => {
  const { t } = useTranslation();
  const offset = 20;
  const getGirstBatch = (rows: ListItem[]) => rows.slice(0, offset);

  const [displayedRows, setDisplayedRows] = useState<ListItem[]>([]);
  const [openItemsIds, setOpenItemsIds] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<Coordinates | undefined>(undefined);
  const map = useMap();

  const hasDisplayedAll = displayedRows.length === rows.length;

  const addMoreRows = () => {
    const nextRows = rows.slice(displayedRows.length, displayedRows.length + offset);
    setDisplayedRows([...displayedRows, ...nextRows]);
  };

  const toggleZoomCity = (coordinates: Coordinates) => {
    const { latitude, longitude } = coordinates;
    if (selectedCity?.latitude === latitude && selectedCity?.longitude === longitude) {
      setSelectedCity(undefined);
    } else {
      setSelectedCity(coordinates);
    }
  };

  useEffect(() => {
    setDisplayedRows(getGirstBatch(rows));
  }, [rows]);

  const handleOpenItem = (id: string) => {
    const idsWithoutId = openItemsIds.filter((openId) => openId !== id);
    const idsWithId = [...openItemsIds, id];
    setOpenItemsIds(openItemsIds.includes(id) ? idsWithoutId : idsWithId);
  };

  useEffect(() => {
    if (selectedCity) {
      const { latitude, longitude } = selectedCity;
      map.default?.flyTo({ center: [longitude, latitude], duration: 2000, zoom: 10 });
    } else {
      // Reset to initial map view
      const { latitude: initialLatitude, longitude: initialLongitude, zoom: initialZoom } = INITIAL_UKRAINE_CENTER_VIEW;
      map.default?.flyTo({ center: [initialLongitude, initialLatitude], duration: 2000, zoom: initialZoom });
    }
  }, [selectedCity, map]);

  return (
    <InfiniteScroll
      dataLength={displayedRows.length}
      next={() => addMoreRows()}
      hasMore={!hasDisplayedAll}
      loader={
        <Typography variant="body2" noWrap>
          {t("loading")}...
        </Typography>
      }
      scrollableTarget="scrollableDiv"
      // TODO: for overflowing tables add a "back to top" button
      // endMessage={<> </>}
    >
      <TableContainer component={Paper} {...tableProps}>
        <Table aria-label="collapsible table">
          <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
            {displayedRows.map((row, index) => {
              // TODO: Propagate proprer id here.
              const id = `${row.name}`;
              return (
                <CollapsibleListItem
                  key={id}
                  {...renderRowData(row)}
                  wrapperProps={{ paddingY: 2 }}
                  selectedCity={selectedCity}
                  toggleZoomCity={toggleZoomCity}
                  open={openItemsIds.includes(id)}
                  handleClick={() => handleOpenItem(id)}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};
