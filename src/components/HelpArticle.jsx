// src/components/HelpArticle.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Simple FAQ content for each help slug.
 * Added sections: party, inventory, reports, subscription, staff-management, bank-accounts, invoice
 * Replaced "Karobar" with "ArthikMarg"
 */
const FAQ_CONTENT = {
  general: [
    {
      q: "What is Arthik-marg and who can use the App?",
      a: "ArthikMarg is a bookkeeping and business management app aimed at small and medium businesses. Anyone who wants to manage sales, purchases, inventory, and simple accounting can use it."
    },
    {
      q: "Do I need to have accounting knowledge to use ArthikMarg?",
      a: "No. ArthikMarg is designed for business owners with minimal accounting knowledge — it uses friendly terms and guided flows."
    },
    {
      q: "How can I start using the ArthikMarg app?",
      a: "Sign up using an email/phone, follow the onboarding steps to add your business details and start adding items/customers/suppliers."
    },
    {
      q: "What documents do I need to start using ArthikMarg?",
      a: "You generally need basic business info: trade licence or registration (if any), bank details, and invoices/receipts for opening balances."
    },
    {
      q: "Is ArthikMarg App free to use?",
      a: "ArthikMarg offers a free tier with essential features. Premium plans unlock advanced reporting and multi-user features."
    },
    {
      q: "Is my data safe with the ArthikMarg App?",
      a: "Yes — we use secure cloud storage, encrypted connections (HTTPS) and strict access controls to keep your data safe."
    },
    {
      q: "Is ArthikMarg suitable for businesses that are just starting?",
      a: "Absolutely. ArthikMarg is made to help new businesses manage operations without complex accounting knowledge."
    },
    {
      q: "Is ArthikMarg available on mobile and desktop?",
      a: "ArthikMarg has a responsive web app and dedicated mobile apps (if you have them in your distribution). The web app works on both desktop and mobile browsers."
    }
  ],

  party: [
    {
      q: "What is a Party in ArthikMarg?",
      a: "Party refers to your customers and suppliers. You can add, edit, and manage all people or businesses you buy from or sell to."
    },
    {
      q: "How do I add a new Party?",
      a: "Go to Party → Add Party → Enter details such as name, number, address, opening balance, and save the record."
    },
    {
      q: "What is Opening Balance for a Party?",
      a: "Opening balance shows how much the party owes you (Receivable) or how much you owe them (Payable) when you start using the app."
    },
    {
      q: "How do I check a Party's Ledger?",
      a: "Open the Party list → select a Party → you will see all transactions including sales, purchases, payments, and receipts."
    },
    {
      q: "How do I know if a Party is Debit or Credit?",
      a: "If the party owes you money, it is Debit (Receivable). If you owe money to the party, it is Credit (Payable)."
    },
    {
      q: "Can I edit or delete a Party?",
      a: "Yes. Open the Party profile, click Edit to update details. Delete is allowed only if no linked transactions exist."
    },
    {
      q: "What is Party Statement?",
      a: "Party Statement shows overall balance, total transactions, and payments for any party over a period of time."
    }
  ],

  inventory: [
    {
      q: "How can ArthikMarg help me manage my inventory?",
      a: "ArthikMarg lets you add items with SKU, unit, purchase price, selling price and track stock levels. You can record purchases, sales, stock adjustments and view item-wise movement and valuation."
    },
    {
      q: "Can I categorize my inventory items?",
      a: "Yes — you can create categories or groups for items (for example: Raw Materials, Finished Goods). Categories make it easier to filter, report and run stock valuation by group."
    },
    {
      q: "How do I set opening stock for items?",
      a: "When adding or importing items, provide the opening quantity and opening value. This ensures accurate stock balance and valuation from day one."
    },
    {
      q: "What stock valuation methods are supported?",
      a: "ArthikMarg supports common valuation approaches via reports (e.g., average cost). Check the Inventory reports to see valuation and cost of goods sold summaries."
    },
    {
      q: "Can I do stock adjustments or count entries?",
      a: "Yes. Use Stock Adjustment to correct quantities after physical counts or to record losses, damages, or other adjustments."
    },
    {
      q: "Is there a low-stock alert?",
      a: "You can set reorder levels per item. Reports and the item list will highlight items below their reorder level so you can restock on time."
    }
  ],

  reports: [
    {
      q: "How can I track my business performance with ArthikMarg?",
      a: "ArthikMarg provides dashboards and detailed reports such as sales, purchases, stock movement, profit and loss, and outstanding balances to help you monitor your business performance."
    },
    {
      q: "What kind of reports can I generate with ArthikMarg?",
      a: "You can generate sales reports, purchase reports, party ledger, stock summary, stock valuation, expense reports, and financial statements depending on your business needs."
    },
    {
      q: "How does ArthikMarg help with financial planning?",
      a: "Reports like profit & loss, outstanding receivables/payables, stock valuation and expense summaries help you plan cash flow, manage credit and forecast profitability."
    },
    {
      q: "Can I export reports from ArthikMarg?",
      a: "Yes — most reports can be exported as PDF or Excel for printing, sharing or external analysis."
    }
  ],

  subscription: [
    {
      q: "What are the subscription plans available?",
      a: "ArthikMarg offers a free basic plan and paid tiers that unlock features like multi-user access, advanced reports, and priority support. Check the Subscription page for current pricing and features."
    },
    {
      q: "How do I upgrade or downgrade my plan?",
      a: "Go to Settings → Subscription, choose the plan you want and follow the on-screen instructions to upgrade or downgrade. Billing changes will be applied immediately or at the next billing cycle depending on your selection."
    },
    {
      q: "Can I cancel my subscription?",
      a: "Yes — you can cancel from the Subscription page. Cancellation policies vary by plan; your access may continue until the end of the paid period."
    },
    {
      q: "What payment methods are supported?",
      a: "ArthikMarg supports common online payment methods (cards, bank transfers where available). Payment options may vary by region."
    }
  ],

  "staff-management": [
    {
      q: "How do I add staff members?",
      a: "Go to Settings → Staff or Staff Management → Add Staff. Enter name, email/phone and assign roles or permissions before inviting them."
    },
    {
      q: "What roles and permissions can I set?",
      a: "You can assign roles like Admin, Manager, or Viewer with fine-grained permissions for invoicing, inventory, reports, and settings to control what each staff can do."
    },
    {
      q: "Can I remove or edit staff permissions?",
      a: "Yes — open Staff Management, select a staff member and choose Edit to update permissions or remove access."
    },
    {
      q: "Is there an audit of staff actions?",
      a: "ArthikMarg keeps basic activity logs for important actions by staff (depending on plan). Check the activity or audit log section for your account."
    }
  ],

  "bank-accounts": [
    {
      q: "How do I add a bank or cash account?",
      a: "Go to Settings → Bank Accounts → Add Account. Provide the account name, type (bank or cash), and optional bank details to track transactions."
    },
    {
      q: "Can I link bank statements automatically?",
      a: "Automatic bank linking depends on your region and plan. If available, enable bank feeds in the Bank Accounts section and follow the secure setup instructions."
    },
    {
      q: "How do I record bank transfers?",
      a: "Use the transfer feature to move funds between your accounts. This records the debit and credit entries and keeps balances accurate."
    },
    {
      q: "Can I reconcile bank statements?",
      a: "Yes — use the reconciliation feature to match your recorded transactions with bank statements and mark discrepancies for adjustment."
    }
  ],

  invoice: [
    {
      q: "How do I create an invoice?",
      a: "Go to Sales → Create Invoice, choose the customer (Party), add line items, taxes, and save or send the invoice via email."
    },
    {
      q: "Can I customize invoice templates?",
      a: "Yes — you can edit invoice templates to include your logo, company details, and adjust the layout or terms from the Invoice settings."
    },
    {
      q: "How do I record invoice payments?",
      a: "Open the invoice and click 'Receive Payment' to record a payment against the invoice. You can also record partial payments and apply them to multiple invoices."
    },
    {
      q: "Can I track unpaid or overdue invoices?",
      a: "Yes — use the outstanding reports or the invoice list filters to view unpaid and overdue invoices and take action like sending reminders."
    }
  ],

  default: [
    { q: "No articles found", a: "We don't have content for this topic yet. Try another help topic or contact support." }
  ]
};

