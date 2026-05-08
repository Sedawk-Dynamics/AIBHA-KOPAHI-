// TODO: This page currently displays mock data. Wire to real APIs (PATCH /api/auth/me) in a future task.
import { useState } from "react";
import DashboardShell, { PageHeader } from "../../components/DashboardShell";

export default function AdminProfile() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@kopahi.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [role] = useState("Super Admin");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="My Profile"
        desc="Manage your personal information and account preferences"
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Profile" }]}
      />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-3xl font-bold mb-4">
            A
          </div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500 mb-4">{role}</p>
          <button type="button" className="text-sm font-medium text-green-700 hover:text-green-800">
            Change avatar
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Role</label>
            <input
              value={role}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            {saved && <span className="text-sm text-green-700 font-medium">✓ Saved</span>}
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
