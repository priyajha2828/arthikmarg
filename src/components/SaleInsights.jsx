// src/components/SaleInsights.jsx
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
 * Theme-aware Sales Insights
 * - Reads CSS variables (provided by your ThemeProvider) with sensible fallbacks
 * - Applies theme colors to buttons, background, text and the recharts chart
 *
 * Usage: <SaleInsights />
 */

export default function SaleInsights() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext || {});

  // pull colors from CSS variables (ThemeProvider should set these)
  const primary = "var(--primary-500, #10B981)"; // green-ish
  const primaryDark = "var(--primary-600, #059669)";
  const bg = "var(--bg-default, #ffffff)";
  const surface = "var(--surface-200, #f3f4f6)"; // page surface / light gray
  const text = "var(--text-default, #0f172a)";
  const muted = "var(--muted, rgba(0,0,0,0.6))";
  const border = "var(--border, rgba(0,0,0,0.06))";
  const accent = "var(--accent-400, #3b82f6)";

  const [salesTab, setSalesTab] = useState("daily");

  const salesData = useMemo(
    () => ({
      daily: [
        { day: "Mon", sales: 2000 },
        { day: "Tue", sales: 2500 },
        { day: "Wed", sales: 1800 },
        { day: "Thu", sales: 3000 },
        { day: "Fri", sales: 3500 },
        { day: "Sat", sales: 2000 },
        { day: "Sun", sales: 4000 },
      ],
      weekly: [
        { week: "Asw 19 - Asw 25", sales: 12000 },
        { week: "Asw 26 - Kar 01", sales: 15000 },
        { week: "Kar 02 - Kar 08", sales: 10000 },
        { week: "Kar 09 - Kar 15", sales: 18000 },
        { week: "Kar 16 - Kar 22", sales: 20000 },
        { week: "Kar 23 - Kar 29", sales: 15000 },
        { week: "Kar 30 - Man 06", sales: 22000 },
      ],
      monthly: [
        { month: "Asw", sales: 50000 },
        { month: "Kar", sales: 70000 },
        { month: "Man", sales: 65000 },
      ],
      quarterly: [
        { quarter: "Q1", sales: 120000 },
        { quarter: "Q2", sales: 150000 },
        { quarter: "Q3", sales: 130000 },
        { quarter: "Q4", sales: 170000 },
      ],
    }),
    []
  );

  const getKey = () =>
    salesTab === "daily"
      ? "day"
      : salesTab === "weekly"
      ? "week"
      : salesTab === "monthly"
      ? "month"
      : "quarter";

  const totalSales = useMemo(
    () => salesData[salesTab].reduce((sum, d) => sum + d.sales, 0),
    [salesData, salesTab]
  );

  // inline theme-aware styles
  const pageStyle = {
    background: surface,
    color: text,
    minHeight: "100%",
    padding: 24,
  };

  const cardStyle = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 1px 4px rgba(2,6,23,0.04)",
  };

  const tabBtnBase = {
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    border: `1px solid ${border}`,
    cursor: "pointer",
    background: "transparent",
    color: text,
  };

  const tabActiveStyle = {
    background: primary,
    color: "white",
    border: `1px solid ${primaryDark}`,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  };

  const backBtnStyle = {
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              style={backBtnStyle}
            >
              Back
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: text }}>
              Sales Insights
            </h2>
          </div>

          <div style={{ color: muted, fontSize: 13 }}>
            {/* small theme indicator (optional) */}
            {theme ? `Theme: ${theme}` : null}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["daily", "weekly", "monthly", "quarterly"].map((tab) => {
            const isActive = salesTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSalesTab(tab)}
                style={{ ...(tabBtnBase || {}), ...(isActive ? tabActiveStyle : {}) }}
                aria-pressed={isActive}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ height: 320, marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData[salesTab]}>
              <CartesianGrid strokeDasharray="3 3" stroke={border} />
              <XAxis
                dataKey={getKey()}
                stroke={muted}
                tick={{ fill: text }}
                axisLine={{ stroke: border }}
              />
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
                dataKey="sales"
                stroke={primary}
                strokeWidth={2}
                dot={{ r: 3, stroke: primaryDark, strokeWidth: 2, fill: bg }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Sales */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, color: text }}>
            Total{" "}
            {salesTab.charAt(0).toUpperCase() + salesTab.slice(1)} Sales:
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: primary }}>
            Rs. {totalSales.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
