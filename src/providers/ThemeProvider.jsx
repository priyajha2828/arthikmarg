// src/providers/ThemeProvider.jsx
import React, { useCallback, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const STORAGE_KEY = "app-theme";
const BODY_CLASSES = ["theme-light", "theme-dark", "theme-classic"];

function ensureMetaThemeColor() {
  if (typeof document === "undefined") return null;
  let m = document.querySelector('meta[name="theme-color"]');
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("name", "theme-color");
    document.head.appendChild(m);
  }
  return m;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;

  // body classes (legacy)
  document.body.classList.remove(...BODY_CLASSES);
  document.body.classList.add(`theme-${theme}`);

  // data-theme on root
  document.documentElement.setAttribute("data-theme", theme);

  // Tailwind compatibility
  document.documentElement.classList.toggle("dark", theme === "dark");

  const root = document.documentElement;

  // exact colors: dark, light, classic (cream + white text)
  if (theme === "dark") {
    root.style.setProperty("--primary-500", "#0f172a");
    root.style.setProperty("--bg-default", "#0b1220");
    root.style.setProperty("--text-default", "#ffffff");
    root.style.setProperty("--surface-100", "#0b1220");
    root.style.setProperty("--surface-200", "#071024");
  } else if (theme === "classic") {
    root.style.setProperty("--primary-500", "#a67c3b"); // accent for classic
    root.style.setProperty("--bg-default", "#F6E9D2"); // cream
    root.style.setProperty("--text-default", "#0b1220"); // requested white text
    root.style.setProperty("--text-default-alt", "#2b2b2b"); // alt if needed
    root.style.setProperty("--surface-100", "#F6E9D2");
    root.style.setProperty("--surface-200", "#efe6cf");
  } else {
    // light (default)
    root.style.setProperty("--primary-500", "#172554");
    root.style.setProperty("--bg-default", "#ffffff");
    root.style.setProperty("--text-default", "#0b1220");
    root.style.setProperty("--surface-100", "#ffffff");
    root.style.setProperty("--surface-200", "#f8fafc");
  }

  // update mobile browser UI color
  const meta = ensureMetaThemeColor();
  if (meta) {
    try {
      const color = getComputedStyle(root).getPropertyValue("--primary-500").trim() || "#172554";
      meta.setAttribute("content", color);
    } catch (e) {
      // ignore
    }
  }
}

function readSystemTheme() {
  try {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  } catch {}
  return "light";
}

export function ThemeProvider({ children }) {
  // determine initial theme: stored -> system -> light
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
      return readSystemTheme();
    } catch {
      return "light";
    }
  };

  const [theme, setThemeState] = useState(getInitialTheme);

  // stable setter that persists and applies
  const setTheme = useCallback((value) => {
    setThemeState((prev) => {
      if (prev === value) return prev;
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {}
      applyTheme(value);
      return value;
    });
  }, []);

  // safe toggle using state updater to avoid stale closure
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      applyTheme(next);
      return next;
    });
  }, []);

  // apply theme on mount and whenever it changes (keeps DOM consistent)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // listen for OS color-scheme changes — only act when user hasn't saved a preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          const sys = e.matches ? "dark" : "light";
          setThemeState(sys);
          applyTheme(sys);
        }
      } catch {}
    };

    // add listener (modern + legacy)
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else if (mql.addListener) mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else if (mql.removeListener) mql.removeListener(onChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
