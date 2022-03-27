import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./LanguageSelector.module.css";

import { AvailableLang, availableLangs, storeLanguage } from "../contexts/i18n";
import { ImgFlagUk } from "../../media/images/UGT_Asset_FlagSelector_UKR";
import { ImgFlagEn } from "../../media/images/UGT_Asset_FlagSelector_ENG";
import { ImgDropdown } from "../../media/images/UGT_Asset_UI_Dropdown";

export interface LanguageSelectorProps { }

const Flag = ({ lang, className }: { lang: AvailableLang; className?: string }) => {
  if (lang === "uk") {
    return (
      <>
        <ImgFlagUk alt="ukrainian" className={className} />
        <span>UA</span>
      </>
    );
  }

  return (
    <>
      <ImgFlagEn alt="english" className={className} />
      <span>EN</span>
    </>
  );
};

function useOutsideClick(ref: React.RefObject<HTMLElement>, onClick: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, onClick]);
}

export const LanguageSelector: FunctionComponent<LanguageSelectorProps> = () => {
  const { i18n } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setExpanded(false));

  const currentLang = i18n.language as AvailableLang;

  const selectLang = (lang: string) => {
    i18n.changeLanguage(lang);
    storeLanguage(lang as AvailableLang);
    setExpanded(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }} onClick={() => setExpanded(!expanded)}>
      <div style={{
        cursor: "pointer",
        borderRadius: "20px",
        width: "90px",
        padding: "10px 15px",
        backgroundColor: "#fff",
        color: "#000"
      }}>
        <Flag className={styles.flagIcon} lang={currentLang} />
        <ImgDropdown className={styles.dropdownIcon} alt="" />
      </div>
      {expanded && (
        <div style={{
          cursor: "pointer",
          borderRadius: "20px",
          width: "90px",
          padding: "10px 15px",
          backgroundColor: "#fff",
          color: "#000",
          position: "absolute",
          marginTop: 5,
          left: 0,
          zIndex: 1
        }}>
          {availableLangs
            .filter((lang) => lang !== currentLang)
            .map((lang) => {
              return (
                <div key={lang} style={{ position: "relative" }} onClick={() => selectLang(lang)}>
                  <Flag className={styles.flagIcon} lang={lang as AvailableLang} />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
