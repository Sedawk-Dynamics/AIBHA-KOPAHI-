import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { createProduct, uploadProductImage } from "../../lib/resources/products";
import { ApiError } from "../../lib/api";

const CATEGORIES = ["Tea", "Honey", "Rice", "Spices", "Others"] as const;

export default function VendorProductNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    category: "Tea",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    shortDescription: "",
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview while we upload.
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");
    try {
      const url = await uploadProductImage(file);
      setImageUrl(url);
    } catch (err) {
      setImagePreview(null);
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    publishStatus: "Draft" | "Active"
  ) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Selling price must be greater than 0.");
      return;
    }
    if (!form.stock) {
      setError("Stock quantity is required.");
      return;
    }

    setSaving(true);
    try {
      await createProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
        stock: Number(form.stock),
        description: form.description,
        shortDescription:
          form.shortDescription || form.description.slice(0, 80),
        images: imageUrl ? [imageUrl] : [],
        isActive: publishStatus === "Active",
      });
      navigate("/vendor/products");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not create product"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell
      role="Vendor"
      userName={user?.businessName || user?.name}
      userEmail={user?.email}
    >
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

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Assam Tea Premium 250g" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 cursor-pointer">
                  {CATEGORIES.map((c) => (<option key={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Short Description</label>
                <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} maxLength={120} placeholder="One-line tagline shown on product cards" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
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
                  <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="499" required min="0" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Original Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 font-medium">₹</span>
                  <input type="number" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} placeholder="599" min="0" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <p className="text-xs text-gray-500 mt-1">For showing discount</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
                <input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="100" required min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
              </div>
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
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading || saving} className="hidden" />
            </label>
            {uploading && <p className="text-xs text-gray-500 mt-2 text-center">Uploading...</p>}
            {imagePreview && !uploading && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageUrl(null);
                }}
                className="mt-3 w-full text-xs text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium"
              >
                Remove image
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Publish</h2>
            <div className="space-y-2">
              <button
                onClick={(e) => handleSubmit(e, "Active")}
                disabled={saving || uploading || !form.name || !form.price || !form.stock}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-700/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                {saving ? "Publishing..." : "Publish Product"}
              </button>
              <button
                onClick={(e) => handleSubmit(e, "Draft")}
                disabled={saving || uploading || !form.name}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
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
