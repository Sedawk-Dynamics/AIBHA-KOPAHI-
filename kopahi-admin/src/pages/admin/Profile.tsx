import { useEffect, useState } from "react";
import DashboardShell, { PageHeader } from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { getMe, updateProfile, changePassword } from "../../lib/resources/profile";
import { ApiError } from "../../lib/api";
import type { ApiUser } from "../../lib/types";

export default function AdminProfile() {
  const { refresh } = useAuth();
  const [me, setMe] = useState<ApiUser | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Password section state.
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    getMe()
      .then((u) => {
        setMe(u);
        setForm({ name: u.name, phone: u.phone ?? "" });
      })
      .catch((err: unknown) =>
        setMessage({
          kind: "err",
          text: err instanceof ApiError ? err.message : "Could not load profile",
        })
      );
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateProfile({ name: form.name, phone: form.phone });
      setMe(updated);
      await refresh();
      setMessage({ kind: "ok", text: "Profile updated." });
    } catch (err) {
      setMessage({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Could not save changes",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    if (pw.next !== pw.confirm) {
      setPwMessage({ kind: "err", text: "New password and confirmation don't match." });
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      setPwMessage({ kind: "ok", text: "Password updated." });
    } catch (err) {
      setPwMessage({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Could not change password",
      });
    } finally {
      setPwSaving(false);
    }
  };

  const initial = (me?.name?.[0] ?? "A").toUpperCase();
  const roleLabel = me?.role === "admin" ? "Administrator" : me?.role === "vendor" ? "Vendor" : "Customer";

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="My Profile"
        desc="Manage your personal information and account preferences"
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {initial}
          </div>
          <p className="font-semibold text-gray-900">{me?.name ?? "—"}</p>
          <p className="text-xs text-gray-500 mb-4">{roleLabel}</p>
          {me?.email && <p className="text-xs text-gray-400">{me.email}</p>}
        </div>

        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
            <input
              value={me?.email ?? ""}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email changes are not yet supported.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Role</label>
            <input
              value={roleLabel}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            {message && (
              <span
                className={`text-sm font-medium ${
                  message.kind === "ok" ? "text-green-700" : "text-red-600"
                }`}
              >
                {message.kind === "ok" ? "✓ " : ""}{message.text}
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="bg-green-700 hover:bg-green-800 disabled:bg-green-700/60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      <form
        onSubmit={handlePasswordChange}
        className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
      >
        <h2 className="font-semibold text-gray-900">Change password</h2>
        <p className="text-xs text-gray-500">12+ characters, with upper, lower, digit, and symbol.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Current</label>
            <input
              type="password"
              autoComplete="current-password"
              value={pw.current}
              onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">New</label>
            <input
              type="password"
              autoComplete="new-password"
              value={pw.next}
              onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Confirm new</label>
            <input
              type="password"
              autoComplete="new-password"
              value={pw.confirm}
              onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          {pwMessage && (
            <span
              className={`text-sm font-medium ${
                pwMessage.kind === "ok" ? "text-green-700" : "text-red-600"
              }`}
            >
              {pwMessage.kind === "ok" ? "✓ " : ""}{pwMessage.text}
            </span>
          )}
          <button
            type="submit"
            disabled={pwSaving || !pw.current || !pw.next || !pw.confirm}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-700/60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
          >
            {pwSaving ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
