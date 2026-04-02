// src/pages/SettingAccount.jsx
import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

/**
 * Theme detection + watcher
 * - Checks (in order): document.documentElement.dataset.theme, html.classList.contains('dark'), localStorage.theme
 * - Observes html attribute changes and storage events, with defensive interval fallback
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
    // fallback to light
  }
  return "light";
}

function useThemeWatcher() {
  const [theme, setTheme] = useState(detectTheme());

  useEffect(() => {
    if (typeof document === "undefined") return;

    const update = () => {
      try {
        setTheme(detectTheme());
      } catch {
        setTheme("light");
      }
    };

    // MutationObserver to watch for class / data-theme changes on <html>
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    // storage event (cross-tab)
    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === "theme") update();
    };
    window.addEventListener("storage", onStorage);

    // defensive fallback: some theme toggles might not trigger above
    const guard = setInterval(update, 1000);

    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(guard);
    };
  }, []);

  return theme;
}

/**
 * SettingAccount - theme-aware page with whole grey background
 */
export default function SettingAccount() {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  const [name, setName] = useState("priya jha");
  const [phone, setPhone] = useState("+977 9709068360");
  const [email, setEmail] = useState("");

  // THEME COLORS
  // "whole bg grey" requirement implemented: pageBg is grey in both modes (lighter/darker)
  const pageBg = isDark ? "#07121a" : "#F3F4F6"; // whole page background (light gray / dark navy-ish)
  const contentPanelBg = isDark ? "#071425" : "#ffffff";
  const panelBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid #e5e7eb";
  const inputBg = isDark ? "#071429" : "#ffffff";
  const inputBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb";
  const labelColor = isDark ? "#CBD5E1" : "#374151";
  const textColor = isDark ? "#E6EEF8" : "#0F172A";
  const secondaryPanel = isDark ? "#061827" : "#F8FAFC";

  const handleUpdate = () => {
    // placeholder for API
    alert("Account Updated!");
  };

  return (
    <div
      className="min-h-screen py-8 px-6"
      style={{
        background: pageBg,
        color: textColor,
        transition: "background-color 180ms ease, color 180ms ease",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: textColor }}>
          My Account
        </h2>

        <div
          className="rounded-xl p-6 shadow"
          style={{
            background: contentPanelBg,
            border: panelBorder,
            transition: "background-color 180ms ease, border-color 180ms ease",
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
            Basic Information
          </h3>

          <div className="flex flex-wrap gap-6">
            {/* Left form */}
            <div className="flex-1 min-w-[240px] space-y-4">
              <div>
                <label className="text-sm font-medium" style={{ color: labelColor }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg focus:outline-none"
                  style={{
                    background: inputBg,
                    border: inputBorder,
                    color: textColor,
                    transition: "background-color 180ms ease, border-color 180ms ease, color 180ms ease",
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: labelColor }}>
                  Your Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg focus:outline-none"
                  style={{
                    background: inputBg,
                    border: inputBorder,
                    color: textColor,
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: labelColor }}>
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg focus:outline-none"
                  style={{
                    background: inputBg,
                    border: inputBorder,
                    color: textColor,
                  }}
                />
              </div>
            </div>

            {/* Right: profile photo */}
            <div className="w-40 flex flex-col items-center gap-3">
              <div
                className="w-28 h-28 rounded-md overflow-hidden flex items-center justify-center"
                style={{ background: isDark ? "#0f1724" : "#d1d5db" }}
                aria-hidden
              >
                {/* placeholder circle — replace with <img/> later */}
                <div style={{ width: 72, height: 72, borderRadius: 9999, background: isDark ? "#0b1220" : "#e6e9ef" }} />
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: secondaryPanel,
                  border: panelBorder,
                  color: textColor,
                }}
              >
                Upload Photo
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ background: "#172554" }}
            >
              Update Account
            </button>

            <button
              onClick={() => {
                // replace with real sign-out action
                alert("Logged out (demo)");
              }}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#ef4444", background: "transparent", border: "none" }}
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
