import { useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useFileDownloader } from "../contexts/file-downloader";
import { AidRequest } from "../contexts/api";

export interface FileDownloaderMenuProps {
  aidRequests: AidRequest[];
  hideTooltip: () => void;
}

export const FileDownloaderMenu = ({ aidRequests, hideTooltip }: FileDownloaderMenuProps) => {
  const { downloadAsJSON, downloadAsCSV } = useFileDownloader();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    hideTooltip();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const jsonDownloadHandler = () => {
    downloadAsJSON(aidRequests);
    handleClose();
  };

  const csvDownloadHandler = () => {
    downloadAsCSV(aidRequests);
    handleClose();
  };

  return (
    <div>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={handleClick}
      >
        <DownloadIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={jsonDownloadHandler}>JSON</MenuItem>
        <MenuItem onClick={csvDownloadHandler}>CSV</MenuItem>
      </Menu>
    </div>
  );
};
