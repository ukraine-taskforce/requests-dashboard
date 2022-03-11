import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CollapsibleListItem, ListItem } from "../components/CollapsibleListItem";

export interface CollapsibleTableProps extends TableContainerProps {
  rows: ListItem[];
}

export const CollapsibleTable = ({ rows, ...tabbleProps }: CollapsibleTableProps) => {
  return (
    <TableContainer component={Paper} {...tabbleProps}>
      <Table aria-label="collapsible table">
        <TableBody sx={{ "& > *": { paddingY: 2 } }} className="collapsible-table-body">
          {rows.map((row) => (
            <CollapsibleListItem key={row.name} {...row} wrapperProps={{ paddingY: 2 }} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
