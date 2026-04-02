import React, { useState, useEffect } from "react";
import { Camera, Trash2, ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * CreateQuotation.jsx
 * Final tuned version to match the screenshot as closely as possible.
 * Replace existing CreateQuotation.jsx with this file.
 */

export default function CreateQuotation() {
  const navigate = useNavigate();

  const [party, setParty] = useState("");
  const [quotationType, setQuotationType] = useState("manual");
  const [quotationNo, setQuotationNo] = useState("1");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState([
    { name: "", quantity: 1, rate: 0, discountPct: 0, discountRs: 0, amount: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  // initialize amounts
  useEffect(() => {
    setItems((cur) =>
      cur.map((it) => {
        const q = Number(it.quantity || 0);
        const r = Number(it.rate || 0);
        const pct = Number(it.discountPct || 0);
        const rs = Number(it.discountRs || 0);
        const base = q * r;
        const pctDiscount = (base * pct) / 100;
        const amt = base - pctDiscount - rs;
        return { ...it, amount: isNaN(amt) ? 0 : Math.round(Math.max(0, amt) * 100) / 100 };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recalcRow = (row) => {
    const q = Number(row.quantity || 0);
    const r = Number(row.rate || 0);
    const pct = Number(row.discountPct || 0);
    const rs = Number(row.discountRs || 0);
    const base = q * r;
    const pctDiscount = (base * pct) / 100;
    const amt = base - pctDiscount - rs;
    return isNaN(amt) ? 0 : Math.round(Math.max(0, amt) * 100) / 100;
  };

  const handleItemChange = (index, field, raw) => {
    setItems((prev) => {
      const next = [...prev];
      if (["quantity", "rate", "discountPct", "discountRs"].includes(field)) {
        next[index][field] = raw === "" ? "" : Number(raw);
      } else {
        next[index][field] = raw;
      }
      next[index].amount = recalcRow(next[index]);
      return next;
    });
  };

  const addItem = () =>
    setItems((prev) => [...prev, { name: "", quantity: 1, rate: 0, discountPct: 0, discountRs: 0, amount: 0 }]);

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce((acc, it) => acc + Number(it.amount || 0), 0);
  const totalAmount = subtotal;

  const resetForm = () => {
    setParty("");
    setQuotationType("manual");
    setQuotationNo("1");
    setInvoiceDate("");
    setItems([{ name: "", quantity: 1, rate: 0, discountPct: 0, discountRs: 0, amount: 0 }]);
    setNotes("");
    setImage(null);
  };

  const handleSave = (saveNew = false) => {
    const payload = { party, quotationNo, invoiceDate, items, notes, subtotal, imageName: image ? image.name : null };
    console.log("Save", payload);
    alert("Quotation saved (client-side)");
    if (saveNew) resetForm();
    else navigate("/quotation");
  };

  return (
    <div className="min-h-[70vh] bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Header: back button + title + right block */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Back button sized to match screenshot */}
              <button
                onClick={() => navigate("/quotation")}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="Back"
              >
                <ChevronLeft size={18} />
              </button>

              <h1 className="text-2xl font-semibold text-gray-800">Create Quotation</h1>
            </div>

            {/* Right block: Quotation No + Manual + Invoice Date */}
            <div className="w-80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Quotation No</label>
                <div
                  className={`text-sm font-semibold ${quotationType === "manual" ? "text-green-600" : "text-gray-400"}`}
                  onClick={() => {
                    setQuotationType((p) => (p === "manual" ? "auto" : "manual"));
                    if (quotationType === "auto") setQuotationNo("AUTO-001");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {quotationType === "manual" ? "Manual" : "Auto"}
                </div>
              </div>

              <input
                type="text"
                value={quotationNo}
                onChange={(e) => setQuotationNo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Top area: Party select (left) with green rounded border focus look */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Party</label>
            <div className="relative max-w-xl">
              <input
                type="text"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                placeholder="Search for party"
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">▾</div>
            </div>
            {/* subtle underline like screenshot */}
            <div className="mt-4 h-2 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>

          {/* Items table */}
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  <th className="px-4 py-3 w-12 text-left">S.N.</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 w-32 text-left">Quantity</th>
                  <th className="px-4 py-3 w-36 text-left">Rate</th>
                  <th className="px-4 py-3 w-48 text-left">Discount</th>
                  <th className="px-4 py-3 w-36 text-right">Amount</th>
                  <th className="px-4 py-3 w-12"> </th>
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t border-gray-100 align-middle">
                    <td className="px-4 py-4 text-gray-700">{idx + 1}</td>

                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Enter Item name"
                        value={it.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </td>

                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="w-full px-2 py-2 border rounded text-center"
                      />
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600">Rs.</div>
                        <input
                          type="number"
                          min="0"
                          value={it.rate}
                          onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                          className="w-full px-2 py-2 border rounded"
                          placeholder="0"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={it.discountPct}
                            onChange={(e) => handleItemChange(idx, "discountPct", e.target.value)}
                            className="w-20 px-2 py-2 border rounded text-center"
                            placeholder="%"
                          />
                          <div className="text-sm text-gray-500">%</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-600">Rs.</div>
                          <input
                            type="number"
                            min="0"
                            value={it.discountRs}
                            onChange={(e) => handleItemChange(idx, "discountRs", e.target.value)}
                            className="w-24 px-2 py-2 border rounded"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2 text-right text-gray-700 font-medium">Rs. {it.amount}</td>

                    <td className="px-4 py-2 text-center">
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Sub total row */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-medium">Sub Total</td>
                  <td className="px-4 py-3 text-right font-semibold">Rs. {subtotal}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <button onClick={addItem} className="mt-3 inline-flex items-center gap-2 text-green-600 font-medium">
              + Add Billing Item
            </button>
          </div>

          {/* Lower area: notes / total / attach images */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes or Remarks</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter note or description..."
                className="w-full px-4 py-3 border rounded h-32"
              />
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                <input
                  type="text"
                  readOnly
                  value={`Rs. ${totalAmount}`}
                  className="w-full px-4 py-3 border rounded text-right text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach Images</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center justify-center w-20 h-20 border border-gray-200 rounded-lg cursor-pointer">
                    <Camera size={22} />
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
                  </label>
                  <div className="text-sm text-gray-600">{image ? image.name : "No file"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons bottom (left Save & New, right Generate Quotation) */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <button onClick={() => handleSave(true)} className="px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50">
                Save & New
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave(false)}
                className="px-6 py-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 flex items-center gap-3"
              >
                Generate Quotation
                <span className="inline-flex items-center justify-center bg-green-600 px-2 py-2 rounded-r-md">
                  <ChevronDown size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
