// src/components/SettingFeaturesInventory.jsx
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

/**
 * SettingFeaturesInventory (theme-aware)
 * - Whole page uses a subtle grey background (light/dark variants)
 * - Watches theme from: document.documentElement.dataset.theme, html.dark, localStorage.theme
 * - Persists state to localStorage (demo)
 * - Toggle "on" color uses BLUE
 */

const STORAGE_KEY = "karobar:feature-settings:inventory";
const BLUE = "#174552";

/* ---------- theme detection + watcher (minimal, defensive) ---------- */
function detectTheme() {
  if (typeof document === "undefined") return "light";
  try {
    const html = document.documentElement;
    if (html?.dataset?.theme) return html.dataset.theme === "dark" ? "dark" : "light";
    if (html.classList.contains("dark")) return "dark";
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    if (saved) return saved === "dark" ? "dark" : "light";
  } catch (e) {
    // ignore
  }
  return "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());
  useEffect(() => {
    const update = () => setTheme(detectTheme());
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    window.addEventListener("storage", (ev) => {
      if (ev.key === "theme") update();
    });
    const guard = setInterval(update, 1000);
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", update);
      clearInterval(guard);
    };
  }, []);
  return theme;
}

/* ---------- Accessible Toggle ---------- */
function Toggle({ checked, onChange, ariaLabel, isDark }) {
  // smoother animation + better dark mode unchecked color
  const uncheckedBg = isDark ? "#2d3748" : "#e6e6e6";
  return (
    <label className="relative inline-flex items-center cursor-pointer" aria-label={ariaLabel}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      <span
        aria-hidden
        className="w-12 h-6 rounded-full transition-colors"
        style={{ backgroundColor: checked ? BLUE : uncheckedBg }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: checked ? 46 : 8,
          top: 6,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "left 160ms cubic-bezier(.2,.9,.3,1)",
        }}
      />
    </label>
  );
}

/* ---------- Component ---------- */
export default function SettingFeaturesInventory() {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  const [state, setState] = useState({
    uploadItemImage: true,
    wholesalePrice: false,
    mrp: false,
    itemLocation: false,
    partyWiseRate: false,
    lowStockDialog: false,
    defaultUnit: false,
    decimalPlaces: 2,
  });

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState((s) => ({ ...s, ...JSON.parse(raw) }));
      }
    } catch (e) {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* noop */
    }
  }, [state]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  /* theme-aware colors */
  const pageBg = isDark ? "#07111a" : "#F3F4F6"; // whole-grey background request
  const cardBg = isDark ? "#071425" : "#ffffff";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #e6e6e6";
  const headingColor = isDark ? "#E6EEF8" : "#0F172A";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const panelSurface = isDark ? "#061827" : "#FAFBFD";

  return (
    <div style={{ minHeight: "100vh", background: pageBg, color: headingColor, transition: "background 180ms" }}>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: headingColor }}>
          Inventory Settings
        </h2>

        {/* Top actions/cards */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => alert("Open Manage Item Categories (demo)")}
            className="w-full rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow transition"
            style={{ background: cardBg, border: cardBorder }}
          >
            <div>
              <div className="font-medium" style={{ color: headingColor }}>
                Manage Item Categories
              </div>
              <div className="text-sm" style={{ color: muted, marginTop: 4 }}>
                Manage Item Categories for inventory-related information
              </div>
            </div>
            <ChevronRight size={18} style={{ color: muted }} />
          </button>

          <button
            type="button"
            onClick={() => alert("Open Manage Item Units (demo)")}
            className="w-full rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow transition"
            style={{ background: cardBg, border: cardBorder }}
          >
            <div>
              <div className="font-medium" style={{ color: headingColor }}>
                Manage Item Units
              </div>
              <div className="text-sm" style={{ color: muted, marginTop: 4 }}>
                Manage Item Units for inventory-related information
              </div>
            </div>
            <ChevronRight size={18} style={{ color: muted }} />
          </button>

          <div
            className="w-full rounded-xl p-5 flex items-center justify-between shadow-sm"
            style={{ background: cardBg, border: cardBorder }}
          >
            <div>
              <div className="font-medium" style={{ color: headingColor }}>
                Upload Item Image
              </div>
              <div className="text-sm" style={{ color: muted, marginTop: 4 }}>
                Enable item image uploads to recognize item easily
              </div>
            </div>

            <Toggle
              checked={state.uploadItemImage}
              onChange={(v) => set({ uploadItemImage: v })}
              ariaLabel="Upload Item Image"
              isDark={isDark}
            />
          </div>
        </div>

        {/* Pricing & Inventory Management */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: headingColor }}>
            Pricing & Inventory Management
          </h3>

          <div style={{ background: cardBg, border: cardBorder, borderRadius: 12, overflow: "hidden" }}>
            {[
              { key: "wholesalePrice", label: "Wholesale Price" },
              { key: "mrp", label: "MRP" },
              { key: "itemLocation", label: "Item Location" },
              { key: "partyWiseRate", label: "Party Wise Item Rate" },
              { key: "lowStockDialog", label: "Low Stock Warning Dialog" },
              { key: "defaultUnit", label: "Default Unit" },
            ].map((r, idx) => (
              <div
                key={r.key}
                className="flex items-center justify-between p-4"
                style={{
                  borderBottom: idx < 5 ? (isDark ? "1px solid rgba(255,255,255,0.02)" : "1px solid #f3f4f6") : undefined,
                }}
              >
                <div>
                  <div className="font-medium" style={{ color: headingColor }}>
                    {r.label}
                  </div>
                  <div className="text-sm" style={{ color: muted, marginTop: 4 }}>
                    {/* brief helper text could go here */}
                  </div>
                </div>

                <Toggle
                  checked={Boolean(state[r.key])}
                  onChange={(v) => set({ [r.key]: v })}
                  ariaLabel={r.label}
                  isDark={isDark}
                />
              </div>
            ))}

            {/* Decimal places row */}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium" style={{ color: headingColor }}>
                  Quantity (Upto Decimal Places)
                </div>
                <div className="text-sm" style={{ color: muted, marginTop: 4 }}>
                  Set maximum fraction digits allowed for quantities
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => set({ decimalPlaces: Math.max(0, state.decimalPlaces - 1) })}
                  className="w-8 h-8 rounded-md border flex items-center justify-center"
                  style={{ background: panelSurface, borderColor: cardBorder }}
                >
                  −
                </button>
                <div
                  className="w-12 h-8 rounded-md border flex items-center justify-center font-medium"
                  style={{ background: panelSurface, borderColor: cardBorder, color: headingColor }}
                >
                  {state.decimalPlaces}
                </div>
                <button
                  type="button"
                  onClick={() => set({ decimalPlaces: Math.min(6, state.decimalPlaces + 1) })}
                  className="w-8 h-8 rounded-md border flex items-center justify-center"
                  style={{ background: panelSurface, borderColor: cardBorder }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm" style={{ color: muted, maxWidth: 720 }}>
          Changes are saved locally for this demo. In production call your API to persist workspace settings.
        </div>
      </div>
    </div>
  );
}
