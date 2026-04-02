import React, { useState } from "react";
import { Camera } from "lucide-react";

/* EMPTY STATE */
function EmptyState({ title, description, buttonText, onClick }) {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      style={{
        background: "var(--bg-default)",
        color: "var(--text-default)",
      }}
    >
      <div className="mb-6">
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center"
          style={{ background: "var(--surface-200)" }}
        >
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--muted)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p style={{ color: "var(--muted)" }} className="mb-6">
        {description}
      </p>

      <button
        onClick={onClick}
        className="px-6 py-3 text-white rounded-lg"
        style={{ background: "#172554" }}
      >
        + {buttonText}
      </button>
    </div>
  );
}

export default function PaymentOut({ sidebarOpen = true }) {
  const sidebarOffset = sidebarOpen ? "24rem" : "4rem";

  const [paymentsOut, setPaymentsOut] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [receiptNumber, setReceiptNumber] = useState("AUTO-001");
  const [date, setDate] = useState("");
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [remarks, setRemarks] = useState("");
  const [image, setImage] = useState(null);

  const resetForm = () => {
    setReceiptNumber("AUTO-001");
    setDate("");
    setParty("");
    setAmount("");
    setPaymentMethod("cash");
    setRemarks("");
    setImage(null);
  };

  function handleSave(e, saveNew = false) {
    e?.preventDefault();

    if (!date || !party || !amount) {
      alert("Fill required fields");
      return;
    }

    const newPayment = {
      id: Date.now(),
      receiptNumber,
      date,
      party,
      amount,
      paymentMethod,
      remarks,
    };

    setPaymentsOut([newPayment, ...paymentsOut]);

    if (saveNew) {
      resetForm();
    } else {
      setShowForm(false);
      resetForm();
    }
  }

  return (
    <>
      {/* MAIN */}
      <div
        className="fixed top-16 right-0 bottom-0 flex flex-col items-center justify-center"
        style={{
          left: sidebarOffset,
          background: "var(--bg-default)",
          color: "var(--text-default)",
        }}
      >
        {paymentsOut.length === 0 ? (
          <EmptyState
            title="Create Your First Payment Out"
            description="Start recording outgoing payments"
            buttonText="Create Payment"
            onClick={() => setShowForm(true)}
          />
        ) : (
          <div className="w-full max-w-4xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Payments Out</h2>

              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                + Add Payment
              </button>
            </div>

            <div className="space-y-3">
              {paymentsOut.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded border"
                  style={{
                    background: "var(--surface-100)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{p.party}</div>
                      <div style={{ color: "var(--muted)" }}>
                        {p.date} • {p.paymentMethod}
                      </div>
                    </div>

                    <div className="font-semibold">₹{p.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center pt-10 z-50">
          <div
            className="w-[600px] rounded-md flex flex-col"
            style={{
              background: "var(--surface-100)",
              color: "var(--text-default)",
              maxHeight: "80vh",
            }}
          >
            {/* HEADER */}
            <div className="flex justify-between p-4 border-b">
              <h3>Add Payment Out</h3>
              <button onClick={() => setShowForm(false)}>X</button>
            </div>

            {/* BODY */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <input
                placeholder="Receipt No"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                placeholder="Party"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border p-2 w-full rounded"
              >
                <option>cash</option>
                <option>bank</option>
                <option>cheque</option>
              </select>

              <textarea
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <label className="flex gap-2 cursor-pointer">
                <Camera size={18} />
                Attach Image
                <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
              </label>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>

              <button
                onClick={(e) => handleSave(e, true)}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                Save & New
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 text-white rounded"
                style={{ background: "#172554" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}