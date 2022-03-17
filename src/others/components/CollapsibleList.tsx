import { ReactText } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";

export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
  sortRight?: (a: number, b: number) => number;
}

export const CollapsibleTable = ({ rows, sortRight, ...tableProps }: CollapsibleTableProps) => {
  // TODO: implement proper infinite scroll
  const visibleRows = rows.slice(0, 30);
  // TODO: type it properly - strings can be sorted too
  const sorted = sortRight ? visibleRows.sort((a, b) => sortRight(Number(a.right), Number(b.right))) : visibleRows;
  return (
    // TODO: add rounded corners
    <TableContainer component={Paper} {...tableProps}>
      <Table aria-label="collapsible table">
        <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
          {sorted.map((row, index) => (
            // TODO: last item should not have border
            <CollapsibleListItem key={`${row.left}-${index}`} {...row} wrapperProps={{ paddingY: 2 }} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
