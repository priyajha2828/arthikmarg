// src/components/ImportPartiesPage.jsx
import React, { useState, useContext } from "react";
import { FileText, Download, CloudUpload } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if your ThemeContext lives elsewhere

// --- Import Parties Page Component ---
export function ImportPartiesPage({ sidebarOpen }) {
  const { theme } = useContext(ThemeContext); // read current theme from context

  const expandedWidth = "24rem";
  const COLLAPSED_MARGIN = "4rem";
  const sidebarOffset = sidebarOpen ? expandedWidth : COLLAPSED_MARGIN;

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDownload = () => {
    console.log("Download initiated for sample_parties.xlsx");
    // add download logic here if needed
  };

  // DRAG & DROP HANDLERS
  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.length > 0) setUploadedFile(files[0]);
  };
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files?.length > 0) setUploadedFile(files[0]);
  };

  // Theme-driven styles (use the CSS variables set by your ThemeProvider)
  const pageStyle = {
    left: sidebarOffset,
    width: `calc(100% - ${sidebarOffset})`,
    background: "var(--bg-default, #ffffff)",
    color: "var(--text-default, #0f172a)",
  };

  const leftColumnStyle = {
    color: "var(--text-default, #0f172a)",
    background: "transparent",
  };

  // header uses primary color for strong contrast
  const sampleTableHeaderStyle = {
    background: "var(--primary-500, #172554)",
    color: "var(--text-on-primary, #ffffff)",
  };

  // download button uses primary
  const downloadBtnStyle = {
    background: "var(--primary-500, #172554)",
    color: "var(--text-on-primary, #ffffff)",
  };

  // right column background (panel) uses surface variable; fallback to light gray
  const rightColumnStyle = {
    background: "var(--surface-200, #f3f4f6)",
  };

  const dropZoneActiveStyle = {
    borderColor: "var(--primary-500, #172554)",
    background: "rgba(0,0,0,0.03)",
  };

  // table panel background (light grey) using theme variable --surface-100 (fallback #f7f7f9)
  const tablePanelStyle = {
    background: "var(--surface-100, #f7f7f9)",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.06)",
    overflowX: "auto",
  };

  // table body style (rows) - keep white rows for readability but keep panel light grey behind
  const tbodyRowStyle = {
    color: "var(--text-default, #0f172a)",
    background: "var(--bg-default, #ffffff)",
  };

  return (
    <div
      className="fixed top-16 right-0 bottom-0 flex"
      style={pageStyle}
      aria-live="polite"
    >
      {/* ---------------- LEFT COLUMN ---------------- */}
      <div className="w-1/2 p-10 overflow-y-auto" style={leftColumnStyle}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-default, #0f172a)" }}>
          Import Parties in 3 Steps
        </h2>

        {/* Step 1 */}
        <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text-default, #0f172a)" }}>
          1. Download the file & Fill Data
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
          Download our sample excel file and enter your data according to the file format.
        </p>

        {/* Sample Table (panel background = light grey in theme) */}
        <div className="mb-6 shadow-sm" style={tablePanelStyle}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead style={sampleTableHeaderStyle}>
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Party Name</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Phone Number</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Customer / Supplier</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Opening Balance</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Receivables / Payables</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Address</th>
              </tr>
            </thead>

            {/* tbody keeps rows on a white background for readability */}
            <tbody className="divide-y divide-gray-200" style={tbodyRowStyle}>
              <tr>
                <td className="px-3 py-2">Rani Retail</td>
                <td className="px-3 py-2">9111111111</td>
                <td className="px-3 py-2">Customer</td>
                <td className="px-3 py-2">1000</td>
                <td className="px-3 py-2">Receivables</td>
                <td className="px-3 py-2"></td>
              </tr>

              <tr>
                <td className="px-3 py-2">Mohan Dakhal</td>
                <td className="px-3 py-2">0000000000</td>
                <td className="px-3 py-2">Customer</td>
                <td className="px-3 py-2">1000</td>
                <td className="px-3 py-2">Receivables</td>
                <td className="px-3 py-2"></td>
              </tr>

              <tr>
                <td className="px-3 py-2">Krishna Lalit</td>
                <td className="px-3 py-2">0000000000</td>
                <td className="px-3 py-2">Supplier</td>
                <td className="px-3 py-2">8000</td>
                <td className="px-3 py-2">Payable</td>
                <td className="px-3 py-2">Sanepa</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold mb-12 transition-colors"
          style={downloadBtnStyle}
          aria-label="Download sample parties file"
        >
          <Download size={18} />
          Download Sample File
        </button>

        {/* Step 2 */}
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-default, #0f172a)" }}>
          2. Review & Adjust Data
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
          Review the data inside the app. Fix errors before importing.
        </p>

        {/* Step 3 */}
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-default, #0f172a)" }}>
          3. Confirm & Import
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
          After everything is ready, start the import process.
        </p>
      </div>

      {/* ---------------- RIGHT COLUMN (Drag & Drop) ---------------- */}
      <div
        className="w-1/2 p-10 flex items-center justify-center border-l"
        style={{ ...rightColumnStyle, borderColor: "rgba(0,0,0,0.06)" }}
      >
        <label
          htmlFor="file-upload-parties"
          className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-colors`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={isDragging ? dropZoneActiveStyle : { borderColor: "rgba(0,0,0,0.08)" }}
        >
          {/* hidden input */}
          <input
            type="file"
            id="file-upload-parties"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />

          {uploadedFile ? (
            <div className="text-center p-4" style={{ color: "var(--text-default, #0f172a)" }}>
              <FileText size={48} className="mx-auto mb-4" style={{ color: "var(--success, #16a34a)" }} />
              <p className="text-lg font-semibold mb-1">File Ready:</p>
              <p className="font-medium" style={{ color: "var(--success, #16a34a)" }}>{uploadedFile.name}</p>
              <p className="text-sm mt-3" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>Click here to change the file.</p>
            </div>
          ) : (
            <>
              <CloudUpload
                size={48}
                className="mb-4"
                style={{ color: isDragging ? "var(--primary-500, #172554)" : "var(--muted, rgba(0,0,0,0.4))" }}
              />
              <p className="text-lg font-semibold">Click to Upload or Drag & Drop</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
                Only Excel files up to 500 entries & 1MB supported.
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

export default ImportPartiesPage;
