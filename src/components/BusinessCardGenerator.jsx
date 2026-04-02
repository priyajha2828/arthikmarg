// src/components/BusinessCardGenerator.jsx
import React, { useState, useRef } from "react";

/**
 * BusinessCardGenerator.jsx
 * - 3 preview styles (including diagonal/angled)
 * - color swatches, logo upload
 * - Business Address and Email lines with icons
 * - smaller preview and SVG download for each style
 *
 * Replace the existing file with this full component.
 */

const COLOR_SWATCHES = [
  "#2fb36a", // green (default)
  "#e84b6b",
  "#1ea3ff",
  "#ff7a00",
  "#0bb0b7",
  "#167c50",
  "#b739a8",
  "#172554",

];

const DEFAULT_PREVIEW = {
  name: "Anything else",
  business: "something",
  address: "biratnagar",
  phone: "9820318653",
  email: "info@example.com",
  logo: null,
};

export default function BusinessCardGenerator() {
  const [form, setForm] = useState(DEFAULT_PREVIEW);
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [styleIndex, setStyleIndex] = useState(2); // default to diagonal-angled (index 2)
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const svgRef = useRef();

  const styles = ["split-left-colored", "split-right-line", "diagonal-angled"];

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(reader.result);
      setForm((s) => ({ ...s, logo: reader.result }));
    };
    reader.readAsDataURL(f);
  }

  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function downloadSVG() {
    const svgString = generateSVGString({ ...form, logo: logoDataUrl }, selectedColor, styles[styleIndex]);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.name || "business-card").replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Generate Your Business Card</h1>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT FORM */}
        <div className="col-span-5 space-y-4">
          <label className="block text-sm text-gray-700 mb-1">Your Name</label>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gray-100 rounded-l-md border border-r-0 text-gray-500">👤</span>
            <input
              className="flex-1 px-4 py-2 border rounded-r-md border-gray-200"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <label className="block text-sm text-gray-700 mb-1">Business Name</label>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gray-100 rounded-l-md border border-r-0 text-gray-500">🏢</span>
            <input
              className="flex-1 px-4 py-2 border rounded-r-md border-gray-200"
              value={form.business}
              onChange={(e) => updateField("business", e.target.value)}
            />
          </div>

          <label className="block text-sm text-gray-700 mb-1">Business Address</label>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gray-100 rounded-l-md border border-r-0 text-gray-500 flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C9.2386 2 7 4.2386 7 7c0 4.5 5 10 5 10s5-5.5 5-10c0-2.7614-2.2386-5-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <input
              className="flex-1 px-4 py-2 border rounded-r-md border-gray-200"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <label className="block text-sm text-gray-700 mb-1">Your Contact Number</label>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gray-100 rounded-l-md border border-r-0 text-gray-500">📞</span>
            <input
              className="flex-1 px-4 py-2 border rounded-r-md border-gray-200"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <label className="block text-sm text-gray-700 mb-1">Business Email</label>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gray-100 rounded-l-md border border-r-0 text-gray-500">✉️</span>
            <input
              className="flex-1 px-4 py-2 border rounded-r-md border-gray-200"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <label className="block text-sm text-gray-700 mb-2">Business Logo</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex flex-col items-center justify-center w-24 h-24 border rounded-md cursor-pointer bg-gray-50">
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              <div className="text-sm text-gray-500">Upload</div>
              <div className="text-xs text-gray-400">PNG/JPG</div>
            </label>
            <div className="text-sm text-gray-600">Recommended square logo (150×150)</div>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="col-span-7 space-y-6">
          {/* header + arrows */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Select Card Style</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setStyleIndex((i) => (i - 1 + styles.length) % styles.length)}
                  className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center"
                >
                  ◀
                </button>
                <button
                  onClick={() => setStyleIndex((i) => (i + 1) % styles.length)}
                  className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* preview */}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6">
                {/* STYLE: split-left-colored */}
                {styles[styleIndex] === "split-left-colored" && (
                  <div className="relative rounded-lg overflow-hidden" style={{ minHeight: 160 }}>
                    <div style={{ backgroundColor: selectedColor }} className="absolute inset-y-0 left-0 w-2/3 rounded-l-lg" />
                    <div className="absolute inset-y-0 right-0 left-2/3 bg-white rounded-r-lg flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold" style={{ color: selectedColor }}>
                        {logoDataUrl ? <img src={logoDataUrl} alt="logo" className="w-20 h-20 object-cover rounded-full" /> : (form.name || "X").charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="relative p-6 text-white" style={{ pointerEvents: "none" }}>
                      <div style={{ width: "60%" }} className="text-white">
                        <div className="text-2xl font-semibold">{form.name}</div>
                        <div className="text-sm opacity-90 mt-1">{form.business}</div>

                        <div className="mt-6 border-t border-white/30 pt-3 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">📞</span>
                            <span className="text-sm">{form.phone}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">✉️</span>
                            <span className="text-sm break-words max-w-full whitespace-normal">{form.email}</span>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M12 2C9.2386 2 7 4.2386 7 7c0 4.5 5 10 5 10s5-5.5 5-10c0-2.7614-2.2386-5-5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="7" r="1.4" fill="currentColor" />
                              </svg>
                            </span>
                            <span className="text-sm break-words max-w-full whitespace-normal">{form.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STYLE: split-right-line */}
                {styles[styleIndex] === "split-right-line" && (
                  <div className="relative rounded-lg overflow-hidden bg-white" style={{ minHeight: 160, border: "1px solid #eee" }}>
                    <div className="absolute inset-0 flex">
                      <div style={{ width: "45%" }} className="flex items-center justify-center">
                        <div className="text-3xl font-bold" style={{ color: selectedColor }}>
                          {logoDataUrl ? <img src={logoDataUrl} alt="logo" className="w-20 h-20 object-cover rounded-full" /> : (form.name || "X").charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div style={{ width: "10%" }} className="flex items-center justify-center">
                        <div style={{ width: 1, height: "60%", backgroundColor: "#e6e6e6" }} />
                      </div>

                      <div style={{ width: "45%" }} className="p-6 flex flex-col justify-center">
                        <div className="text-xl font-semibold text-gray-900">{form.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{form.business}</div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">📞</span>
                            <span>{form.phone}</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">✉️</span>
                            <span className="break-words max-w-full whitespace-normal">{form.email}</span>
                          </div>

                          <div className="flex items-start gap-3 text-sm">
                            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M12 2C9.2386 2 7 4.2386 7 7c0 4.5 5 10 5 10s5-5.5 5-10c0-2.7614-2.2386-5-5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="7" r="1.4" fill="currentColor" />
                              </svg>
                            </span>
                            <span className="break-words max-w-full whitespace-normal">{form.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STYLE: diagonal-angled */}
                {styles[styleIndex] === "diagonal-angled" && (
                  <div className="relative rounded-lg overflow-hidden" style={{ minHeight: 160, backgroundColor: "#fff" }}>
                    <div className="absolute inset-0 flex">
                      {/* left white area */}
                      <div style={{ width: "55%" }} className="p-6 flex items-center">
                        <div>
                          <div className="text-2xl font-semibold text-gray-900">{form.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{form.business}</div>

                          <div className="mt-6 space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">📞</span>
                              <span>{form.phone}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">✉️</span>
                              <span className="break-words max-w-full whitespace-normal">{form.email}</span>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <path d="M12 2C9.2386 2 7 4.2386 7 7c0 4.5 5 10 5 10s5-5.5 5-10c0-2.7614-2.2386-5-5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle cx="12" cy="7" r="1.4" fill="currentColor" />
                                </svg>
                              </span>
                              <span className="break-words max-w-full whitespace-normal">{form.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* diagonal right colored block */}
                      <div style={{ width: "45%" }} className="flex items-stretch">
                        <div className="flex-1" style={{ backgroundColor: selectedColor, transform: "skewX(-18deg)", transformOrigin: "left top" }}>
                          <div style={{ transform: "skewX(18deg)", padding: 22, height: "100%" }} className="flex flex-col justify-center items-start text-white">
                            <div className="text-xl font-semibold">{form.name}</div>
                            <div className="text-xs opacity-90 mt-1">{form.business}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4" />
          </div>

          {/* color + actions */}
          <div className="bg-white border rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4">Select Color</h4>
            <div className="flex items-center gap-3 mb-4">
              {COLOR_SWATCHES.map((c) => {
                const selected = c === selectedColor;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${selected ? "ring-2 ring-offset-2 ring-gray-300" : ""}`}
                    style={{ backgroundColor: c }}
                    title={c}
                  >
                    {selected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setForm(DEFAULT_PREVIEW);
                  setLogoDataUrl(null);
                  setSelectedColor(COLOR_SWATCHES[0]);
                  setStyleIndex(2);
                }}
                className="px-4 py-2 border rounded-md"
              >
                Restore to Default
              </button>

              <div className="flex items-center gap-3">
                <button onClick={() => downloadSVG()} className="px-4 py-2 bg-[#172554] hover:bg-[#111A31] text-white rounded-md flex items-center gap-2">
                  ⬇ Download Business Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* hidden svg container */}
      <div style={{ display: "none" }}>
        <div ref={svgRef} id="card-svg" />
      </div>
    </div>
  );

  // --------------------------------
  // SVG generation for three styles
  // (includes email line)
  // --------------------------------
  function generateSVGString(data, color = "#2fb36a", style = "diagonal-angled") {
    const W = 1000;
    const H = 520;
    const name = escapeXml(data.name || "");
    const business = escapeXml(data.business || "");
    const phone = escapeXml(data.phone || "");
    const email = escapeXml(data.email || "");
    const address = escapeXml(data.address || "");
    const initial = (data.name || "X").charAt(0).toUpperCase();

    if (style === "split-left-colored") {
      const leftW = Math.floor(W * 0.6);
      const rightW = W - leftW;
      const circleCx = leftW + Math.floor(rightW / 2);
      const circleCy = Math.floor(H / 2);

      const logoImageTag = data.logo
        ? `<image href="${data.logo}" x="${circleCx - 70}" y="${circleCy - 70}" width="140" height="140" clip-path="circle(70px at ${circleCx}px ${circleCy}px)" />`
        : `<text x="${circleCx}" y="${circleCy + 12}" font-size="90" font-family="Arial" text-anchor="middle" fill="${color}">${initial}</text>`;

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff" rx="16"/>
  <rect x="0" y="0" width="${leftW}" height="${H}" fill="${color}" rx="16"/>
  <text x="48" y="90" font-size="36" font-family="Arial" fill="#ffffff" font-weight="700">${name}</text>
  <text x="48" y="125" font-size="16" font-family="Arial" fill="#e6fff0">${business}</text>

  <text x="48" y="${H - 145}" font-size="16" font-family="Arial" fill="#ffffff">📞 ${phone}</text>
  <text x="48" y="${H - 115}" font-size="14" font-family="Arial" fill="#ffffff">✉️ ${email}</text>
  <text x="48" y="${H - 85}" font-size="14" font-family="Arial" fill="#ffffff">📍 ${address}</text>

  <rect x="${leftW}" y="0" width="${rightW}" height="${H}" rx="16" fill="#ffffff"/>
  ${logoImageTag}
</svg>`;
    } else if (style === "split-right-line") {
      const rightW = Math.floor(W * 0.45);
      const leftMid = Math.floor(W * 0.5);
      const initialX = 120;
      const initialY = Math.floor(H / 2);

      const logoImageTag = data.logo
        ? `<image href="${data.logo}" x="${initialX - 70}" y="${initialY - 70}" width="140" height="140" clip-path="circle(70px at ${initialX}px ${initialY}px)" />`
        : `<text x="${initialX}" y="${initialY + 12}" font-size="90" font-family="Arial" text-anchor="middle" fill="${color}">${initial}</text>`;

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff" rx="16"/>
  ${logoImageTag}
  <line x1="${leftMid}" y1="60" x2="${leftMid}" y2="${H - 60}" stroke="#e6e6e6" stroke-width="2"/>
  <text x="${leftMid + 36}" y="100" font-size="32" font-family="Arial" fill="#111827" font-weight="700">${name}</text>
  <text x="${leftMid + 36}" y="138" font-size="16" font-family="Arial" fill="#555555">${business}</text>

  <text x="${leftMid + 36}" y="${H - 125}" font-size="16" font-family="Arial" fill="#111827">📞 ${phone}</text>
  <text x="${leftMid + 36}" y="${H - 95}" font-size="14" font-family="Arial" fill="#111827">✉️ ${email}</text>
  <text x="${leftMid + 36}" y="${H - 65}" font-size="14" font-family="Arial" fill="#111827">📍 ${address}</text>
</svg>`;
    } else {
      // diagonal-angled
      const leftW = Math.floor(W * 0.55);
      const clip = `<defs><clipPath id="clipDiag"><rect x="0" y="0" width="${W}" height="${H}" rx="16"/></clipPath></defs>`;
      const logoImageTag = data.logo
        ? `<image href="${data.logo}" x="${leftW - 120}" y="${H / 2 - 70}" width="140" height="140" clip-path="circle(70px at ${leftW - 50}px ${H / 2}px)" />`
        : `<text x="${leftW - 90}" y="${H / 2 + 12}" font-size="60" font-family="Arial" text-anchor="middle" fill="#ffffff">${initial}</text>`;

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${clip}
  <g clip-path="url(#clipDiag)">
    <rect width="${W}" height="${H}" fill="#ffffff"/>
    <polygon points="${leftW},0 ${W},0 ${W},${H} ${leftW + 40},${H}" fill="${color}" />
    <text x="48" y="92" font-size="34" font-family="Arial" fill="#111827" font-weight="700">${name}</text>
    <text x="48" y="124" font-size="14" font-family="Arial" fill="#555555">${business}</text>

    <text x="48" y="${H - 125}" font-size="14" font-family="Arial" fill="#111827">📞 ${phone}</text>
    <text x="48" y="${H - 95}" font-size="14" font-family="Arial" fill="#111827">✉️ ${email}</text>
    <text x="48" y="${H - 65}" font-size="13" font-family="Arial" fill="#111827">📍 ${address}</text>

    ${logoImageTag}
  </g>
</svg>`;
    }
  }

  function escapeXml(unsafe) {
    return String(unsafe || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }
}
