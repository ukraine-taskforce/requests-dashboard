import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebarContext } from "../../contexts/sidebar-context";

export const Header = () => {
  const { toggle } = useSidebarContext();

  return (
    <AppBar position="static" sx={{ paddingRight: 1, paddingLeft: 1, backgroundImage: null }}>
      <Toolbar sx={{ display: "flex" }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggle}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" mr={8}>
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
