import { ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import OutputIcon from "@mui/icons-material/Output";
import { FilterDropdownGroup } from "./FilterDropdown/FilterDropdownGroup";
import { Box } from "@mui/material";

import { useFilter } from "../contexts/filter";
import { useAuth } from "../contexts/auth";

import { useSidebarContext } from "../contexts/sidebar-context";
import { TimelineSlider } from "./TimelineSlider";

export interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { toggle } = useSidebarContext();
  const { logout } = useAuth();
  const { filters, activateFilter, toggleFilterItem } = useFilter();

  const { Dates: dateFilter, ...otherFilters } = filters;

  const dates = dateFilter?.filterItems.map(({ text }) => text) || [];

  return (
    <AppBar position="static" sx={{ paddingRight: 1, paddingLeft: 1, backgroundImage: null }}>
      <Toolbar sx={{ display: "flex" }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" mr={8}>
          Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "153px" }}>
          <FilterDropdownGroup
            filters={Object.values(otherFilters)}
            filterGroupOpenHandler={activateFilter}
            filterGroupUpdateHandler={toggleFilterItem}
          />
          {dates && <TimelineSlider dates={dates} />}
        </Box>
        {children}
        <OutputIcon onClick={logout} sx={{ width: 30, height: 30, marginLeft: "auto", cursor: "pointer" }} />
      </Toolbar>
    </AppBar>
  );
};
