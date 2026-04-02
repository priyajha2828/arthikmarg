import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export function PurchaseBillsPage({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    billNo: 1,
    date: new Date().toISOString().slice(0, 10),
    vendor: "",
    items: [{ name: "", qty: 1, rate: 0, amount: 0 }],
    notes: "",
    total: 0,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleItemChange(idx, field, value) {
    setForm((p) => {
      const items = [...p.items];
      items[idx] = { ...items[idx], [field]: value };

      const qty = Number(items[idx].qty) || 0;
      const rate = Number(items[idx].rate) || 0;
      items[idx].amount = qty * rate;

      const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      return { ...p, items, total };
    });
  }

  function addItem() {
    setForm((p) => ({
      ...p,
      items: [...p.items, { name: "", qty: 1, rate: 0, amount: 0 }],
    }));
  }

  function removeItem(i) {
    setForm((p) => {
      const items = p.items.filter((_, idx) => idx !== i);
      const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      return { ...p, items, total };
    });
  }

  function resetForm(nextBill = false) {
    setForm({
      billNo: nextBill ? form.billNo + 1 : 1,
      date: new Date().toISOString().slice(0, 10),
      vendor: "",
      items: [{ name: "", qty: 1, rate: 0, amount: 0 }],
      notes: "",
      total: 0,
    });
  }

  function handleSave(e, saveNew = false) {
    e?.preventDefault?.();

    console.log("Saving Purchase Bill", form);

    if (saveNew) {
      resetForm(true);
      return;
    }

    setShowCreate(false);
    resetForm(false);
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
        <div className="max-w-lg text-center space-y-6">
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "var(--surface-200)" }}
          />

          <h2 className="text-2xl font-bold">
            Create Your First Purchase Bill
          </h2>

          <p style={{ color: "var(--muted)" }}>
            Start managing your purchases easily
          </p>

          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 text-white rounded-lg flex gap-2 mx-auto"
            style={{ background: "#172554" }}
          >
            <Plus size={18} />
            Create Purchase Bill
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center pt-10 z-50">
          <div
            className="w-[700px] rounded-md flex flex-col"
            style={{
              background: "var(--surface-100)",
              color: "var(--text-default)",
              maxHeight: "85vh",
            }}
          >
            {/* HEADER */}
            <div className="flex justify-between p-4 border-b">
              <h3 className="font-semibold">New Purchase Bill</h3>
              <X onClick={() => setShowCreate(false)} />
            </div>

            {/* BODY */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* TOP */}
              <div className="grid grid-cols-3 gap-4">
                <input
                  name="billNo"
                  value={form.billNo}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Bill No"
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                <input
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Vendor"
                />
              </div>

              {/* ITEMS */}
              {form.items.map((it, idx) => (
                <div key={idx} className="flex gap-2 border p-2 rounded">
                  <input
                    placeholder="Name"
                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    className="border p-2 flex-1"
                  />

                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                    className="border p-2 w-20"
                  />

                  <input
                    type="number"
                    value={it.rate}
                    onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                    className="border p-2 w-24"
                  />

                  <input
                    value={it.amount}
                    readOnly
                    className="border p-2 w-24"
                  />

                  <button
                    onClick={() => removeItem(idx)}
                    className="text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                onClick={addItem}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                + Add Item
              </button>

              {/* NOTES */}
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Notes"
                className="border p-2 w-full rounded"
              />

              {/* TOTAL */}
              <div className="text-right text-lg font-semibold">
                Total: Rs. {form.total}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowCreate(false)}>
                Cancel
              </button>

              <button
                onClick={(e) => handleSave(e, true)}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                Save & New
              </button>

              <button
                onClick={(e) => handleSave(e, false)}
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

export default PurchaseBillsPage;