/** helper to create stable id for a question text */
function questionId(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function HelpArticle() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const content = FAQ_CONTENT[slug] || FAQ_CONTENT.default;

  // keep track of which accordion items are open (by index)
  const [openIndex, setOpenIndex] = useState(-1);

  // when URL or slug changes, check for ?open=... and open the right item
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openParam = params.get("open");

    if (!openParam) {
      setOpenIndex(-1);
      return;
    }

    // find index matching openParam
    const foundIndex = content.findIndex((item) => questionId(item.q) === openParam);
    if (foundIndex !== -1) {
      setOpenIndex(foundIndex);
      // scroll the opened item into view slightly for UX
      // add a small timeout to allow render
      setTimeout(() => {
        const el = document.getElementById(`faq-item-${foundIndex}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      // param invalid for this slug -> clear it (keep user on same page)
      params.delete("open");
      navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
      setOpenIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, slug, content, navigate]);

  const toggle = (i) => {
    setOpenIndex((prev) => {
      const next = prev === i ? -1 : i;

      // keep the URL in sync: add ?open=<id> when opening, remove when closing
      const params = new URLSearchParams(location.search);
      if (next === -1) {
        params.delete("open");
      } else {
        const id = questionId(content[next].q);
        params.set("open", id);
      }
      navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });

      return next;
    });
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", padding: 28 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 12px" }}>
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "none",
            color: "#111827",
            cursor: "pointer",
            padding: 6,
            marginBottom: 8,
            fontSize: 16
          }}
          aria-label="Go back"
        >
          <ChevronLeft size={18} /> Back
        </button>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "6px 0 12px", color: "#0f172a" }}>
          {slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Help"}
        </h1>

        {/* Accordion list */}
        <div style={{ marginTop: 8 }}>
          {content.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                id={`faq-item-${idx}`}
                key={idx}
                style={{
                  borderRadius: 10,
                  border: "1px solid #eef2f6",
                  marginBottom: 12,
                  overflow: "hidden",
                  background: "#fff"
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(idx);
                    }
                  }}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "18px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#0f172a"
                  }}
                >
                  <span style={{ flex: 1 }}>{item.q}</span>
                  <span style={{ marginLeft: 12 }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "14px 20px 20px",
                      borderTop: "1px solid #f3f4f6",
                      color: "#4b5563",
                      lineHeight: 1.6,
                      fontSize: 15,
                      background: "#fff"
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
