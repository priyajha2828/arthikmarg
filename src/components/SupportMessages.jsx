// src/components/SupportMessages.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";

/**
 * SupportMessages.jsx
 * - Matches the UI in your screenshot
 * - Shows an empty state when there are no messages
 * - Contact Support button navigates to /support (adjust if your route differs)
 *
 * Drop into src/components/SupportMessages.jsx
 */

export default function SupportMessages() {
  const navigate = useNavigate();

  // Replace with real data fetch if available
  const messages = []; // empty for the screenshot interface

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", padding: 28 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", boxSizing: "border-box" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 6,
                color: "#111827"
              }}
            >
              <ChevronLeft size={18} /> {/* Back */}
            </button>

            <h1 style={{ fontSize: 24, margin: 0, fontWeight: 700, color: "#0f172a" }}>
              Support Messages
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Filter select */}
            <select
              aria-label="Filter messages"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontSize: 15,
                color: "#111827"
              }}
              defaultValue="all"
            >
              <option value="all">All Messages</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            {/* Contact Support CTA */}
            <button
              onClick={() => navigate("/support")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#172554",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <Plus size={16} /> Contact Support
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ marginTop: 72, minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 24px" }}>
              {/* large round decorative icon container */}
              <div
                aria-hidden
                style={{
                  width: 180,
                  height: 180,
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: "#f6f5f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* decorative SVG similar to your screenshot */}
                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="48" cy="48" r="48" fill="#F3F2F6"/>
                  <g transform="translate(18,18)">
                    <rect x="6" y="10" width="44" height="52" rx="6" fill="#E9E9EE"/>
                    <path d="M12 20h28" stroke="#9AA0A6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 28h20" stroke="#9AA0A6" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="40" cy="44" r="8" fill="#FEE2E2"/>
                    <path d="M44 48l8 8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                  </g>
                </svg>
              </div>

              <h2 style={{ marginTop: 28, fontSize: 20, fontWeight: 700, color: "#111827" }}>
                No Support Messages found
              </h2>

              <p style={{ marginTop: 12, color: "#6b7280", maxWidth: 720, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                There is no message in support. Let us know if you are facing problem by clicking Contact Support and our tech team will work on it.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              {/* If messages exist, render a list. Example row style below (replace with real data as needed) */}
              {messages.map((m) => (
                <div key={m.id} style={{ border: "1px solid #eef2f6", padding: 18, borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700 }}>{m.subject}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{m.status}</div>
                  </div>
                  <div style={{ color: "#374151", marginTop: 8 }}>{m.preview}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
