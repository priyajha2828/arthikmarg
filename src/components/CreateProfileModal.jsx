import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateProfileModal({ open, onClose, initial = "business" }) {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(initial);

  useEffect(() => {
    if (open) setSelected(initial);
  }, [open, initial]);

  if (!open) return null;

  const onContinue = () => {
    onClose?.();
    // navigate to profile creation page and pass the chosen profile type
    navigate("/profiles/create", { state: { profileType: selected } });
  };

  return (
    // backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <div className="relative bg-white rounded-lg w-[720px] max-w-[95%] shadow-lg">
        {/* header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Create New Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Select profile which you want to create</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* body: two options */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <OptionCard
              title="Business Management"
              description="Manage your business accounting and inventory easily"
              value="business"
              selected={selected}
              onSelect={() => setSelected("business")}
              highlighted
            />

            <OptionCard
              title="Personal Finance"
              description="Track your expenses and maintain your credits with friends"
              value="personal"
              selected={selected}
              onSelect={() => setSelected("personal")}
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-lg border-2 border-emerald-400 bg-emerald-500 text-white font-medium hover:brightness-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionCard({ title, description, value, selected, onSelect }) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition ${
        isSelected
          ? "bg-emerald-50 border-emerald-300 shadow-sm"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold ${isSelected ? "bg-emerald-500" : "bg-green-400"}`}>
        {/* simple icon placeholder */}
        {value === "business" ? "🏬" : "👤"}
      </div>

      <div className="text-left flex-1">
        <div className="flex items-start justify-between">
          <h3 className={`text-lg font-semibold ${isSelected ? "text-gray-800" : "text-gray-800"}`}>{title}</h3>
          {/* radio */}
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-emerald-500" : "border-gray-300"}`}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </button>
  );
}
