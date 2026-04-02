// src/components/ManageAccountsPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  Wallet,
  X,
  Camera,
  Minus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * ManageAccountsPage (fixed)
 * - Theme detection (data-theme, html .dark, localStorage)
 * - Grey background in light mode, dark grey in dark mode
 * - Fixed popovers for calendar and adjust menu (not clipped)
 * - Clean JSX structure and consistent z-indexes
 */

export default function ManageAccountsPage({ sidebarOpen }) {
  useEffect(() => {
    console.log("ManageAccountsPage mounted");
  }, []);

  const navigate = useNavigate();

  // ---------- Theme detection ----------
  const detectTheme = () => {
    if (typeof document === "undefined") return "light";
    const html = document.documentElement;
    const dt = html?.dataset?.theme;
    if (dt) return dt === "dark" ? "dark" : "light";
    if (html?.classList?.contains("dark")) return "dark";
    const ls = typeof window !== "undefined" ? window.localStorage?.getItem("theme") : null;
    if (ls) return ls === "dark" ? "dark" : "light";
    return "light";
  };

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

  const isDark = theme === "dark";

  // ---------- layout / sidebar ----------
  const expandedWidth = "24rem";
  const COLLAPSED_MARGIN = "4rem";
  const sidebarOffset = sidebarOpen ? expandedWidth : COLLAPSED_MARGIN;

  // ---------- data / state ----------
  const [accounts, setAccounts] = useState([
    { id: "cash", name: "Cash", balance: 0, icon: "cash", type: "Cash" },
  ]);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || null);
  const [showAdd, setShowAdd] = useState(false);

  // Adjust menu state
  const [showAdjustMenu, setShowAdjustMenu] = useState(false);
  const [adjustMenuPos, setAdjustMenuPos] = useState({ top: 0, left: 0 });
  const adjustMenuRef = useRef(null);
  const adjustButtonRef = useRef(null);

  // Adjust modal values
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjust, setAdjust] = useState({
    type: "increase",
    amount: "",
    reason: "",
    date: new Date().toISOString().slice(0, 10),
    accountId: "cash",
    attachments: [],
  });

  const [reportData, setReportData] = useState([]);
  const totalBalance = accounts.reduce((s, a) => s + (Number(a.balance) || 0), 0);

  const [newAccount, setNewAccount] = useState({
    type: "Bank Account",
    bankName: "",
    holderName: "",
    accountNumber: "",
    balance: "",
  });

  // sync selectedAccountId and adjust.accountId when accounts change
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) setSelectedAccountId(accounts[0].id);
    setAdjust((prev) => {
      const valid = accounts.some((a) => a.id === prev.accountId);
      if (!valid && accounts[0]) return { ...prev, accountId: accounts[0].id };
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  // ---------- account handlers ----------
  function openAddModal() {
    setNewAccount({
      type: "Bank Account",
      bankName: "",
      holderName: "",
      accountNumber: "",
      balance: "",
    });
    setShowAdd(true);
  }

  function handleNewChange(e) {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  }

  function addAccount() {
    if (newAccount.type === "Bank Account" && !newAccount.bankName.trim()) {
      alert("Please enter Bank Name.");
      return;
    }
    if (!newAccount.holderName.trim()) {
      alert("Please enter Account Holder Name.");
      return;
    }

    const bal = parseFloat(String(newAccount.balance).replace(/,/g, "")) || 0;
    let displayName = "";
    if (newAccount.type === "Bank Account") displayName = newAccount.bankName.trim() || newAccount.holderName.trim();
    else displayName = newAccount.holderName.trim() || newAccount.type;
    if (!displayName) displayName = newAccount.type;

    const id = `acc-${Date.now()}`;
    const icon = newAccount.type.toLowerCase().includes("cash") ? "cash" : "bank";
    const acc = {
      id,
      name: displayName,
      balance: Number(bal.toFixed(2)),
      icon,
      type: newAccount.type === "Cash" ? "Cash" : "Bank",
      holderName: newAccount.holderName,
      accountNumber: newAccount.accountNumber,
      bankName: newAccount.bankName,
    };
    setAccounts((prev) => [...prev, acc]);
    setSelectedAccountId(id);
    setShowAdd(false);
  }

  // ---------- adjust menu & modal ----------
  function openAdjustMenu(e) {
    e?.stopPropagation?.();
    const rect = adjustButtonRef.current?.getBoundingClientRect?.();
    const menuWidth = 176;
    let left = rect ? rect.right - menuWidth : window.innerWidth / 2 - menuWidth / 2;
    left = Math.max(8 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - menuWidth - 8));
    const top = rect ? rect.bottom + 8 + window.scrollY : window.innerHeight / 2;
    setAdjustMenuPos({ top, left });
    setShowAdjustMenu(true);
  }

  function handleAdjustMenuSelect(mode) {
    setShowAdjustMenu(false);
    if (mode === "transfer") {
      alert("Transfer Money clicked — implement transfer flow here.");
      return;
    }
    setAdjust((prev) => ({
      ...prev,
      type: mode,
      amount: "",
      reason: "",
      date: new Date().toISOString().slice(0, 10),
      accountId: selectedAccountId || prev.accountId || (accounts[0] && accounts[0].id),
      attachments: [],
    }));
    setShowAdjust(true);
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!showAdjustMenu) return;
      if (
        adjustMenuRef.current &&
        !adjustMenuRef.current.contains(e.target) &&
        !adjustButtonRef.current?.contains?.(e.target)
      ) {
        setShowAdjustMenu(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showAdjustMenu]);

  function handleAdjustChange(e) {
    const { name, value, files } = e.target;
    if (name === "attachments") setAdjust((prev) => ({ ...prev, attachments: files ? Array.from(files) : [] }));
    else setAdjust((prev) => ({ ...prev, [name]: value }));
  }

  function applyAdjust() {
    const amt = parseFloat(String(adjust.amount).replace(/,/g, "")) || 0;
    if (!amt) {
      alert("Enter a valid amount.");
      return;
    }

    const acctId = adjust.accountId || selectedAccountId || (accounts[0] && accounts[0].id);
    if (!acctId) {
      alert("No account selected.");
      return;
    }

    const newAccounts = accounts.map((acc) => {
      if (acc.id !== acctId) return acc;
      const newBalValue = adjust.type === "increase" ? Number(acc.balance || 0) + amt : Number(acc.balance || 0) - amt;
      return { ...acc, balance: Number(newBalValue.toFixed(2)) };
    });

    const updatedAcc = newAccounts.find((a) => a.id === acctId);
    const newBalanceForReport = updatedAcc ? Number(updatedAcc.balance) : 0;

    const entry = {
      date: adjust.date,
      type: adjust.type === "increase" ? "Add Money" : "Reduce Money",
      remarks: adjust.reason,
      moneyIn: adjust.type === "increase" ? amt : 0,
      moneyOut: adjust.type === "decrease" ? amt : 0,
      balance: newBalanceForReport,
      accountId: acctId,
    };

    setAccounts(newAccounts);
    setReportData((prev) => [...prev, entry]);
    setShowAdjust(false);
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  // ------------------ calendar helpers ------------------
  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const toInputDate = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
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

  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef(null);
  const calBtnRef = useRef(null);
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const weeks = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);
  const [calPos, setCalPos] = useState({ left: 0, top: 0, width: 320, height: 320 });

  useEffect(() => {
    function onDocClick(e) {
      if (calOpen && calRef.current && !calRef.current.contains(e.target) && !calBtnRef.current?.contains?.(e.target)) {
        setCalOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [calOpen]);

  useEffect(() => {
    if (!calOpen) return;
    if (adjust.date) {
      const d = new Date(adjust.date + "T00:00:00");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calOpen]);

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

  const handleCalDayClick = (day) => {
    if (!day) return;
    setAdjust((p) => ({ ...p, date: toInputDate(startOfDay(day)) }));
    setCalOpen(false);
  };

  const openCalPopover = () => {
    const rect = calBtnRef.current?.getBoundingClientRect();
    const popW = 320;
    const popH = 320;
    let left = rect ? rect.left + window.scrollX : window.innerWidth / 2 - popW / 2;
    let top = rect ? rect.bottom + window.scrollY + 8 : window.innerHeight / 2 - popH / 2;

    if (left + popW > window.scrollX + window.innerWidth - 12) left = window.scrollX + window.innerWidth - popW - 12;
    if (left < window.scrollX + 8) left = window.scrollX + 8;
    if (top + popH > window.scrollY + window.innerHeight - 12) top = rect ? rect.top + window.scrollY - popH - 8 : top;

    setCalPos({ left, top, width: popW, height: popH });
    setCalOpen(true);
  };

  // ----------------- UI snippets -----------------
  function CashDetailsView({ account }) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 10h18v6H3z" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 8v2" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 8v2" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <div className="text-2xl font-semibold">{account.name}</div>
              <div className="text-sm text-gray-500">Current Balance</div>
            </div>
          </div>

          <div className="relative flex items-center gap-4">
            <button
              ref={adjustButtonRef}
              onClick={openAdjustMenu}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#27AE60] text-white rounded-md font-medium hover:bg-[#1E8C4D]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline-block">
                <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Adjust Balance
            </button>

            <button
              onClick={() =>
                navigate(`/cash-report/${account.id}`, {
                  state: {
                    closingBalance: account.balance,
                    reportData: reportData.filter((r) => r.accountId === account.id),
                  },
                })
              }
              className="text-green-600 inline-flex items-center gap-2 text-sm font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                <path d="M6 3h11v4" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="6" y="7" width="11" height="13" rx="2" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View Report
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-500">Current Balance</div>
          <div className="text-3xl font-bold mt-1">Rs. {Number(account.balance || 0).toLocaleString()}</div>
        </div>

        <hr className="border-t border-gray-200 mb-12" />

        <div className="flex flex-col items-center text-center pt-12 pb-24">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
            <rect x="44" y="56" width="112" height="92" rx="6" fill="#F3F4F6" />
            <path d="M56 76h88" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
            <path d="M56 96h64" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
            <rect x="64" y="36" width="72" height="24" rx="6" fill="#E5E7EB" />
          </svg>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Transactions Found</h3>
          <p className="text-gray-500">Try searching for other keywords</p>
        </div>
      </div>
    );
  }

  // ----------------- RENDER -----------------
  return (
    <div
      className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} fixed top-16 right-0 bottom-0 overflow-auto`}
      style={{ left: sidebarOffset, width: `calc(100% - ${sidebarOffset})`, transition: "background-color 150ms ease" }}
    >
      <div className={`p-3 ${isDark ? "border-b border-gray-800" : "border-b border-gray-100"} text-sm`}>Manage Accounts</div>

      <div className="h-full flex">
        <aside
          className="w-[360px] border-r p-6 flex flex-col"
          style={{ minHeight: 0, background: isDark ? "#0f1724" : "#ffffff", borderRightColor: isDark ? "rgba(255,255,255,0.04)" : undefined }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Manage Accounts ({accounts.length})</h2>
            <button onClick={openAddModal} className="inline-flex items-center gap-2 px-4 py-2 bg-[#174552] text-white rounded-md font-medium hover:bg-[#11303F]">
              <Plus size={16} /> Add Account
            </button>
          </div>

          <div className="border-b pb-4 mb-4" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : undefined }}>
            <div className="flex items-center justify-between">
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>Total Balance:</span>
              <span className="font-medium">Rs. {totalBalance.toLocaleString()}</span>
            </div>
          </div>

          <h3 className={isDark ? "text-gray-400 mb-3" : "text-sm text-gray-500 mb-3"}>Accounts</h3>

          <ul className="space-y-3 overflow-auto" style={{ maxHeight: "60vh" }}>
            {accounts.map((acc) => (
              <li
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`flex items-center justify-between gap-3 p-3 rounded-md cursor-pointer transition ${selectedAccountId === acc.id ? "bg-[#174552] text-white" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${selectedAccountId === acc.id ? "bg-white/20" : "bg-green-50"}`}>
                    {acc.icon === "cash" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 10h18v6H3z" stroke={selectedAccountId === acc.id ? "#fff" : "#10B981"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 8v2" stroke={selectedAccountId === acc.id ? "#fff" : "#10B981"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 8v2" stroke={selectedAccountId === acc.id ? "#fff" : "#10B981"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <Wallet size={18} className={selectedAccountId === acc.id ? "text-white" : "text-green-600"} />
                    )}
                  </div>

                  <div>
                    <div className="font-medium">{acc.name}</div>
                    <div className="text-sm text-gray-500">Account</div>
                  </div>
                </div>

                <div className={`font-medium ${selectedAccountId === acc.id ? "" : "text-gray-700"}`}>Rs. {Number(acc.balance || 0).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 p-8 overflow-auto">
          {selectedAccount ? (
            selectedAccount.type === "Cash" ? (
              <CashDetailsView account={selectedAccount} />
            ) : (
              <div className="max-w-5xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Transactions for {selectedAccount.name}</h3>
                <div className="text-sm text-gray-500">(Transaction list goes here)</div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
                <rect x="44" y="56" width="112" height="92" rx="6" fill="#F3F4F6" />
                <path d="M56 76h88" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
                <path d="M56 96h64" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
                <rect x="64" y="36" width="72" height="24" rx="6" fill="#E5E7EB" />
              </svg>

              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Account Not Selected</h3>
              <p className="text-gray-500">Click any account to view their transactions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Adjust menu (fixed popover) */}
      {showAdjustMenu && (
        <div className="fixed inset-0 z-50 pointer-events-auto" onClick={() => setShowAdjustMenu(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            ref={adjustMenuRef}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-60 w-44 rounded-md shadow-lg py-2"
            style={{
              top: adjustMenuPos.top,
              left: adjustMenuPos.left,
              background: isDark ? "rgb(30 41 59)" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f3f4f6",
            }}
          >
            <button onClick={() => handleAdjustMenuSelect("increase")} className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
              <span className="text-lg">+</span>
              <span className="text-sm">Add Money</span>
            </button>

            <button onClick={() => handleAdjustMenuSelect("decrease")} className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isDark ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-50 text-red-500"}`}>
              <span className="text-lg">−</span>
              <span className="text-sm">Reduce Money</span>
            </button>

            <div className="my-1" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #f3f4f6" }} />

            <button onClick={() => handleAdjustMenuSelect("transfer")} className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
              <span className="text-xs">↕</span>
              <span className="text-sm">Transfer Money</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Account modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h4 className="text-xl font-semibold">Add New Account</h4>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Account Type</label>
                <select name="type" value={newAccount.type} onChange={handleNewChange} className="w-full rounded-lg border border-green-200 px-4 py-3 focus:ring-0">
                  <option>Bank Account</option>
                  <option>Cash</option>
                </select>
              </div>

              {newAccount.type === "Bank Account" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bank Name</label>
                  <input name="bankName" value={newAccount.bankName} onChange={handleNewChange} placeholder="Enter name" className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400" />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Account Holder Name</label>
                <input name="holderName" value={newAccount.holderName} onChange={handleNewChange} placeholder="Enter account holder name" className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Account Number</label>
                <input name="accountNumber" value={newAccount.accountNumber} onChange={handleNewChange} placeholder="Enter account number" className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Current Account Balance</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50">Rs.</span>
                  <input name="balance" value={newAccount.balance} onChange={handleNewChange} placeholder="0.00" inputMode="numeric" className="w-full rounded-r-lg border border-gray-200 px-4 py-3 placeholder-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border bg-white text-gray-700">Cancel</button>
              <button onClick={addAccount} className="px-5 py-2 rounded-lg bg-[#16A34A] text-white">Add Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust modal (calendar popover rendered fixed) */}
      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdjust(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Adjust Balance</h3>
              <button onClick={() => setShowAdjust(false)} className="p-2 rounded hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setAdjust((p) => ({ ...p, type: "increase" }))} className={`px-4 py-2 rounded-md border ${adjust.type === "increase" ? "border-green-300 bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  <span className="inline-flex items-center gap-2"><Plus size={14} /> <span>Add Money</span></span>
                </button>

                <button onClick={() => setAdjust((p) => ({ ...p, type: "decrease" }))} className={`px-4 py-2 rounded-md border ${adjust.type === "decrease" ? "border-red-300 bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                  <span className="inline-flex items-center gap-2"><Minus size={14} /> <span>Reduce Money</span></span>
                </button>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Account</label>
                <select name="accountId" value={adjust.accountId} onChange={(e) => setAdjust((p) => ({ ...p, accountId: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-3">
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Total Amount</label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50">Rs.</span>
                    <input name="amount" value={adjust.amount} onChange={handleAdjustChange} placeholder="0.00" inputMode="decimal" className="w-full rounded-r-lg border border-gray-200 px-4 py-3" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Date</label>
                  <div className="relative">
                    <button ref={calBtnRef} onClick={() => (calOpen ? setCalOpen(false) : openCalPopover())} className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <CalendarIcon size={16} />
                      <span className="text-sm">{adjust.date || "Select date"}</span>
                    </button>

                    {calOpen && (
                      <div ref={calRef} className="fixed z-60 bg-white border border-gray-200 rounded-lg shadow-lg p-3" style={{ left: calPos.left, top: calPos.top, width: calPos.width, maxWidth: "calc(100% - 24px)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={16} /></button>
                            <div className="text-sm font-medium">{new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
                            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100"><ChevronRight size={16} /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-[11px] text-gray-500 mb-2">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-center py-1">{d}</div>)}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {weeks.map((week, wi) => week.map((day, di) => {
                            const isDisabled = !day;
                            const isSelected = day && toInputDate(startOfDay(day)) === adjust.date;
                            return (
                              <button key={`${wi}-${di}`} onClick={() => handleCalDayClick(day)} disabled={isDisabled} className={`h-8 flex items-center justify-center text-xs rounded ${isDisabled ? "text-gray-300 cursor-default" : "cursor-pointer hover:bg-gray-100"} ${isSelected ? "bg-emerald-600 text-white" : ""}`}>
                                {day ? day.getDate() : ""}
                              </button>
                            );
                          }))}
                        </div>

                        <div className="mt-3 flex justify-end gap-2">
                          <button onClick={() => setCalOpen(false)} className="px-3 py-1 rounded border border-gray-200 bg-white text-sm">Cancel</button>
                          <button onClick={() => setCalOpen(false)} className="px-3 py-1 rounded bg-emerald-500 text-white text-sm">OK</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Remarks</label>
                <input name="reason" value={adjust.reason} onChange={handleAdjustChange} placeholder="Enter remarks here..." className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400" />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Attach Images</label>
                <label className="inline-flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center"><Camera size={20} /></div>
                  <span className="text-sm text-gray-600">Add photos</span>
                  <input type="file" name="attachments" onChange={handleAdjustChange} multiple accept="image/*" className="hidden" />
                </label>
                {adjust.attachments && adjust.attachments.length > 0 && <div className="mt-2 text-xs text-gray-600">{adjust.attachments.length} file(s) selected</div>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowAdjust(false)} className="px-4 py-2 rounded-lg border bg-white text-gray-700">Cancel</button>
              {adjust.type === "increase" ? (
                <button onClick={applyAdjust} className="px-4 py-2 rounded-lg bg-[#16A34A] text-white inline-flex items-center gap-2"><Plus size={14} /> Add Money</button>
              ) : (
                <button onClick={applyAdjust} className="px-4 py-2 rounded-lg bg-[#DC2626] text-white inline-flex items-center gap-2"><Minus size={14} /> Reduce Money</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
