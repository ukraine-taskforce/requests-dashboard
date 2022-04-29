import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebarContext } from "../../contexts/sidebar-context";
import styles from "./Header.module.css";
import { ImgInfo } from "../../../media/images/UGT_Asset_UI_Info";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { Spacer } from "../Spacer";
import { Text } from "../Text";
import { ImgBrand } from "../../../media/images/UGT_Asset_Brand";
import { ImgShare } from "../../../media/images/UGT_Asset_UI_Share";
import { isShareSupported, useShare } from "../../helpers/share";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../LanguageSelector";
import { Box } from "@mui/material";
import { useFilter } from "../../contexts/filter";
import { FilterDropdownGroup } from "../FilterDropdown/FilterDropdownGroup";

export const Header = () => {
  const { toggle } = useSidebarContext();
  const [displayModal, setDisplayModal] = useState(false);
  const { share } = useShare();
  const { t } = useTranslation();
  const { filters, activateFilter, toggleFilterItem } = useFilter();
  const { ...otherFilters } = filters;

  return (
    <AppBar position="static" sx={{ paddingRight: 1, paddingLeft: 1, backgroundImage: null }}>
      <Toolbar sx={{ display: "flex" }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggle}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" mr={8}>
          McKinsey
        </Typography>

        <div className={styles.infoIcon} onClick={() => setDisplayModal(true)}>
          <ImgInfo alt="" color="white" />
        </div>

        <Box sx={{ display: "flex", flexGrow: "1", alignItems: "center", marginLeft: "50px" }}>
          <FilterDropdownGroup
            filters={Object.values(otherFilters)}
            filterGroupOpenHandler={activateFilter}
            filterGroupUpdateHandler={toggleFilterItem}
          />
        </Box>
        <LanguageSelector />
      </Toolbar>
      {/* About modal */}
      <Modal show={displayModal} handleClose={() => setDisplayModal(false)}>
        <Spacer size={50} />
        <div style={{ display: "flex" }}>
          <Spacer flex={1} />
          <ImgBrand className={styles.ugtLogo} alt="UGT Logo" />
          <Spacer flex={1} />
        </div>
        <Spacer size={20} />
        <h1 style={{ textAlign: "center", color: "var(--color-secondary)" }}>{t("about_dialog_head")}</h1>
        <Spacer size={22} />
        <div style={{textAlign: "center", color: "black" }}><Text>{t("about_dialog_detailed")}</Text></div>
        <Spacer size={22} />
        {isShareSupported() && (
            <Button
                fullWidth
                centered
                variant="highlight"
                onClick={() => {
                  share();
                }}
                trailingIcon={
                  <ImgShare style={{ height: "15px" }} fill="var(--color-white)" alt={t("share")} />
                }
            >
              {t("share")}
            </Button>
        )}
        <div className={styles.contactLabel}
             onClick={(e) => {
                 const w = window.open('','_blank');
                   if(!w) return;
                   w.location.href = "mailto:ugt@ukraineglobaltaskforce.com";
                   w.focus();
                   e.preventDefault();
             }}
             >
            {t("contact_us_at")} <span>ugt@ukraineglobaltaskforce.com</span>
        </div>
      </Modal>

    </AppBar>
  );
};
