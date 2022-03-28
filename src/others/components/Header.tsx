import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import OutputIcon from "@mui/icons-material/Output";
import { FilterDropdownGroup } from "./FilterDropdown/FilterDropdownGroup";
import { Box, Tooltip } from "@mui/material";

import { useFilter } from "../contexts/filter";
import { useAuth } from "../contexts/auth";
import { AidRequest } from "../contexts/api";

import { useSidebarContext } from "../contexts/sidebar-context";
import { TimelineSlider } from "./TimelineSlider";
import { FileDownloaderMenu } from "./FileDownloaderMenu";
import { LanguageSelector } from "./LanguageSelector";

export interface HeaderProps {
  aidRequests: AidRequest[];
  children?: ReactNode;
}

export const Header = ({ aidRequests, children }: HeaderProps) => {
  const { t } = useTranslation();
  const { toggle } = useSidebarContext();
  const { logout } = useAuth();
  const { filters, activateFilter, toggleFilterItem } = useFilter();
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false);

  const { Dates: dateFilter, ...otherFilters } = filters;

  const dates = dateFilter?.filterItems.map(({ text }) => text) || [];

  return (
    <AppBar position="static" sx={{ paddingRight: 1, paddingLeft: 1, backgroundImage: null }}>
      <Toolbar sx={{ display: "flex" }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggle}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" mr={8}>
          {t("dashboard")}
        </Typography>
        <Box sx={{ display: "flex", flexGrow: "1", alignItems: "center", marginLeft: "50px" }}>
          <FilterDropdownGroup
            filters={Object.values(otherFilters)}
            filterGroupOpenHandler={activateFilter}
            filterGroupUpdateHandler={toggleFilterItem}
          />
          {dates && <TimelineSlider dates={dates} />}
        </Box>
        {children}
        <LanguageSelector />
        <Tooltip title={t("download_requests") as string} arrow open={showDownloadTooltip}
          disableHoverListener
          onMouseEnter={() => setShowDownloadTooltip(true)}
          onMouseLeave={() => setShowDownloadTooltip(false)}>
          <Box sx={{ justifySelf: "flex-end" }}>
            <FileDownloaderMenu aidRequests={aidRequests} hideTooltip={() => setShowDownloadTooltip(false)} />
          </Box>
        </Tooltip>
        <Tooltip title={t("logout") as string} arrow>
          <OutputIcon onClick={logout} sx={{ width: 30, height: 30, marginLeft: "auto", cursor: "pointer" }} />
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
