// src/i18n/LocaleProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "./translations.jsx";

const STORAGE_KEY = "karobar:locale";

const LocaleContext = createContext({
  locale: "en",
  t: (k) => k,
  setLocale: (l) => {},
});

export function LocaleProvider({ children, defaultLocale = "en" }) {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && translations[raw]) setLocale(raw);
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {}
    try {
      document.documentElement.lang = locale || "en";
    } catch (e) {}
  }, [locale]);

  const t = useMemo(() => {
    return (key) => {
      const set = translations[locale] || translations.en;
      return set[key] ?? translations.en[key] ?? key;
    };
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, t, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
