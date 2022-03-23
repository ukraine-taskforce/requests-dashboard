import { useState, ReactText, useCallback, useEffect } from "react";
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

interface ListItemEnhanced extends ListItem {
  canZoomToCity: boolean;
  selectedCity?: Coordinates;
  toggleZoomCity: (coordinates: Coordinates) => void;
}

export const CollapsibleListItem = ({
  name,
  value,
  hidden,
  wrapperProps,
  coordinates,
  selectedCity,
  toggleZoomCity,
  canZoomToCity,
  ...rest
}: ListItemEnhanced) => {
  const [open, setOpen] = useState(false);
  const [showZoomIcon, setShowZoomIcon] = useState(false);
  const [zoomIcon, setZoomIcon] = useState<"zoomIn" | "zoomOut">("zoomIn");

  const hiddenItemsCount = hidden.length;

  const onTableRowMouseEnter = () => {
    if (canZoomToCity && coordinates) {
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
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
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
              <Table size="small" aria-label="tbd">
                <TableBody>
                  {hidden.map(({ name, value }, index) => {
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
