import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import InfiniteScroll from "react-infinite-scroll-component";

import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";

export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
  renderRowData: (row: ListItem) => ListItem;
  sortRight?: (a: number, b: number) => number;
}

export const CollapsibleTable = ({ rows, sortRight, renderRowData, ...tableProps }: CollapsibleTableProps) => {
  const offset = 20; // TODO: consider calculate it dynamically
  const firstBatch = rows.slice(0, offset);

  const [displayedRows, setDisplayedRows] = useState(firstBatch);

  const hasDisplayedAll = displayedRows.length === rows.length;

  const nextRows = rows.slice(displayedRows.length, displayedRows.length + offset);

  const addMoreRows = () => {
    const newRows = displayedRows.concat(nextRows);
    setDisplayedRows(newRows);
  };

  // TODO: type it properly - strings can be sorted too
  const sorted = sortRight ? displayedRows.sort((a, b) => sortRight(Number(a.value), Number(b.value))) : displayedRows;
  return (
    // TODO: add rounded corners
    <InfiniteScroll
      dataLength={displayedRows.length}
      next={() => addMoreRows()}
      hasMore={!hasDisplayedAll}
      loader={<h4>Loading...</h4>}
      scrollableTarget="scrollableDiv"
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <TableContainer component={Paper} {...tableProps}>
        <Table aria-label="collapsible table">
          <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
            {sorted.map((row, index) => (
              <CollapsibleListItem key={`${row.name}-${index}`} {...renderRowData(row)} wrapperProps={{ paddingY: 2 }} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};
