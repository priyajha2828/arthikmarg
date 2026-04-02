// src/App.jsx (full)
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./components/Dashboard";
import AddSales from "./components/AddSales";
import AddPurchase from "./components/AddPurchase";
import QuickPOS from "./components/QuickPOS";
import CompleteProfile from "./components/CompleteProfile";
import PaymentInForm from "./components/PaymentIn";
import PaymentOutForm from "./components/PaymentOut";
import Quotation from "./components/Quotation";
import QuotationsPage from "./components/QuotationsPage";
import CreateQuotation from "./components/CreateQuotation"; // <-- added
import SaleInsights from "./components/SaleInsights";
import PurchaseInsights from "./components/PurchaseInsights";
import ExpenseInsights from "./components/ExpenseInsights";
import PurchaseReturn from "./components/PurchaseReturn";
import SalesReturn from "./components/SalesReturn";
import SalesInvoicePage from "./components/SalesInvoicePage";
import { PurchaseBillsPage } from "./components/PurchaseBillsPage";
import { ImportPartiesPage } from "./components/ImportPartiesPage";
import { ImportItemsPage } from "./components/ImportItemsPage";
import InventoryPage from "./components/InventoryPage";
import { PartiesPage } from "./components/PartiesPage";
import CashReportPage from "./components/CashReportPage";
import ReportsGallery from "./components/ReportsGallery";
import ReportsPage from "./components/ReportsPage";
import { OtherIncomePage } from "./components/OtherIncomePage";
import { ExpensePage } from "./components/ExpensePage";
import ManageStaffsPage from "./components/ManageStaffsPage";
import BusinessCardGenerator from "./components/BusinessCardGenerator.jsx";
import HelpSupport from "./components/HelpSupport";
import HelpArticle from "./components/HelpArticle";
import ManageAccountsPage from "./components/ManageAccountsPage";
import SettingsPage from "./components/SettingsPage";
import SupportMessages from "./components/SupportMessages";
import ContactSupport from "./components/ContactSupport";
import FeedbackModal from "./components/FeedbackModal";
import Tutorials from "./components/Tutorials"; 
import Reminders from "./components/Reminders";
import BillGallery from "./components/BillGallery";
import Notebook from "./components/Notebook";
import CreateNote from "./components/CreateNote";


export default function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Topbar
          onProfileClick={() => navigate("/complete-profile")}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-6 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-sales" element={<AddSales />} />
            <Route path="/add-purchase" element={<AddPurchase />} />
            <Route path="/quick-pos" element={<QuickPOS />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/payment-in" element={<PaymentInForm />} />
            <Route path="/payment-out" element={<PaymentOutForm />} />

            {/* Quotations */}
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/quotation" element={<QuotationsPage />} />
            <Route path="/quotation/create" element={<CreateQuotation />} />

            <Route path="/sale-insights" element={<SaleInsights />} />
            <Route path="/purchase-insights" element={<PurchaseInsights />} />
            <Route path="/expense-insights" element={<ExpenseInsights />} />

            <Route path="/sales-return" element={<SalesReturn />} />
            <Route path="/purchase-return" element={<PurchaseReturn />} />

            <Route path="/sales-invoice" element={<SalesInvoicePage />} />
            <Route path="/purchase-bills" element={<PurchaseBillsPage />} />
            <Route path="/import-parties" element={<ImportPartiesPage />} />
            <Route path="/import-items" element={<ImportItemsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/parties" element={<PartiesPage />} />

            <Route path="/cash-report/:accountId" element={<CashReportPage />} />
            <Route path="/cash-report" element={<CashReportPage />} />

            <Route path="/reports-gallery" element={<ReportsGallery />} />
            <Route path="/reports" element={<ReportsPage />} />

            <Route path="/other-income" element={<OtherIncomePage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/manage-staffs" element={<ManageStaffsPage />} />
            <Route path="/business-card" element={<BusinessCardGenerator />} />

            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/help/:slug" element={<HelpArticle />} />

            <Route path="/support/messages" element={<SupportMessages />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/feedback" element={<FeedbackModal />} />
            <Route path="/support/callback" element={<HelpSupport />} />
            <Route path="/tutorials" element={<Tutorials />} />
             <Route path="/reminders" element={<Reminders />} />
             <Route path="/bill-gallery" element={<BillGallery />} />
             <Route path="/notebook" element={<Notebook />} />
             <Route path="/create-note" element={<CreateNote />} />




            <Route
              path="/manage-accounts"
              element={<ManageAccountsPage sidebarOpen={sidebarOpen} />}
            />

            <Route path="/settings/*" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
