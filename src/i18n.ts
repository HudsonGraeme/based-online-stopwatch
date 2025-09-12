import i18n from "i18next";
import localforage from "localforage";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import ru from "./locales/ru.json";
import ar from "./locales/ar.json";
import hi from "./locales/hi.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
  it: {
    translation: it,
  },
  pt: {
    translation: pt,
  },
  zh: {
    translation: zh,
  },
  ja: {
    translation: ja,
  },
  ko: {
    translation: ko,
  },
  ru: {
    translation: ru,
  },
  ar: {
    translation: ar,
  },
  hi: {
    translation: hi,
  },
};

const detectLanguage = () => {
  const browserLang = navigator.language.split("-")[0];
  const supportedLanguages = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "zh",
    "ja",
    "ko",
    "ru",
    "ar",
    "hi",
  ];
  return supportedLanguages.includes(browserLang) ? browserLang : "en";
};

const initI18n = async () => {
  let savedLanguage = "en";

  try {
    const stored = await localforage.getItem("language");
    if (stored && typeof stored === "string") {
      savedLanguage = stored;
    }
  } catch (error) {
    console.warn("Could not load saved language preference:", error);
  }

  if (savedLanguage === "auto") {
    savedLanguage = detectLanguage();
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

export const changeLanguage = async (language: string) => {
  try {
    await localforage.setItem("language", language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export { initI18n };
export default i18n;
