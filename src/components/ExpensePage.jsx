// src/components/ExpensePage.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { Plus, X, Calendar } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * ExpensePage
 *
 * Props:
 *  - sidebarOpen (bool) : layout offset when sidebar open
 *  - directOpen (bool)  : open the form immediately (used for modal)
 *  - embedded (bool)    : when true, no backdrop (parent provides ModalShell)
 *  - onClose (fn)       : callback to notify parent to close wrapper
 *
 * Exported both as named and default to match different import styles.
 */
export function ExpensePage({ sidebarOpen = false, directOpen = false, embedded = false, onClose: parentOnClose } = {}) {
  // theme context (optional)
  const { theme } = useContext(ThemeContext || {});

  const expandedWidth = "24rem";
  const COLLAPSED_MARGIN = "4rem";
  const sidebarOffset = sidebarOpen ? expandedWidth : COLLAPSED_MARGIN;

  // form state
  const [showAddExpense, setShowAddExpense] = useState(!!directOpen);
  useEffect(() => {
    if (directOpen) setShowAddExpense(true);
  }, [directOpen]);

  const [form, setForm] = useState({
    expenseNo: 1,
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    category: "",
    items: [],
    totalAmount: "",
    paymentMethod: "Cash",
    remarks: "",
    attachments: [],
  });

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (showAddExpense && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showAddExpense]);

  // categories
  const categories = [
    "Miscellaneous",
    "Travel & Transportation",
    "Repair & Maintenance",
    "Marketing",
    "Utilities",
    "Bank Fees",
    "Salaries and rent",
  ];

  // helpers
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleItemChange(index, field, value) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...(items[index] || {}), [field]: value };
      const qty = parseFloat(items[index].qty) || 0;
      const rate = parseFloat(items[index].rate) || 0;
      items[index].amount = qty && rate ? (qty * rate).toFixed(2) : "";
      return { ...prev, items };
    });
  }

  function addExpenseItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", qty: "", rate: "", amount: "" }],
    }));
  }

  function removeExpenseItem(index) {
    setForm((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items };
    });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  }

  function removeAttachment(idx) {
    setForm((prev) => {
      const attachments = prev.attachments.filter((_, i) => i !== idx);
      return { ...prev, attachments };
    });
  }

  function recalcTotal() {
    const total = form.items.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
    setForm((prev) => ({ ...prev, totalAmount: total ? total.toFixed(2) : "" }));
  }

  function resetForm() {
    setForm({
      expenseNo: form.expenseNo + 1,
      date: new Date().toISOString().slice(0, 10),
      category: "",
      items: [],
      totalAmount: "",
      paymentMethod: "Cash",
      remarks: "",
      attachments: [],
    });
  }

  function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    recalcTotal();
    // TODO: call API here
    console.log("Saving expense:", form);

    // close modal / reset
    setShowAddExpense(false);
    resetForm();

    // notify parent (Dashboard ModalShell) to close if provided
    if (parentOnClose) parentOnClose();
  }

  /* --- Panel (inner content) --- */
  const Panel = (
    <div className="w-full max-w-[820px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden" role="dialog" aria-modal="true">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Add Expense</h3>
        {/* show inner close only when NOT embedded */}
        {!embedded && (
          <button
            onClick={() => {
              setShowAddExpense(false);
              if (parentOnClose) parentOnClose();
            }}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Body */}
      <form onSubmit={handleSave} className="px-6 py-5 overflow-y-auto" style={{ maxHeight: "64vh" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700">Expense No.</label>
            <div className="flex items-center gap-3 mt-1">
              <input
                name="expenseNo"
                ref={firstInputRef}
                value={form.expenseNo}
                onChange={(e) => setForm((prev) => ({ ...prev, expenseNo: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <span className="text-sm font-medium" style={{ color: "#174552" }}>
                Manual
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Date</label>
            <div className="relative mt-1">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Calendar size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mt-4">
          <label className="text-sm text-gray-700">Expense Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-green-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <button type="button" onClick={addExpenseItem} className="inline-flex items-center gap-2 text-[#174552] font-medium">
            <Plus size={16} /> Add Expense Item
          </button>
        </div>

        {/* Items */}
        <div className="space-y-3 mt-4">
          {form.items.length === 0 ? (
            <div className="text-sm text-gray-500">No items added yet.</div>
          ) : (
            form.items.map((it, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Item {idx + 1}</div>
                  <button type="button" onClick={() => removeExpenseItem(idx)} className="text-sm text-red-500">
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  <input
                    placeholder="Description"
                    className="col-span-3 rounded border border-gray-200 px-3 py-2"
                    value={it.description || ""}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  />
                  <input
                    placeholder="Qty"
                    className="col-span-1 rounded border border-gray-200 px-3 py-2"
                    value={it.qty || ""}
                    onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                  />
                  <input
                    placeholder="Rate"
                    className="col-span-1 rounded border border-gray-200 px-3 py-2"
                    value={it.rate || ""}
                    onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                  />
                  <input placeholder="Amount" className="col-span-1 rounded border border-gray-200 px-3 py-2" value={it.amount || ""} readOnly />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
          <div>
            <label className="text-sm text-gray-700">Total Amount</label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50">Rs.</span>
              <input name="totalAmount" value={form.totalAmount} onChange={handleChange} className="w-full rounded-r-lg border border-gray-200 px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Payment Method</label>
            <input name="paymentMethod" value="Cash" readOnly className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 text-gray-700" />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-700">Remarks</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} placeholder="Enter remarks here..." className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 min-h-[80px]" />
        </div>

        {/* attachments */}
        <div className="flex items-center gap-4 mt-4">
          <label className="w-20 h-20 rounded border border-dashed flex items-center justify-center cursor-pointer" title="Attach image">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex flex-col items-center text-sm text-gray-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-1">
                <path d="M4 7h4l2-2h4l2 2h4v12H4V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Camera
            </div>
          </label>

          <div className="flex gap-2 overflow-x-auto">
            {form.attachments.map((f, i) => {
              const url = URL.createObjectURL(f);
              return (
                <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                  <img src={url} alt={f.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeAttachment(i)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* Sticky footer */}
      <div className="px-6 py-4 border-t bg-white flex items-center justify-end gap-3">
        <button onClick={() => { recalcTotal(); }} className="px-4 py-2 rounded-md bg-white border text-gray-800 text-sm">
          Recalculate
        </button>
        <button onClick={handleSave} className="px-5 py-2 rounded-md bg-emerald-500 text-white text-sm hover:brightness-95">
          Save Expense
        </button>
      </div>
    </div>
  );

  /* --- Rendering logic --- */

  // When Dashboard embeds panel via ModalShell, render only Panel (no backdrop)
  if (directOpen && embedded) {
    return showAddExpense ? Panel : null;
  }

  // When opened directly (not embedded) show overlay + Panel
  if (directOpen && !embedded) {
    return (
      <>
        {showAddExpense && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40 overflow-auto" style={{ left: sidebarOffset, width: `calc(100% - ${sidebarOffset})` }}>
            <div className="mt-8">{Panel}</div>
          </div>
        )}
      </>
    );
  }

  // Normal page rendering (navigated from sidebar) - show empty state and open modal from page
  // Provide a simple centered card with Add button
  const vars = {
    primary: "var(--primary-500, #1E40AF)",
    muted: "var(--muted, rgba(0,0,0,0.6))",
    text: "var(--text-default, #0f172a)",
    bg: "var(--bg-default, #ffffff)",
    surface: "var(--surface-200, #f3f4f6)",
    border: "var(--border, rgba(0,0,0,0.06))",
  };

  const pageStyle = {
    left: sidebarOffset,
    width: `calc(100% - ${sidebarOffset})`,
    top: "4rem",
    right: 0,
    bottom: 0,
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: vars.surface,
    color: vars.text,
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 720,
    borderRadius: 12,
    padding: "2.25rem 2rem",
    background: vars.bg,
    border: `1px solid ${vars.border}`,
    boxShadow: "0 6px 22px rgba(2,6,23,0.04)",
    textAlign: "center",
  };

  const primaryBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    background: vars.primary,
    color: "#fff",
    border: "1px solid transparent",
  };

  return (
    <div style={pageStyle} aria-live="polite">
      <div style={cardStyle}>
        {/* Illustration */}
        <div className="flex justify-center mb-4" aria-hidden>
          <svg width="160" height="160" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" fill="#E5E7EB" />
            <rect x="55" y="40" width="90" height="30" rx="6" fill="#9CA3AF" />
            <rect x="55" y="75" width="90" height="90" rx="10" fill="#ffffff" />
            <rect x="65" y="90" width="50" height="6" rx="3" fill="#D1D5DB" />
            <rect x="65" y="105" width="70" height="6" rx="3" fill="#D1D5DB" />
            <rect x="65" y="120" width="60" height="6" rx="3" fill="#D1D5DB" />
            <rect x="65" y="135" width="40" height="6" rx="3" fill="#D1D5DB" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold" style={{ color: vars.text }}>
          Create Your First Expense
        </h2>

        <p className="text-base max-w-md" style={{ color: vars.muted }}>
          Click on the create expense button and start managing your expense
        </p>

        <button onClick={() => setShowAddExpense(true)} className="mt-4" style={primaryBtnStyle} aria-label="Add New Expense">
          <Plus size={18} />
          Add New Expense
        </button>
      </div>

      {/* overlay when opened from this page */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40 overflow-auto" style={{ left: sidebarOffset, width: `calc(100% - ${sidebarOffset})` }}>
          <div className="mt-8">{Panel}</div>
        </div>
      )}
    </div>
  );
}

export default ExpensePage;
