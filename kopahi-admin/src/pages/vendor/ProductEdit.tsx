import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import {
  getProduct,
  updateProduct,
  uploadProductImage,
} from "../../lib/resources/products";
import { ApiError } from "../../lib/api";
import type { ApiProduct } from "../../lib/types";

const CATEGORIES = ["Tea", "Honey", "Rice", "Spices", "Others"] as const;

type FormState = {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  shortDescription: string;
  isActive: boolean;
};

const fromProduct = (p: ApiProduct): FormState => ({
  name: p.name,
  category: p.category ?? "Tea",
  price: String(p.price),
  originalPrice: p.originalPrice ? String(p.originalPrice) : "",
  stock: String(p.stock),
  description: p.description ?? "",
  shortDescription: p.shortDescription ?? "",
  isActive: p.isActive,
});

export default function VendorProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getProduct(id)
      .then((p) => {
        setForm(fromProduct(p));
        setImages(p.images ?? []);
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load product")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const update = (k: keyof FormState, v: string | boolean) =>
    setForm((cur) => (cur ? { ...cur, [k]: v } : cur));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      if (url) setImages((cur) => [...cur, url]);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages((cur) => cur.filter((i) => i !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(id, {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
        stock: Number(form.stock) || 0,
        description: form.description,
        shortDescription: form.shortDescription,
        images,
        isActive: form.isActive,
      });
      navigate("/vendor/products");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Could not save product");
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
          <span className="text-gray-900 font-medium">Edit</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Edit Product</h1>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
      ) : !form ? (
        <p className="text-sm text-gray-500">Product not found.</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Basic Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 cursor-pointer">
                    {CATEGORIES.map((c) => (<option key={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Short Description</label>
                  <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} maxLength={120} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 resize-none" />
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
                    <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required min="0" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Original Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 font-medium">₹</span>
                    <input type="number" value={form.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} min="0" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Stock <span className="text-red-500">*</span></label>
                  <input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} min="0" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {images.map((url) => (
                  <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
              <label className="block">
                <div className="rounded-xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50/30 transition-colors flex items-center justify-center cursor-pointer p-6 text-center">
                  <p className="text-sm font-medium text-gray-700">{uploading ? "Uploading..." : "Click to add image"}</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="w-4 h-4 text-green-700 focus:ring-green-600" />
                <span className="text-sm text-gray-700">Active (visible to customers)</span>
              </label>
              <div className="space-y-2">
                <button type="submit" disabled={saving} className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-700/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <Link to="/vendor/products" className="block text-center w-full text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</Link>
              </div>
            </div>
          </div>
        </form>
      )}
    </DashboardShell>
  );
}
