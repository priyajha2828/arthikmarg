// src/components/FeedbackModal.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera, Check } from "lucide-react";

export default function FeedbackModal() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [feedback, setFeedback] = useState("");
  const [file, setFile] = useState(null);
  const [rating, setRating] = useState(null); // ⭐ emoji rating
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emojiList = [
    { id: 1, emoji: "😡" },
    { id: 2, emoji: "😞" },
    { id: 3, emoji: "🙂" },
    { id: 4, emoji: "😀" },
    { id: 5, emoji: "😍" },
  ];

  const pickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFile({ file: f, preview: reader.result });
    };
    reader.readAsDataURL(f);
  };

  const removeFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onClose = () => navigate(-1);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating) { 
      setError("Please select an emoji rating.");
      return;
    }

    if (!feedback.trim()) {
      setError("Please write your feedback.");
      return;
    }

    setSending(true);
    try {
      // Simulate API
      await new Promise((r) => setTimeout(r, 900));

      setSuccess("Thanks — your feedback has been sent!");

      // navigate back
      setTimeout(() => navigate(-1), 900);

    } catch {
      setError("Failed to send. Try again.");
    }
    setSending(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 2000,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: 720,
          maxWidth: "100%",
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "#6b7280",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, textAlign: "center" }}>

          {/* Emoji Rating Row */}
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", gap: 20 }}>
            {emojiList.map((e) => (
              <div
                key={e.id}
                onClick={() => setRating(e.id)}
                style={{
                  cursor: "pointer",
                  fontSize: rating === e.id ? 38 : 30,
                  transition: "0.2s",
                  filter: rating === e.id ? "none" : "grayscale(80%)",
                }}
              >
                {e.emoji}
              </div>
            ))}
          </div>

          {/* Title */}
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "6px 0" }}>
            Send us your feedback
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>
            Your suggestions help us improve our app.
          </p>

          {/* Feedback Input */}
          <div style={{ textAlign: "left" }}>
            <label style={{ fontWeight: 600 }}>Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback..."
              rows={5}
              style={{
                width: "100%",
                padding: 12,
                marginTop: 6,
                borderRadius: 10,
                border: "2px solid #10B981",
                outline: "none",
                fontSize: 15,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Image Upload */}
          <div style={{ marginTop: 18, textAlign: "left" }}>
            <label style={{ fontWeight: 600 }}>Attach Images</label>
            
            <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
              <div
                onClick={() => fileRef.current.click()}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fafafa",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Camera size={22} />
              </div>

              <input type="file" ref={fileRef} style={{ display: "none" }} onChange={pickFile} />

              {file && (
                <div style={{ display: "flex", gap: 10 }}>
                  <img
                    src={file.preview}
                    alt="preview"
                    style={{
                      width: 96,
                      height: 70,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{
                      background: "#fff",
                      border: "1px solid #ddd",
                      padding: "6px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error / Success */}
          <div style={{ marginTop: 16 }}>
            {error && <div style={{ color: "#ef4444" }}>{error}</div>}
            {success && (
              <div style={{ color: "#059669", display: "flex", justifyContent: "center", gap: 8 }}>
                <Check size={16} /> {success}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: 20, borderTop: "1px solid #eee" }}>
          <button
            type="submit"
            disabled={sending}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              background: "#172554",
              color: "#fff",
              border: "none",
              fontSize: 17,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {sending ? "Sending..." : "Send Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
