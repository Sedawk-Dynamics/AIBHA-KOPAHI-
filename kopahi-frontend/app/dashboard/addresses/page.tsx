"use client";
import Link from "next/link";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";

/* ============================================================
   CUSTOMER ADDRESSES
   File: app/dashboard/addresses/page.tsx
============================================================ */

type Address = {
  id: number;
  label: "Home" | "Work" | "Other";
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, label: "Home", name: "Rahul Sharma", line1: "42, Gandhi Nagar", line2: "Near MG Road Metro Station", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "+91 98765 43210", isDefault: true },
    { id: 2, label: "Work", name: "Rahul Sharma", line1: "Tower B, Phoenix Marketcity", line2: "Whitefield Main Road", city: "Bengaluru", state: "Karnataka", pincode: "560066", phone: "+91 98765 43210", isDefault: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const setAsDefault = (id: number) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const removeAddress = (id: number) => {
    if (confirm("Delete this address?")) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const labelStyles: Record<string, string> = {
    Home: "bg-green-50 text-green-700",
    Work: "bg-blue-50 text-blue-700",
    Other: "bg-gray-100 text-gray-700",
  };

  return (
    <DashboardShell role="Customer" userName="Rahul Sharma" userEmail="rahul@example.com">
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">Addresses</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Saved Addresses</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage where your orders get delivered.</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="bg-green-700 hover:bg-green-800 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 text-sm whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add new address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No saved addresses</h2>
          <p className="text-sm text-gray-500 mb-6">Add an address to make checkout faster.</p>
          <button onClick={() => setShowForm(true)} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Add address</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {addresses.map((a) => (
            <div key={a.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 md:p-6 transition-all ${a.isDefault ? "border-green-500" : "border-gray-100"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${labelStyles[a.label]}`}>{a.label}</span>
                  {a.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-700 text-white">Default</span>
                  )}
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" aria-label="More options">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
                </button>
              </div>

              <p className="font-bold text-gray-900">{a.name}</p>
              <p className="text-sm text-gray-700 mt-1">{a.line1}</p>
              {a.line2 && <p className="text-sm text-gray-700">{a.line2}</p>}
              <p className="text-sm text-gray-700">{a.city}, {a.state} {a.pincode}</p>
              <p className="text-sm text-gray-500 mt-2">📞 {a.phone}</p>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => { setEditingId(a.id); setShowForm(true); }} className="text-xs font-medium px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">Edit</button>
                {!a.isDefault && (
                  <button onClick={() => setAsDefault(a.id)} className="text-xs font-medium px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors">Set as default</button>
                )}
                <button onClick={() => removeAddress(a.id)} className="text-xs font-medium px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{editingId ? "Edit Address" : "Add New Address"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="p-5 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Label</label>
                <div className="flex gap-2 flex-wrap">
                  {["Home", "Work", "Other"].map((l) => (
                    <button key={l} type="button" className="px-4 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:border-green-600 hover:bg-green-50 transition-colors">{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" placeholder="Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone Number</label>
                <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Address Line 1</label>
                <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" placeholder="House no, building, street" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Address Line 2 <span className="text-gray-400 font-normal">(optional)</span></label>
                <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" placeholder="Landmark, area" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">City</label>
                  <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Pincode</label>
                  <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">State</label>
                <input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-2 focus:ring-green-500" />
                <span className="text-sm text-gray-700">Make this my default address</span>
              </label>
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">Save address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}