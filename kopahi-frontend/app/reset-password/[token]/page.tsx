"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "../../lib/api";

const policy = (pw: string): string | null => {
  if (pw.length < 12) return "Password must be at least 12 characters";
  if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter";
  if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(pw)) return "Password must contain a digit";
  if (!/[^a-zA-Z0-9]/.test(pw)) return "Password must contain a symbol";
  return null;
};

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const { token } = use(params);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const reason = policy(password);
    if (reason) {
      setStatus("error");
      setMessage(reason);
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }
    setStatus("loading");
    try {
      await api.post("/api/auth/reset-password", { token, password });
      setStatus("ok");
      setMessage("Password reset. Redirecting to login…");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof ApiError ? err.message : "Could not reset password. Try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-bold text-green-700 tracking-tight">
            Kopahi<span className="text-green-500">.</span>
          </span>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-3">Choose a new password</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Must be 12+ characters with uppercase, lowercase, digit, and symbol.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New password</label>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm password</label>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              autoComplete="new-password"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
            <input
              type="checkbox"
              checked={show}
              onChange={(e) => setShow(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
            />
            Show password
          </label>

          <button
            type="submit"
            disabled={status === "loading" || status === "ok"}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all disabled:opacity-70"
          >
            {status === "loading" ? "Resetting…" : status === "ok" ? "Done" : "Reset password"}
          </button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm text-center ${
                status === "error" ? "text-red-600" : "text-green-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          <Link href="/login" className="text-green-700 font-semibold hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
