import { useState, useEffect, ReactText } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";

export type ListItem = {
  name: ReactText;
  value: ReactText;
  hidden: Omit<ListItem, "hidden">[];
  wrapperProps?: BoxProps;
};

interface CollapsibleListItemProps extends ListItem {
  id: string;
  open: boolean;
  handleClick: () => void;
}

export const CollapsibleListItem = ({ id, name, value, hidden, open, handleClick, wrapperProps, ...rest }: CollapsibleListItemProps) => {
  const hiddenItemsCount = hidden.length;

  const offset = 20;
  const getGirstBatch = (rows: Omit<ListItem, "hidden">[]) => rows.slice(0, offset);

  const [displayedRows, setDisplayedRows] = useState<Omit<ListItem, "hidden">[]>([]);

  const hasDisplayedAll = displayedRows.length === hiddenItemsCount;

  const addMoreRows = () => {
    const nextRows = hidden.slice(displayedRows.length, displayedRows.length + offset);
    setDisplayedRows([...displayedRows, ...nextRows]);
  };

  useEffect(() => {
    setDisplayedRows(getGirstBatch(hidden));
  }, [hidden]);

  return (
    <>
      <TableRow className="table-row" sx={{ width: "100%", "& > *": { borderBottom: "unset", paddingY: 1 } }}>
        <TableCell className="arrow-icon" sx={{ padding: 0, width: 6 }}>
          <IconButton aria-label="expand row" size="small" onClick={handleClick}>
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
            {value}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          {/* TODO: open should be in lighter gray */}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <InfiniteScroll
                dataLength={displayedRows.length}
                next={() => addMoreRows()}
                hasMore={!hasDisplayedAll}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                // TODO: for overflowing tables add a "back to top" button
                // endMessage={<> </>}
              >
                <Table size="small" aria-label="tbd">
                  <TableBody>
                    {displayedRows.map(({ name, value }, index, arr) => {
                      const isLast = hiddenItemsCount - 1 === index;
                      return (
                        <TableRow key={`${name}-${index}`} sx={{ "& > *": { borderBottom: "unset", paddingX: 1 } }}>
                          <TableCell component="th" scope="row" sx={{ borderBottom: isLast ? "none" : undefined }}>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{ margin: 0 }}>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: isLast ? "none" : undefined }}>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{ margin: 0 }}>
                              {value}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </InfiniteScroll>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
