// src/components/AddPurchase.jsx
import React, { useContext, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function AddPurchase() {
  const navigate = useNavigate();

  // Theme handling (supports ThemeContext as string or object)
  const themeCtx = useContext(ThemeContext) || {};
  const theme = typeof themeCtx === "string" ? themeCtx : themeCtx.theme ? themeCtx.theme : "light";
  const isDark = theme === "dark";

  // Use CSS variables where possible; fall back to sensible hard-coded values
  const vars = useMemo(
    () => ({
      pageBg: isDark ? "var(--surface-800, #0f1724)" : "var(--surface-100, #ffffff)",
      cardBg: isDark ? "var(--surface-800, #0f1724)" : "var(--surface-100, #ffffff)",
      text: isDark ? "var(--text-on-dark, #ffffff)" : "var(--text-default, #0b1220)",
      muted: isDark ? "rgba(255,255,255,0.75)" : "var(--muted, #6b7280)",
      inputBg: isDark ? "var(--input-bg-dark, #0b1320)" : "var(--input-bg, #ffffff)",
      inputBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
      tableHeadBg: isDark ? "rgba(255,255,255,0.03)" : "var(--muted-bg, #f3f4f6)",
      primary: "var(--primary-500, #2563eb)",
      success: "var(--success-500, #16a34a)",
      danger: "var(--danger-500, #dc2626)",
      subtleBorder: isDark ? "rgba(255,255,255,0.04)" : "transparent",
    }),
    [isDark]
  );

  // Form state
  const [supplier, setSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([{ name: "", qty: 1, rate: 0, discount: 0, amount: 0 }]);

  // Handle Item Change
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    // keep numbers as numbers for calculations, but store inputs as strings for controlled inputs
    updated[index][field] = value;

    const qty = parseFloat(updated[index].qty) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    const discount = parseFloat(updated[index].discount) || 0;

    const total = qty * rate;
    updated[index].amount = +(total - (total * discount) / 100);
    setItems(updated);
  };

  // Add / Remove
  const addItem = () => {
    setItems([...items, { name: "", qty: 1, rate: 0, discount: 0, amount: 0 }]);
  };
  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Subtotal
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // File input handler
  const handleFiles = (e) => {
    setImages([...e.target.files]);
  };

  // Basic save handlers (placeholder — keep current behavior)
  const handleSaveAndNew = () => {
    // TODO: save logic
    // reset form if needed
  };
  const handleSavePurchase = () => {
    // TODO: save invoice logic
  };

  // Shared inline style helpers for inputs/buttons to ensure good contrast in both themes
  const inputBaseStyle = {
    background: vars.inputBg,
    color: vars.text,
    borderColor: vars.inputBorder,
  };

  const pageStyle = { background: vars.pageBg, color: vars.text };

  return (
    <div className="max-w-5xl mx-auto p-6 rounded-xl" style={pageStyle}>
      <div
        className="bg-transparent p-6 rounded-xl shadow-sm"
        style={{
          background: vars.cardBg,
          border: `1px solid ${vars.subtleBorder}`,
        }}
      >
        {/* Back Button */}
        <button
          className="flex items-center gap-2 mb-4"
          onClick={() => navigate(-1)}
          style={{ color: vars.text }}
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: vars.text }}>
          Add Purchase
        </h2>

        {/* Supplier, Invoice No, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="font-semibold text-sm" style={{ color: vars.muted }}>
              Select Supplier
            </label>
            <select
              className="w-full p-2 rounded mt-1"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              style={{
                ...inputBaseStyle,
                border: `1px solid ${vars.inputBorder}`,
              }}
            >
              <option value="">-- Choose Supplier --</option>
              <option value="Cash Purchase">Cash Purchase</option>
              <option value="ABC Traders">ABC Traders</option>
              <option value="XYZ Suppliers">XYZ Suppliers</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-sm" style={{ color: vars.muted }}>
              Invoice No
            </label>
            <input
              type="text"
              className="w-full p-2 rounded mt-1"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              style={{
                ...inputBaseStyle,
                border: `1px solid ${vars.inputBorder}`,
              }}
            />
          </div>

          <div>
            <label className="font-semibold text-sm" style={{ color: vars.muted }}>
              Invoice Date
            </label>
            <input
              type="date"
              className="w-full p-2 rounded mt-1"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              style={{
                ...inputBaseStyle,
                border: `1px solid ${vars.inputBorder}`,
              }}
            />
          </div>
        </div>

        {/* Item Table */}
        <div className="overflow-x-auto">
          <table className="w-full mb-4" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: vars.tableHeadBg }}>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  S.N.
                </th>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  Item Name
                </th>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  Qty
                </th>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  Rate
                </th>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  Discount (%)
                </th>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  Amount
                </th>
                <th className="p-2 text-left" style={{ borderBottom: `1px solid ${vars.subtleBorder}`, color: vars.muted }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${vars.subtleBorder}` }}>
                  <td className="p-2" style={{ color: vars.text }}>
                    {index + 1}
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 rounded"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      style={{
                        ...inputBaseStyle,
                        border: `1px solid ${vars.inputBorder}`,
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 rounded"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                      style={{
                        ...inputBaseStyle,
                        border: `1px solid ${vars.inputBorder}`,
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 rounded"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                      style={{
                        ...inputBaseStyle,
                        border: `1px solid ${vars.inputBorder}`,
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 rounded"
                      value={item.discount}
                      onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                      style={{
                        ...inputBaseStyle,
                        border: `1px solid ${vars.inputBorder}`,
                      }}
                    />
                  </td>
                  <td className="p-2" style={{ color: vars.text }}>
                    {(Number(item.amount) || 0).toFixed(2)}
                  </td>
                  <td className="p-2">
                    <button
                      className="font-semibold"
                      onClick={() => removeItem(index)}
                      style={{ color: vars.danger }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add item button — now uses primary (blue) instead of success (green) */}
          <button
            className="px-4 py-2 rounded font-semibold"
            onClick={addItem}
            style={{
              background: vars.primary,
              color: "#fff",
            }}
          >
            + Add Purchase Item
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right font-bold text-xl mt-4" style={{ color: vars.text }}>
          Sub Total: Rs. {subtotal.toFixed(2)}
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label className="font-semibold text-sm" style={{ color: vars.muted }}>
            Notes / Remarks
          </label>
          <textarea
            className="w-full p-2 rounded mt-1"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              ...inputBaseStyle,
              border: `1px solid ${vars.inputBorder}`,
            }}
          ></textarea>
        </div>

        {/* Payment Mode */}
        <div className="mt-4">
          <label className="font-semibold text-sm" style={{ color: vars.muted }}>
            Payment Mode
          </label>
          <select
            className="w-full p-2 rounded mt-1"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            style={{
              ...inputBaseStyle,
              border: `1px solid ${vars.inputBorder}`,
            }}
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        {/* Attach Images */}
        <div className="mt-4">
          <label className="font-semibold text-sm" style={{ color: vars.muted }}>
            Attach Images
          </label>
          <input type="file" multiple className="w-full mt-1" onChange={handleFiles} style={{ color: vars.text }} />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="px-6 py-2 rounded font-semibold"
            onClick={handleSaveAndNew}
            style={{
              background: "gray",
              color: "#fff",
            }}
          >
            Save & New
          </button>
          <button
            className="px-6 py-2 rounded font-semibold"
            onClick={handleSavePurchase}
            style={{
              background: vars.primary,
              color: "#fff",
            }}
          >
            Save Purchase Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
