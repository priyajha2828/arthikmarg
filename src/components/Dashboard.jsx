// src/components/Dashboard.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "./Card";
import AddReminder from "./AddReminder";
import CompleteProfile from "./CompleteProfile";

import { DollarSign, CreditCard, ShoppingCart, Package, BarChart2 } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PaymentInForm from "./PaymentIn";
import PaymentOutForm from "./PaymentOut";
import CreateQuotation from "./CreateQuotation";
import SalesReturn from "./SalesReturn";
import PurchaseReturn from "./PurchaseReturn";
import { ExpensePage } from "./ExpensePage";
import { OtherIncomePage } from "./OtherIncomePage";

import { ThemeContext } from "../context/ThemeContext";

/**
 * Dashboard — theme-aware
 * Only treats 'dark' and 'classic' as special themes.
 * Anything else becomes the default light theme.
 *
 * The useEffect sets CSS variables:
 *  --bg-default (page background)
 *  --surface-100 (card surface)
 *  --surface-200 (page surface)
 *  --text-default
 *  --muted
 *  --primary-500
 *  --on-primary
 *
 * Ensure your global components use those variables.
 */

function ReminderPanel({ reminders = [], open = () => {} }) {
  return (
    <div style={{ background: "var(--surface-100)", color: "var(--text-default)" }} className="p-4 rounded-xl shadow min-h-40">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Reminders</h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Upcoming reminders: {reminders.length}</p>
        </div>
        <button onClick={open} className="px-3 py-1 rounded text-sm" style={{ background: "var(--primary-500)", color: "var(--on-primary)" }}>Open</button>
      </div>
    </div>
  );
}

function BalancePanel() {
  return (
    <div style={{ background: "var(--surface-100)", color: "var(--text-default)" }} className="p-4 rounded-xl shadow min-h-40 flex flex-col justify-between">
      <div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>Total Balance (Cash & Bank)</div>
        <div className="text-2xl font-semibold mt-2">Rs. 0</div>
      </div>
    </div>
  );
}

