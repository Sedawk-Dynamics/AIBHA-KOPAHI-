"use client";
import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
import DashboardShell from "../components/DashboardShell";

/* ============================================================
   ADMIN SETTINGS PAGE — FUTURE-PROOF
   File: app/settings/page.tsx
============================================================ */

type TabKey = "general" | "business" | "notifications" | "security" | "team" | "integrations" | "billing" | "appearance" | "audit";

const initialSettings = {
  // General
  platformName: "Kopahi",
  tagline: "Premium Agri Marketplace of North East India",
  supportEmail: "info@kopahi.com",
  phone: "+91 98765 43210",
  address: "Guwahati, Assam, India",
  currency: "INR",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  language: "en",

  // Business
  commission: "10",
  gst: "18",
  shippingCharge: "99",
  freeShippingAbove: "999",
  returnWindow: "7",
  minOrderValue: "199",
  codEnabled: true,
  prepaidDiscount: "2",

  // Notifications
  emailNewOrder: true,
  emailNewVendor: true,
  emailLowStock: false,
  emailRefundRequest: true,
  smsAlerts: false,
  pushNotifications: true,
  weeklyDigest: true,
  marketingEmails: false,

  // Security
  twoFactor: true,
  loginAlerts: true,
  autoApproveVendors: false,
  sessionTimeout: "30",
  passwordExpiry: "90",
  ipWhitelist: false,

  // Appearance
  brandColor: "#15803d",
  darkMode: false,
  compactMode: false,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [settings, setSettings] = useState(initialSettings);
  const [originalSettings, setOriginalSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const update = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: replace with real API call
    // await fetch("/api/settings", { method: "POST", body: JSON.stringify(settings) });
    setTimeout(() => {
      setOriginalSettings(settings);
      setSaving(false);
      setToast({ type: "success", message: "Settings saved successfully" });
    }, 900);
  };

  const handleDiscard = () => {
    setSettings(originalSettings);
    setToast({ type: "success", message: "Changes discarded" });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "general", label: "General", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "business", label: "Business", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { key: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { key: "security", label: "Security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { key: "team", label: "Team", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "integrations", label: "Integrations", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { key: "billing", label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { key: "appearance", label: "Appearance", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
    { key: "audit", label: "Audit Log", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  ];

  return (
    <DashboardShell role="Admin">
      {/* ========= HEADER ========= */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Settings</h1>
          <p className="text-gray-600 mt-1">Configure marketplace preferences, security, and business rules.</p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              Unsaved changes
            </span>
          )}
          <button onClick={handleDiscard} disabled={!hasChanges || saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Discard
          </button>
          <button onClick={handleSave} disabled={!hasChanges || saving} className="px-5 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:bg-green-700/50 disabled:cursor-not-allowed transition-colors shadow-sm inline-flex items-center gap-2">
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Save changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========= LAYOUT: TABS + CONTENT ========= */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Vertical Tabs */}
        <aside>
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 lg:sticky lg:top-24">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  activeTab === tab.key ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={tab.icon} />
                  </svg>
                  {tab.label}
                </span>
                {tab.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="space-y-6 min-w-0">
          {activeTab === "general" && <GeneralTab settings={settings} update={update} />}
          {activeTab === "business" && <BusinessTab settings={settings} update={update} />}
          {activeTab === "notifications" && <NotificationsTab settings={settings} update={update} />}
          {activeTab === "security" && <SecurityTab settings={settings} update={update} />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "appearance" && <AppearanceTab settings={settings} update={update} />}
          {activeTab === "audit" && <AuditTab />}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${toast.type === "success" ? "bg-white border-green-200" : "bg-white border-red-200"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={toast.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 pr-2">{toast.message}</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

/* ============ TAB: GENERAL ============ */
function GeneralTab({ settings, update }: any) {
  return (
    <Section title="General Settings" desc="Platform identity and contact details visible to your users.">
      <Field label="Platform Name" desc="Displayed across navigation, emails, and invoices.">
        <Input value={settings.platformName} onChange={(v) => update("platformName", v)} placeholder="Kopahi" />
      </Field>
      <Field label="Tagline" desc="A short description shown in the footer and meta tags.">
        <Input value={settings.tagline} onChange={(v) => update("tagline", v)} placeholder="Premium Agri Marketplace..." />
      </Field>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Support Email" desc="Customers reach you here.">
          <Input type="email" value={settings.supportEmail} onChange={(v) => update("supportEmail", v)} placeholder="info@kopahi.com" />
        </Field>
        <Field label="Phone Number" desc="Optional public contact number.">
          <Input type="tel" value={settings.phone} onChange={(v) => update("phone", v)} placeholder="+91 98765 43210" />
        </Field>
      </div>
      <Field label="Business Address" desc="Used on invoices and in legal documents.">
        <Input value={settings.address} onChange={(v) => update("address", v)} placeholder="Guwahati, Assam, India" />
      </Field>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Default Currency" desc="All prices on the platform use this currency.">
          <Select value={settings.currency} onChange={(v) => update("currency", v)} options={[
            { value: "INR", label: "INR — Indian Rupee (₹)" },
            { value: "USD", label: "USD — US Dollar ($)" },
            { value: "EUR", label: "EUR — Euro (€)" },
            { value: "GBP", label: "GBP — Pound Sterling (£)" },
          ]} />
        </Field>
        <Field label="Timezone" desc="Used for reports and scheduled tasks.">
          <Select value={settings.timezone} onChange={(v) => update("timezone", v)} options={[
            { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
            { value: "UTC", label: "UTC" },
            { value: "America/New_York", label: "America/New York (EST)" },
            { value: "Europe/London", label: "Europe/London (GMT)" },
          ]} />
        </Field>
        <Field label="Date Format" desc="How dates appear across the platform.">
          <Select value={settings.dateFormat} onChange={(v) => update("dateFormat", v)} options={[
            { value: "DD/MM/YYYY", label: "DD/MM/YYYY (27/04/2026)" },
            { value: "MM/DD/YYYY", label: "MM/DD/YYYY (04/27/2026)" },
            { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2026-04-27)" },
          ]} />
        </Field>
        <Field label="Language" desc="Default UI language for new users.">
          <Select value={settings.language} onChange={(v) => update("language", v)} options={[
            { value: "en", label: "English" },
            { value: "hi", label: "हिन्दी (Hindi)" },
            { value: "as", label: "অসমীয়া (Assamese)" },
            { value: "bn", label: "বাংলা (Bengali)" },
          ]} />
        </Field>
      </div>
    </Section>
  );
}

/* ============ TAB: BUSINESS ============ */
function BusinessTab({ settings, update }: any) {
  return (
    <Section title="Business Rules" desc="Commission, taxes, shipping and payment policies.">
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Commission Rate" desc="Percentage charged to vendors per sale." suffix="%">
          <Input type="number" value={settings.commission} onChange={(v) => update("commission", v)} placeholder="10" />
        </Field>
        <Field label="GST Rate" desc="Applied to taxable products." suffix="%">
          <Input type="number" value={settings.gst} onChange={(v) => update("gst", v)} placeholder="18" />
        </Field>
        <Field label="Shipping Charge" desc="Default flat-rate shipping fee." prefix="₹">
          <Input type="number" value={settings.shippingCharge} onChange={(v) => update("shippingCharge", v)} placeholder="99" />
        </Field>
        <Field label="Free Shipping Above" desc="Order value to unlock free shipping." prefix="₹">
          <Input type="number" value={settings.freeShippingAbove} onChange={(v) => update("freeShippingAbove", v)} placeholder="999" />
        </Field>
        <Field label="Minimum Order Value" desc="Smallest order amount allowed at checkout." prefix="₹">
          <Input type="number" value={settings.minOrderValue} onChange={(v) => update("minOrderValue", v)} placeholder="199" />
        </Field>
        <Field label="Return Window" desc="Days a customer has to request a return." suffix="days">
          <Input type="number" value={settings.returnWindow} onChange={(v) => update("returnWindow", v)} placeholder="7" />
        </Field>
      </div>

      <SettingGroup title="Payment options">
        <Toggle label="Cash on Delivery" desc="Allow customers to pay on delivery." checked={settings.codEnabled} onChange={(v) => update("codEnabled", v)} />
      </SettingGroup>

      <Field label="Prepaid Discount" desc="Extra discount % for prepaid orders to encourage online payment." suffix="%">
        <Input type="number" value={settings.prepaidDiscount} onChange={(v) => update("prepaidDiscount", v)} placeholder="2" />
      </Field>
    </Section>
  );
}

/* ============ TAB: NOTIFICATIONS ============ */
function NotificationsTab({ settings, update }: any) {
  return (
    <Section title="Notification Preferences" desc="Choose how and when you and your team get notified.">
      <SettingGroup title="Email">
        <Toggle label="New order received" desc="Email each time a customer checks out." checked={settings.emailNewOrder} onChange={(v) => update("emailNewOrder", v)} />
        <Toggle label="New vendor signup" desc="Notify when a vendor registers for review." checked={settings.emailNewVendor} onChange={(v) => update("emailNewVendor", v)} />
        <Toggle label="Low stock alerts" desc="Email when inventory drops below threshold." checked={settings.emailLowStock} onChange={(v) => update("emailLowStock", v)} />
        <Toggle label="Refund requests" desc="Notify when a customer requests a refund." checked={settings.emailRefundRequest} onChange={(v) => update("emailRefundRequest", v)} />
        <Toggle label="Weekly digest" desc="Summary of platform activity every Monday." checked={settings.weeklyDigest} onChange={(v) => update("weeklyDigest", v)} />
      </SettingGroup>
      <SettingGroup title="Mobile">
        <Toggle label="SMS alerts" desc="Critical alerts via text message." checked={settings.smsAlerts} onChange={(v) => update("smsAlerts", v)} />
        <Toggle label="Push notifications" desc="In-app push when you have admin app installed." checked={settings.pushNotifications} onChange={(v) => update("pushNotifications", v)} />
      </SettingGroup>
      <SettingGroup title="Marketing">
        <Toggle label="Product updates" desc="Tips, new features, and case studies from the Kopahi team." checked={settings.marketingEmails} onChange={(v) => update("marketingEmails", v)} />
      </SettingGroup>
    </Section>
  );
}

/* ============ TAB: SECURITY ============ */
function SecurityTab({ settings, update }: any) {
  return (
    <>
      <Section title="Security & Access" desc="Account protection, sessions, and approval rules.">
        <SettingGroup title="Authentication">
          <Toggle label="Two-factor authentication" desc="Required for all admin sign-ins. Strongly recommended." checked={settings.twoFactor} onChange={(v) => update("twoFactor", v)} />
          <Toggle label="Login alerts" desc="Email notification on every admin login from a new device." checked={settings.loginAlerts} onChange={(v) => update("loginAlerts", v)} />
          <Toggle label="IP allowlist" desc="Only allow admin logins from specific IP addresses." checked={settings.ipWhitelist} onChange={(v) => update("ipWhitelist", v)} />
        </SettingGroup>
        <SettingGroup title="Sessions">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Session timeout" desc="Auto-logout after inactivity." suffix="min">
              <Input type="number" value={settings.sessionTimeout} onChange={(v) => update("sessionTimeout", v)} placeholder="30" />
            </Field>
            <Field label="Password expiry" desc="Force password reset every N days." suffix="days">
              <Input type="number" value={settings.passwordExpiry} onChange={(v) => update("passwordExpiry", v)} placeholder="90" />
            </Field>
          </div>
        </SettingGroup>
        <SettingGroup title="Vendor approval">
          <Toggle label="Auto-approve vendors" desc="Skip manual review and let vendors list immediately. Not recommended." checked={settings.autoApproveVendors} onChange={(v) => update("autoApproveVendors", v)} warning />
        </SettingGroup>
      </Section>

      <Section title="API Keys" desc="For integrations with external systems.">
        <div className="space-y-3">
          <ApiKeyRow label="Production" keyValue="sk_live_••••••••••••••••wXyZ" lastUsed="2 hours ago" />
          <ApiKeyRow label="Test" keyValue="sk_test_••••••••••••••••aBc1" lastUsed="3 days ago" />
        </div>
        <button className="mt-4 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Generate new API key
        </button>
      </Section>

      <div className="bg-white rounded-2xl border border-red-200 shadow-sm">
        <div className="p-6 border-b border-red-100">
          <h2 className="text-xl font-bold text-red-900 tracking-tight">Danger Zone</h2>
          <p className="text-sm text-red-600 mt-1">These actions are irreversible. Proceed with caution.</p>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-4 p-3 hover:bg-red-50 rounded-lg transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900">Revoke all sessions</p>
              <p className="text-xs text-gray-500">Sign out all admins, vendors, and customers immediately.</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0">Revoke</button>
          </div>
          <div className="flex items-center justify-between gap-4 p-3 hover:bg-red-50 rounded-lg transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900">Reset all API keys</p>
              <p className="text-xs text-gray-500">Existing integrations will stop working until updated.</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0">Reset</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ TAB: TEAM ============ */
function TeamTab() {
  const team = [
    { name: "Admin User", email: "admin@kopahi.com", role: "Super Admin", status: "Active", avatar: "A", color: "from-purple-500 to-purple-700" },
    { name: "Anjali Mehta", email: "anjali@kopahi.com", role: "Operations Manager", status: "Active", avatar: "A", color: "from-blue-500 to-blue-700" },
    { name: "Karan Nair", email: "karan@kopahi.com", role: "Support Lead", status: "Active", avatar: "K", color: "from-green-500 to-green-700" },
    { name: "Pooja Banerjee", email: "pooja@kopahi.com", role: "Vendor Coordinator", status: "Invited", avatar: "P", color: "from-amber-500 to-amber-700" },
  ];

  return (
    <Section
      title="Team Members"
      desc="Manage who has access to the admin panel and their permissions."
      action={
        <button className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Invite member
        </button>
      }
    >
      <div className="space-y-2">
        {team.map((m) => (
          <div key={m.email} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {m.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                <p className="text-xs text-gray-500 truncate">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full hidden sm:inline">{m.role}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.status === "Active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                {m.status}
              </span>
              <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" aria-label="More options">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============ TAB: INTEGRATIONS ============ */
function IntegrationsTab() {
  const integrations = [
    { name: "Razorpay", desc: "Accept payments via UPI, cards, and wallets.", connected: true, color: "bg-blue-100 text-blue-700", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { name: "BlueDart", desc: "Pan-India shipping and tracking.", connected: true, color: "bg-amber-100 text-amber-700", icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "Mailchimp", desc: "Email marketing and customer campaigns.", connected: false, color: "bg-yellow-100 text-yellow-700", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: "Twilio SMS", desc: "Order updates and OTP delivery.", connected: false, color: "bg-red-100 text-red-700", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
    { name: "Google Analytics", desc: "Traffic and conversion tracking.", connected: true, color: "bg-orange-100 text-orange-700", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" },
    { name: "Shiprocket", desc: "Multi-courier shipping aggregator.", connected: false, color: "bg-purple-100 text-purple-700", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  ];

  return (
    <Section title="Integrations" desc="Connect Kopahi with third-party services and tools.">
      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map((i) => (
          <div key={i.name} className="border border-gray-100 rounded-xl p-5 hover:border-green-200 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={i.icon} />
                </svg>
              </div>
              {i.connected && (
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Connected
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{i.name}</p>
            <p className="text-xs text-gray-500 mb-4">{i.desc}</p>
            <button className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
              i.connected
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}>
              {i.connected ? "Configure" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 text-center">
        <p className="text-sm font-semibold text-gray-900">Don't see what you need?</p>
        <p className="text-xs text-gray-600 mt-1 mb-3">Use webhooks or our REST API to build custom integrations.</p>
        <a href="#" className="text-sm font-medium text-green-700 hover:text-green-800">View developer docs →</a>
      </div>
    </Section>
  );
}

/* ============ TAB: BILLING ============ */
function BillingTab() {
  const invoices = [
    { id: "INV-2026-04", date: "01 Apr 2026", amount: "₹4,999", status: "Paid" },
    { id: "INV-2026-03", date: "01 Mar 2026", amount: "₹4,999", status: "Paid" },
    { id: "INV-2026-02", date: "01 Feb 2026", amount: "₹4,999", status: "Paid" },
    { id: "INV-2026-01", date: "01 Jan 2026", amount: "₹4,999", status: "Paid" },
  ];

  return (
    <>
      <Section title="Current Plan" desc="Your subscription details and usage.">
        <div className="bg-gradient-to-br from-green-700 to-green-900 text-white p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Business Plan</span>
                <p className="text-3xl font-bold mt-2">₹4,999<span className="text-sm font-normal text-green-200">/month</span></p>
                <p className="text-sm text-green-100 mt-1">Renews on 1 May 2026</p>
              </div>
              <button className="bg-white text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Upgrade plan
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 mt-4">
              <div>
                <p className="text-xs text-green-200">Vendors</p>
                <p className="text-lg font-bold">184 / 500</p>
              </div>
              <div>
                <p className="text-xs text-green-200">Products</p>
                <p className="text-lg font-bold">2.1K / 10K</p>
              </div>
              <div>
                <p className="text-xs text-green-200">Storage</p>
                <p className="text-lg font-bold">12 / 50 GB</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Payment Method" desc="The card we charge for your subscription.">
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 09/2028</p>
            </div>
          </div>
          <button className="text-sm font-medium text-green-700 hover:text-green-800">Update</button>
        </div>
      </Section>

      <Section title="Invoices" desc="Download past invoices for your records.">
        <div className="overflow-x-auto -mx-6 md:-mx-8">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-6 md:px-8 py-3 font-medium">Invoice</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-left px-6 py-3 font-medium">Amount</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="px-6 md:px-8 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 md:px-8 py-3 font-medium text-gray-900">{inv.id}</td>
                  <td className="px-6 py-3 text-gray-600">{inv.date}</td>
                  <td className="px-6 py-3 font-semibold text-gray-900">{inv.amount}</td>
                  <td className="px-6 py-3"><span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">{inv.status}</span></td>
                  <td className="px-6 md:px-8 py-3 text-right">
                    <button className="text-sm font-medium text-green-700 hover:text-green-800">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

/* ============ TAB: APPEARANCE ============ */
function AppearanceTab({ settings, update }: any) {
  return (
    <Section title="Appearance" desc="Customize how Kopahi looks for your team and customers.">
      <Field label="Brand Color" desc="Primary color used across buttons, links, and accents.">
        <div className="flex items-center gap-3">
          <input type="color" value={settings.brandColor} onChange={(e) => update("brandColor", e.target.value)} className="w-14 h-12 rounded-lg border border-gray-200 cursor-pointer" />
          <Input value={settings.brandColor} onChange={(v) => update("brandColor", v)} placeholder="#15803d" />
        </div>
      </Field>

      <Field label="Logo" desc="PNG or SVG, square format, max 2MB.">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">K</div>
          <div className="flex-1">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Upload new logo</button>
            <p className="text-xs text-gray-500 mt-2">Recommended: 256×256px, transparent background.</p>
          </div>
        </div>
      </Field>

      <Field label="Favicon" desc="Small icon shown in browser tabs.">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">K</div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Upload favicon</button>
        </div>
      </Field>

      <SettingGroup title="Display">
        <Toggle label="Dark mode for admin" desc="Use a darker color scheme in the admin panel." checked={settings.darkMode} onChange={(v) => update("darkMode", v)} />
        <Toggle label="Compact mode" desc="Tighter spacing and smaller fonts for power users." checked={settings.compactMode} onChange={(v) => update("compactMode", v)} />
      </SettingGroup>
    </Section>
  );
}

/* ============ TAB: AUDIT LOG ============ */
function AuditTab() {
  const events = [
    { actor: "Admin User", action: "Updated commission rate from 8% to 10%", time: "2 hours ago", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745" },
    { actor: "Anjali Mehta", action: "Approved vendor: Hills Organic Farm", time: "4 hours ago", icon: "M5 13l4 4L19 7" },
    { actor: "System", action: "Auto-disabled Lakadong Turmeric (out of stock)", time: "Yesterday", icon: "M13 16h-1v-4h-1m1-4h.01" },
    { actor: "Karan Nair", action: "Refunded ₹899 for order #KP-2839", time: "Yesterday", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { actor: "Admin User", action: "Enabled two-factor authentication", time: "2 days ago", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { actor: "Anjali Mehta", action: "Invited new team member: pooja@kopahi.com", time: "3 days ago", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" },
    { actor: "Admin User", action: "Reset API key (production)", time: "5 days ago", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
  ];

  return (
    <Section
      title="Audit Log"
      desc="Track every important action taken on the platform."
      action={
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      }
    >
      <div className="space-y-1">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={e.icon} /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900"><span className="font-semibold">{e.actor}</span> · {e.action}</p>
              <p className="text-xs text-gray-500 mt-0.5">{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============ FORM COMPONENTS ============ */
function Section({ title, desc, action, children }: { title: string; desc: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
        {action}
      </div>
      <div className="p-6 md:p-8 space-y-6">{children}</div>
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Field({ label, desc, children, prefix, suffix }: { label: string; desc?: string; children: ReactNode; prefix?: string; suffix?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1">{label}</label>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      {(prefix || suffix) ? (
        <div className="flex">
          {prefix && <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 font-medium">{prefix}</span>}
          <div className={`flex-1 ${prefix ? "[&>input]:rounded-l-none" : ""} ${suffix ? "[&>input]:rounded-r-none" : ""}`}>{children}</div>
          {suffix && <span className="inline-flex items-center px-3 bg-gray-50 border border-l-0 border-gray-200 rounded-r-lg text-sm text-gray-600 font-medium">{suffix}</span>}
        </div>
      ) : children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all cursor-pointer"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ label, desc, checked, onChange, warning }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void; warning?: boolean }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
          {label}
          {warning && checked && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Caution</span>
          )}
        </p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => { e.preventDefault(); onChange(!checked); }}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-green-100 mt-0.5 ${checked ? "bg-green-600" : "bg-gray-300"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </label>
  );
}

function ApiKeyRow({ label, keyValue, lastUsed }: { label: string; keyValue: string; lastUsed: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(keyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors gap-4 flex-wrap">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${label === "Production" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {label === "Production" ? "Live" : "Test"}
          </span>
        </div>
        <p className="text-xs text-gray-500 font-mono truncate">{keyValue}</p>
        <p className="text-xs text-gray-400 mt-1">Last used {lastUsed}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleCopy} className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <button className="text-xs font-medium px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">Revoke</button>
      </div>
    </div>
  );
}