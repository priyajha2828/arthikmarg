// src/components/SettingFeaturesParties.jsx
import React, { useEffect, useState } from "react";

/**
 * SettingFeaturesParties (theme-aware)
 *
 * - Whole page uses a subtle grey background in light mode and darker grey in dark mode
 * - Detects theme from: document.documentElement.dataset.theme, html.dark, localStorage.theme
 * - Persists toggles to localStorage (demo)
 * - Uses #174552 as the active toggle color to match your app
 */

const STORAGE_KEY = "karobar:feature-settings:parties";
const ACTIVE_COLOR = "#174552";

function detectTheme() {
  if (typeof document === "undefined") return "light";
  try {
    const html = document.documentElement;
    if (html?.dataset?.theme) return html.dataset.theme === "dark" ? "dark" : "light";
    if (html.classList.contains("dark")) return "dark";
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    if (saved) return saved === "dark" ? "dark" : "light";
  } catch (e) {
    // fallback
  }
  return "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());
  useEffect(() => {
    const update = () => setTheme(detectTheme());
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    const onStorage = (ev) => { if (ev.key === "theme") update(); };
    window.addEventListener("storage", onStorage);
    const guard = setInterval(update, 1000); // defensive fallback
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(guard);
    };
  }, []);
  return theme;
}

/* Accessible Toggle component — uses button so it works without extra CSS hacks */
function Toggle({ checked, onChange, ariaLabel, isDark }) {
  const uncheckedBg = isDark ? "#2b3748" : "#e6e6e6";
  const knobLeft = checked ? 46 : 8;
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="relative w-14 h-8 rounded-full focus:outline-none focus-visible:ring-2"
      style={{
        background: checked ? ACTIVE_COLOR : uncheckedBg,
        transition: "background-color 160ms ease",
        boxShadow: isDark ? "0 1px 2px rgba(0,0,0,0.6) inset" : undefined,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 5,
          left: knobLeft,
          width: 18,
          height: 18,
          borderRadius: 9999,
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "left 160ms cubic-bezier(.2,.9,.3,1)",
        }}
      />
    </button>
  );
}

export default function SettingFeaturesParties() {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  const [partyCategoryEnabled, setPartyCategoryEnabled] = useState(false);
  const [uploadPartyImageEnabled, setUploadPartyImageEnabled] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setPartyCategoryEnabled(Boolean(parsed.partyCategoryEnabled));
        setUploadPartyImageEnabled(Boolean(parsed.uploadPartyImageEnabled));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ partyCategoryEnabled, uploadPartyImageEnabled })
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [partyCategoryEnabled, uploadPartyImageEnabled]);

  // theme-aware colors
  const pageBg = isDark ? "#07111A" : "#F3F4F6"; // whole-page grey
  const cardBg = isDark ? "#071425" : "#ffffff";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #e6e6e6";
  const heading = isDark ? "#E6EEF8" : "#0F172A";
  const muted = isDark ? "#9CA3AF" : "#6B7280";

  return (
    <div style={{ minHeight: "100vh", background: pageBg, color: heading }}>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: heading }}>
          Party Settings
        </h2>

        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: cardBg, border: cardBorder }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: heading }}>
                Party Category
              </div>
              <div className="text-sm mt-1" style={{ color: muted }}>
                Enable Party Category to effortlessly manage parties
              </div>
            </div>

            <Toggle
              checked={partyCategoryEnabled}
              onChange={setPartyCategoryEnabled}
              ariaLabel="Enable Party Category"
              isDark={isDark}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: cardBg, border: cardBorder }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: heading }}>
                Upload Party Image
              </div>
              <div className="text-sm mt-1" style={{ color: muted }}>
                Enable party image uploads to recognize parties easily
              </div>
            </div>

            <Toggle
              checked={uploadPartyImageEnabled}
              onChange={setUploadPartyImageEnabled}
              ariaLabel="Enable Upload Party Image"
              isDark={isDark}
            />
          </div>
        </div>

        <div className="mt-6 text-sm" style={{ color: muted, maxWidth: 720 }}>
          Changes are saved locally for this demo. In production, call your API to persist workspace settings.
        </div>
      </div>
    </div>
  );
}
