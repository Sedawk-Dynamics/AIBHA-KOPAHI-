import { useEffect, useState } from "react";
import DashboardShell, { PageHeader } from "../../components/DashboardShell";
import {
  listPendingProducts,
  approveProduct,
  rejectProduct,
} from "../../lib/resources/products";
import type { ApiProduct } from "../../lib/types";
import { ApiError } from "../../lib/api";

export default function AdminApprovals() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    listPendingProducts()
      .then((res) => {
        setProducts(res.products);
        setCount(res.count);
      })
      .catch((err: unknown) =>
        setError(
          err instanceof ApiError ? err.message : "Could not load pending products"
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (p: ApiProduct) => {
    setBusyId(p.id);
    try {
      await approveProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      setCount((c) => Math.max(0, c - 1));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Approval failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    const reason = rejectReason.trim();
    if (!reason) {
      setError("A rejection reason is required.");
      return;
    }
    setBusyId(rejectingId);
    try {
      await rejectProduct(rejectingId, reason);
      setProducts((prev) => prev.filter((x) => x.id !== rejectingId));
      setCount((c) => Math.max(0, c - 1));
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Rejection failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Product Approvals"
        desc={
          loading
            ? "Loading pending products..."
            : count === 0
            ? "No products waiting for review."
            : `${count} ${count === 1 ? "product" : "products"} awaiting your review.`
        }
        breadcrumbs={[
          { label: "Dashboard", to: "/admin" },
          { label: "Approvals" },
        ]}
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16 text-sm text-gray-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">
              All caught up. No products in the queue.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Vendor</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Submitted</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const vendorLabel =
                    p.vendor?.businessName ?? p.vendor?.name ?? "—";
                  const submittedAt = new Date(p.createdAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                  );
                  const isBusy = busyId === p.id;
                  return (
                    <tr
                      key={p.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{vendorLabel}</td>
                      <td className="px-6 py-4 text-gray-700">{p.category ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-700">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{submittedAt}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleApprove(p)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-60"
                        >
                          {isBusy ? "..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(p.id);
                            setRejectReason("");
                          }}
                          disabled={isBusy}
                          className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-red-200 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reject reason modal */}
      {rejectingId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRejectingId(null);
              setRejectReason("");
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Reject product
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              The vendor will see this reason on their dashboard.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., images don't match the product description"
              rows={4}
              className="mt-4 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 resize-none"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={busyId === rejectingId || !rejectReason.trim()}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60"
              >
                {busyId === rejectingId ? "Rejecting..." : "Confirm reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
