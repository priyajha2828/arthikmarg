// src/components/ReminderModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock } from "lucide-react";

export default function ReminderModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Task Reminder");

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDate("");
      setTime("");
      setType("Task Reminder");
    }
  }, [open]);

  if (!open) return null;

  function handleSave() {
    if (!title.trim()) {
      alert("Please enter a title for the reminder.");
      return;
    }
    const reminder = {
      id: `r_${Date.now()}`,
      title: title.trim(),
      date: date || null,
      time: time || null,
      type,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onSave(reminder);
  }

  function openDatePicker() {
    const el = dateRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try { el.showPicker(); return; } catch {}
    }
    el.focus();
  }

  function openTimePicker() {
    const el = timeRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try { el.showPicker(); return; } catch {}
    }
    el.focus();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <style>{`
        .no-native-picker::-webkit-calendar-picker-indicator { display: none; }
        .no-native-picker::-webkit-clear-button { display: none; }
        .no-native-picker { -webkit-appearance: none; -moz-appearance: textfield; appearance: none; }
      `}</style>

      <div className="bg-white rounded-xl w-[720px] max-w-[95%] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add New Reminder</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {/* Title */}
        <label className="text-sm font-medium text-gray-700">Reminder Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="eg. Collect payment from Ram"
          className="w-full mt-1 mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />

        {/* Date & Time */}
        <label className="text-sm font-medium text-gray-700">Select Date & Time</label>
        <div className="grid grid-cols-2 gap-4 mt-1 mb-4">
          <div className="relative">
            <input
              ref={dateRef}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="no-native-picker w-full px-4 py-3 border rounded-lg pr-12"
              aria-label="Select date"
            />
            <button
              type="button"
              onClick={openDatePicker}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              aria-label="Open date picker"
            >
              <Calendar size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="relative">
            <input
              ref={timeRef}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="time"
              className="no-native-picker w-full px-4 py-3 border rounded-lg pr-12"
              aria-label="Select time"
            />
            <button
              type="button"
              onClick={openTimePicker}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              aria-label="Open time picker"
            >
              <Clock size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Reminder Type */}
        <label className="text-sm font-medium text-gray-700">Reminder Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mt-1 mb-4 px-4 py-3 border rounded-lg"
        >
          <option>Task Reminder</option>
          <option>Payment Reminder</option>
          <option>Follow-up Reminder</option>
          <option>Other</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 border rounded-lg hover:bg-gray-100">
            Cancel
          </button>

          <button onClick={handleSave} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
