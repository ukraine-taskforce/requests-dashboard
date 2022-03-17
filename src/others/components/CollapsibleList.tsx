import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";

export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
}

export const CollapsibleTable = ({ rows, ...tableProps }: CollapsibleTableProps) => {
  // TODO: implement proper infinite scroll
  const visibleRows = rows.slice(0, 30);
  return (
    // TODO: add rounded corners
    <TableContainer component={Paper} {...tableProps}>
      <Table aria-label="collapsible table">
        <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
          {visibleRows.map((row, index) => (
            // TODO: last item should not have border
            <CollapsibleListItem key={`${row.left}-${index}`} {...row} wrapperProps={{ paddingY: 2 }} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
