// src/components/HelpSupport.jsx

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import callbackImg from "../assets/callback.jpg";

// ✅ lucide (UI icons only)
import {
  Info,
  Users,
  Boxes,
  BarChart2,
  Crown,
  UserPlus,
  Landmark,
  FileText,
  Search as SearchIcon,
  Mail,
  Phone,
  MessageSquare,
  PhoneCall,
  X as XIcon,
} from "lucide-react";

// ✅ react-icons (SOCIAL icons)
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

export default function HelpSupport() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");

  const isCallbackRoute = location.pathname === "/support/callback";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center">
        Get Help and Support
      </h1>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto mt-6 relative">
        <SearchIcon className="absolute left-3 top-3 text-gray-400" />
        <input
          className="w-full border rounded-full pl-10 pr-4 py-2"
          placeholder="Search help..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* SUPPORT CARDS */}
      <div className="grid md:grid-cols-2 gap-4 mt-10">
        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-lg">Want to contact us</h3>
          <p className="text-gray-500 mt-2">
            Create a support ticket for any issue.
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate("/support")}
              className="bg-blue-900 text-white px-4 py-2 rounded"
            >
              <MessageSquare size={16} /> Contact Support
            </button>

            <Link
              to="/support/messages"
              className="border px-4 py-2 rounded"
            >
              View Messages →
            </Link>
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-lg">Want to give feedback</h3>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate("/feedback")}
              className="bg-blue-900 text-white px-4 py-2 rounded"
            >
              <Mail size={16} /> Feedback
            </button>

            <button
              onClick={() => navigate("/support/callback")}
              className="border px-4 py-2 rounded"
            >
              <PhoneCall size={16} /> Callback
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="border p-5 rounded-xl">
          <h4 className="font-bold text-lg">Contact Info</h4>

          <div className="flex items-center gap-2 mt-3">
            <Mail size={16} /> contact@arthikmarg.com
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Phone size={16} /> 9827335786
          </div>
        </div>

        {/* ✅ SOCIAL FIXED */}
        <div className="border p-5 rounded-xl">
          <h4 className="font-bold text-lg">Follow us</h4>

          <div className="flex gap-3 mt-4 flex-wrap">
            <a href="#" className="border px-3 py-2 rounded flex items-center gap-2">
              <FaFacebook /> Facebook
            </a>

            <a href="#" className="border px-3 py-2 rounded flex items-center gap-2">
              <FaInstagram /> Instagram
            </a>

            <a href="#" className="border px-3 py-2 rounded flex items-center gap-2">
              <FaYoutube /> YouTube
            </a>

            <a href="#" className="border px-3 py-2 rounded flex items-center gap-2">
              <FaLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}