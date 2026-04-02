// src/components/BillGallery.jsx
import React, { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

/**
 * BillGallery
 * - Top filter row (transaction type, party search, date)
 * - Empty state centered with illustration + text (matches screenshot)
 *
 * Props:
 * - bills (optional) : array of bills - if provided, gallery will show them instead of empty state
 */
export default function BillGallery({ bills = [] }) {
  const [transactionType, setTransactionType] = useState("all");
  const [partySearch, setPartySearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const filtered = (bills || []).filter((b) => {
    if (transactionType !== "all" && b.type !== transactionType) return false;
    if (partySearch && !b.party?.toLowerCase().includes(partySearch.toLowerCase())) return false;
    // dateFilter logic omitted for brevity — treat as all
    return true;
  });

  const isEmpty = filtered.length === 0;

  return (
    <div className="w-full max-w-screen-xl mx-auto p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bill Gallery</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        {/* Transaction type */}
        <div className="relative">
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 border rounded-lg bg-white text-gray-800"
          >
            <option value="all">All Transactions</option>
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
            <option value="payment">Payment</option>
          </select>
          <span className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
            <ChevronDown size={16} />
          </span>
        </div>

        {/* Party search (fake dropdown style like screenshot) */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            value={partySearch}
            onChange={(e) => setPartySearch(e.target.value)}
            placeholder="Search for party"
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-700"
          />
          <span className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
            <ChevronDown size={16} />
          </span>
        </div>

        {/* Date picker stub */}
        <div>
          <button
            type="button"
            onClick={() => {
              // placeholder: you can open a real date picker here
              const next = dateFilter === "all" ? "custom" : "all";
              setDateFilter(next);
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-700"
          >
            <CalendarDays size={16} />
            <span className="whitespace-nowrap">
              {dateFilter === "all" ? "All Date" : "Custom Date"}
            </span>
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[420px] flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center mx-auto max-w-2xl">
            {/* Illustration (SVG) */}
            <div className="mx-auto mb-6 w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                <circle cx="44" cy="44" r="44" fill="#eef0f3"/>
                <g transform="translate(18,18)">
                  <rect x="8" y="4" width="44" height="60" rx="6" fill="#fff"/>
                  <circle cx="30" cy="18" r="10" fill="#b6bfc9"/>
                  <rect x="14" y="44" width="28" height="6" rx="3" fill="#e9edf1"/>
                  <rect x="10" y="52" width="32" height="6" rx="3" fill="#e9edf1"/>
                  <circle cx="30" cy="18" r="10" stroke="#c9d1db" strokeWidth="2" fill="none"/>
                  <path d="M17 13 L25 21 M25 13 L17 21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2 text-gray-900">No Bills Yet</h2>
            <p className="text-gray-500">
              Start organizing your transactions by uploading bills and invoices. You can add a bill while creating transaction
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* When bills exist show a simple list grid — you can replace this with your real gallery */}
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((b, i) => (
                <div key={i} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">{b.type}</div>
                    <div className="text-sm text-gray-500">{b.date}</div>
                  </div>
                  <div className="font-medium">{b.party}</div>
                  <div className="text-sm text-gray-500 mt-1">Invoice: {b.invoice || "-"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
