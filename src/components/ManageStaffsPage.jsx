// src/components/ManageStaffs.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * ManageStaffs (theme-aware)
 * - Detects theme from document.documentElement.dataset.theme, html.dark, or localStorage.theme
 * - Watches for runtime changes (MutationObserver + storage + defensive interval)
 * - Uses a light grey page background in light mode and a darker grey in dark mode
 * - Applies conditional styles to card, modal, inputs, buttons, badges and role buttons
 */

function detectTheme() {
  if (typeof document === "undefined") return "light";
  const html = document.documentElement;
  const dt = html?.dataset?.theme;
  if (dt) return dt === "dark" ? "dark" : "light";
  if (html?.classList?.contains("dark")) return "dark";
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
    const tick = setInterval(() => setTheme(detectTheme()), 1000); // defensive fallback
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      clearInterval(tick);
    };
  }, []);
  return theme;
}

function StatusBadge({ status, isDark }) {
  const base = "text-sm font-medium px-3 py-1 rounded-lg inline-block";
  switch ((status || "").toLowerCase()) {
    case "accepted":
      return <span className={`${base} ${isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"}`}>Accepted</span>;
    case "pending":
      return <span className={`${base} ${isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"}`}>Pending</span>;
    case "rejected":
      return <span className={`${base} ${isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>Rejected</span>;
    default:
      return <span className={`${base} ${isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}>{status || "Unknown"}</span>;
  }
}

function LockIcon({ locked }) {
  return (
    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="10.5" width="15" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d={locked ? "M8 10.5V8.3a4 4 0 118 0v2.2" : "M8 10.5V8.3a4 4 0 018 0v2.2"} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Modal({ open, onClose, title, children, isDark }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)" }}
      />
      <div
        className="relative w-full max-w-2xl rounded-lg shadow-lg z-10"
        style={{ background: isDark ? "#071025" : "#ffffff", border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(15,23,42,0.04)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)" }}>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{title}</h3>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function ManageStaffs({ apiUrl = "/api/staffs" }) {
  const theme = useThemeWatcher();
  const isDark = theme === "dark";

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addOpen, setAddOpen] = useState(false);

  const emptyForm = {
    name: "",
    role: "Manager",
    status: "Accepted",
    joinedDate: new Date().toISOString().slice(0, 10),
    locked: false,
  };
  const [form, setForm] = useState(emptyForm);

  const ROLE_OPTIONS = ["Partner", "Manager", "Accountant", "Sales Person", "Stock Manager", "Entry Person"];

  const mockData = [
    {
      id: 1,
      name: "Anything else",
      role: "Admin",
      status: "Accepted",
      joinedDate: "2082-03-12",
      locked: true,
    },
  ];

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setStaffs(Array.isArray(data) ? data : data.data || mockData);
      } catch (err) {
        console.warn("Failed to fetch staffs:", err);
        if (mounted) {
          setStaffs(mockData);
          setError("Could not reach backend — showing demo data.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  function formatJoinedDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const opts = { year: "numeric", month: "short", day: "numeric" };
      return d.toLocaleDateString(undefined, opts);
    } catch {
      return dateStr;
    }
  }

  function openAddModal() {
    setForm({ ...emptyForm, joinedDate: new Date().toISOString().slice(0, 10) });
    setAddOpen(true);
  }

  function submitAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Please enter staff name.");
      return;
    }
    const newStaff = {
      id: Date.now(),
      name: form.name.trim(),
      role: form.role,
      status: form.status,
      joinedDate: form.joinedDate,
      locked: !!form.locked,
    };
    setStaffs((s) => [newStaff, ...s]);
    setAddOpen(false);
  }

  const addBtnRef = useRef(null);
  useEffect(() => {
    if (!addOpen) addBtnRef.current?.focus?.();
  }, [addOpen]);

  // page & panel backgrounds
  const pageBg = isDark ? "#0b1220" : "#F8FAFC"; // light grey in light mode, dark charcoal in dark
  const panelBg = isDark ? "#071025" : "#FFFFFF"; // card background
  const subtlePanelBorder = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(15,23,42,0.04)";

  return (
    <div style={{ background: pageBg, minHeight: "100%", transition: "background-color 160ms ease" }} className={`py-8 px-4 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            Manage Staffs <span className={`${isDark ? "text-gray-300" : "text-gray-500"} text-sm`}>({staffs.length})</span>
          </h2>

          <button
            ref={addBtnRef}
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 text-white font-medium px-4 py-2 rounded-md shadow"
            style={{ background: "#172554", borderColor: isDark ? "rgba(255,255,255,0.04)" : undefined }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add New Staff
          </button>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ background: panelBg, border: subtlePanelBorder }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)" }}></div>

          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center" style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>Loading...</div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 text-sm px-3 py-2 rounded" style={{ background: isDark ? "#2b2d22" : "#FEF3C7", color: isDark ? "#fff7d6" : "#92400e" }}>
                    {error}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed border-collapse">
                    <thead>
                      <tr className={`${isDark ? "text-gray-300" : "text-gray-600"} text-left`}>
                        <th className="py-6 px-6 w-3/12">Staff Name</th>
                        <th className="py-6 px-6 w-2/12">Role</th>
                        <th className="py-6 px-6 w-2/12">Status</th>
                        <th className="py-6 px-6 w-3/12">Joined Date</th>
                        <th className="py-6 px-6 w-1/12 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {staffs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 px-6 text-center" style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>No staff available.</td>
                        </tr>
                      ) : (
                        staffs.map((s) => (
                          <tr key={s.id} style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(15,23,42,0.04)" }}>
                            <td className="py-8 px-6 align-middle" style={{ color: isDark ? "#E6EEF8" : "#111827" }}>{s.name}</td>
                            <td className="py-8 px-6 align-middle" style={{ color: isDark ? "#CBD5E1" : "#374151" }}>{s.role}</td>
                            <td className="py-8 px-6 align-middle">
                              <div className="flex items-center h-full">
                                <StatusBadge status={s.status} isDark={isDark} />
                              </div>
                            </td>
                            <td className="py-8 px-6 align-middle" style={{ color: isDark ? "#E6EEF8" : "#111827" }}>{formatJoinedDate(s.joinedDate)}</td>
                            <td className="py-8 px-6 align-middle text-right">
                              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-50" title={s.locked ? "Locked" : "Unlocked"} onClick={() => alert(`Action for ${s.name}`)}>
                                <LockIcon locked={s.locked} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Staff" isDark={isDark}>
          <form onSubmit={submitAdd} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-100" : "text-gray-700"}`}>Staff Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="block w-full rounded-md px-4 py-3"
                placeholder="Enter staff name"
                required
                style={{
                  background: isDark ? "#071429" : "#fff",
                  border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(15,23,42,0.04)",
                  color: isDark ? "#e6eef8" : "#111827",
                }}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map((role) => {
                  const selected = form.role === role;
                  return (
                    <button
                      type="button"
                      key={role}
                      onClick={() => setForm((f) => ({ ...f, role }))}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition text-left"
                      style={{
                        background: selected ? (isDark ? "rgba(23,37,84,0.12)" : "#f1f3fb") : (isDark ? "#071429" : "#fff"),
                        borderColor: selected ? "#172554" : (isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.04)"),
                        color: isDark ? "#e6eef8" : "#111827",
                      }}
                    >
                      <div>{role}</div>
                      <div className="w-5 h-5 rounded-full border" style={{ borderColor: selected ? "#172554" : (isDark ? "rgba(255,255,255,0.06)" : "#d1d5db"), background: selected ? (isDark ? "rgba(23,37,84,0.12)" : "#F8FAFF") : "transparent" }} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded p-4 flex items-center gap-3" style={{ background: isDark ? "#071a2a" : "#f1f7ff", border: isDark ? "1px solid rgba(255,255,255,0.02)" : "1px solid #e6f0ff" }}>
              <div className="text-[#172554] rounded-full w-8 h-8 flex items-center justify-center font-bold" style={{ background: isDark ? "rgba(23,37,84,0.12)" : "#e6f3ff" }}>i</div>
              <div className={isDark ? "text-gray-200" : "text-gray-700"} style={{ fontSize: 14 }}>
                You can view or modify the staff permission access
                <div>
                  <a href="#" onClick={(e) => e.preventDefault()} className="underline" style={{ color: "#172554" }}>Manage Permissions</a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-100" : "text-gray-700"}`}>Joined Date</label>
                <input
                  type="date"
                  value={form.joinedDate}
                  onChange={(e) => setForm((f) => ({ ...f, joinedDate: e.target.value }))}
                  className="block w-full rounded-md px-3 py-2"
                  style={{ background: isDark ? "#071429" : "#fff", border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(15,23,42,0.04)", color: isDark ? "#e6eef8" : "#111827" }}
                />
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 border rounded-md" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : undefined }}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white" style={{ background: "#172554" }}>Add Staff</button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
