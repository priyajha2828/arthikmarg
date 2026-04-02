import { useState } from "react";

export default function AddReminder({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [type, setType] = useState("");

  const handleSave = () => {
    if (!title || !dateTime || !type) {
      alert("Please fill all fields");
      return;
    }
    const newReminder = { title, dateTime, type };
    onSave(newReminder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add New Reminder</h2>

        {/* Reminder Title */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Reminder Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter reminder title"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
        </div>

        {/* Date & Time */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
        </div>

        {/* Reminder Type */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Reminder Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">Select Type</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-emerald-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
