import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./LanguageSelector.module.css";

import { AvailableLang, availableLangs } from "../contexts/i18n";
import { ImgFlagUk } from "../../medias/images/UGT_Asset_FlagSelector_UKR";
import { ImgFlagEn } from "../../medias/images/UGT_Asset_FlagSelector_ENG";
import { ImgDropdown } from "../../medias/images/UGT_Asset_UI_Dropdown";

export interface LanguageSelectorProps {}

const Flag = ({ lang, className }: { lang: AvailableLang; className?: string }) => {
  if (lang === "uk") {
    return <ImgFlagUk alt="ukrainian" className={className} />;
  }

  return <ImgFlagEn alt="english" className={className} />;
};

export const LanguageSelector: React.FunctionComponent<LanguageSelectorProps> = () => {
  const { i18n } = useTranslation();

  const [expanded, setExpanded] = React.useState(false);

  const currentLang = i18n.language as AvailableLang;

  const selectLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setExpanded(false);
  };

  return (
    <div className={styles.selector} onClick={() => setExpanded(!expanded)}>
      <div>
        <Flag className={styles.flagIcon} lang={currentLang} />
        <span>{currentLang.toUpperCase()}</span>
        <ImgDropdown className={styles.dropdownIcon} alt="" />
      </div>
      {expanded && (
        <div className={styles.dropdown}>
          {availableLangs
            .filter((lang) => lang !== currentLang)
            .map((lang) => {
              return (
                <div className={styles.dropdownItem} onClick={() => selectLang(lang)}>
                  <Flag className={styles.flagIcon} lang={lang as AvailableLang} />
                  <span>{lang.toUpperCase()}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
