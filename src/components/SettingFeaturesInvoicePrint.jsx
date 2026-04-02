// src/components/SettingFeaturesInvoicePrint.jsx
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const STORAGE_KEY = "karobar:feature-settings:invoice-print";
const BTN_BG = "#172554"; // primary button color

/* ------------------ Theme detection & watcher ------------------ */
function detectTheme() {
  if (typeof document === "undefined") return "light";
  try {
    const html = document.documentElement;
    if (html?.dataset?.theme) return html.dataset.theme === "dark" ? "dark" : "light";
    if (html.classList.contains("dark")) return "dark";
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    if (saved) return saved === "dark" ? "dark" : "light";
  } catch (e) {
    /* fallback below */
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
    const guard = setInterval(update, 1000);
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(guard);
    };
  }, []);
  return theme;
}

/* ------------------ Toggle ------------------ */
function Toggle({ checked, onChange, ariaLabel, isDark }) {
  const uncheckedBg = isDark ? "#2b3748" : "#e6e6e6";
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
        style={{ backgroundColor: checked ? BTN_BG : uncheckedBg }}
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

/* ------------------ Component ------------------ */
export default function SettingFeaturesInvoicePrint() {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  const [state, setState] = useState({
    printType: "regular",
    pageSize: "A4 (210 × 297 mm)",
    showBankQR: false,
    showLogo: true,
    showPhone: true,
    showAddress: true,
    showEmail: true,
    showBankAccount: false,
    showRegistration: false,
    showPartyBalance: false,
    showItemUnit: true,
    hideHSCode: false,
    hideBranding: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch (e) {
      /* noop */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* noop */
    }
  }, [state]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  /* theme-aware colors */
  const pageBg = isDark ? "#07111A" : "#F3F4F6"; // whole page grey background
  const cardBg = isDark ? "#071425" : "#ffffff";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #e6e6e6";
  const heading = isDark ? "#E6EEF8" : "#0F172A";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const subtleSurface = isDark ? "#061827" : "#FAFBFD";

  const ManageButton = ({ title, subtitle, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow transition text-left"
      style={{ background: cardBg, border: cardBorder }}
    >
      <div>
        <div className="font-medium" style={{ color: heading }}>{title}</div>
        {subtitle && <div className="text-sm" style={{ color: muted, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <ChevronRight size={18} style={{ color: muted }} />
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: pageBg, color: heading }}>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: heading }}>Invoice Print Settings</h2>

        <div className="space-y-6">
          {/* Print Type */}
          <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: cardBg, border: cardBorder }}>
            <div>
              <div className="font-medium" style={{ color: heading }}>Select Default Print Type</div>
              <div className="text-sm" style={{ color: muted, marginTop: 4 }}>Choose printing type as your preference</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => set({ printType: "regular" })}
                className="px-4 py-2 rounded-md border transition inline-flex items-center gap-2"
                style={ state.printType === "regular"
                  ? { backgroundColor: BTN_BG, color: "white", borderColor: BTN_BG }
                  : { background: subtleSurface, color: heading }
                }
              >
                <span className="text-sm font-medium">🖨️ Regular</span>
              </button>

              <button
                onClick={() => set({ printType: "thermal" })}
                className="px-4 py-2 rounded-md border transition inline-flex items-center gap-2"
                style={ state.printType === "thermal"
                  ? { backgroundColor: BTN_BG, color: "white", borderColor: BTN_BG }
                  : { background: subtleSurface, color: heading }
                }
              >
                <span className="text-sm font-medium">🔥 Thermal</span>
              </button>
            </div>
          </div>

          {/* Management Buttons */}
          <div className="space-y-3">
            <ManageButton title="Default Invoice Style" subtitle="Manage invoice styles and fields" onClick={() => alert("Open Default Invoice Style (demo)")} />
            <ManageButton title="Signature" subtitle="Add your signature or create one for invoices" onClick={() => alert("Open Signature (demo)")} />
            <ManageButton title="Upload Bank QR" subtitle="Add your QR" onClick={() => alert("Open Upload Bank QR (demo)")} />
            <ManageButton title="Terms & Conditions" subtitle="Add your T&C for printed invoices" onClick={() => alert("Open Terms & Conditions (demo)")} />
          </div>

          {/* Printer Settings */}
          <div className="rounded-xl p-5" style={{ background: cardBg, border: cardBorder }}>
            <div className="font-medium" style={{ color: heading }}>Printer Settings</div>
            <div className="text-sm" style={{ color: muted, marginTop: 6 }}>Adjust page size and layout</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm" style={{ color: heading }}>Page Size</div>

              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer"
                onClick={() => {
                  const val = prompt("Choose page size (e.g. A4 / A5)", state.pageSize);
                  if (val) set({ pageSize: val });
                }}
                style={{ background: subtleSurface, border: cardBorder }}
              >
                <span className="text-sm" style={{ color: heading }}>{state.pageSize}</span>
                <ChevronRight size={16} style={{ color: muted }} />
              </div>
            </div>
          </div>

          {/* Invoice Customization toggles */}
          <div style={{ background: cardBg, border: cardBorder, borderRadius: 12, overflow: "hidden" }}>
            {[
              { key: "showBankQR", label: "Show Bank QR on Invoice" },
              { key: "showLogo", label: "Show Business Logo on Invoice" },
              { key: "showPhone", label: "Show Phone Number on Invoice" },
              { key: "showAddress", label: "Show Address on Invoice" },
              { key: "showEmail", label: "Show Email on Invoice" },
              { key: "showBankAccount", label: "Show Bank Account on Invoice" },
              { key: "showRegistration", label: "Show Registration No. on Invoice" },
              { key: "showPartyBalance", label: "Show Party Balance on Invoice" },
              { key: "showItemUnit", label: "Show Item Unit on Invoice" },
              { key: "hideHSCode", label: "Hide HS Code on Invoice" },
              { key: "hideBranding", label: "Hide Karobar Branding" },
            ].map((r, idx, arr) => (
              <div
                key={r.key}
                className="flex items-center justify-between p-4"
                style={{
                  borderBottom: idx < arr.length - 1 ? (isDark ? "1px solid rgba(255,255,255,0.02)" : "1px solid #f3f4f6") : undefined
                }}
              >
                <div>
                  <div className="font-medium" style={{ color: heading }}>{r.label}</div>
                </div>
                <Toggle
                  checked={Boolean(state[r.key])}
                  onChange={(v) => set({ [r.key]: v })}
                  ariaLabel={r.label}
                  isDark={isDark}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm" style={{ color: muted }}>
          Changes are saved locally for this demo. Replace with API calls to persist workspace settings.
        </div>
      </div>
    </div>
  );
}
