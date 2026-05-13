"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EditorialShell from "../components/dashboard/EditorialShell";
import { DashCard } from "../components/dashboard/DashPrimitives";
import { useAuth } from "../context/AuthContext";
import { api, API_URL, ApiError, tokenStore } from "../lib/api";
import { CATEGORIES } from "../lib/marketing";

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

  const update =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
      setSuccess("Product submitted for review.");
      setForm(empty);
      setFile(null);
      setImageUrl("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EditorialShell
      eyebrow={`→ ${user?.role === "admin" ? "Admin · " : ""}Add product`}
      title={
        <>
          A new origin, <span className="accent-italic">considered.</span>
        </>
      }
      actions={
        <Link
          href="/dashboard/products"
          className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold) py-2"
        >
          ← Back to products
        </Link>
      }
    >
      {error && (
        <div role="alert" className="mb-8 border border-(--color-chilli)/30 bg-(--color-chilli)/10 px-5 py-4 text-sm text-(--color-chilli)">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="mb-8 border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-4 text-sm text-(--color-moss)">
          {success} {user?.role !== "admin" && "An editor will review and publish within a working day."}
        </div>
      )}

      <p className="mb-10 font-display italic text-(--color-bamboo) text-lg max-w-2xl">
        Tell us what it is, where it comes from, and how to find it. Listings stay in <span className="text-(--color-moss)">draft</span> until an editor approves them.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ============== BASICS ============== */}
        <DashCard title="01 · Basics">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field id="name" label="Product name" className="sm:col-span-2">
              <input
                id="name"
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. GI Lakadong Turmeric Powder"
                className="kp-input"
              />
            </Field>
            <Field id="category" label="Category">
              <select id="category" value={form.category} onChange={update("category")} className="kp-input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field id="brand" label="Brand">
              <input id="brand" value={form.brand} onChange={update("brand")} className="kp-input" />
            </Field>
            <Field id="description" label="Editorial description" className="sm:col-span-2">
              <textarea
                id="description"
                value={form.description}
                onChange={update("description")}
                rows={5}
                placeholder="One paragraph. What it is, where it grows, why it matters. Avoid 'world-class' or 'best-in-class'."
                className="kp-input resize-none"
              />
            </Field>
          </div>
        </DashCard>

        {/* ============== PRICING & STOCK ============== */}
        <DashCard title="02 · Pricing & Stock">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field id="price" label="Selling price (₹)">
              <input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={update("price")}
                placeholder="349"
                className="kp-input"
              />
            </Field>
            <Field id="originalPrice" label="MRP (optional)">
              <input
                id="originalPrice"
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={update("originalPrice")}
                placeholder="449"
                className="kp-input"
              />
            </Field>
            <Field id="stock" label="Stock on hand">
              <input
                id="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={update("stock")}
                className="kp-input"
              />
            </Field>
          </div>

          <label className="mt-6 flex items-center gap-3 cursor-pointer select-none">
            <span
              className={`inline-block h-4 w-4 border shrink-0 ${
                form.featured ? "bg-(--color-gold) border-(--color-gold)" : "border-(--color-bamboo)/40"
              }`}
              aria-hidden="true"
            />
            <input
              type="checkbox"
              checked={form.featured}
              onChange={update("featured")}
              className="sr-only"
            />
            <span className="text-sm text-(--color-ink)/80">
              Submit for homepage featured row (subject to editor approval)
            </span>
          </label>
        </DashCard>

        {/* ============== MEDIA ============== */}
        <DashCard title="03 · Hero photograph">
          <div className="border border-dashed border-(--color-bamboo)/40 hover:border-(--color-gold) transition-colors p-6 flex flex-col sm:flex-row items-start gap-5">
            {imageUrl ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-(--color-ivory) border border-(--color-bamboo)/30">
                <Image src={imageUrl} alt="Preview" fill sizes="96px" className="object-cover" />
              </div>
            ) : (
              <div className="h-24 w-24 shrink-0 flex items-center justify-center bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-bamboo)/60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 4h18v16H3z" stroke="currentColor" strokeWidth="1.25" />
                  <circle cx="8.5" cy="9" r="1.5" fill="currentColor" />
                  <path d="M3 17l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="eyebrow">Upload an image</p>
              <p className="mt-2 text-sm text-(--color-ink)/65 leading-relaxed">
                JPG, PNG or WebP. Up to 5&nbsp;MB. Square or vertical works best.
              </p>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-(--color-bamboo)/40 text-(--color-ink) text-[12px] uppercase tracking-[0.22em] cursor-pointer hover:border-(--color-gold) transition-colors">
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </label>
                {file && (
                  <span className="text-xs italic text-(--color-bamboo) truncate max-w-[14rem]">
                    {file.name}
                  </span>
                )}
                <button
                  type="button"
                  disabled={!file || uploading}
                  onClick={uploadImage}
                  className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-(--color-moss) text-(--color-ivory) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
              {imageUrl && (
                <p className="mt-3 text-xs italic text-(--color-bamboo) break-all">
                  Saved to {imageUrl.replace(API_URL, "")}
                </p>
              )}
            </div>
          </div>
        </DashCard>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/dashboard/products"
            className="text-[12px] uppercase tracking-[0.22em] text-(--color-bamboo) hover:text-(--color-moss) transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
          >
            {submitting
              ? "Submitting…"
              : user?.role === "admin"
              ? "Publish product"
              : "Submit for review"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      <style jsx>{`
        :global(.kp-input) {
          width: 100%;
          background: transparent;
          border-bottom: 1px solid color-mix(in srgb, var(--color-bamboo) 45%, transparent);
          padding: 0.75rem 0;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.kp-input:focus) {
          border-color: var(--color-gold);
        }
        :global(textarea.kp-input) {
          padding-top: 0.5rem;
        }
      `}</style>
    </EditorialShell>
  );
}

function Field({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block eyebrow mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
