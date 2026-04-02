// src/components/InventoryPage.jsx
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export function InventoryPage({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  const [showAddItem, setShowAddItem] = useState(false);
  const [items, setItems] = useState([]);

  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  function handleSave() {
    const newItem = {
      id: Date.now(),
      itemName,
      qty,
      price,
      category,
    };

    setItems([newItem, ...items]);

    setItemName("");
    setQty("");
    setPrice("");
    setCategory("");
    setShowAddItem(false);
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
        {items.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Add Your First Inventory Item
            </h2>

            <p style={{ color: "var(--muted)" }}>
              Manage your stock items easily
            </p>

            <button
              onClick={() => setShowAddItem(true)}
              className="mt-6 px-6 py-3 rounded-lg text-white flex gap-2"
              style={{ background: "#172554" }}
            >
              <Plus size={16} /> Add New Item
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Inventory</h2>

              <button
                onClick={() => setShowAddItem(true)}
                className="px-4 py-2 text-white rounded flex gap-2"
                style={{ background: "#172554" }}
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="p-3 rounded border"
                  style={{
                    background: "var(--surface-100)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{it.itemName}</div>
                      <div style={{ color: "var(--muted)" }}>
                        Qty: {it.qty} | Rs. {it.price}
                      </div>
                    </div>

                    <div style={{ color: "var(--muted)" }}>
                      {it.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

     {/* MODAL */}
{showAddItem && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50">
    
    <div
      className="w-[500px] rounded-md overflow-hidden"
      style={{
        background: "var(--surface-100)",
        color: "var(--text-default)",
        maxHeight: "80vh", // ✅ limit height
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER (fixed) */}
      <div className="flex justify-between p-4 border-b">
        <h3 className="font-semibold">Add Inventory Item</h3>
        <X onClick={() => setShowAddItem(false)} className="cursor-pointer" />
      </div>

      {/* BODY (scrollable) */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <input
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* FOOTER (fixed) */}
      <div className="flex justify-end gap-3 p-4 border-t">
        <button onClick={() => setShowAddItem(false)}>
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 text-white rounded"
          style={{ background: "#172554" }}
        >
          Save Item
        </button>
      </div>

    </div>
  </div>
)}
    </>
  );
}

export default InventoryPage;