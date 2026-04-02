import React, { useState } from "react";
import { Camera, Trash2 } from "lucide-react";

/* EMPTY STATE */
function EmptyState({ title, description, buttonText, onClick }) {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      style={{
        background: "var(--bg-default)",
        color: "var(--text-default)",
      }}
    >
      <div className="mb-6">
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center"
          style={{ background: "var(--surface-200)" }}
        >
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--muted)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p style={{ color: "var(--muted)" }} className="mb-6">
        {description}
      </p>

      <button
        onClick={onClick}
        className="px-6 py-3 rounded-lg text-white"
        style={{ background: "#172554" }}
      >
        + {buttonText}
      </button>
    </div>
  );
}

export default function SalesReturn({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  const [returnsList, setReturnsList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [party, setParty] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState([
    { name: "", quantity: 1, rate: 0, discount: 0, amount: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const subtotal = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  /* FIXED ITEM CALCULATION */
  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };

      const qty = Number(next[index].quantity) || 0;
      const rate = Number(next[index].rate) || 0;
      const discount = Number(next[index].discount) || 0;

      next[index].amount = qty * rate - discount;

      return next;
    });
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, rate: 0, discount: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setParty("");
    setInvoiceDate("");
    setItems([{ name: "", quantity: 1, rate: 0, discount: 0, amount: 0 }]);
    setNotes("");
    setImage(null);
  };

  const handleSubmit = (e, saveNew = false) => {
    e?.preventDefault();

    if (!party || !invoiceDate) {
      alert("Fill required fields");
      return;
    }

    const newReturn = {
      id: Date.now(),
      party,
      invoiceDate,
      items,
      notes,
      subtotal,
    };

    setReturnsList([newReturn, ...returnsList]);

    if (saveNew) {
      resetForm();
    } else {
      setShowForm(false);
      resetForm();
    }
  };

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
        {returnsList.length === 0 ? (
          <EmptyState
            title="Create Your First Sales Return"
            description="Start managing your sales returns"
            buttonText="Create Sales Return"
            onClick={() => setShowForm(true)}
          />
        ) : (
          <div className="w-full max-w-4xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Sales Returns</h2>

              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                + Add Return
              </button>
            </div>

            <div className="space-y-3">
              {returnsList.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded border"
                  style={{
                    background: "var(--surface-100)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{r.party}</div>
                      <div style={{ color: "var(--muted)" }}>{r.invoiceDate}</div>
                    </div>

                    <div className="font-semibold">Rs. {r.subtotal}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center pt-10 z-50">
          <div
            className="w-[700px] rounded-md flex flex-col"
            style={{
              background: "var(--surface-100)",
              color: "var(--text-default)",
              maxHeight: "80vh",
            }}
          >
            {/* HEADER */}
            <div className="flex justify-between p-4 border-b">
              <h3>Create Sales Return</h3>
              <button onClick={() => setShowForm(false)}>X</button>
            </div>

            {/* BODY */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <input
                placeholder="Party"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="border p-2 w-full rounded"
              />

              {/* ITEMS */}
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 border p-2 rounded">
                  <input
                    placeholder="Name"
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    className="border p-2 flex-1"
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="border p-2 w-20"
                  />

                  <input
                    type="number"
                    placeholder="Rate"
                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                    className="border p-2 w-24"
                  />

                  <input
                    value={item.amount}
                    readOnly
                    className="border p-2 w-24"
                  />

                  <Trash2
                    onClick={() => removeItem(index)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              ))}

              <button
                onClick={addItem}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                Add Item
              </button>

              <div className="text-right font-semibold">
                Total: Rs. {subtotal}
              </div>

              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <label className="flex gap-2 cursor-pointer">
                <Camera size={18} />
                Attach Image
                <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
              </label>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowForm(false)}>Cancel</button>

              <button
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                Save & New
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}