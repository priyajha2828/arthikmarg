// src/components/Sidebar.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Boxes,
  ShoppingCart,
  Package,
  Receipt,
  Wallet,
  Building,
  BarChart2,
  Users2,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  ChevronsUpDown,
  Menu,
  FileUp,
  Wrench,
  LifeBuoy,
  BookOpen,
  Sparkles,
  Settings,
  User,
  UserPlus,
  SunMoon,
} from "lucide-react";
import logo from "../assets/logo.png";
import { ThemeContext } from "../context/ThemeContext"; // ensure this path matches your project

const COLLAPSED_WIDTH = "w-16 p-2";
const EXPANDED_WIDTH = "w-96 p-6";
const ICON_SIZE = 20;

/**
 * Theme-aware Sidebar
 * - Uses CSS variables from ThemeProvider:
 *    --bg-default, --text-default, --primary-500, --surface-100, --on-primary (optional)
 *
 * Icons rely on `currentColor` so they follow the text color.
 */

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext) || {};
  const { theme, toggleTheme } = themeCtx;

  const [activePage, setActivePage] = useState("dashboard");

  // dropdowns
  const [openSales, setOpenSales] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openBusinessTools, setOpenBusinessTools] = useState(false);

  // hover & profile
  const [hoverToggle, setHoverToggle] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSetActive = (id) => {
    if (!id) return;
    setActivePage(id);

    // routing logic
    let path = "/";
    switch (id) {
      case "dashboard":
        path = "/";
        break;
      case "parties":
        path = "/parties";
        break;
      case "inventory":
        path = "/inventory";
        break;
      case "sales-invoice":
        path = "/sales-invoice";
        break;
      case "quotation":
        path = "/quotation";
        break;
      case "payment-in":
        path = "/payment-in";
        break;
      case "sales-return":
        path = "/sales-return";
        break;
      case "purchase-bills":
        path = "/purchase-bills";
        break;
      case "payment-out":
        path = "/payment-out";
        break;
      case "purchase-return":
        path = "/purchase-return";
        break;
      case "expense":
        path = "/expense";
        break;
      case "other-income":
        path = "/other-income";
        break;
      case "manage-staffs":
        path = "/manage-staffs";
        break;
      case "import-parties":
        path = "/import-parties";
        break;
      case "import-items":
        path = "/import-items";
        break;
      case "business-cards":
        path = "/business-card";
        break;
      case "reminders":
        path = "/reminders";
        break;
      case "bill-gallery":
        path = "/bill-gallery";
        break;
      case "notebook":
        path = "/notebook";
        break;
      case "reports":
        path = "/reports";
        break;
      case "help-support":
        path = "/help-support";
        break;
      case "tutorials":
        path = "/tutorials";
        break;
      case "whats-new":
        path = "/whats-new";
        break;
      case "settings":
        path = "/settings";
        break;
      case "accounts":
      case "manage-accounts":
        // Accept both ids — map them to the same route
        path = "/manage-accounts";
        break;
      default:
        path = `/${id}`;
    }

    navigate(path);

    // manage dropdown states for visual coherence
    if (["sales-invoice", "quotation", "payment-in", "sales-return"].includes(id)) {
      setOpenSales(true);
      setOpenPurchase(false);
      setOpenImport(false);
    } else if (["purchase-bills", "payment-out", "purchase-return"].includes(id)) {
      setOpenPurchase(true);
      setOpenSales(false);
      setOpenImport(false);
    } else if (["import-parties", "import-items"].includes(id)) {
      setOpenImport(true);
      setOpenSales(false);
      setOpenPurchase(false);
    } else {
      // collapse others
      setOpenSales(false);
      setOpenPurchase(false);
      setOpenImport(false);
    }
  };

  const toggleButtonContent = (isSidebarOpen, isHovered) => {
    if (isSidebarOpen) {
      return isHovered ? <ChevronsLeft size={24} /> : <Menu size={24} />;
    } else {
      return isHovered ? <ChevronsRight size={24} /> : <Menu size={24} />;
    }
  };

  // theme-driven root style (uses CSS variables from ThemeProvider)
  const sidebarStyle = {
    background: "var(--bg-default, #ffffff)",
    color: "var(--text-default, #0f172a)",
  };

  // returns style for items; active => primary bg + white text/icons
  const itemStyle = (isActive) =>
    isActive
      ? {
          background: "var(--primary-500, #172554)",
          color: "var(--on-primary, #ffffff)",
        }
      : {
          color: "var(--text-default, #0f172a)",
        };

  return (
    <>
      <div
        className={`sticky top-0 self-start h-screen border-r shadow-sm z-40 transition-all duration-300 overflow-y-auto ${sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH}`}
        style={sidebarStyle}
      >
        {/* INTERNAL TOGGLE */}
        {sidebarOpen ? (
          <div
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-2 rounded cursor-pointer z-50"
            onClick={() => setSidebarOpen(false)}
            onMouseEnter={() => setHoverToggle(true)}
            onMouseLeave={() => setHoverToggle(false)}
            role="button"
            aria-label="Collapse sidebar"
          >
            {toggleButtonContent(true, hoverToggle)}
          </div>
        ) : (
          <div
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-2 rounded cursor-pointer z-50"
            onClick={() => setSidebarOpen(true)}
            onMouseEnter={() => setHoverToggle(true)}
            onMouseLeave={() => setHoverToggle(false)}
            role="button"
            aria-label="Expand sidebar"
          >
            {toggleButtonContent(false, hoverToggle)}
          </div>
        )}

        {/* Logo */}
        {sidebarOpen && (
          <div className="flex items-center gap-3 mb-6 px-1">
            <img src={logo} className="w-14 h-14 object-contain" alt="Karobar Logo" />
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-default)" }}>ArthikMarg</h1>
          </div>
        )}

        {/* Profile */}
        {sidebarOpen && (
          <div className="mb-5 px-1">
            <div
              className="border py-3 px-3 rounded-lg flex items-center justify-between cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              role="button"
              aria-expanded={isProfileOpen}
              style={isProfileOpen ? { background: "var(--primary-500)", color: "var(--on-primary, #fff)" } : { borderColor: "rgba(0,0,0,0.06)", color: "var(--text-default)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold"
                  style={isProfileOpen ? { background: "var(--surface-100, #fff)", color: "var(--primary-500)" } : { background: "var(--primary-500)", color: "var(--on-primary, #fff)" }}>
                  A
                </div>
                <p style={{ margin: 0 }}>{/* keep spacing */}ArthikMarg</p>
              </div>

              <div className="flex items-center gap-2">
                {/* theme toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleTheme && toggleTheme(); }}
                  title={`Switch theme${theme ? ` (current: ${theme})` : ""}`}
                  className="p-1 rounded hover:opacity-90"
                  aria-label="Toggle theme"
                  style={{ color: "var(--text-default)" }}
                >
                  <SunMoon size={18} />
                </button>

                <ChevronsUpDown size={20} style={{ color: isProfileOpen ? (isProfileOpen ? "var(--on-primary, #fff)" : "var(--text-default)") : "var(--text-default)" }} />
              </div>
            </div>

            {isProfileOpen && (
              <ul className="mt-1 space-y-1">
                <li className="pl-4 pr-2 py-2 hover:bg-opacity-10 rounded flex items-center gap-3 cursor-pointer" style={{ color: "var(--text-default)" }}>
                  <User size={16} /> My Profile
                </li>
                <li className="pl-4 pr-2 py-2 hover:bg-opacity-10 rounded flex items-center gap-3 cursor-pointer" style={{ color: "var(--text-default)" }}>
                  <UserPlus size={16} /> Create New Profile
                </li>
              </ul>
            )}
          </div>
        )}

        {/* ——— BUSINESS ——— */}
        {sidebarOpen && <p className="text-sm font-semibold mb-2 px-1" style={{ color: "var(--text-default)" }}>Business</p>}

        <ul className="space-y-1 px-1">
          <SidebarItem label="Dashboard" icon={<LayoutDashboard size={ICON_SIZE} />} id="dashboard" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Parties" icon={<Users size={ICON_SIZE} />} id="parties" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Inventory" icon={<Boxes size={ICON_SIZE} />} id="inventory" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />

          {/* Sales */}
          <li>
            <Dropdown label="Sales" icon={<Receipt size={ICON_SIZE} />} open={openSales} setOpen={setOpenSales} sidebarOpen={sidebarOpen} itemStyle={itemStyle}>
              <DropItem label="Quotation" id="quotation" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Sales Invoice" id="sales-invoice" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Payment In" id="payment-in" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Sales Return" id="sales-return" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
            </Dropdown>
          </li>

          {/* Purchase */}
          <li>
            <Dropdown label="Purchase" icon={<ShoppingCart size={ICON_SIZE} />} open={openPurchase} setOpen={setOpenPurchase} sidebarOpen={sidebarOpen} itemStyle={itemStyle}>
              <DropItem label="Purchase Bills" id="purchase-bills" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Payment Out" id="payment-out" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Purchase Return" id="purchase-return" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
            </Dropdown>
          </li>

          <SidebarItem label="Expense" icon={<Package size={ICON_SIZE} />} id="expense" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Other Income" icon={<Wallet size={ICON_SIZE} />} id="other-income" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Manage Accounts" icon={<Building size={ICON_SIZE} />} id="accounts" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
        </ul>

        {/* ——— MANAGEMENT ——— */}
        {sidebarOpen && <p className="text-sm font-semibold mt-6 mb-2 px-1" style={{ color: "var(--text-default)" }}>Management</p>}

        <ul className="space-y-1 px-1">
          <SidebarItem label="Reports" icon={<BarChart2 size={ICON_SIZE} />} id="reports" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Manage Staffs" icon={<Users2 size={ICON_SIZE} />} id="manage-staffs" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />

          <li>
            <Dropdown label="Import Data" icon={<FileUp size={ICON_SIZE} />} open={openImport} setOpen={setOpenImport} sidebarOpen={sidebarOpen} itemStyle={itemStyle}>
              <DropItem label="Import Parties" id="import-parties" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Import Items" id="import-items" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
            </Dropdown>
          </li>

          <li>
            <Dropdown label="Business Tools" icon={<Wrench size={ICON_SIZE} />} open={openBusinessTools} setOpen={setOpenBusinessTools} sidebarOpen={sidebarOpen} itemStyle={itemStyle}>
              <DropItem label="Business Cards" id="business-cards" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Greeting Card" id="greeting-card" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Reminders" id="reminders" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Bill Gallery" id="bill-gallery" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
              <DropItem label="Notebook" id="notebook" active={activePage} setActive={handleSetActive} itemStyle={itemStyle} />
            </Dropdown>
          </li>

          {/* ——— OTHERS ——— */}
          {sidebarOpen && <p className="text-sm font-semibold mt-6 mb-2 px-1" style={{ color: "var(--text-default)" }}>Others</p>}
          <SidebarItem label="Help & Support" icon={<LifeBuoy size={ICON_SIZE} />} id="help-support" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Tutorials" icon={<BookOpen size={ICON_SIZE} />} id="tutorials" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="What's New" icon={<Sparkles size={ICON_SIZE} />} id="whats-new" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
          <SidebarItem label="Settings" icon={<Settings size={ICON_SIZE} />} id="settings" active={activePage} setActive={handleSetActive} open={sidebarOpen} itemStyle={itemStyle} />
        </ul>
      </div>
    </>
  );
}

// Small helper components

function SidebarItem({ label, icon, active, id, setActive, open, itemStyle }) {
  const isActive = active === id;
  return (
    <li
      onClick={() => id && setActive(id)}
      className={`flex items-center gap-3 p-2 rounded cursor-pointer text-lg transition ${!open ? "justify-center" : ""}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") setActive(id);
      }}
      style={itemStyle(isActive)}
    >
      {/* icons use currentColor so they'll inherit style color */}
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      {open && <span>{label}</span>}
    </li>
  );
}

function Dropdown({ label, icon, open, setOpen, sidebarOpen, children, itemStyle }) {
  if (!sidebarOpen) return null;

  const isActive = open;
  return (
    <>
      <div
        className="flex items-center justify-between p-2 rounded cursor-pointer text-lg transition"
        onClick={() => setOpen(!open)}
        role="button"
        aria-expanded={open}
        style={itemStyle(isActive)}
      >
        <div className="flex items-center gap-3">
          <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
          <span>{label}</span>
        </div>
        <ChevronRight size={20} style={{ color: itemStyle(isActive).color }} className={`${open ? "rotate-90" : ""} transition`} />
      </div>

      <ul className={`ml-8 mt-1 space-y-1 overflow-hidden transition ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
        {children}
      </ul>
    </>
  );
}

function DropItem({ label, id, active, setActive, itemStyle }) {
  const isActive = active === id;
  return (
    <li
      onClick={() => id && setActive(id)}
      className="p-2 text-base rounded cursor-pointer transition"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") setActive(id);
      }}
      style={itemStyle(isActive)}
    >
      {label}
    </li>
  );
}
