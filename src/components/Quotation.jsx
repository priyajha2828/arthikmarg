// src/components/Quotation.jsx
import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Quotation() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center p-6"
      style={{
        background: "var(--bg-default)",
        color: "var(--text-default)",
      }}
    >
      <div
        className="text-center max-w-2xl p-6 rounded-xl"
        style={{
          background: "var(--surface-100)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* ICON */}
        <div
          className="mx-auto mb-8 w-40 h-40 rounded-full flex items-center justify-center"
          style={{
            background: "var(--surface-200)",
          }}
        >
          <div
            className="w-20 h-20 rounded-md flex items-center justify-center"
            style={{
              background: "var(--bg-default)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 8h10M7 12h6M7 16h4" />
            </svg>
          </div>
        </div>

        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
          Create Your First Quotation
        </h2>

        {/* TEXT */}
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          Click on the create quotation button and start sending quotations to your customers.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/quotation/create")}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition"
          style={{
            background: "#172554",
            color: "#ffffff",
            boxShadow: "0 6px 20px rgba(23,37,84,0.15)",
          }}
        >
          <Plus size={16} />
          Create Quotation
        </button>
      </div>
    </div>
  );
}