// src/components/PurchaseInsights.jsx
import React, { useContext, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Theme-aware PurchaseInsights
 * - Reads CSS variables from ThemeProvider (via ThemeContext) with safe fallbacks
 * - Uses those colors for chart, buttons and background
 *
 * Usage: <PurchaseInsights />
 */

export default function PurchaseInsights() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext || {});

  const [purchaseTab, setPurchaseTab] = useState("daily");

  const purchaseData = useMemo(
    () => ({
      daily: [
        { day: "Mon", purchase: 1500 },
        { day: "Tue", purchase: 1800 },
        { day: "Wed", purchase: 1200 },
        { day: "Thu", purchase: 2000 },
        { day: "Fri", purchase: 2500 },
        { day: "Sat", purchase: 1700 },
        { day: "Sun", purchase: 2200 },
      ],
      weekly: [
        { week: "Asw 19 - Asw 25", purchase: 10000 },
        { week: "Asw 26 - Kar 01", purchase: 12000 },
        { week: "Kar 02 - Kar 08", purchase: 9000 },
        { week: "Kar 09 - Kar 15", purchase: 15000 },
        { week: "Kar 16 - Kar 22", purchase: 16000 },
        { week: "Kar 23 - Kar 29", purchase: 13000 },
        { week: "Kar 30 - Man 06", purchase: 18000 },
      ],
      monthly: [
        { month: "Asw", purchase: 45000 },
        { month: "Kar", purchase: 60000 },
        { month: "Man", purchase: 55000 },
      ],
      quarterly: [
        { quarter: "Q1", purchase: 120000 },
        { quarter: "Q2", purchase: 140000 },
        { quarter: "Q3", purchase: 130000 },
        { quarter: "Q4", purchase: 160000 },
      ],
    }),
    []
  );

  const getKey = () =>
    purchaseTab === "daily"
      ? "day"
      : purchaseTab === "weekly"
      ? "week"
      : purchaseTab === "monthly"
      ? "month"
      : "quarter";

  const totalPurchase = useMemo(
    () => purchaseData[purchaseTab].reduce((sum, d) => sum + d.purchase, 0),
    [purchaseData, purchaseTab]
  );

  // theme-aware CSS variables with fallbacks
  const bg = "var(--bg-default, #ffffff)";
  const surface = "var(--surface-200, #f3f4f6)"; // page background
  const text = "var(--text-default, #0f172a)";
  const muted = "var(--muted, rgba(0,0,0,0.6))";
  const border = "var(--border, rgba(0,0,0,0.06))";
  const danger = "var(--danger-500, #ef4444)";
  const dangerDark = "var(--danger-600, #dc2626)";
  const primary = "var(--primary-500, #10B981)"; // kept for accents if needed

  // inline styles
  const pageStyle = {
    background: surface,
    color: text,
    padding: 24,
    minHeight: "100%",
  };

  const cardStyle = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 6px 20px rgba(2,6,23,0.04)",
  };

  const tabBase = {
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    border: `1px solid ${border}`,
    cursor: "pointer",
    background: "transparent",
    color: text,
  };

  const tabActive = {
    background: danger,
    color: "#fff",
    border: `1px solid ${dangerDark}`,
    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
  };

  const backBtn = {
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${border}`,
    background: bg,
    cursor: "pointer",
    color: text,
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => navigate(-1)} style={backBtn} aria-label="Back">
              Back
            </button>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: text }}>Purchase Insights</h2>
          </div>

          <div style={{ color: muted, fontSize: 13 }}>{theme ? `Theme: ${theme}` : null}</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["daily", "weekly", "monthly", "quarterly"].map((tab) => {
            const active = purchaseTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setPurchaseTab(tab)}
                style={{ ...(tabBase || {}), ...(active ? tabActive : {}) }}
                aria-pressed={active}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ height: 320, marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={purchaseData[purchaseTab]}>
              <CartesianGrid strokeDasharray="3 3" stroke={border} />
              <XAxis dataKey={getKey()} stroke={muted} tick={{ fill: text }} axisLine={{ stroke: border }} />
              <YAxis stroke={muted} tick={{ fill: text }} axisLine={{ stroke: border }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, rgba(255,255,255,0.98))",
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                }}
                itemStyle={{ color: text }}
              />
              <Line
                type="monotone"
                dataKey="purchase"
                stroke={danger}
                strokeWidth={2}
                dot={{ r: 3, stroke: dangerDark, strokeWidth: 2, fill: bg }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, color: text }}>
            Total {purchaseTab.charAt(0).toUpperCase() + purchaseTab.slice(1)} Purchase:
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: danger }}>
            Rs. {totalPurchase.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
