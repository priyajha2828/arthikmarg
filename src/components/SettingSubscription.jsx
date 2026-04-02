// SettingSubscription.jsx
import React, { useState } from "react";
import { Crown, Calendar, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingSubscription() {
  const [daysRemaining, setDaysRemaining] = useState(6);
  const [billingOpen, setBillingOpen] = useState(false);
  const navigate = useNavigate();

  const BLUE = "#172554"; // UPDATED BLUE COLOR

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Manage Subscription</h2>

        {/* Subscription Card */}
        <div className="border rounded-xl bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Crown className="text-amber-600" size={20} />
            </div>
            <div>
              <div className="font-medium">Karobar Trial</div>
              <div className="text-4xl font-bold text-rose-600 mt-2">{daysRemaining}</div>
              <div className="text-sm text-gray-500 mt-1">Days Remaining</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setBillingOpen(true)}
              className="px-4 py-2 rounded-md"
              style={{ backgroundColor: BLUE, color: "white" }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Trial Info */}
        <div className="mt-6 text-sm text-gray-600 flex items-center gap-3">
          <Calendar size={16} /> Trial started 6 days ago
        </div>
      </div>

      {/* Billing Modal */}
      {billingOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setBillingOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold mb-2">Choose a plan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a plan to upgrade your workspace. You can pay with card or contact sales.
            </p>

            <div className="space-y-3">
              {/* Plan Selection Button */}
              <button
                onClick={() => {
                  setBillingOpen(false);
                  navigate("/billing");
                }}
                className="w-full px-4 py-2 rounded-md border hover:bg-gray-50 transition flex items-center justify-between"
              >
                <span>Pro — ₹499 / month</span>
                <CreditCard size={16} />
              </button>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  alert("Checkout flow would start here (demo).");
                }}
                className="w-full px-4 py-2 rounded-md"
                style={{ backgroundColor: BLUE, color: "white" }}
              >
                Checkout
              </button>

              {/* Cancel */}
              <div className="text-right">
                <button
                  onClick={() => setBillingOpen(false)}
                  className="text-sm text-gray-500 underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
