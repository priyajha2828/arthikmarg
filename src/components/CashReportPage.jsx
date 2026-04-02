// src/pages/CashReportPage.jsx
import React, { useRef, useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";

/* ---------- Theme detection helpers ---------- */
function detectTheme() {
  if (typeof document === "undefined") return "light";
  const html = document.documentElement;
  const dt = html?.dataset?.theme;
  if (dt) return dt === "dark" ? "dark" : "light";
  if (html?.classList?.contains("dark")) return "dark";
  const ls = typeof window !== "undefined" ? window.localStorage?.getItem("theme") : null;
  if (ls) return ls === "dark" ? "dark" : "light";
  return "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "theme") setTheme(e.newValue === "dark" ? "dark" : "light");
    }
    const mo = new MutationObserver(() => setTheme(detectTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    window.addEventListener("storage", onStorage);
    const tick = setInterval(() => setTheme(detectTheme()), 1000);
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(tick);
    };
  }, []);
  return theme;
}

/* ---------- Date helpers (AD) ---------- */
const pad2 = (n) => `${n}`.padStart(2, "0");
const formatAD = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
const startOfYesterday = () => {
  const t = new Date();
  t.setDate(t.getDate() - 1);
  return startOfDay(t);
};
const endOfYesterday = () => {
  const t = new Date();
  t.setDate(t.getDate() - 1);
  return endOfDay(t);
};
const startOfWeek = (d = new Date()) => {
  const day = d.getDay();
  const copy = new Date(d);
  copy.setDate(d.getDate() - day);
  return startOfDay(copy);
};
const endOfWeek = (d = new Date()) => {
  const s = startOfWeek(d);
  const copy = new Date(s);
  copy.setDate(s.getDate() + 6);
  return endOfDay(copy);
};
const startOfYear = (d = new Date()) => new Date(d.getFullYear(), 0, 1);
const endOfYear = (d = new Date()) => new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);

/* ---------- Quick ranges helpers ---------- */
const canonicalRangeForKey = (key) => {
  const now = new Date();
  switch (key) {
    case "all":
      return { start: null, end: null };
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "yesterday":
      return { start: startOfYesterday(), end: endOfYesterday() };
    case "thisWeek":
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case "thisMonth":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "lastMonth": {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { start: startOfMonth(last), end: endOfMonth(last) };
    }
    case "thisFiscalYear":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "thisYear":
      return { start: startOfYear(now), end: endOfYear(now) };
    default:
      return { start: null, end: null };
  }
};

const labelForKey = {
  all: "All Date",
  today: "Today",
  yesterday: "Yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  thisFiscalYear: "This Fiscal Year",
  thisYear: "This Year",
};

const rangesEqual = (a, b) => {
  const as = a && a.start ? a.start.getTime() : null;
  const ae = a && a.end ? a.end.getTime() : null;
  const bs = b && b.start ? b.start.getTime() : null;
  const be = b && b.end ? b.end.getTime() : null;
  return as === bs && ae === be;
};

const keyForRange = (range) => {
  const keys = Object.keys(labelForKey);
  for (let k of keys) {
    const canonical = canonicalRangeForKey(k);
    if (rangesEqual(range, canonical)) return k;
  }
  return null;
};

/* ---------- month-grid calendar helpers ---------- */
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

