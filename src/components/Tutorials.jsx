// src/components/Tutorials.jsx
import React, { useMemo, useState } from "react";

export default function Tutorials({
  videos = [],
  contact = {
    email: "contact@arthikmarg.com",
    phone1: "9827335786",
    phone2: "9820318652",
  },
  socials = [
    { name: "facebook", handle: "arthikmarg" },
    { name: "instagram", handle: "arthikmarg" },
    { name: "youtube", handle: "arthikmarg" },
    { name: "tiktok", handle: "@arthikmarg" },
    { name: "linkedin", handle: "arthikmarg" },
  ],
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return videos;
    return videos.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.description || "").toLowerCase().includes(q)
    );
  }, [videos, query]);

  return (
    <div className="px-10 py-8 max-w-[1200px] mx-auto">

      {/* Header Row */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Browse Tutorial Videos</h1>

          <button
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-white shadow border-2 border-white hover:brightness-95"
            style={{ boxShadow: "0 0 0 3px rgba(16,185,129,.12)" }}
          >
            All Videos
          </button>
        </div>

        {/* Search */}
        <div className="w-80">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos"
              className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none"
            />

            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="2" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="#6B7280" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-medium mb-6">All Videos</h2>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="min-h-[55vh] flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              <circle cx="55" cy="55" r="54" fill="#F3F4F6" />
              <path d="M48 46 L70 55 L48 64 Z" fill="#9CA3AF" opacity="0.8" />
              <circle cx="73" cy="73" r="10" fill="#FCE8E8" />
              <path d="M78 78 L86 86" stroke="#EF4444" strokeWidth="3" />
            </svg>
          </div>

          <h3 className="text-xl font-semibold">No Results Found</h3>
          <p className="text-gray-500">Try searching for other keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 mb-14">
          {filtered.map((v) => (
            <article
              key={v.id}
              className="border rounded-lg bg-white shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {v.thumbnail ? (
                  <img src={v.thumbnail} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-gray-400">No Thumbnail</span>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-semibold">{v.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{v.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ------------------------------- */}
      {/* SUPPORT SECTION (BOTTOM)        */}
      {/* ------------------------------- */}

      {/* Banner */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6 flex items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">Need Assistance for any issue</h2>
          <p className="text-gray-600 mb-4">
            You can create a support ticket for any issues or enquiry and we will get back to you soon
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/support")}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:brightness-95"
            >
              Contact Support
            </button>

            <button
              onClick={() => (window.location.href = "/support/messages")}
              className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
            >
              View All Support Messages →
            </button>
          </div>
        </div>

        <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="58" fill="#F8FAFC" />
            <rect x="33" y="28" width="54" height="64" rx="8" fill="white" />
            <circle cx="82" cy="46" r="10" fill="#FEE2E2" />
            <path d="M79 49 L86 55" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Contact + Socials */}
      <div className="grid grid-cols-2 gap-6 mb-12">

        {/* Contact Information */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

          <div className="space-y-4">

            {/* Email */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded">✉</span>
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                {contact.email}
              </a>
            </div>

            {/* Phone 1 */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded">📞</span>
              <a href={`tel:${contact.phone1}`} className="text-blue-600 hover:underline">
                {contact.phone1}
              </a>
            </div>

            {/* Phone 2 */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded">📞</span>
              <a href={`tel:${contact.phone2}`} className="text-blue-600 hover:underline">
                {contact.phone2}
              </a>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Follow us on</h3>

          <div className="grid grid-cols-2 gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={getSocialLink(s.name, s.handle)}
                target="_blank"
                rel="noopener noreferrer"
                className="border px-3 py-2 rounded-lg flex items-center gap-3 bg-white hover:bg-gray-50 cursor-pointer transition"
              >
                <span
                  className="w-7 h-7 rounded text-white flex items-center justify-center"
                  style={{ background: getSocialColor(s.name) }}
                >
                  {getSocialGlyph(s.name)}
                </span>
                <span>{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* -------- Helper Functions -------- */

function getSocialGlyph(name) {
  name = name.toLowerCase();
  if (name.includes("facebook")) return "f";
  if (name.includes("instagram")) return "ig";
  if (name.includes("youtube")) return "yt";
  if (name.includes("tiktok")) return "tt";
  if (name.includes("linkedin")) return "in";
  return "?";
}

function getSocialColor(name) {
  name = name.toLowerCase();
  if (name.includes("facebook")) return "#1877F2";
  if (name.includes("instagram"))
    return "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";
  if (name.includes("youtube")) return "#FF0000";
  if (name.includes("tiktok")) return "#000";
  if (name.includes("linkedin")) return "#0A66C2";
  return "#6B7280";
}

function getSocialLink(name, handle) {
  const clean = handle.replace("@", "").toLowerCase();

  if (name.includes("facebook")) return `https://facebook.com/${clean}`;
  if (name.includes("instagram")) return `https://instagram.com/${clean}`;
  if (name.includes("youtube")) return `https://youtube.com/${clean}`;
  if (name.includes("tiktok")) return `https://www.tiktok.com/@${clean}`;
  if (name.includes("linkedin")) return `https://www.linkedin.com/company/${clean}`;

  return "#";
}
