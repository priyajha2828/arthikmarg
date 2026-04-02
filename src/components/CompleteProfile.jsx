// src/components/CompleteProfile.jsx
import React, { useEffect, useState } from "react";

/**
 * CompleteProfile (theme-aware)
 *
 * Props:
 * - onClose(): () => void
 * - onSave(profile): (profile: { name, business, gst, address }) => void
 *
 * Theme detection checks:
 * - document.documentElement.dataset.theme
 * - html.classList.contains('dark')
 * - localStorage.theme
 * It also watches for changes via MutationObserver + storage event + fallback interval.
 */

function detectTheme() {
  if (typeof document === "undefined") return "light";
  const html = document.documentElement;
  const dt = html?.dataset?.theme;
  if (dt) return dt === "dark" ? "dark" : "light";
  if (html?.classList?.contains?.("dark")) return "dark";
  const ls = typeof window !== "undefined" ? window.localStorage?.getItem("theme") : null;
  if (ls) return ls === "dark" ? "dark" : "light";
  return "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "theme") setTheme(e.newValue === "dark" ? "dark" : "light");
    }
    const mo = new MutationObserver(() => setTheme(detectTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    window.addEventListener("storage", onStorage);
    const tick = setInterval(() => setTheme(detectTheme()), 1000);

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(tick);
    };
  }, []);
  return theme;
}

export default function CompleteProfile({ onClose = () => {}, onSave = () => {} }) {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  // form state
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");

  // validation
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) setError("");
  }, [name, business, gst, address, error]);

  function handleSave() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!business.trim()) {
      setError("Please enter your business name.");
      return;
    }

    const profile = {
      name: name.trim(),
      business: business.trim(),
      gst: gst.trim(),
      address: address.trim(),
    };

    onSave(profile);
    onClose();
  }

  // theme-friendly colors (used inline for concise, predictable results)
  const panelBg = isDark ? "#071425" : "#ffffff";
  const overlayBg = isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)";
  const textColor = isDark ? "#E6EEF8" : "#0F172A";
  const mutedColor = isDark ? "#9CA3AF" : "#6B7280";
  const inputBg = isDark ? "#071429" : "#ffffff";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #e5e7eb";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      {/* overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: overlayBg }}
      />

      {/* modal */}
      <div
        className="relative w-full max-w-md rounded-lg shadow-lg"
        style={{ background: panelBg, border: isDark ? "1px solid rgba(255,255,255,0.04)" : undefined }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: textColor }}>Complete Your Profile</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-2 rounded p-1 hover:bg-gray-100/10"
              style={{ color: mutedColor }}
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-3 rounded px-3 py-2 text-sm" style={{ background: "#FEE2E2", color: "#991B1B" }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-3">
            <label className="block mb-1 text-sm" style={{ color: textColor }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded px-3 py-2 focus:outline-none"
              style={{ background: inputBg, border: inputBorder, color: textColor }}
            />
          </div>

          {/* Business */}
          <div className="mb-3">
            <label className="block mb-1 text-sm" style={{ color: textColor }}>Business Name</label>
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Business / shop name"
              className="w-full rounded px-3 py-2 focus:outline-none"
              style={{ background: inputBg, border: inputBorder, color: textColor }}
            />
          </div>

          {/* GST */}
          <div className="mb-3">
            <label className="block mb-1 text-sm" style={{ color: textColor }}>GST Number (Optional)</label>
            <input
              type="text"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              placeholder="GST / PAN"
              className="w-full rounded px-3 py-2 focus:outline-none"
              style={{ background: inputBg, border: inputBorder, color: textColor }}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block mb-1 text-sm" style={{ color: textColor }}>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Address, city, state..."
              className="w-full rounded px-3 py-2 focus:outline-none"
              style={{ background: inputBg, border: inputBorder, color: textColor }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded"
              style={{ background: isDark ? "#061827" : "#F8FAFC", border: inputBorder, color: mutedColor }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded text-white"
              style={{ background: "#16A34A" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
