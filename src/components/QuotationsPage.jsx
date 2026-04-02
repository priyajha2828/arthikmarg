// src/components/QuotationsPage.jsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import Quotation from "./Quotation";

export function QuotationsPage({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  const [showForm, setShowForm] = useState(false);

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
        {!showForm ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Create Your First Quotation
            </h2>

            <p style={{ color: "var(--muted)" }}>
              Click below to start managing your quotations
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-6 px-6 py-3 rounded-lg text-white flex gap-2"
              style={{ background: "#172554" }}
            >
              <Plus size={16} /> Create New Quotation
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Quotation</h2>

              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-white rounded flex gap-2"
                style={{ background: "#172554" }}
              >
                <Plus size={16} /> New
              </button>
            </div>

            {/* FORM CARD */}
            <div
              style={{
                background: "var(--surface-100)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 10,
                padding: 20,
                boxShadow: "var(--shadow)",
              }}
            >
              <Quotation />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default QuotationsPage;