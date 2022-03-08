import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../medias/translations/en.json";
import uk from "../../medias/translations/uk.json";

const resources = {
  en: { translation: { ...en } },
  uk: { translation: { ...uk } },
};

export type AvailableLang = "en" | "uk";

export const availableLangs = Object.keys(resources).sort();

function getInitLang() {
  const browserLang = navigator.language.split("-")[0].toLowerCase();
  return availableLangs.includes(browserLang) ? browserLang : "en";
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getInitLang(),
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