/* ---------- Component ---------- */
export default function CashReportPage() {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const location = useLocation();

  const reportData = (location.state && location.state.reportData) || [];
  const closingBalance = (location.state && location.state.closingBalance) || 0;
  const printRef = useRef(null);

  // theme
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  // colors / surfaces
  const pageBg = isDark ? "#071029" : "#F3F4F6"; // light grey page bg
  const panelBg = isDark ? "#071425" : "#FFFFFF";
  const panelBorder = isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)";
  const mutedText = isDark ? "#9CA3AF" : "#6B7280";
  const textColor = isDark ? "#E6EEF8" : "#0F172A";
  const controlBg = isDark ? "#082033" : "#FFFFFF";
  const controlBorder = isDark ? "rgba(255,255,255,0.04)" : "#E5E7EB";

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState({ start: null, end: null });

  // store applied BS strings so printed header can use them
  const [appliedRangeBs, setAppliedRangeBs] = useState({ start: "", end: "" });

  // picker state
  const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState({ start: null, end: null });
  const [tempRangeBs, setTempRangeBs] = useState({ start: "", end: "" });
  const [tempQuickKey, setTempQuickKey] = useState(null);

  // small inline calendar toggles (still kept for optional use)
  const [showStartInlineCal, setShowStartInlineCal] = useState(false);
  const [showEndInlineCal, setShowEndInlineCal] = useState(false);

  // fixed picker positioning refs
  const pickerButtonRef = useRef(null);
  const pickerRef = useRef(null);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0, width: 780 });

  // month-grid calendar view state (for big calendar on right)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const weeks = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  useEffect(() => {
    if (!showPicker) return;
    const d = tempRange.start ? new Date(tempRange.start) : new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPicker]);

  // compute fixed popover position when opening (keeps popover visible)
  const openPicker = () => {
    setTempRange({ start: filterRange.start, end: filterRange.end });
    setTempQuickKey(keyForRange(filterRange));
    setTempRangeBs({ start: appliedRangeBs.start || "", end: appliedRangeBs.end || "" });
    setShowStartInlineCal(false);
    setShowEndInlineCal(false);

    const btn = pickerButtonRef.current && pickerButtonRef.current.getBoundingClientRect();
    const popW = 780;
    const popH = 420; // approximate height
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    let left = scrollX + (btn ? btn.left : Math.max(8, (window.innerWidth - popW) / 2));
    if (left + popW > scrollX + window.innerWidth - 12) {
      left = scrollX + window.innerWidth - popW - 12;
    }
    if (left < scrollX + 8) left = scrollX + 8;

    let top = scrollY + (btn ? btn.bottom : Math.max(80, (window.innerHeight - popH) / 2));
    if (top + popH > scrollY + window.innerHeight - 12 && btn) {
      top = scrollY + btn.top - popH - 8;
    }
    if (top < scrollY + 8) top = scrollY + 8;

    setPickerPos({ top, left, width: popW });
    setShowPicker(true);
  };

  const applyQuickRangeToTemp = (key) => {
    const { start: s, end: e } = canonicalRangeForKey(key);
    setTempRange({ start: s, end: e });
    setTempQuickKey(key);
    setTempRangeBs({ start: "", end: "" });
    setShowStartInlineCal(false);
    setShowEndInlineCal(false);

    const d = s ? new Date(s) : new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const applyPicker = () => {
    setFilterRange({ start: tempRange.start, end: tempRange.end });
    setTempQuickKey(keyForRange({ start: tempRange.start, end: tempRange.end }));
    setAppliedRangeBs({ start: tempRangeBs.start || "", end: tempRangeBs.end || "" });
    setShowPicker(false);
    setShowStartInlineCal(false);
    setShowEndInlineCal(false);
  };

  const cancelPicker = () => {
    setTempRange({ start: filterRange.start, end: filterRange.end });
    setTempQuickKey(keyForRange(filterRange));
    setTempRangeBs({ start: appliedRangeBs.start || "", end: appliedRangeBs.end || "" });
    setShowPicker(false);
    setShowStartInlineCal(false);
    setShowEndInlineCal(false);
  };

  const onStartInlineCalChange = ({ bsDate, adDate }) => {
    if (!adDate) return;
    const d = new Date(adDate);
    setTempRange((p) => ({ ...p, start: startOfDay(d) }));
    setTempRangeBs((p) => ({ ...p, start: bsDate || "" }));
    setTempQuickKey(null);
    setShowStartInlineCal(false);
  };

  const onEndInlineCalChange = ({ bsDate, adDate }) => {
    if (!adDate) return;
    const d = new Date(adDate);
    setTempRange((p) => ({ ...p, end: endOfDay(d) }));
    setTempRangeBs((p) => ({ ...p, end: bsDate || "" }));
    setTempQuickKey(null);
    setShowEndInlineCal(false);
  };

  // parse row date robustly
  const parseRowDate = (d) => {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (!isNaN(Number(d))) return new Date(Number(d));
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) return parsed;
    const m = String(d).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      const day = parseInt(m[1], 10);
      const month = parseInt(m[2], 10) - 1;
      const year = parseInt(m[3], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  // filtered data uses applied filterRange + searchTerm
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const s = filterRange.start ? new Date(filterRange.start).getTime() : null;
    const e = filterRange.end ? new Date(filterRange.end).getTime() : null;

    return reportData.filter((row) => {
      if (s != null && e != null) {
        const dt = parseRowDate(row.date);
        if (!dt) return false;
        const t = dt.getTime();
        if (t < s || t > e) return false;
      }
      if (q === "") return true;
      const fields = [
        row.date || "",
        row.type || "",
        row.remarks || "",
        row.moneyIn != null ? String(row.moneyIn) : "",
        row.moneyOut != null ? String(row.moneyOut) : "",
        row.balance != null ? String(row.balance) : "",
      ]
        .join(" ")
        .toLowerCase();
      return fields.indexOf(q) !== -1;
    });
  }, [reportData, searchTerm, filterRange]);

  // Excel export
  function handleDownloadExcel() {
    const rows = filteredData.map((row) => ({
      Date: row.date,
      Particular: row.type,
      "Notes/Remarks": row.remarks || "",
      "Money In": row.moneyIn || "",
      "Money Out": row.moneyOut || "",
      Balance: row.balance || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{}]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cash Report");
    XLSX.writeFile(workbook, `Cash_Report${accountId ? `_${accountId}` : ""}.xlsx`);
  }

  /* ---------- Printing via hidden iframe (unchanged logic) ---------- */
  const buildPrintableHtml = () => {
    const companyName = "Something";
    const companyPhone = "9820318652";
    const logoSvg = `<svg width="90" height="28" viewBox="0 0 90 28" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="2" width="18" height="24" rx="3" fill="#10B981" /></svg>`;

    const fromLabel = appliedRangeBs.start || (filterRange.start ? formatAD(filterRange.start) : "—");
    const toLabel = appliedRangeBs.end || (filterRange.end ? formatAD(filterRange.end) : "—");

    const now = new Date();
    const generatedOnAD = `${formatAD(now)} • ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const totalEntries = filteredData.length;

    const rowsHtml = filteredData
      .map((r) => {
        const moneyIn = r.moneyIn ? `Rs. ${Number(r.moneyIn).toLocaleString()}` : "---";
        const moneyOut = r.moneyOut ? `Rs. ${Number(r.moneyOut).toLocaleString()}` : "---";
        const balance = `Rs. ${Number(r.balance || 0).toLocaleString()}`;
        return `
          <tr>
            <td style="padding:8px 10px;border:1px solid #e6edf3;">${r.date || ""}</td>
            <td style="padding:8px 10px;border:1px solid #e6edf3;">${r.type || ""}</td>
            <td style="padding:8px 10px;border:1px solid #e6edf3;">${r.remarks || ""}</td>
            <td style="padding:8px 10px;border:1px solid #e6edf3;text-align:right;">${moneyIn}</td>
            <td style="padding:8px 10px;border:1px solid #e6edf3;text-align:right;">${moneyOut}</td>
            <td style="padding:8px 10px;border:1px solid #e6edf3;text-align:right;">${balance}</td>
          </tr>
        `;
      })
      .join("");

    const tableBody =
      rowsHtml ||
      `<tr><td colspan="6" style="padding:18px;text-align:center;color:#6b7280;border:1px solid #e6edf3;">No transactions found</td></tr>`;

    const styles = `
      <style>
        @media print { body { -webkit-print-color-adjust: exact; } }
        body { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; color:#0f172a; margin:20px; }
        .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        .company { font-size:18px; font-weight:700; }
        .phone { font-size:13px; color:#374151; margin-top:4px; }
        .title { font-size:16px; font-weight:600; margin-top:18px; margin-bottom:8px; }
        .meta { display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px; align-items:flex-start; }
        .balance { font-weight:600; color:#111827; text-align:right; }
        table.report { width:100%; border-collapse:separate; border-spacing:0; border:1px solid #e6edf3; border-radius:6px; overflow:hidden; }
        table.report thead th { background:#f8fafc; color:#374151; font-weight:600; text-align:left; padding:10px 12px; border-bottom:1px solid #e6edf3; }
        td { font-size:13px; vertical-align:top; }
        .small { font-size:12px; color:#6b7280; }
      </style>
    `;

    return `
      <html>
        <head><title>Cash Report</title>${styles}</head>
        <body>
          <div class="header">
            <div>
              <div class="company">${companyName}</div>
              <div class="phone">${companyPhone}</div>
            </div>
            <div>${logoSvg}</div>
          </div>

          <hr style="border:none;border-top:1px solid #e6edf3;margin:8px 0 16px 0;" />

          <div style="display:flex;justify-content:space-between;">
            <div>
              <div class="title">Cash In Hand Statement</div>
              <div style="font-size:13px;color:#374151;">
                <div><strong>From:</strong> ${fromLabel}</div>
                <div><strong>To:</strong> ${toLabel}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div class="small">Closing Balance:</div>
              <div class="balance">Rs. ${Number(closingBalance || 0).toLocaleString()}</div>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:12px;margin-bottom:8px;">
            <div class="small">Total entries: ${totalEntries}</div>
            <div class="small">Report Generated on ${generatedOnAD}</div>
          </div>

          <table class="report">
            <thead>
              <tr>
                <th style="padding:10px 12px;">Date</th>
                <th style="padding:10px 12px;">Particular</th>
                <th style="padding:10px 12px;">Notes/Remarks</th>
                <th style="padding:10px 12px;text-align:right;">Money In</th>
                <th style="padding:10px 12px;text-align:right;">Money Out</th>
                <th style="padding:10px 12px;text-align:right;">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${tableBody}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const printViaIframe = (html) => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.style.visibility = "hidden";

      if ("srcdoc" in iframe) {
        iframe.srcdoc = html;
      } else {
        iframe.src = "about:blank";
      }

      document.body.appendChild(iframe);

      const removeIframe = () => {
        try {
          document.body.removeChild(iframe);
        } catch (e) {
          /* noop */
        }
      };

      const doPrintFromIframe = () => {
        try {
          const iwin = iframe.contentWindow || iframe.contentDocument;
          if (!iwin) {
            alert("Unable to access print frame. Try allowing popups or print manually.");
            removeIframe();
            return;
          }
          iwin.focus();
          iwin.print();
        } catch (err) {
          console.error("iframe print error:", err);
          alert("Print failed — check console for details.");
        } finally {
          setTimeout(removeIframe, 700);
        }
      };

      iframe.onload = () => {
        setTimeout(doPrintFromIframe, 120);
      };

      if (!("srcdoc" in iframe)) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        iframe.onload = () => setTimeout(doPrintFromIframe, 120);
        setTimeout(() => {
          try {
            doPrintFromIframe();
          } catch (e) {
            /* noop */
          }
        }, 500);
      }
    } catch (e) {
      console.error("printViaIframe unexpected error:", e);
      alert("Print failed unexpectedly — check console.");
    }
  };

  // main print handler: commit picker if open, then print via iframe
  const handlePrintClick = () => {
    if (showPicker) {
      setFilterRange({ start: tempRange.start, end: tempRange.end });
      setAppliedRangeBs({ start: tempRangeBs.start || "", end: tempRangeBs.end || "" });
      setShowPicker(false);
      setShowStartInlineCal(false);
      setShowEndInlineCal(false);
      setTimeout(() => {
        const html = buildPrintableHtml();
        printViaIframe(html);
      }, 160);
    } else {
      const html = buildPrintableHtml();
      printViaIframe(html);
    }
  };

  // small UI helpers
  const labelForRange = (range, quickKey) => {
    const key = quickKey || keyForRange(range);
    if (key) return labelForKey[key];
    if (!range || (!range.start && !range.end)) return "All Date";
    return `${formatAD(range.start)} → ${formatAD(range.end)}`;
  };

  const selectedRangeLabel = () => {
    if (showPicker) {
      const key = tempQuickKey || keyForRange(tempRange);
      return labelForRange(tempRange, key);
    }
    return labelForRange(filterRange, null);
  };

  const appliedQuick = keyForRange(filterRange);

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Close fixed picker when clicking outside (pickerRef and button)
  useEffect(() => {
    function onDocDown(e) {
      if (!showPicker) return;
      if (pickerRef.current && pickerRef.current.contains(e.target)) return;
      if (pickerButtonRef.current && pickerButtonRef.current.contains(e.target)) return;
      setShowPicker(false);
      setShowStartInlineCal(false);
      setShowEndInlineCal(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [showPicker]);

  // ---------- big calendar helpers ----------
  const dayKey = (d) => {
    if (!d) return null;
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  };

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    return dayKey(a) === dayKey(b);
  };

  const inRange = (day, start, end) => {
    if (!day || !start || !end) return false;
    const t = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return t >= s && t <= e;
  };

  const handleBigCalDayClick = (day) => {
    if (!day) return;
    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: startOfDay(day), end: null });
      setTempRangeBs({ start: "", end: "" });
      setTempQuickKey(null);
    } else if (tempRange.start && !tempRange.end) {
      const a = startOfDay(tempRange.start);
      const b = startOfDay(day);
      if (b.getTime() < a.getTime()) {
        setTempRange({ start: startOfDay(day), end: null });
      } else {
        setTempRange({ start: a, end: endOfDay(b) });
      }
      setTempRangeBs({ start: "", end: "" });
      setTempQuickKey(null);
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

  // ---------- RENDER ----------
  return (
    <div style={{ background: pageBg, minHeight: "100vh", padding: 24 }}>
      <div className="max-w-7xl mx-auto relative" style={{ color: textColor }}>
        {/* header & controls */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => navigate(-1)} className="text-gray-600 hover:underline" style={{ color: mutedText }}>
                ←
              </button>
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: textColor }}>
                  Cash In Hand Statement
                </h1>
                <span className="text-sm" style={{ color: mutedText }}>
                  ({accountId || "all"})
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions (date, type, remarks, amount...)"
                className="border rounded-lg px-4 py-2 w-64 focus:outline-none"
                style={{
                  background: controlBg,
                  borderColor: controlBorder,
                  color: textColor,
                }}
              />

              {/* Date range button that opens picker */}
              <div className="relative">
                <button
                  ref={pickerButtonRef}
                  onClick={() => {
                    if (!showPicker) openPicker();
                    else setShowPicker(false);
                  }}
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    background: controlBg,
                    borderColor: controlBorder,
                    color: textColor,
                  }}
                >
                  {selectedRangeLabel()}
                </button>

                {/* FIXED position picker (two-column UI) */}
                {showPicker && (
                  <div
                    ref={pickerRef}
                    className="fixed z-50 rounded-lg shadow-lg p-4 grid"
                    style={{
                      gridTemplateColumns: "200px 1fr",
                      gap: 16,
                      top: pickerPos.top,
                      left: pickerPos.left,
                      width: pickerPos.width,
                      maxWidth: "calc(100% - 24px)",
                      background: panelBg,
                      border: `1px solid ${panelBorder}`,
                      color: textColor,
                    }}
                  >
                    {/* LEFT: quick ranges */}
                    <div style={{ borderRight: `1px solid ${panelBorder}`, paddingRight: 12 }}>
                      <ul className="text-sm space-y-2">
                        {[
                          { key: "all", label: "All Date" },
                          { key: "today", label: "Today" },
                          { key: "yesterday", label: "Yesterday" },
                          { key: "thisWeek", label: "This Week" },
                          { key: "thisMonth", label: "This Month" },
                          { key: "lastMonth", label: "Last Month" },
                          { key: "thisFiscalYear", label: "This Fiscal Year" },
                          { key: "thisYear", label: "This Year" },
                        ].map((it) => {
                          const isTempActive = tempQuickKey === it.key;
                          const isAppliedActive = appliedQuick === it.key;
                          return (
                            <li key={it.key}>
                              <button
                                onClick={() => applyQuickRangeToTemp(it.key)}
                                className="w-full text-left px-3 py-2 rounded flex items-center justify-between"
                                style={{
                                  background: isTempActive ? (isDark ? "rgba(16,185,129,0.06)" : "#ECFDF5") : "transparent",
                                  border: isTempActive ? `1px solid rgba(16,185,129,0.25)` : "none",
                                  color: textColor,
                                }}
                              >
                                <span>{it.label}</span>
                                {isTempActive && <span className="ml-2"><CheckIcon /></span>}
                                {!isTempActive && isAppliedActive && <span className="text-xs" style={{ color: "#059669" }}>✓</span>}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* RIGHT: big month-grid calendar + start/end pills + preview + footer */}
                    <div>
                      {/* Top row: BS start pill, arrow, BS end pill */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm w-40 justify-center" style={{ background: controlBg, border: `1px solid ${controlBorder}`, color: textColor }}>
                          {tempRangeBs.start || (tempRange.start ? formatAD(tempRange.start) : "—")}
                        </div>
                        <div className="text-sm" style={{ color: mutedText }}>→</div>
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm w-40 justify-center" style={{ background: controlBg, border: `1px solid ${controlBorder}`, color: textColor }}>
                          {tempRangeBs.end || (tempRange.end ? formatAD(tempRange.end) : "—")}
                        </div>
                      </div>

                      {/* Month header */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between px-2">
                          <button onClick={prevMonth} className="p-1 rounded" style={{ color: mutedText }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={mutedText} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>

                          <div className="text-sm font-medium" style={{ color: textColor }}>
                            {new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
                          </div>

                          <button onClick={nextMonth} className="p-1 rounded" style={{ color: mutedText }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={mutedText} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </div>

                      {/* Weekday headers */}
                      <div className="grid grid-cols-7 gap-1 text-[11px] mb-2" style={{ color: mutedText }}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                          <div key={d} className="text-center py-1">{d}</div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {weeks.map((week, wi) =>
                          week.map((day, di) => {
                            const isDisabled = !day;
                            const isStart = day && tempRange.start && isSameDay(day, new Date(tempRange.start));
                            const isEnd = day && tempRange.end && isSameDay(day, new Date(tempRange.end));
                            const isBetween = day && tempRange.start && tempRange.end && inRange(day, tempRange.start, tempRange.end);
                            return (
                              <button
                                key={`${wi}-${di}`}
                                onClick={() => handleBigCalDayClick(day)}
                                disabled={isDisabled}
                                className={`h-10 flex items-center justify-center text-sm rounded ${isDisabled ? "text-gray-400 cursor-default" : "cursor-pointer"} ${isStart || isEnd ? "bg-emerald-600 text-white" : ""} ${isBetween && !(isStart || isEnd) ? "bg-emerald-100 text-emerald-800" : ""}`}
                                style={{
                                  background: isStart || isEnd ? "#059669" : isBetween ? (isDark ? "rgba(16,185,129,0.06)" : "#ECFDF5") : "transparent",
                                  color: isStart || isEnd ? "#fff" : textColor,
                                  border: `1px solid ${isDisabled ? "transparent" : panelBorder}`,
                                }}
                              >
                                {day ? day.getDate() : ""}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Preview */}
                      <div className="mt-4 mb-3">
                        <div className="text-xs" style={{ color: mutedText, marginBottom: 6 }}>Preview</div>
                        <div className="p-3 rounded text-sm" style={{ background: isDark ? "#031322" : "#F8FAFC", color: textColor }}>
                          {tempRange.start && tempRange.end ? `${formatAD(tempRange.start)} → ${formatAD(tempRange.end)}` : "All Date"}
                        </div>
                      </div>

                      {/* Footer: Cancel / Apply */}
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={cancelPicker} className="px-3 py-2 rounded border text-sm" style={{ borderColor: panelBorder, color: mutedText }}>Cancel</button>
                        <button onClick={applyPicker} className="px-3 py-2 rounded bg-emerald-600 text-white text-sm">Apply</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setSearchTerm("")} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: controlBorder, color: mutedText }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-6" style={{ marginTop: 8 }}>
          <button onClick={handlePrintClick} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border" style={{ background: controlBg, borderColor: controlBorder, color: textColor }}>
            Print PDF
          </button>
          <button onClick={handleDownloadExcel} className="inline-flex items-center gap-2 px-4 py-2 rounded-md" style={{ background: "#10B981", color: "#fff" }}>
            Download Excel
          </button>
        </div>

        {/* printable content preview inside app */}
        <div ref={printRef} className="mt-6">
          <div className="mb-6">
            <div style={{ background: panelBg, border: `1px solid ${panelBorder}`, padding: 16, borderRadius: 12, width: 260 }}>
              <div className="text-xl font-bold" style={{ color: textColor }}>Rs. {Number(closingBalance).toLocaleString()}</div>
              <div className="text-sm" style={{ color: mutedText }}>Closing Balance</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0, borderRadius: 8 }}>
              <thead style={{ background: isDark ? "#071425" : "#F8FAFC", color: mutedText }}>
                <tr>
                  <th className="p-3 text-left" style={{ color: mutedText }}>Date</th>
                  <th className="p-3 text-left" style={{ color: mutedText }}>Particular</th>
                  <th className="p-3 text-left" style={{ color: mutedText }}>Notes/Remarks</th>
                  <th className="p-3 text-left" style={{ color: mutedText }}>Money In</th>
                  <th className="p-3 text-left" style={{ color: mutedText }}>Money Out</th>
                  <th className="p-3 text-left" style={{ color: mutedText }}>Balance</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center" style={{ color: mutedText }}>
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${panelBorder}` }}>
                      <td className="p-3" style={{ color: textColor }}>{row.date}</td>
                      <td className="p-3" style={{ color: textColor }}>{row.type}</td>
                      <td className="p-3" style={{ color: mutedText }}>{row.remarks || "--"}</td>
                      <td className="p-3" style={{ color: textColor }}>{row.moneyIn ? `Rs. ${Number(row.moneyIn).toLocaleString()}` : "--"}</td>
                      <td className="p-3" style={{ color: textColor }}>{row.moneyOut ? `Rs. ${Number(row.moneyOut).toLocaleString()}` : "--"}</td>
                      <td className="p-3" style={{ color: textColor }}>Rs. {Number(row.balance || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
