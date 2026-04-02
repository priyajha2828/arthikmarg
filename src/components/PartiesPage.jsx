// src/components/PartiesPage.jsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddPartyForm from "./AddPartyForm"; // default export in your file

export function PartiesPage({ sidebarOpen, setActive }) {
  const [showAddPartyForm, setShowAddPartyForm] = useState(false);
  const navigate = useNavigate();

  const expandedWidth = "24rem";
  const COLLAPSED_MARGIN = "4rem";
  const sidebarOffset = sidebarOpen ? expandedWidth : COLLAPSED_MARGIN;

  const openImportParties = () => {
    // Close modal if open
    setShowAddPartyForm(false);
    // Navigate to import page route
    navigate("/import-parties");
  };

  return (
    <>
      {/* Add Party Form Modal */}
      {showAddPartyForm && (
        <AddPartyForm
          sidebarOpen={sidebarOpen}
          onClose={() => setShowAddPartyForm(false)}
        />
      )}

      <div
        className="fixed top-16 right-0 bottom-0 overflow-auto flex flex-col items-center justify-center transition-colors"
        style={{
          left: sidebarOffset,
          width: `calc(100% - ${sidebarOffset})`,
          background: "var(--bg-default)", // page background follows theme
          color: "var(--text-default)", // page text follows theme
        }}
      >
        <div className="max-w-lg w-full flex flex-col items-center text-center space-y-6 px-4">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-default)" }}
          >
            Let's add your First Party
          </h2>

          <p className="text-base max-w-md" style={{ color: "var(--muted)" }}>
            Click on the add new party button and manage receivables & payables
            with them.
          </p>

          <div className="flex items-center gap-4 pt-2">
            {/* Add New Party Button (primary) */}
            <button
              onClick={() => setShowAddPartyForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-shadow focus:outline-none"
              style={{
                background: "var(--primary-500)",
                color: "white",
                boxShadow: "0 2px 8px rgba(23,37,84,0.08)",
              }}
              title="Add New Party"
            >
              <Plus size={20} />
              Add New Party
            </button>

            {/* Import Parties Button (now navigates) */}
            <button
              onClick={openImportParties}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-shadow focus:outline-none"
              style={{
                background: "var(--surface-100)",
                color: "var(--text-default)",
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.06)",
              }}
            >
              Import Parties
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PartiesPage;
