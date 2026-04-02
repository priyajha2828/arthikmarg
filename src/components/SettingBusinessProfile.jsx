// src/components/SettingBusinessProfile.jsx
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Archive, Calendar } from "lucide-react";

/**
 * Theme detection + watcher (robust)
 * Checks: document.documentElement.dataset.theme, html.classList.contains('dark'), localStorage.theme
 * Observes mutations + storage events + defensive interval fallback.
 */
function detectTheme() {
  if (typeof document === "undefined") return "light";
  try {
    const html = document.documentElement;
    if (html?.dataset?.theme) return html.dataset.theme === "dark" ? "dark" : "light";
    if (html.classList.contains("dark")) return "dark";
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    if (saved) return saved === "dark" ? "dark" : "light";
  } catch (e) {
    // ignore and fallback
  }
  return "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());
  useEffect(() => {
    if (typeof document === "undefined") return;
    const update = () => setTheme(detectTheme());

    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const onStorage = (e) => {
      if (e.key === "theme") update();
    };
    window.addEventListener("storage", onStorage);

    const tick = setInterval(update, 1000); // defensive fallback

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(tick);
    };
  }, []);
  return theme;
}

/**
 * SettingBusinessProfile
 * - Theme-aware: applies a soft grey page background in light mode, darker in dark mode
 * - Panels adapt to theme; inputs, selects and buttons use sensible contrasts
 * - Keeps original functionality but with consistent theming
 */