function ProfilePanel({ profileData = null, open = () => {} }) {
  return (
    <div style={{ background: "var(--surface-100)", color: "var(--text-default)" }} className="p-4 rounded-xl shadow min-h-40 flex flex-col justify-between">
      <div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>Complete your Profile</div>
        <div className="font-semibold text-lg">{profileData ? "100%" : "30%"}</div>
      </div>

      <button onClick={open} className="px-4 py-2 mt-4 rounded-xl" style={{ background: "var(--primary-500)", color: "var(--on-primary)" }}>
        Complete Profile
      </button>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext) || {};
  // Theme may be provided as string or object { theme }
  const rawTheme =
    typeof themeCtx === "string"
      ? themeCtx
      : themeCtx && typeof themeCtx.theme === "string"
      ? themeCtx.theme
      : (themeCtx && themeCtx.value) || "light";

  // normalize and only accept 'dark' and 'classic' as special themes
  const theme = (rawTheme || "light").toString().toLowerCase();
  const effectiveTheme = theme === "dark" || theme === "classic" ? theme : "light";

  useEffect(() => {
    // set CSS variables according to effectiveTheme
    try {
      const primary = "#174552";
      const onPrimary = "#ffffff";

      // default (light)
      let bgDefault = "#ffffff";
      let surface100 = "#ffffff";
      let surface200 = "#f3f4f6";
      let textDefault = "#0f172a";
      let muted = "rgba(15,23,42,0.6)";
      let shadow = "0 6px 18px rgba(2,6,23,0.04)";

      if (effectiveTheme === "dark") {
        bgDefault = "#071024";
        surface100 = "#071024";
        surface200 = "#0b1220";
        textDefault = "#e6eef8";
        muted = "rgba(230,238,248,0.68)";
        shadow = "0 6px 18px rgba(0,0,0,0.6)";
      } else if (effectiveTheme === "classic") {
        // cream surface, but keep inputs/cards white for good contrast
        bgDefault = "#F6E9D2"; // page background (cream)
        surface100 = "#ffffff"; // cards white on cream
        surface200 = "#F6E9D2"; // page surface matches bgDefault
        textDefault = "#0b1220"; // dark text on cream
        muted = "rgba(11,17,32,0.6)";
        shadow = "0 6px 18px rgba(2,6,23,0.06)";
      }

      document.documentElement.style.setProperty("--primary-500", primary);
      document.documentElement.style.setProperty("--on-primary", onPrimary);
      document.documentElement.style.setProperty("--bg-default", bgDefault);
      document.documentElement.style.setProperty("--surface-100", surface100);
      document.documentElement.style.setProperty("--surface-200", surface200);
      document.documentElement.style.setProperty("--text-default", textDefault);
      document.documentElement.style.setProperty("--muted", muted);
      document.documentElement.style.setProperty("--shadow", shadow);
    } catch (err) {
      // ignore in SSR or restricted env
    }
  }, [effectiveTheme]);

  const [showAddMore, setShowAddMore] = useState(false);

  // Modal flags
  const [showPaymentIn, setShowPaymentIn] = useState(false);
  const [showPaymentOut, setShowPaymentOut] = useState(false);
  const [showQuotationCreate, setShowQuotationCreate] = useState(false);
  const [showSalesReturnCreate, setShowSalesReturnCreate] = useState(false);
  const [showPurchaseReturnCreate, setShowPurchaseReturnCreate] = useState(false);
  const [showExpenseCreate, setShowExpenseCreate] = useState(false);
  const [showIncomeCreate, setShowIncomeCreate] = useState(false);

  const [showReminder, setShowReminder] = useState(false);
  const [reminders, setReminders] = useState([]);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const handleSaveReminder = (newReminder) => {
    setReminders((prev) => [...prev, newReminder]);
  };

  const cashflowData = [
    { day: "Mon", income: 2000, expense: 1500 },
    { day: "Tue", income: 2500, expense: 1000 },
    { day: "Wed", income: 1800, expense: 1200 },
    { day: "Thu", income: 3000, expense: 2000 },
    { day: "Fri", income: 3500, expense: 2500 },
    { day: "Sat", income: 2000, expense: 1800 },
    { day: "Sun", income: 4000, expense: 2200 },
  ];

  const buttonBaseStyle = {
    padding: "8px 16px",
    borderRadius: 12,
    color: "var(--on-primary)",
    background: "var(--primary-500)",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ background: "var(--bg-default, #f3f4f6)", color: "var(--text-default)" }} className="p-4 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Welcome</h2>

        <div className="flex gap-3 relative">
          <button onClick={() => navigate("/quick-pos")} style={buttonBaseStyle}>Quick POS</button>
          <button onClick={() => navigate("/add-sales")} style={buttonBaseStyle}>+ Add Sales</button>
          <button onClick={() => navigate("/add-purchase")} style={buttonBaseStyle}>+ Add Purchase</button>

          <div className="relative">
            <button onClick={() => setShowAddMore((prev) => !prev)} style={buttonBaseStyle} className="flex items-center gap-1">
              + Add More ▼
            </button>

            {showAddMore && (
              <div className="absolute right-0 mt-2 w-56" style={{ background: "var(--surface-100)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, boxShadow: "var(--shadow, 0 6px 18px rgba(0,0,0,0.08))", zIndex: 60 }}>
                <DropdownBtn label="Payment In" icon={<DollarSign size={16} />} onClick={() => { setShowAddMore(false); setShowPaymentIn(true); }} />
                <DropdownBtn label="Payment Out" icon={<CreditCard size={16} />} onClick={() => { setShowAddMore(false); setShowPaymentOut(true); }} />
                <DropdownBtn label="Quotation" icon={<ShoppingCart size={16} />} onClick={() => { setShowAddMore(false); setShowQuotationCreate(true); }} />
                <DropdownBtn label="Sales Return" icon={<Package size={16} />} onClick={() => { setShowAddMore(false); setShowSalesReturnCreate(true); }} />
                <DropdownBtn label="Purchase Return" icon={<Package size={16} />} onClick={() => { setShowAddMore(false); setShowPurchaseReturnCreate(true); }} />
                <DropdownBtn label="Expense" icon={<BarChart2 size={16} />} onClick={() => { setShowAddMore(false); setShowExpenseCreate(true); }} />
                <DropdownBtn label="Income" icon={<DollarSign size={16} />} onClick={() => { setShowAddMore(false); setShowIncomeCreate(true); }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CASHFLOW WIDGET */}
      <div style={{ background: "var(--surface-100)", borderRadius: 12, padding: 16, boxShadow: "var(--shadow, 0 6px 18px rgba(2,6,23,0.04))" }} className="mb-6">
        <h3 className="font-semibold mb-4">Cashflow (Last 7 Days)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashflowData}>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--muted, #6b7280)" />
              <YAxis stroke="var(--muted, #6b7280)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--surface-200, #f3f4f6)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <Card title="To Receive" amount="Rs. 0" color="bg-emerald-50" icon={<DollarSign size={20} />} onClick={() => navigate("/to-receive")} />
        <Card title="To Give" amount="Rs. 0" color="bg-pink-50" icon={<CreditCard size={20} />} onClick={() => navigate("/to-give")} />
        <Card title="Sales" amount="Rs. 0" color="bg-emerald-50" icon={<ShoppingCart size={20} />} onClick={() => navigate("/sale-insights")} />
        <Card title="Purchase" amount="Rs. 0" color="bg-sky-50" icon={<Package size={20} />} onClick={() => navigate("/purchase-insights")} />
        <Card title="Expense" amount="Rs. 0" color="bg-indigo-50" icon={<BarChart2 size={20} />} onClick={() => navigate("/expense-insights")} />
      </div>

      {/* PANELS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <ReminderPanel reminders={reminders} open={() => setShowReminder(true)} />
        <BalancePanel />
        <ProfilePanel profileData={profileData} open={() => setShowProfile(true)} />
      </div>

      {/* ================= MODALS FROM ADD MORE ================= */}
      {showPaymentIn && (
        <ModalShell onClose={() => setShowPaymentIn(false)}>
          <PaymentInForm directOpen embedded onClose={() => setShowPaymentIn(false)} />
        </ModalShell>
      )}

      {showPaymentOut && (
        <ModalShell onClose={() => setShowPaymentOut(false)}>
          <PaymentOutForm directOpen embedded onClose={() => setShowPaymentOut(false)} />
        </ModalShell>
      )}

      {showQuotationCreate && (
        <ModalShell onClose={() => setShowQuotationCreate(false)}>
          <CreateQuotation directOpen embedded onClose={() => setShowQuotationCreate(false)} />
        </ModalShell>
      )}

      {showSalesReturnCreate && (
        <ModalShell onClose={() => setShowSalesReturnCreate(false)}>
          <SalesReturn directOpen embedded onClose={() => setShowSalesReturnCreate(false)} />
        </ModalShell>
      )}

      {showPurchaseReturnCreate && (
        <ModalShell onClose={() => setShowPurchaseReturnCreate(false)}>
          <PurchaseReturn directOpen embedded onClose={() => setShowPurchaseReturnCreate(false)} />
        </ModalShell>
      )}

      {showExpenseCreate && (
        <ModalShell onClose={() => setShowExpenseCreate(false)}>
          <ExpensePage directOpen embedded onClose={() => setShowExpenseCreate(false)} />
        </ModalShell>
      )}

      {showIncomeCreate && (
        <ModalShell onClose={() => setShowIncomeCreate(false)}>
          <OtherIncomePage directOpen embedded onClose={() => setShowIncomeCreate(false)} />
        </ModalShell>
      )}

      {/* REMINDER */}
      {showReminder && <AddReminder onClose={() => setShowReminder(false)} onSave={handleSaveReminder} />}

      {/* PROFILE */}
      {showProfile && <CompleteProfile onClose={() => setShowProfile(false)} onSave={(data) => setProfileData(data)} />}
    </div>
  );
}

/* ------------------------ SMALL HELPERS ------------------------ */

function DropdownBtn({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-3 flex items-center gap-2" style={{ background: "transparent", color: "var(--text-default)" }}>
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6" style={{ background: "rgba(2,6,23,0.6)" }}>
      <div className="relative w-full max-w-4xl mt-10" style={{ background: "var(--surface-100)", borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.12)" }}>
        <button onClick={onClose} className="absolute right-4 top-4" style={{ color: "var(--muted)" }}>
          ✕
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
