// src/components/ExpenseInsights.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

/**
 * ExpenseInsights (theme-aware)
 * - Detects theme from: document.documentElement.dataset.theme, html.dark, localStorage.theme
 * - Watches for changes and updates UI (MutationObserver + storage event + defensive interval)
 * - Applies light grey page bg in light mode and darker bg in dark mode
 * - Adjusts chart colors (grid, axes, tooltip, line) to match theme
 */

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
    const tick = setInterval(() => setTheme(detectTheme()), 1000); // defensive fallback
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(tick);
    };
  }, []);
  return theme;
}

export default function ExpenseInsights() {
  const navigate = useNavigate();
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  const [expenseTab, setExpenseTab] = useState("daily");

  const expenseData = {
    daily: [
      { day: "Mon", expense: 1000 },
      { day: "Tue", expense: 1200 },
      { day: "Wed", expense: 900 },
      { day: "Thu", expense: 1500 },
      { day: "Fri", expense: 1700 },
      { day: "Sat", expense: 1300 },
      { day: "Sun", expense: 2000 },
    ],
    weekly: [
      { week: "Asw 19 - Asw 25", expense: 8000 },
      { week: "Asw 26 - Kar 01", expense: 10000 },
      { week: "Kar 02 - Kar 08", expense: 7000 },
      { week: "Kar 09 - Kar 15", expense: 12000 },
      { week: "Kar 16 - Kar 22", expense: 15000 },
      { week: "Kar 23 - Kar 29", expense: 11000 },
      { week: "Kar 30 - Man 06", expense: 18000 },
    ],
    monthly: [
      { month: "Asw", expense: 40000 },
      { month: "Kar", expense: 55000 },
      { month: "Man", expense: 50000 },
    ],
    quarterly: [
      { quarter: "Q1", expense: 120000 },
      { quarter: "Q2", expense: 140000 },
      { quarter: "Q3", expense: 130000 },
      { quarter: "Q4", expense: 160000 },
    ],
  };

  const getKey = () =>
    expenseTab === "daily"
      ? "day"
      : expenseTab === "weekly"
      ? "week"
      : expenseTab === "monthly"
      ? "month"
      : "quarter";

  // theme-aware color tokens
  const pageBg = isDark ? "#0b1220" : "#F8FAFC"; // outer background
  const panelBg = isDark ? "#071025" : "#FFFFFF"; // card background
  const textColor = isDark ? "#E6EEF8" : "#0F172A";
  const mutedText = isDark ? "#9CA3AF" : "#6B7280";
  const axisStroke = isDark ? "#374151" : "#6B7280";
  const gridStroke = isDark ? "rgba(255,255,255,0.03)" : "#e5e7eb";
  const tooltipBg = isDark ? "#0b1220" : "#f3f4f6";
  const tooltipText = isDark ? "#e6eef8" : "#0f172a";
  const lineColor = isDark ? "#F97316" : "#EF4444"; // more visible in dark

  const total = expenseData[expenseTab].reduce((sum, d) => sum + d.expense, 0);

  return (
    <div style={{ background: pageBg, minHeight: "100%", transition: "background-color 160ms ease" }}>
      <div className="max-w-5xl mx-auto p-6" style={{ color: textColor }}>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 rounded"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "#E6E7EA",
            color: textColor,
            border: isDark ? "1px solid rgba(255,255,255,0.03)" : undefined,
          }}
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
          Expense Insights
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["daily", "weekly", "monthly", "quarterly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setExpenseTab(tab)}
              className="px-3 py-1 rounded"
              style={
                expenseTab === tab
                  ? {
                      background: "#172554",
                      color: "#fff",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    }
                  : {
                      background: isDark ? "rgba(255,255,255,0.02)" : "#E6E7EA",
                      color: mutedText,
                    }
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{
            background: panelBg,
            border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(15,23,42,0.04)",
          }}
        >
          {/* Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expenseData[expenseTab]}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis dataKey={getKey()} stroke={axisStroke} tick={{ fill: mutedText }} />
                <YAxis stroke={axisStroke} tick={{ fill: mutedText }} />
                <Tooltip
                  wrapperStyle={{ outline: "none" }}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: "none",
                    borderRadius: 8,
                    color: tooltipText,
                  }}
                  itemStyle={{ color: tooltipText }}
                  labelStyle={{ color: tooltipText }}
                />
                <Line type="monotone" dataKey="expense" stroke={lineColor} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Total Expense */}
          <div className="font-semibold" style={{ color: textColor }}>
            Total {expenseTab.charAt(0).toUpperCase() + expenseTab.slice(1)} Expense: Rs. {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
