// src/components/Notebook.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function Notebook() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null); // placeholder - not implemented heavy

  // Load notes from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("notes");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setNotes(Array.isArray(parsed) ? parsed.reverse() : []);
      } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
      }
    } else {
      setNotes([]);
    }

    // listen for storage events (other tabs)
    const onStorage = (ev) => {
      if (ev.key === "notes") {
        const updated = ev.newValue ? JSON.parse(ev.newValue) : [];
        setNotes(Array.isArray(updated) ? updated.reverse() : []);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Filtered notes based on search and (optional) date
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      if (q) {
        const inTitle = (n.title || "").toLowerCase().includes(q);
        const inContent = (n.content || "").toLowerCase().includes(q);
        if (!inTitle && !inContent) return false;
      }
      if (dateFilter) {
        // optional date filter: compare date strings or parse when you want precise filtering
        return (n.date || "").includes(dateFilter);
      }
      return true;
    });
  }, [notes, query, dateFilter]);

  // Helpers
  const preview = (text, len = 180) =>
    text ? (text.length > len ? text.slice(0, len) + "…" : text) : "";

  return (
    <div className="w-full max-w-screen-xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Notebook ({notes.length})
        </h1>

        <button
          onClick={() => navigate("/create-note")}
          className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        >
          + Create Note
        </button>
      </div>

      {/* Controls: search + date filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center bg-white border rounded-md px-3 py-2 w-[360px]">
          <svg
            className="w-4 h-4 text-gray-400 mr-2"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>

        <button
          onClick={() => {
            /* optional: open date picker - placeholder for UI */
            setDateFilter(null);
          }}
          className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-700"
        >
          <Calendar size={16} />
          All Date
        </button>
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            No notes yet. Click "Create Note" to add your first note.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/create-note?id=${note.id}`)}
              className="bg-white border rounded-lg p-5 min-h-[140px] cursor-pointer hover:shadow-md transition"
            >
              <div className="text-sm font-semibold text-gray-900 mb-3 break-words">
                {note.title || "Untitled"}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar size={14} />
                <span>{note.date}</span>
              </div>

              <div className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                {preview(note.content, 260)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
