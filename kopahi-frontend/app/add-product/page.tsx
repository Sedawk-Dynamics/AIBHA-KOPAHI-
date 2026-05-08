"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api, API_URL, ApiError, tokenStore } from "../lib/api";

type Form = {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  brand: string;
  featured: boolean;
};

const empty: Form = {
  name: "",
  category: "Tea",
  price: "",
  originalPrice: "",
  stock: "1",
  description: "",
  brand: "Kopahi",
  featured: false,
};

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState<Form>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login?next=/add-product");
    else if (user.role !== "admin" && user.role !== "vendor") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val =
      e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val } as Form));
  };

  const uploadImage = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = tokenStore.get();
      const res = await fetch(`${API_URL}/api/products/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Upload failed");
      const url = data.image || data.url;
      setImageUrl(url.startsWith("http") ? url : `${API_URL}${url}`);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.description || !form.price) {
      setError("Name, description and price are required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(
        "/api/products",
        {
          name: form.name,
          category: form.category,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
          stock: Number(form.stock || 0),
          description: form.description,
          brand: form.brand,
          featured: form.featured,
          images: imageUrl ? [imageUrl] : [],
        },
        { auth: true }
      );
      setSuccess("Product added successfully.");
      setForm(empty);
      setFile(null);
      setImageUrl("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return <main className="min-h-screen flex items-center justify-center text-gray-500">Loading…</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Add New Product</h1>
            <p className="text-gray-500 mt-1">Listed by {user.name} · {user.role}</p>
          </div>
          <Link href={user.role === "admin" ? "/admin/products" : "/vendor/products"} className="text-sm text-green-700 hover:underline">
            ← Back to products
          </Link>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <input value={form.name} onChange={update("name")} type="text" placeholder="Product Name" className="border p-4 rounded-lg md:col-span-2" />

          <select value={form.category} onChange={update("category")} className="border p-4 rounded-lg">
            <option>Tea</option>
            <option>Honey</option>
            <option>Spices</option>
            <option>Rice</option>
            <option>Other</option>
          </select>

          <input value={form.brand} onChange={update("brand")} type="text" placeholder="Brand" className="border p-4 rounded-lg" />
          <input value={form.price} onChange={update("price")} type="number" min="0" placeholder="Price (₹)" className="border p-4 rounded-lg" />
          <input value={form.originalPrice} onChange={update("originalPrice")} type="number" min="0" placeholder="Original Price (optional)" className="border p-4 rounded-lg" />
          <input value={form.stock} onChange={update("stock")} type="number" min="0" placeholder="Stock Quantity" className="border p-4 rounded-lg md:col-span-2" />

          <textarea value={form.description} onChange={update("description")} placeholder="Product Description" rows={5} className="border p-4 rounded-lg md:col-span-2" />

          <label className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={update("featured")} />
            <span className="text-sm">Mark as featured</span>
          </label>

          <div className="md:col-span-2 border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
              <button
                type="button"
                disabled={!file || uploading}
                onClick={uploadImage}
                className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </div>
            {imageUrl && (
              <div className="flex items-center gap-3">
                <img src={imageUrl} alt="preview" className="w-16 h-16 object-cover rounded-lg border" />
                <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
              </div>
            )}
            <p className="text-xs text-gray-500">Image is optional. JPG/PNG/WebP up to 5 MB.</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 mt-2 w-full bg-green-700 text-white py-4 rounded-lg hover:bg-green-800 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Upload Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
