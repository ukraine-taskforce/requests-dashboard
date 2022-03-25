import { useState, useEffect, ReactText } from "react";
import { useTranslation } from "react-i18next";
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
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import { Coordinates } from "./CollapsibleList";

export type ListItem = {
  name: ReactText;
  value: ReactText;
  hidden: Omit<ListItem, "hidden">[];
  wrapperProps?: BoxProps;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

interface CollapsibleListItemProps extends ListItem {
  open: boolean;
  handleClick: () => void;
  selectedCity?: Coordinates;
  toggleZoomCity: (coordinates: Coordinates) => void;
}

export const CollapsibleListItem = ({
  name,
  value,
  hidden,
  open,
  handleClick,
  wrapperProps,
  coordinates,
  selectedCity,
  toggleZoomCity,
  ...rest
}: CollapsibleListItemProps) => {
  const { t } = useTranslation();
  const [showZoomIcon, setShowZoomIcon] = useState(false);
  const [zoomIcon, setZoomIcon] = useState<"zoomIn" | "zoomOut">("zoomIn");
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

  const onTableRowMouseEnter = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;

      setShowZoomIcon(true);

      if (selectedCity === undefined || (selectedCity?.latitude !== latitude && selectedCity?.longitude !== longitude)) {
        setZoomIcon("zoomIn");
      } else {
        setZoomIcon("zoomOut");
      }
    }
  };

  return (
    <>
      <TableRow
        className="table-row"
        sx={{ width: "100%", "& > *": { borderBottom: "unset", paddingY: 1 } }}
        onMouseEnter={onTableRowMouseEnter}
        onMouseLeave={() => setShowZoomIcon(false)}
      >
        <TableCell className="arrow-icon" sx={{ padding: 0, width: 6 }}>
          <IconButton aria-label="expand row" size="small" onClick={handleClick}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell className="cell-name" align="left" component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* TODO: that should be bold */}
            <Typography variant="subtitle1" gutterBottom component="div" sx={{ margin: 0 }}>
              {name}
            </Typography>
            {showZoomIcon && (
              <IconButton
                color="primary"
                aria-label="Zoom to city"
                component="span"
                onClick={() => toggleZoomCity(coordinates!)}
                sx={{ padding: "0 5px" }}
              >
                {zoomIcon === "zoomOut" ? <ZoomOutIcon /> : <ZoomInIcon />}
              </IconButton>
            )}
          </Box>
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
                loader={<Typography variant="body2">{t("loading")}...</Typography>}
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
