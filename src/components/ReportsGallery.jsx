// src/components/ReportsGallery.jsx
import React, { useMemo, useState, useContext } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Theme-aware ReportsGallery
 * - Reads CSS variables from ThemeProvider via ThemeContext
 * - Falls back to sensible defaults when variables are absent
 * - Uses theme variables for page background, card background, borders and text
 */

const SECTIONS = [
  {
    id: "transaction",
    title: "Transaction Report",
    items: [
      ["Sales", "View your sales data on a given time"],
      ["Purchase", "View your purchase data on a given time"],
      ["Sales Return", "View your sales return data on a given time"],
      ["Purchase Return", "View your purchase return data on a given time"],
      ["Day Book", "View all of your daily transactions"],
      ["All Transactions", "View all party transactions in a given time"],
      ["Profit And Loss", "View your profit & loss in a givem time"],
    ],
  },
  {
    id: "party",
    title: "Party Report",
    items: [
      ["Party Statement", "Check the transactions of certain party"],
      ["All Party Report", "Receivable/payable dues of every party"],
    ],
  },
  {
    id: "inventory",
    title: "Inventory Report",
    items: [
      ["Item Details Report", "Check stock, transaction of individual item."],
      ["Item List Report", "Shows all the item rates like, sales, purchase, MRP price etc..."],
      ["Low Stock Summary Report", "View all items which are getting low on quantity"],
      ["Stock Quantity Report", "View opening & closing quantity of each item"],
    ],
  },
  {
    id: "income-expense",
    title: "Income Expense Report",
    items: [
      ["Income Expense Report", "Check all the income expense report"],
      ["Expense Category", "Check the categorized expense report in a given date"],
      ["Income Category", "Check the categorized income report in a given date"],
    ],
  },
  {
    id: "business-status",
    title: "Business Status",
    items: [
      ["Cash In Hand Statement", "Check all transaction made with cash"],
      ["Bank Statement", "Check all the transaction made with bank"],
      ["Discount Report", "Check the total discounted amount made by each parties in purchase & sales."],
      ["Tax Sales", "Check report of all Tax applicable sales."],
      ["Tax Purchase", "Check report of all Tax applicable purchase."],
    ],
  },
];

export default function ReportsGallery() {
  const { theme } = useContext(ThemeContext || {});
  const navigate = useNavigate();

  // UI state
  const [active, setActive] = useState("All Reports");
  const [query, setQuery] = useState("");

  const tabs = [
    "All Reports",
    "Transactions",
    "Parties",
    "Inventory",
    "Income Expense",
    "Business Status",
  ];

  // derive theme-driven styles from CSS vars (with fallbacks)
  const pageBg = "var(--surface-200, #f3f4f6)"; // light grey page surface
  const pageText = "var(--text-default, #0f172a)";
  const cardBg = "var(--bg-default, #ffffff)";
  const cardBorder = "var(--border, rgba(0,0,0,0.06))";
  const mutedText = "var(--muted, rgba(0,0,0,0.6))";
  const primary = "var(--primary-500, #16a34a)"; // used for active buttons
  const primaryTextOn = "var(--text-on-primary, #ffffff)";

  const containerStyle = {
    background: pageBg,
    color: pageText,
    minHeight: "calc(100vh - 4rem)",
    padding: "24px",
  };

  const innerCardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 12,
    padding: 20,
  };

  const tabActiveStyle = {
    background: primary,
    color: primaryTextOn,
  };
  const tabInactiveStyle = {
    background: "transparent",
    color: pageText,
    border: `1px solid ${cardBorder}`,
  };

  // navigation helper: slugify title -> route
  const handleClick = (title) => {
    const route = title
      .toLowerCase()
      .replace(/ /g, "-")              // spaces → dashes
      .replace(/&/g, "and")            // & → and
      .replace(/[^a-zA-Z0-9-]/g, "");  // remove invalid chars

    navigate(`/reports/${route}`);
  };

  // Filter sections by active tab
  const sectionsToShow = useMemo(() => {
    if (active === "All Reports") return SECTIONS;
    if (active === "Transactions") return SECTIONS.filter((s) => s.id === "transaction");
    if (active === "Parties") return SECTIONS.filter((s) => s.id === "party");
    if (active === "Inventory") return SECTIONS.filter((s) => s.id === "inventory");
    if (active === "Income Expense") return SECTIONS.filter((s) => s.id === "income-expense");
    if (active === "Business Status") return SECTIONS.filter((s) => s.id === "business-status");
    return SECTIONS;
  }, [active]);

  // Filtered and searched function for display
  const matchesQuery = (title, desc) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  return (
    <div style={containerStyle} className="w-full">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: pageText }}>
          Browse Various Reports
        </h1>

        {/* Tabs + Search */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map((t) => {
              const isActive = active === t;
              return (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  aria-pressed={isActive}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    ...(isActive ? tabActiveStyle : tabInactiveStyle),
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{ width: 300, position: "relative" }}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: mutedText }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports..."
              aria-label="Search reports"
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: 8,
                border: `1px solid ${cardBorder}`,
                background: cardBg,
                color: pageText,
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Sections */}
        <div style={{ ...innerCardStyle }}>
          {sectionsToShow.map((section) => (
            <div key={section.id} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: pageText }}>
                {section.title}
              </h2>

              <div
                className="reports-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {section.items
                  .filter(([title, desc]) => matchesQuery(title, desc))
                  .map(([title, desc]) => (
                    <article
                      key={title}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter") handleClick(title); }}
                      onClick={() => handleClick(title)}
                      className="report-card"
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                        cursor: "pointer",
                        transition: "box-shadow .15s ease, transform .08s ease",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 100,
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: pageText }}>{title}</h3>
                        <p style={{ fontSize: 13, color: mutedText, margin: 0 }}>{desc}</p>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 12, color: mutedText }}>Open</span>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}

          {/* If no section items matched search */}
          {sectionsToShow.every(section => section.items.filter(([t,d]) => matchesQuery(t,d)).length === 0) && (
            <div style={{ padding: 20, textAlign: "center", color: mutedText }}>
              No reports found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
