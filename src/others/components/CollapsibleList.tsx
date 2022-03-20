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

  const hasDisplayedAll = displayedRows.length === rows.length;

  const addMoreRows = () => {
    const nextRows = rows.slice(displayedRows.length, displayedRows.length + offset);
    setDisplayedRows([...displayedRows, ...nextRows]);
  };

  useEffect(() => {
    setDisplayedRows(getGirstBatch(rows));
  }, [rows]);

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
            {displayedRows.map((row, index) => (
              <CollapsibleListItem key={`${row.name}-${index}`} {...renderRowData(row)} wrapperProps={{ paddingY: 2 }} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};
