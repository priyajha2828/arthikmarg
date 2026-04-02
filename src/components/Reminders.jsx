// src/components/Reminders.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReminderModal from "./ReminderModal";

const STORAGE_KEY = "app_reminders_v1";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export default function Reminders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");
  const [openModal, setOpenModal] = useState(false);
  const [reminders, setReminders] = useState(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(reminders);
  }, [reminders]);

  // safe go back: only navigate(-1) when there is a meaningful index
  const safeGoBack = () => {
    try {
      const idx = window.history.state?.idx;
      if (typeof idx === "number" && idx > 0) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      navigate("/", { replace: true });
    }
  };

  function handleAdd(reminder) {
    setReminders((s) => [reminder, ...s]);
    setOpenModal(false);
    setTab("upcoming");
  }

  function toggleCompleted(id) {
    setReminders((list) => list.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  }

  function handleDelete(id) {
    if (!confirm("Delete this reminder?")) return;
    setReminders((list) => list.filter((r) => r.id !== id));
  }

  const upcoming = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={safeGoBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold">Reminders</h1>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
          aria-label="Add New Reminder"
        >
          <Plus size={16} /> Add New Reminder
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex items-center space-x-8">
          <button
            className={`pb-3 text-sm font-medium ${tab === "upcoming" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-600"}`}
            onClick={() => setTab("upcoming")}
          >
            Upcoming ({upcoming.length})
          </button>

          <button
            className={`pb-3 text-sm font-medium ${tab === "completed" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-600"}`}
            onClick={() => setTab("completed")}
          >
            Completed ({completed.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[320px]">
        {tab === "upcoming" ? (
          upcoming.length === 0 ? (
            <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
              <div className="w-[380px] max-w-full mb-6">
                {/* inline svg */}
                <svg viewBox="0 0 640 480" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <g fill="none" fillRule="evenodd">
                    <rect width="640" height="480" fill="#FFF" rx="6"/>
                    <g transform="translate(120 60)">
                      <rect x="0" y="24" width="280" height="210" rx="18" fill="#F3F5F7"/>
                      <rect x="0" y="0" width="280" height="70" rx="18" fill="#E9EEF3"/>
                      <g transform="translate(20 40)" fill="#C7CFD8" opacity="0.95">
                        <circle cx="34" cy="48" r="14"/>
                        <circle cx="94" cy="48" r="14"/>
                        <circle cx="154" cy="48" r="14"/>
                        <circle cx="34" cy="108" r="14"/>
                        <circle cx="94" cy="108" r="14"/>
                        <circle cx="154" cy="108" r="14"/>
                        <circle cx="34" cy="168" r="14"/>
                        <circle cx="94" cy="168" r="14"/>
                        <circle cx="154" cy="168" r="14"/>
                      </g>
                      <rect x="300" y="120" width="120" height="120" rx="60" fill="#DCE6ED"/>
                    </g>
                  </g>
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">No any upcoming reminders</h3>
              <p className="text-sm text-gray-500 max-w-lg">
                You don't have any reminders scheduled. Click <strong>Add New Reminder</strong> to create your first one.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {r.date ? new Date(`${r.date}T${r.time || "00:00"}`).toLocaleString() : "No date set"} · {r.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCompleted(r.id)} className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Mark done</button>
                    <button onClick={() => handleDelete(r.id)} className="px-3 py-1 border rounded text-sm text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          completed.length === 0 ? (
            <div className="min-h-[280px] flex items-center justify-center text-gray-500">No completed reminders yet.</div>
          ) : (
            <div className="space-y-3">
              {completed.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                  <div>
                    <div className="font-medium line-through">{r.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {r.date ? new Date(`${r.date}T${r.time || "00:00"}`).toLocaleString() : "No date set"} · {r.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCompleted(r.id)} className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Mark undone</button>
                    <button onClick={() => handleDelete(r.id)} className="px-3 py-1 border rounded text-sm text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* modal */}
      <ReminderModal open={openModal} onClose={() => setOpenModal(false)} onSave={(r) => handleAdd(r)} />
    </div>
  );
}
