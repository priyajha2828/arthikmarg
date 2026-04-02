// src/components/OtherIncomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Plus, X, Calendar, Camera } from "lucide-react";

/* ---------------------------
   CategorySelect (THEME FIXED)
--------------------------- */
function CategorySelect({ value, onChange, categories = [] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <div
        onClick={() => setOpen((s) => !s)}
        className="w-full px-3 py-3 border rounded-md flex justify-between cursor-pointer"
        style={{
          borderColor: "rgba(0,0,0,0.1)",
          background: "var(--surface-100)",
          color: "var(--text-default)",
        }}
      >
        {value ? value : <span style={{ color: "var(--muted)" }}>Search for category</span>}
        <span>▾</span>
      </div>

      {open && (
        <div
          className="absolute w-full mt-2 rounded-md z-50"
          style={{
            background: "var(--surface-100)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "var(--shadow)",
          }}
        >
          {categories.map((c) => (
            <div
              key={c}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className="px-4 py-3 cursor-pointer"
              style={{ color: "var(--text-default)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-200)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   MAIN COMPONENT
--------------------------- */
export function OtherIncomePage({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  const [showAddIncome, setShowAddIncome] = useState(false);
  const [incomes, setIncomes] = useState([]);

  const [incomeNo, setIncomeNo] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [items, setItems] = useState([]);

  const categories = [
    "Grants & Funding",
    "Sponsorships",
    "Investments",
    "Commission",
    "Interest",
    "Rent",
    "Refund",
    "Other",
  ];

  const total = items.reduce(
    (sum, it) => sum + (parseFloat(it.amount || 0) || 0),
    0
  );

  function addItem() {
    setItems([...items, { desc: "", qty: "", rate: "", amount: "" }]);
  }

  function updateItem(i, field, value) {
    const newItems = [...items];
    newItems[i][field] = value;

    const qty = parseFloat(newItems[i].qty) || 0;
    const rate = parseFloat(newItems[i].rate) || 0;
    newItems[i].amount = qty && rate ? (qty * rate).toFixed(2) : "";

    setItems(newItems);
  }

  function removeItem(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function handleAttach(e) {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  }

  function removeAttachment(i) {
    setAttachments(attachments.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    const payload = {
      incomeNo,
      date,
      category,
      paymentMethod,
      remarks,
      items,
      total,
    };

    setIncomes([{ id: Date.now(), ...payload }, ...incomes]);

    setItems([]);
    setCategory("");
    setShowAddIncome(false);
  }

  return (
    <>
      {/* MAIN */}
      <div
        className="fixed top-16 right-0 bottom-0 flex flex-col items-center justify-center"
        style={{
          left: sidebarOffset,
          background: "var(--bg-default)",
          color: "var(--text-default)",
        }}
      >
        {incomes.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Create Your First Income
            </h2>

            <p style={{ color: "var(--muted)" }}>
              Start managing your incomes easily
            </p>

            <button
              onClick={() => setShowAddIncome(true)}
              className="mt-6 px-6 py-3 rounded-lg text-white flex gap-2"
              style={{ background: "#172554" }}
            >
              <Plus size={16} /> Add New Income
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddIncome(true)}
            className="px-4 py-2 rounded text-white flex gap-2"
            style={{ background: "#172554" }}
          >
            <Plus size={16} /> Add Income
          </button>
        )}
      </div>

      {/* Add Income Modal */}
{showAddIncome && (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center overflow-auto"
    style={{ paddingTop: "2.5rem", paddingLeft: sidebarOffset }}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0"
      onClick={() => setShowAddIncome(false)}
      style={{ background: "rgba(0,0,0,0.35)" }}
    />

    {/* Modal */}
    <div
      className="relative z-10 rounded-md mx-4"
      style={{
        width: "720px",
        maxHeight: "80vh",
        background: "var(--surface-100)",
        color: "var(--text-default)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 10,
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Header */}
      <div
        className="flex justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <h3 className="text-lg font-semibold">Add Income</h3>
        <X onClick={() => setShowAddIncome(false)} />
      </div>

      {/* Body */}
      <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
        <form className="space-y-4">

          {/* Income No & Date */}
          <div className="grid grid-cols-2 gap-4">
            <input
              value={incomeNo}
              onChange={(e) => setIncomeNo(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Category */}
          <CategorySelect
            value={category}
            onChange={setCategory}
            categories={categories}
          />

          {/* Add Item */}
          <button
            type="button"
            onClick={addItem}
            className="flex gap-2"
            style={{ color: "#172554" }}
          >
            <Plus size={14} /> Add Income Item
          </button>

          {/* Items */}
          {items.map((it, i) => (
            <div key={i} className="border p-3 rounded flex gap-2">
              <input
                placeholder="Desc"
                onChange={(e) => updateItem(i, "desc", e.target.value)}
                className="border p-2 flex-1"
              />
              <input
                type="number"
                placeholder="Qty"
                onChange={(e) => updateItem(i, "qty", e.target.value)}
                className="border p-2 w-20"
              />
              <input
                type="number"
                placeholder="Rate"
                onChange={(e) => updateItem(i, "rate", e.target.value)}
                className="border p-2 w-24"
              />
              <input
                value={it.amount}
                readOnly
                className="border p-2 w-24"
              />
              <X
                onClick={() => removeItem(i)}
                className="text-red-500 cursor-pointer"
              />
            </div>
          ))}

          {/* Total */}
          <input
            value={`Rs. ${total}`}
            readOnly
            className="border p-2 w-full"
          />

          {/* Payment */}
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 w-full"
          >
            <option>Cash</option>
            <option>Bank</option>
            <option>Mobile Wallet</option>
          </select>

          {/* Remarks */}
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border p-2 w-full"
          />

          {/* Attachments */}
          <input type="file" onChange={handleAttach} multiple />

        </form>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 flex justify-end gap-3"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={() => setShowAddIncome(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 text-white rounded"
          style={{ background: "#172554" }}
        >
          Save Income
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}

export default OtherIncomePage;