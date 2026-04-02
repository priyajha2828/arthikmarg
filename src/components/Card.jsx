// src/components/Card.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Theme-aware Card
 *
 * Props:
 * - title, amount, subtitle, icon
 * - color: either a Tailwind bg class (e.g. "bg-emerald-50") OR a CSS color value (e.g. "var(--surface-100)" or "#fff")
 * - iconBg: same as `color` but for the icon badge
 * - onClick: optional click handler
 *
 * Behavior:
 * - If color/iconBg starts with "bg-" it's treated as a Tailwind class (backwards compatible).
 * - Otherwise it's applied inline as `background` allowing CSS variables (recommended).
 *
 * Icon color rule:
 * - light / dark => white
 * - classic => black
 */
export default function Card({
  title,
  amount,
  subtitle,
  icon,
  color = "var(--surface-100)",
  iconBg = "var(--primary-500)",
  onClick,
}) {
  const clickable = typeof onClick === "function";

  // If user supplied a Tailwind background class (e.g. "bg-emerald-50"), use it as a class.
  const colorIsTailwindClass = typeof color === "string" && color.trim().startsWith("bg-");
  const iconBgIsTailwindClass = typeof iconBg === "string" && iconBg.trim().startsWith("bg-");

  // THEME-AWARE: read theme from context (safely)
  const themeCtx = useContext(ThemeContext) || {};
  const theme = typeof themeCtx === "string" ? themeCtx : themeCtx.theme ? themeCtx.theme : "light";

  // If theme is dark and caller didn't pass a Tailwind class and didn't pass a custom color
  // (or passed the default var(--surface-100)), prefer a dark surface variable.
  // You can customize the var name to match your CSS variables (e.g. --surface-800).
  let effectiveColor = color;
  if (!colorIsTailwindClass) {
    // treat empty/null or the default var(--surface-100) as "no explicit color"
    const noExplicitColor = !color || color === "var(--surface-100)";
    if (theme === "dark" && noExplicitColor) {
      effectiveColor = "var(--surface-800)"; // adjust this var if your theme uses a different var
    }
  }

  const rootStyle = colorIsTailwindClass ? {} : { background: effectiveColor || "var(--surface-100)" };
  const iconStyle = iconBgIsTailwindClass ? {} : { background: iconBg || "var(--primary-500)" };

  // TEXT + MUTED colors adapt to theme for good contrast on dark/light backgrounds.
  const titleStyle = { color: theme === "dark" ? "rgba(12, 11, 11, 0.95)" : "var(--muted)" };
  const amountStyle = { color: theme === "dark" ? "#000000ff" : "var(--text-default)" };
  const subtitleStyle = { color: theme === "dark" ? "rgba(14, 13, 13, 0.75)" : "var(--muted)" };

  // THEME-AWARE ICON COLOR:
  // white for light/dark, black for classic
  const computedIconColor = theme === "classic" ? "#000000" : "#ffffff";

  // Optional small border tweak for dark mode (subtle translucent border)
  const borderColorStyle = theme === "dark" ? { borderColor: "rgba(255,255,255,0.04)" } : { borderColor: "transparent" };

  return (
    <div
      role={clickable ? "button" : "article"}
      onClick={onClick}
      // group needed so the chevron shows on hover
      className={`group flex items-center gap-4 p-4 md:p-5 rounded-2xl border shadow-sm transition-transform duration-150 ${
        clickable ? "cursor-pointer" : ""
      } hover:shadow-md hover:-translate-y-0.5 ${colorIsTailwindClass ? color : ""}`}
      style={{
        ...rootStyle,
        ...borderColorStyle,
      }}
    >
      {/* Icon Badge */}
      <div
        className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-sm ${
          iconBgIsTailwindClass ? iconBg : ""
        }`}
        style={{ minWidth: 48, ...iconStyle }}
        aria-hidden
      >
        {/* Icon container color and icon color should follow theme:
            we set the container color (currentColor) so cloned icon using "currentColor" inherits it.
            If the icon is not a React element, we still wrap it and attempt to style it. */}
        <div style={{ color: computedIconColor }} className="w-6 h-6 md:w-7 md:h-7">
          {React.isValidElement(icon)
            ? // we pass color: "currentColor" so icons that accept color prop will inherit wrapper color
              React.cloneElement(icon, { color: "currentColor", size: icon.props.size || 20 })
            : icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={titleStyle}>
          {title}
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-lg md:text-xl font-semibold truncate" style={amountStyle}>
            {amount}
          </div>
          {subtitle && (
            <div className="text-xs md:text-sm truncate" style={subtitleStyle}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* small chevron visible on hover when clickable */}
      {clickable && (
        <div
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ color: theme === "dark" ? "rgba(24, 23, 23, 0.7)" : "var(--muted)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
