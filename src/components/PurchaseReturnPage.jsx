import React from "react";
import { Plus } from "lucide-react";

export function PurchaseReturnPage({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  return (
    <div
      className="fixed top-16 right-0 bottom-0 flex flex-col items-center justify-center"
      style={{
        left: sidebarOffset,
        background: "var(--bg-default)",
        color: "var(--text-default)",
      }}
    >
      <div className="max-w-lg w-full flex flex-col items-center text-center space-y-6 px-4">

        {/* Illustration */}
        <div className="relative flex flex-col items-center mb-4">
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{ background: "var(--surface-200)" }}
          >
            <div
              className="w-24 h-32 rounded-lg flex flex-col items-center p-3 shadow-sm relative -top-2"
              style={{
                background: "var(--surface-100)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Header */}
              <div
                className="w-full h-8 rounded-t-md mb-2 flex items-center px-2"
                style={{ background: "var(--surface-300)" }}
              >
                <div className="w-10 h-1 bg-white rounded opacity-70"></div>
              </div>

              {/* Lines */}
              <div style={{ background: "var(--surface-300)" }} className="w-12 h-2 rounded self-start mb-2"></div>
              <div style={{ background: "var(--surface-200)" }} className="w-16 h-2 rounded self-start mb-2"></div>
              <div style={{ background: "var(--surface-200)" }} className="w-16 h-2 rounded self-start mb-2"></div>
              <div style={{ background: "var(--surface-200)" }} className="w-16 h-2 rounded self-start mb-2"></div>
              <div style={{ background: "var(--surface-200)" }} className="w-16 h-2 rounded self-start mb-2"></div>
            </div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold">
          Create Your First Purchase Return
        </h2>

        <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
          Click on the create purchase return button and start managing your purchase returns.
        </p>

        {/* Button */}
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold"
          style={{ background: "#172554" }}
        >
          <Plus size={20} />
          Create Purchase Return
        </button>

      </div>
    </div>
  );
}

export default PurchaseReturnPage;