export default function SettingBusinessProfile() {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  // Basic info
  const [businessName, setBusinessName] = useState("developer");
  const [contactNumber, setContactNumber] = useState("9709068360");
  const [businessEmail, setBusinessEmail] = useState("");
  const [category, setCategory] = useState("Cable Operator");
  const [type, setType] = useState("Retailer");

  // Address
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [street, setStreet] = useState("");

  // Financial
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [bankAccountAdded, setBankAccountAdded] = useState(false);

  // UI
  const [dangerOpen, setDangerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // THEME COLORS
  const pageBg = isDark ? "#07111A" : "#F3F4F6"; // whole page grey
  const panelBg = isDark ? "#071425" : "#ffffff";
  const panelBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #e6eef6";
  const inputBg = isDark ? "#071429" : "#ffffff";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb";
  const mutedText = isDark ? "#9CA3AF" : "#6B7280";
  const textColor = isDark ? "#E6EEF8" : "#0F172A";

  // Handlers
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Business profile saved (mock)");
    }, 700);
  };

  const handleAddBank = () => {
    setBankAccountAdded(true);
    alert("Bank account added (mock)");
  };

  const handleCloseFiscal = () => {
    if (!confirm("Close fiscal year? This will archive the business and create a new profile.")) return;
    alert("Fiscal year closed (mock)");
  };

  const handleArchive = () => {
    if (!confirm("Archive this business profile? You will only have read-only access.")) return;
    alert("Business archived (mock)");
  };

  const handleDelete = () => {
    if (!confirm("Delete business profile permanently? This cannot be undone.")) return;
    alert("Business deleted (mock)");
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ background: pageBg, color: textColor }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: textColor }}>
          Business Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information */}
          <section
            className="rounded-lg shadow-sm p-6"
            style={{ background: panelBg, border: panelBorder }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Basic Information
            </h3>

            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium" style={{ color: mutedText }}>
                    Business Name
                  </label>
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ background: inputBg, border: inputBorder, color: textColor }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium" style={{ color: mutedText }}>
                    Business Contact Number
                  </label>
                  <input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ background: inputBg, border: inputBorder, color: textColor }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium" style={{ color: mutedText }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="Enter your business email"
                    className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ background: inputBg, border: inputBorder, color: textColor }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium" style={{ color: mutedText }}>
                      Business Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                      style={{ background: inputBg, border: inputBorder, color: textColor }}
                    >
                      <option>Cable Operator</option>
                      <option>Retail</option>
                      <option>Wholesale</option>
                      <option>Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium" style={{ color: mutedText }}>
                      Business Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                      style={{ background: inputBg, border: inputBorder, color: textColor }}
                    >
                      <option>Retailer</option>
                      <option>Distributor</option>
                      <option>Manufacturer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-40 flex flex-col items-center gap-3">
                <div
                  className="w-28 h-28 rounded-md flex items-center justify-center"
                  style={{ background: isDark ? "#0f1724" : "#f3f4f6", color: mutedText }}
                >
                  <svg width="28" height="20" viewBox="0 0 24 24" fill="none" className="opacity-70">
                    <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 11l2 2 3-3 4 4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>

                <label className="w-full">
                  <input type="file" className="hidden" />
                  <div
                    className="px-4 py-2 border rounded-lg text-sm font-medium text-center cursor-pointer"
                    style={{ background: isDark ? "#061827" : "#ffffff", border: inputBorder, color: textColor }}
                  >
                    Upload Photo
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section
            className="rounded-lg shadow-sm p-6"
            style={{ background: panelBg, border: panelBorder }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Address Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium" style={{ color: mutedText }}>
                  Province
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ background: inputBg, border: inputBorder, color: textColor }}
                >
                  <option value="">Select Province</option>
                  <option>Province 1</option>
                  <option>Province 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium" style={{ color: mutedText }}>
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ background: inputBg, border: inputBorder, color: textColor }}
                >
                  <option value="">Select District</option>
                  <option>District A</option>
                  <option>District B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium" style={{ color: mutedText }}>
                  Municipality
                </label>
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ background: inputBg, border: inputBorder, color: textColor }}
                >
                  <option value="">Select Municipality</option>
                  <option>Municipality 1</option>
                  <option>Municipality 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium" style={{ color: mutedText }}>
                  Street Address
                </label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter the name of the Street"
                  className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ background: inputBg, border: inputBorder, color: textColor }}
                />
              </div>
            </div>
          </section>

          {/* Financial Information */}
          <section
            className="rounded-lg shadow-sm p-6"
            style={{ background: panelBg, border: panelBorder }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Financial Information
            </h3>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium" style={{ color: mutedText }}>
                  Registration Number
                </label>
                <input
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="Enter registration number"
                  className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ background: inputBg, border: inputBorder, color: textColor }}
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleAddBank}
                  className="px-4 py-2 rounded-lg font-medium transition"
                  style={{
                    color: "#172554",
                    background: isDark ? "#061827" : "#ffffff",
                    border: inputBorder,
                  }}
                >
                  {bankAccountAdded ? "Bank Account Added" : "Add Bank Account"}
                  <span className="ml-2">›</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-md text-white"
                style={{ background: "#172554", opacity: saving ? 0.75 : 1 }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Details"}
              </button>
            </div>
          </section>

          {/* Danger Area */}
          <section
            className="rounded-lg shadow-sm"
            style={{ background: panelBg, border: panelBorder }}
          >
            <button
              type="button"
              onClick={() => setDangerOpen((s) => !s)}
              className="w-full px-6 py-4 flex items-center justify-between"
              style={{ color: textColor }}
            >
              <div className="text-left">
                <h4 className="font-semibold">Danger Area</h4>
              </div>
              <div>{dangerOpen ? <ChevronUp /> : <ChevronDown />}</div>
            </button>

            {dangerOpen && (
              <div className="divide-y">
                <div className="p-4 flex items-start gap-4">
                  <div className="p-3 rounded-md" style={{ background: isDark ? "#061827" : "#f8fafc" }}>
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">Close Fiscal Year</h5>
                    <p className="text-sm" style={{ color: mutedText }}>
                      This business will be archived & a new profile will be created by carrying forward old balance as opening balance.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={handleCloseFiscal}
                      className="px-4 py-2 rounded-md"
                      style={{
                        color: "#172554",
                        background: isDark ? "transparent" : "#ffffff",
                        border: inputBorder,
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-4">
                  <div className="p-3 rounded-md" style={{ background: isDark ? "#061827" : "#f8fafc" }}>
                    <Archive size={20} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">Archive Business Profile</h5>
                    <p className="text-sm" style={{ color: mutedText }}>
                      This business profile will be inactive but you will be able to access all data in read-only mode.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={handleArchive}
                      className="px-4 py-2 rounded-md"
                      style={{
                        color: "#172554",
                        background: isDark ? "transparent" : "#ffffff",
                        border: inputBorder,
                      }}
                    >
                      Archive
                    </button>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-4">
                  <div className="p-3 rounded-md" style={{ background: isDark ? "#3b0710" : "#fff1f2" }}>
                    <Trash2 size={20} style={{ color: "#dc2626" }} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold" style={{ color: "#dc2626" }}>
                      Delete Business Profile
                    </h5>
                    <p className="text-sm" style={{ color: mutedText }}>
                      Your business profile will be deleted permanently.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 rounded-md"
                      style={{
                        background: isDark ? "#3b0710" : "#fff1f2",
                        color: "#dc2626",
                        border: inputBorder,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
}
