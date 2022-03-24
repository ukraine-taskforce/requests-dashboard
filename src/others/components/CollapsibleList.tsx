import { useState, useEffect } from "react";
import { useMap } from "react-map-gl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import InfiniteScroll from "react-infinite-scroll-component";

import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";
export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
  renderRowData: (row: ListItem) => ListItem;
  canZoomToCity: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const CollapsibleTable = ({ rows, renderRowData, canZoomToCity, ...tableProps }: CollapsibleTableProps) => {
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
    const idsWithoutId = openItemsIds.filter((id) => ![id].includes(id));
    const idsWithId = [...openItemsIds, id];
    setOpenItemsIds(openItemsIds.includes(id) ? idsWithoutId : idsWithId);
  };

  useEffect(() => {
    if (selectedCity) {
      const { latitude, longitude } = selectedCity;
      map.default?.flyTo({ center: [longitude, latitude], duration: 2000, zoom: 10 });
    } else {
      // Reset to initial map view
      map.default?.flyTo({ center: [30.5240501, 48.4501071], duration: 2000, zoom: 5 });
    }
  }, [selectedCity, map]);

  return (
    <InfiniteScroll
      dataLength={displayedRows.length}
      next={() => addMoreRows()}
      hasMore={!hasDisplayedAll}
      loader={<h4>Loading...</h4>}
      scrollableTarget="scrollableDiv"
      // TODO: for overflowing tables add a "back to top" button
      // endMessage={<> </>}
    >
      <TableContainer component={Paper} {...tableProps}>
        <Table aria-label="collapsible table">
          <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
            {displayedRows.map((row, index) => {
              const id = `${row.name}-${index}`;
              return (
                <CollapsibleListItem
                  key={id}
                  {...renderRowData(row)}
                  wrapperProps={{ paddingY: 2 }}
                  selectedCity={selectedCity}
                  toggleZoomCity={toggleZoomCity}
                  canZoomToCity={canZoomToCity}
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
