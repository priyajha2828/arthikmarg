// SettingsPage.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SettingsSidebar from "./SettingsSidebar";
import SettingGeneral from "./SettingGeneral";
import SettingAccount from "./SettingAccount";
import SettingBusinessProfile from "./SettingBusinessProfile";
import SettingSubscription from "./SettingSubscription";
import SettingFeaturesParties from "./SettingFeaturesParties";
import SettingFeaturesInventory from "./SettingFeaturesInventory";
import SettingFeaturesTransactions from "./SettingFeaturesTransactions";
import SettingFeaturesInvoicePrint from "./SettingFeaturesInvoicePrint";
/* Simple local placeholders used for pages that aren't yet implemented */
function GeneralSettings() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold">General</h3>
      <p className="mt-2 text-gray-600">General settings content.</p>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold">Security</h3>
    </div>
  );
}

function GenericFeature({ title }) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">Feature settings content for {title}.</p>
    </div>
  );
}

/**
 * SettingsPage
 * - Renders the left SettingsSidebar and the right content area with nested routes.
 * - The sidebar accepts a `collapsed` prop (you can wire a control to toggle this).
 */
export default function SettingsPage() {
  // parent can control initial collapsed state; kept here for future toggling if needed
  const [settingsCollapsed] = useState(false);

  return (
    <div className="flex-1 flex overflow-hidden h-screen">
      <SettingsSidebar collapsed={settingsCollapsed} />

      <section className="flex-1 p-6 overflow-auto min-h-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-gray-500">Configure your account and application.</p>
          </div>
        </div>

        <Routes>
          {/* default -> /settings/general */}
          <Route index element={<Navigate to="general" replace />} />

          {/* top-level settings pages */}
          <Route path="general" element={<SettingGeneral />} />
          <Route path="account" element={<SettingAccount />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="business-profile" element={<SettingBusinessProfile />} />
          <Route path="subscription" element={<SettingSubscription />} />

          {/* Feature Settings children */}
          <Route path="feature-settings/parties" element={<SettingFeaturesParties />} />
          <Route path="feature-settings/inventory" element={<SettingFeaturesInventory />} />
          
          <Route path="feature-settings/invoice-print" element={<SettingFeaturesInvoicePrint />} />
          <Route path="feature-settings/transactions" element={<SettingFeaturesTransactions />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/settings" replace />} />
        </Routes>
      </section>
    </div>
  );
}
