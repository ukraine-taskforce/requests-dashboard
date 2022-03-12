import { useState, ReactText } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export type ListItem = {
  name: string;
  total: ReactText;
  hidden: Omit<ListItem, "hidden">[];
  wrapperProps?: BoxProps;
};

export const CollapsibleListItem = ({ name, total, hidden, wrapperProps, ...rest }: ListItem) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className="table-row" sx={{ width: "100%", "& > *": { borderBottom: "unset", paddingY: 1 } }}>
        <TableCell className="arrow-icon" sx={{ padding: 0, width: 6 }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell className="cell-name" align="left" component="th" scope="row">
          {/* TODO: that should be bold */}
          <Typography variant="subtitle1" gutterBottom component="div" sx={{ margin: 0 }}>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <Typography variant="subtitle1" gutterBottom component="div" sx={{ margin: 0 }}>
            {total}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          {/* TODO: open should be in lighter gray */}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="tbd">
                <TableBody>
                  {hidden.map(({ name, total }) => (
                    <TableRow key={name} sx={{ "& > *": { borderBottom: "unset", paddingX: 1 } }}>
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle2" gutterBottom component="div" sx={{ margin: 0 }}>
                          {name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" gutterBottom component="div" sx={{ margin: 0 }}>
                          {total}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
