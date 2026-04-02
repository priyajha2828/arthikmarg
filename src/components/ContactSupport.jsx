// src/components/ContactSupport.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera, Check } from "lucide-react";

export default function ContactSupport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subjects = [
    "Select a subject",
    "Bug Report",
    "Feature Request",
    "Billing / Payment",
    "Account / Login",
    "Other",
  ];

  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // simple size check (5MB)
    if (f.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFile({ file: f, preview: reader.result });
    };
    reader.readAsDataURL(f);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject || subject === subjects[0]) {
      setError("Please select a subject.");
      return;
    }
    if (!message.trim()) {
      setError("Please write your message.");
      return;
    }

    setSending(true);

    try {
      // Simulate async upload / API call
      await new Promise((res) => setTimeout(res, 900));

      // In real app: build FormData and POST to API
      // const fd = new FormData();
      // fd.append("subject", subject);
      // fd.append("message", message);
      // if (file?.file) fd.append("attachment", file.file);

      // const resp = await fetch("/api/support/tickets", { method: "POST", body: fd });

      setSuccess("Your message has been submitted. We'll get back to you soon.");
      // brief success display then navigate back
      setTimeout(() => {
        navigate("/support/messages");
      }, 900);
    } catch (err) {
      setError("Failed to send. Try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Contact Support"
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "720px",
          maxWidth: "100%",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(2,6,23,0.2)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottom: "1px solid #eef2f6" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Contact Support</h3>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "#6b7280",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: 20 }}>
          {/* Subject */}
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#111827" }}>Subject</label>
          <div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e6e6e6",
                fontSize: 15,
                color: subject && subject !== subjects[0] ? "#111827" : "#9ca3af",
                background: "#fff",
                outline: "none",
              }}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginTop: 18 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#111827" }}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write down about your issues or feedback..."
              rows={7}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #e6e6e6",
                fontSize: 15,
                color: "#111827",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* attachment */}
          <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                role="button"
                tabIndex={0}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 8,
                  border: "1px solid #e6e6e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "#fafafa",
                }}
              >
                <Camera size={22} />
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Attach image</div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              style={{ display: "none" }}
            />

            {file ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 96, height: 64, borderRadius: 8, overflow: "hidden", border: "1px solid #e6e6e6" }}>
                  <img src={file.preview} alt="attachment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{file.file.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={removeFile} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6e6", background: "#fff", cursor: "pointer" }}>
                      Remove
                    </button>
                    <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6e6", background: "#fff", cursor: "pointer" }}>
                      Change
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* errors / success */}
          <div style={{ marginTop: 16 }}>
            {error && <div style={{ color: "#ef4444", fontSize: 14 }}>{error}</div>}
            {success && <div style={{ color: "#059669", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Check size={14} /> {success}</div>}
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: 16, borderTop: "1px solid #eef2f6", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #e6e6e6",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
            disabled={sending}
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={onSubmit}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "#172554",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
            disabled={sending}
          >
            {sending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
