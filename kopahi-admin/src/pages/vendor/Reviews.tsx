// TODO: This page currently displays mock data. Wire to real APIs in a future task.
import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";

const reviews = [
  { id: 1, customer: "Rahul Sharma", product: "Assam Tea Premium 250g", rating: 5, comment: "Excellent tea! Truly authentic taste, just like my grandmother's garden. Will buy again.", date: "2 days ago", replied: false },
  { id: 2, customer: "Meera Iyer", product: "Assam Tea Gift Pack", rating: 5, comment: "Beautiful packaging and the tea quality is unmatched. Sent it to my mother as a gift.", date: "5 days ago", replied: true },
  { id: 3, customer: "Vikram Singh", product: "Green Tea 500g", rating: 4, comment: "Good quality green tea, fresh aroma. Could be slightly less strong for my taste.", date: "1 week ago", replied: true },
  { id: 4, customer: "Anjali Roy", product: "Masala Chai Blend", rating: 5, comment: "The masala blend is perfect — not too spicy, perfectly balanced. Best chai I've had in years.", date: "1 week ago", replied: false },
  { id: 5, customer: "Rohan Kapoor", product: "White Tea Reserve", rating: 4, comment: "Premium white tea with a delicate flavor. Worth the price for special occasions.", date: "2 weeks ago", replied: false },
];

export default function VendorReviews() {
  const [filter, setFilter] = useState("All");

  const totalReviews = reviews.length;
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: (reviews.filter((r) => r.rating === star).length / totalReviews) * 100,
  }));

  const filtered =
    filter === "All"
      ? reviews
      : filter === "Unanswered"
      ? reviews.filter((r) => !r.replied)
      : reviews.filter((r) => r.rating === Number(filter));

  return (
    <DashboardShell role="Vendor" userName="Brahmaputra Tea Co." userEmail="vendor@kopahi.com">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Reviews</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Customer Reviews</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">{totalReviews} reviews · {reviews.filter((r) => !r.replied).length} unanswered</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center md:text-left md:border-r border-gray-100 md:pr-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Average Rating</p>
            <div className="flex items-baseline gap-2 justify-center md:justify-start mb-2">
              <p className="text-5xl font-bold text-gray-900 tracking-tight">{avgRating}</p>
              <p className="text-lg text-gray-500">/ 5</p>
            </div>
            <div className="flex justify-center md:justify-start gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className={`w-5 h-5 ${s <= Math.round(Number(avgRating)) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
          </div>

          <div className="space-y-2">
            {ratingCounts.map((r) => (
              <div key={r.star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-3">{r.star}</span>
                <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${r.percent}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {["All", "Unanswered", "5", "4", "3", "2", "1"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {["All", "Unanswered"].includes(f) ? f : `${f} ★`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-sm text-gray-500">No reviews match this filter.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900">{r.customer}</p>
                      <p className="text-xs text-gray-500">{r.product} · {r.date}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className={`w-4 h-4 ${s <= r.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{r.comment}</p>
              <div className="flex items-center justify-between">
                {r.replied ? (
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Replied
                  </span>
                ) : (
                  <button className="text-sm font-medium text-green-700 hover:text-green-800">Reply →</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
