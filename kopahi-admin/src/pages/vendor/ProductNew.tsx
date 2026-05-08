import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";

export default function VendorProductNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "Tea",
    price: "",
    oldPrice: "",
    stock: "",
    sku: "",
    description: "",
    weight: "",
    status: "Draft",
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent, _status: "Draft" | "Active") => {
    e.preventDefault();
    setSaving(true);
    // TODO: replace with real API call
    setTimeout(() => {
      setSaving(false);
      navigate("/vendor/products");
    }, 800);
  };

  return (
    <DashboardShell role="Vendor" userName="Brahmaputra Tea Co." userEmail="vendor@kopahi.com">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link to="/vendor/products" className="hover:text-green-700">My Products</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">New</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Fill in the details to list a new product.</p>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Assam Tea Premium 250g" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 cursor-pointer">
                    <option>Tea</option>
                    <option>Honey</option>
                    <option>Rice</option>
                    <option>Spices</option>
                    <option>Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">SKU / Product Code</label>
                  <input value={form.sku} onChange={(e) => update("sku", e.target.value)} placeholder="e.g. ASM-TEA-001" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Tell customers about your product, sourcing, and benefits..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Pricing & Inventory</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Selling Price <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 font-medium">₹</span>
                  <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="499" required className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Original Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 font-medium">₹</span>
                  <input type="number" value={form.oldPrice} onChange={(e) => update("oldPrice", e.target.value)} placeholder="599" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <p className="text-xs text-gray-500 mt-1">For showing discount</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
                <input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="100" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Weight / Size</label>
              <input value={form.weight} onChange={(e) => update("weight", e.target.value)} placeholder="e.g. 250g, 500ml, 1kg" className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Product Image</h2>
            <label className="block">
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50/30 transition-colors flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-0.5">PNG, JPG · Max 5MB</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {imagePreview && (
              <button type="button" onClick={() => setImagePreview(null)} className="mt-3 w-full text-xs text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium">Remove image</button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Publish</h2>
            <div className="space-y-2">
              <button onClick={(e) => handleSubmit(e, "Active")} disabled={saving || !form.name || !form.price || !form.stock} className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-700/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                {saving ? "Publishing..." : "Publish Product"}
              </button>
              <button onClick={(e) => handleSubmit(e, "Draft")} disabled={saving} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                Save as Draft
              </button>
              <Link to="/vendor/products" className="block text-center w-full text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
