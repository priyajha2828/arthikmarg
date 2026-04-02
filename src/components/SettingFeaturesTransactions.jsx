// src/components/SettingFeaturesTransactions.jsx
import React, { useEffect, useState, useContext } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const STORAGE_KEY = "karobar:feature-settings:transactions";

function Toggle({ checked, onChange, ariaLabel, vars }) {
  const ACCENT = vars.primary;
  const trackBg = checked ? ACCENT : vars.surface;
  const knobBg = vars.surface100;
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      {/* track */}
      <span
        className="w-12 h-6 rounded-full transition-colors ease-in-out duration-150"
        style={{ backgroundColor: trackBg }}
      />
      {/* knob */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 6,
          top: 6,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: knobBg,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transform: checked ? "translateX(22px)" : "translateX(0)",
          transition: "transform 150ms ease",
        }}
      />
    </label>
  );
}

export default function SettingFeaturesTransactions() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext || {});

  // theme-aware CSS variables with fallbacks
  const vars = {
    primary: "var(--primary-500, #172554)",
    primaryHover: "var(--primary-600, #0f3460)",
    bg: "var(--bg-default, #ffffff)",
    surface: "var(--surface-200, #f3f4f6)", // page background (soft grey)
    surface100: "var(--surface-100, #ffffff)", // card bg
    text: "var(--text-default, #0f172a)",
    muted: "var(--muted, rgba(0,0,0,0.56))",
    border: "var(--border, rgba(0,0,0,0.06))",
    textAlt: "var(--text-default-alt, rgba(11,17,32,0.6))",
  };

  const [state, setState] = useState({
    cashSaleByDefault: false,
    dueDateReminder: false,
    otherIncomeTransaction: true,
    enablePrefixes: true,
    additionalCharges: true,
    roundOff: false,

    prefixes: {
      sales: "SAL-",
      salesReturn: "SR-",
      paymentIn: "PIN-",
      quotation: "QT-",
    },
  });

  // Load saved settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Save on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }, [state]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  // layout / styling objects using theme vars
  const pageStyle = {
    background: vars.surface,
    minHeight: "100%",
    padding: "1.5rem",
  };

  const cardStyle = {
    background: vars.surface100,
    border: `1px solid ${vars.border}`,
    borderRadius: 12,
    padding: "1.25rem",
  };

  const titleStyle = { color: vars.text, fontSize: "1.375rem", fontWeight: 600 };
  const headingStyle = { color: vars.text, fontWeight: 600 };
  const subStyle = { color: vars.textAlt, fontSize: "0.9rem", marginTop: 6 };

  return (
    <div style={pageStyle} data-theme={theme}>
      <h2 style={{ ...titleStyle, marginBottom: 20 }}>Transaction Settings</h2>

      <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
        {/* Row 1 */}
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={headingStyle}>Set Cash Sale by Default</div>
            <div style={subStyle}>Every transaction will be recorded as cash.</div>
          </div>
          <Toggle checked={state.cashSaleByDefault} onChange={(v) => set({ cashSaleByDefault: v })} ariaLabel="Set Cash Sale by Default" vars={vars} />
        </div>

        {/* Row 2 */}
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={headingStyle}>Enable Due Date Reminder</div>
            <div style={subStyle}>Record due dates for unpaid invoices.</div>
          </div>
          <Toggle checked={state.dueDateReminder} onChange={(v) => set({ dueDateReminder: v })} ariaLabel="Enable Due Date Reminder" vars={vars} />
        </div>

        {/* Row 3 */}
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={headingStyle}>Enable Other Income Transaction</div>
            <div style={subStyle}>Enables recording of other income transactions.</div>
          </div>
          <Toggle checked={state.otherIncomeTransaction} onChange={(v) => set({ otherIncomeTransaction: v })} ariaLabel="Enable Other Income Transaction" vars={vars} />
        </div>

        {/* category manage */}
        <div style={{ display: "grid", gap: 8 }}>
          <button
            type="button"
            onClick={() => alert("Open Income Categories")}
            style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            aria-label="Manage Income Categories"
          >
            <div>
              <div style={headingStyle}>Manage Income Categories</div>
              <div style={subStyle}>Organize income categories</div>
            </div>
            <ChevronRight size={18} style={{ color: vars.textAlt }} />
          </button>

          <button
            type="button"
            onClick={() => alert("Open Expense Categories")}
            style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            aria-label="Manage Expense Categories"
          >
            <div>
              <div style={headingStyle}>Manage Expense Categories</div>
              <div style={subStyle}>Organize expense categories</div>
            </div>
            <ChevronRight size={18} style={{ color: vars.textAlt }} />
          </button>
        </div>

        {/* Prefix Section */}
        <div style={{ ...cardStyle }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={headingStyle}>Enable Transaction Prefixes</div>
              <div style={subStyle}>Manage invoice number prefixes</div>
            </div>

            <Toggle checked={state.enablePrefixes} onChange={(v) => set({ enablePrefixes: v })} ariaLabel="Enable Prefix" vars={vars} />
          </div>

          {state.enablePrefixes && (
            <div style={{ marginTop: 12, borderTop: `1px solid ${vars.border}`, paddingTop: 12, display: "grid", gap: 8 }}>
              {[
                { key: "sales", label: "Sales Prefix" },
                { key: "salesReturn", label: "Sales Return Prefix" },
                { key: "paymentIn", label: "Payment In Prefix" },
                { key: "quotation", label: "Quotation Prefix" },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => {
                    const current = state.prefixes[r.key];
                    const val = prompt(`Edit ${r.label}`, current);
                    if (val !== null) set({ prefixes: { ...state.prefixes, [r.key]: val } });
                  }}
                  style={{
                    background: "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={headingStyle}>{r.label}</div>
                    <div style={{ ...subStyle, marginTop: 4 }}>{state.prefixes[r.key]}</div>
                  </div>
                  <ChevronRight size={18} style={{ color: vars.textAlt }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Other Settings */}
        <div style={{ ...cardStyle }}>
          <div style={{ ...headingStyle, marginBottom: 8 }}>Others Settings</div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <div>
                <div style={headingStyle}>Enable Additional Charges</div>
                <div style={subStyle}>Add additional charges to invoices.</div>
              </div>
              <Toggle checked={state.additionalCharges} onChange={(v) => set({ additionalCharges: v })} ariaLabel="Enable Additional Charges" vars={vars} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <div>
                <div style={headingStyle}>Enable Round Off</div>
                <div style={subStyle}>Round total automatically.</div>
              </div>
              <Toggle checked={state.roundOff} onChange={(v) => set({ roundOff: v })} ariaLabel="Enable Round Off" vars={vars} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, marginTop: 12, color: vars.textAlt }}>
        Changes saved locally. Replace with API for production.
      </div>
    </div>
  );
}
