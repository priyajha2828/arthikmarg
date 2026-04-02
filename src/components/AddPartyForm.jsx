// src/components/AddPartyForm.jsx
import React, { useState } from "react";
import { User, Upload, X } from "lucide-react";

// Custom Colors
const CUSTOM_BLUE = "bg-[#172554]";
const CUSTOM_BLUE_TEXT = "text-[#172554]";
const CUSTOM_BLUE_HOVER_BG = "hover:bg-[#111A31]";
const GRAY_HOVER_BG = "hover:bg-gray-100";

export default function AddPartyForm({ onClose } = {}) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    openingBalance: "0",
    asOfDate: today,
  });

  const [partyType, setPartyType] = useState("Customer");
  const [activeTab, setActiveTab] = useState("Credit Info");
  const [transactionType, setTransactionType] = useState("To Receive");
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // replace with your API or state logic
    console.log("Saving Party:", { formData, partyType, transactionType, photo: !!photoPreview });
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const InputField = ({ label, name, placeholder, type = "text", required = false }) => (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172554] text-sm"
      />
    </div>
  );

  const TabButton = ({ name }) => (
    <button
      type="button"
      onClick={() => setActiveTab(name)}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        activeTab === name ? `${CUSTOM_BLUE_TEXT} border-b-2 border-[#172554]` : `text-gray-500 ${GRAY_HOVER_BG}`
      }`}
    >
      {name}
    </button>
  );

  const TransactionButton = ({ type, label }) => (
    <button
      type="button"
      onClick={() => setTransactionType(type)}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 border ${
        transactionType === type ? `${CUSTOM_BLUE} text-white border-transparent shadow-md` : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Add New Party</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden border border-gray-400">
                {photoPreview ? <img src={photoPreview} alt="Party" className="w-full h-full object-cover" /> : <User size={48} className="text-gray-500" />}
              </div>

              <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <label htmlFor="photo-upload" className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1 cursor-pointer">
                <Upload size={14} /> Upload Photo
              </label>
            </div>

            <div className="flex flex-col space-y-4 w-full">
              <InputField label="Full Name" name="fullName" placeholder="Enter the name of party" required />
              <InputField label="Phone Number" name="phoneNumber" placeholder="Enter party phone no" type="tel" />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Party Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPartyType("Customer");
                  setTransactionType("To Receive");
                }}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors duration-200 border ${partyType === "Customer" ? `${CUSTOM_BLUE} text-white` : "bg-gray-100 text-gray-700 border-gray-300"}`}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() => {
                  setPartyType("Supplier");
                  setTransactionType("To Give");
                }}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors duration-200 border ${partyType === "Supplier" ? `${CUSTOM_BLUE} text-white` : "bg-gray-100 text-gray-700 border-gray-300"}`}
              >
                Supplier
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <TabButton name="Credit Info" />
            <TabButton name="Additional Info" />
          </div>

          {activeTab === "Credit Info" && (
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                  <input
                    type="number"
                    name="openingBalance"
                    value={formData.openingBalance}
                    onChange={handleChange}
                    placeholder="Rs. eg. 0"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172554] text-sm"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">As of Date</label>
                  <input
                    type="date"
                    name="asOfDate"
                    value={formData.asOfDate}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#172554]"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <TransactionButton type="To Receive" label="To Receive" />
                <TransactionButton type="To Give" label="To Give" />
              </div>
            </div>
          )}

          {activeTab === "Additional Info" && <div className="text-gray-500 p-4">Additional fields go here (GSTIN, Address, Email, etc.)</div>}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3 ${CUSTOM_BLUE} text-white rounded-lg font-semibold ${CUSTOM_BLUE_HOVER_BG} transition-colors duration-200 shadow-md`}>
            Save Party
          </button>
        </div>
      </div>
    </div>
  );
}
