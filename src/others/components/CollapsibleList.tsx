import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import InfiniteScroll from "react-infinite-scroll-component";

import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";

export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
  renderRowData: (row: ListItem) => ListItem;
}

export const CollapsibleTable = ({ rows, renderRowData, ...tableProps }: CollapsibleTableProps) => {
  const offset = 20;
  const getGirstBatch = (rows: ListItem[]) => rows.slice(0, offset);

  const [displayedRows, setDisplayedRows] = useState<ListItem[]>([]);
  const [openItemsIds, setOpenItemsIds] = useState<string[]>([]);

  const hasDisplayedAll = displayedRows.length === rows.length;

  const addMoreRows = () => {
    const nextRows = rows.slice(displayedRows.length, displayedRows.length + offset);
    setDisplayedRows([...displayedRows, ...nextRows]);
  };

  useEffect(() => {
    setDisplayedRows(getGirstBatch(rows));
  }, [rows]);

  const handleOpenItem = (id: string) => {
    const idsWithoutId = openItemsIds.filter((id) => ![id].includes(id));
    const idsWithId = [...openItemsIds, id];
    setOpenItemsIds(openItemsIds.includes(id) ? idsWithoutId : idsWithId);
  };

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
                  id={id}
                  key={id}
                  {...renderRowData(row)}
                  wrapperProps={{ paddingY: 2 }}
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
