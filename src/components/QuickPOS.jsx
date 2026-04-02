// src/components/QuickPOS.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if needed

export default function QuickPOS() {
  const navigate = useNavigate();

  // Safe useContext: only call useContext when ThemeContext exists
  const themeContext = typeof ThemeContext !== "undefined" && ThemeContext ? useContext(ThemeContext) : { theme: "light" };
  const { theme } = themeContext || { theme: "light" };

  // Component state
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState({
    name: "",
    category: "General",
    type: "Product",
    salesPrice: "",
    purchasePrice: "",
    openingStock: "",
    primaryUnit: "",
    itemCode: "",
    hsCode: "",
    description: "",
  });

  // Primary color (requested)
  const PRIMARY = "#174552";
  const PRIMARY_HOVER = "#133f44"; // slightly darker for hover

  // Expose primary color + surface color to CSS variables and set background based on theme
  useEffect(() => {
    try {
      // primary color variables
      document.documentElement.style.setProperty("--app-primary", PRIMARY);
      document.documentElement.style.setProperty("--app-primary-hover", PRIMARY_HOVER);

      // surface background depending on theme
      const surfaceLight = "#f3f4f6"; // grey for light theme
      const surfaceDark = "#0b1220"; // deep dark for dark theme
      const surfaceClassic = "#F6E9D2"; // cream for classic theme

      const surface =
        theme === "dark" ? surfaceDark : theme === "classic" ? surfaceClassic : surfaceLight;

      document.documentElement.style.setProperty("--surface-200", surface);

      // also set a text color var (optional)
      const textDefault = theme === "dark" ? "#ffffff" : "#0f172a"; // ensure white in dark mode
      document.documentElement.style.setProperty("--text-default", textDefault);
    } catch (e) {
      // ignore in restricted envs (SSR)
    }
  }, [theme]);

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setItems([...items, { ...itemData }]);
    setItemData({
      name: "",
      category: "General",
      type: "Product",
      salesPrice: "",
      purchasePrice: "",
      openingStock: "",
      primaryUnit: "",
      itemCode: "",
      hsCode: "",
      description: "",
    });
    setShowForm(false);
  };

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => (item.category || "").toLowerCase() === activeCategory.toLowerCase());

  // button style helpers
  const primaryBtnStyle = {
    background: PRIMARY,
    color: "#ffffff",
  };
  const primaryBtnHoverBg = PRIMARY_HOVER;

  // Container style: use CSS variable set above (falls back to a light grey)
  // Also apply textColor so dark theme text becomes white everywhere
  const textColor = theme === "dark" ? "#ffffff" : undefined;
  const containerStyle = {
    background: "var(--surface-200, #f3f4f6)",
    minHeight: "100vh",
    paddingTop: 24,
    paddingBottom: 24,
    color: textColor, // apply global text color
  };

  // input base style to ensure text color is white in dark mode
  const inputBaseStyle = {
    color: textColor,
    background: theme === "dark" ? "#0b1220" : undefined,
  };

  return (
    <div style={containerStyle} className="w-full max-w-6xl mx-auto p-8">
      {/* ===== HEADER: small arrow on left + large title ===== */}
      <div className="flex items-center gap-4 mb-6">
        {/* simple icon button (no colored pill) */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
        </button>

        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: textColor || undefined }}>
          Quick POS
        </h2>
      </div>
      {/* ===================================================== */}

      {!showForm && (
        <>
          {/* Search + Add New */}
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Items..."
              className="flex-1 px-5 py-4 rounded-lg border"
              style={{
                ...inputBaseStyle,
                borderColor: theme === "dark" ? "#374151" : undefined,
              }}
            />
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 rounded"
              style={primaryBtnStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = primaryBtnHoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
            >
              Add New Item
            </button>
          </div>

          {/* Category Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-8 py-3 rounded ${
                activeCategory === "all"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
              }`}
              style={{ color: textColor || undefined }}
            >
              All Categories
            </button>

            <button
              onClick={() => setActiveCategory("general")}
              className={`px-8 py-3 rounded ${
                activeCategory === "general"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
              }`}
              style={{ color: textColor || undefined }}
            >
              General
            </button>
          </div>

          {/* Item List */}
          <div className="space-y-3 max-h-[450px] overflow-y-auto border-t pt-4">
            {filteredItems.length === 0 ? (
              <p style={{ color: textColor || undefined }} className="text-gray-500 dark:text-gray-300">
                No items found.
              </p>
            ) : (
              filteredItems
                .filter((item) =>
                  (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded border dark:border-gray-700 flex justify-between"
                    style={{ color: textColor || undefined }}
                  >
                    <span className="font-semibold text-lg">{item.name}</span>
                    <span className="text-gray-500 dark:text-gray-300">{item.category}</span>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {/* Add New Item Form */}
      {showForm && (
        <div className="mt-6 space-y-6 text-lg" style={{ color: textColor || undefined }}>
          {/* Header */}
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(false)}
                aria-label="Back to list"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft size={18} className="text-gray-700 dark:text-gray-200" />
              </button>

              <h3 className="text-3xl font-bold" style={{ color: textColor || undefined }}>Add New Item</h3>
            </div>

            {/* This remains your original "Back" button on the right too, kept for parity */}
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
              style={{ color: theme === "dark" ? "#fff" : undefined }}
            >
              Back
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Item Name</label>
              <input
                type="text"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>

            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Item Category</label>
              <input
                type="text"
                name="category"
                value={itemData.category}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Item Type</label>
              <select
                name="type"
                value={itemData.type}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  color: textColor || undefined,
                  background: theme === "dark" ? "#0b1220" : undefined,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              >
                <option>Product</option>
                <option>Service</option>
              </select>
            </div>

            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Sales Price</label>
              <input
                type="number"
                name="salesPrice"
                value={itemData.salesPrice}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Purchase Price</label>
              <input
                type="number"
                name="purchasePrice"
                value={itemData.purchasePrice}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>

            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Opening Stock</label>
              <input
                type="number"
                name="openingStock"
                value={itemData.openingStock}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>
          </div>

          {/* Primary + Secondary Button */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Primary Unit</label>
              <input
                type="text"
                name="primaryUnit"
                value={itemData.primaryUnit}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>

            <div className="flex items-end">
              <button
                className="px-6 py-4 rounded"
                style={{ background: PRIMARY, color: "#fff" }}
                onClick={() => alert("Add Secondary Unit Logic")}
                onMouseEnter={(e) => (e.currentTarget.style.background = PRIMARY_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
              >
                Add Secondary Unit
              </button>
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Item Code</label>
              <input
                type="text"
                name="itemCode"
                value={itemData.itemCode}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>

            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>HS Code</label>
              <input
                type="text"
                name="hsCode"
                value={itemData.hsCode}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>

            <div>
              <label className="font-semibold" style={{ color: textColor || undefined }}>Description</label>
              <textarea
                name="description"
                value={itemData.description}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded border"
                style={{
                  ...inputBaseStyle,
                  borderColor: theme === "dark" ? "#374151" : undefined,
                }}
              />
            </div>
          </div>

          {/* Save + Cancel */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-8 py-4 bg-gray-300 dark:bg-gray-600 rounded"
              style={{ color: theme === "dark" ? "#fff" : undefined }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-4 text-white rounded"
              style={primaryBtnStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = PRIMARY_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
