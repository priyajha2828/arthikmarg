// src/components/ImportItemsPage.jsx
import React, { useState, useContext } from "react";
import { FileText, Download, CloudUpload } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if your ThemeContext lives elsewhere

export function ImportItemsPage({ sidebarOpen }) {
  const { theme } = useContext(ThemeContext); // read current theme, in case you want theme-specific logic
  const expandedWidth = "24rem";
  const COLLAPSED_MARGIN = "4rem";
  const sidebarOffset = sidebarOpen ? expandedWidth : COLLAPSED_MARGIN;

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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
    if (e.dataTransfer.files?.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files?.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // theme-driven styles using CSS variables set by your ThemeProvider
  const pageStyle = {
    left: sidebarOffset,
    width: `calc(100% - ${sidebarOffset})`,
    background: "var(--bg-default, #ffffff)",
    color: "var(--text-default, #0f172a)",
  };

  // panel behind the table (light grey) using --surface-100 (fallback to light grey)
  const tablePanelStyle = {
    background: "var(--surface-100, #f3f4f6)", // light grey panel
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.06)",
    overflowX: "auto",
  };

  const headerStyle = {
    background: "var(--primary-500, #172554)",
    color: "var(--text-on-primary, #ffffff)",
  };

  const downloadBtnStyle = {
    background: "var(--primary-500, #172554)",
    color: "var(--text-on-primary, #ffffff)",
  };

  const rightColumnStyle = {
    background: "var(--surface-200, #fafafa)",
  };

  const dropZoneActiveStyle = {
    borderColor: "var(--primary-500, #172554)",
    background: "rgba(0,0,0,0.03)",
  };

  return (
    <div
      className="fixed top-16 right-0 bottom-0 flex"
      style={pageStyle}
      aria-live="polite"
    >
      {/* LEFT SECTION */}
      <div className="w-1/2 p-10 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-default, #0f172a)" }}>
          Import Items in 3 Steps
        </h2>

        {/* Step 1 */}
        <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text-default, #0f172a)" }}>
          1. Download the file & Fill Data
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
          Download our sample excel file and enter your data according to the file format.
        </p>

        {/* Sample Table (panel with light grey background) */}
        <div className="mb-6 shadow-sm" style={tablePanelStyle}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead style={headerStyle}>
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Item Name</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Category</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Sale Price</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Purchase Price</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Opening Stock</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Low Stock</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider">Item Code</th>
              </tr>
            </thead>

            {/* keep tbody rows white for readability, but inside the panel */}
            <tbody className="divide-y divide-gray-200" style={{ background: "var(--bg-default, #ffffff)", color: "var(--text-default, #0f172a)" }}>
              <tr>
                <td className="px-3 py-2">Clear Gold Soap</td>
                <td className="px-3 py-2">General</td>
                <td className="px-3 py-2">100</td>
                <td className="px-3 py-2">80</td>
                <td className="px-3 py-2">500</td>
                <td className="px-3 py-2">10</td>
                <td className="px-3 py-2">CG123</td>
              </tr>

              <tr>
                <td className="px-3 py-2">Premium Watch (L)</td>
                <td className="px-3 py-2">Electronics</td>
                <td className="px-3 py-2">12000</td>
                <td className="px-3 py-2">9000</td>
                <td className="px-3 py-2">15</td>
                <td className="px-3 py-2">2</td>
                <td className="px-3 py-2"></td>
              </tr>

              <tr>
                <td className="px-3 py-2">Mixed Fruit Snack</td>
                <td className="px-3 py-2">General</td>
                <td className="px-3 py-2">70</td>
                <td className="px-3 py-2">50</td>
                <td className="px-3 py-2">80</td>
                <td className="px-3 py-2">10</td>
                <td className="px-3 py-2">MFB123</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Download Button */}
        <a
          href="/files/sample_items.xlsx"
          download="sample_items_import.xlsx"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold mb-12 transition-colors"
          style={downloadBtnStyle}
          aria-label="Download sample items file"
        >
          <Download size={18} />
          Download Sample File
        </a>

        {/* Steps 2 & 3 */}
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-default, #0f172a)" }}>2. Review & Adjust Data</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
          Review your data inside the app. Fix errors before importing.
        </p>

        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-default, #0f172a)" }}>3. Confirm & Import</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
          Once everything looks correct, begin the import.
        </p>
      </div>

      {/* RIGHT SECTION - DRAG & DROP */}
      <div
        className="w-1/2 p-10 flex items-center justify-center border-l"
        style={{ ...rightColumnStyle, borderColor: "rgba(0,0,0,0.06)" }}
      >
        <label
          htmlFor="file-upload-items"
          className="w-full h-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={isDragging ? dropZoneActiveStyle : { borderColor: "rgba(0,0,0,0.08)" }}
        >
          <input
            type="file"
            id="file-upload-items"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />

          {uploadedFile ? (
            <div className="text-center p-4" style={{ color: "var(--text-default, #0f172a)" }}>
              <FileText size={48} className="mx-auto mb-4" style={{ color: "var(--success, #16a34a)" }} />
              <p className="text-lg font-semibold mb-1">File Ready:</p>
              <p className="font-medium" style={{ color: "var(--success, #16a34a)" }}>{uploadedFile.name}</p>
              <p className="text-sm mt-2" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>Click to change file</p>
            </div>
          ) : (
            <>
              <CloudUpload size={48} className="mb-4" style={{ color: isDragging ? "var(--primary-500, #172554)" : "var(--muted, rgba(0,0,0,0.4))" }} />
              <p className="text-lg font-semibold">Click to Upload or Drag & Drop</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted, rgba(0,0,0,0.6))" }}>
                Excel files up to 500 entries & 1MB supported.
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

export default ImportItemsPage;
