import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { listVendorReviews } from "../../lib/resources/reviews";
import type { VendorReview } from "../../lib/resources/reviews";
import { ApiError } from "../../lib/api";

const formatRelative = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const day = 1000 * 60 * 60 * 24;
  if (diffMs < day) return "today";
  if (diffMs < 2 * day) return "yesterday";
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)} days ago`;
  if (diffMs < 30 * day) return `${Math.floor(diffMs / (7 * day))} weeks ago`;
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const Stars = ({ value }: { value: number }) => (
  <div className="inline-flex gap-0.5 text-amber-500">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} viewBox="0 0 20 20" className="w-3.5 h-3.5">
        <path
          fill={n <= value ? "currentColor" : "#e5e7eb"}
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.045 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"
        />
      </svg>
    ))}
  </div>
);

export default function VendorReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<VendorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | "5" | "4" | "3" | "2" | "1">("All");

  useEffect(() => {
    setLoading(true);
    setError("");
    listVendorReviews()
      .then(setReviews)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load reviews")
      )
      .finally(() => setLoading(false));
  }, []);

  const totalReviews = reviews.length;
  const avgRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / totalReviews;
  }, [reviews, totalReviews]);

  const ratingCounts = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        return {
          star,
          count,
          percent: totalReviews ? (count / totalReviews) * 100 : 0,
        };
      }),
    [reviews, totalReviews]
  );

  const filtered = useMemo(() => {
    if (filter === "All") return reviews;
    const n = Number(filter);
    return reviews.filter((r) => r.rating === n);
  }, [reviews, filter]);

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
          <span className="text-gray-900 font-medium">Reviews</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Customer Reviews</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {loading ? "Loading…" : `${totalReviews} review${totalReviews === 1 ? "" : "s"} across your products`}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center md:text-left md:border-r border-gray-100 md:pr-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Average Rating</p>
            <div className="flex items-baseline gap-2 justify-center md:justify-start mb-2">
              <p className="text-5xl font-bold text-gray-900 tracking-tight">
                {totalReviews > 0 ? avgRating.toFixed(1) : "—"}
              </p>
              <p className="text-lg text-gray-500">/ 5</p>
            </div>
            <Stars value={Math.round(avgRating)} />
            <p className="text-xs text-gray-500 mt-2">From {totalReviews} reviews</p>
          </div>

          <div className="space-y-2">
            {ratingCounts.map((r) => (
              <div key={r.star} className="flex items-center gap-3 text-sm">
                <span className="w-6 font-medium text-gray-700">{r.star}★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-500">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-2 flex-wrap">
          {(["All", "5", "4", "3", "2", "1"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f
                  ? "bg-green-700 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f === "All" ? "All" : `${f}★`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            {reviews.length === 0
              ? "No reviews yet — customers will leave them after purchase."
              : "No reviews match this filter."}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <li key={r._id} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.user?.name ?? "Anonymous"}</p>
                    <p className="text-xs text-gray-500">on {r.product?.name ?? "Unknown product"}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Stars value={r.rating} />
                    <span className="text-xs text-gray-400">{formatRelative(r.createdAt)}</span>
                  </div>
                </div>
                {r.title && (
                  <p className="text-sm font-medium text-gray-900 mb-1">{r.title}</p>
                )}
                {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}
