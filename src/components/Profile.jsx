// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";

/* ---------- THEME DETECTOR ---------- */
function detectTheme() {
  if (typeof document === "undefined") return "light";
  const html = document.documentElement;

  if (html.dataset.theme) return html.dataset.theme === "dark" ? "dark" : "light";
  if (html.classList.contains("dark")) return "dark";

  const stored = localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());

  useEffect(() => {
    const handler = () => setTheme(detectTheme());
    const mo = new MutationObserver(handler);

    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    window.addEventListener("storage", handler);
    const interval = setInterval(handler, 800);

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  return theme;
}

/* ---------- COMPONENT ---------- */
export default function Profile() {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  /* Colors based on theme */
  const pageBg = isDark ? "#0b1628" : "#f3f4f6"; // grey bg
  const panelBg = isDark ? "#071425" : "#ffffff";
  const borderClr = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e5e7eb";
  const textColor = isDark ? "#e6eef8" : "#111827";
  const labelColor = isDark ? "#cbd5e1" : "#374151";
  const inputBg = isDark ? "#0d1a31" : "#ffffff";
  const inputText = isDark ? "#e6eef8" : "#111827";

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: pageBg, color: textColor }}
    >
      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
        My Account
      </h2>

      <div className="space-y-4">

        {/* PANEL */}
        <div
          className="p-4 rounded-xl shadow"
          style={{ background: panelBg, border: borderClr }}
        >
          <h3 className="font-semibold text-lg" style={{ color: textColor }}>
            Basic Information
          </h3>

          {/* Preview Photo */}
          <div className="mt-4">
            <p className="text-sm mb-1" style={{ color: labelColor }}>
              Preview Photo
            </p>
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>

          {/* Name */}
          <div className="mt-4">
            <label className="text-sm" style={{ color: labelColor }}>
              Your Name
            </label>
            <input
              className="w-full p-2 rounded mt-1 focus:outline-none"
              value="Rejina Agrawal"
              style={{
                background: inputBg,
                border: borderClr,
                color: inputText,
              }}
            />
          </div>

          {/* Phone */}
          <div className="mt-4">
            <label className="text-sm" style={{ color: labelColor }}>
              Your Phone Number
            </label>
            <input
              className="w-full p-2 rounded mt-1 focus:outline-none"
              value="+977 9827335786"
              style={{
                background: inputBg,
                border: borderClr,
                color: inputText,
              }}
            />
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="text-sm" style={{ color: labelColor }}>
              Your Email
            </label>
            <input
              className="w-full p-2 rounded mt-1 focus:outline-none"
              placeholder="Enter your Email"
              style={{
                background: inputBg,
                border: borderClr,
                color: inputText,
              }}
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          className="px-4 py-2 rounded text-white font-medium"
          style={{ background: "#10B981" }}
        >
          Update Account
        </button>
      </div>
    </div>
  );
}
