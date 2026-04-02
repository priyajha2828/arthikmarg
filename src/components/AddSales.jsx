// src/components/AddSales.jsx
import React, { useEffect, useState, useContext } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if needed

export default function AddSales() {
  const navigate = useNavigate();

  // read theme safely from context; allow theme to be a string or object with { theme }
  const themeContext = useContext(ThemeContext);
  const rawTheme =
    typeof themeContext === "string"
      ? themeContext
      : themeContext && typeof themeContext.theme === "string"
      ? themeContext.theme
      : (themeContext && themeContext?.value) || "light";
  const theme = (rawTheme || "light").toString().toLowerCase();

  // set CSS variables for theme responsiveness (runs whenever theme changes)
  useEffect(() => {
    try {
      const primary = "#174552";
      document.documentElement.style.setProperty("--app-primary", primary);

      // surfaces
      const surfaceLight = "#f3f4f6"; // light grey
      const surfaceDark = "#0b1220"; // deep dark
      const surfaceClassic = "#F6E9D2"; // cream

      // inputs/cards: on classic we'll keep the inputs white for readability
      let surface = surfaceLight;
      let inputBg = "#ffffff";
      let inputBorder = "#e5e7eb";
      let textDefault = "#0f172a";
      let mutedText = "rgba(15,23,42,0.6)";
      let mutedBg = "rgba(0,0,0,0.03)";

      if (theme === "dark") {
        surface = surfaceDark;
        inputBg = "#0b1220";
        inputBorder = "#374151";
        textDefault = "#ffffff";
        mutedText = "rgba(255,255,255,0.72)";
        mutedBg = "#08101a";
      } else if (theme === "classic" || theme === "classic-theme") {
        surface = surfaceClassic;
        // keep inputs white for contrast on cream surface
        inputBg = "#ffffff";
        inputBorder = "#e5e7eb";
        // choose dark text on cream for readability
        textDefault = "#0b1220";
        mutedText = "rgba(11,17,32,0.6)";
        mutedBg = "rgba(11,17,32,0.03)";
      } else {
        // light/default
        surface = surfaceLight;
        inputBg = "#ffffff";
        inputBorder = "#e5e7eb";
        textDefault = "#0f172a";
        mutedText = "rgba(15,23,42,0.6)";
        mutedBg = "rgba(0,0,0,0.03)";
      }

      document.documentElement.style.setProperty("--surface-200", surface);
      document.documentElement.style.setProperty("--input-bg", inputBg);
      document.documentElement.style.setProperty("--input-border", inputBorder);
      document.documentElement.style.setProperty("--text-default", textDefault);
      document.documentElement.style.setProperty("--muted-text", mutedText);
      document.documentElement.style.setProperty("--muted-bg", mutedBg);
    } catch (err) {
      // ignore errors in SSR or restricted envs
    }
  }, [theme]);

  // local form state
  const [form, setForm] = useState({
    party: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    notes: "",
    paymentMode: "",
  });

  const [items, setItems] = useState([{ name: "", qty: 1, rate: 0, discount: 0, amount: 0 }]);
  const [images, setImages] = useState([]);

  // styles referencing CSS variables
  const containerStyle = {
    background: "var(--surface-200, #f3f4f6)", // themed page surface
    color: "var(--text-default, #0f172a)",
    minHeight: "100vh",
    padding: "1.25rem",
  };

  const cardStyle = {
    background: "var(--input-bg, #fff)", // card/input bg (white on classic, dark on dark)
    border: "1px solid var(--input-border, #e5e7eb)",
    color: "var(--text-default, #0f172a)",
    borderRadius: 8,
    overflow: "hidden",
  };

  const inputStyle = {
    background: "var(--input-bg, #fff)",
    borderColor: "var(--input-border, #e5e7eb)",
    color: "var(--text-default, #0f172a)",
  };

  const primaryBtnStyle = {
    background: "var(--app-primary, #174552)",
    color: "#ffffff",
  };

  const neutralBtnStyle = {
    background: "transparent",
    color: "var(--text-default, #0f172a)",
    border: "1px solid var(--input-border, #e5e7eb)",
  };

  // form helpers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    if (field === "qty" || field === "rate" || field === "discount") {
      updated[index][field] = value === "" ? "" : Number(value);
    } else {
      updated[index][field] = value;
    }

    const qty = Number(updated[index].qty || 0);
    const rate = Number(updated[index].rate || 0);
    const discount = Number(updated[index].discount || 0);

    const total = qty * rate;
    const amount = total - (total * discount) / 100;
    updated[index].amount = Number.isFinite(amount) ? amount : 0;

    setItems(updated);
  };

  const addItem = () => setItems((p) => [...p, { name: "", qty: 1, rate: 0, discount: 0, amount: 0 }]);
  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated.length ? updated : [{ name: "", qty: 1, rate: 0, discount: 0, amount: 0 }]);
  };

  const handleImageUpload = (e) => setImages([...e.target.files]);
  const subTotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.party) {
      alert("Please select a party.");
      return;
    }
    if (!items.length || items.every((it) => !it.name)) {
      alert("Add at least one item with a name.");
      return;
    }
    console.log("Sales Form Data:", form);
    console.log("Items:", items);
    console.log("Images:", images);
    alert("Sales Invoice Saved Successfully!");
  };

  return (
    <div style={containerStyle} className="w-full">
      <div className="max-w-5xl mx-auto" style={cardStyle}>
        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4"
            style={{ color: "var(--text-default)" }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-default)" }}>
            Add Sales Invoice
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="font-medium" style={{ color: "var(--muted-text)" }}>Select Party</label>
                <select
                  name="party"
                  className="w-full p-2 rounded mt-1"
                  style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                  value={form.party}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">-- Select Party --</option>
                  <option value="Cash Sale">Cash Sale</option>
                  <option value="Customer 1">Customer 1</option>
                  <option value="Customer 2">Customer 2</option>
                  <option value="Customer 3">Customer 3</option>
                </select>
              </div>

              <div>
                <label className="font-medium" style={{ color: "var(--muted-text)" }}>Invoice No</label>
                <input
                  type="text"
                  name="invoiceNo"
                  className="w-full p-2 rounded mt-1"
                  style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                  placeholder="Enter Invoice No"
                  value={form.invoiceNo}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label className="font-medium" style={{ color: "var(--muted-text)" }}>Invoice Date</label>
                <input
                  type="date"
                  name="invoiceDate"
                  className="w-full p-2 rounded mt-1"
                  style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                  value={form.invoiceDate}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            {/* Billing Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead style={{ background: "var(--muted-bg, rgba(0,0,0,0.03))" }}>
                  <tr>
                    <th className="p-2" style={{ borderBottom: "1px solid var(--input-border)", color: "var(--muted-text)" }}>S.N.</th>
                    <th className="p-2" style={{ borderBottom: "1px solid var(--input-border)", color: "var(--muted-text)" }}>Item Name</th>
                    <th className="p-2" style={{ borderBottom: "1px solid var(--input-border)", color: "var(--muted-text)" }}>Qty</th>
                    <th className="p-2" style={{ borderBottom: "1px solid var(--input-border)", color: "var(--muted-text)" }}>Rate</th>
                    <th className="p-2" style={{ borderBottom: "1px solid var(--input-border)", color: "var(--muted-text)" }}>Discount (%)</th>
                    <th className="p-2 text-right" style={{ borderBottom: "1px solid var(--input-border)", color: "var(--muted-text)" }}>Amount</th>
                    <th className="p-2" style={{ borderBottom: "1px solid var(--input-border)" }}></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid var(--input-border)" }}>
                      <td className="p-2 text-center" style={{ color: "var(--text-default)" }}>{index + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="w-full p-1 rounded"
                          style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          placeholder="Enter Item Name"
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="w-full p-1 rounded"
                          style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                          value={item.qty}
                          onChange={(e) => updateItem(index, "qty", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="w-full p-1 rounded"
                          style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                          value={item.rate}
                          onChange={(e) => updateItem(index, "rate", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="w-full p-1 rounded"
                          style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                          value={item.discount}
                          onChange={(e) => updateItem(index, "discount", e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-right" style={{ color: "var(--text-default)" }}>{Number(item.amount || 0).toFixed(2)}</td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="px-3 py-1 rounded"
                          style={{ background: "transparent", color: "var(--app-primary, #174552)", border: "1px solid var(--input-border)" }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3">
                <button type="button" onClick={addItem} className="px-4 py-2 rounded" style={{ ...primaryBtnStyle }}>
                  Add Billing Item
                </button>
              </div>
            </div>

            {/* Sub Total */}
            <div className="text-right text-xl font-semibold mb-6" style={{ color: "var(--text-default)" }}>
              Sub Total: ₹ {subTotal.toFixed(2)}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="font-medium" style={{ color: "var(--muted-text)" }}>Notes / Remarks</label>
              <textarea
                name="notes"
                className="w-full p-2 rounded mt-1"
                style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                placeholder="Enter any notes here..."
                value={form.notes}
                onChange={handleFormChange}
              />
            </div>

            {/* Payment Mode */}
            <div className="mb-6">
              <label className="font-medium" style={{ color: "var(--muted-text)" }}>Payment Mode</label>
              <select
                name="paymentMode"
                className="w-full p-2 rounded mt-1"
                style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                value={form.paymentMode}
                onChange={handleFormChange}
              >
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="online">Online</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {/* Attach Images */}
            <div className="mb-6">
              <label className="font-medium" style={{ color: "var(--muted-text)" }}>Attach Images</label>
              <input
                type="file"
                multiple
                className="w-full p-2 rounded mt-1"
                style={{ border: "1px solid var(--input-border)", background: "var(--input-bg)" }}
                onChange={handleImageUpload}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button type="button" className="px-5 py-2 rounded" style={{ ...neutralBtnStyle }} onClick={() => window.location.reload()}>
                Save & New
              </button>

              <button type="submit" className="px-6 py-2 rounded" style={{ ...primaryBtnStyle }}>
                Save Sales Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
