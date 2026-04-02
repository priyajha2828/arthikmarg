import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

export default function CreateNote() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Format date like: 2025 Jan 21 · 7:18 PM
  const formattedDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });

  // SAVE FUNCTION
  const saveNote = () => {
    if (!title.trim() && !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title,
      content,
      date: formattedDate,
    };

    // get existing notes
    const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];

    // add new note
    existingNotes.push(newNote);

    // save back
    localStorage.setItem("notes", JSON.stringify(existingNotes));

    // go back to notebook
    navigate("/notebook");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8">

      {/* Top Row */}
      <div className="flex justify-between items-center mb-4">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Save Button */}
        <button
          onClick={saveNote}
          className="bg-[#f1eef6] text-[#7b6ab0] px-5 py-2 rounded-lg shadow-sm hover:bg-[#e8e3f4]"
        >
          ✓ Save Note
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Enter title of note..."
        className="w-full text-3xl font-semibold text-gray-700 outline-none mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Date Row */}
      <div className="flex items-center gap-2 text-gray-500 mb-6">
        <Calendar size={18} />
        <span>{formattedDate}</span>
      </div>

      {/* Content */}
      <textarea
        placeholder="Start Typing"
        className="w-full text-lg text-gray-600 outline-none resize-none h-[400px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}
