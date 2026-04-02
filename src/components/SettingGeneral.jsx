// src/components/SettingGeneral.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { Check, Calendar as CalIcon } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import { ThemeContext } from "../context/ThemeContext";

const STORAGE_KEY = "karobar:settings:general";
const BLUE_VAR = "var(--primary-500)";

function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      <span
        className="w-12 h-6 rounded-full transition-colors"
        style={{ backgroundColor: checked ? BLUE_VAR : "#e6e6e6" }}
      />
      <span
        style={{
          position: "absolute",
          left: checked ? 46 : 8,
          top: 6,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "left 150ms ease",
        }}
      />
    </label>
  );
}

/* Month names for display */
const MONTHS_EN_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_BS_SHORT = [
  "Baishak",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export default function SettingGeneral() {
  const { locale, t, setLocale } = useLocale();
  const themeCtx = useContext(ThemeContext);

  useEffect(() => {
    // sync local appearance with global theme
    if (themeCtx && themeCtx.theme) {
      setState((s) => ({ ...s, appearance: themeCtx.theme }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeCtx?.theme]);

  const [state, setState] = useState({
    appearance: "light",
    currency: "Rs.",
    currencyPosition: "start",
    calendar: "AD",
    adDateISO: new Date().toISOString(),
    timeFormat: "12:00 PM",
    numberFormat: "10,00,000",
    privacyMode: false,
    appLock: false,
  });

  const convRef = useRef({ toBS: null, toAD: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("nepali-date-converter");
        if (!mounted) return;
        if (mod && mod.AD2BS && mod.BS2AD) {
          convRef.current.toBS = (adISO) => {
            const d = new Date(adISO);
            const y = d.getFullYear(),
              m = d.getMonth() + 1,
              day = d.getDate();
            const bs = mod.AD2BS(y, m, day);
            return `${bs.year} ${MONTHS_BS_SHORT[bs.month - 1]} ${String(bs.day).padStart(2, "0")}`;
          };
          convRef.current.toAD = (bsY, bsM, bsD) => {
            const eng = mod.BS2AD(bsY, bsM, bsD);
            return new Date(eng.year, eng.month - 1, eng.day).toISOString();
          };
        } else {
          convRef.current.toBS = null;
          convRef.current.toAD = null;
        }
      } catch (e) {
        convRef.current.toBS = null;
        convRef.current.toAD = null;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  useEffect(() => {
    try {
      document.documentElement.lang = locale || "en";
    } catch (e) {}
  }, [locale]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  function formatADDisplay(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = MONTHS_EN_SHORT[d.getMonth()];
    const day = String(d.getDate()).padStart(2, "0");
    return `${y} ${m} ${day}`;
  }

  async function adToDisplay(iso) {
    if (convRef.current.toBS) {
      try {
        return convRef.current.toBS(iso);
      } catch {}
    }
    const d = new Date(iso);
    const approx = new Date(d);
    approx.setFullYear(d.getFullYear() + 57);
    const y = approx.getFullYear();
    const m = MONTHS_BS_SHORT[approx.getMonth()] || MONTHS_EN_SHORT[approx.getMonth()];
    const day = String(approx.getDate()).padStart(2, "0");
    return `${y} ${m} ${day}`;
  }

  async function bsInputToADISO(input) {
    const parts = input.trim().split(/\s+|[-\/]/).filter(Boolean);
    if (parts.length >= 3 && /^\d{3,4}$/.test(parts[0])) {
      const by = Number(parts[0]);
      let bm = -1;
      const tokenMonth = parts[1];
      const mnum = Number(tokenMonth);
      if (!isNaN(mnum)) bm = mnum;
      else {
        const idx = MONTHS_BS_SHORT.findIndex((nm) => nm.toLowerCase().startsWith(tokenMonth.toLowerCase()));
        if (idx >= 0) bm = idx + 1;
        else {
          const idx2 = MONTHS_EN_SHORT.findIndex((nm) => nm.toLowerCase().startsWith(tokenMonth.toLowerCase()));
          if (idx2 >= 0) bm = idx2 + 1;
        }
      }
      const bd = Number(parts[2]);
      if (!isNaN(by) && bm > 0 && !isNaN(bd)) {
        if (convRef.current.toAD) {
          try {
            return convRef.current.toAD(by, bm, bd);
          } catch {
            const approximateAD = new Date(by - 57, bm - 1, bd);
            return approximateAD.toISOString();
          }
        } else {
          const approximateAD = new Date(by - 57, bm - 1, bd);
          return approximateAD.toISOString();
        }
      }
    }
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
    throw new Error("Unable to parse BS date input");
  }

  const [displayDate, setDisplayDate] = useState("");
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (state.calendar === "AD") {
        if (mounted) setDisplayDate(formatADDisplay(state.adDateISO));
        return;
      }
      const disp = await adToDisplay(state.adDateISO);
      if (mounted) setDisplayDate(disp);
    })();
    return () => (mounted = false);
  }, [state.adDateISO, state.calendar]);

  const handleEditDateClick = async () => {
    const hint = displayDate || (state.calendar === "AD" ? formatADDisplay(state.adDateISO) : await adToDisplay(state.adDateISO));
    const userInput = prompt(`${t("enter_date_hint")} (${state.calendar})`, hint);
    if (!userInput) return;
    try {
      if (state.calendar === "AD") {
        const parsed = new Date(userInput);
        if (!isNaN(parsed.getTime())) {
          set({ adDateISO: parsed.toISOString() });
          return;
        }
        const isoMatch = userInput.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
        if (isoMatch) {
          const y = Number(isoMatch[1]), m = Number(isoMatch[2]) - 1, d = Number(isoMatch[3]);
          const dt = new Date(y, m, d);
          if (!isNaN(dt.getTime())) {
            set({ adDateISO: dt.toISOString() });
            return;
          }
        }
        alert(t("invalid_ad_date"));
      } else {
        const iso = await bsInputToADISO(userInput);
        set({ adDateISO: iso });
      }
    } catch (err) {
      alert(t("invalid_date_parse") + " " + (err?.message || ""));
    }
  };

  const handleSetCalendar = (cal) => set({ calendar: cal });

  const AppearanceCard = ({ id, title, active, onClick, previewBg }) => (
    <button
      onClick={onClick}
      className={`relative w-40 h-32 rounded-lg border p-2 flex flex-col justify-between items-start transition ${
        active ? "" : "hover:shadow-sm"
      }`}
      style={{
        borderColor: active ? "var(--primary-500)" : "rgba(0,0,0,0.06)",
        background: "var(--surface-100)",
        boxShadow: active ? `0 0 0 3px rgba(23,37,84,0.06)` : undefined,
      }}
    >
      <div className="w-full h-20 rounded-md" style={{ background: previewBg || "var(--surface-200)", width: "100%" }} />
      <div className="flex items-center justify-between w-full">
        <div className={`text-sm font-medium ${active ? "text-text" : "text-text"}`}>{title}</div>
        {active && (
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "var(--primary-500)" }} aria-hidden>
            <Check size={14} />
          </span>
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-0 overflow-auto p-6 bg-bg text-text">
      <h1 className="text-2xl font-semibold mb-6">{t("general")}</h1>

      <div className="max-w-4xl space-y-6">
        {/* Appearance */}
        <div className="bg-surface border rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <div className="font-medium text-text">{t("appearance")}</div>
            <div className="text-sm text-muted mt-1">{t("appearance_help")}</div>
          </div>

          <div className="flex gap-4">
            <AppearanceCard
              id="light"
              title={t("appearance_light")}
              active={state.appearance === "light"}
              onClick={() => {
                set({ appearance: "light" });
                themeCtx?.setTheme && themeCtx.setTheme("light");
              }}
              previewBg="linear-gradient(#ffffff,#f8fafc)"
            />
            <AppearanceCard
              id="classic"
              title={t("appearance_classic")}
              active={state.appearance === "classic"}
              onClick={() => {
                set({ appearance: "classic" });
                themeCtx?.setTheme && themeCtx.setTheme("classic");
              }}
              previewBg="linear-gradient(#F6E9D2,#efe6cf)"
            />
            <AppearanceCard
              id="dark"
              title={t("appearance_dark")}
              active={state.appearance === "dark"}
              onClick={() => {
                set({ appearance: "dark" });
                themeCtx?.setTheme && themeCtx.setTheme("dark");
              }}
              previewBg="linear-gradient(#0b1220,#071024)"
            />
          </div>
        </div>

        {/* Language */}
        <div className="bg-surface border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium text-text">{t("language")}</div>
            <div className="text-sm text-muted mt-1">{t("language_help")}</div>
          </div>
          <div>
            <select value={locale} onChange={(e) => setLocale(e.target.value)} className="border rounded px-3 py-2 bg-surface text-text">
              <option value="en">English</option>
              <option value="ne">नेपाली</option>
            </select>
          </div>
        </div>

        {/* ... rest follows same pattern: use bg-surface, text-text, hover:bg-surface ... */}
        <div className="bg-surface border rounded-xl p-5 shadow-sm">
          <div className="font-medium text-text">{t("currency")}</div>
          <div className="text-sm text-muted mt-1">{t("currency_help")}</div>

          <div className="mt-4 flex items-center justify-between">
            <select value={state.currency} onChange={(e) => set({ currency: e.target.value })} className="border rounded px-3 py-2 bg-surface text-text">
              <option>Rs.</option>
              <option>$</option>
              <option>₹</option>
            </select>

            <div className="flex items-center gap-4">
              <div className="text-sm text-text">{t("currency_position")}</div>
              <select value={state.currencyPosition} onChange={(e) => set({ currencyPosition: e.target.value })} className="border rounded px-3 py-2 bg-surface text-text">
                <option value="start">{t("currency_position_start")}</option>
                <option value="end">{t("currency_position_end")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-surface border rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium text-text">{t("calendar")}</div>
              <div className="text-sm text-muted mt-1">{t("calendar_help")}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleSetCalendar("AD")} className="px-3 py-1 rounded-md border" style={state.calendar === "AD" ? { backgroundColor: "var(--primary-500)", color: "white", borderColor: "var(--primary-500)" } : {}}>
                AD
              </button>
              <button onClick={() => handleSetCalendar("BS")} className="px-3 py-1 rounded-md border" style={state.calendar === "BS" ? { backgroundColor: "var(--primary-500)", color: "white", borderColor: "var(--primary-500)" } : {}}>
                BS
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted">{t("dateFormat")}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>{displayDate}</div>
                <button onClick={handleEditDateClick} className="text-sm text-muted flex items-center gap-2">
                  <CalIcon size={16} /> {t("change")}
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted">{t("timeFormat")}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>{state.timeFormat}</div>
                <button
                  onClick={() => {
                    const val = prompt(t("set_time_format_prompt"), state.timeFormat);
                    if (val) set({ timeFormat: val });
                  }}
                  className="text-sm text-muted"
                >
                  {t("change")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Number format */}
        <div className="bg-surface border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-medium text-text">{t("numberFormat")}</div>
            <div className="text-sm text-muted mt-1">{t("numberFormat_help")}</div>
          </div>

          <div>
            <select value={state.numberFormat} onChange={(e) => set({ numberFormat: e.target.value })} className="border rounded px-3 py-2 bg-surface text-text">
              <option>10,00,000</option>
              <option>1,000,000</option>
            </select>
          </div>
        </div>

        {/* Privacy & App Lock */}
        <div className="bg-surface border rounded-xl p-5 shadow-sm divide-y">
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium text-text">{t("privacyMode")}</div>
              <div className="text-sm text-muted mt-1">{t("privacyMode_help")}</div>
            </div>
            <Toggle checked={state.privacyMode} onChange={(v) => set({ privacyMode: v })} ariaLabel="Privacy Mode" />
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium text-text">{t("appLock")}</div>
              <div className="text-sm text-muted mt-1">{t("appLock_help")}</div>
            </div>
            <Toggle checked={state.appLock} onChange={(v) => set({ appLock: v })} ariaLabel="App Lock" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mt-4 text-sm text-muted">{t("demo_saving_notice")}</div>
    </div>
  );
}