// src/components/ReportPage.jsx
import React, { useMemo, useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  Printer,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if needed

/* REPORTS_MAP (titles/descriptions) */
const REPORTS_MAP = {
  sales: { title: "Sales Report", desc: "View your sales data on a given time" },
  purchase: { title: "Purchase Report", desc: "View your purchase data on a given time" },
  "sales-return": { title: "Sales Return", desc: "View your sales return data on a given time" },
  "purchase-return": { title: "Purchase Return", desc: "View your purchase return data on a given time" },
  "day-book": { title: "Day Book", desc: "View all of your daily transactions" },
  "all-transactions": { title: "All Transactions", desc: "View all party transactions in a given time" },
  "profit-and-loss": { title: "Profit And Loss", desc: "View your profit & loss in a given time" },

  "party-statement": { title: "Party Statement", desc: "Check the transactions of certain party" },
  "all-party-report": { title: "All Party Report", desc: "Receivable/payable dues of every party" },

  "item-details-report": { title: "Item Details Report", desc: "Check stock, transaction of individual item." },
  "item-list-report": { title: "Item List Report", desc: "Shows all the item rates like, sales, purchase, MRP price etc..." },
  "low-stock-summary-report": { title: "Low Stock Summary Report", desc: "View all items which are getting low on quantity" },
  "stock-quantity-report": { title: "Stock Quantity Report", desc: "View opening & closing quantity of each item" },

  "income-expense-report": { title: "Income Expense Report", desc: "Check all the income expense report" },
  "expense-category": { title: "Expense Category", desc: "Check the categorized expense report in a given date" },
  "income-category": { title: "Income Category", desc: "Check the categorized income report in a given date" },

  "cash-in-hand-statement": { title: "Cash In Hand Statement", desc: "Check all transaction made with cash" },
  "bank-statement": { title: "Bank Statement", desc: "Check all the transaction made with bank" },
  "discount-report": { title: "Discount Report", desc: "Check the total discounted amount made by each parties in purchase & sales." },
  "tax-sales": { title: "Tax Sales", desc: "Check report of all Tax applicable sales." },
  "tax-purchase": { title: "Tax Purchase", desc: "Check report of all Tax applicable purchase." },
};

function prettyTitleFromId(id) {
  if (!id) return "Report";
  return id
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* --- Date helpers --- */
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const formatDisplay = (d) => {
  if (!d) return "";
  return d.toLocaleDateString();
};
const toInputDate = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/* calendar grid builder */
function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekDay = first.getDay();
  const totalDays = last.getDate();

  const weeks = [];
  let week = new Array(startWeekDay).fill(null);

  for (let d = 1; d <= totalDays; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

/* presets */
const PRESETS = [
  "All Date",
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Last Month",
  "This Fiscal Year",
  "This Year",
];

export default function ReportPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const { theme } = useContext(ThemeContext || {});

  const info = useMemo(() => {
    const normalized = (reportId || "").toLowerCase();
    return REPORTS_MAP[normalized] || { title: `${prettyTitleFromId(normalized)}`, desc: "" };
  }, [reportId]);

  // Theme CSS variables with sensible fallbacks
  const pageBg = "var(--surface-200, #f7fafc)"; // light gray
  const panelBg = "var(--bg-default, #ffffff)";
  const panelBorder = "var(--border, rgba(0,0,0,0.06))";
  const textDefault = "var(--text-default, #0f172a)";
  const muted = "var(--muted, rgba(0,0,0,0.6))";
  const primary = "var(--primary-500, #16a34a)";
  const primaryDark = "var(--primary-600, #0f5a3a)";

  // status dropdown
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const statusRef = useRef(null);

  // date popover
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef(null);

  // selected dates
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  });
  const [preset, setPreset] = useState("This Month");

  // calendar view month/year
  const [viewYear, setViewYear] = useState(() => startDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => startDate.getMonth());
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    function onDocClick(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Preset application
  const applyPreset = (p) => {
    const now = new Date();
    let s = null;
    let e = null;

    if (p === "All Date") {
      s = null;
      e = null;
    } else if (p === "Today") {
      s = startOfDay(now);
      e = endOfDay(now);
    } else if (p === "Yesterday") {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      s = startOfDay(y);
      e = endOfDay(y);
    } else if (p === "This Week") {
      const day = now.getDay();
      const sday = new Date(now);
      sday.setDate(now.getDate() - day);
      s = startOfDay(sday);
      const eday = new Date(sday);
      eday.setDate(sday.getDate() + 6);
      e = endOfDay(eday);
    } else if (p === "This Month") {
      s = new Date(now.getFullYear(), now.getMonth(), 1);
      e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (p === "Last Month") {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      s = new Date(last.getFullYear(), last.getMonth(), 1);
      e = new Date(last.getFullYear(), last.getMonth() + 1, 0);
    } else if (p === "This Fiscal Year") {
      const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      s = new Date(year, 3, 1);
      e = new Date(year + 1, 2, 31);
    } else if (p === "This Year") {
      s = new Date(now.getFullYear(), 0, 1);
      e = new Date(now.getFullYear(), 11, 31);
    }

    setPreset(p);
    setStartDate(s);
    setEndDate(e);
    if (s) {
      setViewYear(s.getFullYear());
      setViewMonth(s.getMonth());
    } else {
      const n = new Date();
      setViewYear(n.getFullYear());
      setViewMonth(n.getMonth());
    }
  };

  const prevMonth = () => {
    let y = viewYear;
    let m = viewMonth - 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    setViewYear(y);
    setViewMonth(m);
  };
  const nextMonth = () => {
    let y = viewYear;
    let m = viewMonth + 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    if (!selecting) {
      setStartDate(startOfDay(day));
      setEndDate(null);
      setSelecting(true);
      setPreset("Custom");
    } else {
      const s = startDate ? startOfDay(startDate) : startOfDay(day);
      const clicked = startOfDay(day);
      if (clicked.getTime() < s.getTime()) {
        setStartDate(clicked);
        setEndDate(s);
      } else {
        setEndDate(endOfDay(clicked));
      }
      setSelecting(false);
      setPreset("Custom");
    }
  };

  const inRange = (d) => {
    if (!d) return false;
    if (!startDate && !endDate) return false;
    const time = startOfDay(d).getTime();
    if (startDate && !endDate) {
      return time === startOfDay(startDate).getTime();
    }
    if (startDate && endDate) {
      return time >= startOfDay(startDate).getTime() && time <= startOfDay(endDate).getTime();
    }
    return false;
  };

  const weeks = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  // Basic inline theme-aware styles
  const pageStyle = {
    background: pageBg,
    color: textDefault,
    minHeight: "100%",
    padding: "24px",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  };

  const controlsRowStyle = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 36,
    width: "100%",
  };

  const inputBaseStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${panelBorder}`,
    background: panelBg,
    color: textDefault,
  };

  const dropdownStyle = {
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${panelBorder}`,
    background: panelBg,
    color: textDefault,
    cursor: "pointer",
  };

  const buttonGhostStyle = {
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${panelBorder}`,
    background: panelBg,
    color: textDefault,
    display: "flex",
    gap: 8,
    alignItems: "center",
    cursor: "pointer",
  };

  const smallPaleStyle = {
    background: panelBg,
    border: `1px solid ${panelBorder}`,
    padding: 8,
    borderRadius: 8,
    color: muted,
  };

  return (
    <div style={pageStyle} className="w-full min-h-[600px] flex flex-col">
      {/* Top Bar */}
      <div style={topBarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            style={{ ...buttonGhostStyle, borderRadius: 999, padding: 8 }}
            title="Back"
          >
            <ChevronLeft size={18} />
          </button>

          <h1 style={{ fontSize: 20, fontWeight: 700, color: textDefault }}>{info.title}</h1>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{ ...buttonGhostStyle }}>
            <Printer size={16} />
            <span style={{ fontSize: 13 }}>Print PDF</span>
          </button>

          <button style={{ ...buttonGhostStyle }}>
            <Download size={16} />
            <span style={{ fontSize: 13 }}>Download Excel</span>
            <ChevronDown size={14} style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div style={controlsRowStyle}>
        <div style={{ display: "flex", gap: 12, flex: 1, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }} />
            <input
              style={{ ...inputBaseStyle, paddingLeft: 40, width: "100%" }}
              placeholder="Search..."
              aria-label="Search"
            />
          </div>

          {/* All Status dropdown */}
          <div ref={statusRef} style={{ position: "relative" }}>
            <button
              onClick={() => setStatusOpen((s) => !s)}
              style={{ ...dropdownStyle, display: "flex", gap: 8, alignItems: "center" }}
            >
              <span>{selectedStatus}</span>
              <ChevronDown size={14} />
            </button>

            {statusOpen && (
              <div style={{ position: "absolute", left: 0, marginTop: 8, width: 180, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", zIndex: 60 }}>
                <ul style={{ padding: 8, margin: 0, listStyle: "none" }}>
                  {["All Status", "Paid", "Unpaid", "Partially Paid", "Overdue"].map((s) => (
                    <li key={s} style={{ marginBottom: 4 }}>
                      <button
                        onClick={() => {
                          setSelectedStatus(s);
                          setStatusOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 10px",
                          borderRadius: 6,
                          fontSize: 13,
                          background: selectedStatus === s ? "rgba(16,185,129,0.08)" : "transparent",
                          color: selectedStatus === s ? primaryDark : textDefault,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Date/Calendar popover (compact) */}
          <div ref={dateRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                if (!dateOpen && preset !== "Custom") applyPreset(preset);
                setDateOpen((d) => !d);
              }}
              style={{ ...dropdownStyle, display: "flex", gap: 8, alignItems: "center" }}
            >
              <CalendarIcon size={16} />
              <span style={{ fontSize: 13 }}>
                {preset !== "Custom" ? preset : `${formatDisplay(startDate)} → ${formatDisplay(endDate)}`}
              </span>
              {dateOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {dateOpen && (
              <div style={{ position: "absolute", left: 0, marginTop: 8, width: 520, background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 10, boxShadow: "0 12px 40px rgba(2,6,23,0.08)", zIndex: 80, overflow: "hidden" }}>
                <div style={{ display: "flex", minHeight: 320 }}>
                  {/* Left: Presets */}
                  <div style={{ width: 192, padding: 12, borderRight: `1px solid ${panelBorder}`, background: panelBg }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {PRESETS.map((p) => (
                        <li key={p} style={{ marginBottom: 6 }}>
                          <button
                            onClick={() => applyPreset(p)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "8px 10px",
                              borderRadius: 8,
                              background: preset === p ? "rgba(16,185,129,0.08)" : "transparent",
                              color: preset === p ? primaryDark : textDefault,
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: 13,
                            }}
                          >
                            <span>{p}</span>
                            {preset === p && <Check size={14} style={{ color: primaryDark }} />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Compact Calendar */}
                  <div style={{ flex: 1, padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={prevMonth} style={{ padding: 6, borderRadius: 6, border: `1px solid ${panelBorder}`, background: panelBg }}><ChevronLeft size={16} /></button>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "short", year: "numeric" })}
                        </div>
                        <button onClick={nextMonth} style={{ padding: 6, borderRadius: 6, border: `1px solid ${panelBorder}`, background: panelBg }}><ChevronRight size={16} /></button>
                      </div>
                    </div>

                    {/* small calendar box */}
                    <div style={{ background: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 6, padding: 8 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, fontSize: 11, color: muted, marginBottom: 6 }}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                          <div key={d} style={{ textAlign: "center", padding: 6 }}>{d}</div>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                        {weeks.map((week, wi) =>
                          week.map((day, di) => {
                            const isDisabled = !day;
                            const isInRange = day && inRange(new Date(day));
                            const isStart = day && startDate && startOfDay(day).getTime() === startOfDay(startDate).getTime();
                            const isEnd = day && endDate && startOfDay(day).getTime() === startOfDay(endDate).getTime();

                            const baseStyle = {
                              height: 34,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 6,
                              fontSize: 12,
                              cursor: isDisabled ? "default" : "pointer",
                              background: isStart || isEnd ? primary : isInRange ? "rgba(16,185,129,0.06)" : panelBg,
                              color: isStart || isEnd ? primaryTextColor(primary) : (isDisabled ? "rgba(0,0,0,0.25)" : textDefault),
                              border: isStart || isEnd ? `1px solid ${primary}` : `1px solid transparent`,
                            };

                            return (
                              <button
                                key={`${wi}-${di}`}
                                onClick={() => handleDayClick(day)}
                                disabled={isDisabled}
                                style={baseStyle}
                                aria-pressed={isInRange}
                                title={day ? day.toLocaleDateString() : ""}
                              >
                                {day ? day.getDate() : ""}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* pills */}
                    <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${panelBorder}`, background: panelBg, fontSize: 12 }}>
                        {startDate ? toInputDate(startDate) : "—"}
                      </div>
                      <div style={{ color: muted }}>→</div>
                      <div style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${panelBorder}`, background: panelBg, fontSize: 12 }}>
                        {endDate ? toInputDate(endDate) : "—"}
                      </div>
                    </div>

                    {/* compact actions */}
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button onClick={() => setDateOpen(false)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${panelBorder}`, background: panelBg }}>Cancel</button>
                      <button onClick={() => { setDateOpen(false); /* hook to fetch */ }} style={{ padding: "8px 12px", borderRadius: 8, background: primary, color: primaryTextColor(primary) }}>Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={smallPaleStyle}>Sort By</div>
        </div>
      </div>

      {/* Empty / placeholder state */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(0,0,0,0.04)" }}>
          <div style={{ width: 128, height: 160, background: panelBg, borderRadius: 12, padding: 12, boxShadow: "inset 0 1px 0 rgba(0,0,0,0.02)" }}>
            <div style={{ height: 10, width: "48%", background: "rgba(0,0,0,0.06)", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 10, width: "68%", background: "rgba(0,0,0,0.04)", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 10, width: "48%", background: "rgba(0,0,0,0.04)", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 10, width: "36%", background: "rgba(0,0,0,0.04)", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 10, width: "80%", background: "rgba(0,0,0,0.04)", borderRadius: 6 }} />
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 18, color: textDefault }}>No Transactions Found</h2>

        {info.desc && <p style={{ color: muted, marginTop: 8, maxWidth: 640, textAlign: "center" }}>{info.desc}</p>}
      </div>
    </div>
  );
}

/* small helper: returns readable text color for primary buttons (white or near-white) */
function primaryTextColor(primaryVar) {
  // We can't compute actual contrast here (no DOM computed color), so return white as safe default.
  return "white";
}
