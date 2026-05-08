"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import DashboardShell from "../../components/DashboardShell";

/* ============================================================
   CUSTOMER ACCOUNT
   File: app/dashboard/account/page.tsx
============================================================ */

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    dob: "",
    gender: "",
  });
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsAlerts: true,
  });
  const [original, setOriginal] = useState({ profile, prefs });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const hasChanges = JSON.stringify({ profile, prefs }) !== JSON.stringify(original);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setOriginal({ profile, prefs });
      setSaving(false);
      setToast("Changes saved successfully");
    }, 800);
  };

  return (
    <DashboardShell role="Customer" userName="Rahul Sharma" userEmail="rahul@example.com">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-green-700">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Account</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Account</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Manage your profile, preferences, and security.</p>
      </div>

      {/* Loyalty banner */}
      <div className="mb-6 bg-gradient-to-br from-green-700 to-green-900 text-white p-5 md:p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-1">Loyalty Status</p>
            <p className="text-2xl md:text-3xl font-bold">1,245 points</p>
            <p className="text-sm text-green-100 mt-1">Worth ₹1,245 off your next order. 🎉</p>
          </div>
          <button className="bg-white text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">Redeem now</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 md:p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Personal Information</h2>
              <p className="text-xs text-gray-500 mt-1">Used on receipts and order communications.</p>
            </div>
            <div className="p-5 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Date of Birth <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Gender <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 cursor-pointer">
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 md:p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500 mt-1">Choose what we email or text you about.</p>
            </div>
            <div className="p-5 md:p-6 space-y-1">
              <Toggle label="Order updates" desc="Shipping, delivery, and refund notifications." checked={prefs.orderUpdates} onChange={(v) => setPrefs({ ...prefs, orderUpdates: v })} />
              <Toggle label="Promotions & sales" desc="Be the first to know about flash sales." checked={prefs.promotions} onChange={(v) => setPrefs({ ...prefs, promotions: v })} />
              <Toggle label="Newsletter" desc="Farmer stories and seasonal collections monthly." checked={prefs.newsletter} onChange={(v) => setPrefs({ ...prefs, newsletter: v })} />
              <Toggle label="SMS alerts" desc="Critical order updates via text." checked={prefs.smsAlerts} onChange={(v) => setPrefs({ ...prefs, smsAlerts: v })} />
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 md:p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Security</h2>
              <p className="text-xs text-gray-500 mt-1">Keep your account safe.</p>
            </div>
            <div className="p-5 md:p-6 space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Password</p>
                  <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                </div>
                <button className="text-sm font-medium text-green-700 hover:text-green-800">Change</button>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Two-factor authentication</p>
                  <p className="text-xs text-gray-500">Extra security via OTP</p>
                </div>
                <button className="text-sm font-medium text-green-700 hover:text-green-800">Enable</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Save action */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 lg:sticky lg:top-24">
            <h3 className="font-semibold text-gray-900 mb-1">Save changes</h3>
            <p className="text-xs text-gray-500 mb-4">{hasChanges ? "You have unsaved changes." : "Everything is up to date."}</p>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-700/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : "Save changes"}
            </button>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm">
            <div className="p-5 md:p-6 border-b border-red-100">
              <h2 className="font-semibold text-red-900">Danger Zone</h2>
              <p className="text-xs text-red-600 mt-1">These actions cannot be undone.</p>
            </div>
            <div className="p-5 md:p-6 space-y-2">
              <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors">Download my data</button>
              <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors">Delete my account</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border border-green-200 bg-white">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm font-medium text-gray-900 pr-2">{toast}</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
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