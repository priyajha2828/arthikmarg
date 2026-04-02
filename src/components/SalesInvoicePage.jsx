// src/components/SalesInvoicePage.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

/**
 * SalesInvoicePage (theme-aware)
 * - Uses ThemeContext to set CSS variables so the form responds to theme changes
 * - Form area uses --surface-200 (light grey in light theme)
 * - Inputs/cards use --input-bg / --input-border
 * - Primary color set to --app-primary (#174552)
 */
export default function SalesInvoicePage({ sidebarOpen = true }) {
  const expandedWidth = "24rem";
  const COLLAPSED_MARGIN = "4rem";
  const sidebarOffset = sidebarOpen ? expandedWidth : COLLAPSED_MARGIN;

  const navigate = useNavigate();

  // Theme from context (safe fallback)
  const themeContext = typeof ThemeContext !== "undefined" && ThemeContext ? useContext(ThemeContext) : { theme: "light" };
  const { theme } = themeContext || { theme: "light" };

  // UI: show initial empty state or form
  const [showForm, setShowForm] = useState(false);

  // ----- form state -----
  const [partyQuery, setPartyQuery] = useState("");
  const [partyOpen, setPartyOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState({ id: "cash", name: "Cash Sale" });

  const [invoiceNo, setInvoiceNo] = useState("1");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [items, setItems] = useState([
    { id: Date.now(), name: "", qty: 1, rate: "", discountPercent: "", discountRs: "" },
  ]);

  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [attachments, setAttachments] = useState([]);
  const [uploadPreviews, setUploadPreviews] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const partyInputRef = useRef(null);

  const sampleParties = [
    { id: "cash", name: "Cash Sale", emoji: "💵" },
    { id: "party_1", name: "Sai Traders" },
    { id: "party_2", name: "Ramesh & Co." },
    { id: "party_3", name: "ABC Enterprises" },
  ];

  // ----- amounts -----
  const computeRowAmount = (row) => {
    const qty = Number(row.qty || 0);
    const rate = Number(row.rate || 0);
    const gross = qty * rate;
    const dRs = Number(row.discountRs || 0);
    const dPct = Number(row.discountPercent || 0);
    let discount = 0;
    if (dRs > 0) discount = dRs;
    else if (dPct > 0) discount = (dPct / 100) * gross;
    const net = Math.max(0, gross - discount);
    return net;
  };

  const subtotal = items.reduce((s, it) => s + computeRowAmount(it), 0);
  const totalAmount = subtotal;

  // handlers
  const addBillingItem = () => {
    setItems((p) => [
      ...p,
      { id: Date.now() + Math.random(), name: "", qty: 1, rate: "", discountPercent: "", discountRs: "" },
    ]);
  };

  const updateItem = (idx, patch) => {
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const onAttachFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setAttachments((p) => [...p, ...files]);

    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadPreviews((p) => [...p, { name: f.name, url: ev.target.result }]);
      };
      reader.readAsDataURL(f);
    });

    e.target.value = null;
  };

  const removePreview = (idx) => {
    setUploadPreviews((p) => p.filter((_, i) => i !== idx));
    setAttachments((p) => p.filter((_, i) => i !== idx));
  };

  const handleSave = (e) => {
    e?.preventDefault();

    if (!selectedParty) {
      setError("Please select a party or Cash Sale.");
      return;
    }
    if (!invoiceNo || invoiceNo.trim() === "") {
      setError("Please enter invoice number.");
      return;
    }
    if (!items.length) {
      setError("Add at least one billing item.");
      return;
    }
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.name || it.name.trim() === "") {
        setError(`Enter item name for line ${i + 1}`);
        return;
      }
      if (!it.rate || Number(it.rate) <= 0) {
        setError(`Enter a valid rate for line ${i + 1}`);
        return;
      }
    }

    setError("");
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      alert(`Invoice ${invoiceNo} saved. Total Rs. ${totalAmount.toLocaleString()}`);
      setShowForm(false);
      setItems([{ id: Date.now(), name: "", qty: 1, rate: "", discountPercent: "", discountRs: "" }]);
      setNotes("");
      setAttachments([]);
      setUploadPreviews([]);
    }, 900);
  };

  // party search
  const filteredParties = sampleParties.filter((p) => p.name.toLowerCase().includes(partyQuery.toLowerCase()));
  useEffect(() => {
    if (partyOpen) partyInputRef.current?.focus();
  }, [partyOpen]);

  // THEME EFFECT: set CSS variables so the UI responds to theme changes
  useEffect(() => {
    try {
      const primary = "#174552";
      document.documentElement.style.setProperty("--app-primary", primary);

      const surfaceLight = "#f3f4f6"; // grey background for light
      const surfaceDark = "#0b1220"; // dark background for dark
      const surfaceClassic = "#F6E9D2";

      const surface = theme === "dark" ? surfaceDark : theme === "classic" ? surfaceClassic : surfaceLight;
      document.documentElement.style.setProperty("--surface-200", surface);

      const inputBg = theme === "dark" ? "#0b1220" : "#ffffff";
      const inputBorder = theme === "dark" ? "#374151" : "#e5e7eb";
      document.documentElement.style.setProperty("--input-bg", inputBg);
      document.documentElement.style.setProperty("--input-border", inputBorder);

      const textDefault = theme === "dark" ? "#ffffff" : "#0f172a";
      document.documentElement.style.setProperty("--text-default", textDefault);

      const muted = theme === "dark" ? "rgba(255,255,255,0.72)" : "rgba(15,23,42,0.6)";
      document.documentElement.style.setProperty("--muted-text", muted);
    } catch (err) {
      // ignore in SSR
    }
  }, [theme]);

  // Styles that use vars
  const pageStyle = {
    left: sidebarOffset,
    width: `calc(100% - ${sidebarOffset})`,
    top: "4rem",
    bottom: 0,
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "var(--surface-200, #f3f4f6)",
    color: "var(--text-default, #0f172a)",
    overflow: "auto",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  const inputStyle = {
    background: "var(--input-bg, #fff)",
    borderColor: "var(--input-border, #e5e7eb)",
    color: "var(--text-default, #0f172a)",
  };

  const primaryBtnStyle = {
    background: "var(--app-primary, #174552)",
    color: "#fff",
  };

  const neutralBorder = { borderColor: "var(--input-border, #e5e7eb)" };

  // EmptyState and FormUI (FormUI uses theme vars)
  const EmptyState = () => (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="max-w-lg w-full flex flex-col items-center text-center space-y-6">
        <div className="relative flex flex-col items-center mb-4">
          <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-24 h-32 bg-white border-2 border-gray-200 rounded-lg flex flex-col items-center p-3 shadow-sm relative -top-2">
              <div className="w-full h-8 bg-gray-200 rounded-t-md mb-2"></div>
              <div className="w-16 h-2 bg-gray-100 rounded self-start mb-2"></div>
              <div className="w-20 h-2 bg-gray-100 rounded self-start mb-2"></div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold" style={{ color: "var(--text-default)" }}>Create Your First Sales Invoice</h2>

        <p className="text-base max-w-md" style={{ color: "var(--muted-text)" }}>
          Click on create sales invoice to start.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold" style={primaryBtnStyle}>
            <Plus size={18} /> Create Sales Invoice
          </button>
        </div>
      </div>
    </div>
  );

  const FormUI = () => (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full" style={{ background: "var(--surface-200, #f3f4f6)" }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setShowForm(false)} className="p-2 rounded" aria-label="Back" style={{ color: "var(--text-default)" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-default)" }}>Create Sales Invoice</h1>
      </div>

      <div className="rounded-lg shadow-sm" style={{ background: "var(--input-bg, #fff)", border: "1px solid var(--input-border, #e5e7eb)" }}>
        <form onSubmit={handleSave} className="p-6">
          {/* top row */}
          <div className="grid grid-cols-12 gap-4 items-start mb-6">
            <div className="col-span-6">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-default)" }}>Select Party</label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPartyOpen((s) => !s)}
                  className="w-full text-left rounded-lg px-3 py-2 flex items-center justify-between"
                  aria-haspopup="listbox"
                  style={{ background: "var(--input-bg)", border: "2px solid var(--input-border)", color: "var(--text-default)" }}
                >
                  <div>{selectedParty ? selectedParty.name : "Search for party"}</div>
                  <div style={{ color: "var(--muted-text)" }}>▾</div>
                </button>

                {partyOpen && (
                  <div className="absolute left-0 mt-2 w-full border rounded-lg shadow-lg z-40" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)" }}>
                    <div className="p-2">
                      <input
                        ref={partyInputRef}
                        value={partyQuery}
                        onChange={(e) => setPartyQuery(e.target.value)}
                        className="w-full rounded px-3 py-2"
                        placeholder="Search for party"
                        aria-label="Search parties"
                        style={{ ...inputStyle, border: "1px solid var(--input-border)" }}
                      />
                    </div>

                    <ul role="listbox" className="max-h-56 overflow-auto">
                      {filteredParties.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedParty(p);
                              setPartyOpen(false);
                              setPartyQuery("");
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                            style={{ color: "var(--text-default)" }}
                          >
                            <div className="text-sm">{p.emoji || "👤"}</div>
                            <div className="text-sm">{p.name}</div>
                          </button>
                        </li>
                      ))}
                      {filteredParties.length === 0 && (
                        <li className="px-4 py-3 text-sm" style={{ color: "var(--muted-text)" }}>No parties found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-6 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-default)" }}>Invoice No</label>
                <input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full rounded px-3 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-default)" }}>Invoice Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full rounded px-3 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
              </div>
            </div>
          </div>

          {/* items table */}
          <div className="bg-transparent border rounded-lg overflow-hidden mb-6" style={{ background: "transparent" }}>
            <table className="w-full table-fixed text-sm">
              <thead style={{ background: "rgba(0,0,0,0.03)" }}>
                <tr>
                  <th className="w-12 p-3 text-left" style={{ color: "var(--text-default)" }}>S.N.</th>
                  <th className="p-3 text-left" style={{ color: "var(--text-default)" }}>Name</th>
                  <th className="w-28 p-3 text-left" style={{ color: "var(--text-default)" }}>Quantity</th>
                  <th className="w-36 p-3 text-left" style={{ color: "var(--text-default)" }}>Rate (Rs.)</th>
                  <th className="w-40 p-3 text-left" style={{ color: "var(--text-default)" }}>Discount</th>
                  <th className="w-36 p-3 text-right" style={{ color: "var(--text-default)" }}>Amount (Rs.)</th>
                  <th className="w-12 p-3"></th>
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id} className="border-t" style={{ borderColor: "var(--input-border)" }}>
                    <td className="p-3 align-top" style={{ color: "var(--text-default)" }}>{idx + 1}</td>

                    <td className="p-3">
                      <input value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} placeholder="Enter Item name" className="w-full rounded px-3 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
                    </td>

                    <td className="p-3">
                      <input type="number" min="0" value={it.qty} onChange={(e) => updateItem(idx, { qty: e.target.value })} className="w-full rounded px-3 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: "var(--muted-text)" }}>Rs.</span>
                        <input type="number" min="0" value={it.rate} onChange={(e) => updateItem(idx, { rate: e.target.value })} className="w-full rounded px-3 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2 items-center">
                        <input type="number" min="0" max="100" value={it.discountPercent} onChange={(e) => updateItem(idx, { discountPercent: e.target.value, discountRs: "" })} placeholder="%" className="w-1/3 rounded px-2 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
                        <span className="text-sm" style={{ color: "var(--muted-text)" }}>%</span>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-sm" style={{ color: "var(--muted-text)" }}>Rs.</span>
                          <input type="number" min="0" value={it.discountRs} onChange={(e) => updateItem(idx, { discountRs: e.target.value, discountPercent: "" })} placeholder="Rs." className="w-2/3 rounded px-2 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-right align-top" style={{ color: "var(--text-default)" }}>Rs. {Number(computeRowAmount(it)).toLocaleString()}</td>

                    <td className="p-3 text-right align-top">
                      <button type="button" onClick={() => removeItem(idx)} className="p-1 rounded" style={{ color: "var(--app-primary, #174552)", background: "transparent" }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={7} className="p-3">
                    <button type="button" onClick={addBillingItem} className="inline-flex items-center gap-2" style={{ color: "var(--app-primary, #174552)" }}>
                      <Plus size={14} /> Add Billing Item
                    </button>
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className="p-3 text-right font-semibold" style={{ color: "var(--text-default)" }}>Sub Total</td>
                  <td className="p-3 text-right font-semibold" style={{ color: "var(--text-default)" }}>Rs. {Number(subtotal).toLocaleString()}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* notes + attach + totals + payment mode */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-default)" }}>Notes or Remarks</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter note or description..." className="w-full rounded px-3 py-3 min-h-[120px]" style={{ ...inputStyle, border: "1px solid var(--input-border)" }} />

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-default)" }}>Attach Images</label>
                <div className="flex items-center gap-3">
                  <label className="w-16 h-16 border rounded-lg flex items-center justify-center text-gray-400 cursor-pointer" style={neutralBorder}>
                    <input type="file" accept="image/*" className="hidden" onChange={onAttachFiles} />
                    <div className="text-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12h14" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </label>

                  <div className="flex gap-3">
                    {uploadPreviews.map((p, idx) => (
                      <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden" style={neutralBorder}>
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePreview(idx)} className="absolute top-0 right-0 bg-white p-1 rounded-bl">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <div className="p-4 border rounded-lg mb-4" style={{ borderColor: "var(--input-border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm" style={{ color: "var(--muted-text)" }}>Total Amount</div>
                  <div className="text-lg font-semibold" style={{ color: "var(--text-default)" }}>Rs. {Number(totalAmount).toLocaleString()}</div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-default)" }}>Payment Mode</label>
                  <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full rounded px-3 py-2" style={{ ...inputStyle, border: "1px solid var(--input-border)" }}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Credit</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded" style={{ border: "1px solid var(--input-border)", background: "transparent", color: "var(--text-default)" }}>Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 px-4 py-2 rounded" style={{ ...primaryBtnStyle }}>
                    {saving ? "Saving..." : "Save & Create"}
                  </button>
                </div>
              </div>

              {error && <div style={{ color: "var(--app-primary, #174552)" }} className="text-sm">{error}</div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed top-16 right-0 bottom-0 overflow-auto" style={pageStyle}>
      {!showForm ? <EmptyState /> : <FormUI />}
    </div>
  );
}
