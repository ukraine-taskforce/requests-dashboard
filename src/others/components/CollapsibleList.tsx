import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";

export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
}

export const CollapsibleTable = ({ rows, ...tabbleProps }: CollapsibleTableProps) => {
  return (
    // TODO: add rounded corners
    <TableContainer component={Paper} {...tabbleProps}>
      <Table aria-label="collapsible table">
        <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
          {rows.map((row) => (
            // TODO: last item should not have border
            <CollapsibleListItem key={row.name} {...row} wrapperProps={{ paddingY: 2 }} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
