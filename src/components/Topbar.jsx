// src/components/Topbar.jsx
import { useState, useContext, useMemo } from "react";
import { Search, Bell, Keyboard, Sun, Moon, Laptop, User, LogOut } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function Topbar({ onProfileClick }) {
  const { theme, setTheme } = useContext(ThemeContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const themeOptions = useMemo(
    () => [
      { label: "Light", value: "light", icon: <Sun size={16} /> },
      { label: "Dark", value: "dark", icon: <Moon size={16} /> },
      { label: "Classic", value: "classic", icon: <Laptop size={16} /> },
    ],
    []
  );

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={20} />;
      case "dark":
        return <Moon size={20} />;
      default:
        return <Laptop size={20} />;
    }
  };

  const THEME_MAP = {
    light: {
      headerBg: "#ffffff",
      headerText: "#0b1220",
      inputBg: "#ffffff",
      inputBorder: "#d1d5db",
      popoverBg: "#ffffff",
      popoverText: "#0b1220",
      hoverBg: "#f3f4f6",
      profileBg: "#172554",
    },
    dark: {
      headerBg: "#0b1220",
      headerText: "#ffffff",
      inputBg: "#0b1220",
      inputBorder: "#374151",
      popoverBg: "#0b1220",
      popoverText: "#ffffff",
      hoverBg: "#0b1220",
      profileBg: "#172554",
    },
    classic: {
      headerBg: "#F6E9D2",
      headerText: "#ffffff",
      inputBg: "#F6E9D2",
      inputBorder: "#e8dcc6",
      popoverBg: "#F6E9D2",
      popoverText: "#ffffff",
      hoverBg: "#efe6cf",
      profileBg: "#172554",
    },
  };

  const style = THEME_MAP[theme] || THEME_MAP.light;

  const headerStyle = {
    background: style.headerBg,
    color: style.headerText,
  };

  const inputStyle = {
    background: style.inputBg,
    borderColor: style.inputBorder,
    color: style.headerText,
  };

  const popoverStyle = {
    background: style.popoverBg,
    color: style.popoverText,
    borderColor: style.inputBorder,
  };

  return (
    <header
      style={headerStyle}
      className="h-16 flex items-center justify-between px-6 border-b transition-colors duration-300"
    >
      {/* LEFT (spacer) */}
      <div className="w-1/4" />

      {/* CENTER: Search */}
      <div className="w-1/2 flex justify-center">
        <div className="relative w-full max-w-xl">
          <input
            aria-label="Search"
            style={inputStyle}
            className="pl-10 pr-4 w-full py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
            placeholder="Search or create anything..."
          />
          <div style={{ color: style.popoverText }} className="absolute left-3 top-2">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="w-1/4 flex items-center gap-4 justify-end">
        {/* Shortcuts */}
        <div className="relative">
          <button
            aria-haspopup="true"
            aria-expanded={showShortcuts}
            onClick={() => setShowShortcuts((s) => !s)}
            className="p-2 rounded"
            title="Keyboard shortcuts"
            style={{ color: style.popoverText, background: "transparent" }}
          >
            <Keyboard size={20} />
          </button>

          {showShortcuts && (
            <div role="menu" style={popoverStyle} className="absolute right-0 mt-2 w-48 p-2 border rounded shadow-lg z-50">
              <p className="text-sm">Ctrl + S: Save</p>
              <p className="text-sm">Ctrl + P: Print</p>
              <p className="text-sm">Ctrl + F: Search</p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            aria-haspopup="true"
            aria-expanded={showNotifications}
            onClick={() => setShowNotifications((s) => !s)}
            className="p-2 rounded relative"
            title="Notifications"
            style={{ color: style.popoverText, background: "transparent" }}
          >
            <Bell size={20} />
            <span
              className="absolute top-0 right-0 w-2 h-2 rounded-full"
              style={{ background: "#ef4444" }}
            />
          </button>

          {showNotifications && (
            <div role="menu" style={popoverStyle} className="absolute right-0 mt-2 w-56 p-2 border rounded shadow-lg z-50">
              <p className="text-sm">New message from John</p>
              <p className="text-sm">Server rebooted</p>
            </div>
          )}
        </div>

        {/* Theme switcher */}
        <div className="relative">
          <button
            aria-haspopup="true"
            aria-expanded={showThemeMenu}
            onClick={() => setShowThemeMenu((s) => !s)}
            className="p-2 rounded"
            title="Theme"
            style={{ color: style.popoverText, background: "transparent" }}
          >
            {getThemeIcon()}
          </button>

          {showThemeMenu && (
            <div role="menu" style={popoverStyle} className="absolute right-0 mt-2 w-48 p-2 border rounded shadow-lg z-50">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setShowThemeMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1 rounded text-sm"
                  style={{ color: style.popoverText, background: "transparent", textAlign: "left" }}
                  role="menuitem"
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((s) => !s)}
            className="w-8 h-8 rounded-full text-white flex items-center justify-center"
            aria-haspopup="true"
            aria-expanded={showProfileMenu}
            title="Profile"
            style={{ background: style.profileBg }}
          >
            RA
          </button>

          {showProfileMenu && (
            <div role="menu" style={popoverStyle} className="absolute right-0 mt-2 w-40 border rounded-xl shadow-lg z-50">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onProfileClick && onProfileClick();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-t-xl text-sm"
                role="menuitem"
              >
                <User size={16} /> My Profile
              </button>

              <div style={{ borderTopColor: style.inputBorder }} className="my-1" />

              <button
                onClick={() => console.log("Logout")}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-b-xl text-sm"
                role="menuitem"
                style={{ color: "#ef4444" }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
